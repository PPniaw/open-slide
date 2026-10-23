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
  palette: { bg: '#FFFEFC', text: '#191919', accent: '#E8553B' },
  fonts: {
    display:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, sans-serif, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, sans-serif, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif',
  },
  typeScale: { hero: 150, body: 34 },
  radius: 24,
};

const SLIDE_ID = 'fieldwork-fy27-plan';
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..800&family=Newsreader:ital,opsz,wght@1,6..72,400&display=swap';
const FONT_LINK_ID = `osd-webfont-${SLIDE_ID}`;
const STYLE_ID = `osd-styles-${SLIDE_ID}`;
const KEYFRAMES = `
@keyframes fw-draw { from { stroke-dashoffset: 1 } to { stroke-dashoffset: 0 } }
@keyframes fw-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes fw-rise { from { transform: scaleY(0) } to { transform: scaleY(1) } }
@keyframes fw-grow { from { transform: scaleX(0) } to { transform: scaleX(1) } }
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

const INK = 'var(--osd-text)';
const RED = 'var(--osd-accent)';
const INK_HEX = '#191919';
const RED_HEX = '#E8553B';
const BODY = '#5F5E5B';
const SOFT = '#9B9A97';
const RULE = 'rgba(25,25,25,0.12)';
const SERIF =
  '"Newsreader", "Iowan Old Style", Georgia, serif, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif';

const YELLOW = '#F8DA7E';
const BLUE = '#8DBDEB';
const PINK = '#F6C3CF';
const GREEN = '#A6D4B2';
const HIGHLIGHT = '#FCE38A';

const TINT_YELLOW = '#FBF3DB';
const TINT_BLUE = '#E7F3F8';
const TINT_PINK = '#FAF1F5';
const TINT_GREEN = '#EDF3EC';

const X0 = 120;
const W = 1680;

const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
const HOLD: Keyframe[] = [{ opacity: 1 }, { opacity: 1 }];
const MORPH_MS = 760;

export const transition: SlideTransition = {
  duration: 240,
  exit: { duration: 240, easing: EASE_IN, keyframes: HOLD },
  enter: {
    duration: 240,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(5px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

const morphTransition: SlideTransition = {
  duration: 280,
  exit: { duration: 300, easing: EASE_IN, keyframes: HOLD },
  enter: { duration: 300, easing: EASE_OUT, keyframes: [{ opacity: 0 }, { opacity: 1 }] },
  morph: { duration: MORPH_MS, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
};

const abs = (left: number, top: number, width?: number, height?: number): CSSProperties => ({
  position: 'absolute',
  left,
  top,
  width,
  height,
});

const row: CSSProperties = { display: 'flex', alignItems: 'center' };

const root: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  background: 'var(--osd-bg)',
  color: INK,
  fontFamily: 'var(--osd-font-body)',
  fontVariantNumeric: 'tabular-nums',
  WebkitFontSmoothing: 'antialiased',
};

const headline = (size: number): CSSProperties => ({
  margin: 0,
  fontFamily: 'var(--osd-font-display)',
  fontSize: size,
  fontWeight: 780,
  lineHeight: 1.0,
  letterSpacing: size >= 100 ? '-0.04em' : '-0.03em',
  wordSpacing: '0.08em',
});

const Ink = ({
  width,
  height,
  viewBox,
  style,
  wobble = 2.2,
  children,
}: {
  width: number;
  height: number;
  viewBox?: string;
  style?: CSSProperties;
  wobble?: number;
  children: ReactNode;
}) => {
  const id = `fw${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <svg
      aria-hidden
      width={width}
      height={height}
      viewBox={viewBox ?? `0 0 ${width} ${height}`}
      fill="none"
      stroke={INK_HEX}
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', overflow: 'visible', ...style }}
    >
      <defs>
        <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={2} seed={4} />
          <feDisplacementMap in="SourceGraphic" scale={wobble} />
        </filter>
      </defs>
      <g filter={`url(#${id})`}>{children}</g>
    </svg>
  );
};

const Stroke = ({
  d,
  live,
  delay = 0.3,
  dur = 0.7,
  color = INK_HEX,
  width = 3.2,
  fill = 'none',
}: {
  d: string;
  live: boolean;
  delay?: number;
  dur?: number;
  color?: string;
  width?: number;
  fill?: string;
}) => (
  <path
    d={d}
    pathLength={1}
    strokeDasharray={1}
    stroke={color}
    strokeWidth={width}
    fill={fill}
    style={{ animation: live ? `fw-draw ${dur}s ${EASE_OUT} ${delay}s both` : undefined }}
  />
);

const loopPath = (w: number, h: number) => {
  const p = (x: number, y: number) => `${((x * w) / 100).toFixed(1)} ${((y * h) / 100).toFixed(1)}`;
  return `M${p(30, 8)}C${p(55, 2)} ${p(90, 8)} ${p(96, 40)}C${p(100, 70)} ${p(72, 94)} ${p(42, 93)}C${p(14, 92)} ${p(2, 74)} ${p(4, 50)}C${p(6, 26)} ${p(26, 10)} ${p(56, 5)}`;
};

const CircleDoodle = ({
  x,
  y,
  w,
  h,
  color = RED_HEX,
  live,
  delay = 0.4,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
  live: boolean;
  delay?: number;
}) => (
  <Ink width={w} height={h} style={abs(x, y)} wobble={1.6}>
    <Stroke d={loopPath(w, h)} color={color} width={3.6} live={live} delay={delay} dur={0.8} />
  </Ink>
);

const Sparkle = ({
  x,
  y,
  s = 1,
  fill = YELLOW,
}: {
  x: number;
  y: number;
  s?: number;
  fill?: string;
}) => (
  <path
    transform={`translate(${x} ${y}) scale(${s})`}
    d="M0 -20Q3 -3 20 0Q3 3 0 20Q-3 3 -20 0Q-3 -3 0 -20Z"
    fill={fill}
    strokeWidth={3 / s}
  />
);

const Highlight = ({ children, color = HIGHLIGHT }: { children: ReactNode; color?: string }) => (
  <span
    style={{
      background: color,
      borderRadius: '6px 12px 8px 14px',
      padding: '0 6px',
      margin: '0 -2px',
      color: INK,
      WebkitBoxDecorationBreak: 'clone',
      boxDecorationBreak: 'clone',
    }}
  >
    {children}
  </span>
);

const Mark = ({ size = 24 }: { size?: number }) => (
  <svg
    aria-hidden
    width={size * 0.8}
    height={size}
    viewBox="0 0 20 25"
    style={{ display: 'block' }}
  >
    <path
      d="M10 24C8.5 20 1.5 15 1.5 9.5a8.5 8.5 0 0 1 17 0C18.5 15 11.5 20 10 24Z"
      fill={INK_HEX}
    />
    <circle cx="10" cy="9.5" r="3.4" fill="#FFFEFC" />
  </svg>
);

const pad2 = (n: number) => String(n).padStart(2, '0');

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        ...abs(X0, 1000, W, 32),
        ...row,
        justifyContent: 'space-between',
        fontSize: 21,
        color: SOFT,
      }}
    >
      <span style={{ ...row, gap: 12 }}>
        <Mark size={24} />
        <span style={{ color: INK, fontWeight: 720, letterSpacing: '-0.02em' }}>Fieldwork</span>
        <span style={{ marginLeft: 12 }}>FY27 營運計畫</span>
      </span>
      <span>
        {pad2(current)} / {pad2(total)}
      </span>
    </div>
  );
};

const Frame = ({ children }: { children: ReactNode }) => (
  <div style={root}>
    {children}
    <Footer />
  </div>
);

const Eyebrow = ({ children, top = 116 }: { children: ReactNode; top?: number }) => (
  <div
    style={{ ...abs(X0, top), fontSize: 26, fontWeight: 650, color: RED, letterSpacing: '-0.01em' }}
  >
    {children}
  </div>
);

const Van = ({ transform }: { transform: string }) => (
  <g transform={transform}>
    <path d="M34 18.5Q92 16 158 18M34 9Q92 6.5 158 8.5" />
    <path d="M50 9v9M74 8.2v9M98 7.6v9M122 7.8v9M146 8.4v9M46 18v12M146 18v12" />
    <path
      d="M14 36Q14 30.5 20 30.5L182 29.5Q190 29.5 194.5 35L222 70Q225.5 74.5 233 75.5L258 79Q268.5 80.5 268.5 91L269 118Q269 125 262 125L233 125A26 26 0 0 0 181 125L97 125A26 26 0 0 0 45 125L20 125Q13 125 13 118Z"
      fill="#FFFFFF"
    />
    <path d="M17 88L175 87L175 101L17 102Z" fill={RED_HEX} stroke="none" />
    <path d="M14 36Q14 30.5 20 30.5L182 29.5Q190 29.5 194.5 35L222 70Q225.5 74.5 233 75.5L258 79Q268.5 80.5 268.5 91L269 118Q269 125 262 125L233 125A26 26 0 0 0 181 125L97 125A26 26 0 0 0 45 125L20 125Q13 125 13 118Z" />
    <path d="M176 32Q177.5 78 176 122" />
    <path d="M188 41L213 69.5L189 70.5Z" fill={TINT_BLUE} />
    <path d="M161 79.5h9M253 112.5h14M261 88.5q4.5.5 4.5 5" />
    <circle cx="71" cy="125" r="19" fill="#FFFFFF" />
    <circle cx="71" cy="125" r="5.5" />
    <circle cx="207" cy="125" r="19" fill="#FFFFFF" />
    <circle cx="207" cy="125" r="5.5" />
  </g>
);

const pinPath = (cx: number, cy: number, r: number) =>
  `M${cx} ${cy + 2.4 * r}C${cx - 0.25 * r} ${cy + 1.7 * r} ${cx - r} ${cy + 1.1 * r} ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}C${cx + r} ${cy + 1.1 * r} ${cx + 0.25 * r} ${cy + 1.7 * r} ${cx} ${cy + 2.4 * r}Z`;

const Figure = ({ x, y, shirt }: { x: number; y: number; shirt: string }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-34 -86L-30 -4L-6 -4L0 -58L6 -4L30 -4L34 -86Z" fill={INK_HEX} />
    <path d="M-30 -3L-40 -2M30 -3L40 -2" />
    <path d="M-32 -160Q0 -171 32 -160L38 -84L-38 -84Z" fill={shirt} />
    <path d="M-31 -155Q-52 -120 -42 -90" />
    <path d="M31 -155Q54 -132 30 -112" />
    <path d="M4 -144L38 -148L42 -100L8 -96Z" fill="#FFFFFF" />
    <path d="M16 -136h16M17 -124h14M18 -112h9" strokeWidth={2.4} />
    <path d="M0 -175L0 -163" />
    <circle cx="0" cy="-202" r="27" fill="#FFFFFF" />
    <path
      d="M-28 -202Q-31 -233 0 -233Q31 -233 28 -205Q18 -216 2 -213Q-14 -213 -28 -202Z"
      fill={INK_HEX}
    />
    <circle cx="-9" cy="-198" r="2.6" fill={INK_HEX} stroke="none" />
    <circle cx="9" cy="-198" r="2.6" fill={INK_HEX} stroke="none" />
    <path d="M-7 -186Q0 -181 7 -186" strokeWidth={2.6} />
  </g>
);

const CoverArt = () => (
  <Ink width={880} height={700} style={abs(940, 150)}>
    <circle cx="470" cy="330" r="250" fill={YELLOW} stroke="none" />
    <path d={pinPath(560, 150, 70)} fill={RED_HEX} />
    <circle cx="560" cy="150" r="26" fill="#FFFFFF" />
    <path d="M520 556C610 530 560 420 600 380S566 330 560 326" strokeDasharray="0.1 14" />
    <Sparkle x={690} y={118} s={1.1} />
    <Sparkle x={420} y={96} s={0.7} fill="#FFFFFF" />
    <Van transform="translate(80 392) scale(1.55)" />
    <Figure x={780} y={606} shirt={BLUE} />
    <path d="M30 608Q300 603 560 607T860 606" />
  </Ink>
);

const Cover: Page = () => {
  return (
    <Frame>
      <div style={{ ...abs(X0, 100), ...row, gap: 14 }}>
        <Mark size={32} />
        <span style={{ fontSize: 30, fontWeight: 760, letterSpacing: '-0.03em' }}>Fieldwork</span>
      </div>
      <h1 style={{ ...abs(X0, 262), ...headline(150), fontSize: 'var(--osd-size-hero)' }}>
        FY27
        <br />
        營運計畫
      </h1>
      <p
        style={{
          ...abs(X0, 772, 760),
          margin: 0,
          fontSize: 34,
          lineHeight: 1.45,
          color: BODY,
        }}
      >
        我們如何從 $28.6M 走到 <Highlight>$40.0M ARR</Highlight>，以及誰負責什麼。
      </p>
      <div style={{ ...abs(X0, 906), fontSize: 24, color: SOFT }}>
        全員大會與董事會預讀資料 · 2027 年 1 月 14 日 · Maya Lindqvist，執行長
      </div>
      <CoverArt />
    </Frame>
  );
};

const BigNumber = ({
  x,
  value,
  label,
  sub,
}: {
  x: number;
  value: string;
  label: string;
  sub: string;
}) => (
  <div style={abs(x, 600, 520)}>
    <div style={{ ...headline(140), letterSpacing: '-0.05em' }}>{value}</div>
    <div style={{ marginTop: 34, fontSize: 30, fontWeight: 680 }}>{label}</div>
    <div style={{ marginTop: 8, fontSize: 26, color: BODY }}>{sub}</div>
  </div>
);

const Summary: Page = () => {
  const live = useIsActivePage();
  return (
    <Frame>
      <Eyebrow>重點摘要</Eyebrow>
      <h2 style={{ ...abs(X0, 160), ...headline(104) }}>一頁看懂整份計畫。</h2>
      <p
        style={{
          ...abs(X0, 318, 1240),
          margin: 0,
          fontSize: 34,
          lineHeight: 1.5,
          color: BODY,
        }}
      >
        FY26 的 ARR 超前目標，但<Highlight>大型團隊已經用不下我們</Highlight>
        ，留存率也沒有達標。FY27 靠三項押注補上這個缺口，在 1.1× 的燒錢倍數下，把 Fieldwork 帶到
        $40.0M ARR、186 位夥伴。
      </p>
      <BigNumber x={X0} value="$40.0M" label="12 月 31 日的 ARR" sub="從 $28.6M 成長 40%" />
      <BigNumber x={700} value="116%" label="淨營收留存率" sub="從 109% 提升 7 個百分點" />
      <BigNumber x={1280} value="186" label="團隊人數" sub="從 142 人，新增 44 個職缺" />
      <CircleDoodle x={52} y={560} w={660} h={232} live={live} />
      <Ink width={400} height={50} style={abs(694, 730)}>
        <Stroke
          d="M6 30C90 14 180 34 260 20S360 14 392 18"
          color="#3E7FCF"
          live={live}
          delay={0.7}
        />
        <Stroke
          d="M40 42C120 30 220 44 330 32"
          color="#3E7FCF"
          live={live}
          delay={0.95}
          width={2.6}
        />
      </Ink>
      <Ink width={160} height={130} style={abs(1520, 560)}>
        <Sparkle x={60} y={60} s={1.3} />
        <Sparkle x={124} y={24} s={0.7} />
        <Sparkle x={128} y={104} s={0.55} fill="#FFFFFF" />
      </Ink>
    </Frame>
  );
};

const CheckMark = ({ color = INK_HEX }: { color?: string }) => (
  <Ink width={30} height={30} wobble={1.4}>
    <path d="M5 16L12 23L26 6" stroke={color} strokeWidth={3.4} />
  </Ink>
);

const ScoreRow = ({
  top,
  metric,
  target,
  actual,
  status,
  miss = false,
}: {
  top: number;
  metric: string;
  target: string;
  actual: string;
  status: string;
  miss?: boolean;
}) => (
  <div style={{ ...abs(760, top, 1040, 124), borderTop: `1.5px solid ${RULE}` }}>
    <div style={{ ...abs(0, 26), fontSize: 34, fontWeight: 660, letterSpacing: '-0.015em' }}>
      {metric}
    </div>
    <div style={{ ...abs(0, 74), fontSize: 24, color: SOFT }}>目標 {target}</div>
    <div
      style={{
        ...abs(560, 30, 260),
        textAlign: 'right',
        fontSize: 60,
        fontWeight: 760,
        letterSpacing: '-0.04em',
        lineHeight: 1,
        color: miss ? RED : INK,
      }}
    >
      {actual}
    </div>
    <div
      style={{
        ...abs(880, 44),
        ...row,
        gap: 12,
        fontSize: 26,
        fontWeight: 600,
        color: miss ? RED : BODY,
      }}
    >
      {miss ? null : <CheckMark />}
      {status}
    </div>
  </div>
);

const TallyBox = ({ x, miss = false, live }: { x: number; miss?: boolean; live: boolean }) => (
  <g transform={`translate(${x} 0)`}>
    <rect
      x="3"
      y="3"
      width="52"
      height="52"
      rx="9"
      fill={miss ? '#FFFFFF' : TINT_GREEN}
      strokeWidth={2.8}
    />
    {miss ? (
      <Stroke
        d="M17 17L41 41M41 17L17 41"
        color={RED_HEX}
        width={3.6}
        live={live}
        delay={0.9}
        dur={0.4}
      />
    ) : (
      <path d="M14 30L25 41L44 16" strokeWidth={3.4} />
    )}
  </g>
);

const Scorecard: Page = () => {
  const live = useIsActivePage();
  return (
    <Frame>
      <Eyebrow>FY26 成績單</Eyebrow>
      <h2 style={{ ...abs(X0, 160), ...headline(120), lineHeight: 0.98 }}>
        六項目標，
        <br />
        達成五項。
      </h2>
      <p
        style={{
          ...abs(X0, 440, 540),
          margin: 0,
          fontSize: 30,
          lineHeight: 1.5,
          color: BODY,
        }}
      >
        成長與效率都超前，只有留存率沒達標，而這個落差決定了 FY27 的大部分規劃。
      </p>
      <Ink width={420} height={60} style={abs(X0, 640)}>
        <TallyBox x={0} live={live} />
        <TallyBox x={70} live={live} />
        <TallyBox x={140} live={live} />
        <TallyBox x={210} live={live} />
        <TallyBox x={280} live={live} />
        <TallyBox x={350} miss live={live} />
      </Ink>
      <ScoreRow top={150} metric="年底 ARR" target="$27.5M" actual="$28.6M" status="超標" />
      <ScoreRow top={274} metric="新增客戶數" target="1,150" actual="1,186" status="達標" />
      <ScoreRow top={398} metric="淨營收留存率" target="115%" actual="109%" status="差 6 點" miss />
      <ScoreRow top={522} metric="毛利率" target="76.0%" actual="77.8%" status="達標" />
      <ScoreRow top={646} metric="客戶流失率" target="10% 以下" actual="9.4%" status="達標" />
      <ScoreRow top={770} metric="燒錢倍數" target="1.3× 以下" actual="1.1×" status="超標" />
      <div style={{ ...abs(760, 894, 1040), borderTop: `1.5px solid ${RULE}` }} />
      <CircleDoodle x={1372} y={400} w={240} h={122} live={live} delay={0.5} />
    </Frame>
  );
};

const PapersArt = () => (
  <Ink width={620} height={540} style={abs(1180, 230)}>
    <circle cx="320" cy="270" r="215" fill={PINK} stroke="none" />
    <rect
      x="170"
      y="110"
      width="250"
      height="310"
      rx="6"
      fill="#FFFFFF"
      transform="rotate(-9 295 265)"
    />
    <rect
      x="170"
      y="110"
      width="250"
      height="310"
      rx="6"
      fill="#FFFFFF"
      transform="rotate(6 295 265)"
    />
    <g transform="rotate(-2 300 280)">
      <rect x="170" y="120" width="260" height="320" rx="6" fill="#FFFFFF" />
      <path
        d="M170 170H430M170 220H430M170 270H430M170 320H430M170 370H430M250 120V440M340 120V440"
        strokeWidth={2.4}
      />
      <rect x="252" y="172" width="86" height="46" fill={YELLOW} stroke="none" />
      <path d="M190 196h40M270 246h50M360 296h46M190 346h36M272 396h44" strokeWidth={2.6} />
    </g>
    <g transform="translate(372 410) rotate(-38)">
      <rect x="0" y="-13" width="210" height="26" rx="3" fill={YELLOW} />
      <path d="M0 -13L-36 0L0 13Z" fill="#FFFFFF" />
      <path d="M-36 0L-24 -4.3L-24 4.3Z" fill={INK_HEX} />
      <rect x="210" y="-13" width="28" height="26" rx="5" fill={PINK} />
      <path d="M206 -13V13" />
    </g>
  </Ink>
);

const Lesson = ({ top, value, children }: { top: number; value: string; children: ReactNode }) => (
  <div style={{ ...abs(X0, top, 1080), display: 'flex', gap: 30 }}>
    <div style={{ width: 180, ...headline(64), letterSpacing: '-0.04em', lineHeight: 1.05 }}>
      {value}
    </div>
    <div style={{ flex: 1, fontSize: 30, lineHeight: 1.4, color: BODY, paddingTop: 8 }}>
      {children}
    </div>
  </div>
);

const Learnings: Page = () => (
  <Frame>
    <Eyebrow>我們學到什麼</Eyebrow>
    <blockquote
      style={{
        ...abs(X0, 168, 1000),
        margin: 0,
        fontFamily: SERIF,
        fontSize: 62,
        fontWeight: 600,
        lineHeight: 1.16,
        letterSpacing: '-0.01em',
      }}
    >
      “技師一過 30 人又開第二間分公司，辦公室就退回試算表了。”
    </blockquote>
    <div style={{ ...abs(X0, 440), fontSize: 26, color: BODY }}>
      <span style={{ color: INK, fontWeight: 650 }}>Dana Ruiz</span>，營運總監，Ruiz Mechanical ·
      Phoenix，42 位技師
    </div>
    <div style={{ ...abs(X0, 530, 1000), borderTop: `1.5px solid ${RULE}` }} />
    <Lesson top={574} value="61%">
      的流失 ARR 來自 25 位以上技師的帳戶（這類帳戶占 ARR 的 38%）。
    </Lesson>
    <Lesson top={694} value="14×">
      技師每天開啟 App 的次數；辦公室使用者只有 3 次。
    </Lesson>
    <Lesson top={814} value="4.1%">
      是有使用支付功能客戶的流失率；其他客戶為 11.2%。
    </Lesson>
    <PapersArt />
  </Frame>
);

const House = ({
  x,
  y,
  s = 1,
  fill = '#FFFFFF',
}: {
  x: number;
  y: number;
  s?: number;
  fill?: string;
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-32 0L-32 -40L0 -66L32 -40L32 0Z" fill={fill} strokeWidth={3.2 / s} />
    <path d="M-9 0L-9 -22L9 -22L9 0" strokeWidth={3.2 / s} />
  </g>
);

const BranchesArt = () => (
  <Ink width={300} height={200}>
    <path d="M150 92L62 140M150 92L150 132M150 92L238 140" strokeDasharray="0.1 11" />
    <House x={56} y={186} />
    <House x={150} y={186} fill={YELLOW} />
    <House x={244} y={186} />
    <path d={pinPath(150, 36, 22)} fill={RED_HEX} />
    <circle cx="150" cy="36" r="8" fill="#FFFFFF" />
  </Ink>
);

const PaymentsArt = () => (
  <Ink width={300} height={200}>
    <rect x="70" y="24" width="96" height="168" rx="18" fill="#FFFFFF" />
    <path d="M104 42h28" />
    <circle cx="118" cy="112" r="24" fill={GREEN} />
    <path d="M107 112l7 7 14-15" strokeWidth={3.4} />
    <g transform="rotate(-14 222 84)">
      <rect x="166" y="52" width="118" height="72" rx="10" fill={YELLOW} />
      <path d="M166 74h118" strokeWidth={6} />
      <path d="M184 104h34" />
    </g>
  </Ink>
);

const OfflineArt = () => (
  <Ink width={300} height={200}>
    <rect x="60" y="24" width="96" height="168" rx="18" fill="#FFFFFF" />
    <path d="M94 42h28" />
    <path d="M80 82h56M80 104h44M80 126h52" strokeWidth={2.6} />
    <rect x="80" y="144" width="56" height="26" rx="6" fill={PINK} />
    <path d="M196 118Q190 92 216 90Q226 66 252 76Q278 72 278 98Q296 102 290 120Z" fill="#FFFFFF" />
    <path d="M196 140L292 66" stroke={RED_HEX} strokeWidth={4} />
  </Ink>
);

const BetCard = ({
  x,
  tint,
  index,
  art,
  title,
  body,
  owner,
  metric,
  from,
  to,
  morphId,
}: {
  x: number;
  tint: string;
  index: string;
  art: ReactNode;
  title: string;
  body: string;
  owner: string;
  metric: string;
  from: string;
  to: string;
  morphId?: string;
}) => {
  const bg = <div style={{ ...abs(0, 0, 536, 610), borderRadius: 24, background: tint }} />;
  return (
    <div style={abs(x, 330, 536, 610)}>
      {morphId ? <MorphElement id={morphId}>{bg}</MorphElement> : bg}
      <div style={abs(36, 34)}>{art}</div>
      <div style={{ ...abs(44, 262), fontSize: 22, fontWeight: 700, color: SOFT }}>{index}</div>
      <div style={{ ...abs(44, 296), ...headline(54) }}>{title}</div>
      <p
        style={{
          ...abs(44, 370, 448),
          margin: 0,
          fontSize: 28,
          lineHeight: 1.45,
          color: BODY,
        }}
      >
        {body}
      </p>
      <div style={{ ...abs(44, 500, 448), fontSize: 22, color: SOFT }}>
        {metric} · {owner}
      </div>
      <div style={{ ...abs(44, 532), ...row, gap: 14, fontSize: 40, fontWeight: 760 }}>
        <span style={{ color: SOFT, fontWeight: 500 }}>{from}</span>
        <span style={{ color: SOFT, fontWeight: 400 }}>→</span>
        <span style={{ letterSpacing: '-0.03em' }}>{to}</span>
      </div>
    </div>
  );
};

const Bets: Page = () => (
  <Frame>
    <Eyebrow>策略</Eyebrow>
    <h2 style={{ ...abs(X0, 160), ...headline(104) }}>FY27 的三項押注。</h2>
    <div style={{ ...abs(1220, 196, 580), fontSize: 28, lineHeight: 1.45, color: BODY }}>
      每一項都回應 FY26 的一個教訓，也各自要推動一個指標。
    </div>
    <BetCard
      x={120}
      tint={TINT_BLUE}
      index="01"
      art={<BranchesArt />}
      title="Branches"
      body="一個看板涵蓋所有分公司，技師共用同一個人力池。"
      owner="Priya Nair"
      metric="淨營收留存率"
      from="109%"
      to="116%"
      morphId="bet-branches"
    />
    <BetCard
      x={692}
      tint={TINT_GREEN}
      index="02"
      art={<PaymentsArt />}
      title="支付"
      body="技師在現場用 App 收款，帳單不再一放就是 30 天。"
      owner="Marcus Bell"
      metric="支付搭載率"
      from="22%"
      to="40%"
    />
    <BetCard
      x={1264}
      tint={TINT_YELLOW}
      index="03"
      art={<OfflineArt />}
      title="離線 App"
      body="沒有訊號也能處理工單、表單和照片，連線後自動同步。"
      owner="Lena Okafor"
      metric="無當機工作階段"
      from="99.2%"
      to="99.8%"
    />
  </Frame>
);

const BranchDiagram = ({ live }: { live: boolean }) => (
  <Ink width={760} height={640} style={abs(990, 210)}>
    <path d="M150 150C220 190 230 230 262 262" strokeDasharray="0.1 12" />
    <path d="M610 150C540 190 530 230 498 262" strokeDasharray="0.1 12" />
    <path d="M380 506L380 432" strokeDasharray="0.1 12" />
    <House x={130} y={130} s={1.5} />
    <House x={630} y={130} s={1.5} fill={YELLOW} />
    <House x={380} y={600} s={1.5} fill={PINK} />
    <rect x="250" y="250" width="260" height="176" rx="16" fill="#FFFFFF" />
    <path d="M250 286H510M337 286V426M424 286V426" strokeWidth={2.6} />
    <rect x="262" y="300" width="62" height="24" rx="6" fill={YELLOW} />
    <rect x="262" y="334" width="62" height="24" rx="6" fill={PINK} />
    <rect x="349" y="300" width="62" height="24" rx="6" fill={GREEN} />
    <rect x="436" y="300" width="62" height="24" rx="6" fill={YELLOW} />
    <rect x="436" y="334" width="62" height="24" rx="6" fill={GREEN} />
    <rect x="436" y="368" width="62" height="24" rx="6" fill={PINK} />
    <Stroke
      d="M640 330C620 380 590 400 530 392M530 392L548 378M530 392L546 408"
      color={RED_HEX}
      live={live}
      delay={MORPH_MS / 1000 + 0.3}
    />
  </Ink>
);

const DiagramLabel = ({ x, y, children }: { x: number; y: number; children: ReactNode }) => (
  <div style={{ ...abs(x - 120, y, 240), textAlign: 'center', fontSize: 24, fontWeight: 600 }}>
    {children}
  </div>
);

const BranchesDeep: Page = () => {
  const live = useIsActivePage();
  const after: CSSProperties = live
    ? { animation: `fw-fade 0.4s ease-out ${MORPH_MS}ms both` }
    : {};
  return (
    <Frame>
      <MorphElement id="bet-branches">
        <div style={{ ...abs(940, 110, 860, 840), borderRadius: 24, background: TINT_BLUE }} />
      </MorphElement>
      <div style={{ ...abs(0, 0, 1920, 1000), ...after }}>
        <BranchDiagram live={live} />
        <DiagramLabel x={1120} y={200}>
          Phoenix
        </DiagramLabel>
        <DiagramLabel x={1620} y={200}>
          Mesa
        </DiagramLabel>
        <DiagramLabel x={1370} y={820}>
          Tucson
        </DiagramLabel>
        <div style={{ ...abs(1530, 470, 220), fontSize: 24, lineHeight: 1.3, color: RED }}>
          一個看板，
          <br />
          共用技師池
        </div>
        <div style={{ ...abs(990, 890), fontSize: 22, fontWeight: 650, color: BODY }}>
          14 個帳戶測試中 · 6 月 30 日正式上線
        </div>
      </div>
      <Eyebrow>押注 01 · Branches</Eyebrow>
      <h2 style={{ ...abs(X0, 160), ...headline(112), lineHeight: 0.98 }}>
        一個看板，
        <br />
        涵蓋每一間
        <br />
        分公司。
      </h2>
      <p
        style={{
          ...abs(X0, 520, 700),
          margin: 0,
          fontSize: 30,
          lineHeight: 1.5,
          color: BODY,
        }}
      >
        目前大型團隊每個分公司各開一個 Fieldwork 帳戶。Branches
        把它們整合到同一個看板，技師可以跨據點共用。
      </p>
      <div style={{ ...abs(X0, 730, 760), display: 'flex', gap: 60 }}>
        <div style={{ width: 330 }}>
          <div style={{ ...headline(84), letterSpacing: '-0.045em' }}>38%</div>
          <div style={{ marginTop: 14, fontSize: 25, lineHeight: 1.4, color: BODY }}>
            的 ARR 集中在 25 位以上技師的帳戶
          </div>
        </div>
        <div style={{ width: 330 }}>
          <div style={{ ...headline(84), letterSpacing: '-0.045em', color: RED }}>61%</div>
          <div style={{ marginTop: 14, fontSize: 25, lineHeight: 1.4, color: BODY }}>
            的 FY26 流失 ARR 來自這些帳戶
          </div>
        </div>
      </div>
    </Frame>
  );
};

Bets.transition = morphTransition;
BranchesDeep.transition = morphTransition;

const KeyResult = ({
  text,
  pct,
  status,
  color = '#448361',
  live,
}: {
  text: string;
  pct: number;
  status: string;
  color?: string;
  live: boolean;
}) => (
  <div style={{ marginTop: 30 }}>
    <div style={{ fontSize: 27, lineHeight: 1.35 }}>{text}</div>
    <div style={{ ...row, gap: 16, marginTop: 14 }}>
      <span
        style={{
          position: 'relative',
          width: 250,
          height: 6,
          borderRadius: 3,
          background: 'rgba(25,25,25,0.09)',
        }}
      >
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: 6,
            width: `${pct}%`,
            borderRadius: 3,
            background: color === RED_HEX ? RED : INK,
            transformOrigin: 'left center',
            animation: live ? `fw-grow 0.7s ${EASE_OUT} 0.15s both` : undefined,
          }}
        />
      </span>
      <span style={{ width: 56, fontSize: 23, fontWeight: 650 }}>{pct}%</span>
      <span style={{ fontSize: 23, fontWeight: 600, color }}>{status}</span>
    </div>
  </div>
);

const Objective = ({
  code,
  title,
  owner,
  children,
}: {
  code: string;
  title: string;
  owner: string;
  children: ReactNode;
}) => (
  <div style={{ width: 500 }}>
    <div style={{ fontSize: 26, fontWeight: 700, color: RED }}>{code}</div>
    <div style={{ marginTop: 12, ...headline(46), lineHeight: 1.08, height: 100 }}>{title}</div>
    <div style={{ marginTop: 12, fontSize: 24, color: SOFT }}>{owner}</div>
    {children}
  </div>
);

const Okrs: Page = () => {
  const live = useIsActivePage();
  return (
    <Frame>
      <Eyebrow>FY27 目標</Eyebrow>
      <h2 style={{ ...abs(X0, 160), ...headline(104) }}>我們的承諾。</h2>
      <div style={{ ...abs(1300, 196, 500), fontSize: 26, lineHeight: 1.45, color: BODY }}>
        進度截至 1 月 14 日，負責人每週五更新。
      </div>
      <div
        style={{
          ...abs(X0, 330, W),
          display: 'flex',
          gap: 90,
          borderTop: `2px solid ${INK_HEX}`,
          paddingTop: 30,
        }}
      >
        <Steps>
          <Step duration={240}>
            <Objective code="O1" title="深耕最大的客戶" owner="Priya Nair">
              <KeyResult
                text="6 月 30 日前 Branches 正式上線"
                pct={35}
                status="進度正常"
                live={live}
              />
              <KeyResult text="180 個大型帳戶採用 Branches" pct={8} status="進度正常" live={live} />
              <KeyResult
                text="NRR 從 109% 提升到 116%"
                pct={0}
                status="尚未開始"
                color={SOFT}
                live={live}
              />
            </Objective>
          </Step>
          <Step duration={240}>
            <Objective code="O2" title="做完工作就收到款" owner="Marcus Bell">
              <KeyResult text="搭載率從 22% 提升到 40%" pct={6} status="進度正常" live={live} />
              <KeyResult text="4 月前 Tap to Pay 上線" pct={60} status="進度正常" live={live} />
              <KeyResult
                text="95% 交易量可隔日撥款"
                pct={15}
                status="有風險"
                color={RED_HEX}
                live={live}
              />
            </Objective>
          </Step>
          <Step duration={240}>
            <Objective code="O3" title="隨處可用的技師 App" owner="Lena Okafor">
              <KeyResult
                text="10 月 15 日前完整工作流程可離線運作"
                pct={20}
                status="進度正常"
                live={live}
              />
              <KeyResult
                text="無當機率從 99.2% 提升到 99.8%"
                pct={25}
                status="進度正常"
                live={live}
              />
            </Objective>
          </Step>
        </Steps>
      </div>
    </Frame>
  );
};

const MW = W / 12;
const mx = (m: number) => X0 + m * MW;
const TL_TOP = 420;
const TL_GAP = 68;

const MonthLabel = ({ m, label }: { m: number; label: string }) => (
  <div style={{ ...abs(mx(m), 364, MW), textAlign: 'center', fontSize: 23, color: SOFT }}>
    {label}
  </div>
);

const Quarter = ({ q }: { q: number }) => (
  <>
    <div style={{ ...abs(mx(q * 3) + 4, 316), fontSize: 26, fontWeight: 750 }}>Q{q + 1}</div>
    <div
      style={{
        ...abs(mx(q * 3), 404, 0, 500),
        borderLeft: `1.5px dashed ${q === 0 ? 'transparent' : RULE}`,
      }}
    />
  </>
);

const Bar = ({
  from,
  to,
  i,
  fill,
  children,
}: {
  from: number;
  to: number;
  i: number;
  fill: string;
  children: ReactNode;
}) => (
  <div
    style={{
      ...abs(mx(from), TL_TOP + i * TL_GAP, (to - from) * MW, 50),
      ...row,
      padding: '0 22px',
      borderRadius: 25,
      background: fill,
      boxShadow: `inset 0 0 0 2px ${INK_HEX}`,
      fontSize: 24,
      fontWeight: 650,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </div>
);

const Milestone = ({ at, i, label }: { at: number; i: number; label: string }) => (
  <div style={{ ...abs(mx(at) + 8, TL_TOP + i * TL_GAP - 2), ...row, gap: 8, height: 54 }}>
    <Ink width={40} height={40} viewBox="-22 -22 44 44">
      <Sparkle x={0} y={0} s={0.9} />
    </Ink>
    <span style={{ fontSize: 23, fontWeight: 650 }}>{label}</span>
  </div>
);

const LegendDot = ({ fill, children }: { fill: string; children: ReactNode }) => (
  <span style={{ ...row, gap: 10 }}>
    <span
      style={{
        width: 22,
        height: 22,
        borderRadius: 11,
        background: fill,
        boxShadow: `inset 0 0 0 2px ${INK_HEX}`,
      }}
    />
    {children}
  </span>
);

const Roadmap: Page = () => {
  const live = useIsActivePage();
  const today = mx(13 / 31);
  return (
    <Frame>
      <Eyebrow>路線圖</Eyebrow>
      <h2 style={{ ...abs(X0, 160), ...headline(104) }}>FY27 逐月規劃。</h2>
      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 120,
          ...row,
          gap: 26,
          fontSize: 23,
          color: BODY,
        }}
      >
        <LegendDot fill={BLUE}>產品</LegendDot>
        <LegendDot fill={GREEN}>支付</LegendDot>
        <LegendDot fill={PINK}>工程</LegendDot>
        <LegendDot fill={YELLOW}>業務</LegendDot>
      </div>
      <Quarter q={0} />
      <Quarter q={1} />
      <Quarter q={2} />
      <Quarter q={3} />
      <MonthLabel m={0} label="1 月" />
      <MonthLabel m={1} label="2 月" />
      <MonthLabel m={2} label="3 月" />
      <MonthLabel m={3} label="4 月" />
      <MonthLabel m={4} label="5 月" />
      <MonthLabel m={5} label="6 月" />
      <MonthLabel m={6} label="7 月" />
      <MonthLabel m={7} label="8 月" />
      <MonthLabel m={8} label="9 月" />
      <MonthLabel m={9} label="10 月" />
      <MonthLabel m={10} label="11 月" />
      <MonthLabel m={11} label="12 月" />
      <div style={{ ...abs(X0, 404, W), borderTop: `2px solid ${INK_HEX}` }} />
      <div style={{ ...abs(today, 404, 0, 500), borderLeft: `2.5px solid ${RED_HEX}` }} />
      <Bar from={0.1} to={6} i={0} fill={BLUE}>
        Branches：從測試版到正式上線
      </Bar>
      <Milestone at={6} i={0} label="6/30 正式上線" />
      <Bar from={6.25} to={9} i={1} fill={BLUE}>
        分公司層級報表
      </Bar>
      <Bar from={0.33} to={3.47} i={2} fill={GREEN}>
        App 內建 Tap to Pay
      </Bar>
      <Milestone at={3.47} i={2} label="4/15 上線" />
      <Bar from={3} to={8} i={3} fill={GREEN}>
        隔日撥款
      </Bar>
      <Bar from={0.55} to={5} i={4} fill={PINK}>
        離線同步引擎
      </Bar>
      <Bar from={5.5} to={9.47} i={5} fill={PINK}>
        技師 App 4.0
      </Bar>
      <Milestone at={9.47} i={5} label="10/15 發布" />
      <Bar from={1} to={11.5} i={6} fill={YELLOW}>
        中型市場業務小組，6 位業務代表
      </Bar>
      <Ink width={200} height={80} style={abs(today - 2, 900)}>
        <Stroke
          d="M80 58C40 60 12 46 6 10M6 10L-4 26M6 10L18 24"
          color={RED_HEX}
          live={live}
          delay={0.5}
        />
      </Ink>
      <div style={{ ...abs(today + 88, 940), fontSize: 23, fontWeight: 650, color: RED }}>
        目前位置：1 月 14 日
      </div>
    </Frame>
  );
};

const Bust = ({
  x,
  shirt,
  hair,
  bg,
}: {
  x: number;
  shirt: string;
  hair: 'short' | 'bun' | 'long' | 'beard';
  bg: string;
}) => (
  <g transform={`translate(${x} 300)`}>
    <circle cx="0" cy="-110" r="80" fill={bg} stroke="none" />
    {hair === 'long' ? (
      <path d="M-40 -96Q-48 -152 0 -150Q48 -152 40 -96L42 -58L-42 -58Z" fill={INK_HEX} />
    ) : null}
    <path d="M-72 0Q-68 -62 0 -66Q68 -62 72 0Z" fill={shirt} />
    <path d="M0 -70L0 -62" />
    <circle cx="0" cy="-106" r="37" fill="#FFFFFF" />
    {hair === 'short' ? (
      <path
        d="M-38 -110Q-40 -148 0 -148Q40 -148 38 -112Q24 -128 4 -124Q-20 -124 -38 -110Z"
        fill={INK_HEX}
      />
    ) : null}
    {hair === 'bun' ? (
      <>
        <circle cx="0" cy="-152" r="15" fill={INK_HEX} />
        <path
          d="M-38 -108Q-38 -146 0 -146Q38 -146 38 -108Q20 -132 0 -132Q-20 -132 -38 -108Z"
          fill={INK_HEX}
        />
      </>
    ) : null}
    {hair === 'long' ? (
      <path d="M-38 -104Q-36 -146 0 -146Q36 -146 38 -104Q14 -132 -38 -104Z" fill={INK_HEX} />
    ) : null}
    {hair === 'beard' ? (
      <>
        <path
          d="M-36 -116Q-30 -146 0 -146Q30 -146 36 -116Q20 -132 0 -132Q-20 -132 -36 -116Z"
          fill={INK_HEX}
        />
        <path
          d="M-34 -98Q-28 -64 0 -64Q28 -64 34 -98Q18 -82 0 -84Q-18 -82 -34 -98Z"
          fill={INK_HEX}
        />
      </>
    ) : null}
    <circle cx="-12" cy="-104" r="3" fill={INK_HEX} stroke="none" />
    <circle cx="12" cy="-104" r="3" fill={INK_HEX} stroke="none" />
    {hair === 'beard' ? null : <path d="M-8 -90Q0 -84 8 -90" strokeWidth={2.6} />}
  </g>
);

const TeamRow = ({ team, n }: { team: string; n: number }) => (
  <div style={{ ...row, height: 56, fontSize: 28 }}>
    <span style={{ width: 290 }}>{team}</span>
    <span style={{ width: n * 22, height: 14, borderRadius: 7, background: INK }} />
    <span style={{ marginLeft: 16, fontWeight: 700 }}>{n}</span>
  </div>
);

const Stage = ({ n, label, accent = false }: { n: number; label: string; accent?: boolean }) => (
  <div style={{ width: 148 }}>
    <div style={{ ...headline(72), letterSpacing: '-0.04em', color: accent ? RED : INK }}>{n}</div>
    <div style={{ marginTop: 10, fontSize: 23, color: BODY }}>{label}</div>
  </div>
);

const Hiring: Page = () => (
  <Frame>
    <Eyebrow>招募計畫</Eyebrow>
    <h2 style={{ ...abs(X0, 160), ...headline(170), letterSpacing: '-0.045em' }}>
      142 <span style={{ color: SOFT, fontWeight: 400 }}>→</span> 186
    </h2>
    <p
      style={{
        ...abs(X0, 372, 820),
        margin: 0,
        fontSize: 32,
        lineHeight: 1.45,
        color: BODY,
      }}
    >
      12 月 31 日前淨新增 44 個職缺，其中 28 個刻意安排在上半年。
    </p>
    <Ink width={760} height={320} style={abs(1060, 110)}>
      <Bust x={100} shirt={BLUE} hair="short" bg={TINT_YELLOW} />
      <Bust x={286} shirt={RED_HEX} hair="bun" bg={TINT_BLUE} />
      <Bust x={472} shirt={GREEN} hair="beard" bg={TINT_PINK} />
      <Bust x={658} shirt={YELLOW} hair="long" bg={TINT_GREEN} />
    </Ink>
    <div style={{ ...abs(X0, 540), fontSize: 24, fontWeight: 700 }}>各團隊新增職缺</div>
    <div style={abs(X0, 586, 820)}>
      <TeamRow team="工程" n={18} />
      <TeamRow team="業務" n={9} />
      <TeamRow team="客戶成功" n={6} />
      <TeamRow team="產品與設計" n={5} />
      <TeamRow team="支付" n={3} />
      <TeamRow team="行政管理" n={3} />
    </div>
    <div style={{ ...abs(1060, 540), fontSize: 24, fontWeight: 700 }}>這 44 個職缺的目前進度</div>
    <div style={{ ...abs(1060, 600), display: 'flex', gap: 2 }}>
      <Stage n={27} label="規劃中" />
      <Stage n={10} label="開缺中" />
      <Stage n={4} label="面試中" />
      <Stage n={2} label="已發 Offer" />
      <Stage n={1} label="已錄用" accent />
    </div>
    <div
      style={{
        ...abs(1060, 790, 740),
        display: 'flex',
        gap: 18,
        fontSize: 28,
        lineHeight: 1.4,
      }}
    >
      <Ink width={44} height={44} viewBox="-22 -22 44 44" style={{ marginTop: 2, flexShrink: 0 }}>
        <Sparkle x={0} y={0} s={0.95} />
      </Ink>
      <span>
        FY27 的第一位新進夥伴——資深 Android 工程師——將於 <Highlight>2 月 1 日</Highlight>報到。
      </span>
    </div>
  </Frame>
);

const BASE = 860;
const PER = 25;

const BarGroup = ({
  cx,
  label,
  a,
  b,
  live,
}: {
  cx: number;
  label: string;
  a: number;
  b: number;
  live: boolean;
}) => {
  const grow: CSSProperties = live
    ? { transformOrigin: 'bottom center', animation: `fw-rise 0.7s ${EASE_OUT} 0.1s both` }
    : {};
  return (
    <>
      <div
        style={{
          ...abs(cx - 82, BASE - a * PER, 76, a * PER),
          background: '#E7E5E0',
          borderRadius: '10px 10px 0 0',
          ...grow,
        }}
      />
      <div
        style={{
          ...abs(cx + 6, BASE - b * PER, 76, b * PER),
          background: INK,
          borderRadius: '10px 10px 0 0',
          ...grow,
        }}
      />
      <div
        style={{
          ...abs(cx - 92, BASE - a * PER - 36, 96),
          textAlign: 'center',
          fontSize: 23,
          color: SOFT,
        }}
      >
        {a.toFixed(1)}
      </div>
      <div
        style={{
          ...abs(cx - 4, BASE - b * PER - 36, 96),
          textAlign: 'center',
          fontSize: 24,
          fontWeight: 720,
        }}
      >
        {b.toFixed(1)}
      </div>
      <div
        style={{
          ...abs(cx - 120, BASE + 18, 240),
          textAlign: 'center',
          fontSize: 24,
          color: BODY,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </div>
    </>
  );
};

const SpendRow = ({ fn, value, share }: { fn: string; value: string; share: string }) => (
  <div
    style={{
      ...row,
      height: 62,
      fontSize: 28,
      borderBottom: `1.5px solid ${RULE}`,
    }}
  >
    <span style={{ flex: 1 }}>{fn}</span>
    <span style={{ width: 120, textAlign: 'right', fontWeight: 700 }}>{value}</span>
    <span style={{ width: 100, textAlign: 'right', color: SOFT }}>{share}</span>
  </div>
);

const Budget: Page = () => {
  const live = useIsActivePage();
  return (
    <Frame>
      <Eyebrow>預算</Eyebrow>
      <h2 style={{ ...abs(X0, 160), ...headline(104) }}>$39.5M 花在哪裡。</h2>
      <div style={{ ...abs(X0, 300), fontSize: 28, color: BODY }}>
        FY27 各職能營運費用，單位：百萬美元。較 FY26 成長 33%。
      </div>
      <div style={{ ...abs(X0, 380), ...row, gap: 28, fontSize: 22, color: BODY }}>
        <span style={{ ...row, gap: 10 }}>
          <span style={{ width: 18, height: 18, borderRadius: 4, background: '#E7E5E0' }} />
          FY26 實際
        </span>
        <span style={{ ...row, gap: 10 }}>
          <span style={{ width: 18, height: 18, borderRadius: 4, background: INK }} />
          FY27 計畫
        </span>
      </div>
      <BarGroup cx={240} label="研發" a={11.9} b={15.8} live={live} />
      <BarGroup cx={480} label="業務與行銷" a={10.6} b={14.2} live={live} />
      <BarGroup cx={720} label="行政管理" a={4.2} b={5.3} live={live} />
      <BarGroup cx={960} label="客戶成功" a={3.1} b={4.2} live={live} />
      <div style={{ ...abs(X0, BASE, 980), borderTop: `2px solid ${INK_HEX}` }} />
      <div
        style={{
          ...abs(640, 440, 340),
          fontSize: 23,
          lineHeight: 1.35,
          color: RED,
          fontWeight: 600,
        }}
      >
        研發增加 $3.9M，主要用於 Branches 與離線功能的工程師
      </div>
      <Ink width={330} height={110} style={abs(310, 430)}>
        <Stroke
          d="M322 24C240 0 120 10 22 50M22 50L44 30M22 50L50 58"
          color={RED_HEX}
          live={live}
          delay={0.8}
        />
      </Ink>
      <div style={abs(1180, 392, 620)}>
        <SpendRow fn="研發" value="15.8" share="40%" />
        <SpendRow fn="業務與行銷" value="14.2" share="36%" />
        <SpendRow fn="行政管理" value="5.3" share="13%" />
        <SpendRow fn="客戶成功" value="4.2" share="11%" />
        <div style={{ ...row, height: 66, fontSize: 28, fontWeight: 720 }}>
          <span style={{ flex: 1 }}>營運費用合計</span>
          <span style={{ width: 120, textAlign: 'right' }}>39.5</span>
          <span style={{ width: 100 }} />
        </div>
      </div>
      <div style={{ ...abs(1180, 760), ...headline(110), letterSpacing: '-0.05em' }}>1.1×</div>
      <CircleDoodle x={1134} y={724} w={290} h={176} live={live} delay={1} />
      <div style={{ ...abs(1430, 770, 370), fontSize: 24, lineHeight: 1.4, color: BODY }}>
        <span style={{ color: INK, fontWeight: 650 }}>燒錢倍數。</span>燒掉 $12.6M，換來 $11.4M
        的淨新增 ARR。FY27 年底的現金餘額為 $33.4M。
      </div>
    </Frame>
  );
};

const CalendarDoodle = () => (
  <Ink width={120} height={120}>
    <rect x="10" y="22" width="100" height="88" rx="12" fill="#FFFFFF" />
    <path d="M10 48H110M36 12V30M84 12V30" />
    <path d="M30 70h6M52 70h6M30 90h6M52 90h6" strokeWidth={4} />
    <circle cx="82" cy="80" r="15" stroke={RED_HEX} />
  </Ink>
);

const CardDoodle = () => (
  <Ink width={120} height={120}>
    <rect x="8" y="40" width="96" height="62" rx="10" fill="#FFFFFF" />
    <path d="M8 60H104" strokeWidth={6} />
    <path d="M24 86h26" />
    <path d="M70 30L104 6M88 6H104V22" stroke={RED_HEX} />
  </Ink>
);

const HourglassDoodle = () => (
  <Ink width={120} height={120}>
    <path d="M28 10H92M28 110H92" />
    <path d="M36 10Q36 50 60 60Q84 50 84 10M36 110Q36 70 60 60Q84 70 84 110" fill="#FFFFFF" />
    <path d="M44 104Q60 82 76 104Z" fill={YELLOW} />
    <path d="M48 28Q60 44 72 28Z" fill={YELLOW} />
  </Ink>
);

const RiskCard = ({
  top,
  tint,
  art,
  level,
  levelColor,
  title,
  body,
  owner,
  by,
  call,
}: {
  top: number;
  tint: string;
  art: ReactNode;
  level: string;
  levelColor: string;
  title: string;
  body: string;
  owner: string;
  by: string;
  call: string;
}) => (
  <div style={{ ...abs(X0, top, W, 188), borderRadius: 24, background: tint }}>
    <div style={abs(44, 34)}>{art}</div>
    <div style={{ ...abs(210, 30), fontSize: 22, fontWeight: 700, color: levelColor }}>{level}</div>
    <div style={{ ...abs(210, 64), ...headline(42), whiteSpace: 'nowrap' }}>{title}</div>
    <div style={{ ...abs(210, 122, 1000), fontSize: 27, lineHeight: 1.4, color: BODY }}>{body}</div>
    <div style={abs(1220, 34, 420)}>
      <div style={{ fontSize: 26, fontWeight: 680 }}>{owner}</div>
      <div style={{ marginTop: 4, fontSize: 26, color: BODY }}>決策期限 {by}</div>
      <div style={{ marginTop: 14, fontSize: 23, lineHeight: 1.35, color: BODY }}>{call}</div>
    </div>
  </div>
);

const Risks: Page = () => (
  <Frame>
    <Eyebrow>風險</Eyebrow>
    <h2 style={{ ...abs(X0, 160), ...headline(104) }}>可能出什麼狀況。</h2>
    <div style={{ ...abs(1300, 196, 500), fontSize: 26, lineHeight: 1.45, color: BODY }}>
      每項風險都有一位負責人，以及一個做出決定的期限。
    </div>
    <RiskCard
      top={330}
      tint={TINT_PINK}
      art={<CalendarDoodle />}
      level="高風險"
      levelColor={RED_HEX}
      title="Branches 正式上線延到 6 月之後"
      body="FY27 有一半的擴張 ARR，都假設 Branches 會在 Q3 續約前上線。"
      owner="Priya Nair"
      by="2 月 15 日"
      call="凍結範圍；報表可延到 Q4。"
    />
    <RiskCard
      top={538}
      tint={TINT_YELLOW}
      art={<CardDoodle />}
      level="中風險"
      levelColor="#B07A12"
      title="4 月起支付處理費調漲"
      body="新費率會讓支付毛利從交易量的 0.9% 降到 0.6%。"
      owner="Marcus Bell"
      by="3 月 31 日"
      call="重新議價，或增加第二家處理商。"
    />
    <RiskCard
      top={746}
      tint={TINT_BLUE}
      art={<HourglassDoodle />}
      level="持續觀察"
      levelColor="#3E7FCF"
      title="招募速度跑在營收前面"
      body="28 個職缺落在上半年；若 Q1 新增 ARR 低於 $1.4M，暫停 12 個下半年職缺。"
      owner="Owen Carter"
      by="4 月 14 日"
      call="由 Q1 業務檢討會設定門檻。"
    />
  </Frame>
);

const CompassArt = () => (
  <Ink width={360} height={360} style={abs(1440, 110)}>
    <circle cx="190" cy="190" r="150" fill={TINT_BLUE} stroke="none" />
    <circle cx="180" cy="180" r="112" fill="#FFFFFF" />
    <circle cx="180" cy="180" r="92" strokeWidth={2.4} />
    <path d="M180 68V84M180 276V292M68 180H84M276 180H292" />
    <path d="M180 104L198 180L162 180Z" fill={RED_HEX} />
    <path d="M180 256L198 180L162 180Z" fill="#FFFFFF" />
    <circle cx="180" cy="180" r="7" fill={INK_HEX} />
    <Sparkle x={318} y={64} s={0.8} />
  </Ink>
);

const Question = ({
  top,
  n,
  title,
  done = false,
  children,
  meta,
}: {
  top: number;
  n: string;
  title: string;
  done?: boolean;
  children: ReactNode;
  meta?: string;
}) => (
  <div style={abs(X0, top, 1240)}>
    <div style={{ ...row, alignItems: 'baseline', gap: 28 }}>
      <span style={{ width: 52, fontSize: 26, fontWeight: 700, color: done ? SOFT : RED }}>
        {n}
      </span>
      <span
        style={{
          ...headline(56),
          color: done ? SOFT : INK,
          textDecoration: done ? 'line-through' : 'none',
          textDecorationThickness: 3,
        }}
      >
        {title}
      </span>
    </div>
    <div style={{ marginLeft: 80, marginTop: 18, fontSize: 28, lineHeight: 1.5, color: BODY }}>
      {children}
    </div>
    {meta ? (
      <div style={{ marginLeft: 80, marginTop: 10, fontSize: 23, fontWeight: 600, color: SOFT }}>
        {meta}
      </div>
    ) : null}
  </div>
);

const Questions: Page = () => (
  <Frame>
    <Eyebrow>待決議題</Eyebrow>
    <h2 style={{ ...abs(X0, 160), ...headline(104) }}>尚未定案。</h2>
    <Question
      top={330}
      n="01"
      title="Branches 要怎麼定價？"
      meta="Jordan Reyes 與 Priya Nair · 2 月先找 20 個帳戶測試"
    >
      依分公司數計價比較好賣，但
      <Highlight>25 位以上技師的帳戶中，有 60% 只有一個分公司</Highlight>
      。建議方案：依技師人數計價，並設兩個分公司的最低門檻。
    </Question>
    <Question
      top={590}
      n="02"
      title="支付功能要預設開啟嗎？"
      meta="Marcus Bell 與 Theo Brandt · 建議自 3 月起預設開啟"
    >
      <Highlight color="#FADDE4">10 月那批客戶預設開啟後，搭載率翻了一倍</Highlight>
      ，但同一批客戶的客服工單增加了 18%。撥款常見問題會先上線。
    </Question>
    <Question top={850} n="03" title="FY27 要進入加拿大嗎？" done>
      Maya 已裁示：今年不做，FY28 規劃時再重新評估。
    </Question>
    <CompassArt />
  </Frame>
);

const ToolboxArt = () => (
  <Ink width={720} height={500} style={abs(1080, 300)}>
    <circle cx="370" cy="260" r="215" fill={YELLOW} stroke="none" />
    <path d="M180 214Q180 170 236 168Q292 170 292 212" />
    <path d="M202 216Q202 190 236 189Q270 190 270 214" />
    <path d="M122 250L470 246L462 420Q461 432 449 432L136 434Q124 434 123 422Z" fill={RED_HEX} />
    <path d="M110 216L482 212L478 252L114 255Z" fill={RED_HEX} />
    <rect x="276" y="244" width="44" height="30" rx="5" fill="#FFFFFF" />
    <g transform="translate(330 196) rotate(-3)">
      <path d="M18 -7.5L112 -5L112 5L18 7.5Z" fill="#FFFFFF" />
      <circle cx="128" cy="0" r="17" fill="#FFFFFF" />
      <path d="M121 -6.5L128 -9.5L135 -6.5L135 3L128 7L121 3Z" />
      <path
        d="M20 -8.5C11 -16.5 -6 -17 -13 -6.5L1 -4L1 4L-13 6.5C-6 17 11 16.5 20 8.5Z"
        fill="#FFFFFF"
      />
    </g>
    <g transform="translate(440 178) scale(1.2)">
      <path d="M110 70Q100 58 110 46Q120 34 110 22M146 72Q136 60 146 48Q156 36 146 24" />
      <path
        d="M70 92Q69 87.5 74 87.5L177 87Q182 87 181.5 92L176.5 196Q175.5 214 157 214L95 214.5Q76.5 214.5 75.5 197Z"
        fill="#FFFFFF"
      />
      <path d="M73.4 142L179 141L178 161.5L74.4 162.5Z" fill={BLUE} stroke="none" />
      <path d="M70 92Q69 87.5 74 87.5L177 87Q182 87 181.5 92L176.5 196Q175.5 214 157 214L95 214.5Q76.5 214.5 75.5 197Z" />
      <path d="M181 116Q214 113 213.5 142Q213 171 177.5 171.5M180 130Q199 129.5 199 143Q198.5 157 178.5 158" />
    </g>
    <path d="M40 436Q300 431 560 435T710 434" />
  </Ink>
);

const Todo = ({
  done = false,
  live = false,
  date,
  children,
}: {
  done?: boolean;
  live?: boolean;
  date: string;
  children: ReactNode;
}) => (
  <div style={{ ...row, gap: 22, height: 60, fontSize: 30 }}>
    <Ink width={34} height={34} wobble={1.5}>
      <rect x="3" y="3" width="28" height="28" rx="5" fill="#FFFFFF" strokeWidth={2.8} />
      {done ? (
        <Stroke d="M8 18L15 25L30 4" color={RED_HEX} width={3.6} live={live} delay={0.5} />
      ) : null}
    </Ink>
    <span
      style={{ flex: 1, color: done ? SOFT : INK, textDecoration: done ? 'line-through' : 'none' }}
    >
      {children}
    </span>
    <span style={{ fontSize: 26, color: SOFT }}>{date}</span>
  </div>
);

const Close: Page = () => {
  const live = useIsActivePage();
  return (
    <Frame>
      <h2 style={{ ...abs(X0, 140), ...headline(130), lineHeight: 0.98 }}>
        感謝大家
        <br />在 FY26 的付出。
      </h2>
      <div style={{ ...abs(X0, 420), fontSize: 34, color: BODY }}>4 月 14 日 Q1 檢討會見。</div>
      <div style={{ ...abs(X0, 520), fontSize: 24, fontWeight: 700 }}>接下來</div>
      <div style={abs(X0, 562, 860)}>
        <Todo done live={live} date="1/14">
          董事會預讀資料已寄出 · Maya
        </Todo>
        <Todo date="1/29">依本計畫擬定各團隊 OKR · 所有主管</Todo>
        <Todo date="2/15">Branches 範圍凍結 · Priya</Todo>
        <Todo date="3/31">支付處理商決策 · Marcus</Todo>
        <Todo date="4/14">Q1 業務檢討會 · Owen</Todo>
      </div>
      <div style={{ ...abs(X0, 900), fontSize: 23, color: SOFT }}>
        計畫將於 1 月 22 日定稿，在此之前都開放留言。
      </div>
      <ToolboxArt />
    </Frame>
  );
};

export const meta: SlideMeta = {
  title: 'Fieldwork — FY27 營運計畫',
  createdAt: '2026-10-12T05:15:09.357Z',
};

export const notes: (string | undefined)[] = [
  `Maya（執行長）開場。歡迎來到年度啟動會。這份是 FY27 的正式計畫，董事會今天早上也收到同一份文件作為預讀資料。
接下來二十五分鐘：先看 FY26 的結果、我們學到什麼、三項押注，再談目標、路線圖、招募和預算。意見回饋開放到 1 月 21 日。`,
  `Maya。如果你只記得一頁，就記這一頁。
FY26 以 $28.6M ARR 收尾，比計畫多 $1.1M。淨營收留存率是 109%，目標是 115%，這個落差就是今年的重點。
FY27：$40.0M ARR、NRR 回到 116%、12 月 31 日前達到 186 人。燒錢倍數維持在 1.1×。`,
  `Owen（財務長）。六項目標，達成五項。
ARR $28.6M，目標是 $27.5M。新增客戶 1,186 家。毛利率 77.8%，燒錢倍數 1.1×，上限是 1.3×。
圈起來的數字是 NRR：109%，目標是 115%。我們不會粉飾這個數字。下一頁由 Priya 說明原因。`,
  `Priya（產品副總）。我們聽了 214 通客戶電話，並對照數據。
請看 Dana 的這句話。Ruiz Mechanical 有 42 位技師、兩間分公司，結果他們又退回去用試算表。
三個數字：25 位以上技師的帳戶占 ARR 的 38%，卻占流失 ARR 的 61%。技師每天開啟 App 14 次。使用支付功能的客戶流失率是 4.1%，其他客戶是 11.2%。`,
  `Maya。三項押注，直接對應這三個教訓。
Branches 服務多據點團隊，由 Priya 負責。每一筆工作都能收款的支付功能，由 Marcus 負責。離線技師 App，由 Lena 負責。
每張卡片都有一個必須推動的數字。我們先打開第一項。`,
  `Priya。Branches 是最大的一項押注，NRR 的計畫也倚賴它。
測試版已有 14 個帳戶在使用，正式上線日是 6 月 30 日。原因：38% 的 ARR、61% 的流失 ARR，多半都是每個分公司各開一個帳戶的客戶。
產品內容：跨分公司的單一看板、共用的技師人力池，以及 Q3 推出的分公司層級報表。`,
  `負責人每人一位。按下一步，依序帶出各項目標。
O1，Priya：6 月 30 日前正式上線、180 個大型帳戶採用 Branches、NRR 提升到 116%。NRR 是落後指標，所以在 Q3 續約之前都會顯示「尚未開始」。
O2，Marcus：搭載率從 22% 提升到 40%，4 月前上線 Tap to Pay。隔日撥款有風險，原因就是風險頁提到的處理商問題。
O3，Lena：10 月 15 日前支援離線，無當機率提升到 99.8%。`,
  `Lena（工程副總）。紅線代表今天，也就是 1 月 14 日。
兩個相依關係很重要：離線同步引擎必須在 5 月完成，技師 App 4.0 才能開工；Branches 正式上線則是 7 月分公司報表的前提。
Jordan 的中型市場業務小組全年陸續招募，也就是黃色那條。`,
  `Hana（人資副總）。淨新增 44 個職缺，讓我們從 142 人成長到 186 人。其中 28 個在上半年到位，這是刻意的安排，同時也是風險。
44 個職缺中，工程 18、業務 9、客戶成功 6、產品與設計 5，支付和行政管理各 3。
目前有兩份 offer 已發出，也有一位已簽約：我們的 Android 負責人 2 月 1 日報到。`,
  `Owen。營運費用從 $29.8M 增加到 $39.5M，成長 33%。研發占 40%，業務與行銷占 36%。
請看箭頭：研發增加的部分，大多是投入 Branches 和離線功能的工程師。
燒掉 $12.6M，換來 $11.4M 的淨新增 ARR，所以燒錢倍數維持在 1.1×。年底帳上有 $33.4M 現金。`,
  `Maya。三項風險，各有一個決策日期。
Branches 延後是最大的風險；範圍在 2 月 15 日凍結。處理商費率 4 月調整；Marcus 會在 3 月 31 日前提出建議。
招募跑在營收前面：如果 Q1 新增 ARR 低於 $1.4M，我們會暫停 12 個下半年職缺。Owen 會在 4 月 14 日的 Q1 檢討會上做決定。`,
  `Maya。還有兩個議題未定案，希望大家在計畫文件的留言中提供意見。
Branches 的定價：Jordan 和 Priya 建議依技師人數計價，並設兩個分公司的最低門檻，2 月先找 20 個帳戶測試。
支付功能預設開啟：搭載率翻倍，但客服工單增加了 18%。加拿大已有結論：FY27 不做。`,
  `Maya 收尾。五個要記住的日期，第一個已經完成。
1 月 29 日前完成各團隊 OKR、2 月 15 日凍結 Branches 範圍、3 月 31 日決定處理商、4 月 14 日舉行 Q1 檢討會。
感謝大家在 FY26 的付出。有問題請直接留言；在 1 月 22 日計畫定稿之前，每一則我們都會回覆。`,
];

export default [
  Cover,
  Summary,
  Scorecard,
  Learnings,
  Bets,
  BranchesDeep,
  Okrs,
  Roadmap,
  Hiring,
  Budget,
  Risks,
  Questions,
  Close,
] satisfies Page[];
