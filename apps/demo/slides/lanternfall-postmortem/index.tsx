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
import type { CSSProperties, ReactNode } from 'react';

export const design: DesignSystem = {
  palette: { bg: '#1A1C2C', text: '#F4F4F4', accent: '#FFCD75' },
  fonts: {
    display:
      '"Press Start 2P", "Courier New", monospace, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif',
    body: '"Jersey 15", system-ui, sans-serif, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif',
  },
  typeScale: { hero: 112, body: 36 },
  radius: 0,
};

const C = {
  navy: '#1A1C2C',
  plum: '#5D275D',
  red: '#B13E53',
  orange: '#EF7D57',
  yellow: '#FFCD75',
  lime: '#A7F070',
  green: '#38B764',
  teal: '#257179',
  deep: '#29366F',
  blue: '#3B5DC9',
  sky: '#41A6F6',
  cyan: '#73EFF7',
  white: '#F4F4F4',
  silver: '#94B0C2',
  slate: '#566C86',
  ink: '#333C57',
} as const;

const DARK = '#0E0F1A';

const PIX: Record<string, string> = {
  '0': C.navy,
  '1': C.plum,
  '2': C.red,
  '3': C.orange,
  '4': C.yellow,
  '5': C.lime,
  '6': C.green,
  '7': C.teal,
  '8': C.deep,
  '9': C.blue,
  a: C.sky,
  b: C.cyan,
  c: C.white,
  d: C.silver,
  e: C.slate,
  f: C.ink,
  k: C.navy,
};

const P = 8;

const SLIDE_ID = 'lanternfall-postmortem';
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Jersey+15&family=Press+Start+2P&family=Silkscreen&display=swap';
const FONT_LINK_ID = `osd-webfont-${SLIDE_ID}`;
const STYLE_ID = `osd-styles-${SLIDE_ID}`;
const KEYFRAMES = `
@keyframes lf-bob { 0%, 49.9% { transform: translateY(0) } 50%, 100% { transform: translateY(-8px) } }
@keyframes lf-blink { 0%, 49.9% { opacity: 1 } 50%, 100% { opacity: 0 } }
@keyframes lf-on { from { opacity: 0 } to { opacity: 1 } }
@keyframes lf-pop { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: none } }
@keyframes lf-wipe { from { clip-path: inset(0 100% 0 0) } to { clip-path: inset(0 0 0 0) } }
@keyframes lf-grow { from { transform: scaleY(0) } to { transform: none } }
@keyframes lf-fill { from { transform: scaleX(0) } to { transform: none } }
@keyframes lf-flicker { 0%, 100% { opacity: 1 } 20% { opacity: 0.8 } 45% { opacity: 1 } 70% { opacity: 0.88 } }
@keyframes lf-tw { 0%, 69.9% { opacity: 1 } 70%, 100% { opacity: 0.2 } }
@keyframes lf-toast { from { opacity: 0; transform: translateX(48px) } to { opacity: 1; transform: none } }
.lf-live [data-osd-step="revealed"] .lf-in { animation: lf-toast 320ms steps(4, end) both }
@media (prefers-reduced-motion: reduce) {
  .lf-m, .lf-in { animation: none !important }
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

const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
const HOLD: Keyframe[] = [{ opacity: 1 }, { opacity: 1 }];

export const transition: SlideTransition = {
  duration: 240,
  exit: { duration: 240, easing: EASE_IN, keyframes: HOLD },
  enter: {
    duration: 240,
    easing: 'steps(4, end)',
    keyframes: [
      { opacity: 0, transform: 'translateY(8px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

const abs = (left: number, top: number, extra?: CSSProperties): CSSProperties => ({
  position: 'absolute',
  left,
  top,
  ...extra,
});

const snap = (v: number) => Math.round(v / P) * P;

const useMotion = () => {
  const live = useIsActivePage();
  return (animation: string): CSSProperties => (live ? { animation } : {});
};

const DISPLAY: CSSProperties = {
  fontFamily: 'var(--osd-font-display)',
  fontWeight: 400,
  lineHeight: 1,
  margin: 0,
  whiteSpace: 'nowrap',
};

const LABEL: CSSProperties = {
  fontFamily:
    '"Silkscreen", "Courier New", monospace, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif',
  fontSize: 20,
  lineHeight: 1,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
};

const notch = (n: number) =>
  `polygon(${n}px 0, calc(100% - ${n}px) 0, calc(100% - ${n}px) ${n}px, 100% ${n}px, 100% calc(100% - ${n}px), calc(100% - ${n}px) calc(100% - ${n}px), calc(100% - ${n}px) 100%, ${n}px 100%, ${n}px calc(100% - ${n}px), 0 calc(100% - ${n}px), 0 ${n}px, ${n}px ${n}px)`;

const HERO = [
  '......00.............',
  '.....0220............',
  '....022220...........',
  '...02222220..........',
  '...02888880..........',
  '...02848840..........',
  '...02888880..........',
  '...02222220..........',
  '..0222222220.........',
  '..0222222222ddeeee...',
  '..0221112220.....e...',
  '.02221112220....eeeee',
  '.02211111220....e444e',
  '.022111112220...e434e',
  '0222111112220...e3c3e',
  '0221111111220...e434e',
  '02222222222220..e444e',
  '.000ee00ee000...eeeee',
  '...0ee0.0ee0.....eee.',
  '...000..000..........',
];

const SLIME = [
  '....0000....',
  '..00566600..',
  '.0656666660.',
  '.0566666660.',
  '0666k666k660',
  '066666666660',
  '067666666760',
  '.0777777770.',
  '..00000000..',
];

const LANTERN = [
  '...e...',
  '..e.e..',
  '.eeeee.',
  '.e444e.',
  '.e434e.',
  '.e3c3e.',
  '.e434e.',
  '.e444e.',
  '.eeeee.',
  '..eee..',
];

const HEART = ['.22.22.', '2c22222', '2222222', '.22222.', '..222..', '...2...'];

const BROKEN_HEART = ['.22.22.', '222.222', '2222.22', '.22.22.', '..2.2..', '...2...'];

const COIN = ['.4444.', '4c4443', '4c4343', '444343', '444343', '444443', '.3333.'];

const TROPHY = [
  '.44444444.',
  '4.c44443.4',
  '4.c44443.4',
  '.4c444434.',
  '..444443..',
  '...4443...',
  '....43....',
  '....43....',
  '..444443..',
  '..333333..',
];

const SKULL = [
  '..cccc..',
  '.cccccc.',
  'c00cc00c',
  'c00cc00c',
  'ccc00ccc',
  '.cccccc.',
  '.c0c0c0.',
  '..dddd..',
];

const HOURGLASS = [
  'eeeeeee',
  '.e...e.',
  '.e444e.',
  '..e4e..',
  '...4...',
  '..e.e..',
  '.e.4.e.',
  '.e444e.',
  'eeeeeee',
];

const GAMEPAD = [
  '.eeeeeeeeee.',
  'eeceeeeee2ee',
  'eccceeee4e2e',
  'eeceeeeee4ee',
  'eeeeeeeeeeee',
  'eee......eee',
  'ee........ee',
];

const PADLOCK = [
  '..eeee..',
  '.e....e.',
  '.e....e.',
  '44444444',
  '44400444',
  '44400444',
  '44444444',
  '33333333',
];

const FLAME = [
  '....4...',
  '...44...',
  '...434..',
  '..4334..',
  '.433c34.',
  '.43cc34.',
  '433cc334',
  '4333c334',
  '.433334.',
  '..2222..',
];

const CASTLE = [
  '.e.e.e....e.e.e.',
  '.eeeee....eeeee.',
  '.edede....edede.',
  '.eeeeeeeeeeeeee.',
  '.eeee4eeee4eeee.',
  '.eeeeeeeeeeeeee.',
  '.eeeeee00eeeeee.',
  '.eeeee0000eeeee.',
  '.eeeee0000eeeee.',
  '.fffff0000fffff.',
];

const FLAG = ['d.....', 'd2222.', 'd22222', 'd2222.', 'd.....', 'd.....', 'd.....', 'd.....'];

const PINE = [
  '....7....',
  '...777...',
  '..77777..',
  '.7777777.',
  '...777...',
  '..77777..',
  '.7777777.',
  '777777777',
  '..77777..',
  '.7777777.',
  '777777777',
  '....8....',
  '....8....',
];

const CHECK = ['......5', '.....55', '5...55.', '55.55..', '.555...', '..5....'];

const ARROW_RIGHT = ['c...', 'cc..', 'ccc.', 'cccc', 'ccc.', 'cc..', 'c...'];

const ARROW_DOWN = ['ccccccc', '.ccccc.', '..ccc..', '...c...'];

const ARROW_UP = ['...c...', '..ccc..', '.ccccc.', 'ccccccc'];

const AV_PRIYA = [
  '...hhhhhh...',
  '..hhhhhhhh..',
  '.hhhhhhhhhh.',
  '.hhsssssshh.',
  'hhsssssssshh',
  'hhs0ssss0shh',
  'hhsssssssshh',
  'hhsss22ssshh',
  'hh.ssssss.hh',
  'hhtttttttthh',
  '.tttttttttt.',
  'tttttttttttt',
];

const AV_TOM = [
  '............',
  '...hhhhhh...',
  '..hhhhhhhh..',
  '.hhhsssshhh.',
  '.hssssssssh.',
  '.sg0gssg0gs.',
  '.ssssssssss.',
  '..sss22sss..',
  '...ssssss...',
  '..tttttttt..',
  '.tttttttttt.',
  'tttttttttttt',
];

const AV_ADE = [
  '....nnnn....',
  '..nnnnnnnn..',
  '.nnnnnnnnnn.',
  '.uuuuuuuuuu.',
  '.ssssssssss.',
  '.ss0ssss0ss.',
  '.ssssssssss.',
  '.hsss22sssh.',
  '..hhhhhhhh..',
  '..tttttttt..',
  '.tttttttttt.',
  'tttttttttttt',
];

const AV_HANNA = [
  '...hhhhhh...',
  '..pppppppp..',
  '.phhhhhhhhp.',
  'pphsssssshpp',
  'pphsssssshpp',
  'pps0ssss0spp',
  '.hssssssssh.',
  '.hsss22sssh.',
  '.h.ssssss.h.',
  '..tttttttt..',
  '.tttttttttt.',
  'tttttttttttt',
];

type SpriteProps = {
  art: readonly string[];
  px?: number;
  x?: number;
  y?: number;
  swap?: Record<string, string>;
  style?: CSSProperties;
};

const Sprite = ({ art, px = P, x, y, swap, style }: SpriteProps) => {
  const w = art[0].length;
  const h = art.length;
  const cells: ReactNode[] = [];
  for (let j = 0; j < h; j++) {
    const row = art[j];
    let i = 0;
    while (i < w) {
      const ch = row[i];
      if (ch === '.' || ch === undefined) {
        i++;
        continue;
      }
      let k = i + 1;
      while (k < w && row[k] === ch) k++;
      cells.push(
        <rect
          key={`${i}:${j}`}
          x={i}
          y={j}
          width={k - i}
          height={1}
          fill={swap?.[ch] ?? PIX[ch] ?? C.white}
        />,
      );
      i = k;
    }
  }
  return (
    <svg
      width={w * px}
      height={h * px}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      style={{
        display: 'block',
        ...(x !== undefined && y !== undefined ? abs(x, y) : {}),
        ...style,
      }}
    >
      {cells}
    </svg>
  );
};

const Bob = ({
  x,
  y,
  delay = 0,
  period = 1.2,
  children,
}: {
  x: number;
  y: number;
  delay?: number;
  period?: number;
  children: ReactNode;
}) => {
  const m = useMotion();
  return (
    <div
      className="lf-m"
      style={{ ...abs(x, y), ...m(`lf-bob ${period}s steps(1, end) ${delay}s infinite`) }}
    >
      {children}
    </div>
  );
};

const LightPool = ({
  cx,
  cy,
  radii,
  alphas,
  color = C.yellow,
}: {
  cx: number;
  cy: number;
  radii: number[];
  alphas: number[];
  color?: string;
}) => {
  const m = useMotion();
  const R = Math.max(...radii);
  const rows: ReactNode[] = [];
  for (let ri = 0; ri < radii.length; ri++) {
    const r = radii[ri];
    const n = Math.ceil(r / P);
    for (let j = -n; j < n; j++) {
      const yc = (j + 0.5) * P;
      if (Math.abs(yc) >= r) continue;
      const hw = Math.floor(Math.sqrt(r * r - yc * yc) / P) * P;
      if (hw <= 0) continue;
      rows.push(
        <rect
          key={`${ri}:${j}`}
          x={R - hw}
          y={R + j * P}
          width={hw * 2}
          height={P}
          fill={color}
          fillOpacity={alphas[ri]}
        />,
      );
    }
  }
  return (
    <svg
      width={R * 2}
      height={R * 2}
      shapeRendering="crispEdges"
      aria-hidden="true"
      style={abs(cx - R, cy - R, { pointerEvents: 'none' })}
    >
      <g className="lf-m" style={m('lf-flicker 1.6s steps(1, end) infinite')}>
        {rows}
      </g>
    </svg>
  );
};

const Starfield = ({
  seed = 11,
  count = 110,
  height = 1080,
  avoid = [],
}: {
  seed?: number;
  count?: number;
  height?: number;
  avoid?: [number, number, number, number][];
}) => {
  const live = useIsActivePage();
  let s = seed;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  const stars: ReactNode[] = [];
  for (let n = 0; n < count; n++) {
    const x = Math.floor(rnd() * 240) * P;
    const y = Math.floor(rnd() * (height / P)) * P;
    const r = rnd();
    const size = r > 0.86 ? P : P / 2;
    const fill = r > 0.86 ? C.white : r > 0.5 ? C.silver : C.slate;
    if (
      avoid.some(([ax, ay, aw, ah]) => x >= ax - P && x <= ax + aw && y >= ay - P && y <= ay + ah)
    )
      continue;
    const tw = live && n % 6 === 0;
    stars.push(
      <rect
        key={n}
        x={x}
        y={y}
        width={size}
        height={size}
        fill={fill}
        className="lf-m"
        style={
          tw
            ? {
                animation: `lf-tw ${1.4 + (n % 5) * 0.35}s steps(1, end) ${(n % 4) * 0.4}s infinite`,
              }
            : undefined
        }
      />,
    );
    if (r > 0.97) {
      stars.push(
        <rect key={`${n}h`} x={x - P} y={y} width={P * 3} height={P} fill={C.cyan} opacity={0.5} />,
        <rect key={`${n}v`} x={x} y={y - P} width={P} height={P * 3} fill={C.cyan} opacity={0.5} />,
      );
    }
  }
  return (
    <svg
      width={1920}
      height={height}
      shapeRendering="crispEdges"
      aria-hidden="true"
      style={abs(0, 0, { pointerEvents: 'none' })}
    >
      {stars}
    </svg>
  );
};

const ridge = (peaks: [number, number, number][], base: number, step = 16) => {
  let d = `M 0 ${base}`;
  for (let x = 0; x < 1920; x += step) {
    let h = 0;
    for (const [px, ph, sl] of peaks) h = Math.max(h, ph - Math.abs(x + step / 2 - px) * sl);
    d += ` V ${base - snap(Math.max(0, h))} H ${x + step}`;
  }
  return `${d} V ${base} Z`;
};

const FAR_PEAKS: [number, number, number][] = [
  [120, 216, 0.7],
  [470, 296, 0.75],
  [760, 184, 0.6],
  [1240, 312, 0.72],
  [1560, 208, 0.6],
  [1840, 272, 0.7],
];

const NEAR_PEAKS: [number, number, number][] = [
  [80, 120, 0.3],
  [520, 96, 0.25],
  [980, 72, 0.2],
  [1420, 128, 0.28],
  [1880, 104, 0.3],
];

const Pine = ({
  x,
  y,
  px = P,
  tone = 'mid',
}: {
  x: number;
  y: number;
  px?: number;
  tone?: 'mid' | 'far';
}) => (
  <Sprite
    art={PINE}
    px={px}
    x={x}
    y={y}
    swap={tone === 'far' ? { '7': C.deep, '8': C.ink } : { '7': C.teal, '8': C.plum }}
  />
);

const GROUND = 880;

const Landscape = () => (
  <>
    <svg
      width={1920}
      height={GROUND}
      shapeRendering="crispEdges"
      aria-hidden="true"
      style={abs(0, 0, { pointerEvents: 'none' })}
    >
      <path d={ridge(FAR_PEAKS, GROUND)} fill={C.slate} />
      <path d={ridge(FAR_PEAKS, GROUND + P)} fill={C.ink} />
      <path d={ridge(NEAR_PEAKS, GROUND)} fill={C.blue} />
      <path d={ridge(NEAR_PEAKS, GROUND + P)} fill={C.deep} />
    </svg>
    <Pine x={24} y={GROUND - 104} />
    <Pine x={136} y={GROUND - 152} px={P} />
    <Pine x={248} y={GROUND - 104} />
    <Pine x={480} y={GROUND - 104} tone="far" />
    <Pine x={1440} y={GROUND - 104} tone="far" />
    <Pine x={1696} y={GROUND - 104} />
    <Pine x={1808} y={GROUND - 152} />
    <div style={abs(0, GROUND, { width: 1920, height: P, background: C.lime })} />
    <div style={abs(0, GROUND + P, { width: 1920, height: P * 2, background: C.green })} />
    <div
      style={abs(0, GROUND + P * 3, {
        width: 1920,
        height: 1080 - GROUND - P * 3,
        background: `repeating-linear-gradient(90deg, ${C.ink} 0 40px, ${C.ink} 40px 48px), ${C.ink}`,
      })}
    />
    <div
      style={abs(0, GROUND + P * 3, {
        width: 1920,
        height: P,
        background: `repeating-linear-gradient(90deg, ${C.teal} 0 8px, transparent 8px 24px, ${C.teal} 24px 32px, transparent 32px 56px)`,
        opacity: 0.6,
      })}
    />
  </>
);

const Screen = ({
  children,
  hud = true,
  stars = false,
  avoid,
}: {
  children: ReactNode;
  hud?: boolean;
  stars?: boolean;
  avoid?: [number, number, number, number][];
}) => {
  const live = useIsActivePage();
  return (
    <div
      className={live ? 'lf-live' : undefined}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--osd-bg)',
        color: 'var(--osd-text)',
        fontFamily: 'var(--osd-font-body)',
      }}
    >
      {stars && <Starfield avoid={avoid} />}
      {children}
      {hud && <Hud />}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'repeating-linear-gradient(180deg, rgba(0,0,0,0) 0 4px, rgba(0,0,0,0.08) 4px 8px)',
          zIndex: 30,
        }}
      />
    </div>
  );
};

const Hud = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <>
      <div style={abs(120, 1016, { ...LABEL, color: C.slate, display: 'flex', gap: 16 })}>
        <span style={{ color: C.red }}>♥♥♥</span>
        <span>Mossbyte / Lanternfall 事後檢討</span>
      </div>
      <div style={{ ...LABEL, position: 'absolute', right: 120, top: 1016, color: C.slate }}>
        關卡{' '}
        <span style={{ color: C.silver }}>
          {String(current).padStart(2, '0')}/{String(total).padStart(2, '0')}
        </span>
      </div>
    </>
  );
};

const Kicker = ({ world, children }: { world: string; children: ReactNode }) => (
  <div
    style={abs(120, 104, {
      ...LABEL,
      fontSize: 22,
      color: 'var(--osd-accent)',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    })}
  >
    <span style={{ background: 'var(--osd-accent)', color: C.navy, padding: '5px 10px' }}>
      世界 {world}
    </span>
    <span>{children}</span>
  </div>
);

const Title = ({
  children,
  color = C.white,
  shadow = C.plum,
}: {
  children: ReactNode;
  color?: string;
  shadow?: string;
}) => (
  <h2
    style={{
      ...DISPLAY,
      ...abs(120, 152),
      fontSize: 56,
      fontWeight: 700,
      color,
      textShadow: `4px 4px 0 ${shadow}`,
    }}
  >
    {children}
  </h2>
);

const Sub = ({ children }: { children: ReactNode }) => (
  <p style={abs(120, 240, { margin: 0, fontSize: 34, lineHeight: 1.2, color: C.silver })}>
    {children}
  </p>
);

const PixelBox = ({
  x,
  y,
  w,
  h,
  fill = C.deep,
  edge = C.white,
  shade = true,
  children,
  style,
  className,
}: {
  x?: number;
  y?: number;
  w: number;
  h: number;
  fill?: string;
  edge?: string;
  shade?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
}) => (
  <div
    className={className}
    style={{
      ...(x !== undefined && y !== undefined ? abs(x, y) : { position: 'relative' }),
      width: w,
      height: h,
      ...style,
    }}
  >
    {shade && (
      <div
        style={{
          position: 'absolute',
          left: P,
          top: P,
          width: w,
          height: h,
          background: 'rgba(0,0,0,0.5)',
          clipPath: notch(P),
        }}
      />
    )}
    <div style={{ position: 'absolute', inset: 0, background: edge, clipPath: notch(P) }} />
    <div
      style={{
        position: 'absolute',
        inset: P,
        background: fill,
        boxShadow: `inset 0 ${P}px 0 rgba(255,255,255,0.07), inset 0 -${P}px 0 rgba(0,0,0,0.22)`,
      }}
    />
    <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
  </div>
);

const SegBar = ({
  x,
  y,
  value,
  max = 10,
  w = 312,
  h = 24,
  color,
  delay = 0,
}: {
  x: number;
  y: number;
  value: number;
  max?: number;
  w?: number;
  h?: number;
  color: string;
  delay?: number;
}) => {
  const m = useMotion();
  const pitch = (w + P) / max;
  const seg = pitch - P;
  const bg = (c: string) =>
    `repeating-linear-gradient(90deg, ${c} 0 ${seg}px, transparent ${seg}px ${pitch}px)`;
  return (
    <div style={abs(x, y, { width: w, height: h })}>
      <div style={{ position: 'absolute', inset: 0, background: bg(C.ink) }} />
      <div
        className="lf-m"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: h,
          width: pitch * value - P,
          background: bg(color),
          transformOrigin: '0 50%',
          ...m(`lf-fill 600ms steps(${value}, end) ${delay}ms both`),
        }}
      />
    </div>
  );
};

const Tag = ({
  x,
  y,
  children,
  bg = C.yellow,
  color = C.navy,
  stem = 0,
  stemX = 16,
  delay = 0,
}: {
  x: number;
  y: number;
  children: ReactNode;
  bg?: string;
  color?: string;
  stem?: number;
  stemX?: number;
  delay?: number;
}) => {
  const m = useMotion();
  return (
    <div className="lf-m" style={{ ...abs(x, y), ...m(`lf-on 1ms steps(1, end) ${delay}ms both`) }}>
      {stem > 0 && <div style={abs(stemX, 32, { width: P, height: stem, background: bg })} />}
      <div
        style={{
          ...LABEL,
          fontSize: 18,
          background: bg,
          color,
          padding: '7px 12px',
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Typewriter = ({
  text,
  start = 0,
  cps = 40,
}: {
  text: string;
  start?: number;
  cps?: number;
}) => {
  const live = useIsActivePage();
  const chars = Array.from(text);
  const step = 1000 / cps;
  const end = Math.round(start + chars.length * step);
  const cursor = (
    <span
      className="lf-m"
      style={{
        display: 'inline-block',
        width: '0.45em',
        height: '0.85em',
        marginLeft: 8,
        verticalAlign: '-0.08em',
        background: 'var(--osd-accent)',
        animation: live ? `lf-blink 1s steps(1, end) ${end}ms infinite` : undefined,
      }}
    />
  );
  if (!live)
    return (
      <span>
        {text}
        {cursor}
      </span>
    );
  return (
    <span>
      {chars.map((ch, i) => (
        <span
          key={i}
          className="lf-m"
          style={{ animation: `lf-on 1ms steps(1, end) ${Math.round(start + i * step)}ms both` }}
        >
          {ch}
        </span>
      ))}
      {cursor}
    </span>
  );
};

const ScoreBar = () => (
  <div
    style={abs(120, 96, {
      ...LABEL,
      fontSize: 24,
      width: 1680,
      display: 'flex',
      justifyContent: 'space-between',
    })}
  >
    <span>
      <span style={{ color: C.red }}>1UP</span>
      <span style={{ marginLeft: 20 }}>000000</span>
    </span>
    <span>
      <span style={{ color: C.red }}>最高分</span>
      <span style={{ marginLeft: 20 }}>142000</span>
    </span>
    <span>
      <span style={{ color: C.red }}>投幣</span>
      <span style={{ marginLeft: 20 }}>04</span>
    </span>
  </div>
);

const Cover: Page = () => {
  const m = useMotion();
  return (
    <Screen hud={false} stars avoid={[[320, 80, 1280, 448]]}>
      <Landscape />
      <LightPool cx={1128} cy={792} radii={[296, 216, 136]} alphas={[0.05, 0.07, 0.1]} />
      <ScoreBar />
      <h1
        style={{
          ...DISPLAY,
          ...abs(0, 208, { width: 1920, textAlign: 'center' }),
          fontSize: 'var(--osd-size-hero)',
          color: 'var(--osd-accent)',
          textShadow: `8px 8px 0 ${C.red}, 16px 16px 0 ${C.plum}`,
        }}
      >
        LANTERNFALL
      </h1>
      <div
        style={{
          ...DISPLAY,
          ...abs(0, 376, { width: 1920, textAlign: 'center' }),
          fontSize: 40,
          color: C.cyan,
          fontWeight: 700,
          textShadow: `3px 3px 0 ${C.deep}`,
        }}
      >
        事後檢討
      </div>
      <div
        className="lf-m"
        style={{
          ...abs(0, 464, {
            width: 1920,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 24,
          }),
          ...m('lf-blink 1.1s steps(1, end) infinite'),
        }}
      >
        <Sprite art={ARROW_RIGHT} px={4} swap={{ c: C.white }} />
        <span style={{ ...DISPLAY, fontSize: 32, fontWeight: 700, color: C.white }}>按下開始</span>
      </div>
      <Bob x={848} y={GROUND - 320}>
        <Sprite art={HERO} px={16} />
      </Bob>
      <Bob x={1360} y={GROUND - 144} delay={0.3} period={0.9}>
        <Sprite art={SLIME} px={16} />
      </Bob>
      <Bob x={1576} y={GROUND - 108} delay={0.6} period={1}>
        <Sprite art={SLIME} px={12} swap={{ '5': C.cyan, '6': C.sky, '7': C.blue }} />
      </Bob>
      <div style={abs(120, 968, { ...LABEL, fontSize: 22, color: C.silver })}>
        Mossbyte <span style={{ color: C.slate }}>/</span> Northplay Dev Conf 2026
      </div>
      <div
        style={{
          ...LABEL,
          position: 'absolute',
          right: 120,
          top: 968,
          fontSize: 22,
          color: C.slate,
        }}
      >
        © 2026 Mossbyte · 4 位玩家
      </div>
    </Screen>
  );
};

const InfoSlot = ({
  x,
  label,
  value,
  children,
}: {
  x: number;
  label: string;
  value: string;
  children: ReactNode;
}) => (
  <PixelBox x={x} y={296} w={396} h={240} fill={C.ink}>
    <div style={abs(40, 40, { height: 64, display: 'flex', alignItems: 'center' })}>{children}</div>
    <div style={abs(40, 128, { ...LABEL, color: C.silver })}>{label}</div>
    <div style={abs(40, 160, { fontSize: 52, lineHeight: 1.1, whiteSpace: 'nowrap' })}>{value}</div>
  </PixelBox>
);

const Pitch: Page = () => {
  const m = useMotion();
  return (
    <Screen>
      <Kicker world="1-1">提案</Kicker>
      <Title>遊戲提案</Title>
      <InfoSlot x={120} label="類型" value="Roguelite">
        <Sprite art={SKULL} px={8} />
      </InfoSlot>
      <InfoSlot x={548} label="平台" value="Steam · Switch">
        <Sprite art={GAMEPAD} px={8} />
      </InfoSlot>
      <InfoSlot x={976} label="售價" value="$17.99">
        <Sprite art={COIN} px={8} />
      </InfoSlot>
      <InfoSlot x={1404} label="單局時間" value="25 分鐘">
        <Sprite art={HOURGLASS} px={8} />
      </InfoSlot>
      <PixelBox x={120} y={616} w={1680} h={304} fill={C.deep}>
        <PixelBox x={40} y={48} w={208} h={208} fill={DARK} edge={C.slate} shade={false}>
          <Sprite art={HERO} px={8} x={24} y={24} />
        </PixelBox>
        <div
          style={abs(296, 64, {
            width: 1320,
            fontSize: 50,
            lineHeight: 1.45,
            color: C.white,
          })}
        >
          <Typewriter
            start={400}
            text="你的提燈就是你的血條。每挨一下，光就暗一分，而黑暗裡滿是尖牙。"
          />
        </div>
        <div
          className="lf-m"
          style={{ ...abs(1592, 240), ...m('lf-bob 0.8s steps(1, end) infinite') }}
        >
          <Sprite art={ARROW_DOWN} px={4} swap={{ c: C.yellow }} />
        </div>
      </PixelBox>
      <PixelBox x={168} y={584} w={192} h={64} fill={C.red} shade={false}>
        <div
          style={{ ...DISPLAY, ...abs(0, 22, { width: 192, textAlign: 'center' }), fontSize: 20 }}
        >
          WICK
        </div>
      </PixelBox>
    </Screen>
  );
};

const OilRow = ({
  y,
  label,
  color,
  body,
  icon,
  delay,
}: {
  y: number;
  label: string;
  color: string;
  body: string;
  icon: ReactNode;
  delay: number;
}) => (
  <>
    <PixelBox x={1000} y={y} w={128} h={128} fill={C.ink} edge={color}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>
    </PixelBox>
    <div style={{ ...DISPLAY, ...abs(1176, y + 4), fontSize: 28, color }}>{label}</div>
    <div style={abs(1176, y + 48, { width: 624, fontSize: 34, lineHeight: 1.3, color: C.silver })}>
      {body}
    </div>
    <SegBar x={1176} y={y + 112} value={7} w={472} color={color} delay={delay} />
    <div style={abs(1672, y + 114, { ...LABEL, color: C.slate })}>68/100</div>
  </>
);

const Lurker = ({ x, y }: { x: number; y: number }) => (
  <Sprite
    art={SLIME}
    px={8}
    x={x}
    y={y}
    swap={{ '5': C.ink, '6': C.deep, '7': '#1F2440', k: C.yellow }}
  />
);

const Hook: Page = () => (
  <Screen>
    <Kicker world="1-2">核心賣點</Kicker>
    <Title>燈油就是一切</Title>
    <PixelBox x={120} y={296} w={784} h={624} fill={DARK} edge={C.slate}>
      <LightPool cx={392} cy={312} radii={[264, 184, 112]} alphas={[0.07, 0.1, 0.16]} />
      <Lurker x={624} y={248} />
      <Lurker x={48} y={432} />
      <Lurker x={520} y={512} />
      <Lurker x={96} y={88} />
      <Bob x={256} y={200}>
        <Sprite art={HERO} px={8} />
      </Bob>
      <div style={abs(360, 40, { ...LABEL, fontSize: 18, color: C.slate })}>黑暗</div>
      <div style={abs(368, 120, { ...LABEL, fontSize: 18, color: C.silver })}>昏暗</div>
      <div style={abs(368, 192, { ...LABEL, fontSize: 18, color: C.yellow })}>明亮</div>
    </PixelBox>
    <OilRow
      y={304}
      label="燈油 = 血量"
      color={C.red}
      body="每次受擊都會消耗燈油。歸零就死亡。"
      icon={<Sprite art={HEART} px={10} />}
      delay={300}
    />
    <OilRow
      y={520}
      label="燈油 = 光亮"
      color={C.yellow}
      body="燈油越少，光圈越小，預警越晚。"
      icon={<Sprite art={LANTERN} px={8} />}
      delay={500}
    />
    <OilRow
      y={736}
      label="燈油 = 金錢"
      color={C.lime}
      body="升級要花燈油。每次購買都是一場賭注。"
      icon={<Sprite art={COIN} px={10} />}
      delay={700}
    />
  </Screen>
);

const PartyCard = ({
  x,
  name,
  job,
  klass,
  slot,
  art,
  swap,
  statA,
  valA,
  statB,
  valB,
  barA,
  barB,
}: {
  x: number;
  name: string;
  job: string;
  klass: string;
  slot: string;
  art: readonly string[];
  swap: Record<string, string>;
  statA: string;
  valA: number;
  statB: string;
  valB: number;
  barA: string;
  barB: string;
}) => (
  <PixelBox x={x} y={296} w={396} h={600} fill={C.ink}>
    <div style={abs(32, 32, { width: 332, height: 224, background: slot, overflow: 'hidden' })}>
      <div
        style={abs(0, 0, {
          width: 332,
          height: 224,
          background:
            'repeating-linear-gradient(180deg, rgba(0,0,0,0) 0 16px, rgba(0,0,0,0.12) 16px 32px)',
        })}
      />
      <Sprite art={art} px={16} x={70} y={32} swap={swap} />
    </div>
    <div style={abs(32, 288, { ...LABEL, color: 'var(--osd-accent)' })}>{klass}</div>
    <div style={abs(32, 320, { fontSize: 46, lineHeight: 1.2, whiteSpace: 'nowrap' })}>{name}</div>
    <div
      style={abs(32, 372, { fontSize: 32, lineHeight: 1.2, color: C.silver, whiteSpace: 'nowrap' })}
    >
      {job}
    </div>
    <div
      style={abs(32, 432, {
        ...LABEL,
        fontSize: 18,
        color: C.silver,
        width: 312,
        display: 'flex',
        justifyContent: 'space-between',
      })}
    >
      <span>{statA}</span>
      <span style={{ color: C.white }}>{valA}</span>
    </div>
    <SegBar x={32} y={460} value={valA} color={barA} />
    <div
      style={abs(32, 508, {
        ...LABEL,
        fontSize: 18,
        color: C.silver,
        width: 312,
        display: 'flex',
        justifyContent: 'space-between',
      })}
    >
      <span>{statB}</span>
      <span style={{ color: C.white }}>{valB}</span>
    </div>
    <SegBar x={32} y={536} value={valB} color={barB} delay={200} />
  </PixelBox>
);

const Party: Page = () => (
  <Screen>
    <Kicker world="1-3">隊伍</Kicker>
    <Title>冒險小隊</Title>
    <div
      style={{
        ...LABEL,
        position: 'absolute',
        right: 120,
        top: 172,
        fontSize: 22,
        color: C.silver,
      }}
    >
      4 位玩家 · 0 位製作人 · 3 年
    </div>
    <PartyCard
      x={120}
      name="Priya Raman"
      job="設計 + 總監"
      klass="Lv 31 · 戰術家"
      slot={C.red}
      art={AV_PRIYA}
      swap={{ h: C.navy, s: '#AB5236', t: C.yellow }}
      statA="願景"
      valA={9}
      barA={C.yellow}
      statB="行銷"
      valB={2}
      barB={C.red}
    />
    <PartyCard
      x={548}
      name="Tom Wójcik"
      job="引擎 + 工具"
      klass="Lv 34 · 機匠"
      slot={C.blue}
      art={AV_TOM}
      swap={{ h: C.yellow, s: '#FFCCAA', t: C.cyan, g: C.slate }}
      statA="C#"
      valA={10}
      barA={C.cyan}
      statB="睡眠"
      valB={3}
      barB={C.red}
    />
    <PartyCard
      x={976}
      name="Ade Okafor"
      job="美術 + 動畫"
      klass="Lv 29 · 幻術師"
      slot={C.green}
      art={AV_ADE}
      swap={{ n: C.orange, u: C.red, s: '#7A3F2C', h: C.navy, t: C.white }}
      statA="像素"
      valA={10}
      barA={C.lime}
      statB="節制"
      valB={2}
      barB={C.red}
    />
    <PartyCard
      x={1404}
      name="Hanna Lind"
      job="音樂 + 音效"
      klass="Lv 27 · 吟遊詩人"
      slot={C.plum}
      art={AV_HANNA}
      swap={{ h: C.orange, p: C.white, s: '#FFCCAA', t: C.silver }}
      statA="旋律"
      valA={9}
      barA={C.sky}
      statB="社群"
      valB={4}
      barB={C.orange}
    />
  </Screen>
);

const NODE_X = [216, 424, 632, 840, 1048, 1256, 1464, 1672];
const NODE_Y = [488, 712, 488, 712, 488, 712, 488, 712];

const mapPath = () => {
  let d = `M ${NODE_X[0]} ${NODE_Y[0]}`;
  for (let i = 1; i < NODE_X.length; i++) {
    const mid = (NODE_X[i - 1] + NODE_X[i]) / 2;
    d += ` H ${mid} V ${NODE_Y[i]} H ${NODE_X[i]}`;
  }
  return d;
};

const MapNode = ({
  x,
  y,
  code,
  warn = false,
  delay,
}: {
  x: number;
  y: number;
  code: string;
  warn?: boolean;
  delay: number;
}) => {
  const m = useMotion();
  return (
    <div
      className="lf-m"
      style={{ ...abs(x - 40, y - 40), ...m(`lf-pop 320ms steps(4, end) ${delay}ms both`) }}
    >
      <PixelBox w={80} h={80} fill={warn ? C.red : C.yellow} edge={C.white}>
        <div
          style={{
            ...LABEL,
            ...abs(0, 30, { width: 80, textAlign: 'center' }),
            color: warn ? C.white : C.navy,
          }}
        >
          {code}
        </div>
      </PixelBox>
    </div>
  );
};

const MapLabel = ({
  x,
  y,
  above,
  right = false,
  date,
  title,
  body,
  warn = false,
}: {
  x: number;
  y: number;
  above: boolean;
  right?: boolean;
  date: string;
  title: string;
  body: string;
  warn?: boolean;
}) => (
  <div
    style={abs(x, above ? y - 216 : y + 64, {
      width: 384,
      height: 160,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: above ? 'flex-end' : 'flex-start',
      textAlign: right ? 'right' : 'left',
      gap: 6,
    })}
  >
    <div style={{ ...LABEL, color: warn ? C.orange : 'var(--osd-accent)' }}>{date}</div>
    <div style={{ fontSize: 42, lineHeight: 1.1 }}>{title}</div>
    <div style={{ fontSize: 32, lineHeight: 1.25, color: C.silver }}>{body}</div>
  </div>
);

const RoadMap: Page = () => {
  const m = useMotion();
  return (
    <Screen>
      <Kicker world="2-1">旅程</Kicker>
      <Title>通往1.0之路</Title>
      <div
        style={{
          ...LABEL,
          position: 'absolute',
          right: 120,
          top: 172,
          fontSize: 22,
          color: C.silver,
        }}
      >
        2023 年 4 月 → 2026 年 4 月 · 37 個月
      </div>
      <Pine x={120} y={600} tone="far" />
      <Pine x={208} y={760} />
      <Pine x={120} y={800} tone="far" />
      <div
        className="lf-m"
        style={{ ...abs(0, 0), ...m('lf-wipe 1600ms steps(32, end) 100ms both') }}
      >
        <svg width={1920} height={1080} shapeRendering="crispEdges" aria-hidden="true">
          <path d={mapPath()} fill="none" stroke={C.slate} strokeWidth={P} strokeDasharray="8 8" />
        </svg>
      </div>
      <MapLabel
        x={160}
        y={488}
        above
        date="2023 年 4 月"
        title="Game Jam"
        body="48 小時做出原型，在 212 組中拿下第 2 名。"
      />
      <MapLabel
        x={368}
        y={712}
        above={false}
        date="2023 年 11 月"
        title="全力投入"
        body="垂直切片完成。四人全數辭去正職。"
      />
      <MapLabel
        x={576}
        y={488}
        above
        date="2024 年 3 月"
        title="拿到資金"
        body="$180K 地方遊戲補助，加上存款。"
      />
      <MapLabel
        x={784}
        y={712}
        above={false}
        date="2024 年 6 月"
        title="Steam 商店頁"
        body="第一週累積 2,100 個願望清單。"
      />
      <MapLabel
        x={992}
        y={488}
        above
        date="2025 年 2 月"
        title="新品節"
        body="試玩版 7 天內新增 41,200 個願望清單。"
      />
      <MapLabel
        x={1200}
        y={712}
        above={false}
        warn
        date="2025 年 9 月"
        title="延期"
        body="上市時間延後七個月。"
      />
      <MapLabel
        x={1408}
        y={488}
        above
        date="2026 年 1 月"
        title="Switch 認證"
        body="第二次送審才通過。"
      />
      <MapLabel
        x={1416}
        y={760}
        above={false}
        right
        date="2026 年 4 月 14 日"
        title="上市"
        body="Steam + Switch，$17.99。"
      />
      <MapNode x={216} y={488} code="1-1" delay={150} />
      <MapNode x={424} y={712} code="1-2" delay={350} />
      <MapNode x={632} y={488} code="1-3" delay={550} />
      <MapNode x={840} y={712} code="2-1" delay={750} />
      <MapNode x={1048} y={488} code="2-2" delay={950} />
      <MapNode x={1256} y={712} code="2-3" warn delay={1150} />
      <MapNode x={1464} y={488} code="3-1" delay={1350} />
      <div
        className="lf-m"
        style={{ ...abs(1608, 632), ...m('lf-pop 320ms steps(4, end) 1550ms both') }}
      >
        <Sprite art={FLAG} px={8} x={56} y={0} />
        <Sprite art={CASTLE} px={8} x={0} y={56} />
      </div>
    </Screen>
  );
};

const Toast = ({
  bad = false,
  icon,
  title,
  body,
  score,
}: {
  bad?: boolean;
  icon: ReactNode;
  title: string;
  body: string;
  score: string;
}) => (
  <div className="lf-in">
    <PixelBox w={1680} h={184} fill={bad ? '#2A1A2C' : C.deep} edge={bad ? C.red : C.lime}>
      <PixelBox
        x={32}
        y={36}
        w={112}
        h={112}
        fill={DARK}
        edge={bad ? C.plum : C.teal}
        shade={false}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
      </PixelBox>
      <div style={abs(184, 36, { ...LABEL, color: bad ? C.orange : C.lime })}>
        {bad ? '減益已套用' : '成就解鎖'}
      </div>
      <div style={abs(184, 66, { fontSize: 48, lineHeight: 1.1 })}>{title}</div>
      <div
        style={abs(184, 120, {
          fontSize: 34,
          lineHeight: 1.2,
          color: C.silver,
          whiteSpace: 'nowrap',
        })}
      >
        {body}
      </div>
      <div
        style={{
          ...DISPLAY,
          position: 'absolute',
          right: 48,
          top: 56,
          fontSize: 40,
          color: bad ? C.orange : 'var(--osd-accent)',
        }}
      >
        {score}
      </div>
      <div
        style={{
          ...LABEL,
          position: 'absolute',
          right: 48,
          top: 116,
          fontSize: 18,
          color: C.slate,
        }}
      >
        {bad ? '懲罰' : '獎勵'}
      </div>
    </PixelBox>
  </div>
);

const Right: Page = () => (
  <Screen>
    <Kicker world="2-2">增益</Kicker>
    <Title color={C.lime} shadow={C.teal}>
      做對的事
    </Title>
    <div style={abs(120, 288, { display: 'flex', flexDirection: 'column', gap: 24 })}>
      <Steps>
        <Step>
          <Toast
            icon={<Sprite art={TROPHY} px={8} />}
            title="48 小時內找到樂趣"
            body="Jam 版本就有燈油即血量的設計，後來不必再找賣點。"
            score="48小時"
          />
        </Step>
        <Step>
          <Toast
            icon={<Sprite art={LANTERN} px={8} />}
            title="兩秒鐘的 GIF"
            body="縮小的光圈一眼就懂。一支短片：2.3M 次觀看。"
            score="+9K"
          />
        </Step>
        <Step>
          <Toast
            icon={<Sprite art={FLAG} px={10} />}
            title="有結局的試玩版"
            body="玩 25 分鐘，在第一隻 Boss 前硬性結束。玩家意猶未盡。"
            score="+41K"
          />
        </Step>
      </Steps>
    </div>
  </Screen>
);

const Wrong: Page = () => (
  <Screen>
    <Kicker world="2-3">減益</Kicker>
    <Title color={C.orange} shadow={C.red}>
      做錯的事
    </Title>
    <div style={abs(120, 288, { display: 'flex', flexDirection: 'column', gap: 24 })}>
      <Steps>
        <Step>
          <Toast
            bad
            icon={<Sprite art={SKULL} px={10} />}
            title="囤積生態區"
            body="我們做了六個生態區，只上線四個。兩個在美術完成後被砍掉。"
            score="-14週"
          />
        </Step>
        <Step>
          <Toast
            bad
            icon={<Sprite art={BROKEN_HEART} px={10} />}
            title="沒人負責行銷"
            body="直到第 26 個月，行銷都是「誰有空誰做」。沒有人有空。"
            score="26個月"
          />
        </Step>
        <Step>
          <Toast
            bad
            icon={<Sprite art={HOURGLASS} px={8} />}
            title="太晚才做的 Switch 移植"
            body="內容鎖定後才開工。吃掉五個月，還送審失敗一次。"
            score="-5個月"
          />
        </Step>
      </Steps>
    </div>
  </Screen>
);

const stepPath = (vals: number[], w: number, y: (v: number) => number, x0 = 0) => {
  let d = `M ${x0} ${y(vals[0])}`;
  for (let i = 0; i < vals.length; i++) d += ` V ${y(vals[i])} H ${x0 + (i + 1) * w}`;
  return d;
};

const YTick = ({ y, label, w = 1144 }: { y: number; label: string; w?: number }) => (
  <>
    <div
      style={{
        ...LABEL,
        position: 'absolute',
        right: 1920 - 176,
        top: y - 9,
        fontSize: 18,
        color: C.slate,
      }}
    >
      {label}
    </div>
    <div
      style={abs(200, y - 2, {
        width: w,
        height: 4,
        background: `repeating-linear-gradient(90deg, ${C.ink} 0 8px, transparent 8px 24px)`,
      })}
    />
  </>
);

const XTick = ({ x, label }: { x: number; label: string }) => (
  <div
    style={abs(x - 80, 904, {
      ...LABEL,
      width: 160,
      textAlign: 'center',
      fontSize: 18,
      color: C.silver,
    })}
  >
    {label}
  </div>
);

const StatBox = ({
  y,
  label,
  value,
  color = C.white,
  strike = false,
  x = 1440,
  w = 360,
}: {
  y: number;
  label: string;
  value: string;
  color?: string;
  strike?: boolean;
  x?: number;
  w?: number;
}) => (
  <PixelBox x={x} y={y} w={w} h={168} fill={C.ink} edge={C.slate}>
    <div style={abs(32, 36, { ...LABEL, color: C.silver })}>{label}</div>
    <div style={{ ...DISPLAY, ...abs(32, 84), fontSize: 32, color }}>
      {value}
      {strike && (
        <div style={abs(-8, 12, { width: 'calc(100% + 16px)', height: 8, background: C.red })} />
      )}
    </div>
  </PixelBox>
);

const SCOPE = [120, 120, 150, 185, 230, 290, 330, 365, 380, 340, 300, 262, 248];

const Scope: Page = () => {
  const m = useMotion();
  const y = (v: number) => snap(560 - v * 1.4);
  const line = stepPath(SCOPE, 88, y);
  return (
    <Screen>
      <Kicker world="3-1">範圍</Kicker>
      <Title color={C.orange} shadow={C.plum}>
        範圍蔓延
      </Title>
      <Sub>規劃的內容數量（房間 + 敵人 + 道具），依季度統計</Sub>
      <YTick y={880} label="0" />
      <YTick y={740} label="100" />
      <YTick y={600} label="200" />
      <YTick y={460} label="300" />
      <YTick y={320} label="400" />
      <div
        style={abs(200, 708, {
          width: 1144,
          height: 8,
          background: `repeating-linear-gradient(90deg, ${C.cyan} 0 16px, transparent 16px 32px)`,
        })}
      />
      <div
        className="lf-m"
        style={{ ...abs(200, 320), ...m('lf-wipe 1400ms steps(26, end) 200ms both') }}
      >
        <svg width={1144} height={568} shapeRendering="crispEdges" aria-hidden="true">
          <defs>
            <pattern id="lf-dither-scope" width="16" height="16" patternUnits="userSpaceOnUse">
              <rect width="8" height="8" fill={C.orange} />
              <rect x="8" y="8" width="8" height="8" fill={C.orange} />
            </pattern>
          </defs>
          <path d={`${line} V 560 H 0 Z`} fill="url(#lf-dither-scope)" opacity={0.28} />
          <path d={line} fill="none" stroke={C.orange} strokeWidth={P} strokeLinecap="square" />
        </svg>
      </div>
      <Tag x={216} y={664} bg={C.cyan} delay={300}>
        原始規劃 · 120
      </Tag>
      <Tag x={384} y={448} stem={80} stemX={204} delay={900}>
        補助到手：+2 個生態區
      </Tag>
      <Tag x={1000} y={336} bg={C.orange} delay={1400}>
        高峰 380 · 規劃的 3.2 倍
      </Tag>
      <Tag x={1008} y={600} bg={C.white} delay={1600}>
        砍掉 2 個生態區
      </Tag>
      <XTick x={244} label="Q2 '23" />
      <XTick x={508} label="Q1 '24" />
      <XTick x={860} label="Q1 '25" />
      <XTick x={1212} label="Q1 '26" />
      <StatBox y={320} label="規劃上市" value="2024/10" color={C.silver} strike />
      <StatBox y={520} label="實際上市" value="2026/04" color={C.yellow} />
      <StatBox y={720} label="實際量 vs 規劃" value="2.1X" color={C.orange} />
    </Screen>
  );
};

const WISH = [
  2.1, 3.4, 4.6, 5.9, 8.7, 9.8, 11.0, 12.6, 53.8, 57.9, 60.5, 62.4, 66.0, 68.1, 70.4, 72.0, 74.3,
  79.0, 83.5, 89.0, 96.8, 112.0, 142.0,
];
const SOLD = [31, 52, 70, 80, 88, 96, 104];

const Wishlists: Page = () => {
  const m = useMotion();
  const y = (v: number) => snap(560 - v * 3.5);
  const wish = stepPath(WISH, 40, y);
  const sold = stepPath(SOLD, 40, y, 880);
  return (
    <Screen>
      <Kicker world="3-2">願望清單</Kicker>
      <Title color={C.cyan} shadow={C.deep}>
        從願望清單到下單
      </Title>
      <Sub>累計願望清單 vs. 銷售數量（單位：千）</Sub>
      <YTick y={880} label="0" />
      <YTick y={740} label="40K" />
      <YTick y={600} label="80K" />
      <YTick y={460} label="120K" />
      <YTick y={320} label="160K" />
      <div
        style={abs(1076, 320, {
          width: 8,
          height: 560,
          background: `repeating-linear-gradient(180deg, ${C.red} 0 16px, transparent 16px 32px)`,
        })}
      />
      <div
        className="lf-m"
        style={{ ...abs(200, 320), ...m('lf-wipe 1600ms steps(29, end) 200ms both') }}
      >
        <svg width={1168} height={568} shapeRendering="crispEdges" aria-hidden="true">
          <defs>
            <pattern id="lf-dither-wish" width="16" height="16" patternUnits="userSpaceOnUse">
              <rect width="8" height="8" fill={C.cyan} />
              <rect x="8" y="8" width="8" height="8" fill={C.cyan} />
            </pattern>
            <pattern id="lf-dither-sold" width="16" height="16" patternUnits="userSpaceOnUse">
              <rect width="8" height="8" fill={C.yellow} />
              <rect x="8" y="8" width="8" height="8" fill={C.yellow} />
            </pattern>
          </defs>
          <path d={`${wish} V 560 H 0 Z`} fill="url(#lf-dither-wish)" opacity={0.16} />
          <path d={`${sold} V 560 H 880 Z`} fill="url(#lf-dither-sold)" opacity={0.3} />
          <path d={wish} fill="none" stroke={C.cyan} strokeWidth={P} strokeLinecap="square" />
          <path d={sold} fill="none" stroke={C.yellow} strokeWidth={P} strokeLinecap="square" />
        </svg>
      </div>
      <Sprite art={FLAG} px={8} x={1076} y={256} swap={{ d: C.red, '2': C.yellow }} />
      <Tag x={1136} y={328} bg={C.red} color={C.white} delay={1500}>
        上市 · 4 月 14 日
      </Tag>
      <Tag x={408} y={616} bg={C.cyan} delay={800}>
        新品節 +41K
      </Tag>
      <Tag x={824} y={344} bg={C.cyan} delay={1400}>
        142K 願望清單
      </Tag>
      <Tag x={1192} y={440} delay={1800}>
        已售 104K
      </Tag>
      <XTick x={220} label="2024/6" />
      <XTick x={500} label="2025/1" />
      <XTick x={980} label="2026/1" />
      <XTick x={1340} label="2026/10" />
      <PixelBox x={1440} y={320} w={360} h={168} fill={C.ink} edge={C.slate}>
        <div style={abs(32, 40, { display: 'flex', alignItems: 'center', gap: 16 })}>
          <span style={{ width: 24, height: 24, background: C.cyan }} />
          <span style={{ ...LABEL, color: C.white }}>願望清單</span>
        </div>
        <div style={abs(32, 96, { display: 'flex', alignItems: 'center', gap: 16 })}>
          <span style={{ width: 24, height: 24, background: C.yellow }} />
          <span style={{ ...LABEL, color: C.white }}>銷售數量</span>
        </div>
      </PixelBox>
      <StatBox y={520} label="首週轉換率" value="15%" color={C.yellow} />
      <StatBox y={720} label="每個願望清單的銷量" value="0.73" color={C.cyan} />
    </Screen>
  );
};

const DayBar = ({
  d,
  units,
  color,
  label,
}: {
  d: number;
  units: number;
  color: string;
  label?: string;
}) => {
  const m = useMotion();
  const h = snap(units * 0.08);
  const x = 200 + (d - 1) * 88;
  return (
    <>
      <div
        className="lf-m"
        style={{
          ...abs(x, 880 - h, {
            width: 64,
            height: h,
            background: color,
            transformOrigin: '50% 100%',
          }),
          boxShadow: `inset 8px 8px 0 rgba(255,255,255,0.28), inset -8px 0 0 rgba(0,0,0,0.22)`,
          ...m(`lf-grow 480ms steps(6, end) ${150 + d * 70}ms both`),
        }}
      />
      <div
        style={abs(x - 8, 904, {
          ...LABEL,
          width: 80,
          textAlign: 'center',
          fontSize: 18,
          color: C.silver,
        })}
      >
        D{d}
      </div>
      {label && (
        <div
          style={{
            ...LABEL,
            ...abs(x - 40, 880 - h - 32, { width: 144, textAlign: 'center' }),
            fontSize: 18,
            color,
          }}
        >
          {label}
        </div>
      )}
    </>
  );
};

const LaunchWeek: Page = () => (
  <Screen>
    <Kicker world="3-3">上市</Kicker>
    <Title color="var(--osd-accent)" shadow={C.red}>
      上市首週
    </Title>
    <Sub>每日銷售數量，Steam + Switch，前 14 天</Sub>
    <YTick y={880} label="0" w={1208} />
    <YTick y={720} label="2K" w={1208} />
    <YTick y={560} label="4K" w={1208} />
    <YTick y={400} label="6K" w={1208} />
    <DayBar d={1} units={6940} color={C.yellow} label="6,940" />
    <DayBar d={2} units={4210} color={C.yellow} />
    <DayBar d={3} units={3380} color={C.yellow} />
    <DayBar d={4} units={2610} color={C.yellow} />
    <DayBar d={5} units={2050} color={C.yellow} />
    <DayBar d={6} units={1290} color={C.yellow} />
    <DayBar d={7} units={980} color={C.yellow} />
    <DayBar d={8} units={860} color={C.orange} />
    <DayBar d={9} units={1720} color={C.cyan} label="1,720" />
    <DayBar d={10} units={1340} color={C.orange} />
    <DayBar d={11} units={910} color={C.orange} />
    <DayBar d={12} units={740} color={C.orange} />
    <DayBar d={13} units={680} color={C.orange} />
    <DayBar d={14} units={610} color={C.orange} />
    <Tag x={920} y={576} bg={C.cyan} delay={1400}>
      第 9 天：一位實況主，41K 觀眾
    </Tag>
    <div style={abs(200, 944, { width: 600, height: 8, background: C.yellow, opacity: 0.6 })} />
    <div style={abs(808, 944, { width: 600, height: 8, background: C.orange, opacity: 0.6 })} />
    <div style={abs(200, 964, { ...LABEL, fontSize: 18, color: C.yellow })}>第 1 週</div>
    <div style={abs(808, 964, { ...LABEL, fontSize: 18, color: C.orange })}>第 2 週</div>
    <StatBox x={1488} w={312} y={320} label="首日" value="6,940" color={C.yellow} />
    <StatBox x={1488} w={312} y={520} label="首週" value="21,460" color={C.yellow} />
    <StatBox x={1488} w={312} y={720} label="同時在線高峰" value="4,812" color={C.cyan} />
  </Screen>
);

const Review = ({
  x,
  name,
  hours,
  up,
  quote,
  swap,
}: {
  x: number;
  name: string;
  hours: string;
  up: boolean;
  quote: string;
  swap?: Record<string, string>;
}) => (
  <PixelBox x={x} y={440} w={528} h={408} fill={C.deep} edge={up ? C.white : C.orange}>
    <PixelBox x={32} y={32} w={112} h={96} fill={DARK} edge={C.slate} shade={false}>
      <Sprite art={SLIME} px={6} x={20} y={21} swap={swap} />
    </PixelBox>
    <div style={abs(168, 44, { fontSize: 38, lineHeight: 1.1 })}>{name}</div>
    <div style={abs(168, 92, { ...LABEL, fontSize: 18, color: C.silver })}>累計遊玩 {hours}</div>
    <div style={abs(32, 160, { display: 'flex', alignItems: 'center', gap: 12 })}>
      <Sprite art={up ? ARROW_UP : ARROW_DOWN} px={4} swap={{ c: up ? C.lime : C.orange }} />
      <span style={{ ...LABEL, color: up ? C.lime : C.orange }}>{up ? '推薦' : '不推薦'}</span>
    </div>
    <div style={abs(32, 208, { width: 464, fontSize: 38, lineHeight: 1.4 })}>{quote}</div>
  </PixelBox>
);

const Reviews: Page = () => {
  const m = useMotion();
  return (
    <Screen>
      <Kicker world="4-1">評價</Kicker>
      <Title color={C.lime} shadow={C.teal}>
        玩家怎麼說
      </Title>
      <div style={abs(120, 256, { ...LABEL, fontSize: 22, color: C.lime })}>
        特別好評 · 4,107 則 Steam 評價中有 93% 好評
      </div>
      <div
        style={{
          ...LABEL,
          position: 'absolute',
          right: 120,
          top: 256,
          fontSize: 22,
          color: C.silver,
        }}
      >
        <span style={{ color: C.lime }}>3,820 推薦</span> /{' '}
        <span style={{ color: C.orange }}>287 不推薦</span>
      </div>
      <PixelBox x={120} y={296} w={1680} h={72} fill={DARK} edge={C.white} shade={false}>
        <div style={abs(16, 16, { width: 1648, height: 40, background: C.red })} />
        <div
          className="lf-m"
          style={{
            ...abs(16, 16, {
              width: 1540,
              height: 40,
              background: C.lime,
              transformOrigin: '0 50%',
            }),
            ...m('lf-fill 900ms steps(12, end) 200ms both'),
          }}
        />
        <div
          style={abs(16, 16, {
            width: 1648,
            height: 40,
            background: `repeating-linear-gradient(90deg, transparent 0 28px, ${DARK} 28px 36px)`,
          })}
        />
      </PixelBox>
      <Review
        x={120}
        name="wickfan_88"
        hours="61.4 小時"
        up
        quote="把燈油當血量真是天才。每次升級都像在跟自己對賭。"
      />
      <Review
        x={696}
        name="mothlight"
        hours="94.0 小時"
        up
        swap={{ '5': C.cyan, '6': C.sky, '7': C.blue }}
        quote="死了 212 次，第 213 次又回來了。Sunken Choir 的配樂在我腦中揮之不去。"
      />
      <Review
        x={1272}
        name="grumbleberry"
        hours="23.2 小時"
        up={false}
        swap={{ '5': C.orange, '6': C.red, '7': C.plum }}
        quote="第三幕很拖。The Hollows 就是第一幕敵人換個顏色。"
      />
    </Screen>
  );
};

const LOOT: [number, string][] = [
  [30, C.red],
  [9, C.blue],
  [6, C.sky],
  [5, C.slate],
  [38, C.yellow],
  [12, C.green],
];

const LootGrid = () => {
  const live = useIsActivePage();
  const cells: ReactNode[] = [];
  let n = 0;
  for (const [count, color] of LOOT) {
    for (let k = 0; k < count; k++) {
      const col = n % 10;
      const row = Math.floor(n / 10);
      const x = col * 56;
      const y = row * 56;
      cells.push(
        <g
          key={n}
          className="lf-m"
          style={live ? { animation: `lf-on 1ms steps(1, end) ${200 + n * 14}ms both` } : undefined}
        >
          <rect x={x} y={y} width={48} height={48} fill={color} />
          <rect x={x} y={y} width={48} height={8} fill="#FFFFFF" fillOpacity={0.3} />
          <rect x={x} y={y + 40} width={48} height={8} fill="#000000" fillOpacity={0.25} />
        </g>,
      );
      n++;
    }
  }
  return (
    <svg
      width={552}
      height={552}
      shapeRendering="crispEdges"
      aria-hidden="true"
      style={abs(32, 32)}
    >
      {cells}
    </svg>
  );
};

const LootRow = ({
  y,
  color,
  label,
  pct,
  amount,
}: {
  y: number;
  color: string;
  label: string;
  pct: string;
  amount: string;
}) => (
  <>
    <div
      style={abs(808, y + 16, {
        width: 48,
        height: 48,
        background: color,
        boxShadow: 'inset 0 8px 0 rgba(255,255,255,0.3), inset 0 -8px 0 rgba(0,0,0,0.25)',
      })}
    />
    <div style={abs(888, y + 20, { fontSize: 40, lineHeight: 1.2, whiteSpace: 'nowrap' })}>
      {label}
    </div>
    <div style={{ ...DISPLAY, position: 'absolute', right: 360, top: y + 28, fontSize: 28, color }}>
      {pct}
    </div>
    <div
      style={{
        ...DISPLAY,
        position: 'absolute',
        right: 120,
        top: y + 28,
        fontSize: 28,
        color: C.white,
      }}
    >
      {amount}
    </div>
    <div
      style={abs(808, y + 84, {
        width: 992,
        height: 4,
        background: `repeating-linear-gradient(90deg, ${C.ink} 0 8px, transparent 8px 16px)`,
      })}
    />
  </>
);

const Revenue: Page = () => (
  <Screen>
    <Kicker world="4-2">戰利品</Kicker>
    <Title color="var(--osd-accent)" shadow={C.plum}>
      $1.47M花到哪去了
    </Title>
    <Sub>截至 2026 年 10 月的累計毛營收，已計入折扣與區域定價</Sub>
    <PixelBox x={120} y={304} w={616} h={616} fill={C.ink} edge={C.silver}>
      <LootGrid />
    </PixelBox>
    <LootRow y={296} color={C.red} label="平台抽成" pct="30%" amount="$441K" />
    <LootRow y={384} color={C.blue} label="稅金" pct="9%" amount="$132K" />
    <LootRow y={472} color={C.sky} label="移植合作夥伴" pct="6%" amount="$88K" />
    <LootRow y={560} color={C.slate} label="退款 + 拒付" pct="5%" amount="$74K" />
    <LootRow y={648} color={C.yellow} label="團隊補發薪資" pct="38%" amount="$559K" />
    <LootRow y={736} color={C.green} label="第二款遊戲的資金" pct="12%" amount="$176K" />
    <PixelBox x={808} y={840} w={992} h={80} fill={C.deep} edge={C.yellow} shade={false}>
      <div
        style={abs(32, 16, {
          height: 48,
          fontSize: 36,
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        })}
      >
        <span>團隊補發薪資 ÷ 4 人 ÷ 3 年 ≈</span>
        <span style={{ ...DISPLAY, fontSize: 24, color: C.yellow }}>每人每年 $46K</span>
      </div>
    </PixelBox>
  </Screen>
);

const Lesson = ({ n, text }: { n: string; text: string }) => (
  <div
    className="lf-in"
    style={{ height: 104, display: 'flex', alignItems: 'center', gap: 32, paddingLeft: 40 }}
  >
    <div
      style={{
        width: 48,
        height: 48,
        flex: 'none',
        background: DARK,
        boxShadow: `inset 0 0 0 4px ${C.slate}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Sprite art={CHECK} px={4} />
    </div>
    <span style={{ ...DISPLAY, fontSize: 24, color: 'var(--osd-accent)' }}>{n}</span>
    <span style={{ fontSize: 44, lineHeight: 1.2, whiteSpace: 'nowrap' }}>{text}</span>
  </div>
);

const Lessons: Page = () => {
  const m = useMotion();
  return (
    <Screen>
      <Kicker world="4-3">存檔點</Kicker>
      <Title>學到的教訓</Title>
      <LightPool cx={344} cy={560} radii={[224, 160, 96]} alphas={[0.05, 0.08, 0.12]} />
      <div style={abs(336, 640, { width: 16, height: 240, background: C.slate })} />
      <div style={abs(288, 864, { width: 112, height: 16, background: C.slate })} />
      <div style={abs(296, 624, { width: 96, height: 16, background: C.slate })} />
      <Sprite art={LANTERN} px={16} x={288} y={464} />
      <div style={abs(120, 896, { width: 448, height: 8, background: C.ink })} />
      <div
        className="lf-m"
        style={{
          ...abs(120, 920, { ...LABEL, width: 448, textAlign: 'center', color: C.lime }),
          ...m('lf-blink 1.2s steps(1, end) infinite'),
        }}
      >
        遊戲已存檔
      </div>
      <PixelBox x={640} y={296} w={1160} h={632} fill={C.deep}>
        <div style={abs(40, 36, { ...LABEL, color: C.silver })}>任務日誌 · 用最辛苦的方式完成</div>
        <div style={abs(0, 80, { width: 1160 })}>
          <Steps>
            <Step>
              <Lesson n="01" text="從第一週就開始行銷，不要等到第三年。" />
            </Step>
            <Step>
              <Lesson n="02" text="要砍就早點砍整個生態區，但絕不砍打磨。" />
            </Step>
            <Step>
              <Lesson n="03" text="先做出那支 GIF 的原型，再做功能。" />
            </Step>
            <Step>
              <Lesson n="04" text="要嘛同步移植，要嘛別在該平台上市。" />
            </Step>
            <Step>
              <Lesson n="05" text="預留上市後六個月的生活費。" />
            </Step>
          </Steps>
        </div>
      </PixelBox>
    </Screen>
  );
};

const NextCard = ({
  x,
  status,
  statusBg,
  title,
  when,
  body,
  progress,
  bar,
  children,
  locked = false,
}: {
  x: number;
  status: string;
  statusBg: string;
  title: string;
  when: string;
  body: string;
  progress: number;
  bar: string;
  children: ReactNode;
  locked?: boolean;
}) => (
  <PixelBox
    x={x}
    y={296}
    w={528}
    h={600}
    fill={locked ? '#202235' : C.ink}
    edge={locked ? C.slate : C.white}
  >
    <div
      style={abs(32, 32, {
        width: 464,
        height: 208,
        background: DARK,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      {children}
    </div>
    <div
      style={abs(32, 216, {
        ...LABEL,
        fontSize: 18,
        background: statusBg,
        color: C.navy,
        padding: '7px 12px',
      })}
    >
      {status}
    </div>
    <div style={{ ...DISPLAY, ...abs(32, 280), fontSize: 28, color: locked ? C.silver : C.white }}>
      {title}
    </div>
    <div style={abs(32, 328, { ...LABEL, color: 'var(--osd-accent)' })}>{when}</div>
    <div style={abs(32, 368, { width: 464, fontSize: 34, lineHeight: 1.3, color: C.silver })}>
      {body}
    </div>
    <div
      style={abs(32, 504, {
        ...LABEL,
        fontSize: 18,
        color: C.slate,
        width: 464,
        display: 'flex',
        justifyContent: 'space-between',
      })}
    >
      <span>進度</span>
      <span style={{ color: C.white }}>{progress * 10}%</span>
    </div>
    <SegBar x={32} y={532} value={progress} w={464} color={bar} />
  </PixelBox>
);

const Next: Page = () => (
  <Screen>
    <Kicker world="5-1">二周目</Kicker>
    <Title color={C.cyan} shadow={C.deep}>
      接下來
    </Title>
    <NextCard
      x={120}
      status="進行中"
      statusBg={C.lime}
      title="EMBERS"
      when="免費更新 · 2026 年 12 月"
      body="被砍掉的一個生態區回歸，外加每日固定種子挑戰。"
      progress={7}
      bar={C.lime}
    >
      <Sprite art={FLAME} px={16} />
    </NextCard>
    <NextCard
      x={696}
      status="已簽約"
      statusBg={C.sky}
      title="主機移植"
      when="PS5 + Xbox · 2027 Q2"
      body="這次從第一天就找移植夥伴合作。"
      progress={3}
      bar={C.sky}
    >
      <Sprite art={GAMEPAD} px={16} />
    </NextCard>
    <NextCard
      x={1272}
      status="鎖定中"
      statusBg={C.slate}
      title="第二款遊戲"
      when="原型 · 2027"
      body={'起手式和 Lanternfall 一樣：48\u00a0小\u2060時，一個點子。'}
      progress={1}
      bar={C.silver}
      locked
    >
      <Sprite art={PADLOCK} px={16} />
    </NextCard>
  </Screen>
);

const Close: Page = () => {
  const m = useMotion();
  return (
    <Screen
      hud={false}
      stars
      avoid={[
        [400, 232, 1120, 336],
        [1272, 88, 544, 136],
      ]}
    >
      <Landscape />
      <LightPool cx={1128} cy={792} radii={[296, 216, 136]} alphas={[0.05, 0.07, 0.1]} />
      <div
        className="lf-m"
        style={{ ...abs(1280, 96), ...m('lf-toast 360ms steps(4, end) 900ms both') }}
      >
        <PixelBox w={520} h={112} fill={C.deep} edge={C.lime}>
          <Sprite art={TROPHY} px={6} x={32} y={26} />
          <div style={abs(120, 28, { ...LABEL, fontSize: 18, color: C.lime })}>成就解鎖</div>
          <div style={abs(120, 54, { fontSize: 36, lineHeight: 1.1 })}>撐過一場事後檢討</div>
        </PixelBox>
      </div>
      <h2
        style={{
          ...DISPLAY,
          ...abs(0, 248, { width: 1920, textAlign: 'center' }),
          fontSize: 96,
          fontWeight: 700,
          color: 'var(--osd-accent)',
          textShadow: `4px 4px 0 ${C.red}, 8px 8px 0 ${C.plum}`,
        }}
      >
        是否繼續？
      </h2>
      <div
        style={abs(0, 400, {
          width: 1920,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 24,
        })}
      >
        <span className="lf-m" style={m('lf-blink 1s steps(1, end) infinite')}>
          <Sprite art={ARROW_RIGHT} px={6} swap={{ c: C.yellow }} />
        </span>
        <span style={{ ...DISPLAY, fontSize: 40, fontWeight: 700, color: C.white }}>是</span>
        <span style={{ ...DISPLAY, fontSize: 40, fontWeight: 700, color: C.slate, marginLeft: 96 }}>
          否
        </span>
      </div>
      <div
        style={abs(0, 488, {
          width: 1920,
          textAlign: 'center',
          fontSize: 40,
          lineHeight: 1.3,
          color: C.silver,
        })}
      >
        感謝遊玩。Lanternfall 現已在 Steam 與 Switch 上架。
      </div>
      <Bob x={848} y={GROUND - 320}>
        <Sprite art={HERO} px={16} />
      </Bob>
      <Bob x={1360} y={GROUND - 144} delay={0.3} period={0.9}>
        <Sprite art={SLIME} px={16} />
      </Bob>
      <Bob x={1424} y={GROUND - 232} delay={0.3} period={0.9}>
        <Sprite art={HEART} px={8} />
      </Bob>
      <div style={abs(120, 968, { ...LABEL, fontSize: 22, color: C.white })}>mossbyte.games</div>
      <div
        style={abs(0, 968, {
          ...LABEL,
          width: 1920,
          textAlign: 'center',
          fontSize: 22,
          color: C.yellow,
        })}
      >
        Q&amp;A · 請投入問題
      </div>
      <div
        style={{
          ...LABEL,
          position: 'absolute',
          right: 120,
          top: 968,
          fontSize: 22,
          color: C.white,
        }}
      >
        @mossbyte
      </div>
    </Screen>
  );
};

export const meta: SlideMeta = {
  title: 'Lanternfall：事後檢討',
  createdAt: '2026-10-12T12:19:16.161Z',
};

export const notes: (string | undefined)[] = [
  `讓標題畫面停留一拍，游標持續閃爍。
「大家好，我們是 Mossbyte。四個人，一款遊戲，三年。」
「Lanternfall 在四月上市。這是事情經過的誠實版本，包括那些我們寧可不放上投影片的部分。」
指著最高分：「那個數字，是我們上市當天的願望清單數量。請記住它。」`,
  `「這是我們給每個人的提案，從 Jam 的評審到補助審查委員都一樣。」
用 Wick 的口吻，慢慢把對話框那一句唸出來。
接著快速帶過四個方塊：「Roguelite。Steam 和 Switch。十七點九九美元。一局大約二十五分鐘。」
「就這一句話，比任何預告片都更有用。」`,
  `「整款遊戲都建立在一個數字上：提燈的燈油。」
帶過這三列：「它是你的血量。它決定你能看多遠。它也是你買升級要付的錢。」
「所以每次逛商店都是真正的抉擇。買了更好的劍，就得摸黑走回家。」
指向那些長條：「同一個數字，三份工作。玩家在第一分鐘就能感受到。」`,
  `「這就是整間工作室。」
一人一句：Priya 負責設計與總監，Tom 負責引擎與工具，Ade 負責美術，Hanna 負責音樂與音效。
然後冷面講笑話：「請注意少了什麼。沒有製作人。沒有行銷。」
「這是伏筆。」`,
  `「從開始到上市，三十七個月。」
沿著路徑由左到右走，每個節點一口氣。
在 2-2 放慢：「新品節是這款遊戲變得真實的那一刻。一週內多了四萬一千個願望清單。」
再到 2-3，紅色那個：「然後七個月後，我們延期了。那是對的決定，但還是很痛。」`,
  `「有三件事，我們會原封不動再做一次。」
逐一點擊。談 Jam：「我們在兩天內找到核心賣點，之後再也不必回頭去找。」
談 GIF：「縮小的光圈，關掉聲音、用手機看、兩秒內就看得懂。」
談試玩版：「我們故意讓它在第一隻 Boss 就結束。大家為了想看後面的內容，加入了願望清單。」`,
  `「還有三件事，我們不會再做。」
囤積生態區：「Ade 做了六個漂亮的生態區，我們只上線四個。那是十四週的工作，躺在資料夾裡。」
行銷：「二十六個月裡，行銷就是誰有空誰做。沒有人有空。」
Switch：「我們在內容鎖定之後才移植。結果花了五個月，還有一次認證失敗。」`,
  `「把範圍蔓延真的畫成圖表，就是這個樣子。」
沿著曲線說明：「我們原本規劃一百二十個內容。補助下來之後，我們多加了兩個生態區。」
「高峰時是三百八十個，是規劃的三倍。」
「後來我們砍到兩百四十八個。還是兩倍。而上市時間從二〇二四年十月，拖到二〇二六年四月。」`,
  `「願望清單是唯一能預測任何事情的數字。」
指向那個陡升處：「新品節。在那之前的一切都是雜訊。」
再到上市那條線：「上市當天有十四萬兩千個願望清單。百分之十五在第一週就買了。」
「六個月後，賣出十萬四千套。大約每四個願望清單就有三筆銷售。」`,
  `「上市首週，一天一天來看。」
「第一天：六千九百四十套。接著就是常見的衰退曲線。」
指向第九天：「然後有一位實況主在週二晚上玩了這款遊戲。四萬一千名觀眾，等於又來了一次第一天。」
「這不是我們計畫的。我們只是很快回了那封信。」`,
  `「四千多則評價中，有百分之九十三是好評。」
把前兩則評論唸出來。
再唸第三則：「grumbleberry 說得對。第三幕本來就是被砍掉的生態區該在的地方。我們用換皮來填補空缺。」
「去看你的負評。那是你能拿到最便宜的設計回饋。」`,
  `「大家都會問錢的事，所以在這裡。」
「總營收一百四十七萬美元。在任何其他支出之前，百分之三十先給了平台。」
指向金色那塊：「百分之三十八是我們四個人的補發薪資。」
收尾那句話：「換算下來，每個人三年來每年大約四萬六千美元。獨立遊戲是可行的。但一點也不光鮮。」`,
  `「如果你只能帶一頁回家，就帶這一頁。」
五條依序點擊，每條用一句話講背後的故事。
講第四條：「如果某個平台在內容鎖定時還沒進你的版本，它就不是你的上市平台。」
講第五條：「上市不是終點。更新、移植和客服，吃掉了我們上市後的前六個月。」`,
  `「那麼接下來呢。」
「Embers 是十二月的免費更新。其中一個被砍掉的生態區會回來，感覺像是正義得到伸張。」
「主機移植已經簽約，而且這次從第一天就有合作夥伴。」
「至於第二款遊戲，已經鎖定。它會和這款一樣開始：四十八小時，一個點子。」`,
  `「這就是我們的事後檢討。謝謝大家聆聽。」
「Lanternfall 現已在 Steam 與 Switch 上架。」
指向社群帳號。「結束後歡迎來找我們，沒錯，我們會聊數字。」
開放提問。`,
];

export default [
  Cover,
  Pitch,
  Hook,
  Party,
  RoadMap,
  Right,
  Wrong,
  Scope,
  Wishlists,
  LaunchWeek,
  Reviews,
  Revenue,
  Lessons,
  Next,
  Close,
] satisfies Page[];
