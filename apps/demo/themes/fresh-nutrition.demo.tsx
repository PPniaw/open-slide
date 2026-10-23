import { type DesignSystem, type Page, useSlidePageNumber } from '@open-slide/core';
import { CountUp, Stagger } from '@open-slide/core/motion';

export const design: DesignSystem = {
  palette: { bg: '#F6FAF6', text: '#1D2A22', accent: '#2E9E5B' },
  fonts: {
    display: '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", system-ui, sans-serif',
    body: '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", system-ui, sans-serif',
  },
  typeScale: { hero: 128, body: 34 },
  radius: 24,
};

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&display=swap';
const FONT_LINK_ID = 'osd-webfont-theme-fresh-nutrition';
if (typeof document !== 'undefined') {
  let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  if (link.href !== FONT_HREF) link.href = FONT_HREF;
}

const C = {
  bg: '#F6FAF6',
  surface: '#FFFFFF',
  text: '#1D2A22',
  muted: '#647368',
  accent: '#2E9E5B',
  accentSoft: '#E2F2E7',
  highlight: '#F28C28',
  rule: '#DCE7DE',
};

const PAGE = {
  width: '100%',
  height: '100%',
  background: C.bg,
  color: C.text,
  padding: '100px 140px',
  boxSizing: 'border-box',
  position: 'relative',
  fontFamily: 'var(--osd-font-body)',
} as const;

const Title = ({ children }: { children: React.ReactNode }) => (
  <h1
    style={{
      fontSize: 72,
      fontWeight: 900,
      lineHeight: 1.25,
      letterSpacing: '0.01em',
      margin: 0,
      color: '#1D2A22',
    }}
  >
    {children}
  </h1>
);

const Footer = ({ source }: { source?: string }) => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: 140,
        right: 140,
        bottom: 44,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 22,
        color: '#647368',
      }}
    >
      <span>{source ? `資料來源：${source}` : '清新營養 · 2026'}</span>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>
        {current} / {total}
      </span>
    </div>
  );
};

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      padding: '8px 20px',
      borderRadius: 999,
      background: '#E2F2E7',
      color: '#2E9E5B',
      fontSize: 26,
      fontWeight: 700,
    }}
  >
    {children}
  </div>
);

const NutritionTable = ({ rows }: { rows: { label: string; value: string; daily?: string }[] }) => (
  <div
    style={{
      background: '#FFFFFF',
      border: '2px solid #1D2A22',
      borderRadius: 16,
      padding: '28px 36px',
      width: 560,
      fontVariantNumeric: 'tabular-nums',
    }}
  >
    <div
      style={{
        fontSize: 34,
        fontWeight: 900,
        borderBottom: '6px solid #1D2A22',
        paddingBottom: 12,
      }}
    >
      營養標示
    </div>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 20,
        color: '#647368',
        padding: '10px 0',
      }}
    >
      <span>每份</span>
      <span>每日參考值</span>
    </div>
    {rows.map((r) => (
      <div
        key={r.label}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 28,
          padding: '12px 0',
          borderTop: '1px solid #DCE7DE',
        }}
      >
        <span>
          {r.label} <strong style={{ marginLeft: 12 }}>{r.value}</strong>
        </span>
        <span style={{ color: '#2E9E5B', fontWeight: 700 }}>{r.daily ?? ''}</span>
      </div>
    ))}
  </div>
);

const StatCard = ({
  value,
  unit,
  label,
  highlight = false,
}: {
  value: React.ReactNode;
  unit: string;
  label: string;
  highlight?: boolean;
}) => (
  <div
    style={{
      background: '#FFFFFF',
      borderRadius: 24,
      padding: '40px 44px',
      boxShadow: '0 1px 0 #DCE7DE, 0 12px 32px -18px rgba(29, 42, 34, 0.25)',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 12,
        color: highlight ? '#F28C28' : '#2E9E5B',
      }}
    >
      <span
        style={{
          fontSize: 140,
          fontWeight: 900,
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </span>
      <span style={{ fontSize: 40, fontWeight: 700 }}>{unit}</span>
    </div>
    <div style={{ fontSize: 30, color: '#1D2A22', marginTop: 20 }}>{label}</div>
  </div>
);

const Packet = () => (
  <svg width="420" height="520" viewBox="0 0 420 520" role="img" aria-label="產品包裝示意圖">
    <ellipse cx="210" cy="490" rx="160" ry="18" fill="rgba(29, 42, 34, 0.08)" />
    <path
      d="M90 60 Q90 40 110 40 H310 Q330 40 330 60 L350 450 Q352 470 330 470 H90 Q68 470 70 450 Z"
      fill="#FFFFFF"
      stroke="#1D2A22"
      strokeWidth="4"
    />
    <rect x="90" y="40" width="240" height="44" rx="10" fill="#2E9E5B" />
    <circle cx="210" cy="230" r="78" fill="#E2F2E7" />
    <path d="M210 180 C250 200 255 255 210 285 C165 255 170 200 210 180 Z" fill="#2E9E5B" />
    <text x="210" y="370" textAnchor="middle" fontSize="40" fontWeight="900" fill="#1D2A22">
      纖果日常
    </text>
    <text x="210" y="415" textAnchor="middle" fontSize="22" fill="#647368">
      每包 8 公克膳食纖維
    </text>
  </svg>
);

const Cover: Page = () => (
  <section style={{ ...PAGE, display: 'flex', alignItems: 'center', gap: 80 }}>
    <div style={{ flex: 1 }}>
      <Eyebrow>🌿 2026 新品發表</Eyebrow>
      <h1 style={{ fontSize: 128, fontWeight: 900, lineHeight: 1.2, margin: '32px 0 0' }}>
        每天一包
        <br />
        補足膳食纖維
      </h1>
      <p style={{ fontSize: 34, color: C.muted, maxWidth: 900, marginTop: 28, lineHeight: 1.6 }}>
        纖果日常｜給外食族的輕量營養補給
      </p>
    </div>
    <div
      style={{
        width: 560,
        height: 680,
        borderRadius: 48,
        background: C.accentSoft,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Packet />
    </div>
    <Footer />
  </section>
);

const Data: Page = () => (
  <section style={PAGE}>
    <Eyebrow>數據重點</Eyebrow>
    <div style={{ marginTop: 24 }}>
      <Title>外食族的纖維缺口，一包補回三分之一</Title>
    </div>
    <div style={{ display: 'flex', gap: 48, marginTop: 64, alignItems: 'flex-start' }}>
      <Stagger
        effect="rise"
        style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 40 }}
      >
        <StatCard value={<CountUp to={8} />} unit="公克" label="每包膳食纖維" />
        <StatCard value={<CountUp to={32} />} unit="%" label="每日建議攝取量" highlight />
        <StatCard value={<CountUp to={45} />} unit="大卡" label="每包熱量" />
        <StatCard value={<CountUp to={0} />} unit="公克" label="添加糖" />
      </Stagger>
      <NutritionTable
        rows={[
          { label: '熱量', value: '45 大卡', daily: '2%' },
          { label: '蛋白質', value: '1.2 公克', daily: '2%' },
          { label: '碳水化合物', value: '11 公克', daily: '4%' },
          { label: '膳食纖維', value: '8 公克', daily: '32%' },
          { label: '鈉', value: '15 毫克', daily: '1%' },
        ]}
      />
    </div>
    <Footer source="產品營養標示（示意數字）" />
  </section>
);

const Closer: Page = () => (
  <section
    style={{
      ...PAGE,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    }}
  >
    <Eyebrow>下一步</Eyebrow>
    <h1 style={{ fontSize: 112, fontWeight: 900, lineHeight: 1.25, margin: '32px 0 0' }}>
      從今天的午餐開始
    </h1>
    <p style={{ fontSize: 34, color: C.muted, marginTop: 28 }}>試吃組 4 月 1 日開放申請</p>
    <Footer />
  </section>
);

export default [Cover, Data, Closer];
