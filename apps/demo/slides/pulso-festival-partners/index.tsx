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
import type { CSSProperties, ReactNode } from 'react';

export const design: DesignSystem = {
  palette: { bg: '#F1EADB', text: '#111111', accent: '#FF3D1F' },
  fonts: {
    display:
      '"Archivo", "Helvetica Neue", Arial, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif',
    body: '"Archivo", "Helvetica Neue", Arial, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif',
  },
  typeScale: { hero: 388, body: 30 },
  radius: 0,
};

const PAPER = 'var(--osd-bg)';
const INK = 'var(--osd-text)';
const RED = 'var(--osd-accent)';
const COBALT = '#1D3DE0';
const YELLOW = '#FFC20E';
const PINK = '#FFB8CF';

const SLIDE_ID = 'pulso-festival-partners';
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&display=swap';
const FONT_LINK_ID = `osd-webfont-${SLIDE_ID}`;
const STYLE_ID = `osd-styles-${SLIDE_ID}`;
const KEYFRAMES = `
@keyframes pl-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes pl-spin { to { transform: rotate(360deg) } }
@keyframes pl-pop { from { opacity: 0; transform: scale(0.6) } to { opacity: 1; transform: none } }
@keyframes pl-grow { from { transform: scaleY(0) } to { transform: none } }
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

const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='g' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.4 0 0 0 -1.05'/></filter><rect width='260' height='260' filter='url(#g)'/></svg>`,
)}")`;

const BRISA_FILL = `radial-gradient(circle, #111111 0 3px, transparent 3.5px) 0 0 / 14px 14px, ${YELLOW}`;

const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
const HOLD: Keyframe[] = [{ opacity: 1 }, { opacity: 1 }];
const MORPH_MS = 940;

export const transition: SlideTransition = {
  duration: 240,
  exit: { duration: 240, easing: EASE_IN, keyframes: HOLD },
  enter: {
    duration: 240,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'scale(0.97)' },
      { opacity: 1, transform: 'scale(1)' },
    ],
  },
};

const morphTransition: SlideTransition = {
  duration: 320,
  exit: { duration: 340, easing: EASE_IN, keyframes: HOLD },
  enter: { duration: 340, easing: EASE_OUT, keyframes: [{ opacity: 0 }, { opacity: 1 }] },
  morph: { duration: MORPH_MS, easing: 'cubic-bezier(0.65, 0, 0.25, 1)' },
};

const capTop = (y: number, size: number, lineHeight: number) =>
  Math.round(y - (lineHeight / 2 - 0.354) * size);

const abs = (left: number, top: number, extra?: CSSProperties): CSSProperties => ({
  position: 'absolute',
  left,
  top,
  ...extra,
});

const DISPLAY: CSSProperties = {
  fontFamily: 'var(--osd-font-display)',
  fontStretch: '125%',
  fontWeight: 900,
  textTransform: 'uppercase',
  letterSpacing: '-0.02em',
  margin: 0,
  whiteSpace: 'nowrap',
};

const LABEL: CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  lineHeight: 1,
};

const NUM: CSSProperties = { fontVariantNumeric: 'tabular-nums' };

const Poster = ({
  bg,
  color = INK,
  children,
  footer,
}: {
  bg: string;
  color?: string;
  children: ReactNode;
  footer?: ReactNode;
}) => (
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
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        backgroundImage: GRAIN,
        backgroundSize: '260px 260px',
        mixBlendMode: 'multiply',
        opacity: 0.22,
        zIndex: 8,
      }}
    />
    {footer}
  </div>
);

const FOOT: CSSProperties = {
  ...LABEL,
  position: 'absolute',
  bottom: 48,
  fontSize: 17,
  zIndex: 9,
};

const Footer = ({ left = INK, right = left }: { left?: string; right?: string }) => {
  const { current, total } = useSlidePageNumber();
  return (
    <>
      <div style={{ ...FOOT, left: 120, color: left }}>Pulso Lisboa 2027</div>
      <div style={{ ...FOOT, right: 120, color: right, display: 'flex', gap: 32 }}>
        <span>合作提案</span>
        <span style={NUM}>
          {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>
    </>
  );
};

const Kicker = ({
  n,
  children,
  color = INK,
}: {
  n: string;
  children: ReactNode;
  color?: string;
}) => (
  <div style={abs(120, 96, { ...LABEL, color, display: 'flex', alignItems: 'center', gap: 18 })}>
    <span style={NUM}>{n}</span>
    <span style={{ width: 48, height: 4, background: color }} />
    <span>{children}</span>
  </div>
);

const Heading = ({
  top,
  size = 72,
  color = INK,
  width,
  children,
}: {
  top: number;
  size?: number;
  color?: string;
  width?: number;
  children: ReactNode;
}) => (
  <h2
    style={{
      ...DISPLAY,
      ...abs(120, capTop(top, size, 1.04)),
      fontSize: size,
      lineHeight: 1.04,
      color,
      width,
    }}
  >
    {children}
  </h2>
);

const Disc = ({
  left,
  top,
  size,
  color,
}: {
  left: number;
  top: number;
  size: number;
  color: string;
}) => (
  <MorphElement id="pulso-disc">
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
      }}
    />
  </MorphElement>
);

const Cover: Page = () => (
  <Poster bg={PAPER}>
    <div
      style={abs(0, 600, {
        width: 480,
        height: 480,
        background: YELLOW,
        borderTopRightRadius: 480,
      })}
    />
    <div
      style={abs(580, 0, {
        width: 400,
        height: 200,
        background: COBALT,
        borderRadius: '0 0 200px 200px',
      })}
    />
    <div style={abs(1000, 0, { width: 40, height: 552, background: INK })} />
    <Disc left={1040} top={80} size={760} color={RED} />
    <div style={abs(120, 96, { ...LABEL })}>Proposta de parceria</div>
    <div
      style={abs(120, 136, {
        fontSize: 40,
        fontWeight: 600,
        lineHeight: 1.15,
        letterSpacing: '-0.01em',
      })}
    >
      給 Brisa Drinks 的
      <br />
      合作提案
    </div>
    <h1
      style={{
        ...DISPLAY,
        ...abs(108, capTop(600, 388, 0.8)),
        fontSize: 'var(--osd-size-hero)',
        lineHeight: 0.8,
        letterSpacing: '-0.035em',
      }}
    >
      Pulso
    </h1>
    <div
      style={{
        ...DISPLAY,
        ...abs(910, capTop(912, 48, 1)),
        fontSize: 48,
        lineHeight: 1,
        letterSpacing: '-0.01em',
        ...NUM,
      }}
    >
      Lisboa · 11—13 Junho 2027
    </div>
    <div style={abs(120, 912, { ...LABEL, lineHeight: 1.6 })}>
      Parque Tejo
      <br />4 palcos · 3 dias
    </div>
  </Poster>
);

const Stat = ({
  left,
  value,
  unit,
  children,
}: {
  left: number;
  value: string;
  unit?: string;
  children: ReactNode;
}) => (
  <div style={abs(left, 760, { width: 210 })}>
    <div style={{ height: 8, background: INK }} />
    <div
      style={{
        ...DISPLAY,
        ...NUM,
        fontSize: 80,
        lineHeight: 0.71,
        marginTop: 32,
      }}
    >
      {value}
      {unit && <span style={{ fontSize: 40, verticalAlign: 'top', marginLeft: 4 }}>{unit}</span>}
    </div>
    <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.3, marginTop: 22 }}>{children}</div>
  </div>
);

const Audience: Page = () => {
  const live = useIsActivePage();
  const landed: CSSProperties = live
    ? { animation: `pl-fade 520ms ${EASE_OUT} ${MORPH_MS - 160}ms both` }
    : {};
  return (
    <Poster bg={YELLOW} footer={<Footer />}>
      <Kicker n="01">Público · 觀眾</Kicker>
      <Disc left={880} top={60} size={1000} color={RED} />
      <div
        style={{
          ...DISPLAY,
          ...NUM,
          ...abs(108, capTop(300, 300, 0.71)),
          fontSize: 300,
          lineHeight: 0.71,
          letterSpacing: '-0.04em',
          ...landed,
        }}
      >
        128,000
      </div>
      <div
        style={{
          ...DISPLAY,
          ...abs(120, capTop(562, 56, 0.96)),
          fontSize: 56,
          lineHeight: 0.96,
        }}
      >
        三天累計
        <br />
        觀眾人次
      </div>
      <Stat left={120} value="41">
        2026年
        <br />
        售罄所需天數
      </Stat>
      <Stat left={400} value="37" unit="%">
        觀眾
        <br />
        來自海外
      </Stat>
      <Stat left={680} value="27">
        購票者
        <br />
        平均年齡
      </Stat>
      <div style={abs(1180, 880, { ...LABEL, width: 400, textAlign: 'center', ...landed })}>
        上限 · 每日 42,700 人
      </div>
    </Poster>
  );
};

const GrowthDisc = ({
  x,
  d,
  year,
  value,
  note,
  color,
  projected,
  delay,
}: {
  x: number;
  d: number;
  year: string;
  value: string;
  note?: string;
  color: string;
  projected?: boolean;
  delay: number;
}) => {
  const live = useIsActivePage();
  return (
    <>
      <div
        style={abs(x, 760 - d, {
          width: d,
          height: d,
          borderRadius: '50%',
          boxSizing: 'border-box',
          background: projected ? 'transparent' : color,
          border: projected ? `6px dashed ${color}` : undefined,
          transformOrigin: '50% 100%',
          animation: live ? `pl-pop 640ms ${EASE_OUT} ${delay}ms both` : undefined,
        })}
      />
      <div style={abs(x + d / 2 - 140, 806, { width: 280, textAlign: 'center' })}>
        <div style={{ ...LABEL, ...NUM }}>{year}</div>
        <div
          style={{
            ...DISPLAY,
            ...NUM,
            fontSize: 52,
            lineHeight: 0.71,
            marginTop: 20,
            color: projected ? RED : INK,
          }}
        >
          {value}
        </div>
        {note && (
          <div style={{ fontSize: 20, fontWeight: 500, marginTop: 18, lineHeight: 1 }}>{note}</div>
        )}
      </div>
    </>
  );
};

const Growth: Page = () => (
  <Poster bg={PAPER} footer={<Footer />}>
    <Kicker n="01">Público · 成長</Kicker>
    <Heading top={160} size={76}>
      自2022年起，
      <br />
      觀眾成長 3.6 倍。
    </Heading>
    <div
      style={abs(1240, 160, {
        width: 560,
        fontSize: 26,
        fontWeight: 500,
        lineHeight: 1.4,
      })}
    >
      共舉辦六屆，一屆比一屆盛大。自2027年起，市政府將場地人數上限訂為 128,000
      人，需求已經超過供給。
    </div>
    <GrowthDisc x={120} d={155} year="2022" value="34K" color={COBALT} delay={0} />
    <GrowthDisc x={315} d={207} year="2023" value="61K" color={COBALT} delay={70} />
    <GrowthDisc
      x={562}
      d={249}
      year="2024"
      value="88K"
      note="88 天售罄"
      color={COBALT}
      delay={140}
    />
    <GrowthDisc
      x={851}
      d={277}
      year="2025"
      value="109K"
      note="63 天售罄"
      color={COBALT}
      delay={210}
    />
    <GrowthDisc
      x={1168}
      d={292}
      year="2026"
      value="121K"
      note="41 天售罄"
      color={RED}
      delay={280}
    />
    <GrowthDisc
      x={1500}
      d={300}
      year="2027 · 上限"
      value="128K"
      note="預估"
      color={RED}
      projected
      delay={350}
    />
    <div style={abs(120, 760, { width: 1680, height: 14, background: INK })} />
  </Poster>
);

const AgeBar = ({
  x,
  h,
  pct,
  band,
  color,
  delay,
}: {
  x: number;
  h: number;
  pct: string;
  band: string;
  color: string;
  delay: number;
}) => {
  const live = useIsActivePage();
  return (
    <>
      <div
        style={{
          ...DISPLAY,
          ...NUM,
          ...abs(x, 880 - h - 24 - 40, { width: 168 }),
          fontSize: 56,
          lineHeight: 0.71,
          color: PAPER,
          animation: live ? `pl-fade 400ms ${EASE_OUT} ${delay + 360}ms both` : undefined,
        }}
      >
        {pct}
      </div>
      <div
        style={abs(x, 880 - h, {
          width: 168,
          height: h,
          background: color,
          transformOrigin: '50% 100%',
          animation: live ? `pl-grow 620ms ${EASE_OUT} ${delay}ms both` : undefined,
        })}
      />
      <div style={abs(x, 908, { ...LABEL, ...NUM, color: PAPER })}>{band}</div>
    </>
  );
};

const OriginBlock = ({
  x,
  y,
  w,
  h,
  name,
  pct,
  bg,
  fg = INK,
  outline,
  compact,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  name: string;
  pct: string;
  bg: string;
  fg?: string;
  outline?: boolean;
  compact?: boolean;
}) => (
  <div
    style={abs(x, y, {
      width: w,
      height: h,
      boxSizing: 'border-box',
      background: outline ? 'transparent' : bg,
      border: outline ? `4px solid ${bg}` : undefined,
      color: fg,
      padding: compact ? '0 20px' : '22px 24px',
      display: 'flex',
      flexDirection: compact ? 'row' : 'column',
      justifyContent: 'space-between',
      alignItems: compact ? 'center' : 'flex-start',
    })}
  >
    <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{name}</div>
    <div
      style={{
        ...DISPLAY,
        ...NUM,
        fontSize: compact ? 30 : 64,
        lineHeight: 0.71,
      }}
    >
      {pct}
    </div>
  </div>
);

const WhoComes: Page = () => (
  <Poster bg={COBALT} color={PAPER} footer={<Footer left={PAPER} />}>
    <Kicker n="01" color={PAPER}>
      Público · 觀眾組成
    </Kicker>
    <Heading top={160} size={72} color={PAPER}>
      多數未滿 35 歲，
      <br />
      每三人就有一人搭機而來。
    </Heading>
    <div style={abs(120, 392, { ...LABEL, color: PAPER })}>年齡</div>
    <AgeBar x={120} h={332} pct="34%" band="18–24" color={PAPER} delay={0} />
    <AgeBar x={312} h={400} pct="41%" band="25–34" color={YELLOW} delay={80} />
    <AgeBar x={504} h={166} pct="17%" band="35–44" color={PAPER} delay={160} />
    <AgeBar x={696} h={78} pct="8%" band="45+" color={PAPER} delay={240} />
    <div style={abs(1000, 392, { ...LABEL, color: PAPER })}>來源</div>
    <div style={abs(1000, 440, { ...LABEL, fontSize: 17, color: PAPER })}>葡萄牙 63%</div>
    <div style={abs(1507, 440, { ...LABEL, fontSize: 17, color: PAPER })}>海外 37%</div>
    <OriginBlock x={1000} y={480} w={499} h={255} name="里斯本都會區" pct="41%" bg={RED} />
    <OriginBlock x={1000} y={743} w={499} h={137} name="葡萄牙其他地區" pct="22%" bg={YELLOW} />
    <OriginBlock x={1507} y={480} w={293} h={112} name="西班牙" pct="11%" bg={PAPER} compact />
    <OriginBlock x={1507} y={600} w={293} h={81} name="英國" pct="8%" bg={PINK} compact />
    <OriginBlock
      x={1507}
      y={689}
      w={293}
      h={61}
      name="法國"
      pct="6%"
      bg="#111111"
      fg={PAPER}
      compact
    />
    <OriginBlock
      x={1507}
      y={758}
      w={293}
      h={122}
      name="其他"
      pct="12%"
      bg={PAPER}
      fg={PAPER}
      outline
      compact
    />
  </Poster>
);

const Ring = ({
  x,
  y,
  d,
  stroke,
  color,
}: {
  x: number;
  y: number;
  d: number;
  stroke: number;
  color: string;
}) => {
  const live = useIsActivePage();
  const r = (d - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg
      width={d}
      height={d}
      viewBox={`0 0 ${d} ${d}`}
      style={abs(x, y, {
        animation: live ? 'pl-spin 60s linear infinite' : undefined,
      })}
    >
      <circle
        cx={d / 2}
        cy={d / 2}
        r={r}
        fill="none"
        strokeWidth={stroke}
        strokeDasharray={`${c * 0.86} ${c * 0.14}`}
        style={{ stroke: color }}
      />
    </svg>
  );
};

const Divider = ({
  n,
  title,
  sub,
  bg,
  fg,
  numColor,
  children,
}: {
  n: string;
  title: string;
  sub: ReactNode;
  bg: string;
  fg: string;
  numColor: string;
  children: ReactNode;
}) => (
  <Poster bg={bg} color={fg} footer={<Footer left={fg} />}>
    {children}
    <div
      style={{
        ...DISPLAY,
        ...NUM,
        ...abs(96, capTop(96, 560, 0.71)),
        fontSize: 560,
        lineHeight: 0.71,
        letterSpacing: '-0.05em',
        color: numColor,
      }}
    >
      {n}
    </div>
    <div
      style={{
        ...DISPLAY,
        ...abs(116, capTop(720, 168, 0.71)),
        fontSize: 168,
        lineHeight: 0.71,
      }}
    >
      {title}
    </div>
    <div style={abs(120, 880, { fontSize: 36, fontWeight: 500, lineHeight: 1.2 })}>{sub}</div>
  </Poster>
);

const SiteDivider: Page = () => (
  <Divider
    n="02"
    title="O Recinto"
    sub="場地 — Parque Tejo，河岸 90 公頃"
    bg={RED}
    fg={INK}
    numColor={INK}
  >
    <div style={abs(1200, 96, { width: 600, height: 600, borderRadius: '50%', background: INK })} />
    <Ring x={1290} y={186} d={420} stroke={30} color={PAPER} />
    <div
      style={abs(1440, 336, { width: 120, height: 120, borderRadius: '50%', background: RED })}
    />
    <div
      style={abs(1500, 696, {
        width: 300,
        height: 150,
        background: COBALT,
        borderRadius: '0 0 150px 150px',
      })}
    />
  </Divider>
);

const StageKey = ({
  y,
  name,
  capacity,
  color,
}: {
  y: number;
  name: string;
  capacity: string;
  color: string;
}) => (
  <div
    style={abs(120, y, {
      width: 600,
      height: 64,
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      borderBottom: '3px solid #111111',
    })}
  >
    <div style={{ width: 48, height: 24, background: color, borderRadius: '0 0 24px 24px' }} />
    <div style={{ flex: 1, fontSize: 28, fontWeight: 700 }}>{name}</div>
    <div style={{ ...NUM, fontSize: 28, fontWeight: 500 }}>{capacity}</div>
  </div>
);

const KeyRow = ({ y, swatch, label }: { y: number; swatch: ReactNode; label: string }) => (
  <div style={abs(120, y, { display: 'flex', alignItems: 'center', gap: 24 })}>
    <div style={{ width: 48, display: 'flex', justifyContent: 'center' }}>{swatch}</div>
    <div style={{ fontSize: 24, fontWeight: 500 }}>{label}</div>
  </div>
);

const HalfDisc = ({
  cx,
  cy,
  r,
  facing,
  color,
}: {
  cx: number;
  cy: number;
  r: number;
  facing: 'down' | 'up' | 'left' | 'right';
  color: string;
}) => {
  const box: Record<typeof facing, CSSProperties> = {
    down: abs(cx - r, cy, { width: 2 * r, height: r, borderRadius: `0 0 ${r}px ${r}px` }),
    up: abs(cx - r, cy - r, { width: 2 * r, height: r, borderRadius: `${r}px ${r}px 0 0` }),
    left: abs(cx - r, cy - r, { width: r, height: 2 * r, borderRadius: `${r}px 0 0 ${r}px` }),
    right: abs(cx, cy - r, { width: r, height: 2 * r, borderRadius: `0 ${r}px ${r}px 0` }),
  };
  return <div style={{ ...box[facing], background: color }} />;
};

const PlanLabel = ({
  x,
  y,
  children,
  color = INK,
  align = 'left',
}: {
  x: number;
  y: number;
  children: ReactNode;
  color?: string;
  align?: 'left' | 'center';
}) => (
  <div
    style={abs(align === 'center' ? x - 160 : x, y, {
      ...LABEL,
      fontSize: 17,
      color,
      width: align === 'center' ? 320 : undefined,
      textAlign: align,
    })}
  >
    {children}
  </div>
);

const Gate = ({ x, y, rotate }: { x: number; y: number; rotate: number }) => (
  <div
    style={abs(x - 18, y - 18, {
      width: 0,
      height: 0,
      borderLeft: '18px solid transparent',
      borderRight: '18px solid transparent',
      borderTop: '30px solid #111111',
      transform: `rotate(${rotate}deg)`,
    })}
  />
);

const SitePlan: Page = () => (
  <Poster bg={PAPER} footer={<Footer />}>
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={abs(0, 0)}
      role="img"
      aria-label="場地平面圖"
    >
      <polygon points="1720,0 1920,0 1920,1080 1830,1080" style={{ fill: COBALT }} />
      <polygon
        points="840,96 1680,96 1768,960 840,960"
        style={{ fill: 'none', stroke: '#111111', strokeWidth: 4 }}
      />
      <path
        d="M 880 480 H 1240 M 1000 480 V 380 M 1240 480 V 380 M 1200 480 V 880"
        style={{
          fill: 'none',
          stroke: COBALT,
          strokeWidth: 14,
          strokeLinecap: 'round',
          strokeDasharray: '0 24',
        }}
      />
    </svg>
    <div
      style={{
        ...LABEL,
        ...abs(1884, 470, {
          color: PAPER,
          whiteSpace: 'nowrap',
          transform: 'rotate(90deg)',
          transformOrigin: '0 0',
        }),
      }}
    >
      Rio Tejo
    </div>
    <HalfDisc cx={1572} cy={600} r={270} facing="left" color={RED} />
    <div style={abs(1572, 330, { width: 28, height: 540, background: INK })} />
    <HalfDisc cx={1080} cy={196} r={171} facing="down" color={YELLOW} />
    <div style={abs(899, 168, { width: 362, height: 28, background: INK })} />
    <HalfDisc cx={980} cy={846} r={99} facing="up" color={COBALT} />
    <div style={abs(871, 846, { width: 218, height: 22, background: INK })} />
    <HalfDisc cx={1636} cy={214} r={70} facing="left" color={PINK} />
    <div style={abs(1636, 138, { width: 20, height: 152, background: INK })} />
    <div
      style={abs(892, 540, {
        width: 150,
        height: 150,
        boxSizing: 'border-box',
        borderRadius: '50%',
        background: BRISA_FILL,
        border: '5px solid #111111',
      })}
    />
    <div
      style={abs(1290, 168, {
        width: 120,
        height: 72,
        boxSizing: 'border-box',
        border: '3px dashed #111111',
      })}
    />
    <div
      style={abs(1290, 846, {
        width: 120,
        height: 64,
        boxSizing: 'border-box',
        border: '3px dashed #111111',
      })}
    />
    <PlanLabel x={1450} y={592} align="center">
      Palco Tejo
    </PlanLabel>
    <PlanLabel x={1080} y={262} align="center">
      Palco Sol
    </PlanLabel>
    <PlanLabel x={980} y={800} align="center" color={PAPER}>
      Cúpula
    </PlanLabel>
    <PlanLabel x={1604} y={306} align="center">
      Rio Club
    </PlanLabel>
    <div
      style={abs(1058, 598, {
        ...LABEL,
        fontSize: 17,
        background: INK,
        color: YELLOW,
        padding: '8px 12px',
      })}
    >
      Brisa
    </div>
    <Gate x={840} y={480} rotate={-90} />
    <Gate x={1150} y={96} rotate={0} />
    <Gate x={1200} y={960} rotate={180} />
    <PlanLabel x={866} y={504}>
      地鐵
    </PlanLabel>
    <PlanLabel x={1184} y={112}>
      北門
    </PlanLabel>
    <PlanLabel x={1234} y={926}>
      南門 · Night Line
    </PlanLabel>
    <Kicker n="02">O Recinto · 場地平面圖</Kicker>
    <Heading top={160} size={64}>
      四座舞台，
      <br />
      坐落河岸。
    </Heading>
    <StageKey y={336} name="Palco Tejo" capacity="45,000" color={RED} />
    <StageKey y={400} name="Palco Sol" capacity="18,000" color={YELLOW} />
    <StageKey y={464} name="Cúpula" capacity="6,000" color={COBALT} />
    <StageKey y={528} name="Rio Club" capacity="3,000" color={PINK} />
    <div style={abs(120, 616, { ...LABEL, fontSize: 17 })}>舞台面積依容納人數等比例繪製</div>
    <KeyRow
      y={700}
      label="Cúpula Brisa，位於地鐵入口旁"
      swatch={
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: BRISA_FILL,
            border: '3px solid #111111',
            boxSizing: 'border-box',
          }}
        />
      }
    />
    <KeyRow
      y={764}
      label="Linha de Recarga · 60 座補水站"
      swatch={
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: COBALT }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: COBALT }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: COBALT }} />
        </div>
      }
    />
    <KeyRow
      y={828}
      label="其他贊助商展區"
      swatch={
        <div
          style={{
            width: 40,
            height: 28,
            border: '3px dashed #111111',
            boxSizing: 'border-box',
          }}
        />
      }
    />
    <KeyRow
      y={892}
      label="入口"
      swatch={
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: '14px solid transparent',
            borderRight: '14px solid transparent',
            borderTop: '24px solid #111111',
          }}
        />
      }
    />
  </Poster>
);

const X0 = 400;
const PX_H = 116.67;
const ROW_H = 104;
const ROW_TOP = [356, 474, 592, 710];
const hx = (h: number) => Math.round(X0 + (h - 16) * PX_H);
const clock = (h: number) => {
  const hh = Math.floor(h) % 24;
  const mm = Math.round((h % 1) * 60);
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
};

const Slot = ({
  row,
  from,
  to,
  label,
  bg,
  fg = INK,
  strong,
}: {
  row: number;
  from: number;
  to: number;
  label: string;
  bg: string;
  fg?: string;
  strong?: boolean;
}) => (
  <div
    style={abs(hx(from) + 3, ROW_TOP[row], {
      width: hx(to) - hx(from) - 6,
      height: ROW_H,
      boxSizing: 'border-box',
      background: bg,
      color: fg,
      padding: '16px 14px',
      borderTop: strong ? '10px solid #111111' : undefined,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    })}
  >
    <div
      style={
        strong
          ? { ...LABEL, fontSize: 21, fontWeight: 900, letterSpacing: '0.06em' }
          : { fontSize: 22, fontWeight: 700, lineHeight: 1 }
      }
    >
      {label}
    </div>
    <div style={{ ...NUM, fontSize: 18, fontWeight: 500, lineHeight: 1 }}>{clock(from)}</div>
  </div>
);

const StageRow = ({ row, name, capacity }: { row: number; name: string; capacity: string }) => (
  <div style={abs(120, ROW_TOP[row], { height: ROW_H, color: PAPER, paddingTop: 16 })}>
    <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{name}</div>
    <div style={{ ...NUM, fontSize: 18, fontWeight: 500, marginTop: 12, opacity: 0.7 }}>
      {capacity}
    </div>
  </div>
);

const HourTick = ({ h, end }: { h: number; end?: boolean }) => (
  <>
    <div
      style={abs(end ? hx(h) - 80 : hx(h) - 40, 298, {
        ...LABEL,
        ...NUM,
        width: 80,
        textAlign: end ? 'right' : 'center',
      })}
    >
      {clock(h)}
    </div>
    <div style={abs(hx(h) - 1, 330, { width: 2, height: 16, background: PAPER })} />
  </>
);

const BrisaBar = ({
  y,
  from,
  to,
  label,
}: {
  y: number;
  from: number;
  to: number;
  label: string;
}) => (
  <div
    style={abs(hx(from) + 3, y, {
      width: hx(to) - hx(from) - 6,
      height: 44,
      background: BRISA_FILL,
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 10,
      boxSizing: 'border-box',
    })}
  >
    <span
      style={{
        ...LABEL,
        fontSize: 16,
        background: YELLOW,
        color: '#111111',
        padding: '6px 10px',
      }}
    >
      {label}
    </span>
  </div>
);

const Schedule: Page = () => (
  <Poster bg="#111111" color={PAPER} footer={<Footer left={PAPER} />}>
    <Kicker n="02" color={PAPER}>
      O Recinto · 6月12日（週六）
    </Kicker>
    <Heading top={160} size={72} color={PAPER}>
      Pulso 的一天
    </Heading>
    <div style={abs(1240, 156, { width: 560, fontSize: 24, fontWeight: 500, lineHeight: 1.4 })}>
      15:00 開放入場。各舞台時段錯開，壓軸卡司彼此不會撞期。
    </div>
    <HourTick h={16} />
    <HourTick h={18} />
    <HourTick h={20} />
    <HourTick h={22} />
    <HourTick h={24} />
    <HourTick h={26} />
    <HourTick h={28} end />
    <div style={abs(X0, 346, { width: hx(28) - X0, height: 2, background: PAPER })} />
    <StageRow row={0} name="Palco Tejo" capacity="45,000" />
    <StageRow row={1} name="Palco Sol" capacity="18,000" />
    <StageRow row={2} name="Cúpula" capacity="6,000" />
    <StageRow row={3} name="Rio Club" capacity="3,000" />
    <Slot row={0} from={17} to={18} label="開場" bg={RED} />
    <Slot row={0} from={18.5} to={19.75} label="演出" bg={RED} />
    <Slot row={0} from={20.25} to={21.75} label="演出" bg={RED} />
    <Slot row={0} from={22.5} to={24.25} label="壓軸" bg={RED} strong />
    <Slot row={0} from={24.75} to={26} label="演出" bg={RED} />
    <Slot row={1} from={16} to={17.25} label="演出" bg={YELLOW} />
    <Slot row={1} from={17.75} to={19} label="演出" bg={YELLOW} />
    <Slot row={1} from={19.5} to={20.75} label="日落演出" bg={YELLOW} />
    <Slot row={1} from={21.25} to={22.5} label="演出" bg={YELLOW} />
    <Slot row={1} from={23} to={24.5} label="特別嘉賓" bg={YELLOW} />
    <Slot row={2} from={20} to={22} label="DJ 表演" bg={COBALT} fg={PAPER} />
    <Slot row={2} from={22} to={24} label="DJ 表演" bg={COBALT} fg={PAPER} />
    <Slot row={2} from={24} to={26} label="B2B" bg={COBALT} fg={PAPER} />
    <Slot row={2} from={26} to={28} label="閉幕演出" bg={COBALT} fg={PAPER} />
    <Slot row={3} from={16} to={19} label="日間派對" bg={PINK} />
    <Slot row={3} from={19} to={21.5} label="DJ 表演" bg={PINK} />
    <Slot row={3} from={21.5} to={24} label="演出" bg={PINK} />
    <Slot row={3} from={24} to={27} label="B2B" bg={PINK} />
    <div style={abs(120, 850, { color: YELLOW, paddingTop: 4 })}>
      <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>Brisa</div>
      <div style={{ fontSize: 18, fontWeight: 500, marginTop: 12 }}>全天駐場</div>
    </div>
    <BrisaBar y={846} from={16} to={21} label="Cúpula Brisa" />
    <BrisaBar y={846} from={24} to={28} label="Night Line" />
    <BrisaBar y={898} from={16} to={28} label="Linha de Recarga · 60 座補水站" />
  </Poster>
);

const PartnershipDivider: Page = () => (
  <Divider
    n="03"
    title="Parceria"
    sub="合作 — 三個層級，一個冠名席位"
    bg={COBALT}
    fg={PAPER}
    numColor={YELLOW}
  >
    <div style={abs(1200, 96, { width: 600, height: 600, borderRadius: '50%', background: RED })} />
    <Ring x={1290} y={186} d={420} stroke={30} color={INK} />
    <div
      style={abs(1440, 336, { width: 120, height: 120, borderRadius: '50%', background: YELLOW })}
    />
    <div
      style={abs(1500, 696, {
        width: 300,
        height: 150,
        background: YELLOW,
        borderRadius: '0 0 150px 150px',
      })}
    />
  </Divider>
);

const Slot3 = ({ color }: { color: string }) => (
  <div style={{ width: 26, height: 26, borderRadius: '50%', background: color, flex: 'none' }} />
);

const Tier = ({
  y,
  w,
  h,
  bg,
  fg,
  name,
  price,
  priceSize,
  slots,
  available,
  children,
  tag,
}: {
  y: number;
  w: number;
  h: number;
  bg: string;
  fg: string;
  name: string;
  price: string;
  priceSize: number;
  slots: ReactNode;
  available: string;
  children: ReactNode;
  tag?: string;
}) => (
  <div style={abs(120, y, { width: w, height: h, background: bg, color: fg })}>
    <div style={abs(40, 36, { ...LABEL })}>{name}</div>
    <div
      style={{
        ...DISPLAY,
        ...NUM,
        ...abs(34, h - 36 - Math.round(priceSize * 0.69)),
        fontSize: priceSize,
        lineHeight: 0.69,
      }}
    >
      {price}
    </div>
    <ul
      style={abs(722, 30, {
        margin: 0,
        padding: 0,
        listStyle: 'none',
        fontSize: 25,
        fontWeight: 500,
        lineHeight: 1.42,
        width: w - 722 - 260,
      })}
    >
      {children}
    </ul>
    <div
      style={abs(w - 220, 36, {
        width: 180,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 14,
      })}
    >
      <div style={{ display: 'flex', gap: 8 }}>{slots}</div>
      <div style={{ ...LABEL, fontSize: 17 }}>{available}</div>
    </div>
    {tag && (
      <div
        style={abs(w - 320, h - 36 - 36, {
          ...LABEL,
          fontSize: 17,
          whiteSpace: 'nowrap',
          width: 280,
          height: 36,
          background: INK,
          color: PAPER,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        {tag}
      </div>
    )}
  </div>
);

const Tiers: Page = () => (
  <Poster bg={PAPER} footer={<Footer />}>
    <Kicker n="03">Parceria · 合作層級</Kicker>
    <Heading top={160} size={72}>
      三種合作方式。
    </Heading>
    <div style={abs(1240, 156, { width: 560, fontSize: 24, fontWeight: 500, lineHeight: 1.4 })}>
      共七位贊助夥伴，每個品類限一家。費用涵蓋2027年度活動，搭建費用另行報價。
    </div>
    <Steps>
      <Step duration={320}>
        <Tier
          y={276}
          w={1680}
          h={272}
          bg={RED}
          fg={INK}
          name="冠名贊助商"
          price="€1.2M"
          priceSize={168}
          slots={<Slot3 color={INK} />}
          available="尚餘 1 席"
          tag="建議由 Brisa 擔任"
        >
          <li>與音樂祭聯名的識別標誌</li>
          <li>水與清涼飲料品類獨家</li>
          <li>兩處體驗展區，共 900 m²</li>
          <li>每日 120 張貴賓接待通行證</li>
        </Tier>
      </Step>
      <Step duration={320}>
        <Tier
          y={564}
          w={1538}
          h={204}
          bg={COBALT}
          fg={PAPER}
          name="舞台贊助商"
          price="€450K"
          priceSize={124}
          slots={
            <>
              <Slot3 color={PAPER} />
              <Slot3 color={PAPER} />
            </>
          }
          available="尚餘 2 席"
        >
          <li>Palco Sol 或 Cúpula 冠名權</li>
          <li>一處體驗展區，400 m²</li>
          <li>每日 40 張貴賓接待通行證</li>
        </Tier>
      </Step>
      <Step duration={320}>
        <Tier
          y={784}
          w={1396}
          h={176}
          bg={YELLOW}
          fg={INK}
          name="協力贊助商"
          price="€150K"
          priceSize={96}
          slots={
            <>
              <Slot3 color={INK} />
              <Slot3 color={INK} />
              <Slot3 color={INK} />
              <Slot3 color={INK} />
            </>
          }
          available="尚餘 4 席"
        >
          <li>吧台與產品陳列</li>
          <li>場內指標與 App 露出 Logo</li>
          <li>每日 12 張貴賓通行證</li>
        </Tier>
      </Step>
    </Steps>
  </Poster>
);

const Concept = ({
  x,
  index,
  title,
  body,
  art,
  stats,
}: {
  x: number;
  index: string;
  title: string;
  body: string;
  art: ReactNode;
  stats: ReactNode;
}) => (
  <div style={abs(x, 296, { width: 520 })}>
    <div style={{ height: 292, position: 'relative' }}>{art}</div>
    <div style={{ height: 10, background: INK, marginTop: 20 }} />
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 28 }}>
      <span style={{ ...LABEL, ...NUM }}>{index}</span>
      <span style={{ ...DISPLAY, fontSize: 36, lineHeight: 1 }}>{title}</span>
    </div>
    <div style={{ fontSize: 26, fontWeight: 500, lineHeight: 1.4, marginTop: 18, height: 110 }}>
      {body}
    </div>
    <div style={{ display: 'flex', gap: 40, marginTop: 28 }}>{stats}</div>
  </div>
);

const Figure = ({ value, label }: { value: string; label: string }) => (
  <div>
    <div style={{ ...DISPLAY, ...NUM, fontSize: 60, lineHeight: 0.71 }}>{value}</div>
    <div style={{ ...LABEL, fontSize: 16, marginTop: 16 }}>{label}</div>
  </div>
);

const DomeArt = () => (
  <svg width={520} height={292} viewBox="0 0 520 292" style={abs(0, 0)} aria-hidden="true">
    <path
      d="M 40 270 A 220 220 0 0 1 480 270"
      pathLength={31}
      style={{
        fill: 'none',
        stroke: '#111111',
        strokeWidth: 12,
        strokeLinecap: 'round',
        strokeDasharray: '0 1',
      }}
    />
    <path d="M 100 270 A 160 160 0 0 1 420 270 Z" style={{ fill: COBALT }} />
    <path d="M 210 270 A 50 50 0 0 1 310 270 Z" style={{ fill: '#F1EADB' }} />
    <rect x={0} y={270} width={520} height={14} style={{ fill: '#111111' }} />
  </svg>
);

const RefillArt = () => (
  <svg width={520} height={292} viewBox="0 0 520 292" style={abs(0, 0)} aria-hidden="true">
    <rect x={0} y={40} width={520} height={30} style={{ fill: '#111111' }} />
    <path
      d="M 30 88 H 490"
      style={{ fill: 'none', stroke: '#111111', strokeWidth: 36, strokeDasharray: '20 68' }}
    />
    <g transform="translate(218 196)">
      <path d="M 0 -80 L 49.5 -30.5 A 70 70 0 1 1 -49.5 -30.5 Z" style={{ fill: COBALT }} />
    </g>
    <circle cx={128} cy={140} r={14} style={{ fill: COBALT }} />
    <circle cx={128} cy={196} r={9} style={{ fill: COBALT }} />
    <circle cx={392} cy={150} r={20} style={{ fill: COBALT }} />
    <circle cx={392} cy={222} r={12} style={{ fill: COBALT }} />
  </svg>
);

const NightArt = () => (
  <svg width={520} height={292} viewBox="0 0 520 292" style={abs(0, 0)} aria-hidden="true">
    <circle cx={130} cy={150} r={120} style={{ fill: '#111111' }} />
    <circle cx={186} cy={110} r={100} style={{ fill: YELLOW }} />
    <path
      d="M 292 220 H 500"
      style={{ fill: 'none', stroke: '#FF3D1F', strokeWidth: 16, strokeDasharray: '26 14' }}
    />
    <circle
      cx={300}
      cy={220}
      r={20}
      style={{ fill: '#F1EADB', stroke: '#111111', strokeWidth: 6 }}
    />
    <circle cx={492} cy={220} r={20} style={{ fill: '#111111' }} />
  </svg>
);

const Activations: Page = () => (
  <Poster bg={YELLOW} footer={<Footer />}>
    <Kicker n="03">Parceria · 現場體驗</Kicker>
    <Heading top={160} size={64}>
      Brisa 在現場做的三件事。
    </Heading>
    <Concept
      x={120}
      index="A"
      title="Cúpula Brisa"
      body="地鐵入口旁的遮陽穹頂，在午後酷熱中噴灑降溫水霧。"
      art={<DomeArt />}
      stats={
        <>
          <Figure value="32" label="噴霧站" />
          <Figure value="1,200" label="平方公尺遮蔭" />
        </>
      }
    />
    <Concept
      x={700}
      index="B"
      title="Linha de Recarga"
      body="全場免費補水站。每一次補水都是屬於 Brisa 的時刻，而不是又一個塑膠瓶。"
      art={<RefillArt />}
      stats={
        <>
          <Figure value="410K" label="預估補水次數" />
          <Figure value="120K" label="減少塑膠瓶" />
        </>
      }
    />
    <Concept
      x={1280}
      index="C"
      title="Night Line"
      body="00:00 至 04:00 的免費夜間接駁車，從南門直達 Cais do Sodré。"
      art={<NightArt />}
      stats={
        <>
          <Figure value="12" label="發車間隔（分）" />
          <Figure value="16K" label="預估乘客數" />
        </>
      }
    />
  </Poster>
);

const Channel = ({
  y,
  color,
  name,
  detail,
  outline,
}: {
  y: number;
  color: string;
  name: string;
  detail: string;
  outline?: boolean;
}) => (
  <div style={abs(120, y, { display: 'flex', alignItems: 'flex-start', gap: 24, width: 900 })}>
    <div
      style={{
        width: 32,
        height: 32,
        flex: 'none',
        marginTop: 2,
        background: outline ? 'transparent' : color,
        border: outline ? `4px solid ${color}` : undefined,
        boxSizing: 'border-box',
      }}
    />
    <div>
      <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.1 }}>{name}</div>
      <div style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.3, marginTop: 6, opacity: 0.72 }}>
        {detail}
      </div>
    </div>
  </div>
);

const BandValue = ({
  r,
  value,
  size,
  color,
}: {
  r: number;
  value: string;
  size: number;
  color: string;
}) => {
  const d = r / Math.SQRT2;
  return (
    <div
      style={{
        ...DISPLAY,
        ...NUM,
        ...abs(1920 - d - 150, 1080 - d - Math.round(size * 0.35)),
        width: 300,
        textAlign: 'center',
        fontSize: size,
        lineHeight: 0.71,
        color,
      }}
    >
      {value}
    </div>
  );
};

const CornerDisc = ({ r, color }: { r: number; color: string }) => (
  <div
    style={abs(1920 - r, 1080 - r, {
      width: 2 * r,
      height: 2 * r,
      borderRadius: '50%',
      background: color,
    })}
  />
);

const Reach: Page = () => (
  <Poster bg="#111111" color={PAPER} footer={<Footer left={PAPER} right={INK} />}>
    <CornerDisc r={860} color={PAPER} />
    <CornerDisc r={812} color={YELLOW} />
    <CornerDisc r={717} color={COBALT} />
    <CornerDisc r={538} color={RED} />
    <BandValue r={290} value="18M" size={96} color={INK} />
    <BandValue r={628} value="14M" size={64} color={PAPER} />
    <BandValue r={765} value="9M" size={40} color={INK} />
    <BandValue r={836} value="5M" size={24} color={INK} />
    <Kicker n="03" color={PAPER}>
      Parceria · 觸及
    </Kicker>
    <div
      style={{
        ...DISPLAY,
        ...NUM,
        ...abs(108, capTop(176, 300, 0.71)),
        fontSize: 300,
        lineHeight: 0.71,
        letterSpacing: '-0.04em',
        color: YELLOW,
      }}
    >
      46M
    </div>
    <div style={abs(120, 418, { fontSize: 30, fontWeight: 500, lineHeight: 1.35, width: 780 })}>
      預估帶有 Brisa 標誌的曝光次數，
      <br />
      期間為2027年3月至6月。
    </div>
    <Channel
      y={548}
      color={RED}
      name="自有社群"
      detail="Instagram、TikTok 與 YouTube · 2.1M 追蹤者"
    />
    <Channel
      y={640}
      color={COBALT}
      name="電視轉播與直播"
      detail="RTP 精華轉播 + YouTube 直播，三天全程"
    />
    <Channel
      y={732}
      color={YELLOW}
      name="里斯本戶外廣告"
      detail="地鐵、MUPI 燈箱與河岸，為期六週"
    />
    <Channel y={824} color={PAPER} name="媒體報導" detail="葡、西、英三國的音樂與生活風格媒體" />
    <div style={abs(1000, 176, { width: 440, color: PAPER })}>
      <div style={{ ...DISPLAY, ...NUM, fontSize: 96, lineHeight: 0.71 }}>+410K</div>
      <div style={{ ...LABEL, fontSize: 17, lineHeight: 1.5, marginTop: 22 }}>
        Pulso CRM 中的購票者，
        <br />
        每月一次聯名電子報
      </div>
    </div>
  </Poster>
);

const T0 = 120;
const PX_M = 1680 / 11;
const AXIS_Y = 640;
const mx = (month: number, day: number, days: number) =>
  Math.round(T0 + (month + (day - 1) / days) * PX_M);

const MonthTick = ({ m, label }: { m: number; label: string }) => {
  const x = Math.round(T0 + m * PX_M);
  return (
    <>
      {m > 0 && <div style={abs(x - 1, AXIS_Y, { width: 2, height: 40, background: PAPER })} />}
      <div style={abs(x + 14, AXIS_Y + 12, { ...LABEL, fontSize: 16, color: PAPER })}>{label}</div>
    </>
  );
};

const Milestone = ({
  x,
  above,
  date,
  title,
  detail,
  marker,
  width = 340,
  alignRight,
}: {
  x: number;
  above?: boolean;
  date: string;
  title: string;
  detail: string;
  marker: ReactNode;
  width?: number;
  alignRight?: boolean;
}) => {
  const stemTop = above ? 452 : AXIS_Y + 40;
  const stemBottom = above ? AXIS_Y : AXIS_Y + 92;
  return (
    <>
      <div
        style={abs(x - 2, stemTop, { width: 4, height: stemBottom - stemTop, background: INK })}
      />
      {marker}
      <div
        style={abs(alignRight ? x + 2 - width : x - 2, above ? 320 : AXIS_Y + 112, {
          width,
          textAlign: alignRight ? 'right' : 'left',
        })}
      >
        <div style={{ ...LABEL, ...NUM, fontSize: 18 }}>{date}</div>
        <div style={{ ...DISPLAY, fontSize: 34, lineHeight: 1, marginTop: 14 }}>{title}</div>
        <div style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.35, marginTop: 12 }}>
          {detail}
        </div>
      </div>
    </>
  );
};

const Timeline: Page = () => {
  const sign = mx(0, 30, 30);
  const announce = mx(3, 10, 28);
  const lineup = mx(4, 4, 31);
  const buildFrom = mx(6, 18, 31);
  const festival = mx(7, 12, 30);
  const report = mx(10, 15, 30);
  return (
    <Poster bg={PAPER} footer={<Footer />}>
      <Kicker n="03">Parceria · 時程</Kicker>
      <Heading top={160} size={72}>
        距離開場，還有六個月。
      </Heading>
      <div style={abs(T0, AXIS_Y, { width: 1680, height: 40, background: INK })} />
      <MonthTick m={0} label="11月" />
      <MonthTick m={1} label="12月" />
      <MonthTick m={2} label="1月" />
      <MonthTick m={3} label="2月" />
      <MonthTick m={4} label="3月" />
      <MonthTick m={5} label="4月" />
      <MonthTick m={6} label="5月" />
      <MonthTick m={7} label="6月" />
      <MonthTick m={8} label="7月" />
      <MonthTick m={9} label="8月" />
      <MonthTick m={10} label="9月" />
      <div style={abs(T0, AXIS_Y + 56, { ...LABEL, ...NUM, fontSize: 16 })}>2026</div>
      <div style={abs(Math.round(T0 + 2 * PX_M), AXIS_Y + 56, { ...LABEL, ...NUM, fontSize: 16 })}>
        2027
      </div>
      <Steps>
        <Step duration={280}>
          <Milestone
            x={sign}
            above
            date="2026/11/30"
            title="簽約"
            detail="合約與獨家權利確定。"
            marker={
              <div
                style={abs(sign - 28, AXIS_Y - 56, { width: 56, height: 56, background: INK })}
              />
            }
          />
        </Step>
        <Step duration={280}>
          <Milestone
            x={announce}
            date="2027/02/10"
            title="對外發表"
            detail="公布 Brisa 為冠名贊助商。"
            marker={<HalfDisc cx={announce} cy={AXIS_Y} r={44} facing="up" color={COBALT} />}
          />
        </Step>
        <Step duration={280}>
          <Milestone
            x={lineup}
            above
            date="2027/03/04"
            title="卡司公布"
            detail="完整卡司曝光，聯名宣傳。"
            marker={
              <div
                style={abs(lineup - 36, AXIS_Y - 72, {
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  boxSizing: 'border-box',
                  background: YELLOW,
                  border: '6px solid #111111',
                })}
              />
            }
          />
        </Step>
        <Step duration={280}>
          <Milestone
            x={buildFrom}
            date="5/18 — 6/10"
            title="搭建"
            detail="Cúpula 與補水站進場。"
            width={260}
            marker={
              <div
                style={abs(buildFrom, AXIS_Y - 48, {
                  width: festival - buildFrom,
                  height: 48,
                  background: BRISA_FILL,
                })}
              />
            }
          />
        </Step>
        <Step duration={280}>
          <Milestone
            x={festival}
            above
            date="2027/6/11 — 13"
            title="Pulso"
            detail="128,000 名觀眾，四座舞台。"
            marker={
              <div
                style={abs(festival - 60, AXIS_Y - 120, {
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: RED,
                })}
              />
            }
          />
        </Step>
        <Step duration={280}>
          <Milestone
            x={report}
            date="2027/09/15"
            title="成效報告"
            detail="經查核的觸及與補水數據。"
            width={300}
            alignRight
            marker={
              <div
                style={abs(report - 64, AXIS_Y - 64, {
                  width: 64,
                  height: 64,
                  background: INK,
                  borderTopLeftRadius: 64,
                })}
              />
            }
          />
        </Step>
      </Steps>
    </Poster>
  );
};

const Close: Page = () => (
  <Poster bg={RED}>
    <div
      style={abs(0, 600, {
        width: 480,
        height: 480,
        background: YELLOW,
        borderTopRightRadius: 480,
      })}
    />
    <div
      style={abs(580, 0, {
        width: 400,
        height: 200,
        background: COBALT,
        borderRadius: '0 0 200px 200px',
      })}
    />
    <div style={abs(1000, 0, { width: 40, height: 552, background: INK })} />
    <div
      style={abs(1040, 80, { width: 760, height: 760, borderRadius: '50%', background: PAPER })}
    />
    <div style={abs(120, 96, { ...LABEL })}>Obrigado</div>
    <div
      style={abs(120, 136, {
        fontSize: 40,
        fontWeight: 600,
        lineHeight: 1.15,
        letterSpacing: '-0.01em',
      })}
    >
      一起把現場
      <br />
      炒熱吧。
    </div>
    <h2
      style={{
        ...DISPLAY,
        ...abs(108, capTop(600, 180, 0.86)),
        fontSize: 180,
        lineHeight: 0.86,
        letterSpacing: '-0.03em',
      }}
    >
      Vamos fazer
      <br />
      barulho.
    </h2>
    <div style={abs(120, 300, { width: 440, fontSize: 26, fontWeight: 500, lineHeight: 1.45 })}>
      <div style={{ fontWeight: 800 }}>Inês Duarte</div>
      <div>合作夥伴部主管</div>
      <div>partners@pulso.pt</div>
    </div>
    <div style={abs(120, 960, { ...LABEL, lineHeight: 1.6 })}>
      Pulso Lisboa 2027
      <br />
      11—13 Junho · Parque Tejo
    </div>
  </Poster>
);

Cover.transition = morphTransition;
Audience.transition = morphTransition;

export const meta: SlideMeta = {
  title: 'Pulso Lisboa 2027 — 合作提案',
  createdAt: '2026-10-11T11:45:48.190Z',
};

export const notes: (string | undefined)[] = [
  `先停在海報封面，讓畫面停留一拍。
「這是 PULSO，第六屆：2027年6月11日到13日，三天，在里斯本的河岸。」
「這份提案是專為 Brisa 準備的，接下來我會說明為什麼雙方這麼契合。」點擊換頁。`,
  `圓圈長成人群，等它定格。
「三天，十二萬八千人。這是2027年的容量上限。」
接著帶出三個輔助數字：去年41 天售罄、37% 來自海外、平均年齡 27 歲。`,
  `「這不是一夜之間發生的。」沿著圓圈由左到右帶過去。
「2022年三萬四千人，接著六萬一、八萬八、十萬九，去年是十二萬一。」
指向虛線圓圈：「2027年上限 128,000 人。需求已經跑在供給前面，這正是贊助商最想要的位置。」`,
  `「他們是誰？」左邊：「四分之三的人介於 18 到 34 歲，最大族群是 25 到 34 歲，正是現在養成品牌習慣的人。」
右邊：「63% 來自葡萄牙，41% 來自大里斯本地區；另外 37% 是遠道而來，主要來自西班牙、英國和法國。」`,
  `稍作停頓。「我們來走一趟場地。」`,
  `「Parque Tejo，就在河岸邊。四座舞台，圖上的大小對應各自的容納人數。」
「Palco Tejo 容納四萬五千人；臨水的 Rio Club 三千人。」
指向條紋圓圈：「這是 Brisa 專區，就在地鐵入口，也是大多數觀眾進場的地方。藍色虛線是補水動線。」`,
  `「來看看週六這一天。」沿著每一列帶過去。
「音樂從下午四點一路到凌晨四點，各舞台時段錯開，壓軸卡司不會彼此撞期。」
指向條紋色塊：「Brisa 全天都在：午後酷熱有 Cúpula，補水站全程開放，午夜之後還有 Night Line。」`,
  `稍作停頓。「那麼，我們要怎麼合作？」`,
  `「三個層級，共七位贊助夥伴，每個品類一家。」
點擊：「冠名贊助商，120 萬歐元，只有一席。這就是我們為 Brisa 提出的方案。」
點擊：「舞台贊助商，45 萬歐元，還有兩席。」
點擊：「協力贊助商，15 萬歐元，還有四席。」`,
  `「Brisa 在現場做三件事，每一件都對觀眾有實際幫助，而不只是掛個招牌。」
「Cúpula：地鐵入口旁的遮蔭，加上 32 座噴霧站。」
「Linha de Recarga：60 座免費補水站，預估補水約 41 萬次，等於少生產約 12 萬個塑膠瓶。」
「還有 Night Line：午夜之後每 12 分鐘一班的免費接駁車，直達 Cais do Sodré。」`,
  `「Brisa 能得到什麼回報？3月到6月，預估 4,600 萬次曝光。」
「其中 1,800 萬來自我們自有的社群，1,400 萬來自 RTP 轉播與 YouTube 直播，900 萬來自里斯本各處的戶外廣告，500 萬來自媒體報導。」
「另外，還能直接觸及我們 CRM 裡的 41 萬名購票者。」`,
  `「接下來是我們怎麼走到那一天。」逐一點擊每個里程碑。
「11月底簽約。2月對外發表 Brisa，一個月後卡司公布時同步聯名曝光。」
「5月中開始搭建，6月11 到13日音樂祭登場，9月提交經過查核的成效報告。」`,
  `「Vamos fazer barulho，一起把現場炒熱吧。」
「Inês Duarte 負責贊助合作，她會在本週跟進完整的交付時程表。」
停在這一頁，開放提問。`,
];

export default [
  Cover,
  Audience,
  Growth,
  WhoComes,
  SiteDivider,
  SitePlan,
  Schedule,
  PartnershipDivider,
  Tiers,
  Activations,
  Reach,
  Timeline,
  Close,
] satisfies Page[];
