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
  palette: { bg: '#F6F0E8', text: '#1B0F0A', accent: '#E0127A' },
  fonts: {
    display:
      '"Bodoni Moda", "Didot", "Bodoni 72", serif, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif',
    body: '"Jost", "Futura", "Avenir Next", sans-serif, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei"',
  },
  typeScale: { hero: 400, body: 32 },
  radius: 2,
};

const IVORY = '#F6F0E8';
const INK = '#1B0F0A';
const FUCHSIA = '#E0127A';
const TANGERINE = '#FF6A13';
const CHARTREUSE = '#CDE53B';
const LILAC = '#B7A4F2';
const OXBLOOD = '#5A0B1C';
const SOUR = '#D3203F';
const AFTERPARTY = '#8E1048';
const SAND = '#CBAE96';
const RIOT_BULLET = '#C60D6A';

const SLIDE_ID = 'ardent-colour-ss27';
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..600;1,6..96,400..600&family=Jost:wght@400;500&display=swap';
const FONT_LINK_ID = `osd-webfont-${SLIDE_ID}`;
const STYLE_ID = `osd-styles-${SLIDE_ID}`;
const KEYFRAMES = `
@keyframes ar-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes ar-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes ar-sheen { from { transform: translateX(-120%) rotate(18deg) } to { transform: translateX(120%) rotate(18deg) } }
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

const mix = (a: string, b: string, pct: number) => `color-mix(in oklab, ${a}, ${b} ${pct}%)`;
const deep = (c: string, pct: number) => mix(c, INK, pct);
const lift = (c: string, pct: number) => mix(c, '#FFFFFF', pct);

const noise = (size: number, type: string, freq: string, matrix: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><filter id='n' x='0' y='0' width='100%' height='100%'><feTurbulence type='${type}' baseFrequency='${freq}' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='matrix' values='${matrix}'/></filter><rect width='${size}' height='${size}' filter='url(#n)'/></svg>`,
  )}")`;

const GRAIN = noise(
  260,
  'fractalNoise',
  '0.82',
  '0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 0 1',
);
const SPARKLE = noise(
  180,
  'fractalNoise',
  '2.4',
  '0 0 0 0 1 0 0 0 0 0.96 0 0 0 0 0.86 22 0 0 0 -14.2',
);
const PRESSED = noise(160, 'fractalNoise', '1.1', '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.9 0');

const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
const HOLD: Keyframe[] = [{ opacity: 1 }, { opacity: 1 }];
const MORPH_MS = 960;

export const transition: SlideTransition = {
  duration: 240,
  exit: { duration: 240, easing: EASE_IN, keyframes: HOLD },
  enter: { duration: 240, easing: EASE_OUT, keyframes: [{ opacity: 0 }, { opacity: 1 }] },
};

const morphTransition: SlideTransition = {
  duration: 320,
  exit: { duration: 340, easing: EASE_IN, keyframes: HOLD },
  enter: { duration: 340, easing: EASE_OUT, keyframes: [{ opacity: 0 }, { opacity: 1 }] },
  morph: { duration: MORPH_MS, easing: 'cubic-bezier(0.65, 0, 0.25, 1)' },
};

const abs = (left: number, top: number, extra?: CSSProperties): CSSProperties => ({
  position: 'absolute',
  left,
  top,
  ...extra,
});

const DIDONE: CSSProperties = {
  fontFamily: 'var(--osd-font-display)',
  fontStyle: 'italic',
  fontWeight: 400,
  fontOpticalSizing: 'auto',
  fontKerning: 'normal',
  fontFeatureSettings: '"kern", "liga", "dlig"',
  lineHeight: 0.84,
  letterSpacing: '-0.015em',
  margin: 0,
};

const ROMAN: CSSProperties = {
  fontFamily: 'var(--osd-font-display)',
  fontStyle: 'normal',
  fontWeight: 400,
  fontOpticalSizing: 'auto',
  fontVariantNumeric: 'lining-nums',
  lineHeight: 0.9,
  letterSpacing: '-0.02em',
  margin: 0,
};

const LABEL: CSSProperties = {
  fontFamily: 'var(--osd-font-body)',
  fontSize: 20,
  fontWeight: 500,
  lineHeight: 1.2,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
};

const BODY: CSSProperties = {
  fontFamily: 'var(--osd-font-body)',
  fontSize: 'var(--osd-size-body)',
  fontWeight: 400,
  lineHeight: 1.45,
  margin: 0,
};

const pad2 = (n: number) => String(n).padStart(2, '0');

const useUid = () => useId().replace(/[^a-zA-Z0-9]/g, '');

const Grain = ({ strength = 0.32 }: { strength?: number }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      backgroundImage: GRAIN,
      backgroundSize: '260px 260px',
      mixBlendMode: 'soft-light',
      opacity: strength,
      zIndex: 6,
    }}
  />
);

type FolioProps = {
  tone: string;
  left?: number;
  right?: number;
  label?: boolean;
  number?: boolean;
};

const Folio = ({ tone, left = 120, right = 120, label = true, number = true }: FolioProps) => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left,
        right,
        bottom: 52,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        color: tone,
        zIndex: 5,
      }}
    >
      {label && <span style={{ ...LABEL, fontSize: 17 }}>Maison Ardent · 色彩報告 SS27</span>}
      <span style={{ flex: 1, height: 1, background: 'currentColor', opacity: 0.32 }} />
      {number && (
        <span style={{ ...DIDONE, fontSize: 32, lineHeight: 1, letterSpacing: 0 }}>
          {pad2(current)}
          <span
            style={{ ...LABEL, fontStyle: 'normal', fontSize: 15, marginLeft: 10, opacity: 0.7 }}
          >
            / {pad2(total)}
          </span>
        </span>
      )}
    </div>
  );
};

type FieldProps = {
  bg: string;
  color: string;
  folio?: string | false;
  children: ReactNode;
};

const Field = ({ bg, color, folio, children }: FieldProps) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      isolation: 'isolate',
      background: bg,
      color,
      fontFamily: 'var(--osd-font-body)',
    }}
  >
    {children}
    <Grain />
    {folio && <Folio tone={folio} />}
  </div>
);

const CropMark = ({
  x,
  y,
  flipX,
  flipY,
  tone,
}: {
  x: number;
  y: number;
  flipX?: boolean;
  flipY?: boolean;
  tone: string;
}) => (
  <div style={abs(x, y, { width: 0, height: 0, zIndex: 5 })}>
    <div
      style={{
        position: 'absolute',
        top: -0.5,
        [flipX ? 'right' : 'left']: 14,
        width: 30,
        height: 1,
        background: tone,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: -0.5,
        [flipY ? 'bottom' : 'top']: 14,
        width: 1,
        height: 30,
        background: tone,
      }}
    />
  </div>
);

const CropMarks = ({ tone }: { tone: string }) => (
  <>
    <CropMark x={56} y={56} tone={tone} />
    <CropMark x={1864} y={56} flipX tone={tone} />
    <CropMark x={56} y={1024} flipY tone={tone} />
    <CropMark x={1864} y={1024} flipX flipY tone={tone} />
  </>
);

const Registration = ({ x, y, tone }: { x: number; y: number; tone: string }) => (
  <svg aria-hidden width={36} height={36} viewBox="0 0 36 36" style={abs(x, y, { zIndex: 5 })}>
    <circle cx="18" cy="18" r="9" fill="none" stroke={tone} strokeWidth="1" />
    <circle cx="18" cy="18" r="4.5" fill={tone} />
    <line x1="0" y1="18" x2="36" y2="18" stroke={tone} strokeWidth="1" />
    <line x1="18" y1="0" x2="18" y2="36" stroke={tone} strokeWidth="1" />
  </svg>
);

const VerticalLabel = ({
  x,
  y,
  tone,
  children,
}: {
  x: number;
  y: number;
  tone: string;
  children: ReactNode;
}) => (
  <div
    style={abs(x, y, {
      ...LABEL,
      fontSize: 17,
      color: tone,
      transform: 'rotate(-90deg)',
      transformOrigin: '0 0',
      whiteSpace: 'nowrap',
    })}
  >
    {children}
  </div>
);

type Finish = 'matte' | 'satin' | 'gloss';

const FINISH: Record<Finish, { spec: number; blur: number; edge: number }> = {
  matte: { spec: 0.14, blur: 3.4, edge: 0.1 },
  satin: { spec: 0.34, blur: 2.2, edge: 0.3 },
  gloss: { spec: 0.82, blur: 0.7, edge: 0.5 },
};

type LipstickProps = {
  x: number;
  y: number;
  height: number;
  shade: string;
  finish?: Finish;
  shadow?: boolean;
};

const Lipstick = ({ x, y, height, shade, finish = 'satin', shadow = true }: LipstickProps) => {
  const uid = useUid();
  const ref = (name: string) => `url(#${uid}${name})`;
  const f = FINISH[finish];
  return (
    <svg
      aria-hidden
      width={height / 4}
      height={height}
      viewBox="0 0 100 400"
      style={abs(x, y, { overflow: 'visible' })}
    >
      <defs>
        <linearGradient id={`${uid}gold`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#2E1F06" />
          <stop offset="0.05" stopColor="#6B4E1A" />
          <stop offset="0.14" stopColor="#CFAE68" />
          <stop offset="0.2" stopColor="#FFF5D6" />
          <stop offset="0.235" stopColor="#FFFBEE" />
          <stop offset="0.29" stopColor="#D8B66C" />
          <stop offset="0.4" stopColor="#8E6A28" />
          <stop offset="0.52" stopColor="#5A4012" />
          <stop offset="0.62" stopColor="#A88540" />
          <stop offset="0.7" stopColor="#E3C789" />
          <stop offset="0.77" stopColor="#9C7A35" />
          <stop offset="0.88" stopColor="#3A2808" />
          <stop offset="0.95" stopColor="#6E5320" />
          <stop offset="1" stopColor="#2E1F06" />
        </linearGradient>
        <linearGradient id={`${uid}polish`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#4A330E" />
          <stop offset="0.1" stopColor="#9C7836" />
          <stop offset="0.2" stopColor="#F3DFAA" />
          <stop offset="0.26" stopColor="#FFFBEA" />
          <stop offset="0.33" stopColor="#EAD08F" />
          <stop offset="0.52" stopColor="#B99449" />
          <stop offset="0.74" stopColor="#82622A" />
          <stop offset="0.9" stopColor="#4B340F" />
          <stop offset="1" stopColor="#6E5222" />
        </linearGradient>
        <linearGradient id={`${uid}rim`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#8A6A2C" />
          <stop offset="0.3" stopColor="#FFF4D4" />
          <stop offset="0.6" stopColor="#C9A55C" />
          <stop offset="1" stopColor="#6A4D1A" />
        </linearGradient>
        <linearGradient id={`${uid}vshade`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.45" />
          <stop offset="0.1" stopColor="#000" stopOpacity="0" />
          <stop offset="0.82" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id={`${uid}bullet`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" style={{ stopColor: deep(shade, 46) }} />
          <stop offset="0.07" style={{ stopColor: deep(shade, 22) }} />
          <stop offset="0.2" style={{ stopColor: shade }} />
          <stop offset="0.3" style={{ stopColor: lift(shade, 9) }} />
          <stop offset="0.4" style={{ stopColor: shade }} />
          <stop offset="0.62" style={{ stopColor: deep(shade, 18) }} />
          <stop offset="0.86" style={{ stopColor: deep(shade, 42) }} />
          <stop offset="1" style={{ stopColor: deep(shade, 26) }} />
        </linearGradient>
        <linearGradient id={`${uid}face`} x1="0" x2="1" y1="0.2" y2="0.8">
          <stop offset="0" style={{ stopColor: lift(shade, 10) }} />
          <stop offset="0.5" style={{ stopColor: shade }} />
          <stop offset="1" style={{ stopColor: deep(shade, 14) }} />
        </linearGradient>
        <linearGradient id={`${uid}cup`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" style={{ stopColor: deep(shade, 70) }} />
          <stop offset="1" style={{ stopColor: deep(shade, 40) }} />
        </linearGradient>
        <linearGradient id={`${uid}spec`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.2" />
          <stop offset="0.3" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="0.75" stopColor="#FFFFFF" stopOpacity="0.7" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.1" />
        </linearGradient>
        <filter id={`${uid}soft`} x="-100%" y="-20%" width="300%" height="140%">
          <feGaussianBlur stdDeviation={f.blur} />
        </filter>
        <filter id={`${uid}blur`} x="-50%" y="-200%" width="200%" height="500%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      {shadow && (
        <>
          <ellipse
            cx="62"
            cy="397"
            rx="66"
            ry="8"
            fill="#1B0F0A"
            opacity="0.28"
            filter={ref('blur')}
          />
          <ellipse
            cx="50"
            cy="396"
            rx="44"
            ry="4"
            fill="#1B0F0A"
            opacity="0.45"
            filter={ref('blur')}
          />
        </>
      )}
      <path d="M8,230 L8,392 A42,5 0 0 0 92,392 L92,230 Z" fill={ref('gold')} />
      <path d="M8,230 L8,392 A42,5 0 0 0 92,392 L92,230 Z" fill={ref('vshade')} />
      <rect x="8" y="250" width="84" height="1.3" fill="#000" opacity="0.4" />
      <rect x="8" y="251.3" width="84" height="0.8" fill="#FFF3D0" opacity="0.35" />
      <rect x="8" y="374" width="84" height="1.3" fill="#000" opacity="0.35" />
      <rect x="8" y="375.3" width="84" height="0.8" fill="#FFF3D0" opacity="0.3" />
      <text
        x="50"
        y="318"
        textAnchor="middle"
        fontSize="6.4"
        letterSpacing="2.4"
        fill="#3A2708"
        opacity="0.55"
        style={{ fontFamily: 'var(--osd-font-body)', fontWeight: 500 }}
      >
        ARDENT
      </text>
      <text
        x="50"
        y="318.6"
        textAnchor="middle"
        fontSize="6.4"
        letterSpacing="2.4"
        fill="#FFF0C8"
        opacity="0.25"
        style={{ fontFamily: 'var(--osd-font-body)', fontWeight: 500 }}
      >
        ARDENT
      </text>
      <ellipse cx="50" cy="230" rx="42" ry="5" fill={ref('rim')} />
      <ellipse cx="50" cy="230.4" rx="36.5" ry="4.2" fill="#2A1C06" />
      <path d="M15,168 A35,4.2 0 0 0 85,168 L85,231 A35,4.2 0 0 1 15,231 Z" fill={ref('polish')} />
      <path
        d="M15,168 A35,4.2 0 0 0 85,168 L85,231 A35,4.2 0 0 1 15,231 Z"
        fill={ref('vshade')}
        opacity="0.6"
      />
      <ellipse cx="50" cy="168" rx="35" ry="4.2" fill={ref('rim')} />
      <ellipse cx="50" cy="168.3" rx="30" ry="3.4" fill={ref('cup')} />
      <path
        d="M20,168 L20,118 C20,112 21.6,108.6 24.4,105.2 L71.6,49.6 C74.6,46 80,46.4 80,53.4 L80,168 A30,3.4 0 0 1 20,168 Z"
        fill={ref('bullet')}
      />
      <path
        d="M20,118 C20,112 21.6,108.6 24.4,105.2 L71.6,49.6 C74.6,46 80,46.4 80,53.4 C78.6,66 70,80 57,93 C45,105 31,115 20,121.5 Z"
        fill={ref('face')}
      />
      <path
        d="M80,53.4 C78.6,66 70,80 57,93 C45,105 31,115 20,121.5"
        fill="none"
        style={{ stroke: deep(shade, 30) }}
        strokeWidth="0.7"
        opacity="0.7"
      />
      <path
        d="M24.4,105.2 L71.6,49.6 C74.6,46 80,46.4 80,53.4"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="0.6"
        strokeLinecap="round"
        opacity={f.edge}
      />
      <path
        d="M31,112 L31,166 L37,166.5 L37,104.6 Z"
        fill={ref('spec')}
        opacity={f.spec}
        filter={ref('soft')}
      />
      <path
        d="M72,70 L72,166 L75,166 L75,64 Z"
        fill="#FFFFFF"
        opacity={f.spec * 0.35}
        filter={ref('soft')}
      />
      <rect x="20" y="163" width="60" height="5" fill="#000" opacity="0.14" filter={ref('soft')} />
      <path d="M15,168 A35,4.2 0 0 0 85,168 L80,168 A30,3.4 0 0 1 20,168 Z" fill={ref('rim')} />
      <path
        d="M15,168 A35,4.2 0 0 0 85,168"
        fill="none"
        stroke="#FFF6DC"
        strokeWidth="0.6"
        opacity="0.7"
      />
    </svg>
  );
};

const METAL =
  'conic-gradient(from 205deg, #5E4416, #C9A458 30deg, #FFF0C4 56deg, #B48C3F 92deg, #6A4E1B 140deg, #3E2B0C 182deg, #8F6D2C 228deg, #E9CF8E 266deg, #FFF6D8 288deg, #A07B34 322deg, #5E4416 360deg)';
const METAL_INNER =
  'conic-gradient(from 25deg, #5E4416, #C9A458 30deg, #FFF0C4 56deg, #B48C3F 92deg, #6A4E1B 140deg, #3E2B0C 182deg, #8F6D2C 228deg, #E9CF8E 266deg, #FFF6D8 288deg, #A07B34 322deg, #5E4416 360deg)';

type PanProps = {
  x: number;
  y: number;
  d: number;
  shade: string;
  sparkle?: number;
  sheen?: boolean;
};

const Pan = ({ x, y, d, shade, sparkle = 0.5, sheen = false }: PanProps) => {
  const live = useIsActivePage();
  const k = Math.max(1, d / 220);
  return (
    <div
      style={abs(x, y, {
        width: d,
        height: d,
        borderRadius: '50%',
        background: METAL,
        boxShadow: `0 ${d * 0.09}px ${d * 0.16}px -${d * 0.05}px rgba(27,15,10,0.55), 0 ${d * 0.02}px ${d * 0.04}px rgba(27,15,10,0.3)`,
      })}
    >
      <div
        style={{
          position: 'absolute',
          inset: d * 0.03,
          borderRadius: '50%',
          background: METAL_INNER,
          boxShadow: `inset 0 ${k}px ${2 * k}px rgba(255,248,224,0.55), inset 0 -${k}px ${3 * k}px rgba(0,0,0,0.4)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: d * 0.072,
          borderRadius: '50%',
          background: '#2A1C06',
          boxShadow: `inset 0 ${3 * k}px ${6 * k}px rgba(0,0,0,0.7)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: d * 0.082,
          borderRadius: '50%',
          overflow: 'hidden',
          background: `radial-gradient(circle at 36% 30%, ${lift(shade, 20)} 0%, ${shade} 46%, ${deep(shade, 20)} 100%)`,
          boxShadow: `inset 0 ${5 * k}px ${10 * k}px rgba(0,0,0,0.32), inset 0 -${2 * k}px ${5 * k}px rgba(255,255,255,0.2)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: PRESSED,
            backgroundSize: '160px 160px',
            mixBlendMode: 'multiply',
            opacity: 0.28,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0px, rgba(255,255,255,0) ${3.2 * k}px, rgba(255,255,255,0.16) ${3.6 * k}px, rgba(0,0,0,0.1) ${4.2 * k}px, rgba(255,255,255,0) ${4.6 * k}px)`,
            WebkitMaskImage:
              'radial-gradient(circle, rgba(0,0,0,0) 38%, rgba(0,0,0,1) 52%, rgba(0,0,0,1) 100%)',
            maskImage:
              'radial-gradient(circle, rgba(0,0,0,0) 38%, rgba(0,0,0,1) 52%, rgba(0,0,0,1) 100%)',
            opacity: 0.55,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: SPARKLE,
            backgroundSize: '180px 180px',
            mixBlendMode: 'screen',
            opacity: sparkle,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...ROMAN,
            fontWeight: 500,
            fontOpticalSizing: 'none',
            fontVariationSettings: '"opsz" 10',
            fontSize: d * 0.4,
            lineHeight: 1,
            paddingTop: d * 0.02,
            color: shade,
            textShadow: `-${k}px -${k}px ${k * 1.2}px ${lift(shade, 34)}, ${k}px ${k * 1.4}px ${k * 1.8}px ${deep(shade, 42)}`,
          }}
        >
          A
        </div>
        {sheen && (
          <div
            style={{
              position: 'absolute',
              top: '-30%',
              bottom: '-30%',
              left: '20%',
              width: '34%',
              background:
                'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,250,240,0.32) 50%, rgba(255,255,255,0) 100%)',
              mixBlendMode: 'screen',
              transform: 'translateX(-120%) rotate(18deg)',
              animation: live
                ? 'ar-sheen 5.5s cubic-bezier(0.45, 0, 0.3, 1) 1.2s infinite'
                : undefined,
            }}
          />
        )}
      </div>
    </div>
  );
};

const NailBottle = ({
  x,
  y,
  height,
  shade,
}: {
  x: number;
  y: number;
  height: number;
  shade: string;
}) => {
  const uid = useUid();
  const ref = (name: string) => `url(#${uid}${name})`;
  return (
    <svg
      aria-hidden
      width={(height * 200) / 380}
      height={height}
      viewBox="0 0 200 380"
      style={abs(x, y, { overflow: 'visible' })}
    >
      <defs>
        <linearGradient id={`${uid}cap`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#050302" />
          <stop offset="0.12" stopColor="#24180F" />
          <stop offset="0.22" stopColor="#6C5A4C" />
          <stop offset="0.28" stopColor="#2A1D14" />
          <stop offset="0.7" stopColor="#0C0705" />
          <stop offset="0.9" stopColor="#3A2A1E" />
          <stop offset="1" stopColor="#090504" />
        </linearGradient>
        <linearGradient id={`${uid}liquid`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" style={{ stopColor: deep(shade, 40) }} />
          <stop offset="0.16" style={{ stopColor: deep(shade, 8) }} />
          <stop offset="0.45" style={{ stopColor: shade }} />
          <stop offset="0.8" style={{ stopColor: deep(shade, 10) }} />
          <stop offset="1" style={{ stopColor: deep(shade, 44) }} />
        </linearGradient>
        <linearGradient id={`${uid}glass`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="0.07" stopColor="#FFFFFF" stopOpacity="0.06" />
          <stop offset="0.92" stopColor="#FFFFFF" stopOpacity="0.02" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id={`${uid}base`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" style={{ stopColor: lift(shade, 30) }} stopOpacity="0.9" />
          <stop offset="1" style={{ stopColor: deep(shade, 20) }} stopOpacity="0.8" />
        </linearGradient>
        <filter id={`${uid}soft`} x="-50%" y="-10%" width="200%" height="120%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <filter id={`${uid}blur`} x="-50%" y="-300%" width="200%" height="700%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <ellipse
        cx="112"
        cy="376"
        rx="110"
        ry="10"
        fill="#1B0F0A"
        opacity="0.3"
        filter={ref('blur')}
      />
      <rect x="10" y="150" width="180" height="226" rx="26" fill={lift(shade, 30)} opacity="0.35" />
      <rect
        x="9.5"
        y="149.5"
        width="181"
        height="227"
        rx="26.5"
        fill="none"
        stroke={deep(shade, 45)}
        strokeOpacity="0.5"
        strokeWidth="1"
      />
      <rect x="22" y="176" width="156" height="164" rx="14" fill={ref('liquid')} />
      <rect x="94" y="176" width="12" height="150" rx="5" fill={deep(shade, 30)} opacity="0.35" />
      <rect x="22" y="176" width="156" height="5" rx="2" fill={lift(shade, 45)} opacity="0.8" />
      <rect x="22" y="340" width="156" height="30" rx="10" fill={ref('base')} />
      <rect x="10" y="150" width="180" height="226" rx="26" fill={ref('glass')} />
      <rect
        x="10.5"
        y="150.5"
        width="179"
        height="225"
        rx="25.5"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.55"
        strokeWidth="1.2"
      />
      <rect
        x="30"
        y="170"
        width="11"
        height="186"
        rx="5.5"
        fill="#FFFFFF"
        opacity="0.7"
        filter={ref('soft')}
      />
      <rect
        x="164"
        y="186"
        width="5"
        height="150"
        rx="2.5"
        fill="#FFFFFF"
        opacity="0.5"
        filter={ref('soft')}
      />
      <text
        x="100"
        y="268"
        textAnchor="middle"
        fontSize="13"
        letterSpacing="5"
        fill={INK}
        style={{ fontFamily: 'var(--osd-font-body)', fontWeight: 500 }}
      >
        ARDENT
      </text>
      <text
        x="100"
        y="290"
        textAnchor="middle"
        fontSize="9"
        letterSpacing="3"
        fill={INK}
        opacity="0.7"
        style={{ fontFamily: 'var(--osd-font-body)', fontWeight: 500 }}
      >
        AR-03 · 10 ML
      </text>
      <rect x="72" y="132" width="56" height="22" fill={lift(shade, 50)} opacity="0.6" />
      <rect x="60" y="0" width="80" height="140" rx="5" fill={ref('cap')} />
      <rect
        x="77"
        y="6"
        width="5"
        height="128"
        rx="2.5"
        fill="#FFFFFF"
        opacity="0.22"
        filter={ref('soft')}
      />
    </svg>
  );
};

const LinerPencil = ({
  x,
  y,
  length,
  angle,
  tip,
}: {
  x: number;
  y: number;
  length: number;
  angle: number;
  tip: string;
}) => {
  const uid = useUid();
  const ref = (name: string) => `url(#${uid}${name})`;
  return (
    <div style={abs(x, y, { transform: `rotate(${angle}deg)`, transformOrigin: '0 0' })}>
      <svg
        aria-hidden
        width={length}
        height={length / 22}
        viewBox="0 0 880 40"
        style={{ overflow: 'visible', display: 'block' }}
      >
        <defs>
          <linearGradient id={`${uid}body`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#080403" />
            <stop offset="0.18" stopColor="#4D3F37" />
            <stop offset="0.3" stopColor="#1F1410" />
            <stop offset="0.75" stopColor="#0B0605" />
            <stop offset="1" stopColor="#2C211B" />
          </linearGradient>
          <linearGradient id={`${uid}wood`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#B88C5E" />
            <stop offset="0.35" stopColor="#F2D7B0" />
            <stop offset="1" stopColor="#A57A4D" />
          </linearGradient>
          <linearGradient id={`${uid}lead`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" style={{ stopColor: deep(tip, 20) }} />
            <stop offset="0.4" style={{ stopColor: lift(tip, 18) }} />
            <stop offset="1" style={{ stopColor: deep(tip, 40) }} />
          </linearGradient>
          <linearGradient id={`${uid}band`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#6A4D1A" />
            <stop offset="0.3" stopColor="#FFF1C8" />
            <stop offset="0.6" stopColor="#B48C3F" />
            <stop offset="1" stopColor="#4E3812" />
          </linearGradient>
          <filter id={`${uid}blur`} x="-10%" y="-200%" width="120%" height="500%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <rect
          x="90"
          y="34"
          width="790"
          height="14"
          rx="7"
          fill="#1B0F0A"
          opacity="0.3"
          filter={ref('blur')}
        />
        <path d="M100,2 L880,2 L880,38 L100,38 Z" fill={ref('body')} />
        <path d="M100,2 L18,16 L18,24 L100,38 Z" fill={ref('wood')} />
        <path d="M30,14 L0,19 L0,21 L30,26 Z" fill={ref('lead')} />
        <rect x="770" y="2" width="22" height="36" fill={ref('band')} />
        <text
          x="300"
          y="25"
          fontSize="11"
          letterSpacing="5"
          fill="#E9D7A8"
          opacity="0.85"
          style={{ fontFamily: 'var(--osd-font-body)', fontWeight: 500 }}
        >
          MAISON ARDENT · ACID CHARTREUSE · AR-03
        </text>
      </svg>
    </div>
  );
};

type SwatchCardProps = {
  x: number;
  y: number;
  angle?: number;
  colour: string;
  code: string;
  name: string;
  hex: string;
};

const SwatchCard = ({ x, y, angle = 0, colour, code, name, hex }: SwatchCardProps) => (
  <div
    style={abs(x, y, {
      width: 250,
      height: 330,
      background: '#FBF8F2',
      color: INK,
      transform: `rotate(${angle}deg)`,
      boxShadow: '0 30px 50px -24px rgba(27,15,10,0.55), 0 4px 10px rgba(27,15,10,0.18)',
    })}
  >
    <div style={abs(14, 14, { width: 222, height: 168, background: colour })} />
    <div style={abs(14, 186, { width: 222, height: 34, display: 'flex' })}>
      <div style={{ flex: 1, background: deep(colour, 34) }} />
      <div style={{ flex: 1, background: deep(colour, 16) }} />
      <div style={{ flex: 1, background: lift(colour, 22) }} />
      <div style={{ flex: 1, background: lift(colour, 44) }} />
    </div>
    <div style={abs(20, 236, { ...LABEL, fontSize: 14, letterSpacing: '0.22em' })}>{code}</div>
    <div style={abs(20, 262, { ...DIDONE, fontSize: 34, lineHeight: 1, whiteSpace: 'nowrap' })}>
      {name}
    </div>
    <div style={abs(20, 302, { ...LABEL, fontSize: 13, letterSpacing: '0.16em', opacity: 0.6 })}>
      {hex}
    </div>
    <div
      style={abs(212, 300, {
        width: 14,
        height: 14,
        borderRadius: '50%',
        boxShadow: 'inset 0 1px 2px rgba(27,15,10,0.45)',
        background: '#EDE6DA',
      })}
    />
  </div>
);

const Badge = ({
  x,
  y,
  size,
  tone,
  angle = -12,
}: {
  x: number;
  y: number;
  size: number;
  tone: string;
  angle?: number;
}) => {
  const uid = useUid();
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 240 240"
      style={abs(x, y, { transform: `rotate(${angle}deg)` })}
    >
      <defs>
        <path id={`${uid}ring`} d="M120,120 m-92,0 a92,92 0 1,1 184,0 a92,92 0 1,1 -184,0" />
      </defs>
      <circle cx="120" cy="120" r="118" fill="none" stroke={tone} strokeWidth="1.2" />
      <circle cx="120" cy="120" r="70" fill="none" stroke={tone} strokeWidth="1" />
      <text
        fill={tone}
        fontSize="17"
        letterSpacing="5.6"
        style={{ fontFamily: 'var(--osd-font-body)', fontWeight: 500 }}
      >
        <textPath href={`#${uid}ring`} textLength="572" lengthAdjust="spacing">
          占比上限 9% · 刻意為之 ·
        </textPath>
      </text>
      <text
        x="122"
        y="140"
        textAnchor="middle"
        fill={tone}
        fontSize="62"
        style={{ fontFamily: 'var(--osd-font-display)', fontStyle: 'italic' }}
      >
        9%
      </text>
    </svg>
  );
};

const Chip = ({ x, y, colour, code }: { x: number; y: number; colour: string; code: string }) => (
  <div style={abs(x, y, { width: 76 })}>
    <div
      style={{
        width: 76,
        height: 76,
        background: colour,
        boxShadow: `inset 0 0 0 1px rgba(27,15,10,0.16), 0 0 0 5px ${IVORY}, 0 14px 24px -10px rgba(27,15,10,0.5)`,
      }}
    />
    <div
      style={{
        ...LABEL,
        fontSize: 15,
        letterSpacing: '0.16em',
        marginTop: 20,
        textAlign: 'center',
      }}
    >
      {code}
    </div>
  </div>
);

const Cover: Page = () => {
  const live = useIsActivePage();
  const rise = (delay: number): CSSProperties =>
    live ? { animation: `ar-rise 1.1s ${EASE_OUT} ${delay}s both` } : {};
  return (
    <Field bg="var(--osd-accent)" color={IVORY}>
      <CropMarks tone={mix(IVORY, FUCHSIA, 35)} />
      <div style={abs(120, 82, { ...ROMAN, fontSize: 26, letterSpacing: '0.42em', lineHeight: 1 })}>
        MAISON ARDENT
      </div>
      <div style={abs(0, 86, { width: 1920, textAlign: 'center', ...LABEL })}>
        色彩報告 — 2027 春夏
      </div>
      <div style={abs(1300, 86, { width: 500, textAlign: 'right', ...LABEL })}>
        第 14 期 · Paris · 2026 年 10 月
      </div>
      <div style={abs(120, 134, { width: 1680, height: 1, background: mix(IVORY, FUCHSIA, 30) })} />
      <h1
        style={abs(96, 170, {
          ...DIDONE,
          fontSize: 350,
          lineHeight: 0.8,
          ...rise(0.1),
        })}
      >
        熱力
      </h1>
      <h1
        style={abs(352, 504, {
          ...DIDONE,
          fontSize: 350,
          lineHeight: 0.8,
          ...rise(0.25),
        })}
      >
        盛季<span style={{ letterSpacing: 0 }}>。</span>
      </h1>
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, ...rise(0.45) }}>
        <Lipstick x={1494} y={196} height={760} shade={RIOT_BULLET} finish="satin" />
      </div>
      <div style={abs(120, 884, { zIndex: 3 })}>
        <Chip x={0} y={0} colour={FUCHSIA} code="AR-01" />
        <Chip x={112} y={0} colour={TANGERINE} code="AR-02" />
        <Chip x={224} y={0} colour={CHARTREUSE} code="AR-03" />
        <Chip x={336} y={0} colour={LILAC} code="AR-04" />
        <Chip x={448} y={0} colour={OXBLOOD} code="AR-05" />
      </div>
      <div style={abs(700, 884, { width: 620 })}>
        <div style={{ ...DIDONE, fontSize: 44, lineHeight: 1.05 }}>
          為喧鬧的夏天準備的五種色彩，
        </div>
        <div style={{ ...LABEL, marginTop: 18 }}>以及裸色為何停止成長</div>
      </div>
    </Field>
  );
};

const Plus = () => (
  <span
    style={{
      fontFamily: 'var(--osd-font-body)',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '0.46em',
      verticalAlign: '0.36em',
      marginRight: '0.08em',
    }}
  >
    +
  </span>
);

const Signal = ({
  figure,
  unit,
  caption,
}: {
  figure: ReactNode;
  unit?: string;
  caption: ReactNode;
}) => (
  <div style={{ borderTop: `1px solid ${mix(INK, IVORY, 72)}`, paddingTop: 30 }}>
    <div style={{ ...ROMAN, fontSize: 104, lineHeight: 0.9 }}>
      {figure}
      {unit && <span style={{ fontSize: 56, marginLeft: 6 }}>{unit}</span>}
    </div>
    <p
      style={{ ...BODY, fontSize: 26, lineHeight: 1.4, marginTop: 18, color: mix(INK, IVORY, 22) }}
    >
      {caption}
    </p>
  </div>
);

const QUOTE_MARK: CSSProperties = {
  color: 'var(--osd-accent)',
  fontVariationSettings: '"opsz" 6',
  fontWeight: 400,
};

const Letter: Page = () => (
  <Field bg="var(--osd-bg)" color="var(--osd-text)" folio={INK}>
    <VerticalLabel x={62} y={404} tone={mix(INK, IVORY, 40)}>
      編者的話 — 第 14 期
    </VerticalLabel>
    <div style={abs(200, 120, { ...LABEL, color: 'var(--osd-accent)' })}>核心主張</div>
    <blockquote style={abs(200, 196, { margin: 0, width: 1000 })}>
      <p style={{ ...DIDONE, fontSize: 124, lineHeight: 0.98, position: 'relative' }}>
        <span style={{ ...QUOTE_MARK, position: 'absolute', right: '100%' }}>“</span>
        經過三季的米色，她想要的是
        <span style={{ color: 'var(--osd-accent)' }}>
          存在感。<span style={QUOTE_MARK}>”</span>
        </span>
      </p>
    </blockquote>
    <div style={abs(200, 640, { display: 'flex', alignItems: 'baseline', gap: 20 })}>
      <span style={{ ...DIDONE, fontSize: 40, lineHeight: 1 }}>— Camille Roux</span>
      <span style={{ ...LABEL, fontSize: 17, color: mix(INK, IVORY, 40) }}>色彩創意總監</span>
    </div>
    <p style={abs(200, 734, { ...BODY, width: 880, color: mix(INK, IVORY, 18) })}>
      裸色唇妝撐了三季，如今已停止成長。當初買它的顧客，正在買第二支更大膽的顏色——而且兩支一起用。
    </p>
    <div style={abs(1300, 160, { width: 500, display: 'flex', flexDirection: 'column', gap: 44 })}>
      <Signal
        figure="29"
        unit="%"
        caption={
          <>
            2026 年裸色占唇彩銷售的比重，從 2023 年的 <b style={{ fontWeight: 500 }}>41%</b>
            下滑而來。
          </>
        }
      />
      <Signal
        figure={
          <>
            <Plus />
            212
          </>
        }
        unit="%"
        caption="「大膽唇色」搜尋量的年增幅。"
      />
      <Signal
        figure="2.6"
        caption={
          <>
            支亮色，是 18–34 歲買家平均擁有的數量；其他族群只有{' '}
            <b style={{ fontWeight: 500 }}>1.1</b> 支。
          </>
        }
      />
    </div>
  </Field>
);

const BRIGHTS = [52, 55, 58, 61, 66, 70, 74, 78];
const NUDES = [81, 79, 76, 72, 69, 66, 63, 61];
const sx = (q: number) => 16 + (q * 500) / 7;
const sy = (v: number) => 176 - ((v - 45) / 40) * 156;
const line = (vals: number[]) => vals.map((v, q) => `${q ? 'L' : 'M'}${sx(q)},${sy(v)}`).join(' ');

const SIGNAL_TEXT = mix(IVORY, INK, 30);
const SIGNAL_RULE = mix(IVORY, INK, 78);

const Dot = ({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) => (
  <circle cx={cx} cy={cy} r={r} fill={fill} />
);

const AxisNote = ({
  x,
  y,
  anchor = 'start',
  children,
}: {
  x: number;
  y: number;
  anchor?: 'start' | 'end' | 'middle';
  children: ReactNode;
}) => (
  <text
    x={x}
    y={y}
    textAnchor={anchor}
    fill={SIGNAL_TEXT}
    fontSize="17"
    letterSpacing="2.4"
    style={{ fontFamily: 'var(--osd-font-body)', fontWeight: 500 }}
  >
    {children}
  </text>
);

const SellThroughChart = () => (
  <svg
    aria-hidden
    width={540}
    height={220}
    viewBox="0 0 540 220"
    style={{ overflow: 'visible', display: 'block' }}
  >
    <line x1="16" x2="516" y1="196" y2="196" stroke={SIGNAL_RULE} strokeWidth="1" />
    <path
      d={line(NUDES)}
      fill="none"
      stroke={SAND}
      strokeWidth="2"
      strokeDasharray="2 7"
      strokeLinecap="round"
    />
    <path d={line(BRIGHTS)} fill="none" stroke={FUCHSIA} strokeWidth="3" strokeLinejoin="round" />
    <Dot cx={sx(7)} cy={sy(78)} r={7} fill={FUCHSIA} />
    <Dot cx={sx(7)} cy={sy(61)} r={5} fill={SAND} />
    <circle
      cx={sx(4.5)}
      cy={sy(67.6)}
      r={11}
      fill="none"
      stroke={IVORY}
      strokeWidth="1"
      opacity="0.6"
    />
    <AxisNote x={16} y={222}>
      Q3 ’24
    </AxisNote>
    <AxisNote x={516} y={222} anchor="end">
      Q2 ’26
    </AxisNote>
    <AxisNote x={sx(4.5)} y={sy(67.6) + 40} anchor="middle">
      交叉
    </AxisNote>
  </svg>
);

const CHEEK = [100, 108, 115, 124, 133, 142, 156, 168];
const Bar = ({ q, v, last }: { q: number; v: number; last?: boolean }) => (
  <rect
    x={16 + q * 66}
    y={196 - (v / 168) * 170}
    width={40}
    height={(v / 168) * 170}
    fill={last ? TANGERINE : mix(TANGERINE, INK, 42)}
  />
);

const CheekChart = () => (
  <svg
    aria-hidden
    width={540}
    height={220}
    viewBox="0 0 540 220"
    style={{ overflow: 'visible', display: 'block' }}
  >
    <Bar q={0} v={CHEEK[0]} />
    <Bar q={1} v={CHEEK[1]} />
    <Bar q={2} v={CHEEK[2]} />
    <Bar q={3} v={CHEEK[3]} />
    <Bar q={4} v={CHEEK[4]} />
    <Bar q={5} v={CHEEK[5]} />
    <Bar q={6} v={CHEEK[6]} />
    <Bar q={7} v={CHEEK[7]} last />
    <line x1="16" x2="516" y1="196" y2="196" stroke={SIGNAL_RULE} strokeWidth="1" />
    <AxisNote x={16} y={222}>
      Q3 ’24
    </AxisNote>
    <AxisNote x={516} y={222} anchor="end">
      Q2 ’26
    </AxisNote>
  </svg>
);

const ReturnRow = ({
  y,
  label,
  value,
  colour,
}: {
  y: number;
  label: string;
  value: number;
  colour: string;
}) => (
  <g>
    <AxisNote x={16} y={y - 14}>
      {label}
    </AxisNote>
    <rect x={16} y={y} width={(value / 12) * 420} height={22} fill={colour} />
    <text
      x={16 + (value / 12) * 420 + 16}
      y={y + 20}
      fill={IVORY}
      fontSize="28"
      style={{ fontFamily: 'var(--osd-font-display)', fontStyle: 'italic' }}
    >
      {value.toFixed(1)}%
    </text>
  </g>
);

const ReturnsChart = () => (
  <svg
    aria-hidden
    width={540}
    height={220}
    viewBox="0 0 540 220"
    style={{ overflow: 'visible', display: 'block' }}
  >
    <ReturnRow y={64} label="裸色" value={11.2} colour={SAND} />
    <ReturnRow y={156} label="亮色" value={6.4} colour={LILAC} />
    <line x1="16" x2="516" y1="196" y2="196" stroke={SIGNAL_RULE} strokeWidth="1" />
    <AxisNote x={16} y={222}>
      退貨率，2026 上半年
    </AxisNote>
  </svg>
);

const SignalColumn = ({
  index,
  figure,
  chart,
  caption,
}: {
  index: string;
  figure: ReactNode;
  chart: ReactNode;
  caption: ReactNode;
}) => (
  <div style={{ width: 540 }}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <span style={{ ...ROMAN, fontSize: 120, lineHeight: 0.9 }}>{figure}</span>
      <span style={{ ...DIDONE, fontSize: 36, color: SIGNAL_TEXT }}>{index}</span>
    </div>
    <div style={{ marginTop: 44 }}>{chart}</div>
    <p
      style={{ ...BODY, fontSize: 26, lineHeight: 1.4, marginTop: 52, color: mix(IVORY, INK, 14) }}
    >
      {caption}
    </p>
  </div>
);

const Signals: Page = () => (
  <Field bg={INK} color={IVORY} folio={IVORY}>
    <div style={abs(120, 120, { ...LABEL, color: lift(FUCHSIA, 30) })}>市場訊號</div>
    <h2 style={abs(120, 168, { ...DIDONE, fontSize: 132, lineHeight: 0.95 })}>
      大膽款，賣贏了低調款。
    </h2>
    <div style={abs(120, 392, { display: 'flex', gap: 30 })}>
      <Steps>
        <Step duration={420}>
          <SignalColumn
            index="i."
            figure="78%"
            chart={<SellThroughChart />}
            caption="亮色唇彩的原價售出率。裸色滑落至 61%——兩條線在 Q1 交叉。"
          />
        </Step>
        <Step duration={420}>
          <SignalColumn
            index="ii."
            figure={
              <>
                <Plus />
                68%
              </>
            }
            chart={<CheekChart />}
            caption="八季以來腮紅與頰彩的銷售件數。色彩已從嘴唇一路往臉上移動。"
          />
        </Step>
        <Step duration={420}>
          <SignalColumn
            index="iii."
            figure="6.4%"
            chart={<ReturnsChart />}
            caption="亮色的退貨率：退回的是失望，不是張力。"
          />
        </Step>
      </Steps>
    </div>
  </Field>
);

type StripeProps = {
  left: number;
  width: number;
  colour: string;
  ink: string;
  code: string;
  share: string;
  name: string;
  hex: string;
};

const STRIPE_TOP = 300;

const Stripe = ({ left, width, colour, ink, code, share, name, hex }: StripeProps) => (
  <div style={abs(left, STRIPE_TOP, { width, height: 1080 - STRIPE_TOP, color: ink })}>
    <div style={{ position: 'absolute', inset: 0, background: colour }} />
    <div style={abs(36, 36, LABEL)}>{code}</div>
    <div style={abs(36, 74, { ...ROMAN, fontSize: 64 })}>{share}</div>
    <div style={abs(36, 152, { ...LABEL, fontSize: 15, letterSpacing: '0.12em', opacity: 0.75 })}>
      {hex}
    </div>
    <div
      style={abs(30, 0, {
        ...DIDONE,
        fontSize: 68,
        lineHeight: 1,
        top: 'auto',
        bottom: 40,
        writingMode: 'vertical-rl',
        transform: 'rotate(180deg)',
        whiteSpace: 'nowrap',
      })}
    >
      {name}
    </div>
  </div>
);

const RIOT_FIELD = 'ar-riot-field';

const TheFive: Page = () => (
  <Field bg="var(--osd-bg)" color="var(--osd-text)">
    <div style={abs(120, 80, { ...LABEL, color: 'var(--osd-accent)' })}>色彩故事</div>
    <h2 style={abs(112, 112, { ...DIDONE, fontSize: 168 })}>五色。</h2>
    <p style={abs(1160, 104, { ...BODY, fontSize: 30, width: 640, color: mix(INK, IVORY, 18) })}>
      五種顏色，依其在系列中的占比決定大小。兩色領軍、兩色輔助——還有一色，專門來挑戰你。
    </p>
    <MorphElement id={RIOT_FIELD}>
      <div
        style={abs(0, STRIPE_TOP, { width: 538, height: 1080 - STRIPE_TOP, background: FUCHSIA })}
      />
    </MorphElement>
    <Stripe
      left={0}
      width={538}
      colour="transparent"
      ink={IVORY}
      code="AR-01"
      share="28%"
      name="Fuchsia Riot"
      hex="#E0127A"
    />
    <Stripe
      left={538}
      width={422}
      colour={TANGERINE}
      ink={INK}
      code="AR-02"
      share="22%"
      name="Tangerine Heat"
      hex="#FF6A13"
    />
    <Stripe
      left={960}
      width={173}
      colour={CHARTREUSE}
      ink={INK}
      code="AR-03"
      share="9%"
      name="Acid Chartreuse"
      hex="#CDE53B"
    />
    <Stripe
      left={1133}
      width={346}
      colour={LILAC}
      ink={INK}
      code="AR-04"
      share="18%"
      name="Lilac Static"
      hex="#B7A4F2"
    />
    <Stripe
      left={1479}
      width={441}
      colour={OXBLOOD}
      ink={IVORY}
      code="AR-05"
      share="23%"
      name="Oxblood Velvet"
      hex="#5A0B1C"
    />
  </Field>
);

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div style={{ flex: 1 }}>
    <div style={{ ...LABEL, fontSize: 16, opacity: 0.78 }}>{label}</div>
    <div style={{ ...DIDONE, fontSize: 46, lineHeight: 1, marginTop: 14, whiteSpace: 'nowrap' }}>
      {value}
    </div>
  </div>
);

const StatRow = ({
  x,
  width,
  rule,
  children,
}: {
  x: number;
  width: number;
  rule: string;
  children: ReactNode;
}) => (
  <div
    style={abs(x, 846, {
      width,
      borderTop: `1px solid ${rule}`,
      paddingTop: 26,
      display: 'flex',
      gap: 32,
    })}
  >
    {children}
  </div>
);

const Riot: Page = () => {
  const live = useIsActivePage();
  const late: CSSProperties = live
    ? { animation: `ar-fade 0.7s ${EASE_OUT} ${MORPH_MS}ms both` }
    : {};
  return (
    <Field bg="var(--osd-bg)" color={IVORY}>
      <MorphElement id={RIOT_FIELD}>
        <div style={abs(0, 0, { width: 1920, height: 1080, background: FUCHSIA })} />
      </MorphElement>
      <div style={{ position: 'absolute', inset: 0, ...late }}>
        <div style={abs(120, 112, LABEL)}>AR-01 — 主打色</div>
        <h2 style={abs(108, 160, { ...DIDONE, fontSize: 230 })}>
          Fuchsia
          <br />
          Riot.
        </h2>
        <div style={abs(120, 590, { ...DIDONE, fontSize: 46, lineHeight: 1.1 })}>
          電光般耀眼、毫不道歉，七月的晚上十點。
        </div>
        <p style={abs(120, 672, { ...BODY, width: 820 })}>
          獻給自 2023
          年起每場會議都穿米色、如今不想再委屈自己的女人。藍調底色，讓牙齒更亮白，也喚醒每一種膚色深度。
        </p>
        <StatRow x={120} width={900} rule={mix(IVORY, FUCHSIA, 45)}>
          <Stat label="系列占比" value="28%" />
          <Stat label="主要品項" value="唇彩、腮紅" />
          <Stat label="質地" value="緞面、霧面" />
        </StatRow>
        <SwatchCard
          x={1520}
          y={150}
          angle={6}
          colour={FUCHSIA}
          code="AR-01"
          name="Fuchsia Riot"
          hex="#E0127A"
        />
        <Lipstick x={1268} y={196} height={680} shade={RIOT_BULLET} finish="satin" />
        <Pan x={1446} y={566} d={360} shade={deep(FUCHSIA, 4)} sparkle={0.35} />
        <Folio tone={IVORY} />
      </div>
    </Field>
  );
};

const Tangerine: Page = () => (
  <Field bg={TANGERINE} color={INK} folio={INK}>
    <Pan x={120} y={226} d={600} shade={mix(TANGERINE, '#C2551E', 30)} sparkle={0.55} sheen />
    <Lipstick x={672} y={410} height={500} shade={mix(TANGERINE, '#E43A1F', 20)} finish="gloss" />
    <div style={abs(940, 112, LABEL)}>AR-02 — 輔助色</div>
    <h2 style={abs(928, 160, { ...DIDONE, fontSize: 216 })}>
      Tangerine
      <br />
      Heat.
    </h2>
    <div style={abs(940, 590, { ...DIDONE, fontSize: 46, lineHeight: 1.1 })}>
      陽光灑落、多汁鮮甜，Marseille 的下午四點。
    </div>
    <p style={abs(940, 672, { ...BODY, width: 860 })}>
      先是臉頰，再是嘴唇。薄透上色時，呈現的是暖意而非橘色：像在戶外慢慢吃完一頓長長的午餐後，帶回家的那抹紅暈。
    </p>
    <StatRow x={940} width={860} rule={deep(TANGERINE, 45)}>
      <Stat label="系列占比" value="22%" />
      <Stat label="主要品項" value="頰彩、唇彩" />
      <Stat label="質地" value="透薄、亮面" />
    </StatRow>
  </Field>
);

const Chartreuse: Page = () => (
  <Field bg={CHARTREUSE} color={INK} folio={INK}>
    <div style={abs(120, 112, LABEL)}>AR-03 — 點綴色，限量控制</div>
    <h2 style={abs(108, 160, { ...DIDONE, fontSize: 230 })}>
      Acid
      <br />
      Chartreuse.
    </h2>
    <div style={abs(120, 590, { ...DIDONE, fontSize: 46, lineHeight: 1.1 })}>
      酸勁十足、圖像感強烈，大家都會拍下來的那一色。
    </div>
    <p style={abs(120, 672, { ...BODY, width: 860 })}>
      它是調味料，不是主菜。我們不讓它上臉，因為它會讓膚色顯得暗黃；而是放在最能發光的地方：一抹眼線，加上十片亮眼的指甲。
    </p>
    <StatRow x={120} width={900} rule={deep(CHARTREUSE, 45)}>
      <Stat label="系列占比" value="9%" />
      <Stat label="主要品項" value="眼線、指甲油" />
      <Stat label="品項數" value="兩款，限量" />
    </StatRow>
    <NailBottle x={1296} y={340} height={540} shade={mix(CHARTREUSE, '#8FA514', 30)} />
    <LinerPencil x={1120} y={930} length={720} angle={-12} tip={CHARTREUSE} />
    <Badge x={1580} y={150} size={230} tone={INK} />
  </Field>
);

const DuoHalf = ({
  x,
  code,
  rank,
  first,
  second,
  mood,
  body,
  share,
  lands,
  rule,
}: {
  x: number;
  code: string;
  rank: string;
  first: string;
  second: string;
  mood: string;
  body: string;
  share: string;
  lands: string;
  rule: string;
}) => (
  <>
    <div style={abs(x, 112, LABEL)}>
      {code} — {rank}
    </div>
    <h2 style={abs(x - 8, 160, { ...DIDONE, fontSize: 168 })}>
      {first}
      <br />
      {second}
    </h2>
    <div style={abs(x, 486, { ...DIDONE, fontSize: 40, lineHeight: 1.1, width: 560 })}>{mood}</div>
    <p style={abs(x, 590, { ...BODY, fontSize: 30, width: 490 })}>{body}</p>
    <StatRow x={x} width={720} rule={rule}>
      <Stat label="系列占比" value={share} />
      <Stat label="主要品項" value={lands} />
    </StatRow>
  </>
);

const Duo: Page = () => (
  <Field bg={LILAC} color={INK}>
    <div style={abs(960, 0, { width: 960, height: 1080, background: OXBLOOD })} />
    <div style={{ position: 'absolute', inset: 0, color: INK }}>
      <DuoHalf
        x={120}
        code="AR-04"
        rank="輔助色"
        first="Lilac"
        second="Static."
        mood="冷冽、帶電、微微甜膩。"
        body="為這一季滿滿的熱度，帶來冷調的平衡。用在眼皮與臉部高光處，珍珠光澤能捕捉閃光燈。"
        share="18%"
        lands="眼影、打亮"
        rule={deep(LILAC, 45)}
      />
    </div>
    <div style={{ position: 'absolute', inset: 0, color: IVORY }}>
      <DuoHalf
        x={1080}
        code="AR-05"
        rank="主打色"
        first="Oxblood"
        second="Velvet."
        mood="濃郁、燭光搖曳、最後一桌。"
        body="全場最成熟的那一位。近乎墨黑的紅，獻給不碰粉紅的女性——我們通往秋天的橋梁。"
        share="23%"
        lands="唇彩、指甲油"
        rule={mix(IVORY, OXBLOOD, 55)}
      />
    </div>
    <Pan x={636} y={548} d={270} shade={LILAC} sparkle={0.9} sheen />
    <Lipstick x={1680} y={396} height={420} shade={mix(OXBLOOD, '#A3182F', 45)} finish="matte" />
    <Folio tone={INK} right={1040} number={false} />
    <Folio tone={IVORY} left={1080} label={false} />
  </Field>
);

type BulletProps = {
  cx: number;
  shade: string;
  finish: Finish;
  name: string;
  code: string;
};

const SHELF = 820;
const FINISH_ZH: Record<Finish, string> = { matte: '霧面', satin: '緞面', gloss: '亮面' };

const RangeBullet = ({ cx, shade, finish, name, code }: BulletProps) => (
  <>
    <Lipstick x={cx - 57.5} y={SHELF - 460} height={460} shade={shade} finish={finish} />
    <div style={abs(cx - 140, SHELF + 34, { width: 280, textAlign: 'center' })}>
      <div style={{ ...DIDONE, fontSize: 46, lineHeight: 1, whiteSpace: 'nowrap' }}>{name}</div>
      <div style={{ ...LABEL, fontSize: 15, marginTop: 16, color: mix(INK, IVORY, 35) }}>
        {FINISH_ZH[finish]} · {code}
      </div>
    </div>
  </>
);

const Range: Page = () => (
  <Field bg="var(--osd-bg)" color="var(--osd-text)" folio={INK}>
    <div style={abs(120, 112, { ...LABEL, color: 'var(--osd-accent)' })}>產品系列</div>
    <h2 style={abs(112, 156, { ...DIDONE, fontSize: 132 })}>六支唇膏，同一價格。</h2>
    <div style={abs(1460, 112, { width: 340, textAlign: 'right' })}>
      <div style={{ ...ROMAN, fontSize: 150, lineHeight: 0.86 }}>€38</div>
      <div style={{ ...LABEL, fontSize: 15, marginTop: 18, color: mix(INK, IVORY, 35) }}>
        可補充式外殼 · 替換膏芯 €24
      </div>
    </div>
    <div style={abs(120, SHELF, { width: 1680, height: 1, background: mix(INK, IVORY, 70) })} />
    <RangeBullet cx={260} shade={RIOT_BULLET} finish="satin" name="Riot" code="AR-01" />
    <RangeBullet
      cx={540}
      shade={mix(TANGERINE, '#E43A1F', 20)}
      finish="gloss"
      name="Heatwave"
      code="AR-02"
    />
    <RangeBullet cx={820} shade={SOUR} finish="matte" name="Sour" code="AR-01/02" />
    <RangeBullet
      cx={1100}
      shade={mix(LILAC, '#B06AA8', 35)}
      finish="satin"
      name="Static"
      code="AR-04"
    />
    <RangeBullet
      cx={1380}
      shade={mix(OXBLOOD, '#7A0F25', 30)}
      finish="matte"
      name="Velvet Hour"
      code="AR-05"
    />
    <RangeBullet cx={1660} shade={AFTERPARTY} finish="gloss" name="Afterparty" code="AR-01/05" />
  </Field>
);

const COL_X = [430, 640, 850, 1060, 1270];
const ROW_TOP = 470;
const ROW_H = 80;

const Approval = ({
  col,
  row,
  value,
  colour,
}: {
  col: number;
  row: number;
  value: number;
  colour: string;
}) => {
  const d = 22 + ((value - 80) / 16) * 42;
  const cx = COL_X[col];
  const cy = ROW_TOP + row * ROW_H + ROW_H / 2;
  return (
    <>
      <div
        style={abs(cx - d / 2, cy - d / 2, {
          width: d,
          height: d,
          borderRadius: '50%',
          background: colour,
          boxShadow:
            value === 81
              ? `0 0 0 5px ${INK}, 0 0 0 6px ${IVORY}`
              : colour === OXBLOOD
                ? `0 0 0 1px ${mix(IVORY, INK, 60)}`
                : undefined,
        })}
      />
      <div
        style={abs(cx + 40, cy - 11, {
          fontFamily: 'var(--osd-font-body)',
          fontSize: 18,
          lineHeight: '22px',
          fontVariantNumeric: 'tabular-nums',
          color: value === 81 ? IVORY : mix(IVORY, INK, 40),
        })}
      >
        {value}
      </div>
    </>
  );
};

const DepthRow = ({ row, numeral, skin }: { row: number; numeral: string; skin: string }) => (
  <>
    <div
      style={abs(120, ROW_TOP + row * ROW_H, {
        width: 1250,
        height: ROW_H,
        borderTop: `1px solid ${mix(IVORY, INK, 84)}`,
      })}
    />
    <div
      style={abs(130, ROW_TOP + row * ROW_H + ROW_H / 2 - 18, {
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: skin,
      })}
    />
    <div style={abs(190, ROW_TOP + row * ROW_H + 18, { ...DIDONE, fontSize: 40, lineHeight: 1 })}>
      {numeral}
    </div>
  </>
);

const ColumnHead = ({ col, name, colour }: { col: number; name: string; colour: string }) => (
  <div style={abs(COL_X[col] - 100, 396, { width: 200, textAlign: 'center' })}>
    <div style={{ width: 28, height: 4, background: colour, margin: '0 auto 14px' }} />
    <div style={{ ...DIDONE, fontSize: 30, lineHeight: 1 }}>{name}</div>
  </div>
);

const WearTest: Page = () => (
  <Field bg={INK} color={IVORY} folio={IVORY}>
    <div style={abs(120, 112, { ...LABEL, color: lift(FUCHSIA, 30) })}>試用測試</div>
    <h2 style={abs(112, 156, { ...DIDONE, fontSize: 120 })}>每個顏色，每種膚色深度。</h2>
    <p style={abs(120, 290, { ...BODY, fontSize: 28, color: mix(IVORY, INK, 30) })}>
      六座城市共 412 位試用者，每人試用十四天。圓點大小代表認可度。
    </p>
    <ColumnHead col={0} name="Riot" colour={FUCHSIA} />
    <ColumnHead col={1} name="Heat" colour={TANGERINE} />
    <ColumnHead col={2} name="Acid" colour={CHARTREUSE} />
    <ColumnHead col={3} name="Static" colour={LILAC} />
    <ColumnHead col={4} name="Velvet" colour={mix(OXBLOOD, IVORY, 18)} />
    <DepthRow row={0} numeral="I" skin="#F1D6C2" />
    <DepthRow row={1} numeral="II" skin="#E2B994" />
    <DepthRow row={2} numeral="III" skin="#C99369" />
    <DepthRow row={3} numeral="IV" skin="#A06A45" />
    <DepthRow row={4} numeral="V" skin="#76462B" />
    <DepthRow row={5} numeral="VI" skin="#4A2B1C" />
    <Approval col={0} row={0} value={91} colour={FUCHSIA} />
    <Approval col={1} row={0} value={84} colour={TANGERINE} />
    <Approval col={2} row={0} value={82} colour={CHARTREUSE} />
    <Approval col={3} row={0} value={92} colour={LILAC} />
    <Approval col={4} row={0} value={86} colour={OXBLOOD} />
    <Approval col={0} row={1} value={92} colour={FUCHSIA} />
    <Approval col={1} row={1} value={88} colour={TANGERINE} />
    <Approval col={2} row={1} value={84} colour={CHARTREUSE} />
    <Approval col={3} row={1} value={90} colour={LILAC} />
    <Approval col={4} row={1} value={88} colour={OXBLOOD} />
    <Approval col={0} row={2} value={94} colour={FUCHSIA} />
    <Approval col={1} row={2} value={92} colour={TANGERINE} />
    <Approval col={2} row={2} value={86} colour={CHARTREUSE} />
    <Approval col={3} row={2} value={87} colour={LILAC} />
    <Approval col={4} row={2} value={91} colour={OXBLOOD} />
    <Approval col={0} row={3} value={92} colour={FUCHSIA} />
    <Approval col={1} row={3} value={94} colour={TANGERINE} />
    <Approval col={2} row={3} value={87} colour={CHARTREUSE} />
    <Approval col={3} row={3} value={85} colour={LILAC} />
    <Approval col={4} row={3} value={93} colour={OXBLOOD} />
    <Approval col={0} row={4} value={90} colour={FUCHSIA} />
    <Approval col={1} row={4} value={93} colour={TANGERINE} />
    <Approval col={2} row={4} value={88} colour={CHARTREUSE} />
    <Approval col={3} row={4} value={83} colour={LILAC} />
    <Approval col={4} row={4} value={95} colour={OXBLOOD} />
    <Approval col={0} row={5} value={89} colour={FUCHSIA} />
    <Approval col={1} row={5} value={91} colour={TANGERINE} />
    <Approval col={2} row={5} value={87} colour={CHARTREUSE} />
    <Approval col={3} row={5} value={81} colour={LILAC} />
    <Approval col={4} row={5} value={96} colour={OXBLOOD} />
    <div style={abs(1480, 396, { width: 320 })}>
      <div style={{ ...LABEL, fontSize: 16, color: mix(IVORY, INK, 30) }}>最低門檻</div>
      <div
        style={{
          ...ROMAN,
          fontSize: 168,
          lineHeight: 0.9,
          marginTop: 20,
          color: LILAC,
        }}
      >
        81%
      </div>
      <p
        style={{
          ...BODY,
          fontSize: 26,
          lineHeight: 1.4,
          marginTop: 28,
          color: mix(IVORY, INK, 14),
        }}
      >
        Lilac Static 在膚色深度 VI 的成績，是改用偏暖底色、兩度重新調配後的結果。低於 80%
        的產品一律不出貨。
      </p>
    </div>
  </Field>
);

const GRID_X = 540;
const MONTH_W = 210;
const LANE_TOP = 424;
const CHANNEL_H = 128;

const Lane = ({
  channel,
  lane,
  start,
  colour,
}: {
  channel: number;
  lane: number;
  start: number;
  colour: string;
}) => {
  const x = GRID_X + start * MONTH_W;
  const y = LANE_TOP + channel * CHANNEL_H + 18 + lane * 20;
  return (
    <>
      <div style={abs(x, y, { width: GRID_X + 6 * MONTH_W - x, height: 12, background: colour })} />
      <div style={abs(x - 4, y - 4, { width: 4, height: 20, background: colour })} />
    </>
  );
};

const Month = ({ index, name }: { index: number; name: string }) => (
  <>
    <div style={abs(GRID_X + index * MONTH_W, 380, { ...LABEL, fontSize: 17, paddingLeft: 12 })}>
      {name}
    </div>
    <div
      style={abs(GRID_X + index * MONTH_W, 370, {
        width: 1,
        height: 4 * CHANNEL_H + 60,
        background: mix(INK, IVORY, 82),
      })}
    />
  </>
);

const Channel = ({ index, name, note }: { index: number; name: string; note: string }) => (
  <>
    <div
      style={abs(120, LANE_TOP + index * CHANNEL_H, {
        width: 1680,
        height: 1,
        background: mix(INK, IVORY, 72),
      })}
    />
    <div
      style={abs(120, LANE_TOP + index * CHANNEL_H + 22, {
        ...DIDONE,
        fontSize: 40,
        lineHeight: 1,
      })}
    >
      {name}
    </div>
    <div
      style={abs(120, LANE_TOP + index * CHANNEL_H + 74, {
        ...LABEL,
        fontSize: 14,
        color: mix(INK, IVORY, 40),
      })}
    >
      {note}
    </div>
  </>
);

const DropKey = ({
  x,
  colour,
  name,
  date,
}: {
  x: number;
  colour: string;
  name: string;
  date: string;
}) => (
  <div style={abs(x, 296, { display: 'flex', alignItems: 'baseline', gap: 14 })}>
    <span style={{ width: 16, height: 16, background: colour, alignSelf: 'center' }} />
    <span style={{ ...DIDONE, fontSize: 34, lineHeight: 1 }}>{name}</span>
    <span style={{ ...LABEL, fontSize: 15, color: mix(INK, IVORY, 35) }}>{date}</span>
  </div>
);

const Rollout: Page = () => (
  <Field bg="var(--osd-bg)" color="var(--osd-text)" folio={INK}>
    <div style={abs(120, 112, { ...LABEL, color: 'var(--osd-accent)' })}>2027 上市時程</div>
    <h2 style={abs(112, 152, { ...DIDONE, fontSize: 110 })}>六個月，五波上市。</h2>
    <Month index={0} name="1 月" />
    <Month index={1} name="2 月" />
    <Month index={2} name="3 月" />
    <Month index={3} name="4 月" />
    <Month index={4} name="5 月" />
    <Month index={5} name="6 月" />
    <Channel index={0} name="Ardent.com" note="兩週獨家" />
    <Channel index={1} name="Sephora EU" note="412 間門市，9 個市場" />
    <Channel index={2} name="Galeries Lafayette" note="Haussmann 店 + 6 間分店" />
    <Channel index={3} name="旅遊零售" note="CDG · ORY · LHR · FCO" />
    <Steps>
      <Step duration={320}>
        <DropKey x={120} colour={FUCHSIA} name="Riot" date="1/15" />
        <Lane channel={0} lane={0} start={0.45} colour={FUCHSIA} />
        <Lane channel={1} lane={0} start={1.12} colour={FUCHSIA} />
        <Lane channel={2} lane={0} start={1.12} colour={FUCHSIA} />
        <Lane channel={3} lane={0} start={3} colour={FUCHSIA} />
      </Step>
      <Step duration={320}>
        <DropKey x={450} colour={TANGERINE} name="Heat" date="2/12" />
        <Lane channel={0} lane={1} start={1.38} colour={TANGERINE} />
        <Lane channel={1} lane={1} start={2.13} colour={TANGERINE} />
        <Lane channel={2} lane={1} start={2.13} colour={TANGERINE} />
        <Lane channel={3} lane={1} start={4} colour={TANGERINE} />
      </Step>
      <Step duration={320}>
        <DropKey x={780} colour={LILAC} name="Static" date="3/12" />
        <Lane channel={0} lane={2} start={2.37} colour={LILAC} />
        <Lane channel={1} lane={2} start={3.05} colour={LILAC} />
        <Lane channel={2} lane={2} start={3.05} colour={LILAC} />
        <Lane channel={3} lane={2} start={5} colour={LILAC} />
      </Step>
      <Step duration={320}>
        <DropKey x={1120} colour={CHARTREUSE} name="Acid" date="4/9 · 限量" />
        <Lane channel={0} lane={3} start={3.28} colour={CHARTREUSE} />
        <Lane channel={2} lane={3} start={3.28} colour={CHARTREUSE} />
      </Step>
      <Step duration={320}>
        <DropKey x={1540} colour={OXBLOOD} name="Velvet" date="5/7" />
        <Lane channel={0} lane={4} start={4.2} colour={OXBLOOD} />
        <Lane channel={1} lane={4} start={5.1} colour={OXBLOOD} />
        <Lane channel={2} lane={4} start={5.1} colour={OXBLOOD} />
      </Step>
    </Steps>
  </Field>
);

const NextStep = ({ date, what }: { date: string; what: string }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'baseline',
      gap: 24,
      padding: '18px 0',
      borderTop: `1px solid ${mix(IVORY, OXBLOOD, 60)}`,
    }}
  >
    <span style={{ ...DIDONE, fontSize: 36, lineHeight: 1, width: 150, flexShrink: 0 }}>
      {date}
    </span>
    <span style={{ ...BODY, fontSize: 26, lineHeight: 1.3 }}>{what}</span>
  </div>
);

const Segment = ({ share, colour }: { share: number; colour: string }) => (
  <div style={{ flex: share, background: colour }} />
);

const Close: Page = () => {
  const live = useIsActivePage();
  const rise = (delay: number): CSSProperties =>
    live ? { animation: `ar-rise 1.1s ${EASE_OUT} ${delay}s both` } : {};
  return (
    <Field bg={OXBLOOD} color={IVORY}>
      <CropMarks tone={mix(IVORY, OXBLOOD, 50)} />
      <Registration x={942} y={38} tone={mix(IVORY, OXBLOOD, 50)} />
      <div style={abs(120, 112, LABEL)}>完</div>
      <h2 style={abs(96, 150, { ...DIDONE, fontSize: 300, lineHeight: 1, ...rise(0.1) })}>
        大膽
        <br />
        <span style={{ color: lift(FUCHSIA, 28) }}>上妝。</span>
      </h2>
      <div style={abs(120, 800, { ...rise(0.3) })}>
        <div style={{ ...DIDONE, fontSize: 52, lineHeight: 1 }}>Camille Roux</div>
        <div style={{ ...LABEL, fontSize: 16, marginTop: 18, color: mix(IVORY, OXBLOOD, 30) }}>
          色彩創意總監 · c.roux@maison-ardent.com
        </div>
      </div>
      <div style={abs(1220, 452, { width: 580, height: 14, display: 'flex' })}>
        <Segment share={28} colour={FUCHSIA} />
        <Segment share={22} colour={TANGERINE} />
        <Segment share={9} colour={CHARTREUSE} />
        <Segment share={18} colour={LILAC} />
        <Segment share={23} colour={mix(OXBLOOD, IVORY, 22)} />
      </div>
      <div style={abs(1220, 560, { width: 580 })}>
        <div style={{ ...LABEL, fontSize: 16, marginBottom: 18, color: mix(IVORY, OXBLOOD, 30) }}>
          接下來
        </div>
        <NextStep date="11/4–8" what="買家預覽會，rue Saint-Honoré" />
        <NextStep date="11/22" what="系列定案與首批下單" />
        <NextStep date="12/2" what="試用品出貨至各門市" />
      </div>
      <Folio tone={mix(IVORY, OXBLOOD, 25)} />
    </Field>
  );
};

TheFive.transition = morphTransition;
Riot.transition = morphTransition;

export const meta: SlideMeta = {
  title: 'Maison Ardent — 色彩報告 SS27',
  createdAt: '2026-10-11T11:44:33.763Z',
};

export const notes: (string | undefined)[] = [
  `讓封面停留一個呼吸的時間。
「這是第十四期色彩報告——2027 春夏。我們把這一季叫做『熱力盛季』。」
「五種顏色、一個系列、一個非常明確的賭注：顧客已經受夠米色了。」點擊。`,
  `先念引言，讓它沉澱一下。「經過三季的米色，她想要的是存在感。」
接著由上而下給證據：裸色占唇彩銷售的比重從 41% 掉到 29%；「大膽唇色」的搜尋量成長 212%；18 到 34 歲的買家平均已經擁有 2.6 支亮色。
「她不是要取代裸色，她是要加碼——而且是大聲地加。」`,
  `「這是來自我們自家銷售數據的三個訊號。」一次揭露一個。
第一：亮色現在的原價售出率是 78%，裸色是 61%。兩條線在 Q1 交叉。
第二：腮紅與頰彩在八季內成長 68%——色彩正從嘴唇往臉上移動。
第三：亮色的退貨率比裸色低。這點停一下，買家常常會很意外。`,
  `「這就是這一季的全貌。」每一條色帶的寬度，代表它在系列中的占比。
「Riot 和 Velvet 領軍，Heat 和 Static 輔助。Acid 的占比上限是 9%——它是來挑戰你的，不是來扛業績的。」點擊進入 Riot。`,
  `等色塊鋪滿整個畫面。
「Fuchsia Riot——我們的主打色，占系列的 28%。」
藍調底色，所以適合每一種膚色深度，也讓笑容更亮。它出現在唇彩（緞面與霧面），也出現在一款壓粉腮紅裡。`,
  `「Tangerine Heat——占 22%。」
先是臉頰：薄透上色時，呈現的是暖意而不是橘色。接著是唇彩與一款亮面唇膏。
指向粉餅盒：這款古銅粉餅是旅遊零售的明星品項。`,
  `「Acid Chartreuse 是風險，我們也把它當成風險來管理。」
占 9%、兩個品項——眼線與指甲油——都是限量。我們刻意不讓它上臉。
「它是大家會拍下來的顏色，但不是撐起營收的顏色。」`,
  `「兩個平衡的力量。」
Lilac Static，占 18%：冷調、珍珠光澤，用在眼妝與打亮。
Oxblood Velvet，占 23%：我們的第二主打，也是通往秋天的橋梁——給不穿粉紅色的顧客。`,
  `「六支唇膏，同一價格。」
由左到右介紹：Riot、Heatwave、Sour、Static、Velvet Hour、Afterparty。整條產品線有三種質地。
所有品項都是 €38，附可補充式金色外殼；替換膏芯是 €24。結帳簡單，陳列也簡單。`,
  `「我們把每一種顏色，在每一種膚色深度上都測過了。」
412 位試用者、六座城市、各試用兩週。圓點越大，認可度越高。
重點放在最低門檻：整張圖裡最低的分數是 81%，是 Lilac 在膚色深度六——而且是重新調配兩次之後的結果。低於 80% 的產品一律不出貨。`,
  `「六個月，五波上市。」一波一波揭露。
每個顏色先在 Ardent.com 獨家上架兩週，接著是 Sephora 和 Galeries Lafayette，最後是旅遊零售。
Acid 維持限量：只在 Ardent.com 和 Lafayette 販售。Velvet 在五月登場，帶我們進入秋天。`,
  `「大膽上妝。」
接下來：買家預覽會 11 月 4 日到 8 日在 rue Saint-Honoré 舉行，22 日系列定案，12 月 2 日試用品出貨。
「我是 Camille，會後歡迎來找我。謝謝大家。」`,
];

export default [
  Cover,
  Letter,
  Signals,
  TheFive,
  Riot,
  Tangerine,
  Chartreuse,
  Duo,
  Range,
  WearTest,
  Rollout,
  Close,
] satisfies Page[];
