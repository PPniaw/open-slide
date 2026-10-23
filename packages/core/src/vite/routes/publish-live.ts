import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { ApiContext } from './context.ts';

// Live rooms for the publish button. A deck that imports `@open-slide/core/live`
// gets one room on the shared live service the first time it is published; the
// room (and its admin key) is reused on every later publish.
//
//   slides/.live.json        { cohort, owner }       workshop code + presenter name
//   slides/.live-rooms.json  { [deckId]: room }      includes the admin key; stays local

export type LiveSettings = { cohort: string; owner: string };
export type LiveRoomRecord = {
  server: string;
  roomId: string;
  adminKey: string;
  joinUrl: string;
  adminUrl: string;
  createdAt: string;
};

const LIVE_IMPORT = '@open-slide/core/live';
const SOURCE_RE = /\.(tsx|ts|jsx|js|mdx)$/;
const SERVER_TIMEOUT_MS = 15_000;

export function liveServer(ctx: ApiContext): string | null {
  const server = process.env.OPEN_SLIDE_LIVE_SERVER || ctx.liveServer;
  return server ? server.replace(/\/+$/, '') : null;
}

const settingsPath = (ctx: ApiContext) => path.join(ctx.slidesRoot, '.live.json');
const roomsPath = (ctx: ApiContext) => path.join(ctx.slidesRoot, '.live-rooms.json');

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(file, 'utf8')) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown): Promise<void> {
  await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

export async function readLiveSettings(ctx: ApiContext): Promise<LiveSettings | null> {
  const s = await readJson<Partial<LiveSettings> | null>(settingsPath(ctx), null);
  return s?.cohort ? { cohort: s.cohort, owner: s.owner ?? '' } : null;
}

export async function saveLiveSettings(ctx: ApiContext, settings: LiveSettings): Promise<void> {
  await writeJson(settingsPath(ctx), settings);
}

export async function readLiveRooms(ctx: ApiContext): Promise<Record<string, LiveRoomRecord>> {
  return readJson(roomsPath(ctx), {});
}

async function saveLiveRoom(ctx: ApiContext, slideId: string, room: LiveRoomRecord): Promise<void> {
  const rooms = await readLiveRooms(ctx);
  rooms[slideId] = room;
  await writeJson(roomsPath(ctx), rooms);
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

async function deckTitle(ctx: ApiContext, slideId: string): Promise<string> {
  for (const name of ['index.tsx', 'index.jsx', 'index.ts', 'index.js']) {
    const text = await readFile(path.join(ctx.slidesRoot, slideId, name), 'utf8').catch(() => '');
    const title = text.match(/\btitle\s*:\s*(['"`])(.+?)\1/)?.[2];
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
export async function ensureLiveRoom(ctx: ApiContext, slideId: string): Promise<LiveRoomRecord> {
  const server = liveServer(ctx);
  if (!server) throw new Error('還沒設定互動服務網址（open-slide.config.ts 的 live.server）。');
  const existing = (await readLiveRooms(ctx))[slideId];
  if (existing && existing.server === server) return existing;

  const settings = await readLiveSettings(ctx);
  if (!settings) throw new Error('請先輸入工作坊代碼。');
  const created = await callServer<Omit<LiveRoomRecord, 'server' | 'createdAt'>>(
    server,
    '/api/rooms',
    {
      body: {
        cohort: settings.cohort,
        owner: settings.owner,
        title: await deckTitle(ctx, slideId),
        deck: slideId,
      },
    },
  );
  const room = { ...created, server, createdAt: new Date().toISOString() };
  await saveLiveRoom(ctx, slideId, room);
  return room;
}

/** Swap the deck's admin key; the old admin link stops working at once. */
export async function resetLiveKey(ctx: ApiContext, slideId: string): Promise<LiveRoomRecord> {
  const room = (await readLiveRooms(ctx))[slideId];
  if (!room) throw new Error('這份簡報還沒有互動。');
  const next = await callServer<{ adminKey: string; adminUrl: string }>(
    room.server,
    `/api/rooms/${room.roomId}/reset-key`,
    { key: room.adminKey },
  );
  const updated = { ...room, adminKey: next.adminKey, adminUrl: next.adminUrl };
  await saveLiveRoom(ctx, slideId, updated);
  return updated;
}
