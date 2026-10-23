import { type DesignSystem, type Page, useSlidePageNumber } from '@open-slide/core';
import { CountUp, Stagger } from '@open-slide/core/motion';

export const design: DesignSystem = {
  palette: { bg: '#F6F1EA', text: '#2E2620', accent: '#C8643B' },
  fonts: {
    display: '"Noto Serif TC", "Songti TC", "PMingLiU", serif',
    body: '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", system-ui, sans-serif',
  },
  typeScale: { hero: 120, body: 32 },
  radius: 24,
};

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@700;900&family=Noto+Sans+TC:wght@400;500;700&display=swap';
const FONT_LINK_ID = 'osd-webfont-theme-cozy-home-shop';
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
  bg: '#F6F1EA',
  surface: '#FFFDF9',
  text: '#2E2620',
  muted: '#8A7D70',
  accent: '#C8643B',
  sage: '#6E8B6A',
  sale: '#D9483B',
  wood: '#E9DCCB',
  rule: '#E7DDD0',
};
const SERIF = '"Noto Serif TC", "Songti TC", "PMingLiU", serif';

const PAGE = {
  width: '100%',
  height: '100%',
  background: C.bg,
  color: C.text,
  padding: '96px 128px',
  boxSizing: 'border-box',
  position: 'relative',
  fontFamily: 'var(--osd-font-body)',
} as const;

const Title = ({ children }: { children: React.ReactNode }) => (
  <h1
    style={{
      fontFamily: '"Noto Serif TC", "Songti TC", "PMingLiU", serif',
      fontSize: 68,
      fontWeight: 700,
      lineHeight: 1.3,
      margin: 0,
      color: '#2E2620',
    }}
  >
    {children}
  </h1>
);

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: 128,
        right: 128,
        bottom: 40,
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 22,
        color: '#8A7D70',
        borderTop: '1px solid #E7DDD0',
        paddingTop: 16,
      }}
    >
      <span>溫暖居家選物 · 2026 春季</span>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>
        {current} / {total}
      </span>
    </div>
  );
};

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 26, fontWeight: 700, color: '#6E8B6A', letterSpacing: '0.12em' }}>
    {children}
  </div>
);

const ProductCard = ({
  image,
  name,
  spec,
  price,
  was,
  sale,
}: {
  image: React.ReactNode;
  name: string;
  spec: string;
  price: number;
  was?: number;
  sale?: string;
}) => (
  <div
    style={{
      background: '#FFFDF9',
      borderRadius: 24,
      overflow: 'hidden',
      boxShadow: '0 1px 0 #E7DDD0, 0 18px 40px -24px rgba(46, 38, 32, 0.35)',
      position: 'relative',
    }}
  >
    <div
      style={{
        height: 300,
        background: '#E9DCCB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {image}
    </div>
    {sale && (
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          background: '#D9483B',
          color: '#FFFFFF',
          fontSize: 22,
          fontWeight: 700,
          padding: '6px 16px',
          borderRadius: 999,
        }}
      >
        {sale}
      </div>
    )}
    <div style={{ padding: '24px 28px 28px' }}>
      <div style={{ fontSize: 32, fontWeight: 700 }}>{name}</div>
      <div style={{ fontSize: 22, color: '#8A7D70', marginTop: 6 }}>{spec}</div>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 14,
          marginTop: 16,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <span style={{ fontSize: 40, fontWeight: 700, color: '#C8643B' }}>
          NT$ {price.toLocaleString('en-US')}
        </span>
        {was && (
          <span style={{ fontSize: 24, color: '#8A7D70', textDecoration: 'line-through' }}>
            NT$ {was.toLocaleString('en-US')}
          </span>
        )}
      </div>
    </div>
  </div>
);

const Mug = () => (
  <svg width="180" height="180" viewBox="0 0 180 180" role="img" aria-label="馬克杯示意圖">
    <rect
      x="34"
      y="44"
      width="92"
      height="104"
      rx="18"
      fill="#FFFDF9"
      stroke="#2E2620"
      strokeWidth="4"
    />
    <path d="M126 70 h14 a20 20 0 0 1 0 40 h-14" fill="none" stroke="#2E2620" strokeWidth="4" />
    <rect x="34" y="44" width="92" height="22" rx="10" fill="#C8643B" />
  </svg>
);
const Towel = () => (
  <svg width="180" height="180" viewBox="0 0 180 180" role="img" aria-label="毛巾示意圖">
    <rect
      x="30"
      y="52"
      width="120"
      height="84"
      rx="14"
      fill="#FFFDF9"
      stroke="#2E2620"
      strokeWidth="4"
    />
    <path d="M30 80 H150 M30 108 H150" stroke="#6E8B6A" strokeWidth="6" />
  </svg>
);
const Candle = () => (
  <svg width="180" height="180" viewBox="0 0 180 180" role="img" aria-label="香氛蠟燭示意圖">
    <path d="M90 26 C102 42 100 56 90 62 C80 56 78 42 90 26 Z" fill="#C8643B" />
    <rect
      x="52"
      y="70"
      width="76"
      height="80"
      rx="12"
      fill="#FFFDF9"
      stroke="#2E2620"
      strokeWidth="4"
    />
    <rect x="52" y="98" width="76" height="22" fill="#E9DCCB" />
  </svg>
);

const Cover: Page = () => (
  <section style={{ ...PAGE, display: 'flex', alignItems: 'center', gap: 72 }}>
    <div style={{ flex: 1 }}>
      <Eyebrow>SPRING EDIT · 春季選物</Eyebrow>
      <h1
        style={{
          fontFamily: SERIF,
          fontSize: 120,
          fontWeight: 900,
          lineHeight: 1.2,
          margin: '28px 0 0',
        }}
      >
        讓家，
        <br />
        慢一點
      </h1>
      <p style={{ fontSize: 32, color: C.muted, marginTop: 24, lineHeight: 1.6 }}>
        2026 春季檔期提案｜廚房、寢具、香氛三大主題
      </p>
    </div>
    <div
      style={{
        width: 720,
        height: 720,
        borderRadius: 40,
        background: C.wood,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        placeItems: 'center',
        padding: 60,
        boxSizing: 'border-box',
      }}
    >
      <Mug />
      <Candle />
      <Towel />
      <Mug />
    </div>
    <Footer />
  </section>
);

const Products: Page = () => (
  <section style={PAGE}>
    <Eyebrow>本季主打</Eyebrow>
    <div style={{ marginTop: 16 }}>
      <Title>三件小物，撐起整個春季檔期</Title>
    </div>
    <Stagger
      effect="rise"
      interval={0.08}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 36, marginTop: 56 }}
    >
      <ProductCard image={<Mug />} name="手作陶土馬克杯" spec="350 ml・可微波" price={680} />
      <ProductCard
        image={<Candle />}
        name="木質調香氛蠟燭"
        spec="180 g・燃燒 40 小時"
        price={890}
        was={1180}
        sale="限時 75 折"
      />
      <ProductCard image={<Towel />} name="有機棉毛巾組" spec="2 入・吸水速乾" price={560} />
    </Stagger>
    <Footer />
  </section>
);

const Results: Page = () => (
  <section style={{ ...PAGE, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <Eyebrow>上一檔成績</Eyebrow>
    <div style={{ marginTop: 16 }}>
      <Title>冬季檔期回顧（示意數字）</Title>
    </div>
    <div style={{ display: 'flex', gap: 48, marginTop: 64 }}>
      {[
        { to: 12480, label: '訂單數', unit: '筆' },
        { to: 38, label: '回購率', unit: '%' },
        { to: 4.8, label: '平均評價', unit: '★', decimals: 1 },
      ].map((s) => (
        <div
          key={s.label}
          style={{
            flex: 1,
            background: C.surface,
            borderRadius: 24,
            padding: '44px 48px',
            boxShadow: `0 1px 0 ${C.rule}`,
          }}
        >
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 104,
              fontWeight: 900,
              color: C.accent,
              lineHeight: 1,
              whiteSpace: 'nowrap',
            }}
          >
            <CountUp to={s.to} decimals={s.decimals ?? 0} grouping />
            <span style={{ fontSize: 44, marginLeft: 8 }}>{s.unit}</span>
          </div>
          <div style={{ fontSize: 32, marginTop: 20 }}>{s.label}</div>
        </div>
      ))}
    </div>
    <Footer />
  </section>
);

export default [Cover, Products, Results];
