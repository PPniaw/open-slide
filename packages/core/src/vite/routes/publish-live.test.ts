import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import type { ApiContext } from './context.ts';
import {
  currentLiveRoom,
  DEFAULT_LIVE_SERVER,
  deckUsesLive,
  ensureLiveRoom,
  liveServer,
  readLiveSettings,
} from './publish-live.ts';

async function makeCtx(liveServerUrl?: string): Promise<ApiContext> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'open-slide-live-'));
  const slidesRoot = path.join(root, 'slides');
  await fs.mkdir(slidesRoot);
  return {
    userCwd: root,
    slidesDir: 'slides',
    slidesRoot,
    globalAssetsRoot: path.join(root, 'assets'),
    manifestPath: path.join(slidesRoot, '.folders.json'),
    coreVersion: '0.0.0',
    agentEnabled: false,
    liveServer: liveServerUrl,
  };
}

describe('publish live helpers', () => {
  const envBefore = process.env.OPEN_SLIDE_LIVE_SERVER;
  afterEach(() => {
    if (envBefore === undefined) delete process.env.OPEN_SLIDE_LIVE_SERVER;
    else process.env.OPEN_SLIDE_LIVE_SERVER = envBefore;
  });

  it('detects decks that import the live kit anywhere in their folder', async () => {
    const ctx = await makeCtx();
    await fs.mkdir(path.join(ctx.slidesRoot, 'plain'));
    await fs.writeFile(
      path.join(ctx.slidesRoot, 'plain', 'index.tsx'),
      "import '@open-slide/core';",
    );
    await fs.mkdir(path.join(ctx.slidesRoot, 'live', 'parts'), { recursive: true });
    await fs.writeFile(path.join(ctx.slidesRoot, 'live', 'index.tsx'), "import './parts/qa';");
    await fs.writeFile(
      path.join(ctx.slidesRoot, 'live', 'parts', 'qa.tsx'),
      "import { LiveQA } from '@open-slide/core/live';",
    );
    await expect(deckUsesLive(ctx, 'plain')).resolves.toBe(false);
    await expect(deckUsesLive(ctx, 'live')).resolves.toBe(true);
    await expect(deckUsesLive(ctx, 'missing')).resolves.toBe(false);
  });

  it('prefers the env override for the live server and trims slashes', async () => {
    const ctx = await makeCtx('https://live.example.com/');
    delete process.env.OPEN_SLIDE_LIVE_SERVER;
    expect(liveServer(ctx)).toBe('https://live.example.com');
    process.env.OPEN_SLIDE_LIVE_SERVER = 'http://127.0.0.1:8787';
    expect(liveServer(ctx)).toBe('http://127.0.0.1:8787');
  });

  it('falls back to the workshop service unless config turns it off', async () => {
    delete process.env.OPEN_SLIDE_LIVE_SERVER;
    expect(liveServer(await makeCtx())).toBe(DEFAULT_LIVE_SERVER);
    expect(liveServer(await makeCtx(''))).toBeNull();
  });

  it('ignores a stored room that belongs to another server', async () => {
    delete process.env.OPEN_SLIDE_LIVE_SERVER;
    const ctx = await makeCtx('https://live.example.com');
    await fs.writeFile(
      path.join(ctx.slidesRoot, '.live-rooms.json'),
      JSON.stringify({ deck: { server: 'http://127.0.0.1:8787', roomId: 'abc234' } }),
    );
    await expect(currentLiveRoom(ctx, 'deck')).resolves.toBeNull();
    process.env.OPEN_SLIDE_LIVE_SERVER = 'http://127.0.0.1:8787';
    await expect(currentLiveRoom(ctx, 'deck')).resolves.toMatchObject({ roomId: 'abc234' });
  });

  it('asks for a server, then a workshop code, before opening a room', async () => {
    delete process.env.OPEN_SLIDE_LIVE_SERVER;
    const noServer = await makeCtx('');
    await expect(ensureLiveRoom(noServer, 'deck')).rejects.toThrow('live.server');
    const ctx = await makeCtx('https://live.example.com');
    await expect(readLiveSettings(ctx)).resolves.toBeNull();
    await expect(ensureLiveRoom(ctx, 'deck')).rejects.toThrow('工作坊代碼');
  });
});
