import {
  type DesignSystem,
  type Page,
  type SlideMeta,
  type SlideTransition,
  Step,
  Steps,
  useIsActivePage,
  useSlidePageNumber,
} from '@open-slide/core';
import { type CSSProperties, type ReactNode, useId } from 'react';

export const design: DesignSystem = {
  palette: { bg: '#EFE6D2', text: '#3A2414', accent: '#D4601C' },
  fonts: {
    display:
      '"Saira", "Eurostile Extended", "Microgramma D Extended", "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif',
    body: '"Courier Prime", "Courier New", "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", monospace',
  },
  typeScale: { hero: 176, body: 30 },
  radius: 6,
};

const INK = 'var(--osd-text)';
const ACCENT = 'var(--osd-accent)';
const BG = 'var(--osd-bg)';
const RUST = '#A63B1C';
const MUSTARD = '#D9A022';
const BROWN = '#5B3920';
const AVOCADO = '#6E7D2C';
const MUTED = '#86705A';
const SHEET = '#F7F1E3';
const PANEL = '#E3D6BA';
const PALE_MUSTARD = '#EACB80';
const RULE = 'rgba(58,36,20,0.22)';
const SPACE = '#2B1A0F';
const CONSOLE = '#2E1D12';
const LAMP_GO = '#B4CF4A';
const LAMP_AMBER = '#F2AE3E';

const SLIDE_ID = 'selene-4-mission-brief';
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Saira:wdth,wght@125,500;125,700;125,800&family=Courier+Prime:wght@400;700&display=swap';
const FONT_LINK_ID = `osd-webfont-${SLIDE_ID}`;
const STYLE_ID = `osd-styles-${SLIDE_ID}`;
const KEYFRAMES = `
@keyframes se-draw { from { stroke-dashoffset: 1 } to { stroke-dashoffset: 0 } }
@keyframes se-fillin { from { fill-opacity: 0 } to { fill-opacity: 1 } }
@keyframes se-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes se-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes se-growx { from { transform: scaleX(0) } to { transform: scaleX(1) } }
@keyframes se-growy { from { transform: scaleY(0) } to { transform: scaleY(1) } }
@keyframes se-lamp { 0% { opacity: 0 } 28% { opacity: 0.95 } 44% { opacity: 0.2 } 62% { opacity: 1 } 76% { opacity: 0.6 } 100% { opacity: 1 } }
@keyframes se-pop { 0% { opacity: 0; transform: scale(0.3) } 70% { opacity: 1; transform: scale(1.12) } 100% { opacity: 1; transform: scale(1) } }
@keyframes se-pulse { 0% { opacity: 0.8; transform: scale(1) } 100% { opacity: 0; transform: scale(3.2) } }
@keyframes se-blink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
@keyframes se-stamp { 0% { opacity: 0; transform: rotate(-9deg) scale(1.7) } 55% { opacity: 0.85; transform: rotate(-9deg) scale(0.97) } 100% { opacity: 0.8; transform: rotate(-9deg) scale(1) } }
@media (prefers-reduced-motion: reduce) { .se-m { animation: none !important; } }
`;

if (typeof document !== 'undefined') {
  let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  if (link.href !== FONT_HREF) link.href = FONT_HREF;

  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  if (style.textContent !== KEYFRAMES) style.textContent = KEYFRAMES;
}

const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
const EASE_IO = 'cubic-bezier(0.45, 0, 0.25, 1)';
const HOLD: Keyframe[] = [{ opacity: 1 }, { opacity: 1 }];

export const transition: SlideTransition = {
  duration: 260,
  exit: { duration: 260, easing: EASE_IN, keyframes: HOLD },
  enter: {
    duration: 260,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

const settle: SlideTransition = {
  duration: 280,
  exit: { duration: 280, easing: EASE_IN, keyframes: HOLD },
  enter: {
    duration: 280,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(12px)', filter: 'blur(4px)' },
      { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
    ],
  },
};

const noise = (size: number, freq: string, matrix: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><filter id='n' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='matrix' values='${matrix}'/></filter><rect width='${size}' height='${size}' filter='url(#n)'/></svg>`,
  )}")`;

const GRAIN = noise(220, '0.85', '0 0 0 0 0.24 0 0 0 0 0.15 0 0 0 0 0.08 0 0 0 1.7 -0.62');
const MOTTLE = noise(640, '0.006', '0 0 0 0 0.45 0 0 0 0 0.32 0 0 0 0 0.16 0 0 0 1.4 -0.45');

const abs = (left: number, top: number, extra?: CSSProperties): CSSProperties => ({
  position: 'absolute',
  left,
  top,
  ...extra,
});

const DISPLAY: CSSProperties = {
  fontFamily: 'var(--osd-font-display)',
  fontStretch: '125%',
};

const LABEL: CSSProperties = {
  ...DISPLAY,
  fontSize: 20,
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  lineHeight: 1.2,
};

const svgDisplay = (size: number, weight = 700, extra?: CSSProperties): CSSProperties => ({
  fontFamily: 'var(--osd-font-display)',
  fontStretch: '125%',
  fontWeight: weight,
  fontSize: size,
  ...extra,
});

const svgMono = (size: number, extra?: CSSProperties): CSSProperties => ({
  fontFamily: 'var(--osd-font-body)',
  fontSize: size,
  ...extra,
});

const KNOCK: CSSProperties = {
  paintOrder: 'stroke',
  stroke: BG,
  strokeWidth: 9,
  strokeLinejoin: 'round',
};

const two = (n: number) => String(n).padStart(2, '0');

const useUid = () => `se${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

const anim = (live: boolean, value: string): CSSProperties => (live ? { animation: value } : {});

const drawStyle = (live: boolean, delay: number, dur = 900): CSSProperties =>
  live
    ? {
        strokeDasharray: 1,
        animation: `se-draw ${dur}ms ${EASE_IO} ${delay}ms both, se-fillin ${Math.round(dur * 0.6)}ms ${EASE_OUT} ${delay + Math.round(dur * 0.5)}ms both`,
      }
    : {};

const rectD = (x: number, y: number, w: number, h: number) =>
  `M${x} ${y} H${x + w} V${y + h} H${x} Z`;

const starD = (r: number, inner = 0.42) => {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * inner;
    d += `${i === 0 ? 'M' : 'L'}${(Math.cos(a) * rr).toFixed(2)} ${(Math.sin(a) * rr).toFixed(2)} `;
  }
  return `${d}Z`;
};

const curveD = (pts: [number, number][]) => {
  const n = pts.length;
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    m.push((pts[i + 1][1] - pts[i][1]) / (pts[i + 1][0] - pts[i][0]));
  }
  const t: number[] = [m[0]];
  for (let i = 1; i < n - 1; i++) t.push(m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2);
  t.push(m[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    const a = t[i] / m[i];
    const b = t[i + 1] / m[i];
    const h = a * a + b * b;
    if (h > 9) {
      const k = 3 / Math.sqrt(h);
      t[i] = k * a * m[i];
      t[i + 1] = k * b * m[i];
    }
  }
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const dx = (x1 - x0) / 3;
    d += ` C${(x0 + dx).toFixed(1)} ${(y0 + t[i] * dx).toFixed(1)} ${(x1 - dx).toFixed(1)} ${(y1 - t[i + 1] * dx).toFixed(1)} ${x1} ${y1}`;
  }
  return d;
};

const PaperTexture = () => (
  <>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        backgroundImage: MOTTLE,
        backgroundSize: '640px 640px',
        opacity: 0.16,
        mixBlendMode: 'multiply',
        zIndex: 20,
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        backgroundImage: GRAIN,
        backgroundSize: '220px 220px',
        opacity: 0.32,
        mixBlendMode: 'multiply',
        zIndex: 20,
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background:
          'radial-gradient(ellipse 75% 70% at 50% 48%, rgba(120,78,36,0) 62%, rgba(120,78,36,0.13) 100%)',
        zIndex: 20,
      }}
    />
  </>
);

const TopBand = () => (
  <>
    <div
      style={abs(0, 46, {
        width: 1560,
        height: 40,
        clipPath: 'polygon(0 0, 100% 0, calc(100% - 40px) 100%, 0 100%)',
      })}
    >
      <div style={{ height: 7, background: MUSTARD }} />
      <div style={{ height: 4 }} />
      <div style={{ height: 7, background: ACCENT }} />
      <div style={{ height: 4 }} />
      <div style={{ height: 7, background: RUST }} />
      <div style={{ height: 4 }} />
      <div style={{ height: 7, background: BROWN }} />
    </div>
    <div
      style={abs(1560, 50, {
        width: 240,
        textAlign: 'right',
        ...DISPLAY,
        fontWeight: 800,
        fontSize: 26,
        lineHeight: 1,
        letterSpacing: '0.04em',
      })}
    >
      SELENE-4
    </div>
  </>
);

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={abs(120, 984, {
        width: 1680,
        display: 'flex',
        justifyContent: 'space-between',
        borderTop: `1.5px solid ${RULE}`,
        paddingTop: 14,
        fontSize: 19,
        color: MUTED,
        letterSpacing: '0.02em',
      })}
    >
      <span>MERIDIAN LUNAR SYSTEMS · 計畫內部文件</span>
      <span>MLS-S4-FRR-001 · REV C</span>
      <span>
        第 {two(current)} 頁，共 {two(total)} 頁
      </span>
    </div>
  );
};

const Sheet = ({ children, chrome = true }: { children: ReactNode; chrome?: boolean }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      isolation: 'isolate',
      background: BG,
      color: INK,
      fontFamily: 'var(--osd-font-body)',
    }}
  >
    {chrome && <TopBand />}
    {children}
    {chrome && <Footer />}
    <PaperTexture />
  </div>
);

const Header = ({
  n,
  kicker,
  title,
  aside,
}: {
  n: string;
  kicker: string;
  title: ReactNode;
  aside?: ReactNode;
}) => (
  <>
    <div style={abs(120, 128, { ...LABEL, color: ACCENT })}>
      {n} — {kicker}
    </div>
    <h2
      style={abs(116, 160, {
        ...DISPLAY,
        fontWeight: 700,
        fontSize: 62,
        lineHeight: 1.08,
        letterSpacing: '-0.01em',
        margin: 0,
        whiteSpace: 'nowrap',
      })}
    >
      {title}
    </h2>
    {aside && (
      <div
        style={abs(1300, 132, {
          width: 500,
          textAlign: 'right',
          fontSize: 22,
          lineHeight: 1.45,
          color: MUTED,
        })}
      >
        {aside}
      </div>
    )}
  </>
);

const Lamp = ({
  size = 34,
  color = LAMP_GO,
  live,
  delay = 0,
  bezel = BROWN,
}: {
  size?: number;
  color?: string;
  live: boolean;
  delay?: number;
  bezel?: string;
}) => (
  <div
    style={{
      position: 'relative',
      width: size,
      height: size,
      flexShrink: 0,
      borderRadius: '50%',
      background: `radial-gradient(circle at 40% 36%, #4A4326 0%, #1F1B0E 100%)`,
      boxShadow: `0 0 0 ${Math.round(size * 0.13)}px ${bezel}, inset 0 2px 4px rgba(0,0,0,0.6)`,
    }}
  >
    <div
      className="se-m"
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: `radial-gradient(circle at 38% 32%, #FFF8DA 0%, ${color} 34%, ${color} 68%, color-mix(in srgb, ${color} 62%, #000) 100%)`,
        boxShadow: `0 0 ${Math.round(size * 0.45)}px ${color}, 0 0 ${size}px color-mix(in srgb, ${color} 40%, transparent)`,
        ...anim(live, `se-lamp 620ms linear ${delay}ms both`),
      }}
    />
  </div>
);

const Patch = ({ size }: { size: number }) => {
  const uid = useUid();
  const top = `${uid}top`;
  const bot = `${uid}bot`;
  const clip = `${uid}clip`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="-300 -300 600 600"
      style={{ display: 'block', overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        <path id={top} d="M -222 0 A 222 222 0 0 1 222 0" />
        <path id={bot} d="M -252 0 A 252 252 0 0 0 252 0" />
        <clipPath id={clip}>
          <circle r="200" />
        </clipPath>
      </defs>
      <circle r="299" fill={BROWN} />
      <circle r="290" style={{ fill: BG }} />
      <circle r="283" fill={RUST} />
      <circle r="207" fill={MUSTARD} />
      <g clipPath={`url(#${clip})`}>
        <circle r="200" fill={SPACE} />
        <circle cx="-150" cy="-30" r="2.4" fill={SHEET} />
        <circle cx="-60" cy="-160" r="2" fill={SHEET} />
        <circle cx="20" cy="-120" r="1.6" fill={SHEET} />
        <circle cx="110" cy="-150" r="2.6" fill={SHEET} />
        <circle cx="150" cy="-60" r="1.8" fill={SHEET} />
        <circle cx="-30" cy="-60" r="1.6" fill={SHEET} />
        <circle cx="170" cy="40" r="2" fill={SHEET} />
        <circle cx="-170" cy="60" r="1.6" fill={SHEET} />
        <circle cx="80" cy="-40" r="1.4" fill={SHEET} />
        <path d={starD(9, 0.3)} transform="translate(60 -170)" fill={PALE_MUSTARD} />
        <path d={starD(7, 0.3)} transform="translate(-130 -130)" fill={PALE_MUSTARD} />
        <path
          d="M -230 120 C -170 -40, 40 -150, 196 -60"
          fill="none"
          stroke={MUSTARD}
          strokeWidth="11"
        />
        <path
          d="M -230 136 C -170 -24, 40 -134, 196 -44"
          fill="none"
          stroke="#D4601C"
          strokeWidth="11"
        />
        <path
          d="M -230 152 C -170 -8, 40 -118, 196 -28"
          fill="none"
          stroke={RUST}
          strokeWidth="11"
        />
        <circle cx="-104" cy="-92" r="34" fill="#7A5634" />
        <path d="M-104 -126 A34 34 0 0 0 -104 -58 A20 34 0 0 1 -104 -126 Z" fill={MUSTARD} />
        <circle cx="0" cy="520" r="380" fill="#E7DABD" />
        <ellipse cx="-90" cy="176" rx="34" ry="7" fill="none" stroke="#B9A47E" strokeWidth="3" />
        <ellipse cx="120" cy="188" rx="44" ry="9" fill="none" stroke="#B9A47E" strokeWidth="3" />
        <ellipse cx="-10" cy="226" rx="56" ry="12" fill="none" stroke="#B9A47E" strokeWidth="3" />
        <path d="M60 104 V140" stroke={MUSTARD} strokeWidth="3" strokeDasharray="5 6" />
        <g transform="translate(60 52) scale(1.5)">
          <path d="M-6 20 L6 20 L0 38 Z" fill="#D4601C" />
          <path d="M-4 10 L4 10 L8 20 L-8 20 Z" fill={MUSTARD} />
          <path d="M-12 8 L-24 26 M12 8 L24 26" stroke={SHEET} strokeWidth="2.4" />
          <path d="M-29 26 H-19 M19 26 H29" stroke={SHEET} strokeWidth="2.4" />
          <path d={rectD(-14, -8, 28, 18)} fill={SHEET} />
          <path d={rectD(-8, -16, 16, 8)} fill={MUSTARD} />
          <path d={rectD(-25, -14, 8, 22)} fill={PALE_MUSTARD} />
          <path d="M-17 -3 H-14" stroke={SHEET} strokeWidth="2" />
        </g>
      </g>
      <circle r="200" fill="none" stroke={BROWN} strokeWidth="3" />
      <text style={svgDisplay(46, 800, { letterSpacing: 10, fill: SHEET })}>
        <textPath href={`#${top}`} startOffset="50%" textAnchor="middle">
          SELENE-4
        </textPath>
      </text>
      <text style={svgDisplay(23, 700, { letterSpacing: 4, fill: SHEET })}>
        <textPath href={`#${bot}`} startOffset="50%" textAnchor="middle">
          MERIDIAN LUNAR · MMXXVI
        </textPath>
      </text>
      <path d={starD(11)} transform="translate(-244 6)" fill={MUSTARD} />
      <path d={starD(11)} transform="translate(244 6)" fill={MUSTARD} />
    </svg>
  );
};

const SweepStripe = ({
  r,
  color,
  delay,
  live,
  cx,
  cy,
}: {
  r: number;
  color: string;
  delay: number;
  live: boolean;
  cx: number;
  cy: number;
}) => (
  <path
    d={`M-20 ${cy - r} H${cx} A${r} ${r} 0 0 1 ${cx + r} ${cy} V1100`}
    pathLength={1}
    className="se-m"
    style={{
      fill: 'none',
      stroke: color,
      strokeWidth: 22,
      ...(live
        ? { strokeDasharray: 1, animation: `se-draw 1500ms ${EASE_IO} ${delay}ms both` }
        : {}),
    }}
  />
);

const MetaItem = ({ x, label, children }: { x: number; label: string; children: ReactNode }) => (
  <div style={abs(x, 896)}>
    <div style={{ ...LABEL, fontSize: 18, color: MUTED }}>{label}</div>
    <div style={{ fontSize: 26, marginTop: 10, lineHeight: 1.2 }}>{children}</div>
  </div>
);

const Cover: Page = () => {
  const live = useIsActivePage();
  return (
    <Sheet chrome={false}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={abs(0, 0)} aria-hidden="true">
        <SweepStripe r={250} color={MUSTARD} delay={100} live={live} cx={1440} cy={1010} />
        <SweepStripe r={222} color="#D4601C" delay={190} live={live} cx={1440} cy={1010} />
        <SweepStripe r={194} color={RUST} delay={280} live={live} cx={1440} cy={1010} />
        <SweepStripe r={166} color={BROWN} delay={370} live={live} cx={1440} cy={1010} />
      </svg>
      <div style={abs(120, 120, { fontSize: 24, letterSpacing: '0.06em', color: MUTED })}>
        MERIDIAN LUNAR SYSTEMS — 飛行整備審查
      </div>
      <h1
        style={abs(112, 186, {
          ...DISPLAY,
          margin: 0,
          fontWeight: 800,
          fontSize: 'var(--osd-size-hero)',
          lineHeight: 0.92,
          letterSpacing: '-0.01em',
          textShadow: '5px 3px 0 rgba(217,160,34,0.5)',
        })}
      >
        SELENE-4
      </h1>
      <div
        style={abs(120, 384, {
          ...DISPLAY,
          fontWeight: 700,
          fontSize: 50,
          lineHeight: 1.1,
          color: ACCENT,
        })}
      >
        飛行整備簡報
      </div>
      <div style={abs(120, 476, { fontSize: 'var(--osd-size-body)', lineHeight: 1.5 })}>
        KESTREL 登陸器前往月球南極。
        <br />
        2026年11月4日發射 · Perseus 2 · LC-2。
      </div>
      <div
        className="se-m"
        style={abs(1250, 110, {
          width: 520,
          height: 520,
          ...anim(live, `se-rise 900ms ${EASE_OUT} 300ms both`),
        })}
      >
        <Patch size={520} />
      </div>
      <MetaItem x={120} label="文件編號">
        MLS-S4-FRR-001 Rev C
      </MetaItem>
      <MetaItem x={560} label="簡報時間">
        2026年10月12日 · 12:00 UTC
      </MetaItem>
      <MetaItem x={1000} label="報告人">
        R. Okafor，任務總監
      </MetaItem>
    </Sheet>
  );
};
Cover.transition = settle;

const MemoLine = ({ k, children }: { k: string; children: ReactNode }) => (
  <div style={{ display: 'flex', fontSize: 28, lineHeight: 1.5 }}>
    <span style={{ width: 130, fontWeight: 700, flexShrink: 0 }}>{k}</span>
    <span>{children}</span>
  </div>
);

const MemoStat = ({ value, unit, label }: { value: string; unit: string; label: string }) => (
  <div style={{ borderTop: `3px solid ${INK}`, paddingTop: 16 }}>
    <div style={{ ...DISPLAY, fontWeight: 800, fontSize: 64, lineHeight: 1 }}>
      {value}
      <span style={{ fontSize: 30, fontWeight: 700, marginLeft: 12, color: ACCENT }}>{unit}</span>
    </div>
    <div style={{ fontSize: 24, marginTop: 10, color: MUTED }}>{label}</div>
  </div>
);

const Memo: Page = () => {
  const live = useIsActivePage();
  return (
    <Sheet>
      <Header n="01" kicker="目的" title="只需要一項決定。" />
      <div
        style={abs(120, 300, {
          width: 1040,
          height: 620,
          boxSizing: 'border-box',
          padding: '44px 52px',
          background: SHEET,
          transform: 'rotate(-0.6deg)',
          boxShadow: '0 2px 0 rgba(58,36,20,0.08), 0 18px 40px -18px rgba(58,36,20,0.35)',
          borderLeft: `10px solid ${ACCENT}`,
        })}
      >
        <div style={{ ...LABEL, fontSize: 18, color: MUTED, marginBottom: 18 }}>
          備忘錄 · MLS-S4-FRR-001
        </div>
        <MemoLine k="收文：">SELENE-4 飛行整備委員會</MemoLine>
        <MemoLine k="發文：">R. Okafor，任務總監</MemoLine>
        <MemoLine k="日期：">2026年10月12日</MemoLine>
        <MemoLine k="主旨：">發射整備狀態（2026年11月4日）</MemoLine>
        <div style={{ height: 2, background: INK, opacity: 0.5, margin: '22px 0 24px' }} />
        <p style={{ margin: 0, fontSize: 'var(--osd-size-body)', lineHeight: 1.5 }}>
          請委員會做出一項決議：批准 <span style={{ whiteSpace: 'nowrap' }}>SELENE-4</span> 於
          11月4日發射。十二個控制台的待辦項目均已結案；另有兩項風險仍未結案，以減緩措施因應，而非申請豁免。
        </p>
        <div style={{ fontSize: 28, marginTop: 22 }}>
          — R.O.
          <span
            className="se-m"
            style={{
              display: 'inline-block',
              width: 16,
              height: 30,
              marginLeft: 10,
              verticalAlign: 'text-bottom',
              background: INK,
              ...anim(live, 'se-blink 1.1s steps(1) 1.4s infinite'),
            }}
          />
        </div>
        <div
          className="se-m"
          style={{
            position: 'absolute',
            right: 56,
            bottom: 52,
            padding: '10px 22px',
            border: `5px solid ${RUST}`,
            color: RUST,
            ...DISPLAY,
            fontWeight: 800,
            fontSize: 36,
            letterSpacing: '0.08em',
            transform: 'rotate(-9deg)',
            opacity: 0.8,
            mixBlendMode: 'multiply',
            ...anim(live, `se-stamp 520ms ${EASE_OUT} 700ms both`),
          }}
        >
          待決議
        </div>
      </div>
      <div
        style={abs(1260, 300, {
          width: 540,
          display: 'flex',
          flexDirection: 'column',
          gap: 34,
        })}
      >
        <MemoStat value="1,840" unit="kg" label="KESTREL 分離時濕重" />
        <MemoStat value="4.6" unit="天" label="地月轉移（直接航程）" />
        <MemoStat value="11.5" unit="分鐘" label="動力下降至著陸" />
        <MemoStat value="10" unit="天" label="月面作業（最低天數）" />
      </div>
    </Sheet>
  );
};

const Objective = ({
  n,
  tier,
  title,
  detail,
  metric,
}: {
  n: string;
  tier: 'Primary' | 'Secondary';
  title: string;
  detail: string;
  metric: string;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 40,
      height: 150,
      borderTop: `2px solid ${RULE}`,
    }}
  >
    <div
      style={{
        ...DISPLAY,
        width: 120,
        fontWeight: 800,
        fontSize: 64,
        color: tier === 'Primary' ? ACCENT : MUSTARD,
        lineHeight: 1,
      }}
    >
      {n}
    </div>
    <div style={{ flex: 1 }}>
      <div
        style={{
          ...LABEL,
          fontSize: 18,
          display: 'inline-block',
          padding: '3px 10px',
          border: `2px solid ${INK}`,
          background: tier === 'Primary' ? INK : 'transparent',
          color: tier === 'Primary' ? BG : INK,
        }}
      >
        {tier === 'Primary' ? '主要目標' : '次要目標'}
      </div>
      <div style={{ ...DISPLAY, fontWeight: 700, fontSize: 34, marginTop: 10, lineHeight: 1.15 }}>
        {title}
      </div>
      <div style={{ fontSize: 28, marginTop: 6, lineHeight: 1.3, color: MUTED }}>{detail}</div>
    </div>
    <div style={{ width: 300, textAlign: 'right' }}>
      <div style={{ ...LABEL, fontSize: 18, color: MUTED }}>最低成功標準</div>
      <div style={{ ...DISPLAY, fontWeight: 800, fontSize: 52, lineHeight: 1.1, marginTop: 4 }}>
        {metric}
      </div>
    </div>
  </div>
);

const Objectives: Page = () => (
  <Sheet>
    <Header n="02" kicker="任務目標" title="怎樣才算成功。" />
    <div style={abs(120, 300, { width: 1680, borderBottom: `2px solid ${RULE}` })}>
      <Steps>
        <Step>
          <Objective
            n="01"
            tier="Primary"
            title="於著陸點 04 精準軟著陸"
            detail="觸地點距目標 100 m 內，垂直速度低於 2 m/s。"
            metric="≤ 100 m"
          />
        </Step>
        <Step>
          <Objective
            n="02"
            tier="Primary"
            title="送達七項酬載並供電"
            detail="412 kg 酬載送抵月面，供電持續十個地球日。"
            metric="10 天"
          />
        </Step>
        <Step>
          <Objective
            n="03"
            tier="Secondary"
            title="量測表層一公尺內的水冰"
            detail="PRISM 鑽具每隔 10 cm 取樣月壤，深達 1 m。"
            metric="1.0 m"
          />
        </Step>
        <Step>
          <Objective
            n="04"
            tier="Secondary"
            title="驅動 PIKA 進入永久陰影區"
            detail="由斜坡行駛 400 m，抵達 de Gerlache 邊緣永久陰影區。"
            metric="400 m"
          />
        </Step>
      </Steps>
    </div>
  </Sheet>
);

const ConsoleCard = ({
  pos,
  call,
  duty,
  lead,
  staff,
  stripe,
  live,
  delay,
}: {
  pos: string;
  call: string;
  duty: string;
  lead: string;
  staff: string;
  stripe: string;
  live: boolean;
  delay: number;
}) => (
  <div
    className="se-m"
    style={{
      position: 'relative',
      height: 290,
      boxSizing: 'border-box',
      padding: '30px 30px 26px',
      background: SHEET,
      borderTop: `10px solid ${stripe}`,
      boxShadow: `inset 0 0 0 2px ${RULE}`,
      ...anim(live, `se-rise 600ms ${EASE_OUT} ${delay}ms both`),
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 20, color: MUTED, letterSpacing: '0.06em' }}>{pos}</span>
      <Lamp size={22} live={live} delay={delay + 500} />
    </div>
    <div style={{ ...DISPLAY, fontWeight: 800, fontSize: 44, lineHeight: 1.1, marginTop: 14 }}>
      {call}
    </div>
    <div style={{ fontSize: 22, color: MUTED, marginTop: 4 }}>{duty}</div>
    <div style={{ height: 2, background: RULE, margin: '22px 0 18px' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ fontSize: 28, fontWeight: 700 }}>{lead}</span>
      <span style={{ fontSize: 20, color: MUTED }}>{staff}</span>
    </div>
  </div>
);

const Teams: Page = () => {
  const live = useIsActivePage();
  return (
    <Sheet>
      <Header
        n="03"
        kicker="飛行團隊"
        title="八個控制台，同一間控制室。"
        aside={
          <>
            任務營運中心，Tucson AZ
            <br />
            三班制 · 輪值人員 112 名
          </>
        }
      />
      <div
        style={abs(120, 300, {
          width: 1680,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 36,
        })}
      >
        <ConsoleCard
          pos="C-01"
          call="FLIGHT"
          duty="飛行總監"
          lead="T. Ibarra"
          staff="9 人"
          stripe={ACCENT}
          live={live}
          delay={0}
        />
        <ConsoleCard
          pos="C-02"
          call="FDO"
          duty="飛行動力"
          lead="K. Nakamura"
          staff="14 人"
          stripe={RUST}
          live={live}
          delay={90}
        />
        <ConsoleCard
          pos="C-03"
          call="GNC"
          duty="導引、導航與控制"
          lead="S. Adeyemi"
          staff="18 人"
          stripe={MUSTARD}
          live={live}
          delay={180}
        />
        <ConsoleCard
          pos="C-04"
          call="PROP"
          duty="推進系統"
          lead="L. Varga"
          staff="12 人"
          stripe={BROWN}
          live={live}
          delay={270}
        />
        <ConsoleCard
          pos="C-05"
          call="POWER"
          duty="電力與熱控"
          lead="M. Duarte"
          staff="15 人"
          stripe={MUSTARD}
          live={live}
          delay={360}
        />
        <ConsoleCard
          pos="C-06"
          call="COMM"
          duty="通訊與地面站"
          lead="J. Whitfield"
          staff="16 人"
          stripe={BROWN}
          live={live}
          delay={450}
        />
        <ConsoleCard
          pos="C-07"
          call="PAYLOAD"
          duty="酬載作業"
          lead="A. Rahimi"
          staff="17 人"
          stripe={ACCENT}
          live={live}
          delay={540}
        />
        <ConsoleCard
          pos="C-08"
          call="SURFACE"
          duty="月面與月球車作業"
          lead="E. Lindqvist"
          staff="11 人"
          stripe={RUST}
          live={live}
          delay={630}
        />
      </div>
    </Sheet>
  );
};

const Callout = ({
  x,
  y,
  toY,
  title,
  detail,
  align = 'left',
  live,
  delay,
}: {
  x: number;
  y: number;
  toY: number;
  title: string;
  detail: string;
  align?: 'left' | 'right';
  live: boolean;
  delay: number;
}) => (
  <g className="se-m" style={anim(live, `se-fade 500ms ${EASE_OUT} ${delay}ms both`)}>
    <path d={`M${x} ${y - 30} V${toY}`} style={{ stroke: INK, strokeWidth: 2 }} />
    <circle cx={x} cy={toY} r={5} style={{ fill: ACCENT }} />
    <text
      x={align === 'left' ? x + 14 : x - 14}
      y={y - 10}
      textAnchor={align === 'left' ? 'start' : 'end'}
      style={svgDisplay(20, 700, { letterSpacing: 3, fill: ACCENT })}
    >
      {title}
    </text>
    <text
      x={align === 'left' ? x + 14 : x - 14}
      y={y + 22}
      textAnchor={align === 'left' ? 'start' : 'end'}
      style={svgMono(24, { fill: INK })}
    >
      {detail}
    </text>
  </g>
);

const DimSeg = ({
  x1,
  x2,
  y,
  label,
  live,
  delay,
}: {
  x1: number;
  x2: number;
  y: number;
  label: string;
  live: boolean;
  delay: number;
}) => (
  <g>
    <path
      d={`M${x1} ${y} H${x2}`}
      pathLength={1}
      className="se-m"
      style={{ stroke: INK, strokeWidth: 2, fill: 'none', ...drawStyle(live, delay, 600) }}
    />
    <path
      d={`M${x1} ${y - 12} V${y + 12} M${x2} ${y - 12} V${y + 12}`}
      style={{ stroke: INK, strokeWidth: 2 }}
    />
    <text
      x={(x1 + x2) / 2}
      y={y - 12}
      textAnchor="middle"
      className="se-m"
      style={{
        ...svgMono(22, { fill: INK, fontWeight: 700 }),
        ...anim(live, `se-fade 400ms ${EASE_OUT} ${delay + 400}ms both`),
      }}
    >
      {label}
    </text>
  </g>
);

const VehicleStat = ({ value, label }: { value: string; label: string }) => (
  <div style={{ borderLeft: `6px solid ${ACCENT}`, paddingLeft: 22 }}>
    <div style={{ ...DISPLAY, fontWeight: 800, fontSize: 56, lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 22, color: MUTED, marginTop: 10 }}>{label}</div>
  </div>
);

const Vehicle: Page = () => {
  const live = useIsActivePage();
  const C = 590;
  return (
    <Sheet>
      <Header
        n="04"
        kicker="運載火箭"
        title="Perseus 2，Block B 型。"
        aside={
          <>
            側視圖，箭頭朝右
            <br />
            比例 1 : 140 · 此型第 12 次飛行
          </>
        }
      />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={abs(0, 0)} aria-hidden="true">
        <g className="se-m" style={anim(live, `se-rise 700ms ${EASE_OUT} 0ms both`)}>
          <path
            d={`M193 ${C - 40} L148 ${C - 52} Q142 ${C - 34} 148 ${C - 16} L193 ${C - 24} Z`}
            style={{ fill: PANEL, stroke: INK, strokeWidth: 2.5 }}
          />
          <path
            d={`M193 ${C - 9} L146 ${C - 20} Q140 ${C} 146 ${C + 20} L193 ${C + 9} Z`}
            style={{ fill: PANEL, stroke: INK, strokeWidth: 2.5 }}
          />
          <path
            d={`M193 ${C + 24} L148 ${C + 16} Q142 ${C + 34} 148 ${C + 52} L193 ${C + 40} Z`}
            style={{ fill: PANEL, stroke: INK, strokeWidth: 2.5 }}
          />
          <path
            d={rectD(193, C - 49, 901, 98)}
            style={{ fill: SHEET, stroke: INK, strokeWidth: 3 }}
          />
          <path d={rectD(193, C - 49, 30, 49)} style={{ fill: INK }} />
          <path d={rectD(223, C, 30, 49)} style={{ fill: INK }} />
          <path d={rectD(193, C, 30, 49)} style={{ fill: 'none', stroke: INK, strokeWidth: 3 }} />
          <path d={`M270 ${C + 20} H1070`} style={{ stroke: MUSTARD, strokeWidth: 7 }} />
          <path d={`M270 ${C + 29} H1070`} style={{ stroke: ACCENT, strokeWidth: 7 }} />
          <path d={`M270 ${C + 38} H1070`} style={{ stroke: RUST, strokeWidth: 7 }} />
          <text x={300} y={C + 6} style={svgDisplay(48, 800, { fill: RUST, letterSpacing: 8 })}>
            PERSEUS
          </text>
          <path
            d={`M760 ${C - 49} V${C + 49} M960 ${C - 49} V${C + 49}`}
            style={{ stroke: INK, strokeWidth: 1.5, opacity: 0.5 }}
          />
          <path
            d={rectD(1094, C - 49, 106, 98)}
            style={{ fill: BROWN, stroke: INK, strokeWidth: 3 }}
          />
          <path
            d={`M1120 ${C - 49} V${C + 49} M1147 ${C - 49} V${C + 49} M1174 ${C - 49} V${C + 49}`}
            style={{ stroke: SHEET, strokeWidth: 1.5, opacity: 0.4 }}
          />
          <path
            d={rectD(1200, C - 49, 245, 98)}
            style={{ fill: SHEET, stroke: INK, strokeWidth: 3 }}
          />
          <path d={rectD(1380, C - 49, 24, 98)} style={{ fill: MUSTARD }} />
          <text x={1222} y={C + 10} style={svgDisplay(26, 800, { fill: INK, letterSpacing: 4 })}>
            S-II
          </text>
          <path
            d={`M1445 ${C - 49} L1465 ${C - 66} H1600 C1690 ${C - 66} 1750 ${C - 30} 1778 ${C} C1750 ${C + 30} 1690 ${C + 66} 1600 ${C + 66} H1465 L1445 ${C + 49} Z`}
            style={{ fill: SHEET, stroke: INK, strokeWidth: 3 }}
          />
          <path
            d={rectD(1490, C - 50, 180, 100)}
            style={{ fill: PANEL, stroke: INK, strokeWidth: 2, strokeDasharray: '8 6' }}
          />
          <path
            d={rectD(1556, C - 30, 70, 60)}
            style={{ fill: SHEET, stroke: INK, strokeWidth: 2.5 }}
          />
          <path
            d={`M1556 ${C - 18} L1520 ${C - 10} L1520 ${C + 10} L1556 ${C + 18} Z`}
            style={{ fill: MUSTARD, stroke: INK, strokeWidth: 2 }}
          />
          <path
            d={`M1626 ${C - 24} L1652 ${C - 40} M1626 ${C + 24} L1652 ${C + 40}`}
            style={{ stroke: INK, strokeWidth: 2.5 }}
          />
          <path
            d={rectD(1626, C - 14, 18, 28)}
            style={{ fill: MUSTARD, stroke: INK, strokeWidth: 2 }}
          />
        </g>
        <Callout
          x={640}
          y={440}
          toY={C - 49}
          title="第一節"
          detail="7 × VR-1 · 4,120 kN"
          live={live}
          delay={500}
        />
        <Callout
          x={1147}
          y={290}
          toY={C - 49}
          title="級間段"
          detail="分離環"
          live={live}
          delay={650}
        />
        <Callout
          x={1322}
          y={440}
          toY={C - 49}
          title="第二節"
          detail="1 × VR-2 Vac · 118 kN"
          live={live}
          delay={800}
        />
        <Callout
          x={1700}
          y={362}
          toY={C - 50}
          title="整流罩 + KESTREL"
          detail="5.0 m Ø · 登陸器 1,840 kg"
          align="right"
          live={live}
          delay={950}
        />
        <path
          d={`M140 ${C + 60} V${C + 136} M1778 ${C} V${C + 196}`}
          style={{ stroke: INK, strokeWidth: 1, strokeDasharray: '4 5', opacity: 0.6 }}
        />
        <DimSeg x1={140} x2={1094} y={700} label="36.0 m" live={live} delay={900} />
        <DimSeg x1={1094} x2={1200} y={700} label="4.0" live={live} delay={1100} />
        <DimSeg x1={1200} x2={1445} y={700} label="9.2 m" live={live} delay={1250} />
        <DimSeg x1={1445} x2={1778} y={700} label="12.6 m" live={live} delay={1400} />
        <DimSeg x1={140} x2={1778} y={770} label="全長 61.8 m" live={live} delay={1600} />
      </svg>
      <div
        style={abs(120, 840, {
          width: 1680,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 40,
        })}
      >
        <VehicleStat value="412 t" label="起飛質量" />
        <VehicleStat value="8.6 t" label="低地球軌道酬載" />
        <VehicleStat value="2.3 t" label="地月轉移軌道酬載" />
        <VehicleStat value="11 / 11" label="歷次飛行，全數成功" />
      </div>
    </Sheet>
  );
};

const Bubble = ({
  n,
  bx,
  by,
  tx,
  ty,
  live,
  delay,
}: {
  n: number;
  bx: number;
  by: number;
  tx: number;
  ty: number;
  live: boolean;
  delay: number;
}) => (
  <g className="se-m" style={anim(live, `se-fade 400ms ${EASE_OUT} ${delay}ms both`)}>
    <path d={`M${tx} ${ty} L${bx} ${by}`} style={{ stroke: ACCENT, strokeWidth: 2 }} />
    <circle cx={tx} cy={ty} r={4} style={{ fill: ACCENT }} />
    <circle cx={bx} cy={by} r={19} style={{ fill: ACCENT }} />
    <text x={bx} y={by + 7} textAnchor="middle" style={svgDisplay(20, 800, { fill: SHEET })}>
      {n}
    </text>
  </g>
);

const Ink = ({
  d,
  live,
  delay,
  fill = 'none',
  w = 3,
  dur = 900,
}: {
  d: string;
  live: boolean;
  delay: number;
  fill?: string;
  w?: number;
  dur?: number;
}) => (
  <path
    d={d}
    pathLength={1}
    className="se-m"
    style={{
      fill,
      stroke: INK,
      strokeWidth: w,
      strokeLinejoin: 'round',
      strokeLinecap: 'round',
      ...drawStyle(live, delay, dur),
    }}
  />
);

const Hidden = ({ d, live, delay }: { d: string; live: boolean; delay: number }) => (
  <path
    d={d}
    className="se-m"
    style={{
      fill: 'none',
      stroke: INK,
      strokeWidth: 2,
      strokeDasharray: '9 7',
      opacity: 0.7,
      ...anim(live, `se-fade 500ms ${EASE_OUT} ${delay}ms both`),
    }}
  />
);

const LegendItem = ({ n, name, spec }: { n: number; name: string; spec: string }) => (
  <div style={{ display: 'flex', gap: 22, alignItems: 'flex-start' }}>
    <div
      style={{
        ...DISPLAY,
        width: 38,
        height: 38,
        flexShrink: 0,
        borderRadius: '50%',
        background: ACCENT,
        color: SHEET,
        fontWeight: 800,
        fontSize: 19,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {n}
    </div>
    <div>
      <div style={{ ...LABEL, fontSize: 19, letterSpacing: '0.12em' }}>{name}</div>
      <div style={{ fontSize: 26, color: MUTED, marginTop: 4 }}>{spec}</div>
    </div>
  </div>
);

const Lander: Page = () => {
  const live = useIsActivePage();
  const uid = useUid();
  return (
    <Sheet>
      <Header n="05" kicker="登陸器" title="KESTREL 正視圖。" />
      <svg
        width={1000}
        height={700}
        viewBox="0 0 1000 700"
        style={abs(120, 262)}
        aria-hidden="true"
      >
        <defs>
          <pattern id={`${uid}dots`} width="25" height="25" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="rgba(58,36,20,0.16)" />
          </pattern>
        </defs>
        <rect x="0" y="40" width="1000" height="560" fill={`url(#${uid}dots)`} />
        <path d="M30 600 H970" style={{ stroke: INK, strokeWidth: 3 }} />
        <path
          d={Array.from({ length: 47 }, (_, i) => `M${40 + i * 20} 602 l-12 14`).join(' ')}
          style={{ stroke: INK, strokeWidth: 1.5, opacity: 0.5 }}
        />
        <Ink d={rectD(176, 170, 120, 260)} fill={PALE_MUSTARD} live={live} delay={500} />
        <path
          d="M206 170 V430 M236 170 V430 M266 170 V430 M176 202.5 H296 M176 235 H296 M176 267.5 H296 M176 300 H296 M176 332.5 H296 M176 365 H296 M176 397.5 H296"
          className="se-m"
          style={{
            stroke: INK,
            strokeWidth: 1.2,
            opacity: 0.55,
            ...anim(live, `se-fade 500ms ${EASE_OUT} 1200ms both`),
          }}
        />
        <Ink d="M296 350 H350" w={6} live={live} delay={400} dur={300} />
        <Ink d="M350 410 L290 478" w={7} live={live} delay={300} dur={400} />
        <Ink d="M290 478 L196 584 M372 470 L196 584" live={live} delay={500} dur={500} />
        <Ink d="M650 410 L710 478" w={7} live={live} delay={300} dur={400} />
        <Ink d="M710 478 L804 584 M628 470 L804 584" live={live} delay={500} dur={500} />
        <Ink
          d="M150 590 A40 9 0 1 0 230 590 A40 9 0 1 0 150 590 Z"
          fill={PANEL}
          live={live}
          delay={900}
          dur={400}
        />
        <Ink
          d="M770 590 A40 9 0 1 0 850 590 A40 9 0 1 0 770 590 Z"
          fill={PANEL}
          live={live}
          delay={900}
          dur={400}
        />
        <Ink
          d="M370 300 H630 L650 320 V450 L630 470 H370 L350 450 V320 Z"
          fill={SHEET}
          live={live}
          delay={0}
          dur={1000}
        />
        <g className="se-m" style={anim(live, `se-fade 500ms ${EASE_OUT} 900ms both`)}>
          <path d="M350 336 H650" style={{ stroke: MUSTARD, strokeWidth: 6 }} />
          <path d="M350 344 H650" style={{ stroke: ACCENT, strokeWidth: 6 }} />
          <path d="M350 352 H650" style={{ stroke: RUST, strokeWidth: 6 }} />
          <path
            d="M450 360 V470 M550 360 V470"
            style={{ stroke: INK, strokeWidth: 1.2, opacity: 0.5 }}
          />
          <path
            d="M346 312 L332 304 M346 312 L332 320 M654 312 L668 304 M654 312 L668 320"
            style={{ stroke: INK, strokeWidth: 2.5 }}
          />
        </g>
        <Hidden d="M482 395 A52 52 0 1 0 378 395 A52 52 0 1 0 482 395 Z" live={live} delay={1300} />
        <Hidden d="M622 395 A52 52 0 1 0 518 395 A52 52 0 1 0 622 395 Z" live={live} delay={1350} />
        <Hidden d="M600 300 V560" live={live} delay={1400} />
        <Ink d="M470 470 H530 L524 486 H476 Z" fill={PANEL} live={live} delay={600} dur={300} />
        <Ink
          d="M482 486 C480 516 466 536 452 556 L548 556 C534 536 520 516 518 486 Z"
          fill={PANEL}
          live={live}
          delay={700}
          dur={600}
        />
        <Ink d={rectD(388, 258, 80, 28)} fill={PANEL} live={live} delay={800} dur={400} />
        <Ink
          d="M393 292 A9 9 0 1 0 411 292 A9 9 0 1 0 393 292 Z M445 292 A9 9 0 1 0 463 292 A9 9 0 1 0 445 292 Z"
          fill={INK}
          live={live}
          delay={900}
          dur={300}
        />
        <Ink d="M456 258 V244 M450 244 H462 V236 H450 Z" live={live} delay={1000} dur={300} />
        <Ink d={rectD(480, 244, 80, 56)} fill={SHEET} live={live} delay={800} dur={400} />
        <Ink d={rectD(500, 222, 40, 22)} fill={MUSTARD} live={live} delay={900} dur={300} />
        <Ink
          d="M513 233 A7 7 0 1 0 527 233 A7 7 0 1 0 513 233 Z"
          fill={INK}
          live={live}
          delay={1000}
          dur={200}
        />
        <Ink d={rectD(592, 150, 16, 150)} fill={SHEET} live={live} delay={800} dur={500} />
        <Ink d={rectD(580, 124, 40, 28)} fill={MUSTARD} live={live} delay={1000} dur={300} />
        <Ink d="M370 300 V196" w={4} live={live} delay={800} dur={300} />
        <Ink d="M332 166 Q 360 214 410 190" w={5} live={live} delay={1000} dur={400} />
        <Ink d="M370 192 L350 158" w={2} live={live} delay={1100} dur={200} />
        <circle cx="350" cy="156" r="5" style={{ fill: INK }} />
        <g className="se-m" style={anim(live, `se-fade 600ms ${EASE_OUT} 1500ms both`)}>
          <path
            d="M628 124 H944 M860 600 H944"
            style={{ stroke: INK, strokeWidth: 1, strokeDasharray: '4 5', opacity: 0.7 }}
          />
          <path d="M930 128 V596" style={{ stroke: INK, strokeWidth: 2 }} />
          <path d="M930 124 l-7 16 h14 Z M930 600 l-7 -16 h14 Z" style={{ fill: INK }} />
          <text
            x={918}
            y={362}
            textAnchor="middle"
            transform="rotate(-90 918 362)"
            style={{ ...svgMono(22, { fill: INK, fontWeight: 700 }), ...KNOCK }}
          >
            3.92 m
          </text>
          <path
            d="M150 600 V662 M850 600 V662"
            style={{ stroke: INK, strokeWidth: 1, strokeDasharray: '4 5', opacity: 0.7 }}
          />
          <path d="M154 648 H846" style={{ stroke: INK, strokeWidth: 2 }} />
          <path d="M150 648 l16 -7 v14 Z M850 648 l-16 -7 v14 Z" style={{ fill: INK }} />
          <text
            x={500}
            y={636}
            textAnchor="middle"
            style={svgMono(22, { fill: INK, fontWeight: 700 })}
          >
            4.60 m 著陸腳間距
          </text>
          <text x={0} y={694} style={svgMono(18, { fill: MUTED })}>
            圖號 DWG KS-100-A · 正視圖 · 比例 1:40 · 尺寸單位：公尺
          </text>
        </g>
        <Bubble n={1} bx={650} by={545} tx={528} ty={530} live={live} delay={1700} />
        <Bubble n={2} bx={740} by={420} tx={600} ty={425} live={live} delay={1800} />
        <Bubble n={3} bx={110} by={140} tx={220} ty={240} live={live} delay={1900} />
        <Bubble n={4} bx={280} by={100} tx={350} ty={156} live={live} delay={2000} />
        <Bubble n={5} bx={730} by={170} tx={620} ty={140} live={live} delay={2100} />
        <Bubble n={6} bx={450} by={110} tx={430} ty={258} live={live} delay={2200} />
        <Bubble n={7} bx={110} by={540} tx={250} ty={522} live={live} delay={2300} />
        <Bubble n={8} bx={560} by={80} tx={526} ty={222} live={live} delay={2400} />
      </svg>
      <div
        style={abs(1190, 296, {
          width: 610,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        })}
      >
        <LegendItem n={1} name="主引擎" spec="VR-L，節流範圍 4.4–22 kN" />
        <LegendItem n={2} name="推進劑儲槽" spec="MMH / MON-3 · 1,230 kg" />
        <LegendItem n={3} name="垂直式太陽能板" spec="1.6 kW（太陽仰角 1.5°）" />
        <LegendItem n={4} name="高增益天線" spec="Ka 頻段，對地 20 Mbps" />
        <LegendItem n={5} name="PRISM 鑽具" spec="旋轉衝擊式，深 1.0 m" />
        <LegendItem n={6} name="PIKA 月球車" spec="22 kg，經斜坡駛出" />
        <LegendItem n={7} name="著陸腳" spec="4 × 可壓潰蜂巢結構" />
        <LegendItem n={8} name="障礙偵測 LIDAR" spec="250 m 外可辨識 40 cm 障礙" />
      </div>
    </Sheet>
  );
};

const Trace = ({
  d,
  dash,
  color,
  w,
  live,
  delay,
  dur,
}: {
  d: string;
  dash?: string;
  color: string;
  w: number;
  live: boolean;
  delay: number;
  dur: number;
}) => {
  const uid = useUid();
  return (
    <g>
      <defs>
        <mask id={uid} maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080">
          <path
            d={d}
            pathLength={1}
            className="se-m"
            style={{
              fill: 'none',
              stroke: '#fff',
              strokeWidth: w + 10,
              ...(live
                ? { strokeDasharray: 1, animation: `se-draw ${dur}ms ${EASE_IO} ${delay}ms both` }
                : {}),
            }}
          />
        </mask>
      </defs>
      <path
        d={d}
        mask={`url(#${uid})`}
        style={{
          fill: 'none',
          stroke: color,
          strokeWidth: w,
          strokeDasharray: dash,
          strokeLinecap: 'round',
        }}
      />
    </g>
  );
};

const Marker = ({
  x,
  y,
  live,
  delay,
  children,
}: {
  x: number;
  y: number;
  live: boolean;
  delay: number;
  children?: ReactNode;
}) => (
  <g className="se-m" style={anim(live, `se-fade 400ms ${EASE_OUT} ${delay}ms both`)}>
    <circle cx={x} cy={y} r={13} style={{ fill: BG, stroke: INK, strokeWidth: 3 }} />
    <circle cx={x} cy={y} r={6} style={{ fill: ACCENT }} />
    {children}
  </g>
);

const EventTile = ({
  t,
  title,
  detail,
  live,
  delay,
}: {
  t: string;
  title: string;
  detail: string;
  live: boolean;
  delay: number;
}) => (
  <div
    className="se-m"
    style={{
      borderTop: `4px solid ${INK}`,
      paddingTop: 14,
      ...anim(live, `se-rise 500ms ${EASE_OUT} ${delay}ms both`),
    }}
  >
    <div style={{ ...LABEL, color: ACCENT, fontSize: 20, letterSpacing: '0.1em' }}>{t}</div>
    <div style={{ ...DISPLAY, fontWeight: 700, fontSize: 30, marginTop: 6, lineHeight: 1.15 }}>
      {title}
    </div>
    <div style={{ fontSize: 22, color: MUTED, marginTop: 6 }}>{detail}</div>
  </div>
);

const Trajectory: Page = () => {
  const live = useIsActivePage();
  const lab = (size: number, extra?: CSSProperties) => ({
    ...svgDisplay(size, 700, { fill: INK, letterSpacing: 3, ...extra }),
    ...KNOCK,
  });
  const mono = (size: number, extra?: CSSProperties) => ({
    ...svgMono(size, { fill: MUTED, ...extra }),
    ...KNOCK,
  });
  return (
    <Sheet>
      <Header n="06" kicker="飛行剖面" title="四天半的航程。" />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={abs(0, 0)} aria-hidden="true">
        <g className="se-m" style={anim(live, `se-fade 500ms ${EASE_OUT} 0ms both`)}>
          <path d="M360 318 H1540" style={{ stroke: INK, strokeWidth: 1.5 }} />
          <path d="M360 306 V330 M1540 306 V330" style={{ stroke: INK, strokeWidth: 1.5 }} />
          <text
            x={950}
            y={304}
            textAnchor="middle"
            style={svgMono(22, { fill: INK, fontWeight: 700 })}
          >
            384,400 km · 滑行 4.6 天
          </text>
        </g>
        <circle cx={360} cy={560} r={78} style={{ fill: SHEET, stroke: INK, strokeWidth: 3 }} />
        <g style={{ fill: 'none', stroke: INK, strokeWidth: 1.4, opacity: 0.55 }}>
          <ellipse cx={360} cy={560} rx={28} ry={78} />
          <ellipse cx={360} cy={560} rx={58} ry={78} />
          <path d="M282 560 H438 M292 524 H428 M292 596 H428 M312 498 H408 M312 622 H408" />
        </g>
        <path
          d="M360 482 A78 78 0 0 1 360 638 A40 78 0 0 0 360 482 Z"
          style={{ fill: INK, opacity: 0.12 }}
        />
        <circle cx={330} cy={528} r={6} style={{ fill: ACCENT }} />
        <Trace
          d="M360 442 A118 118 0 1 1 359.9 442"
          dash="6 8"
          color={INK}
          w={2}
          live={live}
          delay={0}
          dur={800}
        />
        <circle
          cx={1540}
          cy={520}
          r={58}
          style={{ fill: '#E2D5B8', stroke: INK, strokeWidth: 3 }}
        />
        <path
          d="M1540 462 A58 58 0 0 1 1540 578 A26 58 0 0 0 1540 462 Z"
          style={{ fill: INK, opacity: 0.16 }}
        />
        <circle
          cx={1520}
          cy={500}
          r={9}
          style={{ fill: 'none', stroke: INK, strokeWidth: 1.5, opacity: 0.5 }}
        />
        <circle
          cx={1550}
          cy={540}
          r={6}
          style={{ fill: 'none', stroke: INK, strokeWidth: 1.5, opacity: 0.5 }}
        />
        <circle
          cx={1530}
          cy={552}
          r={4}
          style={{ fill: 'none', stroke: INK, strokeWidth: 1.5, opacity: 0.5 }}
        />
        <Trace
          d="M360 678 C700 820 1250 760 1540 616"
          dash="14 10"
          color={ACCENT}
          w={5}
          live={live}
          delay={700}
          dur={2400}
        />
        <Trace
          d="M1540 616 A26 96 0 1 1 1540 424 A26 96 0 1 1 1540 616"
          dash="8 7"
          color={RUST}
          w={3}
          live={live}
          delay={3100}
          dur={900}
        />
        <text x={360} y={410} textAnchor="middle" style={lab(24)}>
          地球
        </text>
        <text x={360} y={438} textAnchor="middle" style={mono(22)}>
          185 km 停泊軌道
        </text>
        <text x={1540} y={376} textAnchor="middle" style={lab(24)}>
          月球
        </text>
        <text x={1540} y={404} textAnchor="middle" style={mono(22)}>
          100 km 極軌道
        </text>
        <Marker x={360} y={678} live={live} delay={650}>
          <text x={336} y={712} textAnchor="end" style={lab(20, { fill: ACCENT })}>
            TLI 點火
          </text>
          <text x={336} y={740} textAnchor="end" style={mono(22)}>
            Δv 3.15 km/s
          </text>
        </Marker>
        <Marker x={647} y={748} live={live} delay={1300}>
          <text x={647} y={700} textAnchor="middle" style={lab(20, { fill: ACCENT })}>
            TCM-1
          </text>
          <text x={647} y={726} textAnchor="middle" style={mono(22)}>
            L+1 d · 2.1 m/s
          </text>
        </Marker>
        <Marker x={1281} y={706} live={live} delay={2500}>
          <text x={1281} y={756} textAnchor="middle" style={lab(20, { fill: ACCENT })}>
            TCM-2
          </text>
          <text x={1281} y={782} textAnchor="middle" style={mono(22)}>
            L+3 d · 0.8 m/s
          </text>
        </Marker>
        <Marker x={1540} y={616} live={live} delay={3100}>
          <text x={1600} y={690} textAnchor="middle" style={lab(20, { fill: ACCENT })}>
            LOI
          </text>
          <text x={1600} y={716} textAnchor="middle" style={mono(22)}>
            Δv 850 m/s
          </text>
        </Marker>
      </svg>
      <div
        style={abs(120, 812, {
          width: 1680,
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 28,
        })}
      >
        <EventTile t="L+00:00" title="升空" detail="Perseus 2 · LC-2" live={live} delay={300} />
        <EventTile t="L+00:42" title="TLI 點火" detail="第二節重新點火" live={live} delay={900} />
        <EventTile
          t="L+1 d / 3 d"
          title="兩次 TCM"
          detail="各小於 4 m/s"
          live={live}
          delay={1700}
        />
        <EventTile
          t="L+4.6 d"
          title="進入月球軌道"
          detail="100 km 極軌道"
          live={live}
          delay={3100}
        />
        <EventTile t="L+7.2 d" title="下降" detail="檢測 2.6 d 後" live={live} delay={3600} />
      </div>
    </Sheet>
  );
};

const Crater = ({
  x,
  y,
  r,
  name,
  hatch,
  labelDx = 0,
  labelDy = 0,
}: {
  x: number;
  y: number;
  r: number;
  name: string;
  hatch: string;
  labelDx?: number;
  labelDy?: number;
}) => (
  <g>
    <circle
      cx={x}
      cy={y}
      r={r * 1.22}
      style={{ fill: 'none', stroke: INK, strokeWidth: 1, opacity: 0.35 }}
    />
    <circle cx={x} cy={y} r={r} style={{ fill: PANEL, stroke: INK, strokeWidth: 2.2 }} />
    <circle
      cx={x}
      cy={y}
      r={r * 0.72}
      style={{ fill: `url(#${hatch})`, stroke: INK, strokeWidth: 1, strokeDasharray: '3 4' }}
    />
    <circle
      cx={x}
      cy={y}
      r={r * 0.4}
      style={{ fill: 'none', stroke: INK, strokeWidth: 1, opacity: 0.4 }}
    />
    <text
      x={x + labelDx}
      y={y + labelDy + 7}
      textAnchor="middle"
      style={{ ...svgMono(22, { fill: INK, fontWeight: 700 }), ...KNOCK, strokeWidth: 6 }}
    >
      {name}
    </text>
  </g>
);

const SiteMetric = ({
  label,
  value,
  pct,
  live,
  delay,
}: {
  label: string;
  value: string;
  pct?: number;
  live: boolean;
  delay: number;
}) => (
  <div style={{ borderTop: `2px solid ${RULE}`, paddingTop: 14 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ ...LABEL, fontSize: 19, color: MUTED }}>{label}</span>
      <span style={{ ...DISPLAY, fontWeight: 800, fontSize: 44 }}>{value}</span>
    </div>
    {pct !== undefined && (
      <div style={{ height: 14, background: PANEL, marginTop: 10, position: 'relative' }}>
        <div
          className="se-m"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${pct}%`,
            background: `repeating-linear-gradient(90deg, ${ACCENT} 0 18px, transparent 18px 22px)`,
            transformOrigin: 'left',
            ...anim(live, `se-growx 900ms ${EASE_OUT} ${delay}ms both`),
          }}
        />
      </div>
    )}
  </div>
);

const SiteMap: Page = () => {
  const live = useIsActivePage();
  const uid = useUid();
  const hatch = `${uid}h`;
  const clip = `${uid}c`;
  return (
    <Sheet>
      <Header n="07" kicker="著陸點" title="著陸點 04，de Gerlache 邊緣。" />
      <svg
        width={640}
        height={640}
        viewBox="-360 -360 720 720"
        style={abs(240, 268, { overflow: 'visible' })}
        aria-hidden="true"
      >
        <defs>
          <pattern
            id={hatch}
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <rect width="8" height="8" fill="#CDBB98" />
            <path d="M0 0 V8" stroke={BROWN} strokeWidth="2.4" opacity="0.55" />
          </pattern>
          <clipPath id={clip}>
            <circle r="330" />
          </clipPath>
        </defs>
        <circle r="346" style={{ fill: 'none', stroke: INK, strokeWidth: 1.5 }} />
        <g clipPath={`url(#${clip})`}>
          <circle r="330" fill="#EADFC7" />
          <Crater x={-23} y={-267} r={87} name="HAWORTH" hatch={hatch} />
          <Crater x={138} y={-139} r={87} name="SHOEMAKER" hatch={hatch} />
          <Crater x={271} y={-62} r={66} name="FAUSTINI" hatch={hatch} labelDx={-10} />
          <Crater x={-82} y={155} r={54} name="SVERDRUP" hatch={hatch} />
          <Crater x={-154} y={-8} r={54} name="DE GERLACHE" hatch={hatch} labelDy={-70} />
          <Crater x={26} y={22} r={36} name="SHACKLETON" hatch={hatch} labelDx={34} labelDy={58} />
          <g
            style={{
              fill: 'none',
              stroke: INK,
              strokeWidth: 1.2,
              strokeDasharray: '4 6',
              opacity: 0.5,
            }}
          >
            <circle r="103" />
            <circle r="206" />
            <circle r="309" />
            <path d="M0 -330 V330 M-330 0 H330 M-233 -233 L233 233 M-233 233 L233 -233" />
          </g>
        </g>
        <text x={6} y={-110} style={{ ...svgMono(21, { fill: INK }), ...KNOCK, strokeWidth: 5 }}>
          89°
        </text>
        <text x={6} y={-213} style={{ ...svgMono(21, { fill: INK }), ...KNOCK, strokeWidth: 5 }}>
          88°
        </text>
        <text x={6} y={-316} style={{ ...svgMono(21, { fill: INK }), ...KNOCK, strokeWidth: 5 }}>
          87°
        </text>
        <text
          x={0}
          y={-356}
          textAnchor="middle"
          style={svgDisplay(21, 700, { fill: INK, letterSpacing: 2 })}
        >
          0° · 朝向地球
        </text>
        <text
          x={360}
          y={6}
          textAnchor="start"
          style={svgDisplay(21, 700, { fill: INK, letterSpacing: 2 })}
        >
          90°E
        </text>
        <text
          x={-360}
          y={6}
          textAnchor="end"
          style={svgDisplay(21, 700, { fill: INK, letterSpacing: 2 })}
        >
          90°W
        </text>
        <text
          x={0}
          y={374}
          textAnchor="middle"
          style={svgDisplay(21, 700, { fill: INK, letterSpacing: 2 })}
        >
          180°
        </text>
        <g>
          <circle cx={70} cy={-60} r={9} style={{ fill: BG, stroke: INK, strokeWidth: 3 }} />
          <text
            x={70}
            y={-26}
            textAnchor="middle"
            style={{
              ...svgDisplay(21, 700, { fill: INK, letterSpacing: 2 }),
              ...KNOCK,
              strokeWidth: 6,
            }}
          >
            著陸點 07 · 備用
          </text>
        </g>
        <g>
          <circle
            cx={-100}
            cy={6}
            r={14}
            className="se-m"
            style={{
              fill: 'none',
              stroke: ACCENT,
              strokeWidth: 3,
              transformBox: 'fill-box',
              transformOrigin: 'center',
              ...anim(live, `se-pulse 2.4s ${EASE_OUT} 1.2s infinite`),
            }}
          />
          <path
            d="M-100 -26 V-12 M-100 24 V38 M-132 6 H-118 M-82 6 H-68"
            style={{ stroke: ACCENT, strokeWidth: 3 }}
          />
          <ellipse
            cx={-100}
            cy={6}
            rx={14}
            ry={9}
            style={{ fill: ACCENT, stroke: INK, strokeWidth: 2 }}
          />
          <text
            x={-100}
            y={68}
            textAnchor="middle"
            style={{ ...svgDisplay(22, 800, { fill: ACCENT, letterSpacing: 2 }), ...KNOCK }}
          >
            著陸點 04
          </text>
        </g>
        <g transform="translate(-150 300)">
          <path d="M0 0 H68" style={{ stroke: INK, strokeWidth: 5 }} />
          <path d="M0 0 H34" style={{ stroke: BG, strokeWidth: 3 }} />
          <text
            x={80}
            y={7}
            style={{ ...svgMono(21, { fill: INK, fontWeight: 700 }), ...KNOCK, strokeWidth: 5 }}
          >
            20 km
          </text>
        </g>
      </svg>
      <div style={abs(1060, 300, { width: 740 })}>
        <div style={{ ...LABEL, fontSize: 19, color: ACCENT }}>主要 · 連接山脊</div>
        <div style={{ ...DISPLAY, fontWeight: 800, fontSize: 46, marginTop: 10, lineHeight: 1.1 }}>
          89.03° S · 93.4° W
        </div>
        <div style={{ fontSize: 28, marginTop: 14, lineHeight: 1.4, color: MUTED }}>
          de Gerlache 邊緣的向陽山脊，
          <br />
          距永久陰影區 1.4 km。
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 34 }}>
          <SiteMetric label="一個月球年的日照率" value="81%" pct={81} live={live} delay={300} />
          <SiteMetric label="可見地球時間" value="54%" pct={54} live={live} delay={450} />
          <SiteMetric label="橢圓區內坡度" value="≤ 6°" live={live} delay={0} />
          <SiteMetric label="著陸橢圓" value="100 × 60 m" live={live} delay={0} />
        </div>
      </div>
    </Sheet>
  );
};

const Gate = ({
  x,
  y,
  fx,
  fy,
  name,
  data,
  align = 'start',
  live,
  delay,
}: {
  x: number;
  y: number;
  fx: number;
  fy: number;
  name: string;
  data: string;
  align?: 'start' | 'end';
  live: boolean;
  delay: number;
}) => {
  const tx = align === 'start' ? fx + 12 : fx - 12;
  const top = fy - 26;
  const bottom = fy + 40;
  const leaderFrom = y < fy ? y : y;
  const leaderTo = y < fy ? top - 6 : bottom - 2;
  return (
    <g className="se-m" style={anim(live, `se-fade 450ms ${EASE_OUT} ${delay}ms both`)}>
      <path
        d={`M${fx} ${leaderFrom} V${leaderTo} M${fx} ${top - 6} V${bottom - 2}`}
        style={{ stroke: INK, strokeWidth: 1.6, strokeDasharray: '3 4' }}
      />
      <text
        x={tx}
        y={fy}
        textAnchor={align}
        style={{ ...svgDisplay(21, 700, { fill: ACCENT, letterSpacing: 3 }), ...KNOCK }}
      >
        {name}
      </text>
      <text
        x={tx}
        y={fy + 30}
        textAnchor={align}
        style={{ ...svgMono(23, { fill: INK }), ...KNOCK }}
      >
        {data}
      </text>
      <circle cx={x} cy={y} r={10} style={{ fill: BG, stroke: INK, strokeWidth: 3 }} />
      <circle cx={x} cy={y} r={5} style={{ fill: ACCENT }} />
    </g>
  );
};

const Descent: Page = () => {
  const live = useIsActivePage();
  const profile = curveD([
    [260, 340],
    [401, 366],
    [541, 401],
    [682, 446],
    [823, 506],
    [921, 591],
    [1020, 683],
    [1337, 781],
    [1587, 856],
    [1700, 880],
  ]);
  const axisLab = (extra?: CSSProperties) => svgMono(20, { fill: MUTED, ...extra });
  return (
    <Sheet>
      <Header n="08" kicker="動力下降" title="十一分鐘抵達月面。" />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={abs(0, 0)} aria-hidden="true">
        <rect x={260} y={320} width={760} height={560} style={{ fill: MUSTARD, opacity: 0.13 }} />
        <rect x={1020} y={320} width={453} height={560} style={{ fill: ACCENT, opacity: 0.11 }} />
        <rect x={1473} y={320} width={227} height={560} style={{ fill: RUST, opacity: 0.15 }} />
        <g style={{ stroke: INK, strokeWidth: 1, strokeDasharray: '3 7', opacity: 0.35 }}>
          <path d="M260 439 H1700 M260 568 H1700 M260 683 H1700 M260 781 H1700" />
        </g>
        <path d="M260 320 V880 H1700" style={{ fill: 'none', stroke: INK, strokeWidth: 2.5 }} />
        <path d="M1012 872 l10 -16 M1022 872 l10 -16" style={{ stroke: INK, strokeWidth: 2.5 }} />
        <text x={244} y={346} textAnchor="end" style={axisLab()}>
          15 km
        </text>
        <text x={244} y={445} textAnchor="end" style={axisLab()}>
          10
        </text>
        <text x={244} y={574} textAnchor="end" style={axisLab()}>
          5
        </text>
        <text x={244} y={689} textAnchor="end" style={axisLab()}>
          2
        </text>
        <text x={244} y={787} textAnchor="end" style={axisLab()}>
          0.5
        </text>
        <text x={244} y={886} textAnchor="end" style={axisLab()}>
          0
        </text>
        <text x={260} y={912} textAnchor="middle" style={axisLab()}>
          0:00
        </text>
        <text x={429} y={912} textAnchor="middle" style={axisLab()}>
          2:00
        </text>
        <text x={598} y={912} textAnchor="middle" style={axisLab()}>
          4:00
        </text>
        <text x={767} y={912} textAnchor="middle" style={axisLab()}>
          6:00
        </text>
        <text x={936} y={912} textAnchor="middle" style={axisLab()}>
          8:00
        </text>
        <text x={1292} y={912} textAnchor="middle" style={axisLab()}>
          10:00
        </text>
        <text x={1564} y={912} textAnchor="middle" style={axisLab()}>
          11:00
        </text>
        <text x={1700} y={912} textAnchor="middle" style={axisLab({ fill: INK, fontWeight: 700 })}>
          11:30
        </text>
        <text
          x={640}
          y={952}
          textAnchor="middle"
          style={svgDisplay(19, 700, { fill: INK, letterSpacing: 3 })}
        >
          減速段 · 9 分鐘
        </text>
        <text
          x={1246}
          y={952}
          textAnchor="middle"
          style={svgDisplay(19, 700, { fill: INK, letterSpacing: 3 })}
        >
          接近段 · 100 秒
        </text>
        <text
          x={1586}
          y={952}
          textAnchor="middle"
          style={svgDisplay(19, 700, { fill: INK, letterSpacing: 3 })}
        >
          終端段 · 50 秒
        </text>
        <text x={1030} y={940} style={svgMono(18, { fill: MUTED })}>
          ×3.6
        </text>
        <Trace d={profile} color={INK} w={5} live={live} delay={200} dur={2600} />
        <Gate
          x={260}
          y={340}
          fx={260}
          fy={470}
          name="PDI"
          data="15.0 km · 1,690 m/s"
          live={live}
          delay={200}
        />
        <Gate
          x={823}
          y={506}
          fx={823}
          fy={412}
          name="降低推力"
          data="7.2 km · T+6:40"
          live={live}
          delay={1300}
        />
        <Gate
          x={1020}
          y={683}
          fx={1020}
          fy={560}
          name="高位檢查點"
          data="2.0 km · T+9:00"
          live={live}
          delay={1800}
        />
        <Gate
          x={1337}
          y={781}
          fx={1337}
          fy={664}
          name="障礙掃描"
          data="500 m · T+10:10"
          live={live}
          delay={2200}
        />
        <Gate
          x={1587}
          y={856}
          fx={1587}
          fy={752}
          name="低位檢查點"
          data="30 m · T+11:05"
          align="end"
          live={live}
          delay={2500}
        />
        <Gate
          x={1700}
          y={880}
          fx={1700}
          fy={600}
          name="觸地"
          data="T+11:30 · 1.2 m/s"
          align="end"
          live={live}
          delay={2800}
        />
      </svg>
      <div
        className="se-m"
        style={abs(1300, 300, {
          width: 500,
          padding: '20px 26px',
          boxSizing: 'border-box',
          background: SHEET,
          boxShadow: `inset 0 0 0 2px ${RULE}`,
          ...anim(live, `se-fade 500ms ${EASE_OUT} 3000ms both`),
        })}
      >
        <div style={{ ...LABEL, fontSize: 18, color: MUTED }}>下降預算</div>
        <div style={{ fontSize: 26, lineHeight: 1.5, marginTop: 8 }}>
          {(
            [
              ['Δv 消耗', '1,960 m/s'],
              ['推進劑', '1,090 kg'],
              ['懸停餘裕', '45 s'],
            ] as const
          ).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </Sheet>
  );
};

const ManifestRow = ({
  id,
  name,
  owner,
  kg,
  power,
  color,
  live,
  delay,
}: {
  id: string;
  name: string;
  owner: string;
  kg: number;
  power: string;
  color: string;
  live: boolean;
  delay: number;
}) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '120px 520px 380px 1fr 140px',
      alignItems: 'center',
      height: 70,
      borderBottom: `1.5px dashed ${RULE}`,
    }}
  >
    <span style={{ fontSize: 24, color: MUTED }}>{id}</span>
    <span style={{ ...DISPLAY, fontWeight: 700, fontSize: 27 }}>{name}</span>
    <span style={{ fontSize: 24, color: MUTED }}>{owner}</span>
    <span style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <span
        className="se-m"
        style={{
          display: 'block',
          width: Math.max(4, kg * 1.6),
          height: 24,
          background: color,
          transformOrigin: 'left',
          ...anim(live, `se-growx 800ms ${EASE_OUT} ${delay}ms both`),
        }}
      />
      <span style={{ fontSize: 28, fontWeight: 700 }}>{kg} kg</span>
    </span>
    <span style={{ fontSize: 26, textAlign: 'right' }}>{power}</span>
  </div>
);

const Manifest: Page = () => {
  const live = useIsActivePage();
  return (
    <Sheet>
      <Header
        n="09"
        kicker="酬載清單"
        title="七項酬載，共 412 公斤。"
        aside={
          <>
            <span style={{ color: MUSTARD }}>■</span> 科學 <span style={{ color: ACCENT }}>■</span>{' '}
            移動 <span style={{ color: RUST }}>■</span> 中繼 <span style={{ color: BROWN }}>■</span>{' '}
            貨運
          </>
        }
      />
      <div style={abs(120, 292, { width: 1680 })}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '120px 520px 380px 1fr 140px',
            ...LABEL,
            fontSize: 18,
            color: MUTED,
            paddingBottom: 12,
            borderBottom: `3px solid ${INK}`,
          }}
        >
          <span>ID</span>
          <span>酬載</span>
          <span>客戶</span>
          <span>質量</span>
          <span style={{ textAlign: 'right' }}>峰值功率</span>
        </div>
        <ManifestRow
          id="P-01"
          name="PRISM 水冰鑽具"
          owner="Lunar Volatiles Cons."
          kg={94}
          power="310 W"
          color={MUSTARD}
          live={live}
          delay={100}
        />
        <ManifestRow
          id="P-02"
          name="PIKA 微型月球車"
          owner="Meridian Robotics"
          kg={22}
          power="40 W"
          color={ACCENT}
          live={live}
          delay={200}
        />
        <ManifestRow
          id="P-03"
          name="中子能譜儀"
          owner="Arcadia University"
          kg={6}
          power="9 W"
          color={MUSTARD}
          live={live}
          delay={300}
        />
        <ManifestRow
          id="P-04"
          name="VOLTA 質譜儀"
          owner="Halvard Institute"
          kg={14}
          power="60 W"
          color={MUSTARD}
          live={live}
          delay={400}
        />
        <ManifestRow
          id="P-05"
          name="雷射後向反射器"
          owner="Bracken Observatory"
          kg={1}
          power="—"
          color={MUSTARD}
          live={live}
          delay={500}
        />
        <ManifestRow
          id="P-06"
          name="LUNET 中繼小衛星"
          owner="Cislune Comms"
          kg={196}
          power="在軌道上"
          color={RUST}
          live={live}
          delay={600}
        />
        <ManifestRow
          id="P-07"
          name="貨運置物櫃"
          owner="6 家商業客戶"
          kg={79}
          power="15 W"
          color={BROWN}
          live={live}
          delay={700}
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '120px 520px 380px 1fr 140px',
            alignItems: 'center',
            height: 84,
            borderTop: `3px solid ${INK}`,
            marginTop: -1.5,
          }}
        >
          <span />
          <span style={{ ...DISPLAY, fontWeight: 800, fontSize: 30 }}>合計</span>
          <span style={{ fontSize: 24, color: MUTED }}>容量 450 kg</span>
          <span style={{ fontSize: 28, fontWeight: 700 }}>
            412 kg <span style={{ color: AVOCADO }}>· 餘裕 38 kg</span>
          </span>
          <span style={{ fontSize: 26, textAlign: 'right', fontWeight: 700 }}>434 W</span>
        </div>
      </div>
    </Sheet>
  );
};

const RISK_GREEN = 'rgba(110,125,44,0.26)';
const RISK_YELLOW = 'rgba(217,160,34,0.42)';
const RISK_RED = 'rgba(166,59,28,0.42)';

const riskFill = (l: number, c: number) => {
  const s = l * c;
  if (s >= 15) return RISK_RED;
  if (s >= 8) return RISK_YELLOW;
  return RISK_GREEN;
};

const Cell = ({ l, c }: { l: number; c: number }) => (
  <div style={{ background: riskFill(l, c), boxShadow: `inset 0 0 0 1px ${RULE}` }} />
);

const RiskDot = ({
  id,
  l,
  c,
  dx = 0,
  dy = 0,
  open,
  live,
  delay,
}: {
  id: string;
  l: number;
  c: number;
  dx?: number;
  dy?: number;
  open?: boolean;
  live: boolean;
  delay: number;
}) => (
  <div
    className="se-m"
    style={abs(300 + (c - 1) * 104 + 52 - 26 + dx, 300 + (5 - l) * 104 + 52 - 26 + dy, {
      width: 52,
      height: 52,
      borderRadius: '50%',
      background: open ? INK : SHEET,
      color: open ? SHEET : INK,
      border: `3px solid ${INK}`,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...DISPLAY,
      fontWeight: 800,
      fontSize: 19,
      ...anim(live, `se-pop 500ms ${EASE_OUT} ${delay}ms both`),
    })}
  >
    {id}
  </div>
);

const RiskItem = ({
  id,
  title,
  status,
  open,
}: {
  id: string;
  title: string;
  status: string;
  open?: boolean;
}) => (
  <div style={{ display: 'flex', gap: 22, alignItems: 'flex-start' }}>
    <div
      style={{
        ...DISPLAY,
        width: 48,
        height: 48,
        flexShrink: 0,
        borderRadius: '50%',
        border: `3px solid ${INK}`,
        boxSizing: 'border-box',
        background: open ? INK : 'transparent',
        color: open ? SHEET : INK,
        fontWeight: 800,
        fontSize: 17,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {id}
    </div>
    <div>
      <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.25 }}>{title}</div>
      <div
        style={{
          ...LABEL,
          fontSize: 18,
          letterSpacing: '0.1em',
          marginTop: 6,
          color: open ? RUST : AVOCADO,
        }}
      >
        {status}
      </div>
    </div>
  </div>
);

const Risks: Page = () => {
  const live = useIsActivePage();
  return (
    <Sheet>
      <Header n="10" kicker="風險概況" title="兩項黃燈，沒有紅燈。" />
      <div
        style={abs(300, 300, {
          width: 520,
          height: 520,
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gridTemplateRows: 'repeat(5, 1fr)',
          outline: `3px solid ${INK}`,
        })}
      >
        <Cell l={5} c={1} />
        <Cell l={5} c={2} />
        <Cell l={5} c={3} />
        <Cell l={5} c={4} />
        <Cell l={5} c={5} />
        <Cell l={4} c={1} />
        <Cell l={4} c={2} />
        <Cell l={4} c={3} />
        <Cell l={4} c={4} />
        <Cell l={4} c={5} />
        <Cell l={3} c={1} />
        <Cell l={3} c={2} />
        <Cell l={3} c={3} />
        <Cell l={3} c={4} />
        <Cell l={3} c={5} />
        <Cell l={2} c={1} />
        <Cell l={2} c={2} />
        <Cell l={2} c={3} />
        <Cell l={2} c={4} />
        <Cell l={2} c={5} />
        <Cell l={1} c={1} />
        <Cell l={1} c={2} />
        <Cell l={1} c={3} />
        <Cell l={1} c={4} />
        <Cell l={1} c={5} />
      </div>
      <div
        style={abs(256, 300, {
          width: 30,
          height: 520,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'flex-end',
          ...DISPLAY,
          fontWeight: 700,
          fontSize: 22,
        })}
      >
        <span>5</span>
        <span>4</span>
        <span>3</span>
        <span>2</span>
        <span>1</span>
      </div>
      <div
        style={abs(300, 834, {
          width: 520,
          display: 'flex',
          justifyContent: 'space-around',
          ...DISPLAY,
          fontWeight: 700,
          fontSize: 22,
        })}
      >
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
      </div>
      <div
        style={abs(300, 884, {
          ...LABEL,
          fontSize: 18,
          color: MUTED,
          width: 520,
          textAlign: 'center',
        })}
      >
        影響程度 →
      </div>
      <div
        style={abs(150, 560, {
          ...LABEL,
          fontSize: 18,
          color: MUTED,
          width: 0,
          whiteSpace: 'nowrap',
          transform: 'rotate(-90deg)',
          transformOrigin: '0 0',
          display: 'flex',
          justifyContent: 'center',
        })}
      >
        發生可能性 →
      </div>
      <RiskDot id="R1" l={3} c={4} open live={live} delay={300} />
      <RiskDot id="R2" l={3} c={3} open live={live} delay={450} />
      <RiskDot id="R3" l={2} c={3} live={live} delay={600} />
      <RiskDot id="R4" l={1} c={5} live={live} delay={750} />
      <RiskDot id="R5" l={2} c={2} dx={-22} dy={-14} live={live} delay={900} />
      <RiskDot id="R6" l={2} c={2} dx={22} dy={16} live={live} delay={1050} />
      <div
        style={abs(960, 296, {
          width: 840,
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
        })}
      >
        <Steps>
          <Step>
            <RiskItem
              id="R1"
              open
              title="低太陽角陰影造成 LIDAR 誤判障礙"
              status="未結案 · TRN 備援已通過 212 次模擬驗證"
            />
          </Step>
          <Step>
            <RiskItem
              id="R2"
              open
              title="地球被遮蔽時 Ka 頻段通訊中斷"
              status="未結案 · LUNET 中繼涵蓋 92% 的中斷時段"
            />
          </Step>
          <Step>
            <RiskItem
              id="R3"
              title="月球車在陰影區 −200 °C 的熱控"
              status="已結案 · 加熱器浸泡測試（10月6日）"
            />
          </Step>
          <Step>
            <RiskItem
              id="R4"
              title="推力低於 25% 時引擎燃燒不穩"
              status="已結案 · 41 次熱試車皆穩定"
            />
          </Step>
          <Step>
            <RiskItem id="R5" title="VOLTA 酬載延遲交付" status="已結案 · 9月22日完成整合" />
          </Step>
          <Step>
            <RiskItem id="R6" title="11月4日靶場時段衝突" status="已結案 · 靶場時段已確認" />
          </Step>
        </Steps>
      </div>
    </Sheet>
  );
};

const PollRow = ({
  call,
  duty,
  status = 'GO',
  note,
  live,
  delay,
}: {
  call: string;
  duty: string;
  status?: string;
  note?: string;
  live: boolean;
  delay: number;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 26,
      height: 68,
      padding: '0 24px',
      background: 'rgba(255,240,210,0.04)',
      boxShadow: 'inset 0 0 0 1.5px rgba(239,230,210,0.12)',
    }}
  >
    <Lamp size={34} live={live} delay={delay} bezel="#7A6650" />
    <span
      style={{
        ...DISPLAY,
        fontWeight: 700,
        fontSize: 26,
        width: 230,
        color: SHEET,
        letterSpacing: '0.04em',
      }}
    >
      {call}
    </span>
    <span style={{ fontSize: 22, color: '#B8A68C', flex: 1 }}>{duty}</span>
    {note && <span style={{ fontSize: 20, color: LAMP_AMBER }}>{note}</span>}
    <span
      className="se-m"
      style={{
        ...DISPLAY,
        fontWeight: 800,
        fontSize: 28,
        color: LAMP_GO,
        width: 64,
        textAlign: 'right',
        textShadow: `0 0 12px color-mix(in srgb, ${LAMP_GO} 60%, transparent)`,
        ...anim(live, `se-fade 200ms linear ${delay + 300}ms both`),
      }}
    >
      {status}
    </span>
  </div>
);

const Screw = ({ x, y }: { x: number; y: number }) => (
  <div
    style={abs(x, y, {
      width: 16,
      height: 16,
      borderRadius: '50%',
      background: 'radial-gradient(circle at 35% 35%, #9A866C, #4A3828)',
      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.4)',
    })}
  >
    <div
      style={abs(2, 7, {
        width: 12,
        height: 2,
        background: 'rgba(0,0,0,0.5)',
        transform: 'rotate(35deg)',
      })}
    />
  </div>
);

const Poll: Page = () => {
  const live = useIsActivePage();
  return (
    <Sheet>
      <Header
        n="11"
        kicker="整備徵詢"
        title="十二個控制台，十二個 GO。"
        aside={
          <>
            FRR-2 徵詢 · 11:52 UTC 結束
            <br />
            由飛行總監 T. Ibarra 主持徵詢
          </>
        }
      />
      <div
        style={abs(120, 296, {
          width: 1680,
          height: 640,
          boxSizing: 'border-box',
          padding: '34px 40px',
          background: `linear-gradient(180deg, #34211A 0%, ${CONSOLE} 100%)`,
          borderRadius: 'var(--osd-radius)',
          boxShadow: `0 0 0 6px ${BROWN}, 0 20px 40px -20px rgba(0,0,0,0.6)`,
        })}
      >
        <Screw x={14} y={14} />
        <Screw x={1650} y={14} />
        <Screw x={14} y={610} />
        <Screw x={1650} y={610} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 32, rowGap: 10 }}>
          <PollRow call="FLIGHT" duty="飛行總監" live={live} delay={300} />
          <PollRow call="COMM" duty="通訊與地面站" note="R2 未結案" live={live} delay={1800} />
          <PollRow call="FDO" duty="飛行動力" live={live} delay={550} />
          <PollRow call="PAYLOAD" duty="酬載作業" live={live} delay={2050} />
          <PollRow call="GNC" duty="導引與導航" note="R1 未結案" live={live} delay={800} />
          <PollRow call="SURFACE" duty="月面與月球車" live={live} delay={2300} />
          <PollRow call="PROP" duty="推進系統" live={live} delay={1050} />
          <PollRow call="LAUNCH VEH." duty="Perseus 2 團隊" live={live} delay={2550} />
          <PollRow call="POWER" duty="電力與熱控" live={live} delay={1300} />
          <PollRow call="RANGE" duty="靶場安全" live={live} delay={2800} />
          <PollRow call="THERMAL" duty="熱控" live={live} delay={1550} />
          <PollRow call="WEATHER" duty="氣象預報" note="80% 適宜" live={live} delay={3050} />
        </div>
        <div
          style={{
            marginTop: 26,
            height: 76,
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            padding: '0 24px',
            background: 'rgba(180,207,74,0.08)',
            boxShadow: 'inset 0 0 0 2px rgba(180,207,74,0.35)',
          }}
        >
          <Lamp size={44} live={live} delay={3500} bezel="#7A6650" />
          <span
            style={{
              ...DISPLAY,
              fontWeight: 800,
              fontSize: 30,
              color: SHEET,
              letterSpacing: '0.08em',
            }}
          >
            委員會狀態
          </span>
          <span style={{ fontSize: 24, color: '#B8A68C', flex: 1 }}>
            12 / 12 個控制台 · 2 項風險持續列管
          </span>
          <span
            className="se-m"
            style={{
              ...DISPLAY,
              fontWeight: 800,
              fontSize: 40,
              color: LAMP_GO,
              letterSpacing: '0.1em',
              textShadow: `0 0 16px color-mix(in srgb, ${LAMP_GO} 70%, transparent)`,
              ...anim(live, `se-fade 240ms linear 3800ms both`),
            }}
          >
            GO
          </span>
        </div>
      </div>
    </Sheet>
  );
};

const FlipDigit = ({ d }: { d: string }) => (
  <div
    style={{
      position: 'relative',
      width: 92,
      height: 132,
      borderRadius: 8,
      background: `linear-gradient(180deg, #3D2819 0%, #3D2819 50%, ${CONSOLE} 50%, ${CONSOLE} 100%)`,
      color: SHEET,
      ...DISPLAY,
      fontWeight: 800,
      fontSize: 92,
      lineHeight: '132px',
      textAlign: 'center',
      boxShadow: '0 6px 0 rgba(58,36,20,0.25)',
    }}
  >
    {d}
    <div style={abs(0, 65, { width: 92, height: 2, background: 'rgba(0,0,0,0.55)' })} />
  </div>
);

const DigitGroup = ({ a, b, label }: { a: string; b: string; label: string }) => (
  <div>
    <div style={{ display: 'flex', gap: 8 }}>
      <FlipDigit d={a} />
      <FlipDigit d={b} />
    </div>
    <div style={{ ...LABEL, fontSize: 18, color: MUTED, marginTop: 14, textAlign: 'center' }}>
      {label}
    </div>
  </div>
);

const Colon = () => (
  <div
    style={{
      ...DISPLAY,
      fontWeight: 800,
      fontSize: 80,
      color: ACCENT,
      lineHeight: '132px',
      padding: '0 14px',
    }}
  >
    :
  </div>
);

const WindowDay = ({
  day,
  minutes,
  kind,
  live,
  delay,
}: {
  day: string;
  minutes: number;
  kind: 'primary' | 'backup' | 'closed';
  live: boolean;
  delay: number;
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div
      style={{
        height: 150,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          marginBottom: 8,
          color: kind === 'closed' ? MUTED : INK,
        }}
      >
        {kind === 'closed' ? '關閉' : `${minutes} 分鐘`}
      </div>
      {kind === 'closed' ? (
        <div
          style={{
            width: 120,
            height: 10,
            background: `repeating-linear-gradient(45deg, ${MUTED} 0 3px, transparent 3px 8px)`,
          }}
        />
      ) : (
        <div
          className="se-m"
          style={{
            width: 120,
            height: minutes * 2.7,
            background: kind === 'primary' ? ACCENT : MUSTARD,
            transformOrigin: 'bottom',
            ...anim(live, `se-growy 700ms ${EASE_OUT} ${delay}ms both`),
          }}
        />
      )}
    </div>
    <div style={{ height: 3, width: '100%', background: INK }} />
    <div
      style={{
        ...LABEL,
        fontSize: 19,
        letterSpacing: '0.1em',
        marginTop: 12,
        color: kind === 'primary' ? ACCENT : INK,
      }}
    >
      {day}
    </div>
  </div>
);

const CountStep = ({
  t,
  label,
  live,
  delay,
  last,
}: {
  t: string;
  label: string;
  live: boolean;
  delay: number;
  last?: boolean;
}) => (
  <div style={{ position: 'relative', paddingTop: 44 }}>
    <div style={abs(0, 0)}>
      <Lamp size={26} color={last ? LAMP_GO : LAMP_AMBER} live={live} delay={delay} />
    </div>
    <div style={{ ...DISPLAY, fontWeight: 800, fontSize: 28, color: last ? ACCENT : INK }}>{t}</div>
    <div style={{ fontSize: 24, color: MUTED, marginTop: 6 }}>{label}</div>
  </div>
);

const Window: Page = () => {
  const live = useIsActivePage();
  return (
    <Sheet>
      <Header n="12" kicker="發射窗口" title="11月4日開啟窗口。" />
      <div style={abs(120, 296, { ...LABEL, fontSize: 18, color: MUTED })}>
        距 T-0 的時間（自本簡報起算）
      </div>
      <div style={abs(120, 336, { display: 'flex', alignItems: 'flex-start' })}>
        <DigitGroup a="2" b="2" label="天" />
        <Colon />
        <DigitGroup a="1" b="8" label="時" />
        <Colon />
        <DigitGroup a="4" b="2" label="分" />
      </div>
      <div style={abs(1000, 300, { width: 800 })}>
        <div style={{ ...DISPLAY, fontWeight: 800, fontSize: 40, lineHeight: 1.15 }}>
          T-0 · 06:42:00 UTC
        </div>
        <div style={{ fontSize: 28, lineHeight: 1.5, marginTop: 14 }}>
          2026年11月4日（週三）· LC-2，Halcyon Point
          <br />
          每日窗口 38 分鐘，共開放五天。
          <br />
          <span style={{ color: MUTED }}>若延後，下一個窗口為 12月3日。</span>
        </div>
      </div>
      <div
        style={abs(120, 556, {
          width: 1680,
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 20,
        })}
      >
        <WindowDay day="週三 04" minutes={38} kind="primary" live={live} delay={200} />
        <WindowDay day="週四 05" minutes={34} kind="backup" live={live} delay={300} />
        <WindowDay day="週五 06" minutes={29} kind="backup" live={live} delay={400} />
        <WindowDay day="週六 07" minutes={22} kind="backup" live={live} delay={500} />
        <WindowDay day="週日 08" minutes={14} kind="backup" live={live} delay={600} />
        <WindowDay day="週一 09" minutes={0} kind="closed" live={live} delay={0} />
        <WindowDay day="週二 10" minutes={0} kind="closed" live={live} delay={0} />
      </div>
      <div style={abs(120, 812, { width: 1680, height: 3, background: RULE })} />
      <div
        style={abs(120, 800, {
          width: 1680,
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 24,
        })}
      >
        <CountStep t="L–3 d" label="整備審查" live={live} delay={900} />
        <CountStep t="L–1 d" label="垂直推出" live={live} delay={1200} />
        <CountStep t="T–6 h" label="推進劑加註" live={live} delay={1500} />
        <CountStep t="T–40 m" label="最終徵詢 · 暫停" live={live} delay={1800} />
        <CountStep t="T–4 m" label="終端倒數" live={live} delay={2100} />
        <CountStep t="T–0" label="升空" last live={live} delay={2500} />
      </div>
    </Sheet>
  );
};

const SignBlock = ({ duty, name }: { duty: string; name: string }) => (
  <div style={{ width: 460 }}>
    <div style={{ height: 64, borderBottom: `2px solid ${INK}` }} />
    <div style={{ fontSize: 26, fontWeight: 700, marginTop: 12 }}>{name}</div>
    <div style={{ ...LABEL, fontSize: 18, color: MUTED, marginTop: 6 }}>{duty}</div>
  </div>
);

const Close: Page = () => {
  const live = useIsActivePage();
  return (
    <Sheet chrome={false}>
      <div style={abs(120, 120, { ...LABEL, color: ACCENT })}>委員會建議</div>
      <h2
        style={abs(112, 168, {
          ...DISPLAY,
          margin: 0,
          fontWeight: 800,
          fontSize: 'var(--osd-size-hero)',
          lineHeight: 0.95,
          letterSpacing: '-0.01em',
          textShadow: '5px 3px 0 rgba(217,160,34,0.5)',
        })}
      >
        准予發射。
      </h2>
      <div style={abs(120, 352, { fontSize: 32, lineHeight: 1.5 })}>
        SELENE-4 · Perseus 2 · LC-2 · 2026年11月4日 06:42 UTC
      </div>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={abs(0, 0)} aria-hidden="true">
        <path
          d="M-20 500 H1940"
          pathLength={1}
          className="se-m"
          style={{ stroke: MUSTARD, strokeWidth: 22, ...drawStyle(live, 100, 1300) }}
        />
        <path
          d="M-20 526 H1940"
          pathLength={1}
          className="se-m"
          style={{ stroke: '#D4601C', strokeWidth: 22, ...drawStyle(live, 180, 1300) }}
        />
        <path
          d="M-20 552 H1940"
          pathLength={1}
          className="se-m"
          style={{ stroke: RUST, strokeWidth: 22, ...drawStyle(live, 260, 1300) }}
        />
        <path
          d="M-20 578 H1940"
          pathLength={1}
          className="se-m"
          style={{ stroke: BROWN, strokeWidth: 22, ...drawStyle(live, 340, 1300) }}
        />
      </svg>
      <div
        className="se-m"
        style={abs(1380, 330, {
          width: 420,
          height: 420,
          ...anim(live, `se-rise 800ms ${EASE_OUT} 700ms both`),
        })}
      >
        <Patch size={420} />
      </div>
      <div style={abs(120, 690, { fontSize: 28, color: MUTED })}>提請委員會表決 —</div>
      <div style={abs(120, 740, { display: 'flex', gap: 80 })}>
        <SignBlock duty="任務總監" name="Ruth Okafor" />
        <SignBlock duty="飛行總監" name="Tomás Ibarra" />
      </div>
      <div
        className="se-m"
        style={abs(1240, 800, {
          padding: '10px 22px',
          border: `5px solid ${AVOCADO}`,
          color: AVOCADO,
          ...DISPLAY,
          fontWeight: 800,
          fontSize: 36,
          letterSpacing: '0.08em',
          transform: 'rotate(-9deg)',
          opacity: 0.8,
          mixBlendMode: 'multiply',
          ...anim(live, `se-stamp 520ms ${EASE_OUT} 1300ms both`),
        })}
      >
        建議 GO
      </div>
      <div
        style={abs(120, 1000, {
          width: 1680,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 19,
          color: MUTED,
        })}
      >
        <span>MERIDIAN LUNAR SYSTEMS · 計畫內部文件</span>
        <span>MLS-S4-FRR-001 · REV C · 簡報結束</span>
      </div>
    </Sheet>
  );
};
Close.transition = settle;

export const meta: SlideMeta = {
  title: 'SELENE-4 飛行整備簡報',
  createdAt: '2026-10-12T12:18:11.692Z',
};

export const notes: (string | undefined)[] = [
  `午安。這是 SELENE-4 的飛行整備審查。
我是任務總監 Ruth Okafor。接下來二十分鐘，我會向委員會說明目前進度，最後請各位做一項表決。
右邊的任務徽章是 GNC 團隊設計的：三條色帶代表我們的飛行軌跡，軌跡盡頭的小小身影就是 KESTREL。`,
  `這是週五已經發出的備忘錄，所以今天在座各位不該有任何意外。
只有一項決定：批准 11月4日發射。
請記住幾個數字：分離時 1,840 公斤、飛往月球四天半、動力下降 11.5 分鐘、月面作業十天。
印章上寫的是「待決議」，不是「待討論」。該討論的我們都討論過了。`,
  `四項任務目標，依優先順序排列。前兩項是任務本體，後兩項是額外的科學成果。
點擊逐項展開：先是 100 公尺內的精準著陸，接著是七項酬載，供電十個地球日。
然後是鑽探：每 10 公分一層，量測深達一公尺的水冰。
最後，讓 PIKA 進入永久陰影區。只要前兩項達成，任務就算成功，這個定義我們的客戶也已經以書面同意。`,
  `八個控制台，同一間位於 Tucson 的控制室。三班制，輪值人員共 112 位。
你在這裡看到的每位主管，都至少擔任過兩次完整任務模擬的主控。
Tomás Ibarra 是發射與著陸階段的飛行總監；幾分鐘後你會看到，由他主持整備徵詢。`,
  `Perseus 2，Block B 型。十一次飛行、十一次成功，這是下線的第十二枚。
第一節搭載七具 VR-1 引擎，升空推力 4,120 千牛頓。第二節會重新點火一次，進行地月轉移。
KESTREL 裝在五公尺的整流罩內，右邊的剖面圖看得到。
火箭本身是我們最不擔心的部分：登陸器已完成整合，整個箭體組合上週二已簽核通過。`,
  `這是 KESTREL 的正視圖，比例 1 比 40。
來看幾個數字：主引擎可調節推力，範圍 4.4 到 22 千牛頓，這就是我們懸停餘裕的來源。
請指出太陽能板：它是垂直的，因為在南緯 89 度，太陽高度從來不會超過地平線上 1.5 度。
右邊是鑽具，左邊是斜坡上的 PIKA，中間是朝下看的 LIDAR。`,
  `我們怎麼抵達月球。升空後，先在停泊軌道停留四十二分鐘，然後進行地月轉移點火：每秒 3.15 公里。
兩次小幅修正點火，一次在第 1 天，一次在第 3 天，各只有幾公尺每秒。
第 4.6 天進行月球軌道插入，850 公尺每秒，進入 100 公里極軌道。
接著再花兩天半做檢測，才會決定是否開始下降。`,
  `這是從正上方俯視的月球南極，地球在上方。
著陸點 04 位於連接 de Gerlache 與 Shackleton 的山脊上：一年有 81% 的時間有日照，54% 的時間看得到地球。
永久陰影區在 1.4 公里外，那就是 PIKA 要去的地方。
著陸點 07 靠近 Shoemaker，若下降前障礙地圖有變，就改用它作為備用。`,
  `十一分半鐘，從十五公里降到零。
請注意高位檢查點之後時間軸被拉長；大部分的驚險都在最後兩分半鐘。
6 分 40 秒降低推力，9 分鐘到高位檢查點，500 公尺進行障礙掃描，30 公尺到低位檢查點，以每秒 1.2 公尺觸地。
我們保留 45 秒的懸停餘裕。這是 GNC 團隊爭取最久的數字。`,
  `七項酬載、412 公斤，容量 450 公斤，所以有 38 公斤的餘裕。
最大的一項是 LUNET 中繼小衛星。它在下降之前於月球軌道上部署，正是風險 R2 的解法。
PRISM 是主要的科學酬載；貨運置物櫃則載了六家商業客戶的物品。`,
  `上次審查時，板上有六項風險，現在有四項已結案。
點擊逐項展開：R1，低太陽角陰影造成 LIDAR 誤判障礙。未結案，以地形相對導航降低風險，已通過 212 次模擬驗證。
R2，地球落到地平線下時的通訊中斷。未結案，中繼衛星涵蓋其中 92% 的中斷時段。
其餘四項都已結案；任何一項我都樂意回答問題。`,
  `這是 Tomás 今天上午十一點五十二分主持的徵詢。
十二個控制台，十二個 GO。GNC 與 COMM 都投了 GO，並註記各自未結案的風險；氣象方面，良好的機率是 80%，是第四項。
請等燈號全部亮完再翻頁。`,
  `發射窗口在週三 11月4日 UTC 06:42 開啟。每天 38 分鐘，而且逐日縮短：共有五次機會，之後要等到 12 月才會再開。
倒數過程中，T-40 分鐘有一次預定 30 分鐘的暫停，用於最終徵詢。
從這場簡報算起，還有二十二天又十八小時四十二分鐘。`,
  `所以，我們的建議是 GO。
Tomás 和我都已簽署，現在請委員會表決。
表決期間，請停留在這一頁。`,
];

export default [
  Cover,
  Memo,
  Objectives,
  Teams,
  Vehicle,
  Lander,
  Trajectory,
  SiteMap,
  Descent,
  Manifest,
  Risks,
  Poll,
  Window,
  Close,
] satisfies Page[];
