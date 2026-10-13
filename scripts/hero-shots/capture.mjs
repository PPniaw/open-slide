import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { launch } from './browser.mjs';

const B = 'http://localhost:5173';
const OUT = new URL('./cap/', import.meta.url).pathname;
const VIEW = { width: 1600, height: 1000 };
const only = process.argv.slice(2);

const browser = await launch();

async function fresh(page) {
  await page.request.delete(`${B}/__slides/hero-aero`).catch(() => {});
  await page.waitForTimeout(800);
  const r = await page.request.post(`${B}/__slides/aero-3-launch/duplicate`, {
    data: { newId: 'hero-aero' },
  });
  if (!r.ok()) throw new Error(`duplicate failed ${r.status()}`);
  const file = new URL('../../apps/demo/slides/hero-aero/index.tsx', import.meta.url).pathname;
  writeFileSync(file, readFileSync(file, 'utf8').replace(' (copy)', ''));
  await page.waitForTimeout(2500);
}

async function shot(name, dpr, clip, fn) {
  if (only.length && !only.includes(name)) return;
  const dir = `${OUT}${name}/`;
  mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({
    viewport: VIEW,
    deviceScaleFactor: dpr,
    colorScheme: 'dark',
  });
  const page = await ctx.newPage();
  const meta = { dpr, clip, states: {}, items: {} };
  const cap = async (state, opts = {}) => {
    await page.screenshot({
      path: `${dir}${state}.png`,
      clip,
      caret: opts.caret ?? 'hide',
      animations: 'disabled',
    });
    meta.states[state] = `${state}.png`;
  };
  const t0 = Date.now();
  await fn({ page, cap, meta });
  writeFileSync(`${dir}meta.json`, JSON.stringify(meta, null, 2));
  await ctx.close();
  console.log(
    name,
    'done',
    `${((Date.now() - t0) / 1000).toFixed(1)}s`,
    Object.keys(meta.states).length,
    'states',
  );
}

const rects = (page, sel) =>
  page.evaluate(
    (s) =>
      [...document.querySelectorAll(s)].map((e) => {
        const r = e.getBoundingClientRect();
        return [r.x, r.y, r.width, r.height];
      }),
    sel,
  );

const lineRects = (page, sel) =>
  page.evaluate((s) => {
    const el = document.querySelector(s);
    const range = document.createRange();
    range.selectNodeContents(el);
    const out = [];
    for (const r of range.getClientRects()) {
      if (r.width < 2) continue;
      const last = out[out.length - 1];
      if (last && Math.abs(last[1] - r.y) < 3) {
        const x2 = Math.max(last[0] + last[2], r.x + r.width);
        last[0] = Math.min(last[0], r.x);
        last[2] = x2 - last[0];
      } else out.push([r.x, r.y, r.width, r.height]);
    }
    return out;
  }, sel);

const hideStyle = (page, css) => page.addStyleTag({ content: css });

const settle = (page, ms = 4500) => page.waitForTimeout(ms);

await shot('s01-nav', 4, { x: 0, y: 0, width: 720, height: 460 }, async ({ page, cap }) => {
  await page.goto(`${B}/themes`);
  await settle(page);
  await cap('themes');
  await page.goto(`${B}/`);
  await settle(page);
  await cap('slides');
});

await shot(
  's02-grid',
  2,
  { x: 0, y: 0, width: 1600, height: 1000 },
  async ({ page, cap, meta }) => {
    await page.goto(`${B}/`);
    await settle(page);
    await cap('full');
    meta.items.cards = (await rects(page, 'main a.block[href^="/s/"]')).filter((r) => r[1] < 1000);
    meta.items.titles = (await rects(page, 'main a.min-w-0[href^="/s/"]')).filter(
      (r) => r[1] < 1000,
    );
    await hideStyle(page, 'main a[href^="/s/"] { visibility: hidden !important; }');
    await page.waitForTimeout(300);
    await cap('empty');
  },
);

await shot('s03-agent', 6, { x: 0, y: 0, width: 760, height: 260 }, async ({ page, cap, meta }) => {
  await fresh(page);
  await page.goto(`${B}/s/hero-aero`);
  await settle(page);
  await cap('connected');
  meta.items.badge = await rects(page, 'button[aria-label="Agent connected"]');
  await page.evaluate(() => {
    const b = document.querySelector('button[aria-label="Agent connected"]');
    const dot = b.children[0];
    dot.innerHTML = '<span class="relative inline-flex size-1.5 rounded-full bg-rose-500"></span>';
    b.children[1].textContent = 'Agent disconnected';
  });
  await page.waitForTimeout(200);
  await cap('disconnected');
});

await shot(
  's04-rail',
  2.5,
  { x: 0, y: 0, width: 1000, height: 1000 },
  async ({ page, cap, meta }) => {
    await fresh(page);
    await page.goto(`${B}/s/hero-aero`);
    await settle(page, 6000);
    await cap('full');
    meta.items.thumbs = await rects(page, '[class*="group/thumb"]');
    await hideStyle(
      page,
      '[class*="group/thumb"]:not(:first-of-type) { visibility: hidden !important; }',
    );
    await page.evaluate(() => {
      const items = [...document.querySelectorAll('[class*="group/thumb"]')];
      items.slice(1).forEach((e) => {
        e.style.visibility = 'hidden';
      });
    });
    await page.waitForTimeout(300);
    await cap('one');
  },
);

await shot(
  's05-tool',
  6,
  { x: 880, y: 0, width: 720, height: 240 },
  async ({ page, cap, meta }) => {
    await fresh(page);
    await page.goto(`${B}/s/hero-aero`);
    await settle(page, 6000);
    await page.mouse.move(800, 990);
    await cap('edit');
    meta.items.comment = await rects(page, '[data-inspector-mode="comment"]');
    await page.locator('[data-inspector-mode="comment"]').click();
    await page.mouse.move(800, 990);
    await page.waitForTimeout(700);
    await cap('comment');
  },
);

const NOTE = 'Make the launch date the hero — bigger, louder';

async function commentFlow({ page, cap, meta }, { typing }) {
  await fresh(page);
  await page.goto(`${B}/s/hero-aero`);
  await settle(page, 6000);
  await page.locator('[data-inspector-mode="comment"]').click();
  await page.mouse.move(800, 995);
  await page.waitForTimeout(800);
  await cap('idle');
  const target = page.locator('main[data-inspector-root]').getByText('SPRING 2027').first();
  meta.items.target = [await target.boundingBox()].map((b) => [b.x, b.y, b.width, b.height]);
  await target.click();
  await page.mouse.move(800, 995);
  await page.waitForTimeout(600);
  await cap('open', { caret: 'initial' });
  if (typing) {
    for (let i = 1; i <= NOTE.length; i++) {
      await page.keyboard.type(NOTE[i - 1]);
      await cap(`k${String(i).padStart(2, '0')}`, { caret: 'initial' });
    }
  } else {
    await page.keyboard.type(NOTE);
  }
  meta.items.composer = await rects(page, '[data-comment-layer] textarea');
  await page.keyboard.press('ControlOrMeta+Enter');
  await page.waitForTimeout(1200);
  await page.mouse.move(800, 995);
  await page.waitForTimeout(400);
  await cap('posted');
  meta.note = NOTE;
}

await shot('s06-comment', 3, { x: 640, y: 360, width: 960, height: 640 }, (c) =>
  commentFlow(c, { typing: true }),
);

await shot('s07-apply', 6, { x: 520, y: 760, width: 860, height: 240 }, async (c) => {
  await commentFlow(c, { typing: false });
  c.meta.items.hint = await rects(c.page, 'code');
});

async function designFlow({ page, cap, meta }, { typing }) {
  await fresh(page);
  await page.goto(`${B}/s/hero-aero`);
  await settle(page, 6000);
  await page
    .getByRole('button', { name: /^Design/ })
    .first()
    .click();
  await page.mouse.move(800, 995);
  await page.waitForTimeout(1000);
  const accent = page.locator('input[type="text"][aria-label="Accent"]');
  meta.items.accent = [await accent.boundingBox()].map((b) => [b.x, b.y, b.width, b.height]);
  await cap('before');
  await accent.click();
  await accent.press('ControlOrMeta+a');
  await page.waitForTimeout(150);
  await cap('selected', { caret: 'initial' });
  const value = '#FF5A2E';
  if (typing) {
    for (let i = 1; i <= value.length; i++) {
      await page.keyboard.type(value[i - 1]);
      await page.waitForTimeout(60);
      await cap(`k${i}`, { caret: 'initial' });
    }
  } else {
    await page.keyboard.type(value);
  }
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1500);
  await page.mouse.move(800, 995);
  await page.waitForTimeout(300);
  await cap('after');
  meta.items.canvas = await rects(page, 'main[data-inspector-root] [data-osd-canvas]');
  meta.items.thumbs = await rects(page, '[class*="group/thumb"]');
  meta.items.swatches = await rects(page, 'input[type="text"][aria-label]');
  meta.items.swatchFields = await rects(page, 'label:has(input[type="color"])');
  if (!typing) {
    const bg = page.locator('input[type="text"][aria-label="Background"]');
    await bg.click();
    await bg.press('ControlOrMeta+a');
    await page.keyboard.type('#121214');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
    await page.mouse.move(800, 995);
    await page.waitForTimeout(300);
    await cap('after2');
  }
}

await shot('s08-design', 3.5, { x: 880, y: 0, width: 720, height: 560 }, (c) =>
  designFlow(c, { typing: true }),
);

await shot('s09-wide', 1.6, { x: 0, y: 0, width: 1600, height: 1000 }, (c) =>
  designFlow(c, { typing: false }),
);

await shot(
  's10-presenter',
  3,
  { x: 860, y: 0, width: 740, height: 1000 },
  async ({ page, cap, meta }) => {
    await fresh(page);
    await page.goto(`${B}/s/hero-aero/presenter`);
    await settle(page, 5000);
    await cap('p1');
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(1500);
    await cap('p2');
    meta.items.notes = await lineRects(page, '.whitespace-pre-wrap');
    meta.items.timer = await page.evaluate(() =>
      [...document.querySelectorAll('*')]
        .filter((e) => e.children.length === 0 && /^\d\d:\d\d$/.test(e.textContent.trim()))
        .map((e) => {
          const r = e.getBoundingClientRect();
          return [r.x, r.y, r.width, r.height, e.textContent];
        }),
    );
    await hideStyle(page, '.whitespace-pre-wrap { visibility: hidden !important; }');
    await page.waitForTimeout(200);
    await cap('p2blank');
    await hideStyle(page, '.whitespace-pre-wrap { visibility: visible !important; }');
    meta.items.next = await rects(page, '.aspect-video, [style*="aspect-ratio"]');
    for (let s = 0; s < 5; s++) {
      await page.waitForTimeout(1000);
      await cap(`t${s}`);
    }
  },
);

await shot('s99-cleanup', 1, { x: 0, y: 0, width: 10, height: 10 }, async ({ page }) => {
  await page.request.delete(`${B}/__slides/hero-aero`).catch(() => {});
});

await browser.close();
