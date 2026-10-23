import { spawn } from 'node:child_process';
import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { ViteDevServer } from 'vite';
import { PUBLISHED_LABEL, resolveProjectName } from '../../cli/publish-names.ts';
import { isLoopbackRequest, validateMutationRequest } from '../../http/request-guard.ts';
import { type ApiContext, json, readBody } from './context.ts';
import {
  currentLiveRoom,
  deckUsesLive,
  ensureLiveRoom,
  liveServer,
  readLiveSettings,
  resetLiveKey,
  saveLiveSettings,
} from './publish-live.ts';

// GET  /__publish/status?slideId=  → { vercel: { installed, loggedIn, user }, record }
// POST /__publish            { slideId }  → runs `open-slide publish <slideId>`, returns { record }
// POST /__publish/unpublish  { slideId }  → deletes the Vercel project, returns { ok }
// GET  /__publish/live?slideId=           → { server, roomId } for the live blocks in dev
// POST /__publish/live-setup { slideId, cohort, owner } → saves the workshop code
// POST /__publish/live-reset { slideId }   → new admin link for the deck's live room
//
// The workshop fork's toolbar button drives these so nobody has to open a
// terminal. Deploys reuse the machine's Vercel CLI login.

const SLIDE_ID_RE = /^[a-z0-9_-]+$/i;
const PUBLISH_TIMEOUT_MS = 6 * 60 * 1000;
const STATUS_TIMEOUT_MS = 20_000;

export type PublishRecord = { project: string; url: string; publishedAt: string };
type Records = Record<string, PublishRecord>;
type RunResult = { code: number; output: string };

// The dev server runs with NODE_ENV=development, and a child build that
// inherits it ships the editor UI (Agent, design, edit) to the public site.
function childEnv(): NodeJS.ProcessEnv {
  const { NODE_ENV: _devMode, ...env } = process.env;
  return env;
}

function run(
  cmd: string,
  args: string[],
  cwd: string,
  timeoutMs: number,
  input?: string,
): Promise<RunResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd,
      env: childEnv(),
      stdio: [input === undefined ? 'ignore' : 'pipe', 'pipe', 'pipe'],
      shell: process.platform === 'win32',
      windowsHide: true,
    });
    if (input !== undefined) child.stdin?.end(input);
    let output = '';
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error(`${cmd} ${args[0] ?? ''} 超過時間仍未完成。`));
    }, timeoutMs);
    child.stdout?.on('data', (c: Buffer) => {
      output += c.toString('utf8');
    });
    child.stderr?.on('data', (c: Buffer) => {
      output += c.toString('utf8');
    });
    child.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ code: code ?? 1, output });
    });
  });
}

export function parsePublishedUrl(output: string): string | null {
  const escaped = PUBLISHED_LABEL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return output.match(new RegExp(`${escaped}(https?://\\S+)`))?.[1] ?? null;
}

function recordsPath(ctx: ApiContext): string {
  return path.join(ctx.slidesRoot, '.published.json');
}

async function readRecords(ctx: ApiContext): Promise<Records> {
  try {
    return JSON.parse(await readFile(recordsPath(ctx), 'utf8')) as Records;
  } catch {
    return {};
  }
}

async function writeRecords(ctx: ApiContext, records: Records): Promise<void> {
  await writeFile(recordsPath(ctx), `${JSON.stringify(records, null, 2)}\n`, 'utf8');
}

async function vercelStatus(cwd: string) {
  try {
    const r = await run('vercel', ['whoami'], cwd, STATUS_TIMEOUT_MS);
    const user = r.output.trim().split('\n').filter(Boolean).at(-1) ?? null;
    return { installed: true, loggedIn: r.code === 0, user: r.code === 0 ? user : null };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return { installed: false, loggedIn: false, user: null };
    }
    return { installed: true, loggedIn: false, user: null };
  }
}

function tail(output: string): string {
  return output.trim().split('\n').slice(-12).join('\n');
}

function openSlideBin(cwd: string): string {
  const bin = process.platform === 'win32' ? 'open-slide.cmd' : 'open-slide';
  return path.join(cwd, 'node_modules', '.bin', bin);
}

async function liveStatus(ctx: ApiContext, slideId: string) {
  const room = await currentLiveRoom(ctx, slideId);
  const settings = await readLiveSettings(ctx);
  return {
    uses: SLIDE_ID_RE.test(slideId) && (await deckUsesLive(ctx, slideId)),
    server: liveServer(ctx),
    owner: settings?.owner ?? null,
    cohort: settings?.cohort ?? null,
    room: room ? { roomId: room.roomId, joinUrl: room.joinUrl, adminUrl: room.adminUrl } : null,
  };
}

export function registerPublishRoutes(server: ViteDevServer, ctx: ApiContext): void {
  let inFlight: Promise<unknown> | null = null;

  server.middlewares.use('/__publish', async (req, res, next) => {
    if (!isLoopbackRequest(req)) return json(res, 403, { error: '只能在本機操作發布。' });
    const url = new URL(req.url ?? '/', 'http://local');
    const method = req.method ?? 'GET';

    try {
      if (method === 'GET' && url.pathname === '/status') {
        const slideId = url.searchParams.get('slideId') ?? '';
        const records = await readRecords(ctx);
        res.setHeader('cache-control', 'no-store');
        return json(res, 200, {
          vercel: await vercelStatus(ctx.userCwd),
          record: records[slideId] ?? null,
          live: await liveStatus(ctx, slideId),
          busy: inFlight !== null,
        });
      }

      if (method === 'GET' && url.pathname === '/live') {
        const room = await currentLiveRoom(ctx, url.searchParams.get('slideId') ?? '');
        res.setHeader('cache-control', 'no-store');
        return json(res, 200, room ? { server: room.server, roomId: room.roomId } : {});
      }

      if (method !== 'POST') return next();
      const guard = validateMutationRequest(req, { requireJsonBody: true });
      if (!guard.ok) return json(res, guard.status, { error: guard.error });
      const body = (await readBody(req, 4096)) as {
        slideId?: unknown;
        cohort?: unknown;
        owner?: unknown;
      };
      const slideId = typeof body.slideId === 'string' ? body.slideId : '';
      if (!SLIDE_ID_RE.test(slideId)) return json(res, 400, { error: '簡報 id 不正確。' });
      if (inFlight) return json(res, 409, { error: '已經有一個發布或下架正在進行，請稍等。' });

      if (url.pathname === '/live-setup') {
        const cohort = typeof body.cohort === 'string' ? body.cohort.trim().toUpperCase() : '';
        const owner = typeof body.owner === 'string' ? body.owner.trim().slice(0, 40) : '';
        if (!/^[A-Z0-9]{4,32}$/.test(cohort)) {
          return json(res, 400, { error: '工作坊代碼格式不正確。' });
        }
        await saveLiveSettings(ctx, { cohort, owner });
        return json(res, 200, { live: await liveStatus(ctx, slideId) });
      }

      if (url.pathname === '/live-reset') {
        await resetLiveKey(ctx, slideId);
        return json(res, 200, { live: await liveStatus(ctx, slideId) });
      }

      if (url.pathname === '/' || url.pathname === '') {
        const job = (async () => {
          const project = resolveProjectName([slideId]);
          const args = ['publish', slideId, '--project', project];
          if (await deckUsesLive(ctx, slideId)) {
            const room = await ensureLiveRoom(ctx, slideId);
            args.push('--live-server', room.server, '--live-room', room.roomId);
          }
          const r = await run(openSlideBin(ctx.userCwd), args, ctx.userCwd, PUBLISH_TIMEOUT_MS);
          const published = parsePublishedUrl(r.output);
          if (r.code !== 0 || !published) {
            throw new Error(`發布失敗：\n${tail(r.output)}`);
          }
          const records = await readRecords(ctx);
          const record = { project, url: published, publishedAt: new Date().toISOString() };
          records[slideId] = record;
          await writeRecords(ctx, records);
          return record;
        })();
        inFlight = job.finally(() => {
          inFlight = null;
        });
        return json(res, 200, { record: await job });
      }

      if (url.pathname === '/unpublish') {
        const records = await readRecords(ctx);
        const record = records[slideId];
        if (!record) return json(res, 404, { error: '這份簡報目前沒有上線。' });
        const job = (async () => {
          // `project rm` has no --yes: without an answer on stdin it quits with exit 0
          // and deletes nothing, so answer the prompt and then confirm it is gone.
          const r = await run(
            'vercel',
            ['project', 'rm', record.project],
            ctx.userCwd,
            STATUS_TIMEOUT_MS * 3,
            'y\n',
          );
          const check = await run(
            'vercel',
            ['project', 'inspect', record.project],
            ctx.userCwd,
            STATUS_TIMEOUT_MS,
          );
          if (check.code === 0) {
            throw new Error(`下架失敗：Vercel 專案 ${record.project} 還在。\n${tail(r.output)}`);
          }
          delete records[slideId];
          await writeRecords(ctx, records);
          // Drop the old link too, so a later publish starts a fresh project.
          await rm(
            path.join(ctx.userCwd, 'node_modules', '.open-slide', 'publish', record.project),
            {
              recursive: true,
              force: true,
            },
          );
        })();
        inFlight = job.finally(() => {
          inFlight = null;
        });
        await job;
        return json(res, 200, { ok: true });
      }

      return next();
    } catch (err) {
      json(res, 500, { error: err instanceof Error ? err.message : String(err) });
    }
  });
}
