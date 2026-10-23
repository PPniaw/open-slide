import type { ChildProcess } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { expect, test } from '@playwright/test';
import {
  prepareScratchProject,
  runCli,
  startCliServer,
  stopServer,
  waitForHttpOk,
} from './helpers.ts';

const NO_LOCALE_CONFIG = `import type { OpenSlideConfig } from '@open-slide/core';

const openSlideConfig: OpenSlideConfig = {};

export default openSlideConfig;
`;

test.describe('workshop default locale', () => {
  const port = 43123;
  const baseUrl = `http://127.0.0.1:${port}`;
  let server: ChildProcess | undefined;

  test.beforeAll(async () => {
    test.setTimeout(300_000);
    const projectDir = prepareScratchProject('locale-default');
    await fs.writeFile(path.join(projectDir, 'open-slide.config.ts'), NO_LOCALE_CONFIG);
    // A second dev server would overwrite the shared node_modules/.open-slide/server.json
    // that other specs read, so serve a static build instead.
    const res = await runCli(['build'], projectDir);
    expect(res.code, res.stderr).toBe(0);
    server = startCliServer(['preview', '--host', '127.0.0.1', '--port', String(port)], projectDir);
    await waitForHttpOk(`${baseUrl}/`);
  });

  test.afterAll(async () => {
    if (server) await stopServer(server);
  });

  test('a first visit shows Traditional Chinese and English stays selected', async ({ page }) => {
    await page.goto(`${baseUrl}/`);
    await expect(page.getByText('投影片').first()).toBeVisible({ timeout: 30_000 });

    await page.getByRole('button', { name: '切換語言' }).click();
    await page.getByRole('menuitem', { name: 'English' }).click();
    await expect(page.getByText('Slides').first()).toBeVisible();

    await page.reload();
    await expect(page.getByText('Slides').first()).toBeVisible();
  });
});
