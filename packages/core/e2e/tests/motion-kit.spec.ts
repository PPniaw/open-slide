import fs from 'node:fs/promises';
import path from 'node:path';
import { expect, type Page, test } from '@playwright/test';
import {
  devScratchDir,
  editorCanvas,
  enterPlayMode,
  openSlide,
  refreshSlidesModule,
} from './helpers.ts';

const DECK_ID = 'motion-kit';

const DECK = `import { type Page, type SlideMeta, Step, Steps } from '@open-slide/core';
import { CountUp, Reveal } from '@open-slide/core/motion';

export const meta: SlideMeta = {
  title: 'Motion Kit Deck',
  createdAt: '2026-01-06T00:00:00.000Z',
};

const fill = { width: '100%', height: '100%', background: '#0d1117', color: '#e6edf3', padding: 120 } as const;

const Cover: Page = () => (
  <div style={fill}>
    <h1 style={{ fontSize: 96, margin: 0 }}>Motion cover</h1>
  </div>
);

const Stepped: Page = () => (
  <div style={fill}>
    <Steps>
      <Step>
        <Reveal effect="pop">
          <p data-testid="reveal-box" style={{ fontSize: 64 }}>Revealed box</p>
        </Reveal>
      </Step>
      <Step>
        <p data-testid="count" style={{ fontSize: 64 }}>
          <CountUp to={1280} grouping />
        </p>
      </Step>
    </Steps>
  </div>
);

export default [Cover, Stepped] satisfies Page[];
`;

// Thumbnails and preload layers mount extra copies of each page; the one on stage is the largest.
async function stageOpacity(page: Page, testId: string): Promise<number> {
  return page.evaluate((id) => {
    const els = [...document.querySelectorAll<HTMLElement>(`[data-testid="${id}"]`)];
    els.sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width);
    const host = els[0]?.parentElement;
    return host ? Number(getComputedStyle(host).opacity) : -1;
  }, testId);
}

async function sampleStageOpacity(page: Page, testId: string, ms: number): Promise<number[]> {
  return page.evaluate(
    async ([id, duration]) => {
      const pick = () => {
        const els = [...document.querySelectorAll<HTMLElement>(`[data-testid="${id}"]`)];
        els.sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width);
        return els[0]?.parentElement;
      };
      const out: number[] = [];
      const start = performance.now();
      while (performance.now() - start < duration) {
        await new Promise((r) => requestAnimationFrame(r));
        const host = pick();
        if (host) out.push(Number(getComputedStyle(host).opacity));
      }
      return out;
    },
    [testId, ms] as const,
  );
}

test.describe('motion kit', () => {
  const deckDir = path.join(devScratchDir, 'slides', DECK_ID);

  test.beforeAll(async () => {
    await fs.mkdir(deckDir, { recursive: true });
    await fs.writeFile(path.join(deckDir, 'index.tsx'), DECK);
    await refreshSlidesModule(DECK_ID);
  });

  test.afterAll(async () => {
    await fs.rm(deckDir, { recursive: true, force: true });
  });

  test.describe('with motion allowed', () => {
    test.use({ contextOptions: { reducedMotion: 'no-preference' } });

    test('Reveal waits for its step, then animates in', async ({ page }) => {
      await openSlide(page, DECK_ID);
      await enterPlayMode(page);
      await page.keyboard.press('ArrowRight');
      await expect(page).toHaveURL(/[?&]p=2/);
      await expect(page.locator('[data-osd-step="pending"]').first()).toBeAttached();
      expect(await stageOpacity(page, 'reveal-box')).toBe(0);

      const sampling = sampleStageOpacity(page, 'reveal-box', 900);
      await page.keyboard.press('ArrowRight');
      const samples = await sampling;

      expect(samples.some((o) => o > 0.05 && o < 0.95)).toBe(true);
      await expect.poll(() => stageOpacity(page, 'reveal-box')).toBe(1);
    });

    test('CountUp counts on reveal and thumbnails show the final value', async ({ page }) => {
      await openSlide(page, DECK_ID);
      await expect(editorCanvas(page)).toBeVisible();
      const texts = await page.getByTestId('count').allTextContents();
      expect(texts.length).toBeGreaterThan(1);
      await expect
        .poll(async () => page.getByTestId('count').allTextContents())
        .toEqual(texts.map(() => '1,280'));

      await enterPlayMode(page);
      await page.keyboard.press('ArrowRight');
      await expect(page).toHaveURL(/[?&]p=2/);
      await expect(page.locator('[data-osd-step="pending"]')).toHaveCount(2);
      await page.keyboard.press('ArrowRight');
      await expect(page.locator('[data-osd-step="revealed"]')).toHaveCount(1);
      await page.keyboard.press('ArrowRight');
      await expect(page.locator('[data-osd-step="revealed"]')).toHaveCount(2);

      const midway = await page.evaluate(async () => {
        await new Promise((r) => setTimeout(r, 250));
        return [...document.querySelectorAll('[data-testid="count"]')].map((e) => e.textContent);
      });
      expect(midway).not.toContain('1,280');
      await expect
        .poll(async () => page.getByTestId('count').allTextContents())
        .toEqual(midway.map(() => '1,280'));
    });
  });

  test('reduced motion reveals without animating', async ({ page }) => {
    await openSlide(page, DECK_ID);
    await enterPlayMode(page);
    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(/[?&]p=2/);

    const sampling = sampleStageOpacity(page, 'reveal-box', 500);
    await page.keyboard.press('ArrowRight');
    const samples = await sampling;

    expect(samples.filter((o) => o > 0.05 && o < 0.95)).toEqual([]);
    expect(samples.at(-1)).toBe(1);
  });
});
