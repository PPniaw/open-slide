import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { launch, resolveFromCore } from './browser.mjs';

const dir = new URL('./cap/outro/', import.meta.url).pathname;
mkdirSync(dir, { recursive: true });
const font = resolveFromCore('@fontsource-variable/geist/files/geist-latin-wght-normal.woff2');
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const css = `@font-face{font-family:G;src:url(data:font/woff2;base64,${readFileSync(font).toString('base64')}) format('woff2');font-weight:100 900}
html,body{margin:0;background:transparent}
.t{position:absolute;top:0;left:0;font:500 88px/1.2 G;letter-spacing:-0.02em;color:rgba(255,255,255,.95);white-space:pre}
.w{font:500 88px/1 G;letter-spacing:-0.025em;color:#fff;white-space:pre}`;
await page.setContent(`<style>${css}</style><span id=n class=t>open-slide</span><span id=g class=t> — slides your agent writes.</span>
<div id=logo style="position:absolute;display:flex;align-items:center;gap:46px">
<svg width=115 height=115 viewBox="16 16 480 480"><path fill-rule=evenodd fill="#fff" d="M128 16h256a112 112 0 0 1 112 112v256a112 112 0 0 1-112 112H128A112 112 0 0 1 16 384V128A112 112 0 0 1 128 16ZM146 172h220a34 34 0 0 1 34 34v100a34 34 0 0 1-34 34H146a34 34 0 0 1-34-34V206a34 34 0 0 1 34-34Z"/></svg>
<span class=w>open-slide</span></div>`);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
const m = await page.evaluate(() => {
  const r = (id) => {
    const b = document.getElementById(id).getBoundingClientRect();
    return [b.x, b.y, b.width, b.height];
  };
  return { n: r('n'), g: r('g'), logo: r('logo') };
});
const shot = async (file, show) => {
  await page.evaluate((ids) => {
    for (const id of ['n', 'g', 'logo'])
      document.getElementById(id).style.visibility = ids.includes(id) ? 'visible' : 'hidden';
  }, show);
  await page.screenshot({
    path: dir + file,
    omitBackground: true,
    clip: { x: 0, y: 0, width: 1920, height: 1080 },
  });
};
await page.evaluate(() => {
  const l = document.getElementById('logo');
  const b = l.getBoundingClientRect();
  l.style.left = `${960 - b.width / 2}px`;
  l.style.top = `${540 - b.height / 2}px`;
});
await shot('name.png', ['n']);
await shot('tag.png', ['g']);
await shot('logo.png', ['logo']);
writeFileSync(`${dir}meta.json`, JSON.stringify(m));
console.log(m);
await browser.close();
