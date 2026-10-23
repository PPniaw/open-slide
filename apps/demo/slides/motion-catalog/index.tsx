import type { Page, SlideMeta } from '@open-slide/core';
import { Step, Steps } from '@open-slide/core';
import { CountUp, LayoutList, Reveal, type RevealEffect, Stagger } from '@open-slide/core/motion';
import type { CSSProperties, ReactNode } from 'react';

const ink = {
  bg: '#0e1014',
  text: '#f4f4f5',
  soft: '#a1a1aa',
  dim: '#71717a',
  panel: '#171a21',
  rule: '#262a33',
  accent: '#ff6b4a',
  blue: '#4aa8ff',
  green: '#3ddc97',
};

const PAGE: CSSProperties = {
  width: '100%',
  height: '100%',
  padding: '110px 140px',
  boxSizing: 'border-box',
  background: ink.bg,
  color: ink.text,
  fontFamily: 'var(--osd-font-body)',
  display: 'flex',
  flexDirection: 'column',
};

const CARD: CSSProperties = {
  background: ink.panel,
  border: `1px solid ${ink.rule}`,
  borderRadius: 24,
};

function Header({
  no,
  name,
  code,
  title,
}: {
  no: string;
  name: string;
  code: string;
  title: string;
}) {
  return (
    <header>
      <div
        style={{ display: 'flex', alignItems: 'baseline', gap: 24, fontSize: 30, color: ink.soft }}
      >
        <span style={{ color: ink.accent, fontWeight: 700 }}>{no}</span>
        <span style={{ fontWeight: 600, color: ink.text }}>{name}</span>
        <code style={{ fontSize: 26, color: ink.dim }}>{code}</code>
      </div>
      <h1 style={{ fontSize: 84, fontWeight: 700, margin: '28px 0 0', letterSpacing: '-0.02em' }}>
        {title}
      </h1>
    </header>
  );
}

const Hint = ({ children }: { children: ReactNode }) => (
  <p style={{ marginTop: 'auto', fontSize: 26, color: ink.dim }}>{children}</p>
);

const Cover: Page = () => (
  <section style={{ ...PAGE, justifyContent: 'center' }}>
    <div style={{ fontSize: 34, color: ink.accent, fontWeight: 700 }}>@open-slide/core/motion</div>
    <h1 style={{ fontSize: 140, fontWeight: 700, margin: '24px 0 0', letterSpacing: '-0.03em' }}>
      動畫型錄
    </h1>
    <p style={{ fontSize: 40, color: ink.soft, margin: '28px 0 0' }}>
      選一個效果，對 agent 說它的名字就好
    </p>
    <Hint>按 Enter 進入簡報模式，之後每按一次 → 播下一段</Hint>
  </section>
);

const effects: { effect: RevealEffect; label: string }[] = [
  { effect: 'fade', label: '淡入' },
  { effect: 'rise', label: '升起' },
  { effect: 'pop', label: '彈出' },
  { effect: 'slide', label: '滑入' },
  { effect: 'blur', label: '模糊淡入' },
];

const RevealPage: Page = () => (
  <section style={PAGE}>
    <Header no="01" name="Reveal 單一元素進場" code='<Reveal effect="pop">' title="五種進場效果" />
    <div style={{ display: 'flex', gap: 32, marginTop: 80 }}>
      <Steps>
        {effects.map(({ effect, label }) => (
          <Step key={effect}>
            <Reveal effect={effect}>
              <div
                data-catalog={`reveal-${effect}`}
                style={{
                  ...CARD,
                  width: 300,
                  height: 300,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 16,
                }}
              >
                <span style={{ fontSize: 56, fontWeight: 700 }}>{label}</span>
                <code style={{ fontSize: 30, color: ink.soft }}>{effect}</code>
              </div>
            </Reveal>
          </Step>
        ))}
      </Steps>
    </div>
    <Hint>每按一次 → 出現一張，效果名稱就是 effect 的值</Hint>
  </section>
);

const takeaways = [
  ['自己的主題庫', 'themes/ 裡的品牌色、字體、版型'],
  ['自己的動畫庫', '換頁、分段出現、數字跳動'],
  ['自己的互動工具庫', '抽獎、投票、計時器'],
  ['自己的素材庫', 'assets/INDEX.md 讓 agent 找得到照片'],
];

const StaggerPage: Page = () => (
  <section style={PAGE}>
    <Header
      no="02"
      name="Stagger 逐項彈入"
      code='<Stagger effect="slide">'
      title="工作坊結束，你會帶走"
    />
    <div style={{ marginTop: 64 }}>
      <Steps>
        <Step>
          <Stagger
            effect="slide"
            style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
            itemStyle={{
              ...CARD,
              display: 'flex',
              alignItems: 'center',
              gap: 48,
              padding: '28px 44px',
            }}
          >
            {takeaways.map(([name, desc]) => (
              <div key={name} data-catalog="stagger-item" style={{ display: 'contents' }}>
                <span style={{ fontSize: 52, fontWeight: 700, width: 520 }}>{name}</span>
                <span style={{ fontSize: 36, color: ink.soft }}>{desc}</span>
              </div>
            ))}
          </Stagger>
        </Step>
      </Steps>
    </div>
    <Hint>按 → 一次：四列依序滑入，每列間隔 0.11 秒</Hint>
  </section>
);

const stats = [
  {
    to: 36,
    decimals: 0,
    prefix: '',
    unit: '個版本',
    note: '1.13.2 → 2.3.1 的落差',
    color: ink.accent,
  },
  {
    to: 1280,
    decimals: 0,
    prefix: '',
    unit: '位學員',
    note: 'grouping 千分位示範',
    color: ink.blue,
  },
  {
    to: 0.1,
    decimals: 2,
    prefix: '$',
    unit: '美元',
    note: '問 agent 一題的成本',
    color: ink.green,
  },
];

const CountUpPage: Page = () => (
  <section style={PAGE}>
    <Header
      no="03"
      name="CountUp 數字跳動"
      code="<CountUp to={36} />"
      title="數字從 0 跑到目標值"
    />
    <div style={{ display: 'flex', gap: 48, marginTop: 72 }}>
      <Steps>
        {stats.map((s) => (
          <Step key={s.unit}>
            <div style={{ ...CARD, width: 500, padding: '48px 52px', boxSizing: 'border-box' }}>
              <div
                data-catalog="countup"
                style={{ fontSize: 150, fontWeight: 700, lineHeight: 1, color: s.color }}
              >
                <CountUp to={s.to} decimals={s.decimals} prefix={s.prefix} grouping />
              </div>
              <div style={{ fontSize: 44, fontWeight: 600, marginTop: 24 }}>{s.unit}</div>
              <div style={{ fontSize: 30, color: ink.soft, marginTop: 12 }}>{s.note}</div>
            </div>
          </Step>
        ))}
      </Steps>
    </div>
    <Hint>每按一次 → 出現一張卡片，數字約 1.6 秒跑完</Hint>
  </section>
);

type Row = { id: string; label: string; hours: number };
const before: Row[] = [
  { id: 'layout', label: '排版對齊', hours: 6 },
  { id: 'assets', label: '找素材', hours: 4 },
  { id: 'write', label: '寫內容', hours: 3 },
  { id: 'rehearse', label: '練習口條', hours: 1 },
];
const after: Row[] = [
  { id: 'write', label: '寫內容', hours: 3 },
  { id: 'rehearse', label: '練習口條', hours: 2 },
  { id: 'assets', label: '找素材', hours: 1 },
  { id: 'layout', label: '排版對齊', hours: 0.5 },
];

function RankRow({ row, rank }: { row: Row; rank: number }) {
  return (
    <div
      data-rank-id={row.id}
      style={{ display: 'flex', alignItems: 'center', gap: 32, height: 100 }}
    >
      <span style={{ width: 60, fontSize: 44, color: ink.dim }}>{rank}</span>
      <span style={{ width: 300, fontSize: 48, fontWeight: 600 }}>{row.label}</span>
      <div style={{ flex: 1, height: 56, background: '#1d2129', borderRadius: 14 }}>
        <div
          style={{
            width: `${(row.hours / 6) * 100}%`,
            height: '100%',
            background: ink.green,
            borderRadius: 14,
            transition: 'width 600ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>
      <span style={{ width: 230, fontSize: 44, textAlign: 'right', whiteSpace: 'nowrap' }}>
        {row.hours} 小時
      </span>
    </div>
  );
}

const LayoutPage: Page = () => (
  <section style={PAGE}>
    <Header
      no="04"
      name="LayoutList 版面重排"
      code='<LayoutList trigger="after">'
      title="做一份簡報，時間花在哪"
    />
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 28,
        marginTop: 36,
        fontSize: 34,
        color: ink.soft,
      }}
    >
      <span>用 Canva 手排</span>
      <Steps>
        <Step>
          <span data-reveal="after" style={{ color: ink.green, fontWeight: 600 }}>
            → 改用 open-slide + agent
          </span>
        </Step>
      </Steps>
      <span style={{ fontSize: 24, color: ink.dim }}>（示意數字）</span>
    </div>
    <LayoutList
      trigger="after"
      items={before}
      revealedItems={after}
      getKey={(row) => row.id}
      renderItem={(row, i) => <RankRow row={row} rank={i + 1} />}
      style={{ marginTop: 48 }}
    />
    <Hint>按 → 一次：每一列滑到新名次</Hint>
  </section>
);

export const meta: SlideMeta = {
  title: '動畫型錄',
  createdAt: '2026-10-23T14:30:00.000Z',
};

export default [Cover, RevealPage, StaggerPage, CountUpPage, LayoutPage];
