import { type DesignSystem, type Page, type SlideMeta, Step, Steps } from '@open-slide/core';
import { LiveFeedback, LiveJoin, LiveQA } from '@open-slide/core/live';
import { CountUp, Reveal, Stagger } from '@open-slide/core/motion';
import type { CSSProperties, ReactNode } from 'react';

// 工作坊範例：示範動畫（@open-slide/core/motion）和現場互動（@open-slide/core/live）。
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
      <p style={{ fontSize: 40, color: C.muted, margin: 0 }}>跟 Claude 說想法，它幫你做成投影片</p>
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

const Join: Page = () => (
  <div style={{ ...frame, justifyContent: 'center', alignItems: 'center', gap: 56 }}>
    <Title kicker="現場互動">拿出手機，掃一下</Title>
    <LiveJoin size={340} label="掃描 QR code，一起互動" />
  </div>
);

const QA: Page = () => (
  <div style={{ ...frame, flexDirection: 'row', gap: 96, alignItems: 'flex-start' }}>
    <div style={{ width: 560, display: 'flex', flexDirection: 'column', gap: 48 }}>
      <Title kicker="現場提問">有問題，直接問</Title>
      <LiveJoin
        size={240}
        label="掃碼發問，也能幫別人的問題按讚"
        style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 28 }}
      />
    </div>
    <LiveQA style={{ flex: 1, paddingTop: 12 }} limit={4} />
  </div>
);

const Feedback: Page = () => (
  <div style={{ ...frame, flexDirection: 'row', alignItems: 'center', gap: 120 }}>
    <div style={{ flex: 1 }}>
      <Title kicker="謝謝聆聽">給我一點回饋</Title>
      <LiveFeedback title="即時反饋" style={{ marginTop: 64 }} />
    </div>
    <LiveJoin
      size={260}
      label="評分、送表情、留一句話心得"
      style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 28, width: 520 }}
    />
  </div>
);

export const meta: SlideMeta = { title: '工作坊範例：動畫與現場互動' };

export const notes = [
  '這是工作坊的範例簡報。想改任何一頁，直接跟 Claude 說要改哪一頁、改成什麼。',
  '三張卡片會依序升起，這是 Stagger 動畫。跟 Claude 說「讓卡片一張一張出現」也能做到。',
  '這頁用 Steps：每按一次下一頁，就多出現一個數字，數字會跳動。',
  '發布後這裡會出現真正的 QR code。觀眾掃碼後就能發問和回饋。',
  '投影片只顯示你在管理頁按「上螢幕」的問題。管理頁在發布視窗裡打開，不要投影出去。',
  '評分和表情會即時出現在這裡。心得只有你在管理頁看得到。',
];

export default [Cover, HowItWorks, Numbers, Join, QA, Feedback] satisfies Page[];
