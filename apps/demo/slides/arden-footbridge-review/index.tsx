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
  palette: { bg: '#0F3B6E', text: '#EEF5FF', accent: '#8FD8FF' },
  fonts: {
    display:
      '"Saira Semi Condensed", "Arial Narrow", sans-serif, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif',
    body: '"Saira Semi Condensed", "Arial Narrow", sans-serif, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif',
  },
  typeScale: { hero: 124, body: 30 },
  radius: 0,
};

const BG = '#0F3B6E';
const BG_DEEP = '#0C3360';
const INK = '#EEF5FF';
const CY = '#8FD8FF';
const MUTE = '#9DBEE0';
const FAINT = 'rgba(238,245,255,0.42)';
const GHOST = 'rgba(214,236,255,0.2)';
const AMBER = '#FFD27A';
const MONO =
  '"Share Tech Mono", ui-monospace, Menlo, monospace, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif';
const HAND =
  '"Architects Daughter", "Comic Sans MS", cursive, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif';

const SLIDE_ID = 'arden-footbridge-review';
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Saira+Semi+Condensed:wght@400;500;600&family=Share+Tech+Mono&display=swap';
const FONT_LINK_ID = `osd-webfont-${SLIDE_ID}`;
const STYLE_ID = `osd-styles-${SLIDE_ID}`;
const SHAPES = 'path,line,polyline,polygon,rect,circle,ellipse';
const DRAW_EASE = 'cubic-bezier(0.55, 0, 0.25, 1)';
const KEYFRAMES = `
@keyframes ab-draw { from { stroke-dashoffset: 4000 } to { stroke-dashoffset: 0 } }
@keyframes ab-fill { from { fill-opacity: 0 } }
@keyframes ab-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes ab-rise { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }
@keyframes ab-sway { 0%, 100% { transform: scaleY(1) } 50% { transform: scaleY(-1) } }
.ab-on .ab-ink :is(${SHAPES}):not([stroke-dasharray]) { stroke-dasharray: 4000; animation: ab-draw 2.2s ${DRAW_EASE} var(--d, 0s) both; }
.ab-on .ab-ink :is(path,polygon,rect,circle,ellipse):not([stroke-dasharray]):not([fill="none"]) { animation: ab-draw 2.2s ${DRAW_EASE} var(--d, 0s) both, ab-fill 0.9s ease-out calc(var(--d, 0s) + 1.1s) both; }
.ab-on .ab-ink [stroke-dasharray] { animation: ab-fade 1s ease-out calc(var(--d, 0s) + 0.5s) both; }
.ab-on .ab-ink text { animation: ab-fade 0.8s ease-out calc(var(--d, 0s) + 0.8s) both; }
.ab-on .ab-in { animation: ab-rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) var(--d, 0s) both; }
.ab-on [data-osd-step="pending"] :is(.ab-ink *, .ab-in) { animation: none !important; }
.ab-on .ab-sway { animation: ab-sway 2.6s ease-in-out 2.4s infinite; }
@media (prefers-reduced-motion: reduce) {
  .ab-on .ab-ink *, .ab-on .ab-in, .ab-on .ab-sway { animation: none !important; }
}
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
const HOLD: Keyframe[] = [{ opacity: 1 }, { opacity: 1 }];

export const transition: SlideTransition = {
  duration: 240,
  exit: { duration: 240, easing: EASE_IN, keyframes: HOLD },
  enter: { duration: 240, easing: EASE_OUT, keyframes: [{ opacity: 0 }, { opacity: 1 }] },
};

const abs = (left: number, top: number, extra?: CSSProperties): CSSProperties => ({
  position: 'absolute',
  left,
  top,
  ...extra,
});

const d = (sec: number) => ({ '--d': `${sec}s` }) as CSSProperties;

const uidOf = (raw: string) => `ab${raw.replace(/[^a-zA-Z0-9]/g, '')}`;

const LABEL: CSSProperties = {
  fontFamily: MONO,
  fontSize: 20,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: CY,
};

const SMALL: CSSProperties = {
  fontFamily: MONO,
  fontSize: 18,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: MUTE,
};

const H2: CSSProperties = {
  fontFamily: 'var(--osd-font-display)',
  fontSize: 64,
  fontWeight: 600,
  lineHeight: 1,
  letterSpacing: '0.01em',
  textTransform: 'uppercase',
  margin: 0,
  color: 'var(--osd-text)',
};

const tx = (size: number, fill = INK, family = MONO, extra?: CSSProperties): CSSProperties => ({
  fontFamily: family,
  fontSize: size,
  fill,
  letterSpacing: family === MONO ? '0.06em' : undefined,
  ...extra,
});

const HALO: CSSProperties = {
  paintOrder: 'stroke',
  stroke: BG,
  strokeWidth: 7,
  strokeLinejoin: 'round',
};

const noise = (w: number, h: number, freq: string, alpha: number) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'><filter id='n' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0.85 0 0 0 0 0.93 0 0 0 0 1 ${alpha} 0 0 0 0'/></filter><rect width='${w}' height='${h}' filter='url(#n)'/></svg>`,
  )}")`;

const MOTTLE = noise(420, 420, '0.012', 1);
const TOOTH = noise(220, 220, '0.9', 1);

const SHEET_BG: CSSProperties = {
  backgroundColor: 'var(--osd-bg)',
  backgroundImage: [
    'radial-gradient(ellipse 90% 85% at 50% 45%, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 55%, rgba(3,16,40,0.38) 100%)',
    'linear-gradient(rgba(214,236,255,0.085) 1px, transparent 1px)',
    'linear-gradient(90deg, rgba(214,236,255,0.085) 1px, transparent 1px)',
    'linear-gradient(rgba(214,236,255,0.035) 1px, transparent 1px)',
    'linear-gradient(90deg, rgba(214,236,255,0.035) 1px, transparent 1px)',
  ].join(', '),
  backgroundSize: '100% 100%, 112px 112px, 112px 112px, 22.4px 22.4px, 22.4px 22.4px',
  backgroundPosition: '0 0, 64px 64px, 64px 64px, 64px 64px, 64px 64px',
};

const Svg = ({ children, className = 'ab-ink' }: { children: ReactNode; className?: string }) => (
  <svg
    width={1920}
    height={1080}
    viewBox="0 0 1920 1080"
    className={className}
    style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}
  >
    {children}
  </svg>
);

const ZoneCol = ({ k, n }: { k: number; n: string }) => {
  const x = 64 + k * 224;
  return (
    <g>
      {k > 0 && <line x1={x} y1={32} x2={x} y2={64} stroke={FAINT} strokeWidth={1.2} />}
      {k > 0 && <line x1={x} y1={1016} x2={x} y2={1048} stroke={FAINT} strokeWidth={1.2} />}
      <text x={x + 112} y={55} textAnchor="middle" style={tx(18, MUTE)}>
        {n}
      </text>
      <text x={x + 112} y={1039} textAnchor="middle" style={tx(18, MUTE)}>
        {n}
      </text>
    </g>
  );
};

const ZoneRow = ({ k, n }: { k: number; n: string }) => {
  const y = 64 + k * (952 / 6);
  return (
    <g>
      {k > 0 && <line x1={32} y1={y} x2={64} y2={y} stroke={FAINT} strokeWidth={1.2} />}
      {k > 0 && <line x1={1856} y1={y} x2={1888} y2={y} stroke={FAINT} strokeWidth={1.2} />}
      <text x={48} y={y + 952 / 12 + 6} textAnchor="middle" style={tx(18, MUTE)}>
        {n}
      </text>
      <text x={1872} y={y + 952 / 12 + 6} textAnchor="middle" style={tx(18, MUTE)}>
        {n}
      </text>
    </g>
  );
};

const Frame = () => (
  <svg
    width={1920}
    height={1080}
    viewBox="0 0 1920 1080"
    style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}
  >
    <rect x={32} y={32} width={1856} height={1016} fill="none" stroke={FAINT} strokeWidth={1.4} />
    <rect x={64} y={64} width={1792} height={952} fill="none" stroke={INK} strokeWidth={2.6} />
    <ZoneCol k={0} n="1" />
    <ZoneCol k={1} n="2" />
    <ZoneCol k={2} n="3" />
    <ZoneCol k={3} n="4" />
    <ZoneCol k={4} n="5" />
    <ZoneCol k={5} n="6" />
    <ZoneCol k={6} n="7" />
    <ZoneCol k={7} n="8" />
    <ZoneRow k={0} n="A" />
    <ZoneRow k={1} n="B" />
    <ZoneRow k={2} n="C" />
    <ZoneRow k={3} n="D" />
    <ZoneRow k={4} n="E" />
    <ZoneRow k={5} n="F" />
    <polygon points="960,64 950,46 970,46" fill={INK} />
    <polygon points="960,1016 950,1034 970,1034" fill={INK} />
    <polygon points="64,540 46,530 46,550" fill={INK} />
    <polygon points="1856,540 1874,530 1874,550" fill={INK} />
  </svg>
);

const Cell = ({
  label,
  children,
  style,
}: {
  label: string;
  children: ReactNode;
  style?: CSSProperties;
}) => (
  <div
    style={{
      borderRight: `1.2px solid ${FAINT}`,
      borderBottom: `1.2px solid ${FAINT}`,
      padding: '6px 12px 0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      minWidth: 0,
      ...style,
    }}
  >
    <span style={{ ...SMALL, lineHeight: 1.2 }}>{label}</span>
    {children}
  </div>
);

const TitleBlock = ({ title, scale }: { title: string; scale: string }) => {
  const { current, total } = useSlidePageNumber();
  const n = String(current).padStart(2, '0');
  return (
    <div
      style={{
        position: 'absolute',
        left: 1216,
        top: 848,
        width: 640,
        height: 168,
        boxSizing: 'border-box',
        borderTop: `2.6px solid ${INK}`,
        borderLeft: `2.6px solid ${INK}`,
        background: BG_DEEP,
        display: 'grid',
        gridTemplateColumns: '1fr 150px',
        gridTemplateRows: '46px 61px 1fr',
        color: INK,
      }}
    >
      <div
        style={{
          gridColumn: '1 / 3',
          borderBottom: `1.2px solid ${FAINT}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 14px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--osd-font-display)',
            fontWeight: 600,
            fontSize: 22,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Kestrel &amp; Vane Engineers
        </span>
        <span style={SMALL}>委託單位 Halbrook 市</span>
      </div>
      <Cell label={`圖號 · KV-2417-S-${100 + current}`}>
        <span
          style={{
            fontFamily: 'var(--osd-font-display)',
            fontWeight: 600,
            fontSize: 23,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            lineHeight: 1.25,
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </span>
      </Cell>
      <div
        style={{
          gridRow: '2 / 4',
          gridColumn: '2',
          borderBottom: `1.2px solid ${FAINT}`,
          padding: '8px 12px 0',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <span style={SMALL}>圖紙</span>
        <span
          style={{
            fontFamily: 'var(--osd-font-display)',
            fontWeight: 600,
            fontSize: 54,
            lineHeight: 1.05,
            color: CY,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {n}
        </span>
        <span style={SMALL}>共 {String(total).padStart(2, '0')}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.8fr 0.9fr 0.9fr' }}>
        <Cell label="比例">
          <span style={{ fontFamily: MONO, fontSize: 22, lineHeight: 1.3 }}>{scale}</span>
        </Cell>
        <Cell label="版次">
          <span style={{ fontFamily: MONO, fontSize: 22, lineHeight: 1.3, color: AMBER }}>C</span>
        </Cell>
        <Cell label="繪製">
          <span style={{ fontFamily: MONO, fontSize: 22, lineHeight: 1.3 }}>R.O.</span>
        </Cell>
        <Cell label="校核">
          <span style={{ fontFamily: MONO, fontSize: 22, lineHeight: 1.3 }}>M.L.</span>
        </Cell>
      </div>
    </div>
  );
};

const Sheet = ({
  title,
  scale = '無比例',
  label,
  heading,
  children,
}: {
  title: string;
  scale?: string;
  label?: string;
  heading?: string;
  children: ReactNode;
}) => {
  const live = useIsActivePage();
  return (
    <div
      className={live ? 'ab-on' : undefined}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        isolation: 'isolate',
        color: 'var(--osd-text)',
        fontFamily: 'var(--osd-font-body)',
        ...SHEET_BG,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: MOTTLE,
          backgroundSize: '840px 840px',
          opacity: 0.09,
          mixBlendMode: 'soft-light',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: TOOTH,
          backgroundSize: '220px 220px',
          opacity: 0.05,
        }}
      />
      {label && (
        <div className="ab-in" style={abs(120, 104, LABEL)}>
          {label}
        </div>
      )}
      {heading && (
        <h2 className="ab-in" style={{ ...abs(120, 140), ...H2, ...d(0.08) }}>
          {heading}
        </h2>
      )}
      {children}
      <TitleBlock title={title} scale={scale} />
      <Frame />
    </div>
  );
};

const Head = ({
  x,
  y,
  ang,
  c = CY,
  l = 13,
  w = 4.2,
}: {
  x: number;
  y: number;
  ang: number;
  c?: string;
  l?: number;
  w?: number;
}) => {
  const ca = Math.cos(ang);
  const sa = Math.sin(ang);
  const bx = x - ca * l;
  const by = y - sa * l;
  return (
    <polygon
      points={`${x},${y} ${bx - sa * w},${by + ca * w} ${bx + sa * w},${by - ca * w}`}
      fill={c}
    />
  );
};

const DimH = ({
  x1,
  x2,
  y,
  text,
  from1,
  from2,
  c = CY,
  tick = false,
  below = false,
  fs = 20,
}: {
  x1: number;
  x2: number;
  y: number;
  text: string;
  from1?: number;
  from2?: number;
  c?: string;
  tick?: boolean;
  below?: boolean;
  fs?: number;
}) => {
  const ext = (x: number, from?: number) =>
    from === undefined ? null : (
      <line
        x1={x}
        y1={from + (from > y ? -6 : 6)}
        x2={x}
        y2={y + (from > y ? -10 : 10)}
        stroke={c}
        strokeWidth={1.1}
      />
    );
  return (
    <g>
      {ext(x1, from1)}
      {ext(x2, from2)}
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={c} strokeWidth={1.3} />
      {tick ? (
        <>
          <line x1={x1 - 7} y1={y + 7} x2={x1 + 7} y2={y - 7} stroke={c} strokeWidth={2.2} />
          <line x1={x2 - 7} y1={y + 7} x2={x2 + 7} y2={y - 7} stroke={c} strokeWidth={2.2} />
        </>
      ) : (
        <>
          <Head x={x1} y={y} ang={Math.PI} c={c} />
          <Head x={x2} y={y} ang={0} c={c} />
        </>
      )}
      <text
        x={(x1 + x2) / 2}
        y={below ? y + fs + 6 : y - 8}
        textAnchor="middle"
        style={{ ...tx(fs, c), ...HALO }}
      >
        {text}
      </text>
    </g>
  );
};

const DimV = ({
  y1,
  y2,
  x,
  text,
  from1,
  from2,
  c = CY,
  right = false,
  fs = 20,
}: {
  y1: number;
  y2: number;
  x: number;
  text: string;
  from1?: number;
  from2?: number;
  c?: string;
  right?: boolean;
  fs?: number;
}) => {
  const ext = (y: number, from?: number) =>
    from === undefined ? null : (
      <line
        x1={from + (from > x ? -6 : 6)}
        y1={y}
        x2={x + (from > x ? -10 : 10)}
        y2={y}
        stroke={c}
        strokeWidth={1.1}
      />
    );
  const ty = (y1 + y2) / 2;
  const tx0 = right ? x + 10 + fs * 0.4 : x - 8;
  return (
    <g>
      {ext(y1, from1)}
      {ext(y2, from2)}
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={c} strokeWidth={1.3} />
      <Head x={x} y={Math.min(y1, y2)} ang={-Math.PI / 2} c={c} />
      <Head x={x} y={Math.max(y1, y2)} ang={Math.PI / 2} c={c} />
      <text
        transform={`translate(${tx0},${ty}) rotate(-90)`}
        textAnchor="middle"
        style={{ ...tx(fs, c), ...HALO }}
      >
        {text}
      </text>
    </g>
  );
};

const Level = ({
  x1,
  x2,
  y,
  text,
  c = INK,
  right = false,
}: {
  x1: number;
  x2: number;
  y: number;
  text: string;
  c?: string;
  right?: boolean;
}) => {
  const tri = right ? x2 - 30 : x1 + 30;
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={c} strokeWidth={1.1} />
      <polygon
        points={`${tri},${y} ${tri - 8},${y - 13} ${tri + 8},${y - 13}`}
        fill="none"
        stroke={c}
        strokeWidth={1.4}
      />
      <text
        x={right ? x2 - 46 : x1 + 46}
        y={y - 7}
        textAnchor={right ? 'end' : 'start'}
        style={{ ...tx(18, c), ...HALO }}
      >
        {text}
      </text>
    </g>
  );
};

const Leader = ({
  pts,
  text,
  sub,
  c = INK,
  tc,
  fs = 20,
  end = false,
}: {
  pts: number[];
  text: string;
  sub?: string;
  c?: string;
  tc?: string;
  fs?: number;
  end?: boolean;
}) => {
  const n = pts.length;
  const lx = pts[n - 2];
  const ly = pts[n - 1];
  const pairs: string[] = [];
  for (let i = 0; i < n; i += 2) pairs.push(`${pts[i]},${pts[i + 1]}`);
  return (
    <g>
      <circle cx={pts[0]} cy={pts[1]} r={3.6} fill={c} />
      <polyline points={pairs.join(' ')} fill="none" stroke={c} strokeWidth={1.2} />
      <text
        x={end ? lx - 8 : lx + 8}
        y={ly + fs * 0.34}
        textAnchor={end ? 'end' : 'start'}
        style={{ ...tx(fs, tc ?? c), ...HALO }}
      >
        {text}
      </text>
      {sub && (
        <text
          x={end ? lx - 8 : lx + 8}
          y={ly + fs * 0.34 + fs + 4}
          textAnchor={end ? 'end' : 'start'}
          style={{ ...tx(18, MUTE), ...HALO }}
        >
          {sub}
        </text>
      )}
    </g>
  );
};

const Tag = ({
  x,
  y,
  n,
  c = CY,
  r = 16,
}: {
  x: number;
  y: number;
  n: string;
  c?: string;
  r?: number;
}) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={BG} stroke={c} strokeWidth={1.6} />
    <text x={x} y={y + 6.5} textAnchor="middle" style={tx(18, c)}>
      {n}
    </text>
  </g>
);

const GridBubble = ({ x, y, n, to }: { x: number; y: number; n: string; to: number }) => (
  <g>
    <line
      x1={x}
      y1={y + 20}
      x2={x}
      y2={to}
      stroke={FAINT}
      strokeWidth={1}
      strokeDasharray="22 6 4 6"
    />
    <circle cx={x} cy={y} r={20} fill={BG} stroke={INK} strokeWidth={1.6} />
    <text x={x} y={y + 6.5} textAnchor="middle" style={tx(18, INK)}>
      {n}
    </text>
  </g>
);

const SectionCut = ({
  x,
  y1,
  y2,
  n,
  dir = 1,
}: {
  x: number;
  y1: number;
  y2: number;
  n: string;
  dir?: 1 | -1;
}) => (
  <g>
    <line x1={x} y1={y1} x2={x} y2={y2} stroke={CY} strokeWidth={1.2} strokeDasharray="26 6 4 6" />
    <line x1={x} y1={y1} x2={x} y2={y1 + 26} stroke={CY} strokeWidth={4} />
    <line x1={x} y1={y2 - 26} x2={x} y2={y2} stroke={CY} strokeWidth={4} />
    <line x1={x} y1={y1} x2={x + dir * 26} y2={y1} stroke={CY} strokeWidth={1.6} />
    <Head x={x + dir * 30} y={y1} ang={dir > 0 ? 0 : Math.PI} />
    <line x1={x} y1={y2} x2={x + dir * 26} y2={y2} stroke={CY} strokeWidth={1.6} />
    <Head x={x + dir * 30} y={y2} ang={dir > 0 ? 0 : Math.PI} />
    <circle cx={x} cy={y1 - 20} r={17} fill={BG} stroke={CY} strokeWidth={1.6} />
    <text x={x} y={y1 - 13.5} textAnchor="middle" style={tx(20, CY)}>
      {n}
    </text>
    <circle cx={x} cy={y2 + 20} r={17} fill={BG} stroke={CY} strokeWidth={1.6} />
    <text x={x} y={y2 + 26.5} textAnchor="middle" style={tx(20, CY)}>
      {n}
    </text>
  </g>
);

const SectionCutH = ({ y, x1, x2, n }: { y: number; x1: number; x2: number; n: string }) => (
  <g>
    <line x1={x1} y1={y} x2={x2} y2={y} stroke={CY} strokeWidth={1.2} strokeDasharray="10 4 3 4" />
    <line x1={x1} y1={y} x2={x1 + 12} y2={y} stroke={CY} strokeWidth={4} />
    <line x1={x2 - 12} y1={y} x2={x2} y2={y} stroke={CY} strokeWidth={4} />
    <line x1={x1} y1={y} x2={x1} y2={y + 20} stroke={CY} strokeWidth={1.6} />
    <Head x={x1} y={y + 26} ang={Math.PI / 2} />
    <line x1={x2} y1={y} x2={x2} y2={y + 20} stroke={CY} strokeWidth={1.6} />
    <Head x={x2} y={y + 26} ang={Math.PI / 2} />
    <circle cx={x1 - 20} cy={y} r={17} fill={BG} stroke={CY} strokeWidth={1.6} />
    <text x={x1 - 20} y={y + 6.5} textAnchor="middle" style={tx(20, CY)}>
      {n}
    </text>
    <circle cx={x2 + 20} cy={y} r={17} fill={BG} stroke={CY} strokeWidth={1.6} />
    <text x={x2 + 20} y={y + 6.5} textAnchor="middle" style={tx(20, CY)}>
      {n}
    </text>
  </g>
);

const NorthArrow = ({ x, y, r = 34 }: { x: number; y: number; r?: number }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill="none" stroke={INK} strokeWidth={1.4} />
    <circle cx={x} cy={y} r={r - 6} fill="none" stroke={FAINT} strokeWidth={1} />
    <polygon points={`${x},${y - r + 2} ${x + 10},${y + 8} ${x},${y + 2}`} fill={INK} />
    <polygon
      points={`${x},${y - r + 2} ${x - 10},${y + 8} ${x},${y + 2}`}
      fill="none"
      stroke={INK}
      strokeWidth={1.2}
    />
    <text x={x} y={y - r - 10} textAnchor="middle" style={tx(22, INK)}>
      N
    </text>
  </g>
);

const ScaleBar = ({ x, y, ppm, label }: { x: number; y: number; ppm: number; label: string }) => {
  const u = 5 * ppm;
  return (
    <g>
      <rect x={x} y={y} width={u} height={10} fill={INK} stroke={INK} strokeWidth={1.2} />
      <rect x={x + u} y={y} width={u} height={10} fill="none" stroke={INK} strokeWidth={1.2} />
      <rect
        x={x + 2 * u}
        y={y}
        width={2 * u}
        height={10}
        fill={INK}
        stroke={INK}
        strokeWidth={1.2}
      />
      <rect
        x={x + 4 * u}
        y={y}
        width={2 * u}
        height={10}
        fill="none"
        stroke={INK}
        strokeWidth={1.2}
      />
      <text x={x} y={y + 34} textAnchor="middle" style={tx(18, MUTE)}>
        0
      </text>
      <text x={x + 2 * u} y={y + 34} textAnchor="middle" style={tx(18, MUTE)}>
        10
      </text>
      <text x={x + 4 * u} y={y + 34} textAnchor="middle" style={tx(18, MUTE)}>
        20
      </text>
      <text x={x + 6 * u} y={y + 34} textAnchor="middle" style={tx(18, MUTE)}>
        30 m
      </text>
      <text x={x} y={y - 12} style={tx(18, MUTE)}>
        {label}
      </text>
    </g>
  );
};

type Geo = { s: number; X: (ch: number) => number; Y: (z: number) => number };

const geo = (s: number, ox: number, yTop: number, zTop = 50.5, sz = s): Geo => ({
  s,
  X: (ch) => ox + ch * s,
  Y: (z) => yTop + (zTop - z) * sz,
});

const cloudPath = (cx: number, cy: number, rx: number, ry: number, n: number) => {
  let p = '';
  let px = cx + rx;
  let py = cy;
  for (let i = 1; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const x = cx + rx * Math.cos(a);
    const y = cy + ry * Math.sin(a);
    const r = Math.hypot(x - px, y - py) * 0.62;
    p += `${i === 1 ? `M${px.toFixed(1)},${py.toFixed(1)} ` : ''}A${r.toFixed(1)},${r.toFixed(1)} 0 0 1 ${x.toFixed(1)},${y.toFixed(1)} `;
    px = x;
    py = y;
  }
  return `${p}Z`;
};

const pts = (g: Geo, p: number[][]) =>
  p.map(([c, z]) => `${g.X(c).toFixed(1)},${g.Y(z).toFixed(1)}`).join(' ');

const deckZ = (ch: number) => 17.7 + 0.04 * ch;
const PY_TOP = 49.54;
const pyHalf = (z: number) => 0.8 - (0.3 * (z - 15.4)) / (PY_TOP - 15.4);

const GROUND = [
  [-8, 16.2],
  [1, 16.2],
  [4, 14.0],
  [8, 10.2],
  [10, 9.8],
  [30, 9.8],
  [34, 12.0],
  [38, 16.0],
  [49.6, 16.0],
  [49.6, 12.4],
  [61, 12.4],
  [61, 17.8],
  [72, 17.8],
];

const WATER = [
  [5.68, 12.4],
  [8, 10.2],
  [10, 9.8],
  [30, 9.8],
  [34, 12.0],
  [34.4, 12.4],
];

type Part = 'sub' | 'pyLo' | 'pyHi' | 'back' | 'main' | 'bstays' | 'mstays' | 'trestles';
const ALL_PARTS: Part[] = ['sub', 'pyLo', 'pyHi', 'back', 'main', 'bstays', 'mstays'];

const Track = ({ g, c }: { g: Geo; c: number }) => (
  <g>
    <polygon
      points={pts(g, [
        [c - 2.4, 12.4],
        [c - 1.6, 12.75],
        [c + 1.6, 12.75],
        [c + 2.4, 12.4],
      ])}
      fill="none"
      stroke={FAINT}
      strokeWidth={1}
    />
    <rect
      x={g.X(c - 1.3)}
      y={g.Y(12.82)}
      width={2.6 * g.s}
      height={Math.max(2, 0.1 * g.s)}
      fill={MUTE}
    />
    <rect
      x={g.X(c - 0.76)}
      y={g.Y(12.95)}
      width={Math.max(2, 0.08 * g.s)}
      height={Math.max(2, 0.13 * g.s)}
      fill={INK}
    />
    <rect
      x={g.X(c + 0.68)}
      y={g.Y(12.95)}
      width={Math.max(2, 0.08 * g.s)}
      height={Math.max(2, 0.13 * g.s)}
      fill={INK}
    />
  </g>
);

const OleMast = ({ g, ch, to }: { g: Geo; ch: number; to: number }) => (
  <g>
    <line x1={g.X(ch)} y1={g.Y(12.4)} x2={g.X(ch)} y2={g.Y(18.4)} stroke={MUTE} strokeWidth={1.4} />
    <line x1={g.X(ch)} y1={g.Y(18.2)} x2={g.X(to)} y2={g.Y(18.2)} stroke={MUTE} strokeWidth={1.1} />
    <line x1={g.X(ch)} y1={g.Y(17.7)} x2={g.X(to)} y2={g.Y(18.2)} stroke={MUTE} strokeWidth={1} />
    <line x1={g.X(to)} y1={g.Y(18.2)} x2={g.X(to)} y2={g.Y(17.6)} stroke={MUTE} strokeWidth={1} />
    <circle cx={g.X(to)} cy={g.Y(17.6)} r={Math.max(2, g.s * 0.12)} fill={MUTE} />
  </g>
);

const Pile = ({
  g,
  ch,
  top,
  bot,
  w,
  c,
}: {
  g: Geo;
  ch: number;
  top: number;
  bot: number;
  w: number;
  c: string;
}) => {
  const x0 = g.X(ch - w / 2);
  const x1 = g.X(ch + w / 2);
  const yt = g.Y(top);
  const yb = g.Y(bot);
  const xm = (x0 + x1) / 2;
  return (
    <path
      d={`M${x0},${yt} L${x0},${yb} L${(x0 + xm) / 2},${yb - 4} L${(xm + x1) / 2},${yb + 4} L${x1},${yb} L${x1},${yt}`}
      fill="none"
      stroke={c}
      strokeWidth={1.3}
    />
  );
};

const StayLine = ({
  g,
  a,
  zp,
  side,
  c,
  sw,
}: {
  g: Geo;
  a: number;
  zp: number;
  side: -1 | 1;
  c: string;
  sw: number;
}) => {
  const az = a === 64 ? 20.0 : deckZ(a) + 0.05;
  return (
    <g>
      <line
        x1={g.X(a)}
        y1={g.Y(az)}
        x2={g.X(46 + side * pyHalf(zp) * 0.9)}
        y2={g.Y(zp)}
        stroke={c}
        strokeWidth={sw}
      />
      <circle cx={g.X(a)} cy={g.Y(az)} r={Math.max(2, g.s * 0.16)} fill={c} />
    </g>
  );
};

const Trestle = ({ g, ch, c }: { g: Geo; ch: number; c: string }) => {
  const top = deckZ(ch) - 0.75;
  const xl = g.X(ch - 1.2);
  const xr = g.X(ch + 1.2);
  const yt = g.Y(top);
  const yb = g.Y(9.8);
  const ym = (yt + yb) / 2;
  return (
    <g>
      <line x1={xl} y1={yt} x2={xl} y2={yb} stroke={c} strokeWidth={1.4} strokeDasharray="6 4" />
      <line x1={xr} y1={yt} x2={xr} y2={yb} stroke={c} strokeWidth={1.4} strokeDasharray="6 4" />
      <line x1={xl} y1={yt} x2={xr} y2={ym} stroke={c} strokeWidth={1} strokeDasharray="4 3" />
      <line x1={xr} y1={yt} x2={xl} y2={ym} stroke={c} strokeWidth={1} strokeDasharray="4 3" />
      <line x1={xl} y1={ym} x2={xr} y2={yb} stroke={c} strokeWidth={1} strokeDasharray="4 3" />
      <line x1={xr} y1={ym} x2={xl} y2={yb} stroke={c} strokeWidth={1} strokeDasharray="4 3" />
    </g>
  );
};

const Crane = ({ g, tipCh, tipZ }: { g: Geo; tipCh: number; tipZ: number }) => (
  <g>
    <rect
      x={g.X(66.4)}
      y={g.Y(18.6)}
      width={5 * g.s}
      height={0.8 * g.s}
      fill="none"
      stroke={AMBER}
      strokeWidth={1.3}
    />
    <rect
      x={g.X(67.4)}
      y={g.Y(20.6)}
      width={3 * g.s}
      height={2 * g.s}
      fill="none"
      stroke={AMBER}
      strokeWidth={1.3}
    />
    <line
      x1={g.X(68)}
      y1={g.Y(20.6)}
      x2={g.X(tipCh)}
      y2={g.Y(tipZ)}
      stroke={AMBER}
      strokeWidth={1.8}
    />
    <line
      x1={g.X(tipCh)}
      y1={g.Y(tipZ)}
      x2={g.X(tipCh)}
      y2={g.Y(tipZ - 6)}
      stroke={AMBER}
      strokeWidth={1}
      strokeDasharray="4 3"
    />
  </g>
);

const Elevation = ({
  g,
  zBot = 8,
  show = ALL_PARTS,
  hl,
  crane,
  lite = false,
}: {
  g: Geo;
  zBot?: number;
  show?: Part[];
  hl?: Part[];
  crane?: [number, number];
  lite?: boolean;
}) => {
  const uid = uidOf(useId());
  const { X, Y, s } = g;
  const has = (p: Part) => show.includes(p);
  const col = (p: Part) => (!hl ? INK : hl.includes(p) ? CY : FAINT);
  const sw = s >= 10 ? 2 : 1.4;
  const earth = [...GROUND, [72, zBot], [-8, zBot]];
  const deckPoly = (a: number, b: number) =>
    pts(g, [
      [a, deckZ(a)],
      [b, deckZ(b)],
      [b, deckZ(b) - 0.75],
      [a, deckZ(a) - 0.75],
    ]);
  const pyPoly = (z0: number, z1: number) =>
    pts(g, [
      [46 - pyHalf(z0), z0],
      [46 + pyHalf(z0), z0],
      [46 + pyHalf(z1), z1],
      [46 - pyHalf(z1), z1],
    ]);
  return (
    <g>
      <defs>
        <pattern
          id={`${uid}e`}
          width={9}
          height={9}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1={0} y1={0} x2={0} y2={9} stroke={GHOST} strokeWidth={1.2} />
        </pattern>
      </defs>
      <polygon points={pts(g, earth)} fill={`url(#${uid}e)`} stroke="none" />
      <polygon points={pts(g, WATER)} fill={CY} fillOpacity={0.13} stroke="none" />
      <polyline
        points={pts(g, [
          [5.68, 12.4],
          [34.4, 12.4],
        ])}
        fill="none"
        stroke={CY}
        strokeWidth={1.3}
      />
      {!lite && (
        <>
          <line
            x1={X(10)}
            y1={Y(11.6)}
            x2={X(28)}
            y2={Y(11.6)}
            stroke={CY}
            strokeOpacity={0.5}
            strokeWidth={1}
            strokeDasharray="18 10"
          />
          <line
            x1={X(13)}
            y1={Y(10.8)}
            x2={X(26)}
            y2={Y(10.8)}
            stroke={CY}
            strokeOpacity={0.35}
            strokeWidth={1}
            strokeDasharray="12 12"
          />
        </>
      )}
      <line
        x1={X(1.48)}
        y1={Y(15.85)}
        x2={X(37.85)}
        y2={Y(15.85)}
        stroke={CY}
        strokeWidth={1.2}
        strokeDasharray="12 5 3 5"
      />
      <polyline points={pts(g, GROUND)} fill="none" stroke={INK} strokeWidth={sw} />
      <Track g={g} c={53} />
      <Track g={g} c={57.5} />
      <OleMast g={g} ch={50.5} to={53} />
      <OleMast g={g} ch={60.1} to={57.5} />
      {has('sub') && (
        <g>
          <polygon
            points={pts(g, [
              [-1.5, 14.6],
              [0.5, 14.6],
              [0.5, 16.95],
              [-0.2, 16.95],
              [-0.2, 17.7],
              [-1.5, 17.7],
            ])}
            fill={BG}
            stroke={col('sub')}
            strokeWidth={sw * 0.8}
          />
          <rect
            x={X(-2.5)}
            y={Y(14.6)}
            width={4 * s}
            height={1 * s}
            fill={BG}
            stroke={col('sub')}
            strokeWidth={sw * 0.8}
          />
          <Pile g={g} ch={-1.6} top={13.6} bot={zBot} w={0.75} c={col('sub')} />
          <Pile g={g} ch={0.6} top={13.6} bot={zBot} w={0.75} c={col('sub')} />
          <polygon
            points={pts(g, [
              [63.6, 16.8],
              [66, 16.8],
              [66, 20.26],
              [64.3, 20.26],
              [64.3, 19.51],
              [63.6, 19.51],
            ])}
            fill={BG}
            stroke={col('sub')}
            strokeWidth={sw * 0.8}
          />
          <rect
            x={X(62.6)}
            y={Y(16.8)}
            width={5 * s}
            height={1 * s}
            fill={BG}
            stroke={col('sub')}
            strokeWidth={sw * 0.8}
          />
          <Pile g={g} ch={63.4} top={15.8} bot={zBot} w={0.75} c={col('sub')} />
          <Pile g={g} ch={66.8} top={15.8} bot={zBot} w={0.75} c={col('sub')} />
          <rect
            x={X(43.5)}
            y={Y(15.4)}
            width={5 * s}
            height={2 * s}
            fill={BG}
            stroke={col('sub')}
            strokeWidth={sw * 0.8}
          />
          <Pile g={g} ch={44.3} top={13.4} bot={zBot} w={0.9} c={col('sub')} />
          <Pile g={g} ch={46} top={13.4} bot={zBot} w={0.9} c={col('sub')} />
          <Pile g={g} ch={47.7} top={13.4} bot={zBot} w={0.9} c={col('sub')} />
        </g>
      )}
      {has('trestles') && (
        <g>
          <Trestle g={g} ch={17} c={col('trestles')} />
          <Trestle g={g} ch={30} c={col('trestles')} />
        </g>
      )}
      {has('pyLo') && (
        <polygon points={pyPoly(15.4, 21)} fill={BG} stroke={col('pyLo')} strokeWidth={sw} />
      )}
      {has('pyHi') && (
        <g>
          <polygon points={pyPoly(21, PY_TOP)} fill={BG} stroke={col('pyHi')} strokeWidth={sw} />
          <line
            x1={X(46)}
            y1={Y(PY_TOP)}
            x2={X(46)}
            y2={Y(PY_TOP + 1.1)}
            stroke={col('pyHi')}
            strokeWidth={sw * 0.7}
          />
        </g>
      )}
      {has('mstays') && (
        <g>
          <StayLine g={g} a={10} zp={48.4} side={-1} c={col('mstays')} sw={sw * 0.6} />
          <StayLine g={g} a={16} zp={47.2} side={-1} c={col('mstays')} sw={sw * 0.6} />
          <StayLine g={g} a={22} zp={46.0} side={-1} c={col('mstays')} sw={sw * 0.6} />
          <StayLine g={g} a={28} zp={44.8} side={-1} c={col('mstays')} sw={sw * 0.6} />
          <StayLine g={g} a={34} zp={43.6} side={-1} c={col('mstays')} sw={sw * 0.6} />
          <StayLine g={g} a={40} zp={42.4} side={-1} c={col('mstays')} sw={sw * 0.6} />
        </g>
      )}
      {has('bstays') && (
        <g>
          <StayLine g={g} a={52} zp={42.4} side={1} c={col('bstays')} sw={sw * 0.75} />
          <StayLine g={g} a={58} zp={45.4} side={1} c={col('bstays')} sw={sw * 0.75} />
          <StayLine g={g} a={64} zp={48.4} side={1} c={col('bstays')} sw={sw * 0.9} />
        </g>
      )}
      {has('main') && (
        <g>
          <polygon points={deckPoly(0, 46)} fill={BG} stroke={col('main')} strokeWidth={sw} />
          <polyline
            points={pts(g, [
              [0, deckZ(0) + 1.4],
              [46, deckZ(46) + 1.4],
            ])}
            fill="none"
            stroke={col('main')}
            strokeOpacity={0.6}
            strokeWidth={1}
          />
        </g>
      )}
      {has('back') && (
        <g>
          <polygon points={deckPoly(46, 64)} fill={BG} stroke={col('back')} strokeWidth={sw} />
          <polyline
            points={pts(g, [
              [46, deckZ(46) + 1.4],
              [49, deckZ(49) + 1.4],
              [49, deckZ(49) + 1.8],
              [62, deckZ(62) + 1.8],
              [62, deckZ(62) + 1.4],
              [64, deckZ(64) + 1.4],
            ])}
            fill="none"
            stroke={col('back')}
            strokeOpacity={0.6}
            strokeWidth={1}
          />
        </g>
      )}
      {crane && <Crane g={g} tipCh={crane[0]} tipZ={crane[1]} />}
    </g>
  );
};

const CoverPage: Page = () => {
  const g = geo(11, 998, 176);
  return (
    <Sheet title="封面" scale="1:500">
      <div className="ab-in" style={abs(120, 104, LABEL)}>
        Halbrook 市 · 設計審查小組 · 2026 年 10 月 14 日
      </div>
      <div className="ab-in" style={{ ...abs(120, 250), ...d(0.15) }}>
        <div
          style={{
            fontFamily: 'var(--osd-font-display)',
            fontSize: 'var(--osd-size-hero)',
            fontWeight: 600,
            lineHeight: 0.98,
            letterSpacing: '0.005em',
            textTransform: 'uppercase',
          }}
        >
          Arden Street
          <br />
          人行橋
        </div>
      </div>
      <div className="ab-in" style={{ ...abs(124, 528, { width: 800 }), ...d(0.35) }}>
        <div style={{ ...LABEL, fontSize: 24, color: AMBER }}>60% 設計審查 · 版次 C</div>
        <p
          style={{
            margin: '18px 0 0',
            fontSize: 'var(--osd-size-body)',
            lineHeight: 1.45,
            color: MUTE,
          }}
        >
          一座跨越 Kell 河與 Carrow 鐵路線、全長 64 m 的斜張式步行與自行車橋，連接 Kell Meadows 與
          Arden Street。
        </p>
      </div>
      <Svg>
        <g style={d(0.2)}>
          <Elevation g={g} lite />
        </g>
        <g style={d(1.2)}>
          <ScaleBar x={1010} y={700} ppm={11} label="比例 1:500" />
          <path
            d="M1412,772 C1430,740 1452,694 1480,664"
            fill="none"
            stroke={AMBER}
            strokeWidth={1.8}
          />
          <Head x={1484} y={657} ang={-1.05} c={AMBER} />
          <text x={1392} y={800} textAnchor="middle" style={tx(26, AMBER, HAND)}>
            堤岸上的橋塔 —
          </text>
          <text x={1392} y={832} textAnchor="middle" style={tx(26, AMBER, HAND)}>
            河中不設橋墩
          </text>
        </g>
      </Svg>
      <div className="ab-in" style={{ ...abs(120, 862), ...d(0.6) }}>
        <div style={SMALL}>報告人</div>
        <div style={{ fontSize: 30, marginTop: 8, lineHeight: 1.35 }}>
          Ruth Okafor，專案工程師 · Magnus Lindqvist，設計主持人
        </div>
      </div>
    </Sheet>
  );
};

const PlanStayPair = ({ x }: { x: number }) => (
  <g>
    <line x1={x} y1={578.4} x2={768} y2={600} stroke={FAINT} strokeWidth={1} />
    <line x1={x} y1={621.6} x2={768} y2={600} stroke={FAINT} strokeWidth={1} />
  </g>
);

const Tree = ({ x, y, r = 22 }: { x: number; y: number; r?: number }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill="none" stroke={MUTE} strokeWidth={1.2} />
    <circle cx={x} cy={y} r={r * 0.55} fill="none" stroke={GHOST} strokeWidth={1} />
    <line x1={x - 5} y1={y} x2={x + 5} y2={y} stroke={MUTE} strokeWidth={1} />
    <line x1={x} y1={y - 5} x2={x} y2={y + 5} stroke={MUTE} strokeWidth={1} />
  </g>
);

const PlanTrack = ({ x, id }: { x: number; id: string }) => (
  <g>
    <rect x={x - 10} y={250} width={20} height={710} fill={`url(#${id})`} stroke="none" />
    <line x1={x - 5.7} y1={250} x2={x - 5.7} y2={960} stroke={INK} strokeWidth={1.3} />
    <line x1={x + 5.7} y1={250} x2={x + 5.7} y2={960} stroke={INK} strokeWidth={1.3} />
  </g>
);

const Stat = ({
  top,
  value,
  label,
  note,
  delay,
}: {
  top: number;
  value: string;
  label: string;
  note: string;
  delay: number;
}) => (
  <div className="ab-in" style={{ ...abs(1250, top, { width: 560 }), ...d(delay) }}>
    <div style={{ ...SMALL, color: CY }}>{label}</div>
    <div
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontWeight: 600,
        fontSize: 80,
        lineHeight: 1.05,
        marginTop: 6,
      }}
    >
      {value}
    </div>
    <div style={{ fontSize: 28, color: MUTE, lineHeight: 1.35, marginTop: 4 }}>{note}</div>
  </div>
);

const SitePage: Page = () => {
  const uid = uidOf(useId());
  return (
    <Sheet title="基地平面圖" scale="1:1000" label="基地環境 · 平面" heading="落腳何處">
      <Svg>
        <defs>
          <pattern id={`${uid}w`} width={26} height={14} patternUnits="userSpaceOnUse">
            <line x1={2} y1={7} x2={14} y2={7} stroke={CY} strokeOpacity={0.45} strokeWidth={1.1} />
          </pattern>
          <pattern id={`${uid}s`} width={20} height={9} patternUnits="userSpaceOnUse">
            <line
              x1={0}
              y1={4}
              x2={20}
              y2={4}
              stroke={MUTE}
              strokeOpacity={0.55}
              strokeWidth={2.4}
            />
          </pattern>
          <pattern
            id={`${uid}b`}
            width={10}
            height={10}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1={0} y1={0} x2={0} y2={10} stroke={GHOST} strokeWidth={1.4} />
          </pattern>
        </defs>
        <g style={d(0.1)}>
          <path
            d="M452,250 C418,380 408,520 432,600 C452,668 478,800 444,960 L690,960 C724,800 690,668 672,600 C650,520 664,390 700,250 Z"
            fill={CY}
            fillOpacity={0.1}
            stroke="none"
          />
          <path
            d="M452,250 C418,380 408,520 432,600 C452,668 478,800 444,960 L690,960 C724,800 690,668 672,600 C650,520 664,390 700,250 Z"
            fill={`url(#${uid}w)`}
            stroke="none"
          />
          <path
            d="M452,250 C418,380 408,520 432,600 C452,668 478,800 444,960"
            fill="none"
            stroke={INK}
            strokeWidth={1.8}
          />
          <path
            d="M700,250 C664,390 650,520 672,600 C690,668 724,800 690,960"
            fill="none"
            stroke={INK}
            strokeWidth={1.8}
          />
          <line x1={566} y1={790} x2={566} y2={862} stroke={CY} strokeWidth={1.4} />
          <Head x={566} y={868} ang={Math.PI / 2} />
          <text x={580} y={832} style={tx(18, CY)}>
            水流
          </text>
        </g>
        <g style={d(0.3)}>
          <rect x={797} y={250} width={5} height={710} fill={BG} stroke={INK} strokeWidth={1.2} />
          <rect x={883} y={250} width={5} height={710} fill={BG} stroke={INK} strokeWidth={1.2} />
          <PlanTrack x={824} id={`${uid}s`} />
          <PlanTrack x={860} id={`${uid}s`} />
          <text
            transform="translate(848,420) rotate(-90)"
            textAnchor="middle"
            style={{ ...tx(18, MUTE), ...HALO }}
          >
            CARROW 鐵路線 · 25 kV
          </text>
        </g>
        <g style={d(0.4)}>
          <line x1={920} y1={250} x2={920} y2={960} stroke={FAINT} strokeWidth={1} />
          <line x1={940} y1={250} x2={940} y2={960} stroke={INK} strokeWidth={1.6} />
          <line x1={1030} y1={250} x2={1030} y2={960} stroke={INK} strokeWidth={1.6} />
          <line x1={1050} y1={250} x2={1050} y2={960} stroke={FAINT} strokeWidth={1} />
          <line
            x1={985}
            y1={250}
            x2={985}
            y2={960}
            stroke={MUTE}
            strokeWidth={1.2}
            strokeDasharray="22 16"
          />
          <text
            transform="translate(1004,820) rotate(-90)"
            textAnchor="middle"
            style={{ ...tx(18, MUTE), ...HALO }}
          >
            ARDEN STREET
          </text>
          <rect
            x={1070}
            y={262}
            width={80}
            height={180}
            fill={`url(#${uid}b)`}
            stroke={INK}
            strokeWidth={1.3}
          />
          <rect
            x={1070}
            y={700}
            width={80}
            height={250}
            fill={`url(#${uid}b)`}
            stroke={INK}
            strokeWidth={1.3}
          />
        </g>
        <g style={d(0.5)}>
          <path
            d="M130,330 C260,420 330,560 400,600 C360,680 300,820 262,960"
            fill="none"
            stroke={FAINT}
            strokeWidth={24}
          />
          <path
            d="M130,330 C260,420 330,560 400,600 C360,680 300,820 262,960"
            fill="none"
            stroke={BG}
            strokeWidth={20}
          />
          <path
            d="M130,330 C260,420 330,560 400,600 C360,680 300,820 262,960"
            fill="none"
            stroke={MUTE}
            strokeWidth={1}
            strokeDasharray="10 10"
          />
          <Tree x={262} y={344} r={18} />
          <Tree x={346} y={326} r={18} />
          <Tree x={370} y={392} r={18} />
          <Tree x={176} y={520} />
          <Tree x={252} y={566} r={18} />
          <Tree x={160} y={760} />
          <Tree x={228} y={846} r={18} />
          <Tree x={150} y={880} r={18} />
        </g>
        <g style={d(0.7)}>
          <rect x={888} y={566} width={52} height={68} fill={BG} stroke={MUTE} strokeWidth={1.2} />
          <rect
            x={748}
            y={555}
            width={40}
            height={90}
            fill="none"
            stroke={MUTE}
            strokeWidth={1}
            strokeDasharray="5 4"
          />
          <rect
            x={400}
            y={578.4}
            width={512}
            height={43.2}
            fill={BG}
            stroke={INK}
            strokeWidth={2.2}
          />
          <line x1={400} y1={583} x2={912} y2={583} stroke={FAINT} strokeWidth={1} />
          <line x1={400} y1={617} x2={912} y2={617} stroke={FAINT} strokeWidth={1} />
          <PlanStayPair x={480} />
          <PlanStayPair x={528} />
          <PlanStayPair x={576} />
          <PlanStayPair x={624} />
          <PlanStayPair x={672} />
          <PlanStayPair x={720} />
          <PlanStayPair x={816} />
          <PlanStayPair x={864} />
          <PlanStayPair x={912} />
          <rect x={761} y={559} width={14} height={10} fill={CY} stroke={CY} strokeWidth={1} />
          <rect x={761} y={631} width={14} height={10} fill={CY} stroke={CY} strokeWidth={1} />
          <circle cx={768} cy={600} r={5} fill={CY} />
        </g>
        <g style={d(1.0)}>
          <SectionCut x={624} y1={548} y2={652} n="A" />
          <Leader pts={[398, 612, 360, 668, 330, 668]} text="A1 · 綠道" end />
          <Leader pts={[768, 645, 740, 730, 720, 730]} text="P1 · 位於防洪堤岸" end />
          <Leader pts={[912, 578, 950, 520, 962, 520]} text="A2 · ARDEN ST" />
          <NorthArrow x={1110} y={604} />
          <ScaleBar x={150} y={262} ppm={8} label="" />
          <path
            d="M262,930 C250,946 246,956 244,968"
            fill="none"
            stroke={AMBER}
            strokeWidth={1.6}
            strokeDasharray="6 5"
          />
          <text x={300} y={906} style={tx(24, AMBER, HAND)}>
            目前繞行距離：
          </text>
          <text x={300} y={936} style={{ ...tx(20, AMBER), ...HALO }}>
            1.1 公里 ↓
          </text>
          <text x={150} y={440} style={{ ...tx(18, MUTE), ...HALO }}>
            KELL MEADOWS
          </text>
        </g>
      </Svg>
      <Stat
        top={262}
        value="1.1 km → 64 m"
        label="跨越長度"
        note="目前須繞經 Carrow Road 橋。"
        delay={0.5}
      />
      <Stat
        top={462}
        value="2,400 / 日"
        label="2030 年預估通行量"
        note="60% 步行，40% 騎自行車。"
        delay={0.7}
      />
      <Stat
        top={662}
        value="13 分鐘"
        label="每趟步行節省"
        note="從 Meadows 到 Halbrook Central。"
        delay={0.9}
      />
    </Sheet>
  );
};

const ConstraintRow = ({
  top,
  n,
  title,
  req,
  prov,
  delay,
}: {
  top: number;
  n: string;
  title: string;
  req: string;
  prov: string;
  delay: number;
}) => (
  <div className="ab-in" style={{ ...abs(1220, top, { width: 590 }), ...d(delay) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <span
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          border: `1.6px solid ${CY}`,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: MONO,
          fontSize: 18,
          color: CY,
          flex: 'none',
        }}
      >
        {n}
      </span>
      <span
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontWeight: 600,
          fontSize: 32,
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
        }}
      >
        {title}
      </span>
    </div>
    <div style={{ marginLeft: 50, marginTop: 6, fontFamily: MONO, fontSize: 22, lineHeight: 1.45 }}>
      <div style={{ color: MUTE }}>要求&nbsp;&nbsp;{req}</div>
      <div style={{ color: CY }}>提供&nbsp;{prov}</div>
    </div>
  </div>
);

const ChTick = ({ x, label }: { x: number; label: string }) => (
  <g>
    <line x1={x} y1={752} x2={x} y2={768} stroke={MUTE} strokeWidth={1.2} />
    <text x={x} y={794} textAnchor="middle" style={tx(18, MUTE)}>
      {label}
    </text>
  </g>
);

const ConstraintsPage: Page = () => {
  const g = geo(13, 224, 280, 24, 26);
  const { X, Y } = g;
  const uid = uidOf(useId());
  const earth = [...GROUND, [72, 7], [-8, 7]];
  const soffit = (ch: number) => deckZ(ch) - 0.75;
  return (
    <Sheet
      title="限制條件 · 縱斷面"
      scale="1:500 V×2"
      label="限制條件 · 縱斷面 · 垂直放大 ×2"
      heading="什麼決定了高程"
    >
      <Svg>
        <defs>
          <pattern
            id={`${uid}e`}
            width={9}
            height={9}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1={0} y1={0} x2={0} y2={9} stroke={GHOST} strokeWidth={1.2} />
          </pattern>
        </defs>
        <g style={d(0.1)}>
          <polygon points={pts(g, earth)} fill={`url(#${uid}e)`} stroke="none" />
          <polygon points={pts(g, WATER)} fill={CY} fillOpacity={0.13} stroke="none" />
          <polyline points={pts(g, GROUND)} fill="none" stroke={INK} strokeWidth={2} />
          <line x1={X(5.68)} y1={Y(12.4)} x2={X(34.4)} y2={Y(12.4)} stroke={CY} strokeWidth={1.3} />
          <Track g={g} c={53} />
          <Track g={g} c={57.5} />
          <OleMast g={g} ch={50.5} to={53} />
          <OleMast g={g} ch={60.1} to={57.5} />
        </g>
        <g style={d(0.4)}>
          <polygon
            points={pts(g, [
              [0, deckZ(0)],
              [64, deckZ(64)],
              [64, soffit(64)],
              [0, soffit(0)],
            ])}
            fill={BG}
            stroke={INK}
            strokeWidth={2.2}
          />
          <rect
            x={X(43.5)}
            y={Y(15.4)}
            width={5 * 13}
            height={2 * 26}
            fill={BG}
            stroke={INK}
            strokeWidth={1.4}
          />
          <polygon
            points={pts(g, [
              [45.2, 15.4],
              [46.8, 15.4],
              [46.75, 23.6],
              [45.25, 23.6],
            ])}
            fill={BG}
            stroke={INK}
            strokeWidth={1.6}
          />
          <path
            d={`M${X(45.25)},${Y(23.6)} L${X(45.7)},${Y(23.6) - 6} L${X(46.3)},${Y(23.6) + 6} L${X(46.75)},${Y(23.6)}`}
            fill="none"
            stroke={INK}
            strokeWidth={1.4}
          />
          <polygon
            points={pts(g, [
              [-1.5, 14.6],
              [0.5, 14.6],
              [0.5, soffit(0)],
              [-1.5, soffit(0)],
            ])}
            fill={BG}
            stroke={INK}
            strokeWidth={1.4}
          />
          <polygon
            points={pts(g, [
              [63.6, 16.8],
              [66, 16.8],
              [66, deckZ(64)],
              [64.3, deckZ(64)],
              [64.3, soffit(64)],
              [63.6, soffit(64)],
            ])}
            fill={BG}
            stroke={INK}
            strokeWidth={1.4}
          />
        </g>
        <g style={d(0.8)}>
          <line
            x1={X(1.48)}
            y1={Y(15.85)}
            x2={X(37.85)}
            y2={Y(15.85)}
            stroke={CY}
            strokeWidth={1.4}
            strokeDasharray="12 5 3 5"
          />
          <text x={X(12)} y={Y(15.85) + 26} style={{ ...tx(18, CY), ...HALO }}>
            1% AEP + 40% CC · +15.850
          </text>
          <text x={X(12)} y={Y(12.4) + 26} style={{ ...tx(18, CY), ...HALO }}>
            NWL +12.400
          </text>
          <rect
            x={X(50.4)}
            y={Y(18.7)}
            width={10.2 * 13}
            height={(18.7 - 12.9) * 26}
            fill="none"
            stroke={AMBER}
            strokeWidth={1.3}
            strokeDasharray="8 5"
          />
          <text
            x={X(55.8)}
            y={Y(12.4) + 34}
            textAnchor="middle"
            style={{ ...tx(18, AMBER), ...HALO }}
          >
            OLE 淨空範圍
          </text>
          <line
            x1={X(49.6)}
            y1={Y(12.9)}
            x2={X(61)}
            y2={Y(12.9)}
            stroke={MUTE}
            strokeWidth={1}
            strokeDasharray="3 4"
          />
        </g>
        <g style={d(1.2)}>
          <DimV x={X(3)} y1={Y(soffit(3))} y2={Y(15.85)} text="" c={CY} />
          <Tag x={X(3) + 30} y={(Y(soffit(3)) + Y(15.85)) / 2} n="1" />
          <DimV x={X(51)} y1={Y(soffit(51))} y2={Y(12.9)} text="" c={AMBER} />
          <Tag x={X(51) + 28} y={Y(16)} n="2" c={AMBER} />
          <path
            d={`M${X(20)},${Y(deckZ(20)) - 26} L${X(32)},${Y(deckZ(32)) - 26} L${X(32)},${Y(deckZ(20)) - 26} Z`}
            fill="none"
            stroke={CY}
            strokeWidth={1.3}
          />
          <text x={X(32) + 10} y={Y(deckZ(26)) - 34} style={{ ...tx(20, CY), ...HALO }}>
            1:25
          </text>
          <Tag x={X(26)} y={Y(deckZ(26)) - 72} n="3" />
          <DimH x1={X(46.8)} x2={X(52.28)} y={Y(21.4)} text="" c={CY} from2={Y(12.9)} />
          <Tag x={X(49.54)} y={Y(21.4) - 26} n="4" />
          <path
            d={cloudPath(X(52.8), Y(19.5), 64, 36, 14)}
            fill="none"
            stroke={AMBER}
            strokeWidth={1.6}
          />
          <text x={X(52)} y={262} style={tx(26, AMBER, HAND)}>
            版次 C：橋面 +250 mm
          </text>
          <line
            x1={X(60)}
            y1={272}
            x2={X(52.8) + 56}
            y2={Y(19.5) - 20}
            stroke={AMBER}
            strokeWidth={1.3}
          />
          <ChTick x={X(0)} label="里程 0" />
          <ChTick x={X(10)} label="10" />
          <ChTick x={X(20)} label="20" />
          <ChTick x={X(30)} label="30" />
          <ChTick x={X(40)} label="40" />
          <ChTick x={X(50)} label="50" />
          <ChTick x={X(64)} label="64 m" />
          <line x1={X(0)} y1={760} x2={X(64)} y2={760} stroke={MUTE} strokeWidth={1.2} />
          <text x={X(-6)} y={Y(deckZ(0)) - 14} style={{ ...tx(18, INK), ...HALO }}>
            +17.700
          </text>
          <text x={X(66.6)} y={Y(deckZ(64)) + 30} style={{ ...tx(18, INK), ...HALO }}>
            +20.260
          </text>
        </g>
      </Svg>
      <ConstraintRow
        top={268}
        n="1"
        title="洪水乾舷"
        req="高於 +15.850 達 600 mm"
        prov="西岸為 1,160 mm"
        delay={0.4}
      />
      <ConstraintRow
        top={410}
        n="2"
        title="鐵路 · OLE 淨空"
        req="軌面上方 5.80 m"
        prov="6.07 m — 控制縱斷面"
        delay={0.6}
      />
      <ConstraintRow
        top={552}
        n="3"
        title="坡度"
        req="最大 1:20，平台處 1:20"
        prov="1:25 — 免設平台"
        delay={0.8}
      />
      <ConstraintRow
        top={694}
        n="4"
        title="橋塔退縮距離"
        req="距最近鋼軌 4.5 m"
        prov="5.48 m · 河中無橋墩"
        delay={1.0}
      />
    </Sheet>
  );
};

const Metric = ({ k, v, good }: { k: string; v: string; good?: boolean }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      borderTop: `1px solid ${GHOST}`,
      padding: '8px 0 6px',
    }}
  >
    <span style={SMALL}>{k}</span>
    <span style={{ fontFamily: MONO, fontSize: 28, color: good ? CY : INK }}>{v}</span>
  </div>
);

const OptionCard = ({
  x,
  tag,
  title,
  chosen,
  sketch,
  children,
}: {
  x: number;
  tag: string;
  title: string;
  chosen?: boolean;
  sketch: ReactNode;
  children: ReactNode;
}) => (
  <div
    style={abs(x, 262, {
      width: 520,
      height: 556,
      boxSizing: 'border-box',
      border: `${chosen ? 2 : 1.2}px solid ${chosen ? CY : FAINT}`,
      background: chosen ? 'rgba(143,216,255,0.06)' : 'rgba(12,51,96,0.5)',
      padding: '24px 28px',
    })}
  >
    <div style={{ ...LABEL, color: chosen ? CY : MUTE }}>{tag}</div>
    <div
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontWeight: 600,
        fontSize: 40,
        textTransform: 'uppercase',
        marginTop: 6,
        lineHeight: 1.1,
      }}
    >
      {title}
    </div>
    <svg
      width={464}
      height={180}
      viewBox="0 0 464 180"
      className="ab-ink"
      style={{ marginTop: 12 }}
    >
      <path
        d="M0,130 L46,130 L58,152 L218,152 L232,130 L340,130 L346,146 L408,146 L414,130 L464,130"
        fill="none"
        stroke={MUTE}
        strokeWidth={1.4}
      />
      <line
        x1={70}
        y1={146}
        x2={208}
        y2={146}
        stroke={CY}
        strokeOpacity={0.6}
        strokeWidth={1}
        strokeDasharray="10 6"
      />
      <line
        x1={352}
        y1={143}
        x2={402}
        y2={143}
        stroke={MUTE}
        strokeWidth={2}
        strokeDasharray="3 3"
      />
      {sketch}
    </svg>
    <div style={{ marginTop: 14 }}>{children}</div>
  </div>
);

const trussPath = () => {
  let p = '';
  for (let i = 0; i < 16; i++) {
    const x0 = 32 + i * 25;
    p += `M${x0},112 L${x0 + 12.5},84 L${x0 + 25},112 `;
  }
  return p;
};

const archPath = () => {
  let p = '';
  for (let i = 1; i < 16; i++) {
    const x = 32 + i * 25;
    const t = (x - 232) / 200;
    const y = 108 - 88 * (1 - t * t);
    p += `M${x},108 L${x},${y.toFixed(1)} `;
  }
  return p;
};

const fanPath = () => {
  const top = 22;
  let p = '';
  const main = [70, 108, 146, 184, 222, 260];
  const back = [336, 370, 432];
  for (const x of main) p += `M${x},106 L318,${top + (x - 70) * 0.06} `;
  for (const x of back) p += `M${x},104 L326,${top + (432 - x) * 0.08} `;
  return p;
};

const TrussSketch = () => (
  <g>
    <rect x={32} y={84} width={400} height={28} fill="none" stroke={INK} strokeWidth={1.8} />
    <path d={trussPath()} fill="none" stroke={INK} strokeWidth={1.1} />
    <line x1={150} y1={112} x2={150} y2={150} stroke={AMBER} strokeWidth={4} />
    <line x1={320} y1={112} x2={320} y2={130} stroke={INK} strokeWidth={4} />
  </g>
);

const ArchSketch = () => (
  <g>
    <path d="M32,108 Q232,-68 432,108" fill="none" stroke={INK} strokeWidth={2} />
    <path d={archPath()} fill="none" stroke={INK} strokeWidth={1} />
    <line x1={32} y1={108} x2={432} y2={108} stroke={INK} strokeWidth={2.4} />
  </g>
);

const StaySketch = () => (
  <g>
    <line x1={32} y1={108} x2={432} y2={102} stroke={INK} strokeWidth={2.4} />
    <path d={fanPath()} fill="none" stroke={CY} strokeWidth={1.1} />
    <polygon points="314,130 330,130 326,14 318,14" fill={BG} stroke={INK} strokeWidth={1.8} />
  </g>
);

const ConceptPage: Page = () => (
  <Sheet title="結構方案" label="結構概念 · 方案比較" heading="為何選斜張橋">
    <Steps>
      <Step>
        <OptionCard x={120} tag="方案 A" title="下承式桁架" sketch={<TrussSketch />}>
          <Metric k="成本 P50" v="£8.1 M" good />
          <Metric k="鐵路封軌" v="2 × 54 h" />
          <Metric k="河道內橋墩" v="1" />
          <Metric k="桁架高度" v="4.1 m" />
        </OptionCard>
      </Step>
      <Step>
        <OptionCard x={700} tag="方案 B" title="繫桿拱，64 m" sketch={<ArchSketch />}>
          <Metric k="成本 P50" v="£10.4 M" />
          <Metric k="鐵路封軌" v="1 × 72 h" />
          <Metric k="河道內橋墩" v="0" good />
          <Metric k="吊裝起重機" v="1,200 t" />
        </OptionCard>
      </Step>
      <Step>
        <OptionCard x={1280} tag="方案 C · 首選" title="斜張橋" chosen sketch={<StaySketch />}>
          <Metric k="成本 P50" v="£8.9 M" />
          <Metric k="鐵路封軌" v="1 × 54 h" good />
          <Metric k="河道內橋墩" v="0" good />
          <Metric k="橋面厚度" v="0.75 m" good />
        </OptionCard>
      </Step>
      <Step>
        <Svg>
          <path
            d="M1296,358 C1278,328 1420,320 1566,326 C1642,330 1626,384 1488,388 C1376,392 1280,384 1294,342"
            fill="none"
            stroke={AMBER}
            strokeWidth={2}
          />
          <text x={1300} y={206} style={tx(28, AMBER, HAND)}>
            唯一不需河中橋墩的方案
          </text>
          <text x={1300} y={240} style={tx(28, AMBER, HAND)}>
            且只需一次封軌
          </text>
          <line x1={1690} y1={238} x2={1640} y2={300} stroke={AMBER} strokeWidth={1.4} />
          <Head x={1634} y={307} ang={2.25} c={AMBER} />
          <text x={130} y={866} style={tx(26, AMBER, HAND)}>
            A：環境署反對在河道內設橋墩
          </text>
        </Svg>
      </Step>
    </Steps>
  </Sheet>
);

const KeyFig = ({ top, k, v }: { top: number; k: string; v: string }) => (
  <div style={abs(120, top, { width: 400 })}>
    <div style={SMALL}>{k}</div>
    <div
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontWeight: 500,
        fontSize: 34,
        lineHeight: 1.2,
        marginTop: 2,
      }}
    >
      {v}
    </div>
  </div>
);

const ElevationPage: Page = () => {
  const g = geo(13, 658, 238);
  const { X, Y } = g;
  return (
    <Sheet title="總體配置圖" scale="1:400" label="總體配置 · 向北立面" heading="立面圖">
      <div className="ab-in" style={d(0.6)}>
        <KeyFig top={300} k="跨徑" v="46.0 m + 18.0 m" />
        <KeyFig top={390} k="橋塔" v="高出橋面 30.0 m" />
        <KeyFig top={480} k="斜拉索" v="9 對，全封閉式鋼纜" />
        <KeyFig top={570} k="橋面" v="鋼造，厚 750 mm" />
        <KeyFig top={660} k="坡度" v="1:25，向東上升" />
      </div>
      <Svg>
        <g style={d(0)}>
          <GridBubble x={X(0)} y={262} n="A1" to={Y(13.6)} />
          <GridBubble x={X(64)} y={262} n="A2" to={Y(15.8)} />
        </g>
        <g style={d(0.15)}>
          <Elevation g={g} zBot={9} />
        </g>
        <g style={d(1.0)}>
          <Level x1={X(46) + 10} x2={X(46) + 200} y={Y(PY_TOP)} text="+49.540 橋塔" right />
          <Level x1={X(-8)} x2={X(0)} y={Y(17.7)} text="+17.700" />
          <Level x1={X(64)} x2={X(72)} y={Y(20.26)} text="+20.260" right />
          <text x={X(10)} y={Y(15.85) + 22} style={{ ...tx(18, CY), ...HALO }}>
            1% AEP+CC +15.850
          </text>
          <text x={X(12)} y={Y(12.4) + 22} style={{ ...tx(18, CY), ...HALO }}>
            NWL +12.400 · KELL 河
          </text>
          <Leader
            pts={[X(34.6), Y(31.5), X(30), Y(36), X(26), Y(36)]}
            text="6 根主斜拉索 · Ø40"
            end
          />
          <Leader pts={[X(56), Y(33.4), X(60), Y(38), X(63), Y(38)]} text="3 根背拉索 · Ø60" />
          <Leader pts={[X(46.4), Y(28), X(52), Y(28), X(54), Y(28)]} text="P1 · A 型 S460" />
          <Leader
            pts={[X(55.5), Y(16.8), X(62), Y(14.5), X(64), Y(14.5)]}
            text="CARROW 鐵路線"
            sub="雙軌 · OLE"
          />
          <SectionCut x={X(28)} y1={Y(deckZ(28)) - 44} y2={Y(deckZ(28)) + 36} n="A" />
          <DimV
            x={X(50.4)}
            y1={Y(deckZ(50.4) - 0.75)}
            y2={Y(12.9)}
            text="6 066"
            c={AMBER}
            fs={18}
            right
          />
        </g>
        <g style={d(1.4)}>
          <DimH x1={X(0)} x2={X(46)} y={806} text="46 000" from1={Y(13.6)} from2={Y(9)} tick />
          <DimH x1={X(46)} x2={X(64)} y={806} text="18 000" from2={Y(15.8)} tick />
          <DimH x1={X(0)} x2={X(64)} y={838} text="總長 64 000" tick />
        </g>
      </Svg>
    </Sheet>
  );
};

const Trough = ({
  xc,
  X,
  Y,
}: {
  xc: number;
  X: (m: number) => number;
  Y: (m: number) => number;
}) => {
  const top = -0.025 * Math.abs(xc) - 0.014;
  return (
    <polyline
      points={`${X(xc - 0.15)},${Y(top)} ${X(xc - 0.06)},${Y(top - 0.28)} ${X(xc + 0.06)},${Y(top - 0.28)} ${X(xc + 0.15)},${Y(top)}`}
      fill="none"
      stroke={INK}
      strokeWidth={2.4}
    />
  );
};

const EdgeBox = ({
  side,
  X,
  Y,
}: {
  side: -1 | 1;
  X: (m: number) => number;
  Y: (m: number) => number;
}) => {
  const o = side * 2.7;
  const i = side * 2.1;
  const zt = -0.0525;
  const outer = `M${X(o)},${Y(zt)} L${X(i)},${Y(zt)} L${X(i)},${Y(-0.75)} L${X(o)},${Y(-0.75)} Z`;
  const inner = `M${X(o - side * 0.022)},${Y(zt - 0.014)} L${X(i + side * 0.022)},${Y(zt - 0.014)} L${X(i + side * 0.022)},${Y(-0.72)} L${X(o - side * 0.022)},${Y(-0.72)} Z`;
  return (
    <g>
      <path
        d={`${outer} ${inner}`}
        fillRule="evenodd"
        fill={CY}
        fillOpacity={0.55}
        stroke={INK}
        strokeWidth={1.6}
      />
      <line
        x1={X(side * 2.4)}
        y1={Y(-0.72)}
        x2={X(side * 2.4)}
        y2={Y(-0.6)}
        stroke={INK}
        strokeWidth={2.4}
      />
      <line
        x1={X(i + side * 0.022)}
        y1={Y(-0.38)}
        x2={X(o - side * 0.022)}
        y2={Y(-0.38)}
        stroke={FAINT}
        strokeWidth={1}
        strokeDasharray="6 4"
      />
      <polygon
        points={`${X(o)},${Y(-0.12)} ${X(o + side * 0.26)},${Y(-0.02)} ${X(o + side * 0.26)},${Y(0.22)} ${X(o)},${Y(0.12)}`}
        fill={BG}
        stroke={INK}
        strokeWidth={1.6}
      />
      <circle
        cx={X(o + side * 0.17)}
        cy={Y(0.08)}
        r={7}
        fill="none"
        stroke={CY}
        strokeWidth={1.8}
      />
      <line
        x1={X(o + side * 0.17)}
        y1={Y(0.08)}
        x2={X(o - side * 0.14)}
        y2={Y(2.15)}
        stroke={CY}
        strokeWidth={3}
      />
      <path
        d={`M${X(o - side * 0.08) - 12},${Y(1.75)} l8,-6 l8,12 l8,-6`}
        fill="none"
        stroke={CY}
        strokeWidth={1.4}
      />
    </g>
  );
};

const Parapet = ({
  side,
  X,
  Y,
}: {
  side: -1 | 1;
  X: (m: number) => number;
  Y: (m: number) => number;
}) => {
  const post = side * 2.36;
  return (
    <g>
      <polygon
        points={`${X(post - 0.04)},${Y(-0.0525)} ${X(post + 0.04)},${Y(-0.0525)} ${X(post + 0.025)},${Y(1.4)} ${X(post - 0.025)},${Y(1.4)}`}
        fill={BG}
        stroke={INK}
        strokeWidth={1.4}
      />
      <rect
        x={Math.min(X(post - side * 0.05), X(post - side * 0.08))}
        y={Y(1.3)}
        width={Math.abs(X(0.03) - X(0))}
        height={Y(0.1) - Y(1.3)}
        fill="none"
        stroke={MUTE}
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <line
        x1={X(post)}
        y1={Y(1.37)}
        x2={X(side * 2.03)}
        y2={Y(1.37)}
        stroke={INK}
        strokeWidth={2}
      />
      <circle cx={X(side * 2.03)} cy={Y(1.37)} r={6} fill={BG} stroke={INK} strokeWidth={1.8} />
      <line
        x1={X(post)}
        y1={Y(0.9)}
        x2={X(side * 2.03)}
        y2={Y(0.9)}
        stroke={INK}
        strokeWidth={1.6}
      />
      <circle cx={X(side * 2.03)} cy={Y(0.9)} r={5} fill={BG} stroke={INK} strokeWidth={1.6} />
      <rect x={X(side * 2.03) - 4} y={Y(1.37) + 7} width={8} height={5} fill={AMBER} />
    </g>
  );
};

const KeyNote = ({ top, n, text }: { top: number; n: string; text: string }) => (
  <div style={abs(1400, top, { display: 'flex', alignItems: 'center', gap: 16, width: 420 })}>
    <span
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        border: `1.6px solid ${CY}`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: MONO,
        fontSize: 18,
        color: CY,
        flex: 'none',
      }}
    >
      {n}
    </span>
    <span style={{ fontSize: 28, lineHeight: 1.2 }}>{text}</span>
  </div>
);

const SectionPage: Page = () => {
  const cx = 770;
  const dy = 640;
  const k = 180;
  const X = (m: number) => cx + m * k;
  const Y = (m: number) => dy - m * k;
  const deckTop = `M${X(-2.1)},${Y(-0.0525)} L${X(0)},${Y(0)} L${X(2.1)},${Y(-0.0525)}`;
  const deckBot = `L${X(2.1)},${Y(-0.0665)} L${X(0)},${Y(-0.014)} L${X(-2.1)},${Y(-0.0665)} Z`;
  return (
    <Sheet title="橋面斷面 A–A" scale="1:25" label="斷面 A–A · 標準橋面" heading="橋面橫斷面">
      <Svg>
        <g style={d(0.1)}>
          <path
            d={`${deckTop} ${deckBot}`}
            fill={CY}
            fillOpacity={0.55}
            stroke={INK}
            strokeWidth={1.6}
          />
          <path
            d={`M${X(-2.1)},${Y(-0.0525) - 5} L${X(0)},${Y(0) - 5} L${X(2.1)},${Y(-0.0525) - 5}`}
            fill="none"
            stroke={AMBER}
            strokeWidth={1.2}
            strokeDasharray="2 3"
          />
          <Trough xc={-1.8} X={X} Y={Y} />
          <Trough xc={-1.2} X={X} Y={Y} />
          <Trough xc={-0.6} X={X} Y={Y} />
          <Trough xc={0} X={X} Y={Y} />
          <Trough xc={0.6} X={X} Y={Y} />
          <Trough xc={1.2} X={X} Y={Y} />
          <Trough xc={1.8} X={X} Y={Y} />
          <path
            d={`M${X(-2.1)},${Y(-0.08)} L${X(-1.9)},${Y(-0.55)} L${X(1.9)},${Y(-0.55)} L${X(2.1)},${Y(-0.08)}`}
            fill="none"
            stroke={MUTE}
            strokeWidth={1.2}
            strokeDasharray="10 6"
          />
        </g>
        <g style={d(0.4)}>
          <EdgeBox side={-1} X={X} Y={Y} />
          <EdgeBox side={1} X={X} Y={Y} />
        </g>
        <g style={d(0.7)}>
          <Parapet side={-1} X={X} Y={Y} />
          <Parapet side={1} X={X} Y={Y} />
          <polyline
            points={`${X(2.36)},${Y(1.4)} ${X(2.36)},${Y(1.8)} ${X(2.33)},${Y(1.8)}`}
            fill="none"
            stroke={MUTE}
            strokeWidth={1.4}
            strokeDasharray="6 4"
          />
          <line
            x1={X(0)}
            y1={Y(1.95)}
            x2={X(0)}
            y2={Y(-0.95)}
            stroke={MUTE}
            strokeWidth={1}
            strokeDasharray="30 6 6 6"
          />
          <text x={X(0)} y={Y(1.95) - 10} textAnchor="middle" style={tx(20, MUTE)}>
            ℄ 橋面
          </text>
        </g>
        <g style={d(1.1)}>
          <DimH x1={X(-2.0)} x2={X(2.0)} y={Y(0.62)} text="淨寬 4 000" />
          <DimH
            x1={X(-2.7)}
            x2={X(2.7)}
            y={Y(-0.75) + 52}
            text="總寬 5 400"
            from1={Y(-0.75)}
            from2={Y(-0.75)}
          />
          <DimV
            x={X(-2.7) - 70}
            y1={Y(-0.0525)}
            y2={Y(-0.75)}
            text="750"
            from1={X(-2.7)}
            from2={X(-2.7)}
          />
          <DimV
            x={X(2.36) + 150}
            y1={Y(-0.0525)}
            y2={Y(1.4)}
            text="1 400"
            from1={X(2.36)}
            from2={X(2.36)}
            right
          />
          <text x={X(-1.05)} y={Y(0.15)} textAnchor="middle" style={{ ...tx(18, CY), ...HALO }}>
            ← 2.5%
          </text>
          <text x={X(1.05)} y={Y(0.15)} textAnchor="middle" style={{ ...tx(18, CY), ...HALO }}>
            2.5% →
          </text>
          <text x={X(0)} y={Y(-0.55) + 26} textAnchor="middle" style={{ ...tx(18, MUTE), ...HALO }}>
            橫梁 @ 3.0 m（後方）
          </text>
          <text
            x={X(2.3) - 14}
            y={Y(1.8) + 6}
            textAnchor="end"
            style={{ ...tx(18, MUTE), ...HALO }}
          >
            跨鐵路段 1.8 m
          </text>
          <Tag x={X(-1.5)} y={Y(-0.42)} n="1" />
          <Tag x={X(-2.4)} y={Y(-0.95)} n="2" />
          <line
            x1={X(-2.4)}
            y1={Y(-0.95) - 16}
            x2={X(-2.4)}
            y2={Y(-0.75)}
            stroke={CY}
            strokeWidth={1.2}
          />
          <Tag x={X(-3.15)} y={Y(0.32)} n="3" />
          <Tag x={X(-1.72)} y={Y(1.05)} n="4" />
          <line
            x1={X(-1.72) - 16}
            y1={Y(1.05)}
            x2={X(-2.3)}
            y2={Y(1.05)}
            stroke={CY}
            strokeWidth={1.2}
          />
          <Tag x={X(-1.72)} y={Y(1.62)} n="5" />
          <line
            x1={X(-1.72) - 12}
            y1={Y(1.62) + 11}
            x2={X(-2.0)}
            y2={Y(1.3)}
            stroke={CY}
            strokeWidth={1.2}
          />
          <Tag x={X(0.5)} y={Y(0.32)} n="6" />
          <line
            x1={X(0.5)}
            y1={Y(0.32) + 16}
            x2={X(0.5)}
            y2={Y(-0.0125) - 6}
            stroke={CY}
            strokeWidth={1.2}
          />
        </g>
      </Svg>
      <div className="ab-in" style={d(0.8)}>
        <div style={abs(1400, 262, SMALL)}>圖例</div>
        <KeyNote top={300} n="1" text="14 mm 橋面鋼板與 U 形肋" />
        <KeyNote top={360} n="2" text="邊箱梁 600 × 750，S355" />
        <KeyNote top={420} n="3" text="鉸接式斜拉索錨座" />
        <KeyNote top={480} n="4" text="1.4 m 欄杆，316L 網" />
        <KeyNote top={540} n="5" text="LED 扶手照明" />
        <KeyNote top={600} n="6" text="8 mm 環氧鋁礬土面層" />
      </div>
      <div className="ab-in" style={{ ...abs(1400, 680, { width: 420 }), ...d(1.1) }}>
        <div style={{ fontFamily: HAND, fontSize: 28, color: AMBER, lineHeight: 1.35 }}>
          淨寬 4.0 m＝兩輛自行車可與嬰兒推車錯身
        </div>
      </div>
    </Sheet>
  );
};

const HeadStay = ({
  cx,
  Y,
  zp,
  side,
  dch,
  dz,
}: {
  cx: number;
  Y: (z: number) => number;
  zp: number;
  side: -1 | 1;
  dch: number;
  dz: number;
}) => {
  const len = Math.hypot(dch, dz);
  const ux = (dch / len) * 40;
  const uy = (-dz / len) * 40;
  const x0 = cx + side * 0.55 * 40;
  const y0 = Y(zp);
  const ang = (Math.atan2(uy, ux) * 180) / Math.PI;
  return (
    <g>
      <line x1={x0} y1={y0} x2={x0 + ux * 2.7} y2={y0 + uy * 2.7} stroke={CY} strokeWidth={2.2} />
      <rect
        x={x0 - 2}
        y={y0 - 4}
        width={22}
        height={8}
        transform={`rotate(${ang.toFixed(2)} ${x0} ${y0})`}
        fill={BG}
        stroke={INK}
        strokeWidth={1.4}
      />
      <line
        x1={cx - 22}
        y1={y0}
        x2={cx + 22}
        y2={y0}
        stroke={FAINT}
        strokeWidth={1}
        strokeDasharray="4 3"
      />
    </g>
  );
};

const PylonFig = ({ left, k, v }: { left: number; k: string; v: string }) => (
  <div style={abs(left, 712, { width: 240 })}>
    <div style={SMALL}>{k}</div>
    <div
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontWeight: 500,
        fontSize: 34,
        lineHeight: 1.2,
        marginTop: 4,
      }}
    >
      {v}
    </div>
  </div>
);

const PylonPage: Page = () => {
  const uid = uidOf(useId());
  const cx = 470;
  const s = 12;
  const X = (t: number) => cx + t * s;
  const Y = (z: number) => 262 + (50.5 - z) * s;
  const leg = (sd: -1 | 1) =>
    `${X(sd * 5.05)},${Y(15.4)} ${X(sd * 3.95)},${Y(15.4)} ${X(sd * 0.1)},${Y(41)} ${X(sd * 0.9)},${Y(41)}`;
  const hx = 790;
  const HY = (z: number) => 300 + (49.8 - z) * 40;
  const bx = 1090;
  const by = 330;
  return (
    <Sheet title="橋塔 P1" scale="如圖示" label="橋塔 P1 · 橫向立面與詳圖" heading="A 型橋塔">
      <Svg>
        <defs>
          <pattern
            id={`${uid}e`}
            width={9}
            height={9}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1={0} y1={0} x2={0} y2={9} stroke={GHOST} strokeWidth={1.2} />
          </pattern>
        </defs>
        <g style={d(0.1)}>
          <rect
            x={X(-9)}
            y={Y(16)}
            width={18 * s}
            height={Y(6) - Y(16)}
            fill={`url(#${uid}e)`}
            stroke="none"
          />
          <line x1={X(-9)} y1={Y(16)} x2={X(9)} y2={Y(16)} stroke={INK} strokeWidth={1.6} />
          <rect
            x={X(-5.6)}
            y={Y(15.4)}
            width={11.2 * s}
            height={2 * s}
            fill={BG}
            stroke={INK}
            strokeWidth={1.6}
          />
          <Pile g={{ s, X, Y }} ch={-4.5} top={13.4} bot={6.2} w={0.9} c={INK} />
          <Pile g={{ s, X, Y }} ch={-1.5} top={13.4} bot={6.2} w={0.9} c={INK} />
          <Pile g={{ s, X, Y }} ch={1.5} top={13.4} bot={6.2} w={0.9} c={INK} />
          <Pile g={{ s, X, Y }} ch={4.5} top={13.4} bot={6.2} w={0.9} c={INK} />
        </g>
        <g style={d(0.3)}>
          <rect
            x={X(-3.6)}
            y={Y(18.79)}
            width={7.2 * s}
            height={0.9 * s}
            fill={BG}
            stroke={INK}
            strokeWidth={1.6}
          />
          <rect
            x={X(-2.7)}
            y={Y(19.54)}
            width={5.4 * s}
            height={0.75 * s}
            fill={CY}
            fillOpacity={0.45}
            stroke={INK}
            strokeWidth={1.4}
          />
          <line
            x1={X(-2.36)}
            y1={Y(19.54)}
            x2={X(-2.36)}
            y2={Y(20.94)}
            stroke={FAINT}
            strokeWidth={1.2}
          />
          <line
            x1={X(2.36)}
            y1={Y(19.54)}
            x2={X(2.36)}
            y2={Y(20.94)}
            stroke={FAINT}
            strokeWidth={1.2}
          />
          <polygon points={leg(-1)} fill={BG} stroke={INK} strokeWidth={2} />
          <polygon points={leg(1)} fill={BG} stroke={INK} strokeWidth={2} />
          <polygon
            points={`${X(-1)},${Y(41)} ${X(1)},${Y(41)} ${X(1)},${Y(49)} ${X(0.6)},${Y(49.54)} ${X(-0.6)},${Y(49.54)} ${X(-1)},${Y(49)}`}
            fill={BG}
            stroke={INK}
            strokeWidth={2}
          />
          <line x1={X(-1)} y1={Y(48.4)} x2={X(-2.85)} y2={Y(19.6)} stroke={CY} strokeWidth={1.2} />
          <line x1={X(-1)} y1={Y(45.4)} x2={X(-2.85)} y2={Y(19.6)} stroke={CY} strokeWidth={1.2} />
          <line x1={X(-1)} y1={Y(42.4)} x2={X(-2.85)} y2={Y(19.6)} stroke={CY} strokeWidth={1.2} />
          <line x1={X(1)} y1={Y(48.4)} x2={X(2.85)} y2={Y(19.6)} stroke={CY} strokeWidth={1.2} />
          <line x1={X(1)} y1={Y(45.4)} x2={X(2.85)} y2={Y(19.6)} stroke={CY} strokeWidth={1.2} />
          <line x1={X(1)} y1={Y(42.4)} x2={X(2.85)} y2={Y(19.6)} stroke={CY} strokeWidth={1.2} />
        </g>
        <g style={d(0.9)}>
          <Level x1={140} x2={X(-1.2)} y={Y(PY_TOP)} text="+49.540 塔頂" />
          <Level x1={140} x2={X(-1.2)} y={Y(41)} text="+41.000 錨固區" />
          <Level x1={140} x2={X(-3.6)} y={Y(19.54)} text="+19.540 橋面" />
          <Level x1={140} x2={X(-5.6)} y={Y(15.4)} text="+15.400 承台" />
          <SectionCutH y={Y(25)} x1={X(-5.4)} x2={X(-1.2)} n="B" />
          <circle
            cx={X(0)}
            cy={Y(45.4)}
            r={70}
            fill="none"
            stroke={AMBER}
            strokeWidth={1.4}
            strokeDasharray="8 5"
          />
          <line
            x1={X(0) + 64}
            y1={Y(45.4) - 30}
            x2={hx - 90}
            y2={330}
            stroke={AMBER}
            strokeWidth={1.2}
          />
          <Tag x={hx - 106} y={326} n="1" c={AMBER} />
          <Leader
            pts={[X(3.2), Y(9), X(7), Y(4.5), X(9), Y(4.5)]}
            text="8 × Ø900 CFA 基樁"
            sub="樁底 −8.0 m AOD"
          />
        </g>
        <g style={d(0.5)}>
          <rect
            x={hx - 22}
            y={HY(49.0)}
            width={44}
            height={HY(41) - HY(49.0)}
            fill="none"
            stroke={INK}
            strokeWidth={2}
          />
          <polyline
            points={`${hx - 22},${HY(49)} ${hx - 14},${HY(49.54)} ${hx + 14},${HY(49.54)} ${hx + 22},${HY(49)}`}
            fill="none"
            stroke={INK}
            strokeWidth={2}
          />
          <line x1={hx - 32} y1={HY(41)} x2={hx - 32} y2={HY(39.6)} stroke={INK} strokeWidth={2} />
          <line x1={hx + 32} y1={HY(41)} x2={hx + 32} y2={HY(39.6)} stroke={INK} strokeWidth={2} />
          <HeadStay cx={hx} Y={HY} zp={48.4} side={-1} dch={-35.7} dz={-30.3} />
          <HeadStay cx={hx} Y={HY} zp={47.2} side={-1} dch={-29.7} dz={-28.8} />
          <HeadStay cx={hx} Y={HY} zp={46.0} side={-1} dch={-23.7} dz={-27.4} />
          <HeadStay cx={hx} Y={HY} zp={44.8} side={-1} dch={-17.7} dz={-25.9} />
          <HeadStay cx={hx} Y={HY} zp={43.6} side={-1} dch={-11.7} dz={-24.5} />
          <HeadStay cx={hx} Y={HY} zp={42.4} side={-1} dch={-5.7} dz={-23.0} />
          <HeadStay cx={hx} Y={HY} zp={42.4} side={1} dch={5.7} dz={-22.6} />
          <HeadStay cx={hx} Y={HY} zp={45.4} side={1} dch={11.7} dz={-25.4} />
          <HeadStay cx={hx} Y={HY} zp={48.4} side={1} dch={17.7} dz={-28.4} />
        </g>
        <g style={d(1.2)}>
          <DimV
            x={hx + 160}
            y1={HY(48.4)}
            y2={HY(42.4)}
            text="5 @ 1 200"
            from1={hx + 30}
            from2={hx + 30}
            right
          />
          <text x={hx - 60} y={752} style={tx(20, INK)}>
            詳圖 1 · 塔頭 · 1:50
          </text>
          <line x1={hx - 60} y1={760} x2={hx + 200} y2={760} stroke={INK} strokeWidth={1.2} />
        </g>
        <g style={d(0.7)}>
          <path
            d={`M${bx},${by} h300 v225 h-300 Z M${bx + 10},${by + 10} h280 v205 h-280 Z`}
            fillRule="evenodd"
            fill={CY}
            fillOpacity={0.55}
            stroke={INK}
            strokeWidth={1.6}
          />
          <rect x={bx + 90} y={by + 10} width={6} height={50} fill={INK} />
          <rect x={bx + 204} y={by + 10} width={6} height={50} fill={INK} />
          <rect x={bx + 90} y={by + 165} width={6} height={50} fill={INK} />
          <rect x={bx + 204} y={by + 165} width={6} height={50} fill={INK} />
          <rect x={bx + 10} y={by + 109} width={50} height={6} fill={INK} />
          <rect x={bx + 240} y={by + 109} width={50} height={6} fill={INK} />
          <line
            x1={bx + 150}
            y1={by - 16}
            x2={bx + 150}
            y2={by + 241}
            stroke={MUTE}
            strokeWidth={1}
            strokeDasharray="20 5 4 5"
          />
          <line
            x1={bx - 16}
            y1={by + 112}
            x2={bx + 316}
            y2={by + 112}
            stroke={MUTE}
            strokeWidth={1}
            strokeDasharray="20 5 4 5"
          />
          <DimH x1={bx} x2={bx + 300} y={by + 270} text="1 200" from1={by + 225} from2={by + 225} />
          <Leader
            pts={[bx + 296, by + 40, bx + 360, by + 40, bx + 372, by + 40]}
            text="40 厚鋼板 S460ML"
          />
          <Leader
            pts={[bx + 209, by + 50, bx + 260, by + 92, bx + 372, by + 92]}
            text="扁鋼 200 × 25"
          />
          <Leader
            pts={[bx + 300, by + 225, bx + 360, by + 190, bx + 372, by + 190]}
            text="深 900"
          />
          <text x={bx} y={by + 340} style={tx(20, INK)}>
            斷面 B–B · 塔柱 · 1:20
          </text>
          <line x1={bx} y1={by + 348} x2={bx + 290} y2={by + 348} stroke={INK} strokeWidth={1.2} />
        </g>
      </Svg>
      <div className="ab-in" style={d(1.2)}>
        <PylonFig left={1090} k="高度" v="承台以上 34.1 m" />
        <PylonFig left={1370} k="鋼材" v="S460ML · 96 t" />
        <PylonFig left={1610} k="吊裝" v="2 次吊裝" />
      </div>
    </Sheet>
  );
};

const UdlIcon = ({ n, big }: { n: number; big?: boolean }) => {
  let p = '';
  const step = 96 / (n - 1);
  for (let i = 0; i < n; i++) {
    const x = 12 + i * step;
    p += `M${x},${big ? 6 : 16} L${x},36 `;
  }
  return (
    <g>
      <line x1={8} y1={big ? 6 : 16} x2={112} y2={big ? 6 : 16} stroke={CY} strokeWidth={1.2} />
      <path d={p} fill="none" stroke={CY} strokeWidth={1.2} />
    </g>
  );
};

const Beam = () => (
  <g>
    <line x1={6} y1={42} x2={114} y2={42} stroke={INK} strokeWidth={2.6} />
    <polygon points="12,44 4,56 20,56" fill="none" stroke={INK} strokeWidth={1.2} />
    <polygon points="108,44 100,56 116,56" fill="none" stroke={INK} strokeWidth={1.2} />
  </g>
);

const LoadIcon = ({ kind }: { kind: 'g' | 'q' | 'v' | 'w' | 't' | 'x' }) => (
  <svg width={120} height={60} viewBox="0 0 120 60" className="ab-ink" style={{ flex: 'none' }}>
    <Beam />
    {kind === 'g' && <UdlIcon n={5} />}
    {kind === 'q' && <UdlIcon n={11} big />}
    {kind === 'v' && (
      <g>
        <line x1={44} y1={6} x2={44} y2={36} stroke={CY} strokeWidth={2.2} />
        <line x1={76} y1={6} x2={76} y2={36} stroke={CY} strokeWidth={2.2} />
        <Head x={44} y={40} ang={Math.PI / 2} l={9} w={4} />
        <Head x={76} y={40} ang={Math.PI / 2} l={9} w={4} />
      </g>
    )}
    {kind === 'w' && (
      <g>
        <path
          d="M6,18 C26,10 40,26 60,18 M6,30 C26,22 40,38 60,30"
          fill="none"
          stroke={CY}
          strokeWidth={1.4}
        />
        <line x1={60} y1={24} x2={90} y2={24} stroke={CY} strokeWidth={1.6} />
        <Head x={98} y={24} ang={0} l={10} w={4} />
      </g>
    )}
    {kind === 't' && (
      <g>
        <line x1={20} y1={22} x2={100} y2={22} stroke={CY} strokeWidth={1.4} />
        <Head x={14} y={22} ang={Math.PI} l={10} w={4} />
        <Head x={106} y={22} ang={0} l={10} w={4} />
        <circle cx={60} cy={10} r={4} fill="none" stroke={AMBER} strokeWidth={1.4} />
      </g>
    )}
    {kind === 'x' && (
      <g>
        <line x1={20} y1={42} x2={60} y2={4} stroke={FAINT} strokeWidth={1.2} />
        <line x1={46} y1={42} x2={60} y2={4} stroke={CY} strokeWidth={1.4} />
        <line x1={84} y1={42} x2={60} y2={4} stroke={CY} strokeWidth={1.4} />
        <line x1={26} y1={16} x2={44} y2={32} stroke={AMBER} strokeWidth={2.2} />
        <line x1={44} y1={16} x2={26} y2={32} stroke={AMBER} strokeWidth={2.2} />
      </g>
    )}
  </svg>
);

const LoadRow = ({
  top,
  code,
  title,
  basis,
  value,
  kind,
}: {
  top: number;
  code: string;
  title: string;
  basis: string;
  value: string;
  kind: 'g' | 'q' | 'v' | 'w' | 't' | 'x';
}) => (
  <div
    style={abs(120, top, {
      width: 1020,
      height: 82,
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      borderBottom: `1px solid ${GHOST}`,
      boxSizing: 'border-box',
    })}
  >
    <LoadIcon kind={kind} />
    <div style={{ width: 260 }}>
      <div style={{ ...SMALL, color: CY }}>{code}</div>
      <div style={{ fontSize: 30, fontWeight: 500, lineHeight: 1.15 }}>{title}</div>
    </div>
    <div
      style={{ ...SMALL, width: 300, textTransform: 'none', letterSpacing: '0.04em', fontSize: 20 }}
    >
      {basis}
    </div>
    <div style={{ fontFamily: MONO, fontSize: 28, marginLeft: 'auto', color: INK }}>{value}</div>
  </div>
);

const UtilBar = ({
  top,
  label,
  sub,
  u,
  val,
}: {
  top: number;
  label: string;
  sub: string;
  u: number;
  val: string;
}) => (
  <div style={abs(1230, top, { width: 570 })}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ fontSize: 28, fontWeight: 500 }}>{label}</span>
      <span style={{ fontFamily: MONO, fontSize: 28, color: u > 0.75 ? AMBER : CY }}>{val}</span>
    </div>
    <div style={{ ...SMALL, marginTop: 2 }}>{sub}</div>
    <svg width={570} height={30} viewBox="0 0 570 30" className="ab-ink" style={{ marginTop: 8 }}>
      <rect x={0} y={6} width={540} height={18} fill="none" stroke={FAINT} strokeWidth={1} />
      <rect
        x={0}
        y={6}
        width={540 * u}
        height={18}
        fill={u > 0.75 ? AMBER : CY}
        fillOpacity={u > 0.75 ? 1 : 0.75}
        stroke="none"
      />
      <line x1={135} y1={2} x2={135} y2={28} stroke={GHOST} strokeWidth={1} />
      <line x1={270} y1={2} x2={270} y2={28} stroke={GHOST} strokeWidth={1} />
      <line x1={405} y1={2} x2={405} y2={28} stroke={GHOST} strokeWidth={1} />
      <line x1={540} y1={0} x2={540} y2={30} stroke={INK} strokeWidth={2} />
    </svg>
  </div>
);

const LoadsPage: Page = () => (
  <Sheet title="載重案例與檢核" label="設計基準 · EN 1990–1993 + 英國國家附錄" heading="載重案例">
    <div className="ab-in" style={d(0.2)}>
      <div style={abs(264, 266, SMALL)}>案例</div>
      <div style={abs(548, 266, SMALL)}>依據</div>
      <div style={abs(940, 266, { ...SMALL, width: 200, textAlign: 'right' })}>數值</div>
      <LoadRow top={300} code="LC1" title="永久載重" basis="自重與鋪面" value="34 kN/m" kind="g" />
      <LoadRow
        top={382}
        code="LC2"
        title="人群載重"
        basis="EN 1991-2 §5.3.2.1"
        value="5.0 kN/m²"
        kind="q"
      />
      <LoadRow
        top={464}
        code="LC3"
        title="維護車輛"
        basis="EN 1991-2 §5.6.3"
        value="12 t"
        kind="v"
      />
      <LoadRow
        top={546}
        code="LC4"
        title="風載重"
        basis="基本風速 22.5 m/s"
        value="1.05 kN/m²"
        kind="w"
      />
      <LoadRow
        top={628}
        code="LC5"
        title="溫度"
        basis="EN 1991-1-5"
        value="−17 / +38 °C"
        kind="t"
      />
      <LoadRow
        top={710}
        code="LC6"
        title="斷索"
        basis="任一根斜拉索 · DAF 2.0"
        value="1 根"
        kind="x"
      />
    </div>
    <div style={abs(1230, 266, LABEL)}>控制性檢核</div>
    <div className="ab-in" style={d(0.6)}>
      <UtilBar top={312} label="邊梁，彎矩" sub="ULS · LC1 + LC2" u={0.78} val="0.78" />
      <UtilBar top={438} label="塔柱，軸力與彎矩" sub="ULS · LC1 + LC2 + LC4" u={0.71} val="0.71" />
      <UtilBar top={564} label="斜拉索，斷索後" sub="ALS · LC6" u={0.62} val="0.62" />
      <UtilBar top={690} label="跨中撓度" sub="SLS · 74 mm vs L/400" u={0.64} val="L/622" />
    </div>
    <div className="ab-in" style={{ ...abs(120, 840), ...d(1.2) }}>
      <span style={{ fontFamily: HAND, fontSize: 30, color: AMBER }}>
        所有檢核均低於 0.80 — 為 90% 設計保留餘裕
      </span>
    </div>
  </Sheet>
);

const SteelSwatch = () => {
  const uid = uidOf(useId());
  return (
    <svg width={140} height={140} viewBox="0 0 140 140" className="ab-ink" style={{ flex: 'none' }}>
      <defs>
        <pattern
          id={uid}
          width={10}
          height={10}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1={0} y1={0} x2={0} y2={10} stroke={CY} strokeWidth={2} />
        </pattern>
      </defs>
      <path
        d="M10,10 H130 V34 H82 V106 H130 V130 H10 V106 H58 V34 H10 Z"
        fill={`url(#${uid})`}
        stroke={INK}
        strokeWidth={1.8}
      />
    </svg>
  );
};

const StrandSwatch = () => (
  <svg width={140} height={140} viewBox="0 0 140 140" className="ab-ink" style={{ flex: 'none' }}>
    <circle cx={70} cy={70} r={60} fill="none" stroke={INK} strokeWidth={2} />
    <circle cx={70} cy={70} r={50} fill="none" stroke={CY} strokeWidth={8} strokeDasharray="10 3" />
    <circle cx={70} cy={70} r={36} fill="none" stroke={CY} strokeWidth={8} strokeDasharray="8 3" />
    <circle
      cx={70}
      cy={70}
      r={22}
      fill="none"
      stroke={MUTE}
      strokeWidth={7}
      strokeDasharray="6 3"
    />
    <circle cx={70} cy={70} r={9} fill={MUTE} />
  </svg>
);

const ConcreteSwatch = () => {
  const uid = uidOf(useId());
  return (
    <svg width={140} height={140} viewBox="0 0 140 140" className="ab-ink" style={{ flex: 'none' }}>
      <defs>
        <pattern id={uid} width={34} height={34} patternUnits="userSpaceOnUse">
          <circle cx={6} cy={8} r={1.6} fill={CY} />
          <circle cx={22} cy={4} r={1.2} fill={CY} />
          <circle cx={28} cy={22} r={1.8} fill={CY} />
          <circle cx={12} cy={26} r={1.2} fill={CY} />
          <polygon points="14,12 20,14 15,18" fill="none" stroke={CY} strokeWidth={1.1} />
          <polygon points="2,20 7,18 6,24" fill="none" stroke={CY} strokeWidth={1.1} />
        </pattern>
      </defs>
      <rect
        x={10}
        y={10}
        width={120}
        height={120}
        fill={`url(#${uid})`}
        stroke={INK}
        strokeWidth={1.8}
      />
    </svg>
  );
};

const PaintSwatch = () => (
  <svg width={140} height={140} viewBox="0 0 140 140" className="ab-ink" style={{ flex: 'none' }}>
    <rect
      x={10}
      y={88}
      width={120}
      height={42}
      fill={MUTE}
      fillOpacity={0.35}
      stroke={INK}
      strokeWidth={1.6}
    />
    <rect
      x={10}
      y={70}
      width={120}
      height={18}
      fill={CY}
      fillOpacity={0.25}
      stroke={INK}
      strokeWidth={1.2}
    />
    <rect
      x={10}
      y={48}
      width={120}
      height={22}
      fill={CY}
      fillOpacity={0.45}
      stroke={INK}
      strokeWidth={1.2}
    />
    <rect
      x={10}
      y={30}
      width={120}
      height={18}
      fill={CY}
      fillOpacity={0.65}
      stroke={INK}
      strokeWidth={1.2}
    />
    <rect
      x={10}
      y={16}
      width={120}
      height={14}
      fill={INK}
      fillOpacity={0.85}
      stroke={INK}
      strokeWidth={1.2}
    />
  </svg>
);

const MeshSwatch = () => {
  const uid = uidOf(useId());
  return (
    <svg width={140} height={140} viewBox="0 0 140 140" className="ab-ink" style={{ flex: 'none' }}>
      <defs>
        <pattern
          id={uid}
          width={16}
          height={16}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect x={0} y={0} width={16} height={16} fill="none" stroke={CY} strokeWidth={1.4} />
        </pattern>
      </defs>
      <rect
        x={10}
        y={10}
        width={120}
        height={120}
        fill={`url(#${uid})`}
        stroke={INK}
        strokeWidth={1.8}
      />
      <line x1={10} y1={18} x2={130} y2={18} stroke={INK} strokeWidth={3} />
      <line x1={10} y1={122} x2={130} y2={122} stroke={INK} strokeWidth={3} />
    </svg>
  );
};

const GritSwatch = () => (
  <svg width={140} height={140} viewBox="0 0 140 140" className="ab-ink" style={{ flex: 'none' }}>
    <rect x={10} y={56} width={120} height={74} fill="none" stroke={INK} strokeWidth={1.8} />
    <path
      d="M10,56 L18,48 L24,54 L31,46 L39,53 L46,45 L54,52 L61,47 L69,54 L77,46 L85,52 L92,45 L100,53 L108,47 L115,54 L123,46 L130,56"
      fill={AMBER}
      fillOpacity={0.4}
      stroke={AMBER}
      strokeWidth={1.4}
    />
    <line x1={10} y1={58} x2={130} y2={58} stroke={CY} strokeWidth={3} />
    <text x={70} y={102} textAnchor="middle" style={tx(18, MUTE)}>
      橋面鋼板
    </text>
  </svg>
);

const MatCard = ({
  x,
  y,
  swatch,
  name,
  spec,
  qty,
  note,
}: {
  x: number;
  y: number;
  swatch: ReactNode;
  name: string;
  spec: string;
  qty: string;
  note: string;
}) => (
  <div
    style={abs(x, y, {
      width: 532,
      height: 262,
      boxSizing: 'border-box',
      borderTop: `1.2px solid ${FAINT}`,
      padding: '26px 0 0',
      display: 'flex',
      gap: 26,
    })}
  >
    {swatch}
    <div style={{ minWidth: 0 }}>
      <div
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontWeight: 600,
          fontSize: 32,
          textTransform: 'uppercase',
          lineHeight: 1.1,
        }}
      >
        {name}
      </div>
      <div
        style={{
          ...SMALL,
          marginTop: 10,
          lineHeight: 1.45,
          textTransform: 'none',
          fontSize: 20,
          letterSpacing: '0.04em',
        }}
      >
        {spec}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 28, color: CY, marginTop: 10 }}>{qty}</div>
      <div style={{ fontSize: 28, color: MUTE, marginTop: 10, lineHeight: 1.3 }}>{note}</div>
    </div>
  </div>
);

const MaterialsPage: Page = () => (
  <Sheet title="材料明細表" label="材料 · 填充圖例與明細" heading="材料">
    <div className="ab-in" style={d(0.2)}>
      <MatCard
        x={120}
        y={262}
        swatch={<SteelSwatch />}
        name="結構鋼材"
        spec="橋面 S355 · 橋塔 S460"
        qty="412 t"
        note="工廠焊接，分九段"
      />
      <MatCard
        x={694}
        y={262}
        swatch={<StrandSwatch />}
        name="斜拉索"
        spec="全封閉式鋼纜 · Ø40 / Ø60"
        qty="18 根"
        note="可逐根更換"
      />
      <MatCard
        x={1268}
        y={262}
        swatch={<ConcreteSwatch />}
        name="混凝土"
        spec="C40/50 · 基樁與橋台"
        qty="640 m³"
        note="30% GGBS 取代水泥"
      />
    </div>
    <div className="ab-in" style={d(0.5)}>
      <MatCard
        x={120}
        y={558}
        swatch={<PaintSwatch />}
        name="塗裝系統"
        spec="ISO 12944 C4 · 4 道塗層"
        qty="320 µm DFT"
        note="25 年後首次重新塗裝"
      />
      <MatCard
        x={694}
        y={558}
        swatch={<MeshSwatch />}
        name="欄杆填充"
        spec="316L 網 · 鐵路段遮蔽板"
        qty="1.4 m / 1.8 m"
        note="跨鐵路段防攀爬"
      />
      <MatCard
        x={1268}
        y={558}
        swatch={<GritSwatch />}
        name="鋪面"
        spec="環氧樹脂 + 煅燒鋁礬土"
        qty="濕滑 PTV ≥ 45"
        note="濕滑時仍有抓地力"
      />
    </div>
    <div className="ab-in" style={{ ...abs(120, 872, { width: 1060 }), ...d(0.9) }}>
      <div style={SMALL}>隱含碳 · A1–A5</div>
      <div style={{ fontSize: 30, marginTop: 6 }}>
        1,140 tCO₂e — <span style={{ color: CY }}>低 31%，</span> 對照我們 2019 年人行橋的基準
      </div>
    </div>
  </Sheet>
);

const fx = (f: number) => 236 + f * 166;

const Band = ({
  f0,
  f1,
  y,
  h,
  lvl,
  pat,
}: {
  f0: number;
  f1: number;
  y: number;
  h: number;
  lvl: 1 | 2 | 3;
  pat?: string;
}) => (
  <rect
    x={fx(f0)}
    y={y}
    width={fx(f1) - fx(f0)}
    height={h}
    fill={lvl === 1 && pat ? `url(#${pat})` : CY}
    fillOpacity={lvl === 1 ? 1 : lvl === 2 ? 0.28 : 0.09}
    stroke={lvl === 1 ? AMBER : CY}
    strokeOpacity={0.6}
    strokeWidth={1}
  />
);

const ModeMark = ({
  f,
  y: y0,
  h,
  n,
  lift = 0,
}: {
  f: number;
  y: number;
  h: number;
  n: string;
  lift?: number;
}) => {
  const y = y0 - lift;
  return (
    <g>
      <line x1={fx(f)} y1={y - 14} x2={fx(f)} y2={y0 + h + 6} stroke={INK} strokeWidth={2.4} />
      <rect
        x={fx(f) - 52}
        y={y - 46}
        width={104}
        height={30}
        fill={BG}
        stroke={INK}
        strokeWidth={1.2}
      />
      <text x={fx(f)} y={y - 24} textAnchor="middle" style={tx(18, INK)}>
        {n} {f.toFixed(2)}
      </text>
    </g>
  );
};

const AccBar = ({
  y,
  v,
  max,
  label,
  after,
}: {
  y: number;
  v: number;
  max: number;
  label: string;
  after?: boolean;
}) => (
  <g>
    <text x={1170} y={y + 20} style={tx(18, after ? CY : MUTE)}>
      {label}
    </text>
    <rect
      x={1360}
      y={y}
      width={(v / max) * 420}
      height={28}
      fill={after ? CY : MUTE}
      fillOpacity={after ? 0.8 : 0.4}
      stroke="none"
    />
    <text x={1360 + (v / max) * 420 + 10} y={y + 21} style={tx(20, after ? CY : INK)}>
      {v.toFixed(2)}
    </text>
  </g>
);

const VibrationPage: Page = () => {
  const uid = uidOf(useId());
  return (
    <Sheet title="動力與舒適度" label="人行動力 · Sétra II 級" heading="振動與舒適度">
      <Svg>
        <defs>
          <pattern
            id={`${uid}h`}
            width={8}
            height={8}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1={0} y1={0} x2={0} y2={8} stroke={AMBER} strokeWidth={2.2} />
          </pattern>
        </defs>
        <g style={d(0.1)}>
          <text x={120} y={348} style={tx(20, INK)}>
            垂直向
          </text>
          <text x={120} y={478} style={tx(20, INK)}>
            側向
          </text>
          <Band f0={1.0} f1={1.7} y={318} h={54} lvl={2} />
          <Band f0={1.7} f1={2.1} y={318} h={54} lvl={1} pat={`${uid}h`} />
          <Band f0={2.1} f1={2.6} y={318} h={54} lvl={2} />
          <Band f0={2.6} f1={5.0} y={318} h={54} lvl={3} />
          <Band f0={0.3} f1={0.5} y={448} h={54} lvl={2} />
          <Band f0={0.5} f1={1.1} y={448} h={54} lvl={1} pat={`${uid}h`} />
          <Band f0={1.1} f1={1.3} y={448} h={54} lvl={2} />
          <Band f0={1.3} f1={2.5} y={448} h={54} lvl={3} />
          <line x1={fx(0)} y1={540} x2={fx(5)} y2={540} stroke={INK} strokeWidth={1.4} />
          <line x1={fx(0)} y1={300} x2={fx(0)} y2={540} stroke={FAINT} strokeWidth={1} />
          <text x={fx(0)} y={572} textAnchor="middle" style={tx(18, MUTE)}>
            0
          </text>
          <text x={fx(1)} y={572} textAnchor="middle" style={tx(18, MUTE)}>
            1
          </text>
          <text x={fx(2)} y={572} textAnchor="middle" style={tx(18, MUTE)}>
            2
          </text>
          <text x={fx(3)} y={572} textAnchor="middle" style={tx(18, MUTE)}>
            3
          </text>
          <text x={fx(4)} y={572} textAnchor="middle" style={tx(18, MUTE)}>
            4
          </text>
          <text x={fx(5)} y={572} textAnchor="middle" style={tx(18, MUTE)}>
            5 Hz
          </text>
          <line x1={fx(1)} y1={536} x2={fx(1)} y2={546} stroke={INK} strokeWidth={1.2} />
          <line x1={fx(2)} y1={536} x2={fx(2)} y2={546} stroke={INK} strokeWidth={1.2} />
          <line x1={fx(3)} y1={536} x2={fx(3)} y2={546} stroke={INK} strokeWidth={1.2} />
          <line x1={fx(4)} y1={536} x2={fx(4)} y2={546} stroke={INK} strokeWidth={1.2} />
          <line x1={fx(5)} y1={536} x2={fx(5)} y2={546} stroke={INK} strokeWidth={1.2} />
        </g>
        <g style={d(0.7)}>
          <ModeMark f={2.31} y={318} h={54} n="V1" />
          <ModeMark f={2.95} y={318} h={54} n="T1" lift={34} />
          <ModeMark f={3.84} y={318} h={54} n="V2" />
          <ModeMark f={1.12} y={448} h={54} n="L1" />
          <rect
            x={236}
            y={600}
            width={26}
            height={18}
            fill={`url(#${uid}h)`}
            stroke={AMBER}
            strokeWidth={1}
          />
          <text x={272} y={615} style={tx(18, MUTE)}>
            範圍 1 · 風險最高
          </text>
          <rect
            x={520}
            y={600}
            width={26}
            height={18}
            fill={CY}
            fillOpacity={0.28}
            stroke={CY}
            strokeWidth={1}
          />
          <text x={556} y={615} style={tx(18, MUTE)}>
            範圍 2 · 中等
          </text>
          <rect
            x={790}
            y={600}
            width={26}
            height={18}
            fill={CY}
            fillOpacity={0.09}
            stroke={CY}
            strokeWidth={1}
          />
          <text x={826} y={615} style={tx(18, MUTE)}>
            範圍 3 · 低
          </text>
        </g>
        <g style={d(1.0)}>
          <text x={120} y={688} style={tx(20, INK)}>
            模態 V1 · 2.31 Hz · 主跨
          </text>
          <line x1={200} y1={770} x2={1040} y2={770} stroke={FAINT} strokeWidth={1.2} />
          <polygon points="200,772 190,790 210,790" fill="none" stroke={INK} strokeWidth={1.4} />
          <polygon points="804,772 794,790 814,790" fill="none" stroke={INK} strokeWidth={1.4} />
          <polygon points="1040,772 1030,790 1050,790" fill="none" stroke={INK} strokeWidth={1.4} />
          <line x1={804} y1={770} x2={804} y2={712} stroke={INK} strokeWidth={3} />
          <path
            className="ab-sway"
            style={{ transformOrigin: '0px 770px' }}
            d="M200,770 C300,722 420,716 500,722 C600,730 720,772 804,770 C870,768 940,782 1040,770"
            fill="none"
            stroke={CY}
            strokeWidth={2.6}
          />
        </g>
      </Svg>
      <Svg>
        <g style={d(0.4)}>
          <text x={1170} y={286} style={tx(20, CY)}>
            尖峰加速度 m/s² · 0.8 人/m²
          </text>
          <text x={1170} y={336} style={tx(18, INK)}>
            垂直向
          </text>
          <AccBar y={352} v={0.71} max={1.0} label="無 TMD" />
          <AccBar y={392} v={0.32} max={1.0} label="有 TMD" after />
          <line
            x1={1360 + 0.5 * 420}
            y1={344}
            x2={1360 + 0.5 * 420}
            y2={430}
            stroke={AMBER}
            strokeWidth={1.6}
            strokeDasharray="5 4"
          />
          <text x={1360 + 0.5 * 420} y={448} textAnchor="middle" style={tx(18, AMBER)}>
            限值 0.50
          </text>
          <text x={1170} y={498} style={tx(18, INK)}>
            側向
          </text>
          <AccBar y={514} v={0.19} max={0.25} label="無 TMD" />
          <AccBar y={554} v={0.06} max={0.25} label="有 TMD" after />
          <line
            x1={1360 + 0.4 * 420}
            y1={506}
            x2={1360 + 0.4 * 420}
            y2={592}
            stroke={AMBER}
            strokeWidth={1.6}
            strokeDasharray="5 4"
          />
          <text x={1360 + 0.4 * 420} y={610} textAnchor="middle" style={tx(18, AMBER)}>
            限值 0.10
          </text>
        </g>
        <g style={d(0.9)}>
          <line x1={1170} y1={668} x2={1460} y2={668} stroke={INK} strokeWidth={3} />
          <line x1={1270} y1={668} x2={1270} y2={690} stroke={INK} strokeWidth={1.4} />
          <path
            d="M1270,690 l-10,5 l20,10 l-20,10 l20,10 l-10,5"
            fill="none"
            stroke={CY}
            strokeWidth={1.6}
          />
          <line x1={1270} y1={730} x2={1270} y2={744} stroke={INK} strokeWidth={1.4} />
          <line x1={1340} y1={668} x2={1340} y2={696} stroke={INK} strokeWidth={1.4} />
          <rect x={1330} y={696} width={20} height={26} fill="none" stroke={CY} strokeWidth={1.6} />
          <line x1={1340} y1={710} x2={1340} y2={744} stroke={INK} strokeWidth={1.4} />
          <line x1={1324} y1={710} x2={1356} y2={710} stroke={CY} strokeWidth={1.6} />
          <rect
            x={1236}
            y={744}
            width={140}
            height={52}
            fill={CY}
            fillOpacity={0.4}
            stroke={INK}
            strokeWidth={1.6}
          />
          <text x={1306} y={777} textAnchor="middle" style={tx(18, INK)}>
            1.2 t
          </text>
          <text x={1476} y={700} style={tx(20, INK)}>
            3 組 TMD
          </text>
          <text x={1476} y={730} style={tx(18, MUTE)}>
            2 × 1.2 t 垂直
          </text>
          <text x={1476} y={758} style={tx(18, MUTE)}>
            1 × 0.8 t 側向
          </text>
          <text x={1476} y={792} style={tx(20, AMBER)}>
            暫列 £180k
          </text>
        </g>
      </Svg>
    </Sheet>
  );
};

const StageCol = ({
  x,
  y,
  n,
  title,
  when,
  body,
  children,
}: {
  x: number;
  y: number;
  n: string;
  title: string;
  when: string;
  body: string;
  children: ReactNode;
}) => (
  <div style={abs(x, y, { width: 820 })}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: `1.2px solid ${FAINT}`,
        paddingBottom: 6,
      }}
    >
      <span style={LABEL}>階段 {n}</span>
      <span style={{ ...SMALL, color: AMBER }}>{when}</span>
    </div>
    <div style={{ display: 'flex', gap: 24, marginTop: 6 }}>
      <svg
        width={500}
        height={246}
        viewBox="0 0 500 246"
        className="ab-ink"
        style={{ display: 'block', flex: 'none' }}
      >
        {children}
      </svg>
      <div style={{ paddingTop: 20 }}>
        <div
          style={{
            fontFamily: 'var(--osd-font-display)',
            fontWeight: 600,
            fontSize: 34,
            textTransform: 'uppercase',
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        <p style={{ fontSize: 28, lineHeight: 1.38, color: MUTE, margin: '12px 0 0' }}>{body}</p>
      </div>
    </div>
  </div>
);

const ConstructionPage: Page = () => {
  const sg = geo(6, 58, 3, 52);
  return (
    <Sheet title="施工順序" label="施工順序 · 4 個階段" heading="如何施工">
      <Steps>
        <Step>
          <StageCol
            x={120}
            y={256}
            n="1"
            title="下部結構"
            when="2027 年 8–12 月"
            body="先施作基樁、承台與橋台，接著把橋塔下段做到橋面高程為止。"
          >
            <Elevation g={sg} zBot={11.5} lite show={['sub', 'pyLo']} hl={['sub', 'pyLo']} />
          </StageCol>
        </Step>
        <Step>
          <StageCol
            x={980}
            y={256}
            n="2"
            title="背跨"
            when="2028 年復活節 · 54 小時"
            body="18 m 跨段整段吊裝跨越鐵路，一次封軌完成。"
          >
            <Elevation
              g={sg}
              zBot={11.5}
              lite
              show={['sub', 'pyLo', 'back']}
              hl={['back']}
              crane={[55, 31]}
            />
          </StageCol>
        </Step>
        <Step>
          <StageCol
            x={120}
            y={556}
            n="3"
            title="橋塔上段"
            when="2028 年 5 月"
            body="塔頭分兩段吊裝；背拉索安裝完成後，先施加部分預力。"
          >
            <Elevation
              g={sg}
              zBot={11.5}
              lite
              show={['sub', 'pyLo', 'back', 'pyHi', 'bstays']}
              hl={['pyHi', 'bstays']}
              crane={[47, 51.5]}
            />
          </StageCol>
        </Step>
        <Step>
          <StageCol
            x={980}
            y={556}
            n="4"
            title="主跨"
            when="2028 年 6–9 月"
            body="三個節段架設於兩座河中臨時支架；斜拉索張拉後拆除支架。"
          >
            <Elevation
              g={sg}
              zBot={11.5}
              lite
              show={['sub', 'pyLo', 'back', 'pyHi', 'bstays', 'main', 'mstays', 'trestles']}
              hl={['main', 'mstays', 'trestles']}
            />
          </StageCol>
        </Step>
      </Steps>
    </Sheet>
  );
};

const CostSeg = ({
  x0,
  v,
  letter,
  hatch,
}: {
  x0: number;
  v: number;
  letter: string;
  hatch?: string;
}) => {
  const w = v * 160;
  return (
    <g>
      <rect
        x={120 + x0 * 160}
        y={470}
        width={w}
        height={56}
        fill={hatch ?? CY}
        fillOpacity={hatch ? 1 : 0.16}
        stroke={INK}
        strokeWidth={1.4}
      />
      <text
        x={120 + x0 * 160 + w / 2}
        y={505}
        textAnchor="middle"
        style={{ ...tx(20, INK), ...HALO }}
      >
        {letter}
      </text>
      <line
        x1={120 + x0 * 160}
        y1={442}
        x2={120 + x0 * 160}
        y2={462}
        stroke={CY}
        strokeWidth={1.1}
      />
      <line
        x1={120 + x0 * 160 - 6}
        y1={456}
        x2={120 + x0 * 160 + 6}
        y2={448}
        stroke={CY}
        strokeWidth={2}
      />
      <text x={120 + x0 * 160 + w / 2} y={446} textAnchor="middle" style={tx(18, CY)}>
        {v.toFixed(2)}
      </text>
    </g>
  );
};

const CostLine = ({
  x,
  y,
  letter,
  name,
  v,
}: {
  x: number;
  y: number;
  letter: string;
  name: string;
  v: string;
}) => (
  <div
    style={abs(x, y, {
      width: 470,
      display: 'flex',
      alignItems: 'baseline',
      gap: 16,
      borderBottom: `1px solid ${GHOST}`,
      paddingBottom: 6,
    })}
  >
    <span style={{ fontFamily: MONO, fontSize: 20, color: CY, width: 22 }}>{letter}</span>
    <span style={{ fontSize: 28 }}>{name}</span>
    <span style={{ fontFamily: MONO, fontSize: 26, marginLeft: 'auto' }}>{v}</span>
  </div>
);

const BigStat = ({ x, k, v, accent }: { x: number; k: string; v: string; accent?: boolean }) => (
  <div style={abs(x, 262)}>
    <div style={{ ...SMALL, color: accent ? CY : MUTE }}>{k}</div>
    <div
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontWeight: 600,
        fontSize: 84,
        lineHeight: 1.05,
        color: accent ? CY : INK,
      }}
    >
      {v}
    </div>
  </div>
);

const CostPage: Page = () => {
  const uid = uidOf(useId());
  return (
    <Sheet title="成本計畫" label="成本計畫 · 60% 估算 · 2026 年第三季價格" heading="成本">
      <div className="ab-in" style={d(0.1)}>
        <BigStat x={120} k="P50 估算" v="£8.90 M" accent />
        <BigStat x={540} k="核定預算上限" v="£9.40 M" />
        <BigStat x={960} k="P90" v="£9.62 M" />
      </div>
      <Svg>
        <defs>
          <pattern
            id={uid}
            width={8}
            height={8}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={8}
              stroke={AMBER}
              strokeOpacity={0.7}
              strokeWidth={1.6}
            />
          </pattern>
        </defs>
        <g style={d(0.3)}>
          <CostSeg x0={0} v={1.42} letter="A" />
          <CostSeg x0={1.42} v={2.18} letter="B" />
          <CostSeg x0={3.6} v={0.96} letter="C" />
          <CostSeg x0={4.56} v={0.64} letter="D" />
          <CostSeg x0={5.2} v={0.88} letter="E" />
          <CostSeg x0={6.08} v={0.46} letter="F" />
          <CostSeg x0={6.54} v={0.71} letter="G" />
          <CostSeg x0={7.25} v={0.95} letter="H" />
          <CostSeg x0={8.2} v={0.7} letter="I" hatch={`url(#${uid})`} />
          <line x1={1544} y1={442} x2={1544} y2={462} stroke={CY} strokeWidth={1.1} />
          <line x1={1538} y1={456} x2={1550} y2={448} stroke={CY} strokeWidth={2} />
        </g>
        <g style={d(0.9)}>
          <line x1={120} y1={548} x2={1720} y2={548} stroke={FAINT} strokeWidth={1} />
          <line x1={120} y1={542} x2={120} y2={554} stroke={MUTE} strokeWidth={1.2} />
          <line x1={440} y1={542} x2={440} y2={554} stroke={MUTE} strokeWidth={1.2} />
          <line x1={760} y1={542} x2={760} y2={554} stroke={MUTE} strokeWidth={1.2} />
          <line x1={1080} y1={542} x2={1080} y2={554} stroke={MUTE} strokeWidth={1.2} />
          <line x1={1400} y1={542} x2={1400} y2={554} stroke={MUTE} strokeWidth={1.2} />
          <line x1={1720} y1={542} x2={1720} y2={554} stroke={MUTE} strokeWidth={1.2} />
          <text x={120} y={578} textAnchor="middle" style={tx(18, MUTE)}>
            £0
          </text>
          <text x={440} y={578} textAnchor="middle" style={tx(18, MUTE)}>
            2
          </text>
          <text x={760} y={578} textAnchor="middle" style={tx(18, MUTE)}>
            4
          </text>
          <text x={1080} y={578} textAnchor="middle" style={tx(18, MUTE)}>
            6
          </text>
          <text x={1400} y={578} textAnchor="middle" style={tx(18, MUTE)}>
            8
          </text>
          <text x={1720} y={578} textAnchor="middle" style={tx(18, MUTE)}>
            £10 M
          </text>
          <line
            x1={1624}
            y1={400}
            x2={1624}
            y2={540}
            stroke={INK}
            strokeWidth={1.6}
            strokeDasharray="6 4"
          />
          <text x={1616} y={414} textAnchor="end" style={tx(18, INK)}>
            預算上限 9.40
          </text>
          <line
            x1={1659}
            y1={380}
            x2={1659}
            y2={540}
            stroke={MUTE}
            strokeWidth={1.4}
            strokeDasharray="3 4"
          />
          <text x={1667} y={394} style={tx(18, MUTE)}>
            P90
          </text>
          <path d="M1546,534 q39,22 78,0" fill="none" stroke={AMBER} strokeWidth={1.6} />
          <text x={1586} y={616} textAnchor="middle" style={tx(24, AMBER, HAND)}>
            餘裕 £0.5 M
          </text>
        </g>
      </Svg>
      <div className="ab-in" style={d(0.7)}>
        <CostLine x={120} y={620} letter="A" name="基樁與下部結構" v="1.42" />
        <CostLine x={120} y={672} letter="B" name="橋面鋼構" v="2.18" />
        <CostLine x={120} y={724} letter="C" name="橋塔" v="0.96" />
        <CostLine x={120} y={776} letter="D" name="斜拉索與錨具" v="0.64" />
        <CostLine x={120} y={828} letter="E" name="鐵路介面與封軌" v="0.88" />
        <CostLine x={650} y={620} letter="F" name="河道工程與生態" v="0.46" />
        <CostLine x={650} y={672} letter="G" name="欄杆、鋪面與照明" v="0.71" />
        <CostLine x={650} y={724} letter="H" name="開辦費用" v="0.95" />
        <CostLine x={650} y={776} letter="I" name="量化風險 (P50)" v="0.70" />
      </div>
      <div className="ab-in" style={{ ...abs(1250, 680, { width: 550 }), ...d(1.0) }}>
        <div style={{ ...SMALL, color: CY }}>橋面單位面積造價</div>
        <div
          style={{
            fontFamily: 'var(--osd-font-display)',
            fontWeight: 600,
            fontSize: 56,
            lineHeight: 1.1,
            marginTop: 4,
          }}
        >
          £25.8k / m²
        </div>
        <div style={{ fontSize: 28, color: MUTE, marginTop: 2 }}>英國人行橋 2019–25：£18–32k</div>
      </div>
    </Sheet>
  );
};

const mx = (m: number) => 560 + m * 45;
const rowY = (r: number) => 330 + r * 46;

const GBar = ({ r, m0, m1, crit }: { r: number; m0: number; m1: number; crit?: boolean }) => (
  <rect
    x={mx(m0)}
    y={rowY(r) - 10}
    width={mx(m1) - mx(m0)}
    height={20}
    fill={crit ? CY : 'none'}
    fillOpacity={crit ? 0.75 : 1}
    stroke={crit ? CY : INK}
    strokeWidth={1.4}
  />
);

const GMile = ({
  r,
  m,
  label,
  crit,
  lm,
  end,
}: {
  r: number;
  m: number;
  label: string;
  crit?: boolean;
  lm?: number;
  end?: boolean;
}) => (
  <g>
    <polygon
      points={`${mx(m)},${rowY(r) - 13} ${mx(m) + 13},${rowY(r)} ${mx(m)},${rowY(r) + 13} ${mx(m) - 13},${rowY(r)}`}
      fill={crit ? AMBER : BG}
      stroke={crit ? AMBER : INK}
      strokeWidth={1.6}
    />
    <text
      x={end ? mx(m) - 22 : mx(lm ?? m) + 22}
      y={rowY(r) + 6}
      textAnchor={end ? 'end' : 'start'}
      style={{ ...tx(18, crit ? AMBER : INK), ...HALO }}
    >
      {label}
    </text>
  </g>
);

const GRow = ({ r, text }: { r: number; text: string }) => (
  <div
    style={abs(120, rowY(r) - 20, {
      fontSize: 28,
      lineHeight: '40px',
      width: 420,
      whiteSpace: 'nowrap',
    })}
  >
    {text}
  </div>
);

const MonthTick = ({ m, t }: { m: number; t: string }) => (
  <text x={mx(m) + 22.5} y={316 - 14} textAnchor="middle" style={tx(18, MUTE)}>
    {t}
  </text>
);

const ProgrammePage: Page = () => {
  const uid = uidOf(useId());
  return (
    <Sheet title="施工進度" label="進度 · 2026 年 10 月 – 2028 年 12 月" heading="施工進度">
      <Svg>
        <defs>
          <pattern
            id={uid}
            width={10}
            height={10}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1={0} y1={0} x2={0} y2={10} stroke={CY} strokeOpacity={0.3} strokeWidth={2} />
          </pattern>
        </defs>
        <g style={d(0.1)}>
          <rect x={mx(8)} y={310} width={45 * 4} height={520} fill={`url(#${uid})`} stroke="none" />
          <rect
            x={mx(20)}
            y={310}
            width={45 * 4}
            height={520}
            fill={`url(#${uid})`}
            stroke="none"
          />
          <text x={mx(10)} y={822} textAnchor="middle" style={{ ...tx(18, CY), ...HALO }}>
            河道作業期
          </text>
          <text x={mx(22)} y={822} textAnchor="middle" style={{ ...tx(18, CY), ...HALO }}>
            河道作業期
          </text>
          <line x1={mx(0)} y1={252} x2={mx(27)} y2={252} stroke={INK} strokeWidth={1.4} />
          <line x1={mx(0)} y1={310} x2={mx(27)} y2={310} stroke={INK} strokeWidth={1.4} />
          <line x1={mx(0)} y1={252} x2={mx(0)} y2={830} stroke={FAINT} strokeWidth={1} />
          <line x1={mx(3)} y1={252} x2={mx(3)} y2={830} stroke={FAINT} strokeWidth={1} />
          <line x1={mx(15)} y1={252} x2={mx(15)} y2={830} stroke={FAINT} strokeWidth={1} />
          <line x1={mx(27)} y1={252} x2={mx(27)} y2={830} stroke={FAINT} strokeWidth={1} />
          <text x={mx(1.5)} y={276} textAnchor="middle" style={tx(18, INK)}>
            2026
          </text>
          <text x={mx(9)} y={276} textAnchor="middle" style={tx(18, INK)}>
            2027
          </text>
          <text x={mx(21)} y={276} textAnchor="middle" style={tx(18, INK)}>
            2028
          </text>
          <MonthTick m={0} t="10" />
          <MonthTick m={1} t="11" />
          <MonthTick m={2} t="12" />
          <MonthTick m={3} t="1" />
          <MonthTick m={4} t="2" />
          <MonthTick m={5} t="3" />
          <MonthTick m={6} t="4" />
          <MonthTick m={7} t="5" />
          <MonthTick m={8} t="6" />
          <MonthTick m={9} t="7" />
          <MonthTick m={10} t="8" />
          <MonthTick m={11} t="9" />
          <MonthTick m={12} t="10" />
          <MonthTick m={13} t="11" />
          <MonthTick m={14} t="12" />
          <MonthTick m={15} t="1" />
          <MonthTick m={16} t="2" />
          <MonthTick m={17} t="3" />
          <MonthTick m={18} t="4" />
          <MonthTick m={19} t="5" />
          <MonthTick m={20} t="6" />
          <MonthTick m={21} t="7" />
          <MonthTick m={22} t="8" />
          <MonthTick m={23} t="9" />
          <MonthTick m={24} t="10" />
          <MonthTick m={25} t="11" />
          <MonthTick m={26} t="12" />
        </g>
        <g style={d(0.5)}>
          <GBar r={0} m0={0} m1={6.5} crit />
          <GBar r={1} m0={0} m1={7} />
          <GMile r={2} m={3.9} label="2027/1/29" crit />
          <GBar r={3} m0={7} m1={10} crit />
          <GBar r={4} m0={11} m1={18} />
          <GBar r={5} m0={10} m1={15} crit />
          <GMile r={6} m={18.5} label="4/15–17 · 54 小時" crit />
          <GBar r={7} m0={18.6} m1={20} crit />
          <GBar r={8} m0={20} m1={24} crit />
          <GBar r={9} m0={24} m1={26.4} crit />
          <GMile r={10} m={26.6} label="2028/12" crit end />
          <GMile r={0} m={4.3} label="90% 審查 · 2/9" lm={6.5} />
        </g>
        <g style={d(1.1)}>
          <line
            x1={mx(0.4)}
            y1={240}
            x2={mx(0.4)}
            y2={830}
            stroke={AMBER}
            strokeWidth={1.6}
            strokeDasharray="6 5"
          />
          <text x={mx(0.4) + 10} y={238} style={tx(24, AMBER, HAND)}>
            今天
          </text>
        </g>
        <g style={d(1.3)}>
          <rect
            x={120}
            y={880}
            width={46}
            height={18}
            fill={CY}
            fillOpacity={0.75}
            stroke={CY}
            strokeWidth={1.4}
          />
          <text x={180} y={896} style={tx(18, MUTE)}>
            要徑
          </text>
          <rect x={400} y={880} width={46} height={18} fill="none" stroke={INK} strokeWidth={1.4} />
          <text x={460} y={896} style={tx(18, MUTE)}>
            浮時
          </text>
          <polygon
            points="620,876 633,889 620,902 607,889"
            fill={AMBER}
            stroke={AMBER}
            strokeWidth={1.4}
          />
          <text x={646} y={896} style={tx(18, MUTE)}>
            關鍵日期
          </text>
        </g>
      </Svg>
      <div className="ab-in" style={d(0.3)}>
        <GRow r={0} text="細部設計" />
        <GRow r={1} text="許可與鐵路核准" />
        <GRow r={2} text="提出封軌申請" />
        <GRow r={3} text="招標與決標" />
        <GRow r={4} text="鋼構製造" />
        <GRow r={5} text="下部結構" />
        <GRow r={6} text="背跨吊裝" />
        <GRow r={7} text="橋塔上段與背拉索" />
        <GRow r={8} text="主跨與斜拉索" />
        <GRow r={9} text="裝修、TMD 與載重試驗" />
        <GRow r={10} text="對外開放" />
      </div>
    </Sheet>
  );
};

const RiskDot = ({
  l,
  i,
  n,
  dx = 0,
  dy = 0,
}: {
  l: number;
  i: number;
  n: string;
  dx?: number;
  dy?: number;
}) => {
  const x = 220 + (l - 0.5) * 84 + dx;
  const y = 710 - (i - 0.5) * 84 + dy;
  return (
    <g>
      <circle cx={x} cy={y} r={22} fill={BG} stroke={INK} strokeWidth={1.8} />
      <text x={x} y={y + 6.5} textAnchor="middle" style={tx(18, INK)}>
        {n}
      </text>
    </g>
  );
};

const RiskRow = ({
  top,
  n,
  title,
  mit,
  rating,
}: {
  top: number;
  n: string;
  title: string;
  mit: string;
  rating: 'HIGH' | 'MED' | 'LOW';
}) => (
  <div style={abs(760, top, { width: 1040, display: 'flex', gap: 22, alignItems: 'flex-start' })}>
    <span
      style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: `1.8px solid ${INK}`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: MONO,
        fontSize: 18,
        flex: 'none',
      }}
    >
      {n}
    </span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 31, fontWeight: 600, lineHeight: 1.2 }}>{title}</div>
      <div style={{ fontSize: 28, color: MUTE, lineHeight: 1.35, marginTop: 2 }}>{mit}</div>
    </div>
    <span
      style={{
        ...SMALL,
        color: rating === 'HIGH' ? AMBER : rating === 'MED' ? CY : MUTE,
        border: `1.2px solid ${rating === 'HIGH' ? AMBER : rating === 'MED' ? CY : FAINT}`,
        padding: '4px 10px',
        marginTop: 6,
        flex: 'none',
        width: 60,
        textAlign: 'center',
      }}
    >
      {{ HIGH: '高', MED: '中', LOW: '低' }[rating]}
    </span>
  </div>
);

const RisksPage: Page = () => {
  const uid = uidOf(useId());
  return (
    <Sheet title="風險登錄表" label="風險登錄 · 前五大殘餘風險" heading="風險">
      <Svg>
        <defs>
          <pattern
            id={uid}
            width={9}
            height={9}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={9}
              stroke={AMBER}
              strokeOpacity={0.8}
              strokeWidth={2.2}
            />
          </pattern>
        </defs>
        <g style={d(0.1)}>
          <polygon
            points="304,290 640,290 640,626 472,626 472,542 388,542 388,458 304,458"
            fill={CY}
            fillOpacity={0.18}
            stroke="none"
          />
          <polygon
            points="388,290 640,290 640,542 556,542 556,458 472,458 472,374 388,374"
            fill={`url(#${uid})`}
            stroke="none"
          />
          <path
            d="M220,290 V710 M304,290 V710 M388,290 V710 M472,290 V710 M556,290 V710 M640,290 V710 M220,290 H640 M220,374 H640 M220,458 H640 M220,542 H640 M220,626 H640 M220,710 H640"
            fill="none"
            stroke={INK}
            strokeOpacity={0.55}
            strokeWidth={1.2}
          />
          <text x={262} y={738} textAnchor="middle" style={tx(18, MUTE)}>
            1
          </text>
          <text x={346} y={738} textAnchor="middle" style={tx(18, MUTE)}>
            2
          </text>
          <text x={430} y={738} textAnchor="middle" style={tx(18, MUTE)}>
            3
          </text>
          <text x={514} y={738} textAnchor="middle" style={tx(18, MUTE)}>
            4
          </text>
          <text x={598} y={738} textAnchor="middle" style={tx(18, MUTE)}>
            5
          </text>
          <text x={204} y={338} textAnchor="end" style={tx(18, MUTE)}>
            5
          </text>
          <text x={204} y={422} textAnchor="end" style={tx(18, MUTE)}>
            4
          </text>
          <text x={204} y={506} textAnchor="end" style={tx(18, MUTE)}>
            3
          </text>
          <text x={204} y={590} textAnchor="end" style={tx(18, MUTE)}>
            2
          </text>
          <text x={204} y={674} textAnchor="end" style={tx(18, MUTE)}>
            1
          </text>
          <text x={430} y={772} textAnchor="middle" style={tx(18, INK)}>
            可能性 →
          </text>
          <text transform="translate(162,500) rotate(-90)" textAnchor="middle" style={tx(18, INK)}>
            衝擊 →
          </text>
        </g>
        <g style={d(0.7)}>
          <RiskDot l={3} i={5} n="R1" />
          <RiskDot l={3} i={3} n="R2" />
          <RiskDot l={2} i={4} n="R3" />
          <RiskDot l={4} i={2} n="R4" />
          <RiskDot l={2} i={2} n="R5" />
          <line x1={452} y1={262} x2={438} y2={300} stroke={AMBER} strokeWidth={1.4} />
          <Head x={436} y={306} ang={1.9} c={AMBER} />
          <text x={420} y={256} style={tx(26, AMBER, HAND)}>
            R1 決定整體進度
          </text>
        </g>
      </Svg>
      <div className="ab-in" style={d(0.4)}>
        <RiskRow
          top={290}
          n="R1"
          title="2028 年復活節封軌申請未獲核准"
          mit="2027 年 1 月提出申請；已議定 2028 年聖誕節為備案"
          rating="HIGH"
        />
        <RiskRow
          top={398}
          n="R2"
          title="橋塔處岩盤比 BH-04 更深"
          mit="2026 年 11 月加鑽兩孔；基樁預留 +4 m"
          rating="MED"
        />
        <RiskRow
          top={506}
          n="R3"
          title="夏季洪水中斷河道作業期"
          mit="支架依十年一遇夏季流量設計；保留 3 週浮時"
          rating="MED"
        />
        <RiskRow
          top={614}
          n="R4"
          title="鋼價漲幅超過 8%"
          mit="90% 設計時提早向鋼廠下單；招標納入物價指數條款"
          rating="MED"
        />
        <RiskRow
          top={722}
          n="R5"
          title="密集人群下的側向鎖定效應"
          mit="加裝側向 TMD；通車前進行人群試驗"
          rating="LOW"
        />
      </div>
    </Sheet>
  );
};

const Decision = ({
  top,
  n,
  title,
  detail,
  verb,
  note,
}: {
  top: number;
  n: string;
  title: string;
  detail: string;
  verb: string;
  note?: string;
}) => (
  <div
    style={abs(120, top, {
      width: 1680,
      height: 120,
      display: 'flex',
      gap: 34,
      alignItems: 'flex-start',
    })}
  >
    {note && (
      <span style={abs(1090, 24, { fontFamily: HAND, fontSize: 28, color: AMBER })}>{note}</span>
    )}
    <svg
      width={64}
      height={58}
      viewBox="0 0 64 58"
      className="ab-ink"
      style={{ flex: 'none', marginTop: 4 }}
    >
      <polygon points="32,3 61,55 3,55" fill="none" stroke={CY} strokeWidth={2} />
      <text x={32} y={46} textAnchor="middle" style={tx(18, CY)}>
        {n}
      </text>
    </svg>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontWeight: 600,
          fontSize: 38,
          lineHeight: 1.15,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 28, color: MUTE, lineHeight: 1.35, marginTop: 6 }}>{detail}</div>
    </div>
    <div
      style={{
        width: 150,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        flex: 'none',
      }}
    >
      <span style={{ ...SMALL, color: CY }}>{verb}</span>
      <span
        style={{ width: 52, height: 52, border: `2px solid ${INK}`, boxSizing: 'border-box' }}
      />
    </div>
  </div>
);

const DecisionsPage: Page = () => (
  <Sheet title="請求決議事項" label="提請小組 · 今日" heading="請求決議事項">
    <Steps>
      <Step>
        <Decision
          top={272}
          n="D1"
          title="認可以斜張式 A 型橋塔作為 90% 設計基礎"
          detail="方案 C：無河中橋墩、一次封軌、750 mm 橋面。"
          verb="核准"
        />
      </Step>
      <Step>
        <Decision
          top={412}
          n="D2"
          title="確認 4.0 m 淨寬與 1:25 縱斷面"
          detail="據此確定橋面斷面與兩端落地高程。"
          verb="核准"
        />
      </Step>
      <Step>
        <Decision
          top={552}
          n="D3"
          title="授權提出 2028 年復活節封軌申請"
          detail="須於 2027 年 1 月 29 日前向鐵路營運方提出。"
          note="← 唯一有期限的一項"
          verb="核准"
        />
      </Step>
      <Step>
        <Decision
          top={692}
          n="D4"
          title="備查：P50 估算 £8.90 M，在 £9.40 M 預算上限內"
          detail="含 £180k 調諧質量阻尼器暫列金額。"
          verb="備查"
        />
      </Step>
    </Steps>
  </Sheet>
);

const NextStep = ({ top, date, text }: { top: number; date: string; text: string }) => (
  <div style={abs(120, top, { display: 'flex', gap: 30, alignItems: 'baseline', width: 1000 })}>
    <span style={{ fontFamily: MONO, fontSize: 24, color: CY, width: 190, flex: 'none' }}>
      {date}
    </span>
    <span style={{ fontSize: 32 }}>{text}</span>
  </div>
);

const ClosePage: Page = () => {
  const uid = uidOf(useId());
  const cx = 1500;
  const cy = 470;
  return (
    <Sheet title="提問與後續步驟" label="圖紙組結束 · 版次 C">
      <div className="ab-in" style={{ ...abs(120, 220), ...d(0.1) }}>
        <div
          style={{
            fontFamily: 'var(--osd-font-display)',
            fontSize: 'var(--osd-size-hero)',
            fontWeight: 600,
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
        >
          提問
        </div>
        <div style={{ fontFamily: HAND, fontSize: 40, color: AMBER, marginTop: 14 }}>
          …歡迎在任何一張圖上標註意見
        </div>
      </div>
      <div className="ab-in" style={d(0.5)}>
        <div style={abs(120, 560, SMALL)}>接下來</div>
        <NextStep top={600} date="2026/10/28" text="小組意見回覆 Kestrel & Vane" />
        <NextStep top={664} date="2027/1/29" text="提出 2028 年復活節封軌申請" />
        <NextStep top={728} date="2027/2/9" text="與本小組進行 90% 設計審查" />
      </div>
      <Svg>
        <defs>
          <path
            id={`${uid}c`}
            d={`M${cx - 196},${cy} a196,196 0 1,1 392,0 a196,196 0 1,1 -392,0`}
          />
        </defs>
        <g style={d(0.3)} transform={`rotate(-9 ${cx} ${cy})`}>
          <circle cx={cx} cy={cy} r={236} fill="none" stroke={AMBER} strokeWidth={3} />
          <circle cx={cx} cy={cy} r={160} fill="none" stroke={AMBER} strokeWidth={1.6} />
          <text style={tx(26, AMBER, MONO, { letterSpacing: '0.3em' })}>
            <textPath href={`#${uid}c`}>KESTREL & VANE ENGINEERS · ARDEN STREET 人行橋 ·</textPath>
          </text>
          <text x={cx} y={cy - 42} textAnchor="middle" style={tx(22, AMBER)}>
            送審
          </text>
          <text
            x={cx}
            y={cy + 20}
            textAnchor="middle"
            style={tx(64, AMBER, 'var(--osd-font-display)', { fontWeight: 600 })}
          >
            60%
          </text>
          <text x={cx} y={cy + 60} textAnchor="middle" style={tx(22, AMBER)}>
            審查版 · 版次 C
          </text>
          <text x={cx} y={cy + 100} textAnchor="middle" style={tx(18, AMBER)}>
            14.10.2026
          </text>
        </g>
      </Svg>
      <div className="ab-in" style={{ ...abs(120, 880, { width: 1000 }), ...d(0.8) }}>
        <div style={SMALL}>聯絡</div>
        <div style={{ fontSize: 30, marginTop: 6 }}>Ruth Okafor · r.okafor@kestrelvane.co.uk</div>
      </div>
    </Sheet>
  );
};

export const notes: (string | undefined)[] = [
  `各位小組成員早安。我是 Ruth Okafor，專案工程師；Magnus Lindqvist 負責設計主持。
今天報告的是 Arden Street 人行橋的 60% 設計審查，也就是圖紙組的版次 C。
接下來看到的內容，都編排成一張張圖紙，各位提出意見時可以直接指明圖紙編號。
請看橋塔：重點就是一座橋塔，立在防洪堤岸上，河裡不設任何橋墩。`,
  `先從這座橋為什麼存在說起。
現在要從 Kell Meadows 走到 Arden Street，必須繞經 Carrow Road 橋，多走 1.1 公里。
這座橋把距離縮短到 64 公尺。我們預估 2030 年每天約有 2,400 人次通行，步行與自行車大約是六四比。
對步行者來說，每趟可以節省十三分鐘。
請指出三個固定點：綠道上的 A1、河與鐵路之間堤岸上的 P1、Arden Street 上的 A2。`,
  `這張縱斷面刻意把垂直方向放大，所以高程很容易判讀。
有四項條件決定了縱斷面。洪水：高於 1% 年超越機率加氣候變遷水位，要有 600 mm 的乾舷，我們在西岸有 1,160。
鐵路：電車線上方到軌面要 5.80 公尺，我們有 6.07。這個餘裕最小，也決定了整條縱斷面。
坡度：1:25，所以不需要設置休息平台。
橋塔：距最近的鋼軌 5.48 公尺，不需額外防護，就能避開出軌影響範圍。
請提一下修訂雲形線：自從 30% 之後，我們把橋面抬高了 250 mm，以保住 OLE 淨空。`,
  `我們比較了三種結構型式。
點一下：桁架最便宜，但需要在河道內設橋墩，環境署已經明確表示會反對。
點一下：繫桿拱完全不碰河道，但要一次吊裝 64 公尺，需要 1,200 噸的起重機和 72 小時的封軌。
點一下：斜張橋。£8.9 百萬、不設河中橋墩、一次 54 小時的封軌，而且橋面最薄。
點一下：這就是它成為首選方案的原因。`,
  `這是總體配置圖。
兩個跨徑：跨河 46 公尺、跨鐵路 18 公尺。橋塔高出橋面 30 公尺。
六根主斜拉索承載跨河段；三根較粗的背拉索把橋塔往東側橋台拉回。
請注意琥珀色的 6,066 尺寸，那是最緊處的鐵路淨空。
通過主跨的斷面 A–A，在下一張圖。`,
  `斷面 A–A。
兩個鋼製邊箱梁，尺寸 600 × 750，中間是正交異向性橋面鋼板。這就是我們能做出 750 mm 薄橋面的原因。
斜拉索鉸接在箱梁外側的錨座上，所以不會占用任何行走寬度。
兩側扶手之間的淨寬是 4 公尺，實際上就是兩輛自行車可以和一輛嬰兒推車錯身。
欄杆高 1.4 公尺，採不鏽鋼網；跨越鐵路的部分改為 1.8 公尺的實心遮蔽板，這是鐵路營運方的要求。`,
  `橋塔是 A 型，這裡是沿著橋身方向看。
塔柱是鋼箱，尺寸 1,200 × 900，S460 鋼材、40 mm 鋼板。斷面 B–B 可以看到加勁肋。
全部 18 根斜拉索都錨固在塔頭，也就是詳圖 1，間距 1.2 公尺。
基礎是八根直徑 900 mm 的 CFA 基樁，打到泥岩層。
鋼材共 96 噸，分兩次吊裝。`,
  `設計基準：歐洲規範搭配英國國家附錄。
共六個載重案例。要特別指出兩個：每平方公尺 5 kN 的人群載重，以及任一根斜拉索失效、動力係數取 2。
右側是控制性檢核。現階段沒有任何一項超過 0.78，所以在設計深化時還有餘裕。
人群載重下的撓度是 L 除以 622，限值是 L 除以 400。`,
  `六種材料，每一種都有對應的圖面填充圖樣，所以在每張圖上都認得出來。
鋼材 412 噸、全封閉式鋼纜斜拉索 18 根、混凝土 640 立方公尺。
塗裝系統的設計是 25 年後才需要第一次大修。
隱含碳為 1,140 噸，比我們 2019 年的基準低 31%，主要是因為沒有河中橋墩。`,
  `這是小組在 30% 審查時問到的那一張圖。
第一垂直模態是 2.31 赫茲，剛好避開行人腳步最不利的範圍。第一側向模態是 1.12，正好落在鎖定效應範圍的邊緣。
不做減振時，密集人群會造成垂直 0.71 公尺每平方秒的加速度，超過 0.5 的舒適度限值。
加上三組調諧質量阻尼器後，垂直降到 0.32，側向是 0.06。
我們已經編列 £180k 作為暫列金額，會在吊裝完成後經由試驗確認。`,
  `分四個階段。
點一下：下部結構，2027 年 8 月到 12 月。
點一下：背跨在 2028 年復活節的封軌期間，一次吊裝跨過鐵路：54 小時。
點一下：5 月施作橋塔上段，由背拉索先撐住背跨。
點一下：主跨在 6 月到 9 月的河道作業期施工，架在兩座臨時支架上，斜拉索張拉完成後就拆除。`,
  `60% 估算在 P50 是 £8.90 百萬，低於 £9.40 百萬的預算上限，P90 是 £9.62 百萬。
這條長條是一條尺寸鏈。每一段代表一項成本，有斜線填充的那一段是量化風險。
最大的項目是橋面鋼構和下部結構。
距離預算上限的餘裕大約是五十萬。`,
  `從今天到通車，共二十七個月。
要徑通過封軌這一關。申請必須在 2027 年 1 月 29 日前提出。
斜線色帶是河道作業期。主跨必須在 2028 年那一個作業期內完成。
如果一切順利，2028 年 12 月就能對外開放。`,
  `五項殘餘風險。
R1 是最關鍵的：如果復活節的封軌申請沒有獲准，下一個合適的時段是 2028 年聖誕節，大約會延誤八個月。
所以我們要提早提出申請，並且現在就先議定備案。
其他四項是中度或低度風險，每一項都有指定的因應對策。`,
  `今天有四項決議。
點一下：D1，認可斜張式 A 型橋塔。
點一下：D2，確認 4 公尺淨寬與 1:25 縱斷面。
點一下：D3，唯一有期限的一項：授權提出封軌申請。
點一下：D4，備查成本估算與阻尼器暫列金額。`,
  `謝謝大家。現在開放提問。
希望在 10 月 28 日前收到書面意見，以便納入 90% 設計。
我們會在 2 月 9 日再向各位報告。`,
];

export const meta: SlideMeta = {
  title: 'Arden Street 人行橋 — 60% 設計審查',
  createdAt: '2026-10-12T12:21:16.830Z',
};

export default [
  CoverPage,
  SitePage,
  ConstraintsPage,
  ConceptPage,
  ElevationPage,
  SectionPage,
  PylonPage,
  LoadsPage,
  MaterialsPage,
  VibrationPage,
  ConstructionPage,
  CostPage,
  ProgrammePage,
  RisksPage,
  DecisionsPage,
  ClosePage,
] satisfies Page[];
