import {
  type DesignSystem,
  MorphElement,
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
  palette: { bg: '#4B1DFF', text: '#FFFFFF', accent: '#D8FF2E' },
  fonts: {
    display:
      '"Barlow Condensed", "Arial Narrow", "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif',
    body: '"Barlow", "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif',
  },
  typeScale: { hero: 620, body: 30 },
  radius: 0,
};

const INK = '#0B0A14';
const CORAL = '#FF4A3D';
const DEEP = '#2A0FA3';
const LAV = '#D3CAFF';
const FOAM_LOW = '#BBAEFF';

const SLIDE_ID = 'aero-3-launch';
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;1,700;1,800;1,900&family=Barlow:wght@400;500;600;700&display=swap';
const FONT_LINK_ID = `osd-webfont-${SLIDE_ID}`;
const STYLE_ID = `osd-styles-${SLIDE_ID}`;
const KEYFRAMES = `
@keyframes ae-run { from { transform: translateX(0) } to { transform: translateX(calc(var(--tile) * -1)) } }
@keyframes ae-in { from { opacity: 0; transform: translateX(-56px) } to { opacity: 1; transform: none } }
@keyframes ae-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes ae-pace { to { stroke-dashoffset: -1000 } }
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

const ANGLE = 12;
const T = Math.tan((ANGLE * Math.PI) / 180);
const SKEW = `skewX(-${ANGLE}deg)`;

const cut = (h: number) => {
  const d = (h * T).toFixed(2);
  return `polygon(${d}px 0, 100% 0, calc(100% - ${d}px) 100%, 0 100%)`;
};

const BAND_RATIO = 12;
const BAND_PCT = ((T / BAND_RATIO) * 100).toFixed(4);
const BAND_CLIP = `polygon(${BAND_PCT}% 0, 100% 0, ${(100 - Number(BAND_PCT)).toFixed(4)}% 100%, 0 100%)`;

const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
const SNAP = 'cubic-bezier(0.16, 1, 0.3, 1)';
const HOLD: Keyframe[] = [{ opacity: 1 }, { opacity: 1 }];
const MORPH_MS = 860;

export const transition: SlideTransition = {
  duration: 240,
  exit: { duration: 240, easing: EASE_IN, keyframes: HOLD },
  enter: {
    duration: 240,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateX(calc(var(--osd-dir, 1) * 10px))' },
      { opacity: 1, transform: 'translateX(0)' },
    ],
  },
};

const morphTransition: SlideTransition = {
  duration: 300,
  exit: { duration: 320, easing: EASE_IN, keyframes: HOLD },
  enter: { duration: 320, easing: EASE_OUT, keyframes: [{ opacity: 0 }, { opacity: 1 }] },
  morph: { duration: MORPH_MS, easing: 'cubic-bezier(0.65, 0, 0.25, 1)' },
};

type Tone = 'uv' | 'volt' | 'ink';

const TONES: Record<Tone, { bg: string; fg: string; dim: string; hi: string; hiFg: string }> = {
  uv: { bg: 'var(--osd-bg)', fg: 'var(--osd-text)', dim: LAV, hi: 'var(--osd-accent)', hiFg: INK },
  volt: {
    bg: 'var(--osd-accent)',
    fg: INK,
    dim: 'rgba(11,10,20,0.66)',
    hi: INK,
    hiFg: 'var(--osd-accent)',
  },
  ink: {
    bg: INK,
    fg: 'var(--osd-text)',
    dim: 'rgba(255,255,255,0.6)',
    hi: 'var(--osd-accent)',
    hiFg: INK,
  },
};

const DISPLAY: CSSProperties = {
  fontFamily: 'var(--osd-font-display)',
  fontStyle: 'italic',
  fontWeight: 900,
  textTransform: 'uppercase',
  lineHeight: 0.84,
  letterSpacing: '-0.012em',
  margin: 0,
};

const NUM: CSSProperties = {
  ...DISPLAY,
  fontVariantNumeric: 'tabular-nums',
  letterSpacing: '-0.015em',
};

const LABEL: CSSProperties = {
  fontFamily: 'var(--osd-font-body)',
  fontSize: 20,
  fontWeight: 600,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  lineHeight: 1.2,
};

const BODY: CSSProperties = {
  fontFamily: 'var(--osd-font-body)',
  fontSize: 30,
  fontWeight: 500,
  lineHeight: 1.4,
  margin: 0,
};

const abs = (left: number, top: number, extra?: CSSProperties): CSSProperties => ({
  position: 'absolute',
  left,
  top,
  ...extra,
});

const pad = (n: number) => String(n).padStart(2, '0');

type Pt = [number, number];

const bez = (p: Pt[], t: number): Pt => {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [
    a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0],
    a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1],
  ];
};

const bezTan = (p: Pt[], t: number): Pt => {
  const u = 1 - t;
  return [
    3 * u * u * (p[1][0] - p[0][0]) +
      6 * u * t * (p[2][0] - p[1][0]) +
      3 * t * t * (p[3][0] - p[2][0]),
    3 * u * u * (p[1][1] - p[0][1]) +
      6 * u * t * (p[2][1] - p[1][1]) +
      3 * t * t * (p[3][1] - p[2][1]),
  ];
};

const svgId = (raw: string) => raw.replace(/[^a-zA-Z0-9]/g, '');

const Mark = ({ color, h = 34 }: { color: string; h?: number }) => (
  <div style={{ display: 'flex', gap: h * 0.16 }}>
    <div style={{ width: h * 0.3, height: h, background: color, transform: SKEW }} />
    <div style={{ width: h * 0.3, height: h, background: color, transform: SKEW, opacity: 0.7 }} />
    <div style={{ width: h * 0.3, height: h, background: color, transform: SKEW, opacity: 0.4 }} />
  </div>
);

const Wordmark = ({
  x,
  y,
  color = 'var(--osd-text)',
  mark = 'var(--osd-accent)',
}: {
  x: number;
  y: number;
  color?: string;
  mark?: string;
}) => (
  <div style={abs(x, y, { display: 'flex', alignItems: 'center', gap: 18, zIndex: 4 })}>
    <Mark color={mark} />
    <span style={{ ...DISPLAY, fontSize: 46, letterSpacing: '0.02em', color, lineHeight: 1 }}>
      Ostra
    </span>
  </div>
);

const Bib = ({ tone }: { tone: Tone }) => {
  const { current, total } = useSlidePageNumber();
  const t = TONES[tone];
  return (
    <div
      style={{
        ...LABEL,
        position: 'absolute',
        left: 120,
        right: 120,
        top: 1004,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        fontSize: 17,
        color: t.dim,
        zIndex: 5,
      }}
    >
      <span
        style={{
          ...NUM,
          width: 64,
          height: 32,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: t.hi,
          color: t.hiFg,
          clipPath: cut(32),
          fontSize: 24,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: 0,
        }}
      >
        {pad(current)}
      </span>
      <span style={{ fontVariantNumeric: 'tabular-nums', marginLeft: -8 }}>/ {pad(total)}</span>
      <span style={{ color: t.fg, marginLeft: 14 }}>Ostra</span>
      <span>AERO 3 上市策略</span>
      <span style={{ marginLeft: 'auto' }}>2027 春季 · 機密</span>
    </div>
  );
};

const Stage = ({
  tone = 'uv',
  footer = true,
  children,
}: {
  tone?: Tone;
  footer?: boolean;
  children: ReactNode;
}) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      isolation: 'isolate',
      background: TONES[tone].bg,
      color: TONES[tone].fg,
      fontFamily: 'var(--osd-font-body)',
    }}
  >
    {children}
    {footer && <Bib tone={tone} />}
  </div>
);

const Kicker = ({
  tag,
  children,
  tone = 'uv',
  x = 120,
  y = 104,
}: {
  tag: string;
  children: ReactNode;
  tone?: Tone;
  x?: number;
  y?: number;
}) => {
  const t = TONES[tone];
  return (
    <div
      style={abs(x, y, { ...LABEL, display: 'flex', alignItems: 'center', gap: 18, color: t.fg })}
    >
      <span
        style={{
          ...LABEL,
          height: 32,
          padding: '0 18px',
          display: 'inline-flex',
          alignItems: 'center',
          background: t.hi,
          color: t.hiFg,
          clipPath: cut(32),
          fontWeight: 700,
          fontSize: 17,
        }}
      >
        {tag}
      </span>
      {children}
    </div>
  );
};

const Streak = ({
  y,
  h,
  tile,
  dash,
  color,
  dur,
  shift = 0,
  live,
}: {
  y: number;
  h: number;
  tile: number;
  dash: number;
  color: string;
  dur: number;
  shift?: number;
  live: boolean;
}) => (
  <div
    style={{
      position: 'absolute',
      left: -80,
      top: y,
      width: 2080,
      height: h,
      overflow: 'hidden',
      transform: SKEW,
    }}
  >
    <div
      style={
        {
          '--tile': `${tile}px`,
          width: 2080 + tile,
          height: h,
          backgroundImage: `linear-gradient(90deg, ${color} 0 ${dash}px, transparent ${dash}px)`,
          backgroundSize: `${tile}px ${h}px`,
          backgroundRepeat: 'repeat-x',
          backgroundPosition: `${shift}px 0`,
          animation: live ? `ae-run ${dur}s linear infinite` : undefined,
        } as CSSProperties
      }
    />
  </div>
);

const WHITE_A = (a: number) => `rgba(255,255,255,${a})`;
const INK_A = (a: number) => `rgba(11,10,20,${a})`;

const VoltBand = ({ x, y, w }: { x: number; y: number; w: number }) => (
  <MorphElement id="volt-band">
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: w / BAND_RATIO,
        background: 'var(--osd-accent)',
        clipPath: BAND_CLIP,
      }}
    />
  </MorphElement>
);

const SpecChip = ({ children }: { children: ReactNode }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 22 }}>
    <span style={{ width: 4, height: 22, background: 'var(--osd-accent)', transform: SKEW }} />
    {children}
  </span>
);

const Cover: Page = () => {
  const live = useIsActivePage();
  const enter = (delay: number): CSSProperties =>
    live ? { animation: `ae-in 0.8s ${SNAP} ${delay}s both` } : {};
  return (
    <Stage footer={false}>
      <Streak y={152} h={6} tile={560} dash={300} color={DEEP} dur={2.6} live={live} />
      <Streak
        y={184}
        h={2}
        tile={380}
        dash={140}
        color={WHITE_A(0.3)}
        dur={1.7}
        shift={-90}
        live={live}
      />
      <Streak
        y={236}
        h={16}
        tile={920}
        dash={560}
        color={DEEP}
        dur={3.4}
        shift={-300}
        live={live}
      />
      <Streak
        y={310}
        h={3}
        tile={460}
        dash={180}
        color={WHITE_A(0.22)}
        dur={2.1}
        shift={-200}
        live={live}
      />
      <Streak
        y={372}
        h={28}
        tile={1180}
        dash={720}
        color={DEEP}
        dur={4.2}
        shift={-520}
        live={live}
      />
      <Streak
        y={462}
        h={3}
        tile={340}
        dash={120}
        color={WHITE_A(0.3)}
        dur={1.5}
        shift={-40}
        live={live}
      />
      <Streak y={512} h={10} tile={760} dash={380} color={DEEP} dur={3} shift={-610} live={live} />
      <Streak
        y={590}
        h={2}
        tile={300}
        dash={90}
        color={WHITE_A(0.36)}
        dur={1.3}
        shift={-150}
        live={live}
      />
      <Streak
        y={628}
        h={20}
        tile={980}
        dash={520}
        color={DEEP}
        dur={3.8}
        shift={-120}
        live={live}
      />
      <Streak y={880} h={8} tile={640} dash={260} color={DEEP} dur={2.4} shift={-330} live={live} />
      <Streak
        y={958}
        h={14}
        tile={840}
        dash={420}
        color={DEEP}
        dur={3.2}
        shift={-700}
        live={live}
      />

      <Wordmark x={120} y={92} />
      <div style={abs(1100, 104, { ...LABEL, width: 700, textAlign: 'right', color: LAV })}>
        通路夥伴與經營團隊
      </div>

      <h1
        style={{
          ...DISPLAY,
          ...abs(96, 156),
          fontSize: 'var(--osd-size-hero)',
          lineHeight: 0.8,
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap',
          ...enter(0.05),
        }}
      >
        AERO <span style={{ color: 'var(--osd-accent)' }}>3</span>
      </h1>

      <VoltBand x={60} y={700} w={1800} />
      <div
        style={abs(196, 700, {
          height: 150,
          width: 1528,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: INK,
          ...enter(0.18),
        })}
      >
        <span style={{ ...DISPLAY, fontSize: 92, lineHeight: 1 }}>上市策略</span>
        <Mark color={INK} h={64} />
        <span style={{ ...NUM, fontSize: 92, lineHeight: 1 }}>2027 春季</span>
      </div>

      <div
        style={abs(120, 920, {
          ...LABEL,
          fontSize: 22,
          display: 'flex',
          gap: 40,
          color: 'var(--osd-text)',
          fontVariantNumeric: 'tabular-nums',
        })}
      >
        <span>168 g</span>
        <SpecChip>39 / 31 mm 堆疊高度</SpecChip>
        <SpecChip>全長碳纖維板</SpecChip>
        <SpecChip>€260</SpecChip>
      </div>
      <div style={abs(1380, 896, { width: 420, textAlign: 'right' })}>
        <div style={{ ...LABEL, fontSize: 17, color: LAV }}>全面開賣</div>
        <div style={{ ...NUM, fontSize: 64, fontWeight: 800, marginTop: 6 }}>09·04·27</div>
      </div>
    </Stage>
  );
};

const ShareBar = ({ y, w, color }: { y: number; w: number; color: string }) => (
  <div
    style={{
      position: 'absolute',
      left: 300,
      top: y,
      width: w,
      height: 115,
      background: color,
      clipPath: cut(115),
    }}
  />
);

const Race: Page = () => {
  const live = useIsActivePage();
  const land: CSSProperties = live
    ? { animation: `ae-fade 0.45s ease-out ${MORPH_MS}ms both` }
    : {};
  return (
    <Stage>
      <Kicker tag="市場">我們身處的這場競賽</Kicker>

      <div style={abs(120, 176)}>
        <div style={{ ...NUM, fontSize: 300 }}>3.4×</div>
        <p style={{ ...BODY, marginTop: 26, color: LAV, width: 560 }}>
          自2022年起，超級跑鞋品類的成長倍數。
        </p>
      </div>
      <div
        style={abs(830, 176, {
          width: 6,
          height: 300,
          background: 'var(--osd-accent)',
          transform: SKEW,
          transformOrigin: '0 100%',
        })}
      />
      <div style={abs(980, 176)}>
        <div style={{ ...NUM, fontSize: 300 }}>€2.9B</div>
        <p style={{ ...BODY, marginTop: 26, color: LAV, width: 640 }}>
          2026年全球零售規模，仍在加速成長。
        </p>
      </div>

      <div style={abs(120, 604, { ...LABEL, color: LAV })}>Ostra 品類市佔率</div>

      <div style={abs(120, 650, { height: 115, display: 'flex', alignItems: 'center' })}>
        <div>
          <div style={{ ...NUM, fontSize: 52, fontWeight: 800 }}>2026</div>
          <div style={{ ...LABEL, fontSize: 15, color: LAV, marginTop: 4 }}>現況</div>
        </div>
      </div>
      <ShareBar y={650} w={753} color={DEEP} />
      <div style={abs(1088, 650, { height: 115, display: 'flex', alignItems: 'center' })}>
        <span style={{ ...NUM, fontSize: 104 }}>6%</span>
      </div>

      <div style={abs(120, 795, { height: 115, display: 'flex', alignItems: 'center' })}>
        <div>
          <div style={{ ...NUM, fontSize: 52, fontWeight: 800, color: 'var(--osd-accent)' }}>
            2027
          </div>
          <div style={{ ...LABEL, fontSize: 15, color: LAV, marginTop: 4 }}>目標</div>
        </div>
      </div>
      <VoltBand x={300} y={795} w={1380} />
      <div
        style={abs(340, 795, {
          height: 115,
          width: 1290,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: INK,
          ...land,
        })}
      >
        <span style={{ ...LABEL, fontSize: 18, fontWeight: 700 }}>+5 個百分點 · 2027年底</span>
        <span style={{ ...NUM, fontSize: 104 }}>11%</span>
      </div>
    </Stage>
  );
};

const HIST = { slot: 80, w: 56, base: 380, k: 44 };

const HistBar = ({ i, v, hot = false }: { i: number; v: number; hot?: boolean }) => {
  const x = i * HIST.slot + 12;
  const h = v * HIST.k;
  const d = h * T;
  return (
    <polygon
      points={`${x},${HIST.base} ${x + HIST.w},${HIST.base} ${x + HIST.w + d},${HIST.base - h} ${x + d},${HIST.base - h}`}
      style={{ fill: hot ? 'var(--osd-accent)' : WHITE_A(0.26) }}
    />
  );
};

const HistTick = ({ i, label, end = false }: { i: number; label: string; end?: boolean }) => (
  <text
    x={end ? i * HIST.slot : i * HIST.slot + 12}
    y={HIST.base + 40}
    textAnchor={end ? 'end' : 'start'}
    style={{
      fill: LAV,
      fontSize: 22,
      fontWeight: 600,
      fontFamily: 'var(--osd-font-body)',
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '0.04em',
    }}
  >
    {label}
  </text>
);

const Runner: Page = () => (
  <Stage>
    <Kicker tag="跑者">目標客群</Kicker>
    <h2 style={{ ...DISPLAY, ...abs(116, 168), fontSize: 128, lineHeight: 1.06 }}>
      破 3:30 的跑者
      <br />
      就是主力市場。
    </h2>
    <div style={abs(1240, 168, { width: 560 })}>
      <div style={{ ...NUM, fontSize: 220, color: 'var(--osd-accent)' }}>2.1M</div>
      <p style={{ ...BODY, fontSize: 26, color: LAV, marginTop: 20 }}>
        近 36 個月內全馬完賽時間破 3:30 的全球跑者。
      </p>
    </div>

    <svg
      width={1680}
      height={440}
      viewBox="0 0 1680 440"
      style={abs(120, 486, { overflow: 'visible' })}
      role="img"
      aria-label="馬拉松完賽時間分布，破 3:30 的區間以強調色標示"
    >
      <HistBar i={0} v={0.3} hot />
      <HistBar i={1} v={0.6} hot />
      <HistBar i={2} v={1.2} hot />
      <HistBar i={3} v={2.4} hot />
      <HistBar i={4} v={3.0} hot />
      <HistBar i={5} v={3.9} hot />
      <HistBar i={6} v={4.8} />
      <HistBar i={7} v={5.6} />
      <HistBar i={8} v={6.9} />
      <HistBar i={9} v={7.6} />
      <HistBar i={10} v={7.8} />
      <HistBar i={11} v={7.6} />
      <HistBar i={12} v={7.2} />
      <HistBar i={13} v={6.6} />
      <HistBar i={14} v={6.0} />
      <HistBar i={15} v={5.3} />
      <HistBar i={16} v={4.6} />
      <HistBar i={17} v={3.9} />
      <HistBar i={18} v={3.3} />
      <HistBar i={19} v={2.7} />
      <HistBar i={20} v={2.2} />
      <line
        x1={0}
        x2={1680}
        y1={HIST.base}
        y2={HIST.base}
        style={{ stroke: '#FFFFFF', strokeWidth: 2 }}
      />

      <line
        x1={956}
        x2={956 + 380 * T}
        y1={HIST.base}
        y2={HIST.base - 380}
        style={{ stroke: '#FFFFFF', strokeWidth: 2, strokeDasharray: '6 8' }}
      />
      <text
        x={956 + 380 * T - 14}
        y={HIST.base - 366}
        textAnchor="end"
        style={{
          fill: '#FFFFFF',
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: '0.18em',
          fontFamily: 'var(--osd-font-body)',
        }}
      >
        中位數 4:28
      </text>

      <path
        d={`M12,${HIST.base - 196} L12,${HIST.base - 214} L${5 * HIST.slot + 12 + HIST.w + 40},${HIST.base - 214} L${5 * HIST.slot + 12 + HIST.w + 40},${HIST.base - 196}`}
        style={{ fill: 'none', stroke: 'var(--osd-accent)', strokeWidth: 3 }}
      />
      <text
        x={12}
        y={HIST.base - 236}
        style={{
          fill: 'var(--osd-accent)',
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: '0.18em',
          fontFamily: 'var(--osd-font-body)',
        }}
      >
        目標 · 2:30–3:29
      </text>
      <text
        x={12}
        y={HIST.base - 268}
        style={{
          fill: 'var(--osd-accent)',
          fontSize: 56,
          fontWeight: 900,
          fontStyle: 'italic',
          fontFamily: 'var(--osd-font-display)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        佔完賽者 11.4%
      </text>

      <HistTick i={0} label="2:30" />
      <HistTick i={3} label="3:00" />
      <HistTick i={6} label="3:30" />
      <HistTick i={9} label="4:00" />
      <HistTick i={12} label="4:30" />
      <HistTick i={15} label="5:00" />
      <HistTick i={18} label="5:30" />
      <HistTick i={21} label="6:00" end />
      <text
        x={1680}
        y={HIST.base - 200}
        textAnchor="end"
        style={{
          fill: LAV,
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: '0.16em',
          fontFamily: 'var(--osd-font-body)',
        }}
      >
        完賽時間 · 每 10 分鐘一組
      </text>
    </svg>
  </Stage>
);

const SHOE = {
  midsole:
    'M140,288 C200,281 300,281 380,285 C600,296 800,306 960,314 C1100,320 1210,328 1278,334 C1310,337 1328,350 1318,362 C1290,374 1240,390 1180,405 C1080,430 960,440 840,440 L245,440 C205,440 175,432 160,412 C146,392 136,340 140,288 Z',
  bottom:
    'M1318,362 C1290,374 1240,390 1180,405 C1080,430 960,440 840,440 L245,440 C205,440 175,432 160,412',
  plate: 'M146,366 C300,370 520,392 700,400 C860,407 1000,402 1120,386 C1200,375 1262,358 1340,330',
  above:
    'M0,0 L0,366 L146,366 C300,370 520,392 700,400 C860,407 1000,402 1120,386 C1200,375 1262,358 1340,330 L1440,300 L1440,0 Z',
  upper:
    'M146,292 C128,236 120,130 140,62 C146,44 160,36 178,38 C214,42 250,74 292,96 C318,108 350,106 374,90 C398,72 418,40 446,26 C462,16 476,18 488,34 C520,64 700,140 860,170 C1000,192 1110,206 1190,218 C1262,230 1312,276 1306,336 L1280,352 L150,334 Z',
  counter:
    'M146,292 C128,236 120,130 140,62 C146,44 160,36 178,38 C200,40 222,52 240,64 C244,150 262,232 306,286 Z',
  collar: 'M182,52 C216,56 252,86 292,108 C318,120 350,118 374,102',
  toecap: 'M1124,210 C1168,228 1196,284 1198,330',
  heelTab: 'M146,58 C128,34 132,10 154,6 C172,4 180,20 178,38',
};

const INSTEP: Pt[] = [
  [488, 34],
  [520, 64],
  [700, 140],
  [860, 170],
];
const ROCKER: Pt[] = [
  [1180, 405],
  [1080, 430],
  [960, 440],
  [840, 440],
];

const EYELETS = [0.2, 0.36, 0.52, 0.68, 0.84].map((t) => {
  const [x, y] = bez(INSTEP, t);
  const [dx, dy] = bezTan(INSTEP, t);
  const len = Math.hypot(dx, dy);
  const nx = -dy / len;
  const ny = dx / len;
  const [lx, ly] = bez(INSTEP, t + 0.07);
  return { x: x + nx * 24, y: y + ny * 24, lx, ly };
});

const LUG_W = 15;
const LUG_H = 7;
const LUG_POLY = `0,0 ${LUG_W},0 ${LUG_W - LUG_H * T},${LUG_H} ${-LUG_H * T},${LUG_H}`;
const LUGS: { x: number; y: number; a: number }[] = [
  ...[0.12, 0.26, 0.4, 0.54, 0.68, 0.82].map((t) => {
    const [x, y] = bez(ROCKER, t);
    const [dx, dy] = bezTan(ROCKER, t);
    return { x, y, a: (Math.atan2(-dy, -dx) * 180) / Math.PI };
  }),
  ...[836, 808, 780, 752, 724, 696, 668].map((x) => ({ x: x - LUG_W, y: 440, a: 0 })),
  ...[408, 380, 352, 324, 296, 268].map((x) => ({ x: x - LUG_W, y: 440, a: 0 })),
];

const Marker = ({ x, y, n }: { x: number; y: number; n: string }) => (
  <g transform={`translate(${x - 22}, ${y - 15})`}>
    <polygon points={`${30 * T},0 44,0 ${44 - 30 * T},30 0,30`} style={{ fill: INK }} />
    <text
      x={22}
      y={23}
      textAnchor="middle"
      style={{
        fill: 'var(--osd-accent)',
        fontSize: 21,
        fontWeight: 800,
        fontStyle: 'italic',
        fontFamily: 'var(--osd-font-display)',
      }}
    >
      {n}
    </text>
  </g>
);

const DimTick = ({ x, y }: { x: number; y: number }) => (
  <line
    x1={x - 9 + 9 * T}
    x2={x + 9 - 9 * T}
    y1={y - 9}
    y2={y + 9}
    style={{ stroke: '#FFFFFF', strokeWidth: 2.5 }}
  />
);

const Shoe = () => {
  const uid = svgId(useId());
  const mid = `${uid}-mid`;
  const above = `${uid}-above`;
  const outs = `${uid}-outs`;
  const upper = `${uid}-upper`;
  const mesh = `${uid}-mesh`;
  return (
    <svg
      width={1440}
      height={490}
      viewBox="0 -10 1440 490"
      style={{ display: 'block', overflow: 'visible' }}
      role="img"
      aria-label="AERO 3 側面輪廓與中底剖面圖"
    >
      <defs>
        <clipPath id={mid}>
          <path d={SHOE.midsole} />
        </clipPath>
        <clipPath id={above}>
          <path d={SHOE.above} />
        </clipPath>
        <clipPath id={outs}>
          <rect x={0} y={0} width={444} height={480} />
          <rect x={650} y={0} width={790} height={480} />
        </clipPath>
        <clipPath id={upper}>
          <path d={SHOE.upper} />
        </clipPath>
        <pattern
          id={mesh}
          width={11}
          height={11}
          patternUnits="userSpaceOnUse"
          patternTransform={`skewX(-${ANGLE})`}
        >
          <line x1={2} x2={2} y1={0} y2={11} style={{ stroke: WHITE_A(0.16), strokeWidth: 1.5 }} />
        </pattern>
      </defs>

      <line x1={20} x2={1420} y1={447} y2={447} style={{ stroke: WHITE_A(0.4), strokeWidth: 2 }} />

      <path d={SHOE.upper} style={{ fill: WHITE_A(0.1) }} />
      <rect
        x={0}
        y={-10}
        width={1440}
        height={490}
        clipPath={`url(#${upper})`}
        fill={`url(#${mesh})`}
      />
      <path d={SHOE.counter} style={{ fill: DEEP, stroke: '#FFFFFF', strokeWidth: 2 }} />
      <path
        d={SHOE.heelTab}
        style={{
          fill: 'none',
          stroke: 'var(--osd-accent)',
          strokeWidth: 6,
          strokeLinecap: 'round',
        }}
      />
      <path d={SHOE.collar} style={{ fill: 'none', stroke: WHITE_A(0.55), strokeWidth: 2 }} />
      <path d={SHOE.toecap} style={{ fill: 'none', stroke: WHITE_A(0.55), strokeWidth: 2 }} />
      <g transform="translate(610, 196)" style={{ fill: '#FFFFFF' }}>
        <polygon points={`${46 * T},0 ${46 * T + 14},0 14,46 0,46`} />
        <polygon points={`${46 * T + 24},0 ${46 * T + 38},0 38,46 24,46`} opacity={0.7} />
        <polygon points={`${46 * T + 48},0 ${46 * T + 62},0 62,46 48,46`} opacity={0.4} />
      </g>
      {EYELETS.map((e) => (
        <g key={e.x}>
          <line
            x1={e.x}
            y1={e.y}
            x2={e.lx}
            y2={e.ly}
            style={{ stroke: '#FFFFFF', strokeWidth: 4, strokeLinecap: 'round' }}
          />
          <circle
            cx={e.x}
            cy={e.y}
            r={6}
            style={{ fill: DEEP, stroke: '#FFFFFF', strokeWidth: 2 }}
          />
        </g>
      ))}
      <path
        d={SHOE.upper}
        style={{ fill: 'none', stroke: '#FFFFFF', strokeWidth: 3, strokeLinejoin: 'round' }}
      />

      <path d={SHOE.midsole} style={{ fill: FOAM_LOW }} />
      <g clipPath={`url(#${mid})`}>
        <path d={SHOE.midsole} clipPath={`url(#${above})`} style={{ fill: '#FFFFFF' }} />
        <g clipPath={`url(#${outs})`}>
          <path d={SHOE.bottom} style={{ fill: 'none', stroke: INK, strokeWidth: 22 }} />
        </g>
        <path d={SHOE.plate} style={{ fill: 'none', stroke: INK, strokeWidth: 12 }} />
        <path
          d={SHOE.plate}
          style={{ fill: 'none', stroke: 'var(--osd-accent)', strokeWidth: 7 }}
        />
        <text
          x={520}
          y={350}
          style={{
            fill: 'var(--osd-bg)',
            fontSize: 40,
            fontWeight: 900,
            fontStyle: 'italic',
            letterSpacing: '0.04em',
            fontFamily: 'var(--osd-font-display)',
            opacity: 0.9,
          }}
        >
          LIFT
        </text>
      </g>
      <path d={SHOE.midsole} style={{ fill: 'none', stroke: INK, strokeWidth: 2.5 }} />
      {LUGS.map((l) => (
        <polygon
          key={`${l.x}-${l.y}`}
          points={LUG_POLY}
          transform={`translate(${l.x}, ${l.y}) rotate(${l.a})`}
          style={{ fill: INK }}
        />
      ))}

      <line
        x1={56}
        x2={128}
        y1={283}
        y2={283}
        style={{ stroke: WHITE_A(0.7), strokeWidth: 1.5, strokeDasharray: '4 5' }}
      />
      <line x1={72} x2={72} y1={283} y2={440} style={{ stroke: '#FFFFFF', strokeWidth: 2 }} />
      <DimTick x={72} y={283} />
      <DimTick x={72} y={440} />

      <line
        x1={250}
        x2={1410}
        y1={283}
        y2={283}
        style={{ stroke: WHITE_A(0.4), strokeWidth: 1.5, strokeDasharray: '4 5' }}
      />
      <line
        x1={1394}
        x2={1394}
        y1={283}
        y2={314}
        style={{ stroke: 'var(--osd-accent)', strokeWidth: 2 }}
      />
      <line
        x1={962}
        x2={1410}
        y1={314}
        y2={314}
        style={{ stroke: WHITE_A(0.7), strokeWidth: 1.5, strokeDasharray: '4 5' }}
      />
      <line x1={1394} x2={1394} y1={314} y2={440} style={{ stroke: '#FFFFFF', strokeWidth: 2 }} />
      <DimTick x={1394} y={314} />
      <DimTick x={1394} y={440} />
      <circle cx={962} cy={314} r={5} style={{ fill: '#FFFFFF', stroke: INK, strokeWidth: 2 }} />
      <circle cx={250} cy={283} r={5} style={{ fill: '#FFFFFF', stroke: INK, strokeWidth: 2 }} />

      <Marker x={430} y={326} n="1" />
      <Marker x={760} y={403} n="2" />
      <Marker x={560} y={420} n="3" />
      <Marker x={300} y={432} n="4" />
    </svg>
  );
};

const LegendItem = ({ n, title, sub }: { n: string; title: string; sub: string }) => (
  <div style={{ display: 'flex', gap: 16, width: 400 }}>
    <span
      style={{
        ...NUM,
        width: 44,
        height: 30,
        flex: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--osd-accent)',
        color: INK,
        clipPath: cut(30),
        fontSize: 21,
        fontWeight: 800,
        lineHeight: 1,
      }}
    >
      {n}
    </span>
    <div>
      <div style={{ ...LABEL, fontSize: 20, fontWeight: 700, color: '#FFFFFF' }}>{title}</div>
      <div style={{ ...BODY, fontSize: 22, color: LAV, marginTop: 6 }}>{sub}</div>
    </div>
  </div>
);

const Product: Page = () => (
  <Stage>
    <Kicker tag="產品">這雙鞋</Kicker>
    <h2 style={{ ...DISPLAY, ...abs(116, 160), fontSize: 120 }}>為滾動推進而生。</h2>
    <div style={abs(1440, 120, { width: 360, textAlign: 'right' })}>
      <div style={{ ...NUM, fontSize: 200, color: 'var(--osd-accent)' }}>168</div>
      <div style={{ ...LABEL, marginTop: 10 }}>公克 · US M9</div>
    </div>

    <div style={abs(240, 280)}>
      <Shoe />
    </div>

    <div style={abs(120, 604, { width: 170, textAlign: 'right' })}>
      <div style={{ ...NUM, fontSize: 84 }}>39</div>
      <div style={{ ...LABEL, fontSize: 16, marginTop: 6, color: LAV }}>mm 後跟</div>
    </div>
    <div style={abs(1656, 630, { width: 160 })}>
      <div style={{ ...NUM, fontSize: 84 }}>31</div>
      <div style={{ ...LABEL, fontSize: 16, marginTop: 6, color: LAV }}>mm 前掌</div>
    </div>
    <div style={abs(1656, 566, { width: 200, display: 'flex', alignItems: 'baseline', gap: 10 })}>
      <span style={{ ...NUM, fontSize: 40, color: 'var(--osd-accent)' }}>8 mm</span>
      <span style={{ ...LABEL, fontSize: 16, color: LAV }}>落差</span>
    </div>

    <div style={abs(120, 806, { display: 'flex', gap: 24 })}>
      <LegendItem n="1" title="PEBA Lift 泡棉" sub="頂層 · 87% 能量回饋" />
      <LegendItem n="2" title="碳纖維板" sub="全長設計，湯匙形鞋頭" />
      <LegendItem n="3" title="承載泡棉" sub="較硬的底層，穩定後跟" />
      <LegendItem n="4" title="大底" sub="1.5 mm 橡膠，前掌與後跟" />
    </div>
  </Stage>
);

const LabBar = ({
  name,
  w,
  value,
  fill,
  bold = false,
}: {
  name: string;
  w: number;
  value: string;
  fill: string;
  bold?: boolean;
}) => (
  <div style={{ display: 'flex', alignItems: 'center', height: 44 }}>
    <div style={{ ...LABEL, fontSize: 17, width: 210, color: bold ? INK : INK_A(0.66) }}>
      {name}
    </div>
    <div style={{ width: w, height: 44, background: fill, clipPath: cut(44) }} />
    <div
      style={{
        ...NUM,
        fontSize: 40,
        fontWeight: bold ? 900 : 700,
        marginLeft: 18,
        color: bold ? INK : INK_A(0.66),
      }}
    >
      {value}
    </div>
  </div>
);

const LabRow = ({
  y,
  metric,
  value,
  caption,
  children,
}: {
  y: number;
  metric: string;
  value: string;
  caption: string;
  children: ReactNode;
}) => (
  <div style={abs(120, y, { width: 1680, height: 196 })}>
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: -14,
        height: 2,
        background: INK,
      }}
    />
    <div style={{ ...LABEL, fontSize: 18, fontWeight: 700, marginTop: 8 }}>{metric}</div>
    <div style={{ ...NUM, fontSize: 132, marginTop: 10 }}>{value}</div>
    <div style={{ ...BODY, fontSize: 22, color: INK_A(0.7), marginTop: 6 }}>{caption}</div>
    <div
      style={{
        position: 'absolute',
        left: 640,
        top: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {children}
    </div>
  </div>
);

const Lab: Page = () => (
  <Stage tone="volt">
    <Kicker tag="實驗室" tone="volt">
      實驗室數據
    </Kicker>
    <h2 style={{ ...DISPLAY, ...abs(116, 156), fontSize: 88, color: INK }}>
      實驗室數據證明：更快。
    </h2>
    <div
      style={abs(1210, 166, {
        display: 'flex',
        gap: 28,
        ...LABEL,
        fontSize: 16,
        fontWeight: 700,
        color: INK,
      })}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 30, height: 16, background: 'var(--osd-bg)', clipPath: cut(16) }} />
        AERO 3
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 30, height: 16, background: INK, clipPath: cut(16) }} />
        AERO 2
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 30, height: 16, background: INK_A(0.24), clipPath: cut(16) }} />
        品類平均
      </span>
    </div>

    <LabRow y={300} metric="跑步經濟性" value="+4.1%" caption="相同配速下，耗氧量比 AERO 2 更低">
      <LabBar name="AERO 3" w={655} value="6.9%" fill="var(--osd-bg)" bold />
      <LabBar name="AERO 2" w={266} value="2.8%" fill={INK} />
      <LabBar name="品類平均" w={380} value="4.0%" fill={INK_A(0.24)} />
    </LabRow>
    <LabRow y={524} metric="能量回饋" value="87%" caption="泡棉回彈率，ASTM F1976 衝擊測試">
      <LabBar name="AERO 3" w={661} value="87%" fill="var(--osd-bg)" bold />
      <LabBar name="AERO 2" w={600} value="79%" fill={INK} />
      <LabBar name="品類平均" w={616} value="81%" fill={INK_A(0.24)} />
    </LabRow>
    <LabRow y={748} metric="重量" value="168 g" caption="比 AERO 2 輕 31 g，US M9">
      <LabBar name="AERO 3" w={580} value="168 g" fill="var(--osd-bg)" bold />
      <LabBar name="AERO 2" w={687} value="199 g" fill={INK} />
      <LabBar name="品類平均" w={663} value="192 g" fill={INK_A(0.24)} />
    </LabRow>

    <div
      style={abs(760, 962, {
        ...BODY,
        fontSize: 16,
        color: INK_A(0.66),
        width: 1040,
        textAlign: 'right',
        lineHeight: 1.3,
      })}
    >
      {
        'Ostra Lab Porto · n = 24 位全馬破 3:15 跑者 · 跑步機，16 km/h · 隨機交叉試驗 · 2026年8月。跑步經濟性以相對於無碳板對照鞋的進步幅度表示。'
      }
    </div>
  </Stage>
);

const SplitCell = ({
  label,
  time,
  last = false,
}: {
  label: string;
  time: string;
  last?: boolean;
}) => (
  <div style={{ position: 'relative', width: 280, height: 116, paddingLeft: 30 }}>
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 3,
        height: 116,
        background: last ? 'var(--osd-accent)' : WHITE_A(0.3),
        transform: SKEW,
        transformOrigin: '0 100%',
      }}
    />
    <div
      style={{
        ...LABEL,
        fontSize: 17,
        color: last ? 'var(--osd-accent)' : WHITE_A(0.6),
        marginTop: 12,
      }}
    >
      {label}
    </div>
    <div
      style={{
        ...NUM,
        fontSize: 66,
        fontWeight: 800,
        marginTop: 12,
        color: last ? 'var(--osd-accent)' : '#FFFFFF',
      }}
    >
      {time}
    </div>
  </div>
);

const CountryChip = ({ code }: { code: string }) => (
  <span
    style={{
      ...LABEL,
      fontSize: 18,
      fontWeight: 700,
      letterSpacing: '0.14em',
      height: 34,
      padding: '0 16px',
      display: 'inline-flex',
      alignItems: 'center',
      background: WHITE_A(0.12),
      clipPath: cut(34),
    }}
  >
    {code}
  </span>
);

const Proof: Page = () => (
  <Stage tone="ink">
    <Kicker tag="賽事" tone="ink">
      實戰驗證
    </Kicker>
    <div style={abs(120, 176, { ...LABEL, color: WHITE_A(0.6) })}>
      Valencia Marathon · 2026年12月6日
    </div>
    <div style={{ ...NUM, ...abs(110, 214), fontSize: 300, color: 'var(--osd-accent)' }}>
      2:04:17
    </div>
    <div style={abs(1340, 228, { width: 460 })}>
      <span
        style={{
          ...DISPLAY,
          fontSize: 64,
          display: 'inline-flex',
          alignItems: 'center',
          height: 76,
          padding: '0 30px',
          background: CORAL,
          color: INK,
          clipPath: cut(76),
          lineHeight: 1,
        }}
      >
        第 1 名
      </span>
      <div style={{ ...DISPLAY, fontSize: 48, marginTop: 26 }}>E. Kimani · KEN</div>
      <div style={{ ...BODY, fontSize: 24, color: WHITE_A(0.6), marginTop: 12 }}>
        後半程更快（negative split）。後半馬 1:02:08。
      </div>
    </div>

    <div
      style={abs(120, 548, {
        width: 1680,
        display: 'flex',
        borderTop: `2px solid ${WHITE_A(0.2)}`,
        borderBottom: `2px solid ${WHITE_A(0.2)}`,
        paddingTop: 10,
        paddingBottom: 10,
      })}
    >
      <SplitCell label="5 km" time="14:42" />
      <SplitCell label="10 km" time="29:25" />
      <SplitCell label="半程" time="1:02:09" />
      <SplitCell label="30 km" time="1:28:20" />
      <SplitCell label="40 km" time="1:57:50" />
      <SplitCell label="終點" time="2:04:17" last />
    </div>

    <div style={abs(120, 744, { width: 760 })}>
      <div style={{ ...LABEL, color: WHITE_A(0.6) }}>Berlin Marathon · 2026年9月27日</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 30, marginTop: 18 }}>
        <span style={{ ...NUM, fontSize: 128 }}>2:03:51</span>
        <span style={{ ...DISPLAY, fontSize: 56, color: 'var(--osd-accent)' }}>第 3 名</span>
      </div>
      <div style={{ ...BODY, fontSize: 24, color: WHITE_A(0.6), marginTop: 14 }}>
        J. Tefera · ETH · AERO 3 原型款
      </div>
    </div>
    <div style={abs(1000, 744, { width: 800, display: 'flex', gap: 34 })}>
      <div style={{ ...NUM, fontSize: 236, color: CORAL, marginTop: -10 }}>6</div>
      <div>
        <div style={{ ...DISPLAY, fontSize: 64, lineHeight: 1.05 }}>
          國家
          <br />
          紀錄
        </div>
        <div style={{ ...BODY, fontSize: 22, color: WHITE_A(0.6), marginTop: 12 }}>
          2026年穿著 AERO 3 原型款締造
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <CountryChip code="POR" />
          <CountryChip code="ESP" />
          <CountryChip code="NOR" />
          <CountryChip code="MEX" />
          <CountryChip code="IRL" />
          <CountryChip code="NZL" />
        </div>
      </div>
    </div>
  </Stage>
);

const TRACK = { cx: 1420, cy: 560, r0: 300, lane: 44 };
const lanePath = (r: number) =>
  `M-60,${TRACK.cy + r} L${TRACK.cx},${TRACK.cy + r} A${r},${r} 0 1 0 ${TRACK.cx},${TRACK.cy - r} L-60,${TRACK.cy - r}`;

const LaneLine = ({ i }: { i: number }) => (
  <path
    d={lanePath(TRACK.r0 + i * TRACK.lane)}
    style={{ fill: 'none', stroke: WHITE_A(0.3), strokeWidth: 2 }}
  />
);

const LaneNum = ({ n, y }: { n: number; y: number }) => (
  <text
    x={1180}
    y={y + 12}
    textAnchor="middle"
    style={{
      fill: WHITE_A(0.55),
      fontSize: 34,
      fontWeight: 800,
      fontStyle: 'italic',
      fontFamily: 'var(--osd-font-display)',
    }}
  >
    {n}
  </text>
);

const Divider: Page = () => {
  const live = useIsActivePage();
  const voltR = TRACK.r0 + TRACK.lane / 2;
  return (
    <Stage footer={false}>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={abs(0, 0)}
        role="img"
        aria-label="田徑場彎道，第一道上畫著一條螢光線"
      >
        <path
          d={lanePath(TRACK.r0 + 4 * TRACK.lane)}
          style={{ fill: 'none', stroke: DEEP, strokeWidth: 8 * TRACK.lane }}
        />
        <LaneLine i={0} />
        <LaneLine i={1} />
        <LaneLine i={2} />
        <LaneLine i={3} />
        <LaneLine i={4} />
        <LaneLine i={5} />
        <LaneLine i={6} />
        <LaneLine i={7} />
        <LaneLine i={8} />
        <LaneNum n={2} y={TRACK.cy - TRACK.r0 - 66} />
        <LaneNum n={3} y={TRACK.cy - TRACK.r0 - 110} />
        <LaneNum n={4} y={TRACK.cy - TRACK.r0 - 154} />
        <LaneNum n={5} y={TRACK.cy - TRACK.r0 - 198} />
        <LaneNum n={6} y={TRACK.cy - TRACK.r0 - 242} />
        <LaneNum n={2} y={TRACK.cy + TRACK.r0 + 66} />
        <LaneNum n={3} y={TRACK.cy + TRACK.r0 + 110} />
        <LaneNum n={4} y={TRACK.cy + TRACK.r0 + 154} />
        <LaneNum n={5} y={TRACK.cy + TRACK.r0 + 198} />
        <path
          d={lanePath(voltR)}
          style={{ fill: 'none', stroke: 'var(--osd-accent)', strokeWidth: 14 }}
        />
        <path
          d={lanePath(voltR)}
          pathLength={1000}
          style={{
            fill: 'none',
            stroke: '#FFFFFF',
            strokeWidth: 14,
            strokeDasharray: '22 228',
            strokeDashoffset: 0,
            opacity: 0.85,
            animation: live ? 'ae-pace 9s linear infinite' : undefined,
          }}
        />
      </svg>

      <Kicker tag="行銷活動" x={120} y={300}>
        2027年春季至秋季
      </Kicker>
      <h2 style={{ ...DISPLAY, ...abs(112, 366), fontSize: 200, lineHeight: 1.04 }}>
        跑上
        <br />
        <span style={{ color: 'var(--osd-accent)' }}>那條線。</span>
      </h2>
      <p style={{ ...BODY, ...abs(120, 790), color: LAV }}>
        六場馬拉松，一條螢光線，每場 42.195 km。
      </p>
    </Stage>
  );
};

const ROUTE: Pt[] = [
  [24, 270],
  [236, 270],
  [236 + 160 * T, 110],
  [470, 110],
  [470 - 110 * T, 220],
  [660, 220],
  [660 + 156 * T, 64],
  [850, 64],
  [850 - 128 * T, 192],
  [930, 192],
];

const roundedPath = (pts: Pt[], r: number) => {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1];
    const [x, y] = pts[i];
    const [nx, ny] = pts[i + 1];
    const l1 = Math.hypot(x - px, y - py);
    const l2 = Math.hypot(nx - x, ny - y);
    const a = Math.min(r, l1 / 2, l2 / 2);
    const ax = x - ((x - px) / l1) * a;
    const ay = y - ((y - py) / l1) * a;
    const bx = x + ((nx - x) / l2) * a;
    const by = y + ((ny - y) / l2) * a;
    d += ` L${ax.toFixed(1)},${ay.toFixed(1)} Q${x.toFixed(1)},${y.toFixed(1)} ${bx.toFixed(1)},${by.toFixed(1)}`;
  }
  const [lx, ly] = pts[pts.length - 1];
  return `${d} L${lx},${ly}`;
};

const ROUTE_D = roundedPath(ROUTE, 26);

const RouteMark = ({
  x,
  y,
  label,
  end = false,
}: {
  x: number;
  y: number;
  label: string;
  end?: boolean;
}) => (
  <g>
    <circle
      cx={x}
      cy={y}
      r={11}
      style={{ fill: end ? 'var(--osd-accent)' : '#FFFFFF', stroke: INK, strokeWidth: 3 }}
    />
    <text
      x={x}
      y={y - 26}
      textAnchor="middle"
      style={{
        fill: '#FFFFFF',
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: '0.16em',
        fontFamily: 'var(--osd-font-body)',
      }}
    >
      {label}
    </text>
  </g>
);

const CityRow = ({ n, city, date }: { n: string; city: string; date: string }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      height: 88,
      borderBottom: `2px solid ${WHITE_A(0.22)}`,
    }}
  >
    <span
      style={{ ...LABEL, fontSize: 18, color: LAV, width: 64, fontVariantNumeric: 'tabular-nums' }}
    >
      {n}
    </span>
    <span style={{ ...DISPLAY, fontSize: 62 }}>{city}</span>
    <span
      style={{
        ...NUM,
        fontSize: 46,
        fontWeight: 800,
        marginLeft: 'auto',
        color: 'var(--osd-accent)',
      }}
    >
      {date}
    </span>
  </div>
);

const Idea: Page = () => (
  <Stage>
    <Kicker tag="行銷活動">核心概念</Kicker>
    <h2 style={{ ...DISPLAY, ...abs(116, 160), fontSize: 112, lineHeight: 1.04 }}>
      一條線，
      <br />
      42.195 km。
    </h2>
    <p style={{ ...BODY, ...abs(120, 404), width: 800, color: LAV }}>
      賽前一晚，我們沿著整條賽道畫上一條螢光線。每位跑者都跟著它跑，每台鏡頭都拍得到它。
    </p>
    <svg
      width={960}
      height={330}
      viewBox="0 0 960 330"
      style={abs(120, 540, { overflow: 'visible' })}
      role="img"
      aria-label="馬拉松賽道示意圖，上面畫著一條螢光線"
    >
      <path
        d={ROUTE_D}
        style={{
          fill: 'none',
          stroke: DEEP,
          strokeWidth: 36,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }}
      />
      <path
        d={ROUTE_D}
        style={{
          fill: 'none',
          stroke: 'var(--osd-accent)',
          strokeWidth: 8,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }}
      />
      <RouteMark x={24} y={270} label="起點" />
      <RouteMark x={ROUTE[2][0]} y={110} label="10 KM" />
      <RouteMark x={470} y={110} label="21.1 KM" />
      <RouteMark x={ROUTE[6][0]} y={64} label="30 KM" />
      <RouteMark x={930} y={192} label="42.195" end />
    </svg>

    <div style={abs(1120, 168, { width: 680 })}>
      <div style={{ ...LABEL, color: LAV, paddingBottom: 14, borderBottom: '2px solid #FFFFFF' }}>
        2027 · 六條賽道
      </div>
      <CityRow n="01" city="Tokyo" date="3月7日" />
      <CityRow n="02" city="Paris" date="4月11日" />
      <CityRow n="03" city="Boston" date="4月19日" />
      <CityRow n="04" city="London" date="4月25日" />
      <CityRow n="05" city="Berlin" date="9月26日" />
      <CityRow n="06" city="New York" date="11月7日" />
    </div>
  </Stage>
);

const RAMP = { x0: 120, y0: 908, x1: 1800 };
const rampY = (x: number) => RAMP.y0 - (x - RAMP.x0) * T;

const LaunchStop = ({
  x,
  date,
  title,
  body,
}: {
  x: number;
  date: string;
  title: string;
  body: string;
}) => {
  const y = rampY(x);
  return (
    <>
      <div
        style={abs(x - 14, y - 14, {
          width: 28,
          height: 28,
          background: 'var(--osd-accent)',
          clipPath: cut(28),
        })}
      />
      <div
        style={abs(x - 1, y - 72, {
          width: 2,
          height: 52,
          background: WHITE_A(0.5),
          transform: SKEW,
          transformOrigin: '0 100%',
        })}
      />
      <div style={abs(x - 4, y - 312, { width: 380 })}>
        <div style={{ ...NUM, fontSize: 92, color: 'var(--osd-accent)' }}>{date}</div>
        <div style={{ ...DISPLAY, fontSize: 40, marginTop: 18, lineHeight: 1 }}>{title}</div>
        <p style={{ ...BODY, fontSize: 24, color: WHITE_A(0.66), marginTop: 12, width: 340 }}>
          {body}
        </p>
      </div>
    </>
  );
};

const Launch: Page = () => (
  <Stage tone="ink">
    <Kicker tag="上市" tone="ink">
      上市節奏 · 2027年2月至6月
    </Kicker>
    <h2 style={{ ...DISPLAY, ...abs(116, 160), fontSize: 108, lineHeight: 1.05 }}>
      四波開賣，
      <br />
      <span style={{ color: 'var(--osd-accent)' }}>同一款鞋。</span>
    </h2>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={abs(0, 0)} aria-hidden="true">
      <line
        x1={RAMP.x0}
        y1={RAMP.y0}
        x2={RAMP.x1}
        y2={rampY(RAMP.x1)}
        style={{ stroke: WHITE_A(0.85), strokeWidth: 3 }}
      />
      <polygon
        points={`${RAMP.x1},${rampY(RAMP.x1)} ${RAMP.x1 - 26},${rampY(RAMP.x1) - 4} ${RAMP.x1 - 21},${rampY(RAMP.x1) + 19}`}
        style={{ fill: '#FFFFFF' }}
      />
    </svg>
    <Steps>
      <Step duration={260}>
        <LaunchStop
          x={200}
          date="2月3日"
          title="運動員限定"
          body="200 位 Ostra 運動員率先穿著比賽，通路尚未販售。"
        />
      </Step>
      <Step duration={260}>
        <LaunchStop
          x={620}
          date="3月7日"
          title="跑步社團"
          body="鋪貨 300 個社團、9,000 雙，同日是 Tokyo 的畫線日。"
        />
      </Step>
      <Step duration={260}>
        <LaunchStop
          x={1040}
          date="3月15日"
          title="會員"
          body="Ostra.com 會員可提前 72 小時購買。"
        />
      </Step>
      <Step duration={260}>
        <LaunchStop
          x={1460}
          date="4月9日"
          title="全面開賣"
          body="官網直營，以及 38 個市場的 1,400 家合作門市。"
        />
      </Step>
    </Steps>
  </Stage>
);

const ChannelSeg = ({
  x,
  w,
  pct,
  name,
  fill,
  fg,
}: {
  x: number;
  w: number;
  pct: string;
  name: string;
  fill: string;
  fg: string;
}) => (
  <div
    style={abs(x, 660, {
      width: w,
      height: 140,
      background: fill,
      clipPath: cut(140),
      color: fg,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 10,
      paddingLeft: 60,
    })}
  >
    <span style={{ ...NUM, fontSize: 88 }}>{pct}</span>
    <span style={{ ...LABEL, fontSize: 17, fontWeight: 700 }}>{name}</span>
  </div>
);

const ChannelNote = ({ x, title, body }: { x: number; title: string; body: string }) => (
  <div style={abs(x, 830, { width: 520 })}>
    <div style={{ ...BODY, fontSize: 24, fontWeight: 700, color: INK }}>{title}</div>
    <div style={{ ...BODY, fontSize: 22, color: INK_A(0.7), marginTop: 2 }}>{body}</div>
  </div>
);

const LadderRow = ({
  name,
  price,
  bold = false,
}: {
  name: string;
  price: string;
  bold?: boolean;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'baseline',
      height: 72,
      paddingTop: 10,
      borderTop: `2px solid ${bold ? INK : INK_A(0.25)}`,
      color: bold ? INK : INK_A(0.66),
    }}
  >
    <span style={{ ...LABEL, fontSize: 18, fontWeight: 700 }}>{name}</span>
    <span style={{ ...NUM, fontSize: 52, marginLeft: 'auto' }}>{price}</span>
  </div>
);

const Price: Page = () => (
  <Stage tone="volt">
    <Kicker tag="價格" tone="volt">
      價格與通路
    </Kicker>
    <div style={{ ...NUM, ...abs(104, 150), fontSize: 360, color: INK }}>€260</div>
    <p style={{ ...BODY, ...abs(120, 470), color: INK, width: 820 }}>
      各市場統一售價，9月1日前不打折。
    </p>
    <div style={abs(1240, 178, { width: 560 })}>
      <div style={{ ...LABEL, fontSize: 17, color: INK_A(0.66), marginBottom: 14 }}>價格帶</div>
      <LadderRow name="AERO 3" price="€260" bold />
      <LadderRow name="品類旗艦款均價" price="€252" />
      <LadderRow name="AERO 2" price="€230" />
    </div>

    <div style={abs(120, 618, { ...LABEL, fontSize: 17, color: INK_A(0.66) })}>
      通路組合 · 第一年銷量
    </div>
    <ChannelSeg x={120} w={742} pct="45%" name="直營" fill="var(--osd-bg)" fg="#FFFFFF" />
    <ChannelSeg x={878} w={577} pct="35%" name="跑步專賣" fill={INK} fg="var(--osd-accent)" />
    <ChannelSeg x={1471} w={329} pct="20%" name="批發" fill="#FFFFFF" fg={INK} />
    <ChannelNote x={120} title="Ostra.com + 31 間品牌店" body="毛利率 64%" />
    <ChannelNote x={878} title="1,100 間跑步專賣店" body="原價銷售時夥伴毛利 45%" />
    <ChannelNote x={1471} title="300 間連鎖運動用品店" body="90 天內維持 MAP 最低廣告價" />
  </Stage>
);

const QBar = ({
  x,
  k,
  q,
  months,
  note,
  hot = false,
}: {
  x: number;
  k: number;
  q: string;
  months: string;
  note: string;
  hot?: boolean;
}) => {
  const h = (k / 112) * 480;
  const base = 860;
  return (
    <>
      <div
        style={abs(x, base - h, {
          width: 170 + h * T,
          height: h,
          background: hot ? 'var(--osd-accent)' : '#FFFFFF',
          clipPath: `polygon(${(h * T).toFixed(1)}px 0, ${(170 + h * T).toFixed(1)}px 0, 170px 100%, 0 100%)`,
        })}
      />
      <div
        style={abs(x + h * T, base - h - 78, {
          ...NUM,
          fontSize: 64,
          color: hot ? 'var(--osd-accent)' : '#FFFFFF',
        })}
      >
        {k}K
      </div>
      <div style={abs(x, base + 18, { width: 230 })}>
        <div style={{ ...DISPLAY, fontSize: 34, lineHeight: 1 }}>
          {q}{' '}
          <span style={{ ...LABEL, fontSize: 15, fontStyle: 'normal', color: LAV }}>{months}</span>
        </div>
        <div style={{ ...BODY, fontSize: 20, color: LAV, marginTop: 6 }}>{note}</div>
      </div>
    </>
  );
};

const Forecast: Page = () => (
  <Stage>
    <Kicker tag="預測">第一年</Kicker>
    <div style={abs(120, 176)}>
      <div style={{ ...NUM, fontSize: 280, color: 'var(--osd-accent)' }}>320K</div>
      <div style={{ ...LABEL, fontSize: 24, marginTop: 20 }}>第一年銷售雙數</div>
      <div style={{ ...NUM, fontSize: 150, marginTop: 64 }}>€52M</div>
      <div style={{ ...LABEL, fontSize: 24, marginTop: 18 }}>淨營收 · FY27</div>
      <p style={{ ...BODY, fontSize: 22, color: LAV, marginTop: 36, width: 540 }}>
        假設4月9日有 1,400 家合作門市同步開賣，並舉辦六場「跑上那條線」賽事。
      </p>
    </div>
    <div style={abs(800, 860, { width: 1000, height: 2, background: '#FFFFFF' })} />
    <QBar x={820} k={38} q="Q1" months="1–3月" note="運動員與社團" />
    <QBar x={1050} k={96} q="Q2" months="4–6月" note="全面開賣" />
    <QBar x={1280} k={74} q="Q3" months="7–9月" note="夏季累積，含 Berlin" />
    <QBar x={1510} k={112} q="Q4" months="10–12月" note="New York 與年終檔期" hot />
  </Stage>
);

const AskRow = ({
  y,
  n,
  title,
  body,
  meta,
}: {
  y: number;
  n: string;
  title: string;
  body: string;
  meta: string;
}) => (
  <div
    style={abs(120, y, {
      width: 1680,
      height: 160,
      background: INK,
      clipPath: cut(160),
      color: '#FFFFFF',
    })}
  >
    <div style={{ ...NUM, ...abs(70, 26), fontSize: 120, color: 'var(--osd-accent)' }}>{n}</div>
    <div style={{ ...DISPLAY, ...abs(260, 30), fontSize: 58, lineHeight: 1 }}>{title}</div>
    <div style={{ ...BODY, ...abs(260, 96), fontSize: 26, color: WHITE_A(0.7) }}>{body}</div>
    <div
      style={abs(1250, 0, {
        ...LABEL,
        fontSize: 18,
        fontWeight: 700,
        width: 340,
        height: 160,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        textAlign: 'right',
        color: 'var(--osd-accent)',
      })}
    >
      {meta}
    </div>
  </div>
);

const Asks: Page = () => (
  <Stage tone="volt">
    <Kicker tag="夥伴" tone="volt">
      我們需要什麼
    </Kicker>
    <h2 style={{ ...DISPLAY, ...abs(112, 156), fontSize: 200, color: INK }}>三項請求。</h2>
    <div
      style={abs(1300, 258, {
        ...LABEL,
        width: 500,
        textAlign: 'right',
        color: INK,
        fontWeight: 700,
      })}
    >
      上市檔期 · 2027年4月9–19日
    </div>
    <Steps>
      <Step duration={260}>
        <AskRow
          y={384}
          n="01"
          title="門市裡的那條線"
          body="一座 4 m 的螢光線陳列架，從地板延伸到牆面。由我們出貨並安裝。"
          meta="4月1日前上線"
        />
      </Step>
      <Step duration={260}>
        <AskRow
          y={572}
          n="02"
          title="跑步社團上市之夜"
          body="舉辦一場 AERO 3 路跑活動。我們提供配速員與試穿鞋款。"
          meta="上市週"
        />
      </Step>
      <Step duration={260}>
        <AskRow
          y={760}
          n="03"
          title="店面櫥窗"
          body="提供十天的上市櫥窗檔期，設計與安裝由我們負責。"
          meta="4月9–19日"
        />
      </Step>
    </Steps>
  </Stage>
);

const StartLane = ({ i }: { i: number }) => (
  <div
    style={abs(i * 240, 800, {
      width: 3,
      height: 300,
      background: WHITE_A(0.45),
      transform: SKEW,
      transformOrigin: '0 0',
    })}
  />
);

const StartNum = ({ n }: { n: number }) => (
  <div
    style={abs((n - 1) * 240 + 60, 880, {
      ...NUM,
      width: 120,
      textAlign: 'center',
      fontSize: 120,
      color: n === 4 ? 'var(--osd-accent)' : WHITE_A(0.9),
    })}
  >
    {n}
  </div>
);

const Close: Page = () => {
  const live = useIsActivePage();
  const enter = (delay: number): CSSProperties =>
    live ? { animation: `ae-in 0.8s ${SNAP} ${delay}s both` } : {};
  return (
    <Stage footer={false}>
      <Wordmark x={120} y={92} />
      <h2 style={{ ...DISPLAY, ...abs(112, 186), fontSize: 164, lineHeight: 1.05, ...enter(0.05) }}>
        我們在
        <br />
        起跑線上見。
      </h2>
      <div style={abs(120, 560, { ...enter(0.18) })}>
        <div style={{ ...DISPLAY, fontSize: 48, lineHeight: 1 }}>Tomás Vieira</div>
        <div style={{ ...BODY, color: LAV, marginTop: 12 }}>
          全球跑步事業部副總 · tomas.vieira@ostra.run
        </div>
      </div>
      <div style={abs(1380, 560, { width: 420, textAlign: 'right' })}>
        <div style={{ ...LABEL, fontSize: 17, color: LAV }}>全面開賣</div>
        <div
          style={{
            ...NUM,
            fontSize: 72,
            fontWeight: 800,
            marginTop: 6,
            color: 'var(--osd-accent)',
          }}
        >
          09·04·27
        </div>
      </div>

      <div style={abs(0, 800, { width: 1920, height: 280, background: DEEP })} />
      <StartLane i={1} />
      <StartLane i={2} />
      <StartLane i={3} />
      <StartLane i={4} />
      <StartLane i={5} />
      <StartLane i={6} />
      <StartLane i={7} />
      <StartLane i={8} />
      <StartNum n={1} />
      <StartNum n={2} />
      <StartNum n={3} />
      <StartNum n={4} />
      <StartNum n={5} />
      <StartNum n={6} />
      <StartNum n={7} />
      <StartNum n={8} />
      <div style={abs(-40, 770, { width: 2000, height: 34, background: 'var(--osd-accent)' })} />
    </Stage>
  );
};

Cover.transition = morphTransition;
Race.transition = morphTransition;

export const meta: SlideMeta = {
  title: 'Ostra AERO 3 — 上市策略，2027 春季',
  createdAt: '2026-10-11T11:45:09.631Z',
};

export const notes: (string | undefined)[] = [
  `先讓速度線跑一拍再開口。
「這是 AERO 3，我們的第三代碳板競速鞋，也是 Ostra 在2027年最重要的一雙鞋。」
「接下來四十分鐘：市場、這雙鞋、實戰證明，以及我們到底需要各位做什麼。」點擊換頁。`,
  `看著螢光色帶落進長條圖，整個計畫就在這一個動作裡。
「超級跑鞋這個品類，自2022年起成長了三點四倍，現在是 29 億歐元的規模。」
「我們目前佔 6%，AERO 3 會讓我們在2027年底拉到 11%。」點擊換頁。`,
  `「我們不是要做給所有人的鞋，而是做給全馬破 3:30 的跑者。」
指向螢光色長條：「大約佔全馬完賽者的 11%，全球有 210 萬人。」
「他們買得早、每一季都買，而且他們穿什麼，起跑區裡其他人就想穿什麼。」點擊換頁。`,
  `「來看看腳底下有什麼。」
由下往上帶過每一層：大底、承載泡棉、全長碳纖維板，以及我們稱為 Lift 的 PEBA 頂層泡棉。
「後跟 39 毫米、前掌 31 毫米，落差 8 毫米。男款 US 9 只有 168 公克。」點擊換頁。`,
  `「我們把它帶到波爾圖的實驗室：24 位跑者，時速 16 公里，隨機分組。」
「跑步經濟性比 AERO 2 好 4.1%，能量回饋 87%，輕了 31 公克。」
「請看品類平均那條長條：AERO 2 已經落後同儕，而 AERO 3 領先。」點擊換頁。`,
  `「實驗室數字很漂亮，但賣鞋靠的是賽道上的成績。」
「12月的 Valencia：Elias Kimani 以 2 小時 04 分 17 秒奪冠，後半程更快，穿的是 AERO 3。」
「9月的 Berlin 登上頒獎台，還有今年六項國家紀錄，都是穿原型款創下的。」點擊換頁。`,
  `停在田徑場這一頁，讓配速燈繞一圈。
「那麼，我們要怎麼讓全世界知道？我們不買下賽道，我們直接在上面畫。」
「跑上那條線。」點擊換頁。`,
  `「今年的六場馬拉松，賽前一晚，我們會沿著完整的 42.195 公里畫上一條螢光線。」
「每位跑者都跟著它跑，每台轉播鏡頭都拍得到它，當天每一張照片裡都有我們的顏色。」
唸出六個城市和日期，從 Tokyo 到 New York。點擊換頁。`,
  `四次點擊，一次一波開賣。
「2月3日，運動員限定。3月7日，300 個跑步社團、9,000 雙鞋，同一天 Tokyo 也畫上它的那條線。」
「3月15日是會員。4月9日全面開賣，38 個市場、1,400 家合作門市。」點擊換頁。`,
  `「260 歐元。全球同一個價格，9月之前不打折。」
「通路組合：直營 45%、跑步專賣 35%、批發 20%。」
「對專賣店夥伴來說，原價銷售的毛利是 45%，而且 MAP 最低廣告價會維持 90 天。」點擊換頁。`,
  `「第一年：32 萬雙，淨營收約 5,200 萬歐元。」
「第二季是全面開賣，第四季是高峰：Berlin、New York 加上年終檔期。」
「這個預測假設 1,400 家門市在4月9日全部開賣，這也帶到我們需要各位的地方。」點擊換頁。`,
  `三次點擊，一次一項請求。
「第一：在各位的門市放上那條線。一座 4 公尺的陳列架，從地板延伸到牆面，由我們出貨，4月1日前安裝完成。」
「第二：舉辦一場上市之夜路跑。配速員和試穿鞋款由我們帶來。」
「第三：讓出店面櫥窗，上市週共十天。設計和安裝都由我們負責。」點擊換頁。`,
  `「謝謝大家，我們起跑線上見。」
「我是 Tomás Vieira，負責全球跑步事業。我的團隊本週會跟進陳列架規格和各位的配貨量。」
開放提問。`,
];

export default [
  Cover,
  Race,
  Runner,
  Product,
  Lab,
  Proof,
  Divider,
  Idea,
  Launch,
  Price,
  Forecast,
  Asks,
  Close,
] satisfies Page[];
