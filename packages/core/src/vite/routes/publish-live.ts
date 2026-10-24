import { mkdir, readdir, readFile, realpath, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import type { ApiContext } from './context.ts';

// Live rooms for the publish button. Publishing with "live interaction" on (or
// a deck that imports `@open-slide/core/live`) opens one room on the shared
// live service; the room and its admin key are reused on every later publish.
// Turning the switch off or unpublishing closes the room on the service, and
// the next live publish reopens it.
//
// Admin keys live outside the project, in ~/.slidez/live-rooms.json keyed by
// project folder, so zipping or pushing a project never hands them out.
// (Older versions kept them in slides/.live-rooms.json; that file is migrated.)

export type LiveRoomRecord = {
  server: string;
  roomId: string;
  adminKey: string;
  joinUrl: string;
  createdAt: string;
  /** Whether the deck is currently published with live interaction on. */
  enabled?: boolean;
};

const LIVE_IMPORT = '@open-slide/core/live';
const SOURCE_RE = /\.(tsx|ts|jsx|js|mdx)$/;
const SERVER_TIMEOUT_MS = 15_000;

// The workshop's shared service, so students never configure it. Set
// `live: { server: '' }` in open-slide.config to turn live rooms off.
export const DEFAULT_LIVE_SERVER = 'https://live.pik-singular.com';

export function liveServer(ctx: ApiContext): string | null {
  const server = process.env.OPEN_SLIDE_LIVE_SERVER || (ctx.liveServer ?? DEFAULT_LIVE_SERVER);
  return server ? server.replace(/\/+$/, '') : null;
}

type Store = Record<string, Record<string, LiveRoomRecord>>;

function storePath(): string {
  const home = process.env.OPEN_SLIDE_LIVE_HOME || path.join(os.homedir(), '.slidez');
  return path.join(home, 'live-rooms.json');
}

const legacyPath = (ctx: ApiContext) => path.join(ctx.slidesRoot, '.live-rooms.json');

async function projectKey(ctx: ApiContext): Promise<string> {
  return realpath(ctx.userCwd).catch(() => path.resolve(ctx.userCwd));
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(file, 'utf8')) as T;
  } catch {
    return fallback;
  }
}

async function writeStore(store: Store): Promise<void> {
  const file = storePath();
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(store, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 });
}

export async function readLiveRooms(ctx: ApiContext): Promise<Record<string, LiveRoomRecord>> {
  const store = await readJson<Store>(storePath(), {});
  const key = await projectKey(ctx);
  const legacy = await readJson<Record<string, LiveRoomRecord> | null>(legacyPath(ctx), null);
  if (legacy) {
    store[key] = { ...legacy, ...store[key] };
    await writeStore(store);
    await rm(legacyPath(ctx), { force: true });
  }
  return store[key] ?? {};
}

async function saveLiveRoom(ctx: ApiContext, slideId: string, room: LiveRoomRecord): Promise<void> {
  await readLiveRooms(ctx);
  const store = await readJson<Store>(storePath(), {});
  const key = await projectKey(ctx);
  store[key] = { ...store[key], [slideId]: room };
  await writeStore(store);
}

/** The deck's room on the current server; rooms from another server don't count. */
export async function currentLiveRoom(
  ctx: ApiContext,
  slideId: string,
): Promise<LiveRoomRecord | null> {
  const room = (await readLiveRooms(ctx))[slideId];
  return room && room.server === liveServer(ctx) ? room : null;
}

/** True when any source file in the deck imports the live kit. */
export async function deckUsesLive(ctx: ApiContext, slideId: string): Promise<boolean> {
  const root = path.join(ctx.slidesRoot, slideId);
  let entries: string[];
  try {
    entries = await readdir(root, { recursive: true });
  } catch {
    return false;
  }
  for (const rel of entries) {
    if (!SOURCE_RE.test(rel) || rel.includes('node_modules')) continue;
    const text = await readFile(path.join(root, rel), 'utf8').catch(() => '');
    if (text.includes(LIVE_IMPORT)) return true;
  }
  return false;
}

// The title inside `export const meta = { title: … }`; page code often has
// other `title:` keys (cards, steps) before it.
export async function deckTitle(ctx: ApiContext, slideId: string): Promise<string> {
  for (const name of ['index.tsx', 'index.jsx', 'index.ts', 'index.js']) {
    const text = await readFile(path.join(ctx.slidesRoot, slideId, name), 'utf8').catch(() => '');
    const meta = text.match(/export\s+const\s+meta\b[^=]*=\s*\{([\s\S]*?)\}/)?.[1] ?? '';
    const title = meta.match(/\btitle\s*:\s*(['"`])(.+?)\1/)?.[2];
    if (title) return title;
  }
  return slideId;
}

async function callServer<T>(
  server: string,
  route: string,
  init: { body?: unknown; key?: string },
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${server}${route}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(init.key ? { authorization: `Bearer ${init.key}` } : {}),
      },
      body: JSON.stringify(init.body ?? {}),
      signal: AbortSignal.timeout(SERVER_TIMEOUT_MS),
    });
  } catch {
    throw new Error(`連不上互動服務（${server}），請確認網路後再試一次。`);
  }
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(data.error ?? `互動服務回應 ${res.status}。`);
  return data;
}

/** The deck's room on the current live server, opening one if needed. */
export async function ensureLiveRoom(
  ctx: ApiContext,
  slideId: string,
  owner: string,
): Promise<LiveRoomRecord> {
  const server = liveServer(ctx);
  if (!server) throw new Error('還沒設定互動服務網址（open-slide.config.ts 的 live.server）。');
  const existing = await currentLiveRoom(ctx, slideId);
  if (existing) return existing;

  const created = await callServer<{ roomId: string; adminKey: string; joinUrl: string }>(
    server,
    '/api/rooms',
    { body: { owner, title: await deckTitle(ctx, slideId), deck: slideId } },
  );
  const room: LiveRoomRecord = {
    server,
    roomId: created.roomId,
    adminKey: created.adminKey,
    joinUrl: created.joinUrl,
    createdAt: new Date().toISOString(),
  };
  await saveLiveRoom(ctx, slideId, room);
  return room;
}

/** Open or close the deck's room on the service (audience can't join a closed one). */
export async function setLiveOpen(ctx: ApiContext, slideId: string, open: boolean): Promise<void> {
  const room = await currentLiveRoom(ctx, slideId);
  if (!room) return;
  // Reopening also refreshes the title the audience page shows.
  await callServer(room.server, `/api/rooms/${room.roomId}/open`, {
    body: open ? { open, title: await deckTitle(ctx, slideId) } : { open },
    key: room.adminKey,
  });
}

/** Record whether the deck is published with live interaction on. */
export async function setLiveEnabled(
  ctx: ApiContext,
  slideId: string,
  enabled: boolean,
): Promise<void> {
  const room = await currentLiveRoom(ctx, slideId);
  if (room && Boolean(room.enabled) !== enabled) {
    await saveLiveRoom(ctx, slideId, { ...room, enabled });
  }
}
