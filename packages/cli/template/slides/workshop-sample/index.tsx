import { type DesignSystem, type Page, type SlideMeta, Step, Steps } from '@open-slide/core';
import { CountUp, Reveal, Stagger } from '@open-slide/core/motion';
import type { CSSProperties, ReactNode } from 'react';

// 工作坊範例：示範動畫（@open-slide/core/motion），以及發布時開啟的現場互動。
// 想改哪裡，直接跟 Claude 說，例如「把第 2 頁的三個步驟改成我的課程大綱」。

export const design: DesignSystem = {
  palette: { bg: '#F6FAF6', text: '#1D2A22', accent: '#2E9E5B' },
  fonts: {
    display: '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", system-ui, sans-serif',
    body: '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", system-ui, sans-serif',
  },
  typeScale: { hero: 128, body: 34 },
  radius: 24,
};

const C = {
  muted: '#647368',
  soft: '#E2F2E7',
  highlight: '#F28C28',
  surface: '#FFFFFF',
  rule: '#DCE7DE',
};

const frame: CSSProperties = {
  width: '100%',
  height: '100%',
  padding: '110px 140px',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
  display: 'flex',
  flexDirection: 'column',
};

const eyebrow: CSSProperties = {
  fontSize: 30,
  fontWeight: 700,
  letterSpacing: '0.12em',
  color: 'var(--osd-accent)',
};

const heading: CSSProperties = {
  fontFamily: 'var(--osd-font-display)',
  fontSize: 76,
  fontWeight: 900,
  lineHeight: 1.2,
  margin: '20px 0 0',
};

function Title({ kicker, children }: { kicker: string; children: ReactNode }) {
  return (
    <div>
      <div style={eyebrow}>{kicker}</div>
      <h1 style={heading}>{children}</h1>
    </div>
  );
}

const Cover: Page = () => (
  <div style={{ ...frame, justifyContent: 'center' }}>
    <Reveal effect="rise">
      <div style={eyebrow}>簡報工作坊・範例</div>
      <h1
        style={{
          ...heading,
          fontSize: 'var(--osd-size-hero)',
          lineHeight: 1.12,
          margin: '28px 0 36px',
        }}
      >
        我的第一份
        <br />
        AI 簡報
      </h1>
    </Reveal>
    <Reveal effect="fade" delay={0.3}>
      <p style={{ fontSize: 40, color: C.muted, margin: 0 }}>跟 Claude 說想法，它幫你做成簡報</p>
    </Reveal>
  </div>
);

const STEPS = [
  { n: '01', title: '說出想法', body: '用平常說話的方式告訴 Claude 你要講什麼、給誰聽。' },
  { n: '02', title: '挑一個主題', body: '配色、字體、版面一次套好，之後還能換。' },
  { n: '03', title: '按下發布', body: '一個按鈕上線，把網址傳給觀眾就能看。' },
];

const HowItWorks: Page = () => (
  <div style={frame}>
    <Title kicker="三個步驟">從想法到上線</Title>
    <Stagger
      effect="rise"
      style={{ display: 'flex', gap: 40, marginTop: 80 }}
      itemStyle={{ flex: 1 }}
    >
      {STEPS.map((s) => (
        <div
          key={s.n}
          style={{
            height: '100%',
            background: C.surface,
            border: `2px solid ${C.rule}`,
            borderRadius: 'var(--osd-radius)',
            padding: 48,
          }}
        >
          <div style={{ fontSize: 56, fontWeight: 900, color: 'var(--osd-accent)' }}>{s.n}</div>
          <div style={{ fontSize: 46, fontWeight: 700, margin: '20px 0 16px' }}>{s.title}</div>
          <div style={{ fontSize: 30, lineHeight: 1.6, color: C.muted }}>{s.body}</div>
        </div>
      ))}
    </Stagger>
  </div>
);

const STATS = [
  { to: 10, suffix: ' 分鐘', label: '做出第一版' },
  { to: 0, suffix: ' 行', label: '程式要自己寫' },
  { to: 1, suffix: ' 個按鈕', label: '發布上線' },
];

const Numbers: Page = () => (
  <div style={frame}>
    <Title kicker="數字也會動">按一下，一項一項出現</Title>
    <Steps>
      {/* Grid, not flex: each <Step> wraps its card in its own div. */}
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, marginTop: 96 }}
      >
        {STATS.map((s) => (
          <Step key={s.label}>
            <div
              style={{
                height: '100%',
                background: C.soft,
                borderRadius: 'var(--osd-radius)',
                padding: '56px 48px',
              }}
            >
              <CountUp
                to={s.to}
                suffix={s.suffix}
                style={{
                  fontSize: 96,
                  fontWeight: 900,
                  color: s.to === 1 ? C.highlight : 'var(--osd-accent)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              />
              <div style={{ fontSize: 36, marginTop: 16 }}>{s.label}</div>
            </div>
          </Step>
        ))}
      </div>
    </Steps>
  </div>
);

const LIVE_STEPS = [
  { n: '1', title: '發布時勾選', body: '按「發布」，勾選「開啟現場互動」。' },
  { n: '2', title: '觀眾掃碼', body: '簡報右下角會出現 QR code，觀眾用手機發問、評分、送表情。' },
  { n: '3', title: '你在工作台管理', body: '工具列的「互動」面板裡，挑問題按「上螢幕」。' },
];

const Live: Page = () => (
  <div style={frame}>
    <Title kicker="現場互動">讓觀眾一起參與</Title>
    <Stagger
      effect="rise"
      style={{ display: 'flex', flexDirection: 'column', gap: 28, marginTop: 64 }}
    >
      {LIVE_STEPS.map((s) => (
        <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              background: C.soft,
              color: 'var(--osd-accent)',
              display: 'grid',
              placeItems: 'center',
              fontSize: 44,
              fontWeight: 900,
              flex: 'none',
            }}
          >
            {s.n}
          </div>
          <div>
            <div style={{ fontSize: 44, fontWeight: 700 }}>{s.title}</div>
            <div style={{ fontSize: 32, color: C.muted, marginTop: 6 }}>{s.body}</div>
          </div>
        </div>
      ))}
    </Stagger>
  </div>
);

const Thanks: Page = () => (
  <div style={{ ...frame, justifyContent: 'center' }}>
    <Reveal effect="pop">
      <h1 style={{ ...heading, fontSize: 'var(--osd-size-hero)' }}>謝謝聆聽</h1>
    </Reveal>
    <Reveal effect="fade" delay={0.3}>
      <p style={{ fontSize: 40, color: C.muted, margin: '32px 0 0' }}>
        有問題？掃右下角的 QR code 問我
      </p>
    </Reveal>
  </div>
);

export const meta: SlideMeta = { title: '工作坊範例：動畫與現場互動' };

export const notes = [
  '這是工作坊的範例簡報。想改任何一頁，直接跟 Claude 說要改哪一頁、改成什麼。',
  '三張卡片會依序升起，這是 Stagger 動畫。跟 Claude 說「讓卡片一張一張出現」也能做到。',
  '這頁用 Steps：每按一次下一頁，就多出現一個數字，數字會跳動。',
  '現場互動不用改簡報：發布時勾選，右下角就會出現 QR code。播放時按 Q 可以隱藏或顯示它。',
  '開啟互動後，你在「互動」面板按「上螢幕」的問題會以字幕出現在簡報下方。',
];

export default [Cover, HowItWorks, Numbers, Live, Thanks] satisfies Page[];
