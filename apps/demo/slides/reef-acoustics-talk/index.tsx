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
  palette: { bg: '#FBFAF6', text: '#161514', accent: '#1A4B7A' },
  fonts: {
    display:
      '"Spectral", "Iowan Old Style", Georgia, serif, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif',
    body: '"Spectral", "Iowan Old Style", Georgia, serif, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif',
  },
  typeScale: { hero: 116, body: 32 },
  radius: 3,
};

const INK = 'var(--osd-text)';
const PAPER = 'var(--osd-bg)';
const ACCENT = 'var(--osd-accent)';
const MUTED = '#5F5B54';
const FAINT = '#A29D93';
const TINT = '#ECE8DF';
const SC_FONT =
  '"Spectral SC", "Spectral", Georgia, serif, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif';
const MATH_FONT = '"STIX Two Math", "Cambria Math", serif';

const SLIDE_ID = 'reef-acoustics-talk';
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,600;1,400&family=Spectral+SC:wght@400;600&family=STIX+Two+Math&display=swap';
const FONT_LINK_ID = `osd-webfont-${SLIDE_ID}`;
const STYLE_ID = `osd-styles-${SLIDE_ID}`;
const KEYFRAMES = `
@keyframes ra-fade { from { opacity: 0 } to { opacity: 1 } }
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

export const transition: SlideTransition = {
  duration: 200,
  exit: { duration: 200, easing: EASE_IN, keyframes: [{ opacity: 1 }, { opacity: 1 }] },
  enter: { duration: 200, easing: EASE_OUT, keyframes: [{ opacity: 0 }, { opacity: 1 }] },
};

const abs = (left: number, top: number, extra?: CSSProperties): CSSProperties => ({
  position: 'absolute',
  left,
  top,
  ...extra,
});

const NUM: CSSProperties = { fontVariantNumeric: 'lining-nums tabular-nums' };
const SC: CSSProperties = { fontFamily: SC_FONT };
const fillInk = { fill: INK };
const fillAccent = { fill: ACCENT };
const fillPaper = { fill: PAPER };

const mulberry32 = (seed: number) => {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const normal = (rand: () => number) => {
  const u = Math.max(1e-9, rand());
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const r1 = (v: number) => Math.round(v * 10) / 10;

type Grp = 'h' | 'r' | 'd';

const circlePath = (x: number, y: number, r: number) =>
  `M${r1(x - r)} ${r1(y)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`;
const squarePath = (x: number, y: number, s: number) =>
  `M${r1(x - s / 2)} ${r1(y - s / 2)}h${s}v${s}h${-s}z`;
const triPath = (x: number, y: number, s: number) =>
  `M${r1(x)} ${r1(y - s * 0.62)}L${r1(x + s * 0.58)} ${r1(y + s * 0.42)}L${r1(x - s * 0.58)} ${r1(y + s * 0.42)}z`;

const smoothClosed = (pts: [number, number][]) => {
  const n = pts.length;
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${r1(c1x)} ${r1(c1y)} ${r1(c2x)} ${r1(c2y)} ${p2[0]} ${p2[1]}`;
  }
  return `${d}z`;
};

const scaleAbout = (pts: [number, number][], k: number): [number, number][] => {
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return pts.map((p) => [r1(cx + (p[0] - cx) * k), r1(cy + (p[1] - cy) * k)]);
};

const Header = ({ section }: { section: string }) => (
  <>
    <div
      style={abs(120, 50, {
        width: 1680,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        fontSize: 22,
        lineHeight: 1,
      })}
    >
      <span>
        <span style={{ fontStyle: 'italic' }}>聆聽復育</span>
        <span style={{ color: FAINT, margin: '0 16px' }}>·</span>
        <span style={SC}>Okonkwo、Lindqvist、Raman 與 Ahuna</span>
      </span>
      <SectionLabel text={section} />
    </div>
    <div style={abs(120, 88, { width: 1680, height: 1, background: INK })} />
  </>
);

const LINING: CSSProperties = { fontFamily: 'var(--osd-font-body)', ...NUM };

const SectionLabel = ({ text }: { text: string }) => {
  const m = /^(§\d+)\s(.*)$/.exec(text);
  return (
    <span style={{ color: MUTED }}>
      {m && <span style={{ ...LINING, marginRight: 10 }}>{m[1]}</span>}
      <span style={SC}>{m ? m[2] : text}</span>
    </span>
  );
};

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={abs(120, 1010, {
        width: 1680,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        fontSize: 20,
        lineHeight: 1,
        color: MUTED,
      })}
    >
      <span style={SC}>2026 海洋聲景研討會 · Honolulu</span>
      <span style={{ ...NUM, color: INK, fontSize: 22 }}>
        {current} / {total}
      </span>
    </div>
  );
};

const Sheet = ({ section, children }: { section?: string; children: ReactNode }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: PAPER,
      color: INK,
      fontFamily: 'var(--osd-font-body)',
      fontSize: 'var(--osd-size-body)',
    }}
  >
    {section && <Header section={section} />}
    {children}
    <Footer />
  </div>
);

const SecHead = ({ n, children, top = 136 }: { n: string; children: ReactNode; top?: number }) => (
  <h2
    style={abs(120, top, {
      margin: 0,
      width: 1680,
      fontFamily: 'var(--osd-font-display)',
      fontSize: 58,
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.005em',
      display: 'flex',
      alignItems: 'baseline',
    })}
  >
    <span style={{ ...NUM, color: ACCENT, fontWeight: 400, marginRight: 30 }}>§{n}</span>
    <span>{children}</span>
  </h2>
);

const Caption = ({
  label,
  children,
  style,
}: {
  label: string;
  children: ReactNode;
  style?: CSSProperties;
}) => (
  <div style={{ fontSize: 24, lineHeight: 1.45, ...style }}>
    <span style={{ ...SC, fontWeight: 600 }}>{label.split(' ')[0]}</span>{' '}
    <span style={{ ...LINING, fontWeight: 600, marginRight: 12 }}>{label.split(' ')[1]}</span>
    {children}
  </div>
);

const Cite = ({ n }: { n: string }) => (
  <span style={{ ...LINING, color: ACCENT, whiteSpace: 'nowrap' }}>[{n}]</span>
);

const Fn = ({ n }: { n: string }) => (
  <sup style={{ ...LINING, fontSize: '0.6em', color: ACCENT, marginLeft: 2, lineHeight: 0 }}>
    {n}
  </sup>
);

const Footnote = ({ n, children, top = 916 }: { n: string; children: ReactNode; top?: number }) => (
  <div style={abs(120, top, { width: 1500 })}>
    <div style={{ width: 320, height: 1, background: INK, marginBottom: 12 }} />
    <div style={{ fontSize: 20, lineHeight: 1.45, color: MUTED }}>
      <sup style={{ fontSize: 14, color: ACCENT, marginRight: 6 }}>{n}</sup>
      {children}
    </div>
  </div>
);

const Mark = ({ kind, size = 22 }: { kind: Grp; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    style={{ display: 'inline-block', verticalAlign: '-0.1em', overflow: 'visible' }}
    aria-hidden="true"
  >
    {kind === 'h' && <circle cx="10" cy="10" r="7.5" style={fillInk} />}
    {kind === 'r' && <rect x="3" y="3" width="14" height="14" style={fillAccent} />}
    {kind === 'd' && (
      <path
        d="M10 2.5 L17.5 16.5 L2.5 16.5 Z"
        style={{ fill: PAPER, stroke: INK, strokeWidth: 1.8 }}
      />
    )}
  </svg>
);

const XL = ({ x, y, children }: { x: number; y: number; children: ReactNode }) => (
  <text x={x} y={y} fontSize={20} textAnchor="middle" fill="currentColor" style={NUM}>
    {children}
  </text>
);

const YL = ({ x, y, children }: { x: number; y: number; children: ReactNode }) => (
  <text x={x} y={y + 7} fontSize={20} textAnchor="end" fill="currentColor" style={NUM}>
    {children}
  </text>
);

const AxisTitle = ({
  x,
  y,
  rotate,
  children,
}: {
  x: number;
  y: number;
  rotate?: boolean;
  children: ReactNode;
}) => (
  <text
    x={x}
    y={y}
    fontSize={22}
    textAnchor="middle"
    fill="currentColor"
    fontStyle="italic"
    transform={rotate ? `rotate(-90 ${x} ${y})` : undefined}
  >
    {children}
  </text>
);

const boxTicks = (
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  xs: number[],
  ys: number[],
  len = 9,
) => {
  let d = '';
  for (const x of xs) d += `M${r1(x)} ${y1}v${-len}M${r1(x)} ${y0}v${len}`;
  for (const y of ys) d += `M${x0} ${r1(y)}h${len}M${x1} ${r1(y)}h${-len}`;
  return d;
};

const PlotBox = ({
  x0,
  y0,
  x1,
  y1,
  ticks,
}: {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  ticks: string;
}) => (
  <>
    <rect
      x={x0}
      y={y0}
      width={x1 - x0}
      height={y1 - y0}
      style={{ fill: 'none', stroke: INK, strokeWidth: 1.4 }}
    />
    <path d={ticks} style={{ fill: 'none', stroke: INK, strokeWidth: 1.2 }} />
  </>
);

const TITLE_WAVE = (() => {
  const rand = mulberry32(7);
  const n = 480;
  const w = 760;
  const bursts = [0.12, 0.2, 0.28, 0.47, 0.55, 0.74, 0.8, 0.86];
  let d = 'M0 40';
  for (let i = 1; i <= n; i++) {
    const u = i / n;
    let env = 0.08;
    for (const b of bursts) env += 0.9 * Math.exp(-((u - b) ** 2) / 0.00045);
    env *= 0.5 + 0.5 * Math.sin(Math.PI * u);
    const y = 40 + (rand() * 2 - 1) * 34 * Math.min(1, env);
    d += `L${r1((u * w) as number)} ${r1(y)}`;
  }
  return d;
})();

const Aff = ({ children }: { children: ReactNode }) => (
  <sup style={{ fontSize: '0.58em', marginLeft: 2, lineHeight: 0, ...NUM }}>{children}</sup>
);

const TitlePage: Page = () => {
  const live = useIsActivePage();
  const fade: CSSProperties = live ? { animation: `ra-fade 700ms ${EASE_OUT} both` } : {};
  return (
    <Sheet>
      <div
        style={abs(0, 150, {
          width: 1920,
          textAlign: 'center',
          ...SC,
          fontSize: 26,
          letterSpacing: '0.04em',
          color: MUTED,
        })}
      >
        2026 海洋聲景研討會 · 4B 場次：復育聲學
      </div>
      <h1
        style={abs(0, 232, {
          width: 1920,
          margin: 0,
          textAlign: 'center',
          fontFamily: 'var(--osd-font-display)',
          fontSize: 'var(--osd-size-hero)',
          fontWeight: 600,
          lineHeight: 1.1,
          letterSpacing: '-0.015em',
        })}
      >
        聆聽復育
      </h1>
      <div
        style={abs(0, 380, {
          width: 1920,
          textAlign: 'center',
          fontSize: 50,
          fontStyle: 'italic',
          lineHeight: 1.2,
        })}
      >
        復育珊瑚礁的被動式聲學監測
      </div>
      <svg
        width={760}
        height={80}
        viewBox="0 0 760 80"
        style={abs(580, 476, { overflow: 'visible', ...fade })}
        aria-hidden="true"
      >
        <path d={TITLE_WAVE} style={{ fill: 'none', stroke: ACCENT, strokeWidth: 1.4 }} />
      </svg>
      <div style={abs(0, 600, { width: 1920, textAlign: 'center', fontSize: 38, lineHeight: 1.3 })}>
        Maya R. Okonkwo<Aff>1</Aff>
        <span style={{ margin: '0 22px', color: FAINT }}>·</span>
        Tomás H. Lindqvist<Aff>2</Aff>
        <span style={{ margin: '0 22px', color: FAINT }}>·</span>
        Priya Raman<Aff>1,3</Aff>
        <span style={{ margin: '0 22px', color: FAINT }}>·</span>
        Daniel K. Ahuna<Aff>3</Aff>
      </div>
      <div
        style={abs(0, 684, {
          width: 1920,
          textAlign: 'center',
          fontSize: 26,
          fontStyle: 'italic',
          lineHeight: 1.55,
          color: MUTED,
        })}
      >
        <div>
          <Aff>1</Aff> Halloway University 海洋與地球科學學院
        </div>
        <div>
          <Aff>2</Aff> Instituto Oceánico del Pacífico 海洋生物聲學研究組
        </div>
        <div>
          <Aff>3</Aff> Kalea 珊瑚礁復育計畫，Flores 海
        </div>
      </div>
      <div style={abs(0, 860, { width: 1920, display: 'flex', justifyContent: 'center' })}>
        <div style={{ width: 120, height: 1, background: INK }} />
      </div>
      <div
        style={abs(0, 888, {
          width: 1920,
          textAlign: 'center',
          ...SC,
          fontSize: 24,
          letterSpacing: '0.04em',
        })}
      >
        Honolulu · 2026 年 11 月 9 日
      </div>
    </Sheet>
  );
};

const Item = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 22, fontSize: 32, lineHeight: 1.45 }}>
    <span style={{ color: ACCENT, flex: 'none', width: 18 }}>•</span>
    <span>{children}</span>
  </div>
);

const FIG1 = { x0: 86, x1: 776, y0: 24, y1: 444, max: 50 };
const f1x = (i: number) => FIG1.x0 + i * 46 + 9;
const f1y = (v: number) => FIG1.y1 - (v / FIG1.max) * (FIG1.y1 - FIG1.y0);

const YearBar = ({ i, total, mon }: { i: number; total: number; mon: number }) => (
  <g>
    <rect
      x={f1x(i)}
      y={f1y(total)}
      width={28}
      height={f1y(0) - f1y(total)}
      style={{ fill: PAPER, stroke: INK, strokeWidth: 1.3 }}
    />
    <rect
      x={f1x(i)}
      y={f1y(mon)}
      width={28}
      height={f1y(0) - f1y(mon)}
      style={{ ...fillAccent, stroke: INK, strokeWidth: 1.3 }}
    />
  </g>
);

const Motivation: Page = () => (
  <Sheet section="§1 前言">
    <SecHead n="1">復育的腳步跑在評估前面</SecHead>
    <div style={abs(120, 268, { width: 790, display: 'flex', flexDirection: 'column', gap: 30 })}>
      <Item>
        珊瑚礁復育正快速擴張：2010 年以來，本區域已啟動 332 個計畫。
        <Fn n="1" />
      </Item>
      <Item>
        成功與否是看移交時的珊瑚存活率，而不是棲地功能 <Cite n="1, 2" />。
      </Item>
      <Item>潛水調查成本高、次數少，還常受天候影響。</Item>
      <Item>
        健康的珊瑚礁很吵，而聲音反映了誰住在那裡 <Cite n="5, 6" />。
      </Item>
      <div style={{ fontSize: 36, fontStyle: 'italic', lineHeight: 1.35, marginTop: 18 }}>
        我們能不能靠<span style={{ color: ACCENT }}>聆聽</span>來評估復育成效？
      </div>
    </div>
    <svg
      width={800}
      height={500}
      viewBox="0 0 800 500"
      style={abs(1000, 252, { color: INK, overflow: 'visible' })}
      aria-label="每年啟動之復育計畫數長條圖"
    >
      <PlotBox
        x0={FIG1.x0}
        y0={FIG1.y0}
        x1={FIG1.x1}
        y1={FIG1.y1}
        ticks={boxTicks(
          FIG1.x0,
          FIG1.y0,
          FIG1.x1,
          FIG1.y1,
          [],
          [f1y(10), f1y(20), f1y(30), f1y(40)],
        )}
      />
      <YearBar i={0} total={4} mon={1} />
      <YearBar i={1} total={6} mon={1} />
      <YearBar i={2} total={7} mon={2} />
      <YearBar i={3} total={9} mon={2} />
      <YearBar i={4} total={12} mon={3} />
      <YearBar i={5} total={15} mon={3} />
      <YearBar i={6} total={19} mon={4} />
      <YearBar i={7} total={22} mon={5} />
      <YearBar i={8} total={27} mon={6} />
      <YearBar i={9} total={31} mon={7} />
      <YearBar i={10} total={24} mon={5} />
      <YearBar i={11} total={33} mon={7} />
      <YearBar i={12} total={38} mon={8} />
      <YearBar i={13} total={41} mon={8} />
      <YearBar i={14} total={44} mon={8} />
      <YL x={76} y={f1y(0)}>
        0
      </YL>
      <YL x={76} y={f1y(10)}>
        10
      </YL>
      <YL x={76} y={f1y(20)}>
        20
      </YL>
      <YL x={76} y={f1y(30)}>
        30
      </YL>
      <YL x={76} y={f1y(40)}>
        40
      </YL>
      <YL x={76} y={f1y(50)}>
        50
      </YL>
      <XL x={f1x(0) + 14} y={474}>
        2010
      </XL>
      <XL x={f1x(2) + 14} y={474}>
        2012
      </XL>
      <XL x={f1x(4) + 14} y={474}>
        2014
      </XL>
      <XL x={f1x(6) + 14} y={474}>
        2016
      </XL>
      <XL x={f1x(8) + 14} y={474}>
        2018
      </XL>
      <XL x={f1x(10) + 14} y={474}>
        2020
      </XL>
      <XL x={f1x(12) + 14} y={474}>
        2022
      </XL>
      <XL x={f1x(14) + 14} y={474}>
        2024
      </XL>
      <AxisTitle x={22} y={234} rotate>
        每年啟動的計畫數
      </AxisTitle>
      <rect
        x={112}
        y={50}
        width={20}
        height={20}
        style={{ ...fillAccent, stroke: INK, strokeWidth: 1.3 }}
      />
      <text x={144} y={67} fontSize={21} fill="currentColor">
        監測超過 12 個月
      </text>
      <rect
        x={112}
        y={84}
        width={20}
        height={20}
        style={{ fill: PAPER, stroke: INK, strokeWidth: 1.3 }}
      />
      <text x={144} y={101} fontSize={21} fill="currentColor">
        移交後未持續監測
      </text>
    </svg>
    <Caption label="圖 1." style={abs(1000, 772, { width: 800 })}>
      區域登記系統中每年啟動的復育計畫數（<i>n</i>&nbsp;=&nbsp;332）。其中僅 70
      個（21%）回報在第一年之後仍持續監測。
    </Caption>
    <Footnote n="1">
      珊瑚三角區復育登記系統（Coral Triangle Restoration Registry），2026 年 3
      月查閱；僅納入珊瑚礁面積 ≥ 100 m² 的計畫。
    </Footnote>
  </Sheet>
);

const Tally = ({ kind, label, note }: { kind: Grp; label: string; note: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', gap: 14 }}>
      <Mark kind={kind} size={30} />
      <Mark kind={kind} size={30} />
      <Mark kind={kind} size={30} />
      <Mark kind={kind} size={30} />
    </div>
    <div style={{ fontSize: 30, lineHeight: 1.2 }}>{label}</div>
    <div style={{ fontSize: 22, lineHeight: 1.35, color: MUTED, fontStyle: 'italic' }}>{note}</div>
  </div>
);

const Hypothesis = ({ n, name, children }: { n: string; name: string; children: ReactNode }) => (
  <div style={{ width: 780, fontSize: 32, lineHeight: 1.5 }}>
    <span style={{ ...SC, fontWeight: 600 }}>假說</span>{' '}
    <span style={{ ...LINING, fontWeight: 600 }}>{n}</span>
    <span>（{name}）。</span>
    {children}
  </div>
);

const Question: Page = () => (
  <Sheet section="§1 前言">
    <SecHead n="1.1">研究問題</SecHead>
    <div
      style={abs(120, 278, {
        width: 1640,
        paddingLeft: 36,
        borderLeft: `3px solid ${ACCENT}`,
        fontSize: 46,
        lineHeight: 1.36,
      })}
    >
      <span style={{ ...SC, fontWeight: 600, fontSize: 42 }}>研究問題。</span>{' '}
      <span style={{ fontStyle: 'italic' }}>
        復育後珊瑚礁的聲景，是否會趨近於健康參照礁的聲景？若會，需要多長的時間？
      </span>
    </div>
    <div style={abs(120, 486, { width: 1680, display: 'flex', justifyContent: 'space-between' })}>
      <Hypothesis n="1" name="趨近">
        復育站位在六個月內，聲學特徵便與退化站位明顯不同，接著逐漸趨近健康站位。
      </Hypothesis>
      <Hypothesis n="2" name="效度">
        聲學指數能追蹤潛水調查所得的魚類密度與珊瑚覆蓋率（<i>r</i> &gt; 0.5）。
      </Hypothesis>
    </div>
    <div style={abs(120, 700, { width: 1680, height: 1, background: FAINT })} />
    <div style={abs(120, 732, { fontSize: 30, lineHeight: 1.4, width: 430 })}>
      <span style={{ ...SC, fontWeight: 600 }}>設計。</span>三種狀態共十二個站位， 錄音長達 18
      個月。
    </div>
    <div style={abs(640, 736, { display: 'flex', gap: 96 })}>
      <Tally kind="h" label="健康參照礁" note="從未受損" />
      <Tally kind="r" label="已復育" note="2024 年 2 月架設礁框" />
      <Tally kind="d" label="退化" note="未復育的碎石礁" />
    </div>
  </Sheet>
);

const MAP_MAIN: [number, number][] = [
  [520, 330],
  [560, 290],
  [630, 272],
  [700, 280],
  [762, 300],
  [788, 345],
  [772, 400],
  [722, 432],
  [650, 446],
  [590, 440],
  [540, 416],
  [506, 376],
];
const MAP_BATU: [number, number][] = [
  [282, 196],
  [302, 168],
  [346, 162],
  [382, 184],
  [376, 216],
  [336, 232],
  [296, 226],
];
const MAP_SEDAP: [number, number][] = [
  [822, 166],
  [846, 142],
  [886, 146],
  [906, 172],
  [880, 196],
  [840, 196],
];
const MAP_KECIL: [number, number][] = [
  [396, 470],
  [410, 452],
  [440, 455],
  [450, 476],
  [426, 492],
  [402, 487],
];
const MAP_SHOAL_W: [number, number][] = [
  [176, 120],
  [200, 100],
  [236, 106],
  [244, 132],
  [214, 150],
  [182, 144],
];
const MAP_SHOAL_E: [number, number][] = [
  [960, 318],
  [984, 296],
  [1018, 306],
  [1022, 340],
  [994, 360],
  [964, 348],
];
const MAP_ISOBATH: [number, number][] = [
  [200, 64],
  [430, 64],
  [700, 108],
  [930, 56],
  [1046, 150],
  [1048, 400],
  [960, 560],
  [700, 572],
  [430, 574],
  [214, 524],
  [164, 330],
];

const MAP_PATHS = {
  main: smoothClosed(MAP_MAIN),
  batu: smoothClosed(MAP_BATU),
  sedap: smoothClosed(MAP_SEDAP),
  kecil: smoothClosed(MAP_KECIL),
  flats: [
    smoothClosed(scaleAbout(MAP_MAIN, 1.28)),
    smoothClosed(scaleAbout(MAP_BATU, 1.5)),
    smoothClosed(scaleAbout(MAP_SEDAP, 1.55)),
    smoothClosed(scaleAbout(MAP_KECIL, 1.7)),
    smoothClosed(MAP_SHOAL_W),
    smoothClosed(MAP_SHOAL_E),
  ].join(''),
  isobath: smoothClosed(MAP_ISOBATH),
};

const NEATLINE = (() => {
  const x0 = 90;
  const y0 = 20;
  const x1 = 1070;
  const y1 = 590;
  const w = 8;
  const seg = 70;
  let d = '';
  let k = 0;
  for (let x = x0; x < x1; x += seg, k++) {
    if (k % 2 === 0) {
      const len = Math.min(seg, x1 - x);
      d += `M${x} ${y0}h${len}v${w}h${-len}z`;
      d += `M${x} ${y1 - w}h${len}v${w}h${-len}z`;
    }
  }
  k = 0;
  for (let y = y0; y < y1; y += seg, k++) {
    if (k % 2 === 1) {
      const len = Math.min(seg, y1 - y);
      d += `M${x0} ${y}h${w}v${len}h${-w}z`;
      d += `M${x1 - w} ${y}h${w}v${len}h${-w}z`;
    }
  }
  return d;
})();

const Site = ({
  x,
  y,
  kind,
  label,
  dx = 14,
  dy = 7,
}: {
  x: number;
  y: number;
  kind: Grp;
  label: string;
  dx?: number;
  dy?: number;
}) => (
  <g>
    {kind === 'h' && (
      <path d={circlePath(x, y, 8)} style={{ ...fillInk, stroke: PAPER, strokeWidth: 2 }} />
    )}
    {kind === 'r' && (
      <path d={squarePath(x, y, 16)} style={{ ...fillAccent, stroke: PAPER, strokeWidth: 2 }} />
    )}
    {kind === 'd' && (
      <path d={triPath(x, y, 19)} style={{ fill: PAPER, stroke: INK, strokeWidth: 2 }} />
    )}
    <text
      x={x + dx}
      y={y + dy}
      fontSize={20}
      fill="currentColor"
      textAnchor={dx < 0 ? 'end' : 'start'}
      style={{ ...SC, fontWeight: 600, paintOrder: 'stroke', stroke: PAPER, strokeWidth: 4 }}
    >
      {label}
    </text>
  </g>
);

const Sounding = ({ x, y, d }: { x: number; y: number; d: string }) => (
  <text x={x} y={y} fontSize={18} fontStyle="italic" fill={FAINT} textAnchor="middle" style={NUM}>
    {d}
  </text>
);

const PlaceName = ({
  x,
  y,
  size = 20,
  children,
}: {
  x: number;
  y: number;
  size?: number;
  children: ReactNode;
}) => (
  <text
    x={x}
    y={y}
    fontSize={size}
    textAnchor="middle"
    fontStyle="italic"
    fill="currentColor"
    style={{ paintOrder: 'stroke', stroke: TINT, strokeWidth: 4 }}
  >
    {children}
  </text>
);

const LegendRow = ({ kind, label, note }: { kind: Grp; label: string; note: string }) => (
  <div style={{ display: 'flex', gap: 22, alignItems: 'flex-start' }}>
    <div style={{ paddingTop: 6 }}>
      <Mark kind={kind} size={28} />
    </div>
    <div>
      <div style={{ fontSize: 30, lineHeight: 1.3 }}>{label}</div>
      <div style={{ fontSize: 22, lineHeight: 1.4, color: MUTED, fontStyle: 'italic' }}>{note}</div>
    </div>
  </div>
);

const SpecRow = ({ k, v, last }: { k: string; v: ReactNode; last?: boolean }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      fontSize: 28,
      lineHeight: 1.3,
      padding: '11px 0',
      borderBottom: last ? `2px solid ${INK}` : undefined,
    }}
  >
    <span style={{ color: MUTED }}>{k}</span>
    <span style={NUM}>{v}</span>
  </div>
);

const Sites: Page = () => (
  <Sheet section="§2 研究方法">
    <SecHead n="2.1">研究站位</SecHead>
    <svg
      width={1080}
      height={640}
      viewBox="0 0 1080 640"
      style={abs(120, 236, { color: INK, overflow: 'visible' })}
      aria-label="Kalea 群島十二個錄音站位分布圖"
    >
      <rect x={90} y={20} width={980} height={570} style={{ fill: PAPER }} />
      <path
        d={MAP_PATHS.isobath}
        style={{
          fill: 'none',
          stroke: MUTED,
          strokeWidth: 1.6,
          strokeDasharray: '1 6',
          strokeLinecap: 'round',
        }}
      />
      <path
        d={MAP_PATHS.flats}
        style={{ fill: 'none', stroke: INK, strokeWidth: 1.1, strokeDasharray: '7 5' }}
      />
      <path
        d={`${MAP_PATHS.main}${MAP_PATHS.batu}${MAP_PATHS.sedap}${MAP_PATHS.kecil}`}
        style={{ fill: TINT, stroke: INK, strokeWidth: 1.6 }}
      />
      <path d="M588 424h9v9h-9zM602 418h9v9h-9zM598 432h8v8h-8zM612 430h9v8h-9z" style={fillInk} />
      <path d="M618 442 L626 474" style={{ stroke: INK, strokeWidth: 3 }} />
      <PlaceName x={650} y={366} size={26}>
        Pulau Kalea
      </PlaceName>
      <PlaceName x={648} y={418}>
        Kalea
      </PlaceName>
      <PlaceName x={332} y={204}>
        Batu Lima
      </PlaceName>
      <PlaceName x={864} y={177}>
        Sedap
      </PlaceName>
      <text
        x={210}
        y={180}
        fontSize={18}
        textAnchor="middle"
        fontStyle="italic"
        fill={MUTED}
        style={{ paintOrder: 'stroke', stroke: PAPER, strokeWidth: 5 }}
      >
        Gosong Biru
      </text>
      <text x={992} y={392} fontSize={18} textAnchor="middle" fontStyle="italic" fill={MUTED}>
        Taka Lamun
      </text>
      <text
        x={1022}
        y={478}
        fontSize={18}
        fontStyle="italic"
        fill={MUTED}
        textAnchor="middle"
        style={{ paintOrder: 'stroke', stroke: PAPER, strokeWidth: 6 }}
      >
        20 m
      </text>
      <PlaceName x={423} y={478} size={18}>
        Kecil
      </PlaceName>
      <Sounding x={300} y={420} d="14" />
      <Sounding x={180} y={250} d="22" />
      <Sounding x={540} y={150} d="18" />
      <Sounding x={760} y={150} d="11" />
      <Sounding x={980} y={230} d="16" />
      <Sounding x={900} y={410} d="9" />
      <Sounding x={640} y={548} d="12" />
      <Sounding x={330} y={512} d="27" />
      <Sounding x={960} y={468} d="31" />
      <Sounding x={430} y={380} d="8" />
      <Site x={208} y={126} kind="h" label="H1" />
      <Site x={369} y={144} kind="h" label="H2" />
      <Site x={901} y={128} kind="h" label="H3" />
      <Site x={992} y={328} kind="h" label="H4" />
      <Site x={614} y={247} kind="r" label="R1" />
      <Site x={816} y={341} kind="r" label="R2" />
      <Site x={338} y={249} kind="r" label="R3" dx={-14} />
      <Site x={473} y={321} kind="r" label="R4" dx={-14} />
      <Site x={563} y={462} kind="d" label="D1" dx={-16} />
      <Site x={732} y={452} kind="d" label="D2" dx={16} />
      <Site x={430} y={506} kind="d" label="D3" dx={-16} />
      <Site x={870} y={214} kind="d" label="D4" dx={-16} />
      <path d={NEATLINE} style={fillInk} />
      <rect
        x={90}
        y={20}
        width={980}
        height={570}
        style={{ fill: 'none', stroke: INK, strokeWidth: 1.4 }}
      />
      <rect
        x={98}
        y={28}
        width={964}
        height={554}
        style={{ fill: 'none', stroke: INK, strokeWidth: 0.8 }}
      />
      <path d="M134 108 L134 56" style={{ stroke: INK, strokeWidth: 1.6 }} />
      <path d="M134 46 L142 72 L134 66 L126 72 Z" style={fillInk} />
      <text x={134} y={128} fontSize={20} textAnchor="middle" fill="currentColor" style={SC}>
        北
      </text>
      <rect x={122} y={556} width={60} height={8} style={fillInk} />
      <rect
        x={182}
        y={556}
        width={60}
        height={8}
        style={{ fill: PAPER, stroke: INK, strokeWidth: 1.2 }}
      />
      <text x={122} y={546} fontSize={18} textAnchor="middle" fill="currentColor" style={NUM}>
        0
      </text>
      <text x={182} y={546} fontSize={18} textAnchor="middle" fill="currentColor" style={NUM}>
        1
      </text>
      <text x={242} y={546} fontSize={18} textAnchor="middle" fill="currentColor" style={NUM}>
        2
      </text>
      <text x={256} y={546} fontSize={18} fill="currentColor" fontStyle="italic">
        km
      </text>
      <XL x={250} y={618}>
        120°12′E
      </XL>
      <XL x={580} y={618}>
        120°15′E
      </XL>
      <XL x={910} y={618}>
        120°18′E
      </XL>
      <YL x={80} y={150}>
        7°08′S
      </YL>
      <YL x={80} y={460}>
        7°11′S
      </YL>
    </svg>
    <div style={abs(1300, 252, { width: 500, display: 'flex', flexDirection: 'column', gap: 30 })}>
      <LegendRow kind="h" label="健康參照礁" note="H1–H4 · 外圍淺灘，珊瑚覆蓋率 > 40 %" />
      <LegendRow kind="r" label="已復育" note="R1–R4 · Reef Star 礁框，2024 年 2 月" />
      <LegendRow kind="d" label="退化" note="D1–D4 · 炸魚造成的碎石" />
    </div>
    <div style={abs(1300, 620, { width: 500, borderTop: `2px solid ${INK}` })}>
      <SpecRow k="水深" v="6–9 m" />
      <SpecRow k="最近站位距離" v="1.5–2.8 km" />
      <SpecRow k="錄音機" v="每站 1 台" last />
    </div>
    <Caption label="圖 2." style={abs(120, 888, { width: 1080 })}>
      Flores 海的 Kalea 群島。虛線：礁坪邊緣；點線：20 m
      等深線。各狀態的站位交錯分布，因此單一海岸線不會左右對比結果。
    </Caption>
  </Sheet>
);

const RUBBLE = (() => {
  const rand = mulberry32(31);
  let d = '';
  for (let i = 0; i < 90; i++) {
    const x = 50 + rand() * 940;
    const y = 498 + rand() * 54;
    const s = 4 + rand() * 7;
    const a = rand() * Math.PI;
    const pts: string[] = [];
    for (let k = 0; k < 5; k++) {
      const ang = a + (k / 5) * Math.PI * 2;
      const rr = s * (0.6 + rand() * 0.5);
      pts.push(`${r1(x + Math.cos(ang) * rr)} ${r1(y + Math.sin(ang) * rr * 0.6)}`);
    }
    d += `M${pts.join('L')}z`;
  }
  return d;
})();

const STAR_FRAMES = (() => {
  const base = 486;
  let d = '';
  for (const x of [170, 270, 370, 470, 800, 900]) {
    d += `M${x} ${base}L${x + 50} ${base - 66}L${x + 100} ${base}`;
    d += `M${x + 22} ${base}L${x + 50} ${base - 66}L${x + 78} ${base}`;
    d += `M${x + 13} ${base - 17}L${x + 87} ${base - 17}`;
  }
  return d;
})();

const SURFACE = `M40 62 q12 -6 24 0${' t24 0'.repeat(39)}`;

const Coral = ({ x, y, s }: { x: number; y: number; s: number }) => (
  <path
    d="M0 0V-16M0 -8L-11 -20V-32M-11 -24L-19 -31M0 -10L11 -24V-36M11 -28L19 -36M0 -16V-30M0 -24L-6 -32"
    transform={`translate(${x} ${y}) scale(${s})`}
    vectorEffect="non-scaling-stroke"
    style={{
      fill: 'none',
      stroke: INK,
      strokeWidth: 3,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }}
  />
);

const Fish = ({ x, y, flip }: { x: number; y: number; flip?: boolean }) => (
  <path
    d="M0 0 C 10 -12, 30 -12, 40 0 C 30 12, 10 12, 0 0 Z M40 0 L 54 -10 L 52 0 L 54 10 Z"
    transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}
    style={{ fill: PAPER, stroke: INK, strokeWidth: 1.6, strokeLinejoin: 'round' }}
  />
);

const Letter = ({ x, y, children }: { x: number; y: number; children: ReactNode }) => (
  <text
    x={x}
    y={y}
    fontSize={24}
    fontStyle="italic"
    fill="currentColor"
    style={{ paintOrder: 'stroke', stroke: PAPER, strokeWidth: 5 }}
  >
    {children}
  </text>
);

const DutyBlock = ({ m }: { m: number }) => (
  <rect x={m * 9} y={10} width={18} height={30} style={fillAccent} />
);

const Deployment: Page = () => (
  <Sheet section="§2 研究方法">
    <SecHead n="2.2">水下麥克風布放</SecHead>
    <svg
      width={1040}
      height={570}
      viewBox="0 0 1040 570"
      style={abs(120, 240, { color: INK, overflow: 'visible' })}
      aria-label="復育珊瑚礁上錄音機布放的剖面示意圖"
    >
      <path d={SURFACE} style={{ fill: 'none', stroke: INK, strokeWidth: 1.6 }} />
      <text x={1000} y={40} fontSize={20} textAnchor="end" fontStyle="italic" fill={MUTED}>
        海面
      </text>
      <path d="M72 72 L72 476" style={{ stroke: INK, strokeWidth: 1.2 }} />
      <path d="M72 70 l-6 14 h12 z M72 478 l-6 -14 h12 z" style={fillInk} />
      <text
        x={58}
        y={274}
        fontSize={22}
        fontStyle="italic"
        textAnchor="middle"
        fill="currentColor"
        transform="rotate(-90 58 274)"
      >
        6–9 m
      </text>
      <path
        d="M40 486 C 200 476, 340 496, 520 488 S 820 480, 1000 490 L1000 560 L40 560 Z"
        style={{ fill: TINT, stroke: INK, strokeWidth: 1.6 }}
      />
      <path d={RUBBLE} style={{ fill: 'none', stroke: MUTED, strokeWidth: 1.1 }} />
      <path
        d={STAR_FRAMES}
        style={{ fill: 'none', stroke: INK, strokeWidth: 2.6, strokeLinejoin: 'round' }}
      />
      <Coral x={220} y={420} s={0.7} />
      <Coral x={320} y={420} s={1.3} />
      <Coral x={420} y={420} s={1} />
      <Coral x={520} y={420} s={1.5} />
      <Coral x={850} y={420} s={1.15} />
      <Coral x={950} y={420} s={0.8} />
      <Fish x={300} y={300} />
      <Fish x={460} y={250} flip />
      <Fish x={850} y={200} />
      <path
        d="M560 342 A 172 172 0 0 1 904 342 M610 342 A 122 122 0 0 1 854 342 M660 342 A 72 72 0 0 1 804 342"
        style={{ fill: 'none', stroke: ACCENT, strokeWidth: 1.6, strokeDasharray: '6 7' }}
      />
      <path d="M660 494 L660 352" style={{ stroke: INK, strokeWidth: 4, strokeLinecap: 'round' }} />
      <path d="M652 494 L668 494 L660 512 Z" style={fillInk} />
      <rect
        x={612}
        y={330}
        width={110}
        height={26}
        rx={13}
        style={{ fill: PAPER, stroke: INK, strokeWidth: 2 }}
      />
      <path d="M646 326 v34 M690 326 v34" style={{ stroke: INK, strokeWidth: 2 }} />
      <circle cx={732} cy={343} r={9} style={{ ...fillAccent, stroke: INK, strokeWidth: 1.6 }} />
      <path d="M760 343 L760 490" style={{ stroke: INK, strokeWidth: 1 }} />
      <path d="M752 343 h16 M752 490 h16" style={{ stroke: INK, strokeWidth: 1.2 }} />
      <text x={772} y={426} fontSize={20} fontStyle="italic" fill="currentColor">
        0.5 m
      </text>
      <path d="M786 286 L740 336" style={{ stroke: INK, strokeWidth: 1 }} />
      <Letter x={790} y={282}>
        (a)
      </Letter>
      <path d="M586 290 L626 330" style={{ stroke: INK, strokeWidth: 1 }} />
      <Letter x={556} y={286}>
        (b)
      </Letter>
      <path d="M612 440 L656 432" style={{ stroke: INK, strokeWidth: 1 }} />
      <Letter x={576} y={448}>
        (c)
      </Letter>
      <path d="M146 446 L186 470" style={{ stroke: INK, strokeWidth: 1 }} />
      <Letter x={108} y={448}>
        (d)
      </Letter>
      <Letter x={150} y={540}>
        (e)
      </Letter>
      <text x={914} y={336} fontSize={20} fontStyle="italic" style={fillAccent}>
        ≈ 100 m
      </text>
    </svg>
    <Caption label="圖 3." style={abs(120, 826, { width: 1040 })}>
      復育站位的布放方式，未按比例繪製。(a) 水下麥克風；(b) 錄音機外殼；(c) 鋼樁；(d) Reef Star
      礁框；(e) 碎石。弧線：標稱收音範圍。
      <Fn n="2" />
    </Caption>
    <Caption label="表 1." style={abs(1260, 248, { width: 540 })}>
      錄音設定。
    </Caption>
    <div style={abs(1260, 300, { width: 540, borderTop: `2px solid ${INK}` })}>
      <SpecRow k="靈敏度" v="−176 dB re 1 V/µPa" />
      <SpecRow k="取樣" v="48 kHz, 16 bit" />
      <SpecRow k="工作週期" v="每 10 分鐘錄 2 分鐘" />
      <SpecRow k="布放期間" v="2024/03 – 2025/09" />
      <SpecRow k="維護" v="每 3 個月" />
      <SpecRow k="錄音機日數" v="6,480" last />
    </div>
    <div style={abs(1260, 720, { ...SC, fontSize: 22, color: MUTED })}>工作週期（一小時）</div>
    <svg
      width={540}
      height={84}
      viewBox="0 0 540 84"
      style={abs(1260, 756, { color: INK, overflow: 'visible' })}
      aria-hidden="true"
    >
      <rect
        x={0}
        y={10}
        width={540}
        height={30}
        style={{ fill: 'none', stroke: INK, strokeWidth: 1.2 }}
      />
      <DutyBlock m={0} />
      <DutyBlock m={10} />
      <DutyBlock m={20} />
      <DutyBlock m={30} />
      <DutyBlock m={40} />
      <DutyBlock m={50} />
      <XL x={0} y={70}>
        0
      </XL>
      <XL x={270} y={70}>
        30
      </XL>
      <text x={540} y={70} fontSize={20} textAnchor="end" fill="currentColor" style={NUM}>
        60 分鐘
      </text>
    </svg>
    <Footnote n="2">
      針對 R2 站位的魚類叫聲；依回放試驗推算，假設為球面擴散，環境噪音為 98 dB re 1 µPa。
    </Footnote>
  </Sheet>
);

const Glyph = ({ children }: { children: ReactNode }) => (
  <svg
    width={180}
    height={70}
    viewBox="0 0 180 70"
    style={{ display: 'block', margin: '18px auto 16px', color: INK, overflow: 'visible' }}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const GLYPH_WAVE = (() => {
  const rand = mulberry32(3);
  let d = 'M0 35';
  for (let i = 1; i <= 90; i++) {
    const u = i / 90;
    const env =
      0.25 +
      0.75 * Math.exp(-((u - 0.35) ** 2) / 0.004) +
      0.6 * Math.exp(-((u - 0.72) ** 2) / 0.003);
    d += `L${r1(u * 180)} ${r1(35 + (rand() * 2 - 1) * 28 * Math.min(1, env))}`;
  }
  return d;
})();

const GLYPH_GRID = (() => {
  const rand = mulberry32(11);
  const cells: string[] = ['', '', '', ''];
  for (let c = 0; c < 12; c++) {
    for (let r = 0; r < 5; r++) {
      const v = rand() * (r < 2 ? 1 : 0.7) + (c === 4 || c === 8 ? 0.5 : 0);
      const lvl = Math.min(3, Math.floor(v * 3));
      cells[lvl] += `M${c * 15} ${r * 14}h15v14h-15z`;
    }
  }
  return cells;
})();

const Stage = ({
  n,
  title,
  detail,
  volume,
  children,
}: {
  n: string;
  title: string;
  detail: ReactNode;
  volume: ReactNode;
  children: ReactNode;
}) => (
  <div style={{ width: 240, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div
      style={{
        width: 240,
        height: 290,
        boxSizing: 'border-box',
        border: `1.5px solid ${INK}`,
        borderRadius: 'var(--osd-radius)',
        background: PAPER,
        padding: '22px 18px',
        textAlign: 'center',
      }}
    >
      <div style={{ ...SC, ...NUM, fontSize: 22, color: ACCENT, lineHeight: 1 }}>階段 {n}</div>
      <div style={{ fontSize: 31, fontWeight: 600, lineHeight: 1.2, marginTop: 12 }}>{title}</div>
      <Glyph>{children}</Glyph>
      <div style={{ fontSize: 21, lineHeight: 1.4, color: MUTED, fontStyle: 'italic' }}>
        {detail}
      </div>
    </div>
    <div style={{ ...NUM, fontSize: 22, lineHeight: 1.35, marginTop: 18, textAlign: 'center' }}>
      {volume}
    </div>
  </div>
);

const Arrow = () => (
  <svg width={48} height={290} viewBox="0 0 48 290" aria-hidden="true" style={{ flex: 'none' }}>
    <path d="M8 145 H34" style={{ stroke: INK, strokeWidth: 1.6 }} />
    <path d="M42 145 L30 138 L30 152 Z" style={fillInk} />
  </svg>
);

const Pipeline: Page = () => (
  <Sheet section="§2 研究方法">
    <SecHead n="2.3">訊號處理流程</SecHead>
    <div
      style={abs(120, 238, { fontSize: 32, lineHeight: 1.45, fontStyle: 'italic', color: MUTED })}
    >
      從 9.8 TB 的原始音檔，到每個站位、每個頻帶、每天各一個數值。
      <Fn n="3" />
    </div>
    <div style={abs(120, 330, { width: 1680, display: 'flex', alignItems: 'flex-start' })}>
      <Stage
        n="1"
        title="校正"
        detail={
          <>
            端對端增益，
            <br />
            逐台錄音機
          </>
        }
        volume="851,328 段音檔"
      >
        <path d={GLYPH_WAVE} style={{ fill: 'none', stroke: INK, strokeWidth: 1.3 }} />
      </Stage>
      <Arrow />
      <Stage
        n="2"
        title="篩選"
        detail={
          <>
            船舶音調線
            <br />
            偵測器 [10]
          </>
        }
        volume="− 8.8 % 音檔"
      >
        <path d={GLYPH_WAVE} style={{ fill: 'none', stroke: FAINT, strokeWidth: 1.3 }} />
        <rect
          x={98}
          y={2}
          width={64}
          height={66}
          style={{ fill: 'none', stroke: ACCENT, strokeWidth: 2 }}
        />
        <path d="M104 8 L156 62 M156 8 L104 62" style={{ stroke: ACCENT, strokeWidth: 2 }} />
      </Stage>
      <Arrow />
      <Stage
        n="3"
        title="STFT"
        detail={
          <>
            Hann 窗，N = 2048，
            <br />
            50 % 重疊
          </>
        }
        volume="1,025 頻格 × 5,624 時框"
      >
        <path d={GLYPH_GRID[0]} style={{ fill: TINT }} />
        <path d={GLYPH_GRID[1]} style={{ fill: FAINT }} />
        <path d={GLYPH_GRID[2]} style={{ fill: MUTED }} />
        <path d={GLYPH_GRID[3]} style={fillInk} />
      </Stage>
      <Arrow />
      <Stage
        n="4"
        title="頻帶分割"
        detail={
          <>
            魚類 0.05–1 kHz；
            <br />
            槍蝦 2–20 kHz
          </>
        }
        volume="41 + 769 頻格"
      >
        <rect
          x={10}
          y={4}
          width={160}
          height={24}
          style={{ fill: 'none', stroke: INK, strokeWidth: 1.5 }}
        />
        <rect
          x={10}
          y={42}
          width={160}
          height={24}
          style={{ ...fillAccent, stroke: INK, strokeWidth: 1.5 }}
        />
        <text
          x={90}
          y={22}
          fontSize={17}
          textAnchor="middle"
          fontStyle="italic"
          fill="currentColor"
        >
          槍蝦
        </text>
        <text x={90} y={60} fontSize={17} textAnchor="middle" fontStyle="italic" style={fillPaper}>
          魚類
        </text>
      </Stage>
      <Arrow />
      <Stage
        n="5"
        title="指數"
        detail={
          <>
            ACI、頻帶 SPL、
            <br />
            爆音率
          </>
        }
        volume="776,411 × 3 個數值"
      >
        <text
          x={90}
          y={58}
          fontSize={64}
          textAnchor="middle"
          fill="currentColor"
          style={{ fontFamily: MATH_FONT }}
        >
          ∑
        </text>
      </Stage>
      <Arrow />
      <Stage
        n="6"
        title="模型"
        detail={
          <>
            混合效應模型，
            <br />
            站位設為隨機 [9]
          </>
        }
        volume="5,912 站位日"
      >
        <path d="M6 64 H176 M6 64 V4" style={{ fill: 'none', stroke: INK, strokeWidth: 1.2 }} />
        <path
          d="M10 58 C 50 26, 90 16, 172 12"
          style={{ fill: 'none', stroke: ACCENT, strokeWidth: 2.2 }}
        />
        <path
          d={`${squarePath(30, 50, 8)}${squarePath(62, 34, 8)}${squarePath(96, 22, 8)}${squarePath(132, 20, 8)}${squarePath(160, 12, 8)}`}
          style={fillInk}
        />
      </Stage>
    </div>
    <Caption label="圖 4." style={abs(120, 760, { width: 1500 })}>
      處理流程。各階段下方的數字為該階段輸出的資料量；階段 1–5 以每段兩分鐘的音檔為單位執行，階段 6
      則以各站位的每日平均值進行。
    </Caption>
    <Footnote n="3" top={900}>
      階段 1–5 以 Python 3.12（<i>scipy.signal</i>）執行，在一台 32 核心工作站上耗時 41 小時；階段 6
      以 R 4.4 搭配 <i>lme4</i> <Cite n="9" /> 執行。
    </Footnote>
  </Sheet>
);

const Var = ({ children }: { children: ReactNode }) => (
  <span style={{ fontStyle: 'italic' }}>{children}</span>
);

const Op = ({ children, pad = 0.22 }: { children: ReactNode; pad?: number }) => (
  <span style={{ fontFamily: MATH_FONT, margin: `0 ${pad}em` }}>{children}</span>
);

const Sub = ({ children }: { children: ReactNode }) => (
  <sub style={{ fontSize: '0.6em', verticalAlign: '-0.35em', lineHeight: 0, marginLeft: '0.04em' }}>
    {children}
  </sub>
);

const Sup = ({ children }: { children: ReactNode }) => (
  <sup style={{ fontSize: '0.6em', verticalAlign: '0.55em', lineHeight: 0, marginLeft: '0.04em' }}>
    {children}
  </sup>
);

const Frac = ({ num, den }: { num: ReactNode; den: ReactNode }) => (
  <span
    style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: '0 0.12em',
    }}
  >
    <span style={{ padding: '0 0.18em 0.12em', whiteSpace: 'nowrap' }}>{num}</span>
    <span style={{ alignSelf: 'stretch', borderTop: '2px solid currentColor' }} />
    <span style={{ padding: '0.1em 0.18em 0', whiteSpace: 'nowrap' }}>{den}</span>
  </span>
);

const BigSum = ({ lo, hi }: { lo: ReactNode; hi: ReactNode }) => (
  <span
    style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: '0 0.18em',
      lineHeight: 1,
    }}
  >
    <span style={{ fontSize: '0.56em', marginBottom: '0.3em' }}>{hi}</span>
    <span style={{ fontFamily: MATH_FONT, fontSize: '1.9em', lineHeight: 1.05 }}>∑</span>
    <span style={{ fontSize: '0.56em', marginTop: '0.15em' }}>{lo}</span>
  </span>
);

const InlineSum = ({ lo, hi }: { lo: ReactNode; hi: ReactNode }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: '0.12em' }}>
    <span style={{ fontFamily: MATH_FONT, fontSize: '1.15em', lineHeight: 1 }}>∑</span>
    <span
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        fontSize: '0.56em',
        lineHeight: 1.15,
        marginLeft: '0.08em',
      }}
    >
      <span>{hi}</span>
      <span style={{ height: '0.5em' }} />
      <span>{lo}</span>
    </span>
  </span>
);

const Ikj = ({ j }: { j: ReactNode }) => (
  <span>
    <Var>I</Var>
    <Sub>
      <Var>k</Var>,{j}
    </Sub>
  </span>
);

const EqNo = ({ n }: { n: string }) => (
  <span style={{ ...NUM, fontSize: 36, fontFamily: 'var(--osd-font-body)' }}>({n})</span>
);

const Where = ({ sym, children }: { sym: ReactNode; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 31, lineHeight: 1.5 }}>
    <span style={{ width: 140, textAlign: 'right', fontSize: 36, flex: 'none' }}>{sym}</span>
    <span style={{ width: 70, textAlign: 'center', color: FAINT, flex: 'none' }}>—</span>
    <span>{children}</span>
  </div>
);

const Equation: Page = () => (
  <Sheet section="§2 研究方法">
    <SecHead n="2.4">聲學指數</SecHead>
    <div style={abs(120, 238, { fontSize: 32, lineHeight: 1.45 })}>
      每段音檔以聲學複雜度指數（ACI）
      <Cite n="3" /> 摘要，並在每個頻帶 <Var>b</Var> 中分別計算：
    </div>
    <div
      style={abs(120, 316, {
        width: 1680,
        height: 190,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 54,
        whiteSpace: 'nowrap',
      })}
    >
      <span>
        ACI
        <Sub>
          <Var>b</Var>
        </Sub>
      </span>
      <Op pad={0.4}>=</Op>
      <BigSum
        lo={
          <span>
            <Var>k</Var>
            <Op pad={0.1}>=</Op>1
          </span>
        }
        hi={<Var>q</Var>}
      />
      <Frac
        num={
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <InlineSum
              lo={
                <span>
                  <Var>j</Var>
                  <Op pad={0.08}>=</Op>1
                </span>
              }
              hi={
                <span>
                  <Var>n</Var>
                  <Op pad={0.08}>−</Op>1
                </span>
              }
            />
            <Op pad={0.06}>|</Op>
            <Ikj
              j={
                <span>
                  <Var>j</Var>+1
                </span>
              }
            />
            <Op>−</Op>
            <Ikj j={<Var>j</Var>} />
            <Op pad={0.06}>|</Op>
          </span>
        }
        den={
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <InlineSum
              lo={
                <span>
                  <Var>j</Var>
                  <Op pad={0.08}>=</Op>1
                </span>
              }
              hi={<Var>n</Var>}
            />
            <Ikj j={<Var>j</Var>} />
          </span>
        }
      />
    </div>
    <div style={abs(1700, 390, { width: 100, textAlign: 'right' })}>
      <EqNo n="1" />
    </div>
    <div style={abs(120, 526, { display: 'flex', flexDirection: 'column', gap: 2 })}>
      <div style={{ fontSize: 31, fontStyle: 'italic', marginBottom: 6 }}>其中</div>
      <Where
        sym={
          <span>
            <Var>I</Var>
            <Sub>
              <Var>k</Var>,<Var>j</Var>
            </Sub>
          </span>
        }
      >
        為頻格 <Var>k</Var> 在時間步 <Var>j</Var> 的 STFT 振幅
        {'；'}
      </Where>
      <Where sym={<Var>n</Var>}>
        為一段音檔的時間步總數（兩分鐘時 <Var>n</Var> = 5,624）；
      </Where>
      <Where sym={<Var>q</Var>}>為該頻帶的頻格數（魚類 41、槍蝦 769）。</Where>
    </div>
    <div style={abs(120, 778, { width: 1680, height: 1, background: FAINT })} />
    <div style={abs(120, 802, { ...SC, fontSize: 22, color: MUTED })}>復育比例</div>
    <div
      style={abs(120, 834, {
        width: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 40,
        whiteSpace: 'nowrap',
      })}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
        <Var>ρ</Var>
        <Op pad={0.04}>(</Op>
        <Var>t</Var>
        <Op pad={0.04}>)</Op>
        <Op pad={0.35}>=</Op>
        <Frac
          num={
            <span>
              ACI
              <Sub>
                <Var>R</Var>
              </Sub>
              <Op pad={0.04}>(</Op>
              <Var>t</Var>
              <Op pad={0.04}>)</Op>
              <Op>−</Op>
              ACI
              <Sub>
                <Var>D</Var>
              </Sub>
            </span>
          }
          den={
            <span>
              ACI
              <Sub>
                <Var>H</Var>
              </Sub>
              <Op>−</Op>
              ACI
              <Sub>
                <Var>D</Var>
              </Sub>
            </span>
          }
        />
      </span>
      <EqNo n="2" />
    </div>
    <div style={abs(1000, 802, { ...SC, fontSize: 22, color: MUTED })}>飽和型復育模型</div>
    <div
      style={abs(1000, 834, {
        width: 800,
        height: 112,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 40,
        whiteSpace: 'nowrap',
      })}
    >
      <span>
        <Var>ρ</Var>
        <Op pad={0.04}>(</Op>
        <Var>t</Var>
        <Op pad={0.04}>)</Op>
        <Op pad={0.35}>=</Op>
        <Var>ρ</Var>
        <Sub>
          <Op pad={0}>∞</Op>
        </Sub>
        <Op pad={0.1}>(</Op>1<Op>−</Op>
        <Var>e</Var>
        <Sup>
          <Op pad={0}>−</Op>
          <Var>t</Var>/<Var>τ</Var>
        </Sup>
        <Op pad={0.1}>)</Op>
      </span>
      <EqNo n="3" />
    </div>
  </Sheet>
);

const SPEC_COLS = 240;
const SPEC_ROWS = 80;
const SPEC_CW = 5.4;
const SPEC_RH = 7;
const SPEC_W = SPEC_COLS * SPEC_CW;
const SPEC_H = SPEC_ROWS * SPEC_RH;
const SPEC_X = 90;
const SPEC_Y = 14;
const SPEC_LEVELS = 12;
const F_MIN = 50;
const F_MAX = 24000;
const LOG_SPAN = Math.log(F_MAX / F_MIN);
const fRow = (f: number) => (Math.log(f / F_MIN) / LOG_SPAN) * (SPEC_ROWS - 1);
const fY = (f: number) => r1(SPEC_Y + SPEC_H - (fRow(f) + 0.5) * SPEC_RH);
const tX = (t: number) => r1(SPEC_X + (t / 60) * SPEC_W);
const bump = (r: number, c: number, w: number) => Math.exp(-((r - c) ** 2) / (2 * w * w));

const SPEC_PATHS = (() => {
  const rand = mulberry32(20240214);
  const grid: number[][] = [];
  const snapAmp: number[] = [];
  for (let c = 0; c < SPEC_COLS; c++) {
    snapAmp.push(rand() < 0.4 ? 0.22 + 0.62 * rand() ** 2 : 0);
  }
  const knocks = new Set<number>();
  for (let i = 0; i < 16; i++) knocks.add(Math.floor(rand() * SPEC_COLS));
  for (let c = 0; c < SPEC_COLS; c++) {
    const col: number[] = [];
    for (let r = 0; r < SPEC_ROWS; r++) {
      const f = F_MIN * Math.exp((r / (SPEC_ROWS - 1)) * LOG_SPAN);
      const lf = r / (SPEC_ROWS - 1);
      let v = 0.14 + 0.2 * (1 - lf) + rand() * 0.09;
      if (f > 1800) v += 0.14 * Math.min(1, (f - 1800) / 2500) * (f > 16000 ? 0.6 : 1);
      const snap = snapAmp[c] + (c > 0 ? snapAmp[c - 1] * 0.3 : 0);
      if (snap > 0 && f > 900) {
        v += snap * (0.6 + 0.4 * rand()) * (f < 1800 ? 0.35 : 1) * (f > 15000 ? 0.75 : 1);
      }
      if (c >= 24 && c <= 62 && (c - 24) % 3 < 2) {
        const p = Math.floor((c - 24) / 3);
        const k = (c - 24) % 3 === 0 ? 1 : 0.5;
        const f0 = 205 * (1 + 0.04 * Math.sin(p));
        for (let h = 1; h <= 5; h++) v += ((k * 0.78) / h ** 0.6) * bump(r, fRow(f0 * h), 0.7);
      }
      if (knocks.has(c) && f < 1200) v += 0.42 * bump(r, fRow(170), 2.6);
      if (c >= 72 && c <= 120) {
        const e = Math.sin((Math.PI * (c - 72)) / 48) ** 1.5;
        const f0 = 124 * (1 + 0.035 * (0.5 - (c - 72) / 48));
        for (let h = 1; h <= 7; h++) v += ((0.62 * e) / h ** 0.45) * bump(r, fRow(f0 * h), 0.5);
        v += 0.28 * e * bump(r, fRow(260), 7);
      }
      if (c >= 136) {
        const ramp = ((c - 136) / 103) ** 0.7;
        v += ramp * 0.62 * (0.5 + 0.5 * rand()) * bump(r, fRow(560), 3.2);
      }
      col.push(v);
    }
    grid.push(col);
  }
  const paths: string[] = [];
  for (let l = 0; l <= SPEC_LEVELS; l++) paths.push('');
  const level = (v: number) =>
    clamp(Math.floor(clamp(v - 0.08, 0, 1) ** 1.15 * (SPEC_LEVELS + 0.99)), 0, SPEC_LEVELS);
  for (let r = 0; r < SPEC_ROWS; r++) {
    const y = r1(SPEC_Y + SPEC_H - (r + 1) * SPEC_RH);
    let c = 0;
    while (c < SPEC_COLS) {
      const l = level(grid[c][r]);
      let e = c + 1;
      while (e < SPEC_COLS && level(grid[e][r]) === l) e++;
      if (l > 0) {
        const x = r1(SPEC_X + c * SPEC_CW);
        const w = r1((e - c) * SPEC_CW);
        paths[l] += `M${x} ${y}h${w}v${SPEC_RH}h${-w}z`;
      }
      c = e;
    }
  }
  return paths;
})();

const levelOpacity = (l: number) => r1((l / SPEC_LEVELS) ** 1.05 * 9.2) / 10;

const SpecLevel = ({ l }: { l: number }) => (
  <path
    d={SPEC_PATHS[l]}
    style={{ fill: INK, fillOpacity: levelOpacity(l) }}
    shapeRendering="crispEdges"
  />
);

const CB_X = 1560;
const CbCell = ({ l }: { l: number }) => (
  <rect
    x={CB_X}
    y={SPEC_Y + SPEC_H - ((l + 1) * SPEC_H) / (SPEC_LEVELS + 1)}
    width={22}
    height={SPEC_H / (SPEC_LEVELS + 1)}
    style={{ fill: INK, fillOpacity: levelOpacity(l) }}
    shapeRendering="crispEdges"
  />
);

const Bracket = ({ t0, t1, y, label }: { t0: number; t1: number; y: number; label: string }) => (
  <g>
    <path
      d={`M${tX(t0)} ${y + 10}V${y}H${tX(t1)}V${y + 10}`}
      style={{ fill: 'none', stroke: PAPER, strokeWidth: 6 }}
    />
    <path
      d={`M${tX(t0)} ${y + 10}V${y}H${tX(t1)}V${y + 10}`}
      style={{ fill: 'none', stroke: ACCENT, strokeWidth: 2 }}
    />
    <text
      x={(tX(t0) + tX(t1)) / 2}
      y={y - 10}
      fontSize={24}
      textAnchor="middle"
      fontStyle="italic"
      style={{ ...fillAccent, paintOrder: 'stroke', stroke: PAPER, strokeWidth: 6 }}
    >
      {label}
    </text>
  </g>
);

const Brace = ({ f0, f1, label }: { f0: number; f1: number; label: string }) => {
  const x = SPEC_X + SPEC_W + 16;
  const ya = fY(f1);
  const yb = fY(f0);
  return (
    <g>
      <path
        d={`M${x} ${ya}h8V${yb}h-8M${x + 8} ${(ya + yb) / 2}h8`}
        style={{ fill: 'none', stroke: ACCENT, strokeWidth: 1.8 }}
      />
      <text x={x + 24} y={(ya + yb) / 2 + 7} fontSize={21} fontStyle="italic" style={fillAccent}>
        {label}
      </text>
    </g>
  );
};

const Spectrogram: Page = () => (
  <Sheet section="§3 研究結果">
    <SecHead n="3.1">復育中的珊瑚礁聽起來是什麼樣子</SecHead>
    <svg
      width={1680}
      height={640}
      viewBox="0 0 1680 640"
      style={abs(120, 232, { color: INK, overflow: 'visible' })}
      aria-label="復育站位一分鐘珊瑚礁聲音的頻譜圖"
    >
      <SpecLevel l={1} />
      <SpecLevel l={2} />
      <SpecLevel l={3} />
      <SpecLevel l={4} />
      <SpecLevel l={5} />
      <SpecLevel l={6} />
      <SpecLevel l={7} />
      <SpecLevel l={8} />
      <SpecLevel l={9} />
      <SpecLevel l={10} />
      <SpecLevel l={11} />
      <SpecLevel l={12} />
      <PlotBox
        x0={SPEC_X}
        y0={SPEC_Y}
        x1={SPEC_X + SPEC_W}
        y1={SPEC_Y + SPEC_H}
        ticks={boxTicks(
          SPEC_X,
          SPEC_Y,
          SPEC_X + SPEC_W,
          SPEC_Y + SPEC_H,
          [tX(10), tX(20), tX(30), tX(40), tX(50)],
          [fY(100), fY(200), fY(500), fY(1000), fY(2000), fY(5000), fY(10000), fY(20000)],
        )}
      />
      <Bracket t0={5.6} t1={15.8} y={fY(1500)} label="(a)" />
      <Bracket t0={17.8} t1={30.2} y={fY(1700)} label="(c)" />
      <Bracket t0={34} t1={59.4} y={fY(1250)} label="(d)" />
      <Brace f0={50} f1={1000} label="魚類" />
      <Brace f0={2000} f1={20000} label="槍蝦 (b)" />
      <YL x={SPEC_X - 12} y={fY(100)}>
        0.1
      </YL>
      <YL x={SPEC_X - 12} y={fY(200)}>
        0.2
      </YL>
      <YL x={SPEC_X - 12} y={fY(500)}>
        0.5
      </YL>
      <YL x={SPEC_X - 12} y={fY(1000)}>
        1
      </YL>
      <YL x={SPEC_X - 12} y={fY(2000)}>
        2
      </YL>
      <YL x={SPEC_X - 12} y={fY(5000)}>
        5
      </YL>
      <YL x={SPEC_X - 12} y={fY(10000)}>
        10
      </YL>
      <YL x={SPEC_X - 12} y={fY(20000)}>
        20
      </YL>
      <XL x={tX(0)} y={SPEC_Y + SPEC_H + 30}>
        0
      </XL>
      <XL x={tX(10)} y={SPEC_Y + SPEC_H + 30}>
        10
      </XL>
      <XL x={tX(20)} y={SPEC_Y + SPEC_H + 30}>
        20
      </XL>
      <XL x={tX(30)} y={SPEC_Y + SPEC_H + 30}>
        30
      </XL>
      <XL x={tX(40)} y={SPEC_Y + SPEC_H + 30}>
        40
      </XL>
      <XL x={tX(50)} y={SPEC_Y + SPEC_H + 30}>
        50
      </XL>
      <XL x={tX(60)} y={SPEC_Y + SPEC_H + 30}>
        60
      </XL>
      <AxisTitle x={tX(30)} y={SPEC_Y + SPEC_H + 62}>
        時間 (s)
      </AxisTitle>
      <AxisTitle x={22} y={SPEC_Y + SPEC_H / 2} rotate>
        頻率 (kHz，對數刻度)
      </AxisTitle>
      <CbCell l={0} />
      <CbCell l={1} />
      <CbCell l={2} />
      <CbCell l={3} />
      <CbCell l={4} />
      <CbCell l={5} />
      <CbCell l={6} />
      <CbCell l={7} />
      <CbCell l={8} />
      <CbCell l={9} />
      <CbCell l={10} />
      <CbCell l={11} />
      <CbCell l={12} />
      <rect
        x={CB_X}
        y={SPEC_Y}
        width={22}
        height={SPEC_H}
        style={{ fill: 'none', stroke: INK, strokeWidth: 1.2 }}
      />
      <text x={CB_X + 32} y={SPEC_Y + SPEC_H + 6} fontSize={20} fill="currentColor" style={NUM}>
        50
      </text>
      <text x={CB_X + 32} y={SPEC_Y + SPEC_H / 2 + 7} fontSize={20} fill="currentColor" style={NUM}>
        75
      </text>
      <text x={CB_X + 32} y={SPEC_Y + 14} fontSize={20} fill="currentColor" style={NUM}>
        100
      </text>
      <AxisTitle x={1660} y={SPEC_Y + SPEC_H / 2} rotate>
        功率頻譜密度，dB re 1 µPa²/Hz
      </AxisTitle>
    </svg>
    <Caption label="圖 5." style={abs(120, 878, { width: 1680 })}>
      R2 站位第 14 個月、當地時間 18:42 的一分鐘錄音。(a) 咕嚕聲序列，205 Hz 及其諧波；(b)
      槍蝦的爆音，2 kHz 以上的寬頻聲響；(c) 船隻經過，124 Hz 的諧波 — 這類音檔會被篩除；(d)
      黃昏合唱開始，約在 560 Hz。
    </Caption>
  </Sheet>
);

const RX = (t: number) => r1(100 + t * (1030 / 19));
const RY = (v: number) => r1(520 - (v - 120) * (500 / 70));
const FIT_INF = 40.9;
const FIT_TAU = 6.2;
const fit = (t: number) => 131.2 + FIT_INF * (1 - Math.exp(-t / FIT_TAU));

const FIT_PATH = (() => {
  let d = `M${RX(0)} ${RY(fit(0))}`;
  for (let t = 0.25; t <= 19.001; t += 0.25) d += `L${RX(t)} ${RY(fit(t))}`;
  return d;
})();

const ObsPt = ({ t, v, ci }: { t: number; v: number; ci: number }) => (
  <g>
    <path
      d={`M${RX(t)} ${RY(v - ci)}V${RY(v + ci)}M${RX(t) - 7} ${RY(v - ci)}h14M${RX(t) - 7} ${RY(v + ci)}h14`}
      style={{ fill: 'none', stroke: ACCENT, strokeWidth: 1.8 }}
    />
    <path
      d={squarePath(RX(t), RY(v), 15)}
      style={{ ...fillAccent, stroke: PAPER, strokeWidth: 1.5 }}
    />
  </g>
);

const RES_X = [0, 3, 6, 9, 12, 15, 18].map(RX);
const RES_Y = [130, 140, 150, 160, 170, 180].map(RY);

const Stat = ({ top, value, children }: { top: number; value: ReactNode; children: ReactNode }) => (
  <div style={abs(1340, top, { width: 460, borderTop: `1px solid ${INK}`, paddingTop: 18 })}>
    <div style={{ ...NUM, fontSize: 50, lineHeight: 1.1, color: ACCENT }}>{value}</div>
    <div style={{ fontSize: 24, lineHeight: 1.45, marginTop: 10, color: MUTED }}>{children}</div>
  </div>
);

const ResultLayer = ({ children }: { children: ReactNode }) => (
  <svg
    width={1160}
    height={600}
    viewBox="0 0 1160 600"
    style={abs(120, 236, { color: INK, overflow: 'visible' })}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const Result: Page = () => (
  <Sheet section="§3 研究結果">
    <SecHead n="3.2">復育後的珊瑚礁，聲景趨近健康珊瑚礁</SecHead>
    <ResultLayer>
      <rect
        x={100}
        y={RY(187)}
        width={1030}
        height={RY(176.4) - RY(187)}
        style={{ fill: INK, fillOpacity: 0.07 }}
      />
      <path
        d={`M100 ${RY(181.7)}H1130`}
        style={{ stroke: INK, strokeWidth: 1.4, strokeDasharray: '9 6' }}
      />
      <rect
        x={100}
        y={RY(135.4)}
        width={1030}
        height={RY(127) - RY(135.4)}
        style={{ fill: INK, fillOpacity: 0.07 }}
      />
      <path
        d={`M100 ${RY(131.2)}H1130`}
        style={{ stroke: INK, strokeWidth: 1.4, strokeDasharray: '2 5' }}
      />
      <text x={118} y={RY(176.4) - 12} fontSize={22} fontStyle="italic" fill="currentColor">
        健康參照礁，平均值與 95 % 信賴區間
      </text>
      <text
        x={1114}
        y={RY(127) + 30}
        fontSize={22}
        fontStyle="italic"
        fill="currentColor"
        textAnchor="end"
      >
        退化礁，平均值與 95 % 信賴區間
      </text>
      <PlotBox
        x0={100}
        y0={20}
        x1={1130}
        y1={520}
        ticks={boxTicks(100, 20, 1130, 520, RES_X, RES_Y)}
      />
      <XL x={RX(0)} y={552}>
        0
      </XL>
      <XL x={RX(3)} y={552}>
        3
      </XL>
      <XL x={RX(6)} y={552}>
        6
      </XL>
      <XL x={RX(9)} y={552}>
        9
      </XL>
      <XL x={RX(12)} y={552}>
        12
      </XL>
      <XL x={RX(15)} y={552}>
        15
      </XL>
      <XL x={RX(18)} y={552}>
        18
      </XL>
      <YL x={88} y={RY(120)}>
        120
      </YL>
      <YL x={88} y={RY(140)}>
        140
      </YL>
      <YL x={88} y={RY(160)}>
        160
      </YL>
      <YL x={88} y={RY(180)}>
        180
      </YL>
      <AxisTitle x={615} y={590}>
        架設礁框後的月數
      </AxisTitle>
      <AxisTitle x={24} y={270} rotate>
        魚類頻帶 ACI
      </AxisTitle>
    </ResultLayer>
    <Steps>
      <Step duration={160}>
        <ResultLayer>
          <ObsPt t={0} v={132.6} ci={4.8} />
          <ObsPt t={2} v={141.2} ci={5.1} />
          <ObsPt t={4} v={152.3} ci={4.6} />
          <ObsPt t={6} v={155.4} ci={5.3} />
          <ObsPt t={8} v={162.4} ci={4.9} />
          <ObsPt t={10} v={163.1} ci={5.6} />
          <ObsPt t={12} v={167.6} ci={5.0} />
          <ObsPt t={14} v={166.9} ci={5.4} />
          <ObsPt t={16} v={170.3} ci={5.9} />
          <ObsPt t={18} v={169.4} ci={6.3} />
        </ResultLayer>
        <Stat
          top={250}
          value={
            <>
              <Var>p</Var> &lt; 0.001
            </>
          }
        >
          自第 4 個月起，復育站位 ≠ 退化站位
          <br />
          （混合模型，Holm 校正）
        </Stat>
      </Step>
      <Step duration={160}>
        <ResultLayer>
          <path
            d={`M100 ${RY(131.2 + FIT_INF)}H1130`}
            style={{ stroke: ACCENT, strokeWidth: 1.2, strokeDasharray: '3 6' }}
          />
          <path d={FIT_PATH} style={{ fill: 'none', stroke: ACCENT, strokeWidth: 2.6 }} />
          <path
            d={`M${RX(FIT_TAU)} 520V${RY(fit(FIT_TAU))}`}
            style={{ stroke: ACCENT, strokeWidth: 1.4, strokeDasharray: '5 5' }}
          />
          <circle
            cx={RX(FIT_TAU)}
            cy={RY(fit(FIT_TAU))}
            r={6}
            style={{ fill: PAPER, stroke: ACCENT, strokeWidth: 2 }}
          />
          <text
            x={RX(FIT_TAU) + 16}
            y={RY(146)}
            fontSize={26}
            fontStyle="italic"
            style={fillAccent}
          >
            τ = 6.2 個月
          </text>
        </ResultLayer>
        <Stat
          top={470}
          value={
            <>
              <Var>τ</Var> = 6.2 個月
            </>
          }
        >
          式 (3) 的時間常數；95 % 信賴區間 [4.9, 7.8]
        </Stat>
      </Step>
      <Step duration={160}>
        <ResultLayer>
          <path
            d={`M1108 ${RY(131.2)}V${RY(169.4)}M1100 ${RY(131.2)}h16M1100 ${RY(169.4)}h16`}
            style={{ fill: 'none', stroke: ACCENT, strokeWidth: 2 }}
          />
          <path
            d={`M1108 ${RY(169.4)}V${RY(181.7)}`}
            style={{ stroke: ACCENT, strokeWidth: 1.4, strokeDasharray: '2 4' }}
          />
          <text
            x={1094}
            y={RY(150) + 8}
            fontSize={26}
            fontStyle="italic"
            textAnchor="end"
            style={fillAccent}
          >
            76 %
          </text>
        </ResultLayer>
        <Stat
          top={662}
          value={
            <>
              <Var>ρ</Var> = 0.76
            </>
          }
        >
          第 18 個月時，健康與退化之間
          <br />
          差距已彌合的比例；漸近值 <Var>ρ</Var>
          <Sub>∞</Sub> = 0.81
        </Stat>
      </Step>
    </Steps>
    <Caption label="圖 6." style={abs(120, 862, { width: 1160 })}>
      復育站位（■，四個站位的平均值 ± 95 % 信賴區間）與參照狀態的比較。曲線：式
      (3)，以非線性最小平方法擬合。
    </Caption>
  </Sheet>
);

const TH: CSSProperties = {
  fontWeight: 400,
  padding: '10px 18px',
  textAlign: 'right',
  verticalAlign: 'bottom',
};
const TD: CSSProperties = { padding: '9px 18px', textAlign: 'right', ...NUM };
const TOP_RULE = `2.5px solid ${INK}`;
const MID_RULE = `1.2px solid ${INK}`;

const ColHead = ({ name, unit }: { name: ReactNode; unit: ReactNode }) => (
  <th style={{ ...TH, borderBottom: MID_RULE }}>
    <div style={{ fontSize: 28, lineHeight: 1.25 }}>{name}</div>
    <div style={{ fontSize: 21, lineHeight: 1.35, color: MUTED, fontStyle: 'italic' }}>{unit}</div>
  </th>
);

const CondCell = ({ kind, children }: { kind: Grp; children: ReactNode }) => (
  <td style={{ ...TD, textAlign: 'left' }}>
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
      <Mark kind={kind} size={22} />
      {children}
    </span>
  </td>
);

const Pm = () => <span style={{ color: MUTED, margin: '0 0.2em' }}>±</span>;

const TableRow = ({
  kind,
  label,
  sites,
  days,
  aci,
  spl,
  snaps,
  rho,
  last,
}: {
  kind: Grp;
  label: string;
  sites: string;
  days: string;
  aci: [string, string];
  spl: [string, string];
  snaps: [string, string];
  rho: string;
  last?: boolean;
}) => (
  <tr style={{ fontSize: 30 }}>
    <CondCell kind={kind}>{label}</CondCell>
    <td style={TD}>{sites}</td>
    <td style={TD}>{days}</td>
    <td style={TD}>
      {aci[0]}
      <Pm />
      {aci[1]}
    </td>
    <td style={TD}>
      {spl[0]}
      <Pm />
      {spl[1]}
    </td>
    <td style={TD}>
      {snaps[0]}
      <Pm />
      {snaps[1]}
    </td>
    <td
      style={{
        ...TD,
        fontWeight: kind === 'r' ? 600 : 400,
        borderBottom: last ? MID_RULE : undefined,
      }}
    >
      {rho}
    </td>
  </tr>
);

const ContrastRow = ({
  label,
  aci,
  spl,
  snaps,
  p,
  last,
}: {
  label: string;
  aci: string;
  spl: string;
  snaps: string;
  p: string;
  last?: boolean;
}) => {
  const rule = last ? TOP_RULE : undefined;
  return (
    <tr style={{ fontSize: 28 }}>
      <td style={{ ...TD, textAlign: 'left', borderBottom: rule }}>{label}</td>
      <td style={{ ...TD, borderBottom: rule }} />
      <td style={{ ...TD, borderBottom: rule }} />
      <td style={{ ...TD, borderBottom: rule }}>{aci}</td>
      <td style={{ ...TD, borderBottom: rule }}>{spl}</td>
      <td style={{ ...TD, borderBottom: rule }}>{snaps}</td>
      <td style={{ ...TD, borderBottom: rule, fontStyle: 'italic' }}>{p}</td>
    </tr>
  );
};

const ResultsTable: Page = () => (
  <Sheet section="§3 研究結果">
    <SecHead n="3.3">各狀態摘要</SecHead>
    <Caption label="表 2." style={abs(120, 240, { width: 1680 })}>
      第 13–18 個月各狀態的聲學指數，以及混合模型的對比。
    </Caption>
    <table
      style={abs(120, 298, {
        width: 1680,
        borderCollapse: 'collapse',
        fontFamily: 'var(--osd-font-body)',
        color: INK,
      })}
    >
      <thead>
        <tr>
          <th style={{ ...TH, borderTop: TOP_RULE, padding: '8px 18px 0' }} />
          <th style={{ ...TH, borderTop: TOP_RULE, padding: '8px 18px 0' }} />
          <th style={{ ...TH, borderTop: TOP_RULE, padding: '8px 18px 0' }} />
          <th
            colSpan={3}
            style={{ ...TH, borderTop: TOP_RULE, padding: '14px 18px 0', textAlign: 'center' }}
          >
            <div
              style={{ ...SC, fontSize: 24, paddingBottom: 8, borderBottom: `1px solid ${INK}` }}
            >
              聲學指數，平均值 ± 標準誤
              <Fn n="a" />
            </div>
          </th>
          <th style={{ ...TH, borderTop: TOP_RULE, padding: '8px 18px 0' }} />
        </tr>
        <tr>
          <th style={{ ...TH, textAlign: 'left', borderBottom: MID_RULE }}>
            <div style={{ fontSize: 28 }}>狀態</div>
          </th>
          <ColHead name="站位數" unit="" />
          <ColHead name="錄音機日數" unit="" />
          <ColHead name="ACI，魚類頻帶" unit="無因次" />
          <ColHead name="SPL, 0.05–1 kHz" unit="dB re 1 µPa" />
          <ColHead name="爆音率" unit="次／秒" />
          <ColHead
            name={
              <span>
                <Var>ρ</Var>
                <Fn n="b" />
              </span>
            }
            unit="式 (2)"
          />
        </tr>
      </thead>
      <tbody>
        <TableRow
          kind="h"
          label="健康"
          sites="4"
          days="1,986"
          aci={['181.7', '2.1']}
          spl={['118.4', '0.9']}
          snaps={['41.2', '3.0']}
          rho="1.00"
        />
        <TableRow
          kind="r"
          label="已復育"
          sites="4"
          days="1,958"
          aci={['169.8', '2.6']}
          spl={['114.9', '1.1']}
          snaps={['33.7', '2.8']}
          rho="0.76"
        />
        <TableRow
          kind="d"
          label="退化"
          sites="4"
          days="1,968"
          aci={['131.2', '2.4']}
          spl={['108.6', '1.0']}
          snaps={['18.9', '2.2']}
          rho="0.00"
        />
        <tr>
          <td
            colSpan={7}
            style={{
              ...TD,
              textAlign: 'left',
              borderTop: MID_RULE,
              paddingTop: 14,
              fontSize: 24,
              fontStyle: 'italic',
              color: MUTED,
            }}
          >
            對比，估計值 [95 % 信賴區間]
            <Fn n="c" />
          </td>
        </tr>
        <ContrastRow
          label="已復育 − 退化"
          aci="+38.6 [31.9, 45.3]"
          spl="+6.3 [4.1, 8.5]"
          snaps="+14.8 [9.6, 20.0]"
          p="p < 0.001"
        />
        <ContrastRow
          label="健康 − 已復育"
          aci="+11.9 [5.0, 18.8]"
          spl="+3.5 [1.3, 5.7]"
          snaps="+7.5 [2.3, 12.7]"
          p="p = 0.002"
          last
        />
      </tbody>
    </table>
    <div style={abs(120, 842, { width: 1680, fontSize: 21, lineHeight: 1.55, color: MUTED })}>
      <div>
        <sup style={{ color: ACCENT, marginRight: 6 }}>a</sup>跨站位日統計，架設後第 13–18
        個月；僅含已篩除船舶噪音的音檔。
        <sup style={{ color: ACCENT, margin: '0 6px 0 28px' }}>b</sup>由 ACI 計算的復育比例。
      </div>
      <div>
        <sup style={{ color: ACCENT, marginRight: 6 }}>c</sup>以站位為隨機截距的線性混合模型{' '}
        <Cite n="9" />；<Var>p</Var> 值已就三項指數進行 Holm 校正。
      </div>
    </div>
  </Sheet>
);

type Obs = { g: Grp; x: number; y: number };

const VISITS = (() => {
  const rand = mulberry32(84);
  const a: Obs[] = [];
  const b: Obs[] = [];
  const groups: Grp[] = ['h', 'r', 'd'];
  for (const g of groups) {
    for (let s = 0; s < 4; s++) {
      const offA = normal(rand);
      const offB = normal(rand);
      for (let v = 0; v < 7; v++) {
        const prog = v / 6;
        const fish =
          g === 'h'
            ? 86 + offA * 9 + normal(rand) * 8
            : g === 'r'
              ? 26 + prog * 42 + offA * 5 + normal(rand) * 7
              : 22 + offA * 5 + normal(rand) * 6;
        const cover =
          g === 'h'
            ? 41 + offB * 6 + normal(rand) * 3
            : g === 'r'
              ? 6 + prog * 16 + offB * 2 + normal(rand) * 2.5
              : 5 + offB * 2 + normal(rand) * 1.8;
        const fx = clamp(fish, 3, 116);
        const cx = clamp(cover, 0.6, 57);
        a.push({ g, x: fx, y: clamp(118 + 0.72 * fx + normal(rand) * 15, 112, 208) });
        b.push({ g, x: cx, y: clamp(14 + 0.62 * cx + normal(rand) * 11, 1, 68) });
      }
    }
  }
  return { a, b };
})();

const regress = (pts: Obs[]) => {
  const n = pts.length;
  const mx = pts.reduce((s, p) => s + p.x, 0) / n;
  const my = pts.reduce((s, p) => s + p.y, 0) / n;
  let sxx = 0;
  let syy = 0;
  let sxy = 0;
  for (const p of pts) {
    sxx += (p.x - mx) ** 2;
    syy += (p.y - my) ** 2;
    sxy += (p.x - mx) * (p.y - my);
  }
  const slope = sxy / sxx;
  const icpt = my - slope * mx;
  const r = sxy / Math.sqrt(sxx * syy);
  let sse = 0;
  for (const p of pts) sse += (p.y - icpt - slope * p.x) ** 2;
  const s = Math.sqrt(sse / (n - 2));
  const z = Math.atanh(r);
  const se = 1 / Math.sqrt(n - 3);
  return {
    n,
    slope,
    icpt,
    r,
    lo: Math.tanh(z - 1.96 * se),
    hi: Math.tanh(z + 1.96 * se),
    band: (x: number) => 1.99 * s * Math.sqrt(1 / n + (x - mx) ** 2 / sxx),
  };
};

const FIT_A = regress(VISITS.a);
const FIT_B = regress(VISITS.b);

type Frame = {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
};
const PANEL_A: Frame = {
  x0: 96,
  x1: 770,
  y0: 16,
  y1: 420,
  xmin: 0,
  xmax: 120,
  ymin: 100,
  ymax: 220,
};
const PANEL_B: Frame = { x0: 96, x1: 770, y0: 16, y1: 420, xmin: 0, xmax: 60, ymin: 0, ymax: 70 };
const px = (f: Frame, x: number) => r1(f.x0 + ((x - f.xmin) / (f.xmax - f.xmin)) * (f.x1 - f.x0));
const py = (f: Frame, y: number) => r1(f.y1 - ((y - f.ymin) / (f.ymax - f.ymin)) * (f.y1 - f.y0));

const scatterLayers = (f: Frame, pts: Obs[], fitR: ReturnType<typeof regress>) => {
  let h = '';
  let r = '';
  let d = '';
  for (const p of pts) {
    const x = px(f, p.x);
    const y = py(f, p.y);
    if (p.g === 'h') h += circlePath(x, y, 6.5);
    else if (p.g === 'r') r += squarePath(x, y, 12);
    else d += triPath(x, y, 15);
  }
  const xs: number[] = [];
  for (let i = 0; i <= 40; i++) xs.push(f.xmin + ((f.xmax - f.xmin) * i) / 40);
  const yAt = (x: number) => fitR.icpt + fitR.slope * x;
  const upper = xs.map((x) => `${px(f, x)} ${py(f, clamp(yAt(x) + fitR.band(x), f.ymin, f.ymax))}`);
  const lower = xs
    .map((x) => `${px(f, x)} ${py(f, clamp(yAt(x) - fitR.band(x), f.ymin, f.ymax))}`)
    .reverse();
  const band = `M${upper.join('L')}L${lower.join('L')}z`;
  const line = `M${px(f, f.xmin)} ${py(f, clamp(yAt(f.xmin), f.ymin, f.ymax))}L${px(f, f.xmax)} ${py(f, clamp(yAt(f.xmax), f.ymin, f.ymax))}`;
  return { h, r, d, band, line };
};

const SCAT_A = scatterLayers(PANEL_A, VISITS.a, FIT_A);
const SCAT_B = scatterLayers(PANEL_B, VISITS.b, FIT_B);
const fmtR = (v: number) => v.toFixed(2);

const ScatterMarks = ({ s }: { s: typeof SCAT_A }) => (
  <>
    <path d={s.band} style={{ fill: INK, fillOpacity: 0.08 }} />
    <path d={s.line} style={{ stroke: INK, strokeWidth: 1.8 }} />
    <path d={s.d} style={{ fill: PAPER, stroke: INK, strokeWidth: 1.5 }} />
    <path d={s.h} style={{ ...fillInk, stroke: PAPER, strokeWidth: 1.2 }} />
    <path d={s.r} style={{ ...fillAccent, stroke: PAPER, strokeWidth: 1.2 }} />
  </>
);

const PanelTag = ({ tag, r, lo, hi }: { tag: string; r: number; lo: number; hi: number }) => (
  <>
    <text x={116} y={50} fontSize={26} fill="currentColor" fontWeight={600}>
      {tag}
    </text>
    <text x={156} y={50} fontSize={24} fill="currentColor" fontStyle="italic" style={NUM}>
      r = {fmtR(r)} [{fmtR(lo)}, {fmtR(hi)}]
    </text>
  </>
);

const EffortBar = ({
  label,
  hours,
  w,
  accent,
}: {
  label: string;
  hours: string;
  w: number;
  accent?: boolean;
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 24, lineHeight: 1 }}>
    <span style={{ width: 210, color: MUTED, fontStyle: 'italic' }}>{label}</span>
    <span style={{ width: w, height: 18, background: accent ? ACCENT : INK }} />
    <span style={NUM}>{hours}</span>
  </div>
);

const Surveys: Page = () => (
  <Sheet section="§3 研究結果">
    <SecHead n="3.4">聆聽與目視調查的結果一致</SecHead>
    <svg
      width={790}
      height={480}
      viewBox="0 0 790 480"
      style={abs(120, 236, { color: INK, overflow: 'visible' })}
      aria-label="魚類頻帶 ACI 與潛水員計數魚類密度的散布圖"
    >
      <ScatterMarks s={SCAT_A} />
      <PlotBox
        x0={PANEL_A.x0}
        y0={PANEL_A.y0}
        x1={PANEL_A.x1}
        y1={PANEL_A.y1}
        ticks={boxTicks(
          PANEL_A.x0,
          PANEL_A.y0,
          PANEL_A.x1,
          PANEL_A.y1,
          [px(PANEL_A, 30), px(PANEL_A, 60), px(PANEL_A, 90)],
          [py(PANEL_A, 130), py(PANEL_A, 160), py(PANEL_A, 190)],
        )}
      />
      <PanelTag tag="(a)" r={FIT_A.r} lo={FIT_A.lo} hi={FIT_A.hi} />
      <XL x={px(PANEL_A, 0)} y={450}>
        0
      </XL>
      <XL x={px(PANEL_A, 30)} y={450}>
        30
      </XL>
      <XL x={px(PANEL_A, 60)} y={450}>
        60
      </XL>
      <XL x={px(PANEL_A, 90)} y={450}>
        90
      </XL>
      <XL x={px(PANEL_A, 120)} y={450}>
        120
      </XL>
      <YL x={84} y={py(PANEL_A, 100)}>
        100
      </YL>
      <YL x={84} y={py(PANEL_A, 130)}>
        130
      </YL>
      <YL x={84} y={py(PANEL_A, 160)}>
        160
      </YL>
      <YL x={84} y={py(PANEL_A, 190)}>
        190
      </YL>
      <YL x={84} y={py(PANEL_A, 220)}>
        220
      </YL>
      <AxisTitle x={433} y={482}>
        魚類密度，每 100 m² 個體數（潛水目視調查 UVC）
      </AxisTitle>
      <AxisTitle x={22} y={218} rotate>
        魚類頻帶 ACI
      </AxisTitle>
    </svg>
    <svg
      width={790}
      height={480}
      viewBox="0 0 790 480"
      style={abs(1010, 236, { color: INK, overflow: 'visible' })}
      aria-label="爆音率與活珊瑚覆蓋率的散布圖"
    >
      <ScatterMarks s={SCAT_B} />
      <PlotBox
        x0={PANEL_B.x0}
        y0={PANEL_B.y0}
        x1={PANEL_B.x1}
        y1={PANEL_B.y1}
        ticks={boxTicks(
          PANEL_B.x0,
          PANEL_B.y0,
          PANEL_B.x1,
          PANEL_B.y1,
          [px(PANEL_B, 15), px(PANEL_B, 30), px(PANEL_B, 45)],
          [py(PANEL_B, 20), py(PANEL_B, 40), py(PANEL_B, 60)],
        )}
      />
      <PanelTag tag="(b)" r={FIT_B.r} lo={FIT_B.lo} hi={FIT_B.hi} />
      <XL x={px(PANEL_B, 0)} y={450}>
        0
      </XL>
      <XL x={px(PANEL_B, 15)} y={450}>
        15
      </XL>
      <XL x={px(PANEL_B, 30)} y={450}>
        30
      </XL>
      <XL x={px(PANEL_B, 45)} y={450}>
        45
      </XL>
      <XL x={px(PANEL_B, 60)} y={450}>
        60
      </XL>
      <YL x={84} y={py(PANEL_B, 0)}>
        0
      </YL>
      <YL x={84} y={py(PANEL_B, 20)}>
        20
      </YL>
      <YL x={84} y={py(PANEL_B, 40)}>
        40
      </YL>
      <YL x={84} y={py(PANEL_B, 60)}>
        60
      </YL>
      <AxisTitle x={433} y={482}>
        活珊瑚覆蓋率，%（照片樣方）
      </AxisTitle>
      <AxisTitle x={22} y={218} rotate>
        每秒爆音次數
      </AxisTitle>
    </svg>
    <Caption label="圖 7." style={abs(120, 752, { width: 1680 })}>
      聲學指數與潛水調查在 84 次站位造訪中的比較：
      <Mark kind="h" size={18} /> 健康、
      <Mark kind="r" size={18} /> 已復育、
      <Mark kind="d" size={18} /> 退化。直線：OLS 擬合與 95 % 區間帶；
      <Var>r</Var> 附 Fisher-<Var>z</Var> 區間。
    </Caption>
    <div style={abs(120, 846, { display: 'flex', flexDirection: 'column', gap: 18 })}>
      <EffortBar label="潛水調查" hours="每站每月 11.5 人時" w={920} />
      <EffortBar label="聲學監測" hours="每站每月 0.4 人時" w={32} accent />
    </div>
  </Sheet>
);

const Limit = ({ n, title, children }: { n: string; title: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 28 }}>
    <span
      style={{
        width: 64,
        fontSize: 34,
        fontStyle: 'italic',
        color: ACCENT,
        flex: 'none',
        lineHeight: 1.3,
      }}
    >
      ({n})
    </span>
    <div>
      <div style={{ fontSize: 36, fontWeight: 600, lineHeight: 1.3 }}>{title}</div>
      <div style={{ fontSize: 30, lineHeight: 1.45, color: MUTED, marginTop: 4 }}>{children}</div>
    </div>
  </div>
);

const Limitations: Page = () => (
  <Sheet section="§4 討論">
    <SecHead n="4.1">研究限制</SecHead>
    <div style={abs(120, 262, { width: 1060, display: 'flex', flexDirection: 'column', gap: 40 })}>
      <Limit n="i" title="站位並非隨機分派。">
        復育地點是由實務工作者決定的；我們以水深與暴露程度進行配對。
      </Limit>
      <Limit n="ii" title="指數是彙總值。">
        ACI 與 SPL 無法辨識物種 — 越吵不一定越豐富。
      </Limit>
      <Limit n="iii" title="船舶噪音分布不均。">
        8.8 % 的音檔被排除，多數來自靠近渡輪航道的 R1 與 R3。
        <Fn n="4" />
      </Limit>
      <Limit n="iv" title="一個區域、一種方法、18 個月。">
        在受遮蔽群島架設的鋼製礁框；長期走向仍未知。
      </Limit>
    </div>
    <div
      style={abs(1280, 268, {
        width: 520,
        borderTop: `2px solid ${INK}`,
        borderBottom: `2px solid ${INK}`,
        padding: '28px 0 30px',
      })}
    >
      <div style={{ fontSize: 30, lineHeight: 1.5 }}>
        <span style={{ ...SC, fontWeight: 600 }}>備註。</span>{' '}
        <span style={{ fontStyle: 'italic' }}>什麼結果會推翻 H1？</span>
      </div>
      <div style={{ fontSize: 30, lineHeight: 1.5, marginTop: 14 }}>
        一個<i>聽起來</i>健康、但<i>調查結果</i>卻顯示退化的復育站位。在 28
        次復育站位的造訪中一個也沒發現；最大的標準化殘差為 1.4。
      </div>
    </div>
    <Footnote n="4">
      Kalea–Bira 渡輪，每天約六個航次；偵測器與閾值同 Lindqvist 與 Okonkwo <Cite n="10" />。
    </Footnote>
  </Sheet>
);

const Claim = ({ n, title, children }: { n: string; title: ReactNode; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 36, alignItems: 'baseline' }}>
    <span style={{ ...NUM, fontSize: 64, lineHeight: 1, color: ACCENT, width: 54, flex: 'none' }}>
      {n}
    </span>
    <div>
      <div style={{ fontSize: 44, lineHeight: 1.25, fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 31, lineHeight: 1.45, color: MUTED, marginTop: 10 }}>{children}</div>
    </div>
  </div>
);

const Conclusions: Page = () => (
  <Sheet section="§5 結論">
    <SecHead n="5">結論</SecHead>
    <div style={abs(120, 272, { width: 1500, display: 'flex', flexDirection: 'column', gap: 54 })}>
      <Claim n="1" title="復育後的珊瑚礁很快就找回了聲音。">
        <Var>τ</Var> = 6.2 個月；18 個月內已彌合與健康珊瑚礁之間 76 % 的差距（H1 獲得支持）。
      </Claim>
      <Claim n="2" title="聆聽與目視相符。">
        與潛水員計數的魚類密度相比，<Var>r</Var> = {fmtR(FIT_A.r)}，而野外投入僅約三十分之一（H2
        獲得支持）。
      </Claim>
      <Claim n="3" title="聲音應成為標準的移交指標。">
        成本低、可連續監測、可供查核：每個站位一台錄音機，從礁框架設當天就開始。
      </Claim>
    </div>
    <div
      style={abs(120, 828, {
        width: 1680,
        borderTop: `1px solid ${FAINT}`,
        paddingTop: 22,
        fontSize: 30,
        lineHeight: 1.45,
      })}
    >
      <span style={{ ...SC, fontWeight: 600 }}>下一步。</span>{' '}
      <span style={{ fontStyle: 'italic' }}>
        物種層級的叫聲偵測，以及自 2027 年起建置的 40 站位區域監測陣列。
      </span>
    </div>
  </Sheet>
);

const Ref = ({ n, children }: { n: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 20, fontSize: 28, lineHeight: 1.38 }}>
    <span style={{ ...NUM, width: 56, flex: 'none', color: ACCENT }}>[{n}]</span>
    <span>{children}</span>
  </div>
);

const J = ({ children }: { children: ReactNode }) => <i>{children}</i>;

const References: Page = () => (
  <Sheet section="參考文獻">
    <h2
      style={abs(120, 136, {
        margin: 0,
        fontFamily: 'var(--osd-font-display)',
        fontSize: 58,
        fontWeight: 600,
        lineHeight: 1.2,
      })}
    >
      參考文獻
    </h2>
    <div style={abs(120, 252, { width: 800, display: 'flex', flexDirection: 'column', gap: 22 })}>
      <Ref n="1">
        T. P. Hughes et al. Global warming transforms coral reef assemblages. <J>Nature</J>,
        556:492–496, 2018.
      </Ref>
      <Ref n="2">
        L. Boström-Einarsson et al. Coral restoration — a systematic review of current methods,
        successes, failures and future directions. <J>PLoS ONE</J>, 15(1):e0226631, 2020.
      </Ref>
      <Ref n="3">
        N. Pieretti, A. Farina, D. Morri. A new methodology to infer the singing activity of an
        avian community: the Acoustic Complexity Index. <J>Ecol. Indic.</J>, 11(3):868–873, 2011.
      </Ref>
      <Ref n="4">
        J. Sueur, A. Farina, A. Gasc, N. Pieretti, S. Pavoine. Acoustic indices for biodiversity
        assessment and landscape investigation. <J>Acta Acust. united Ac.</J>, 100(4):772–781, 2014.
      </Ref>
      <Ref n="5">
        M. B. Kaplan, T. A. Mooney, J. Partan, A. R. Solow. Coral reef species assemblages are
        associated with ambient soundscapes. <J>Mar. Ecol. Prog. Ser.</J>, 533:93–107, 2015.
      </Ref>
    </div>
    <div style={abs(1000, 252, { width: 800, display: 'flex', flexDirection: 'column', gap: 22 })}>
      <Ref n="6">
        T. A. C. Gordon et al. Acoustic enrichment can enhance fish community development on
        degraded coral reef habitat. <J>Nat. Commun.</J>, 10:5414, 2019.
      </Ref>
      <Ref n="7">
        T. A. C. Lamont et al. The sound of recovery: coral reef restoration success is detectable
        in the soundscape. <J>J. Appl. Ecol.</J>, 59(3):742–756, 2022.
      </Ref>
      <Ref n="8">
        M. R. Okonkwo, P. Raman. Duty-cycled hydrophone arrays for long-term reef soundscape
        monitoring. <J>Methods Ecol. Evol.</J>, in press.
      </Ref>
      <Ref n="9">
        D. Bates, M. Mächler, B. Bolker, S. Walker. Fitting linear mixed-effects models using lme4.{' '}
        <J>J. Stat. Softw.</J>, 67(1):1–48, 2015.
      </Ref>
      <Ref n="10">
        T. H. Lindqvist, M. R. Okonkwo. A tonal-line detector for vessel noise in long-term reef
        recordings. <J>JASA Express Lett.</J>, 4(7):071201, 2024.
      </Ref>
    </div>
  </Sheet>
);

const Colophon = ({ head, children }: { head: string; children: ReactNode }) => (
  <div style={{ width: 500 }}>
    <div style={{ ...SC, fontWeight: 600, fontSize: 26, marginBottom: 12 }}>{head}</div>
    <div style={{ fontSize: 28, lineHeight: 1.5, color: MUTED }}>{children}</div>
  </div>
);

const Thanks: Page = () => (
  <Sheet section="提問">
    <div
      style={abs(0, 214, {
        width: 1920,
        textAlign: 'center',
        fontFamily: 'var(--osd-font-display)',
        fontSize: 'var(--osd-size-hero)',
        fontWeight: 600,
        lineHeight: 1.1,
        letterSpacing: '-0.015em',
      })}
    >
      謝謝聆聽
    </div>
    <div
      style={abs(0, 368, { width: 1920, textAlign: 'center', fontSize: 44, fontStyle: 'italic' })}
    >
      歡迎提問、提供意見與指正。
    </div>
    <div style={abs(0, 476, { width: 1920, display: 'flex', justifyContent: 'center' })}>
      <div style={{ width: 120, height: 1, background: INK }} />
    </div>
    <div style={abs(120, 548, { width: 1680, display: 'flex', justifyContent: 'space-between' })}>
      <Colophon head="致謝">
        感謝 Kalea 潛水合作社完成 214 次調查潛水；感謝 Blue Horizon Ocean Fund（計畫編號
        BH-2023-117）。
      </Colophon>
      <Colophon head="資料與程式碼">
        每日指數表、模型程式碼與 40 小時的範例音檔，將隨論文一併釋出。
      </Colophon>
      <Colophon head="聯絡方式">
        Maya R. Okonkwo
        <br />
        Halloway University
        <br />
        海洋與地球科學學院
      </Colophon>
    </div>
    <svg
      width={760}
      height={80}
      viewBox="0 0 760 80"
      style={abs(580, 820, { overflow: 'visible' })}
      aria-hidden="true"
    >
      <path d={TITLE_WAVE} style={{ fill: 'none', stroke: ACCENT, strokeWidth: 1.4 }} />
    </svg>
  </Sheet>
);

export const meta: SlideMeta = {
  title: '聆聽復育',
  createdAt: '2026-10-12T12:15:24.833Z',
};

export default [
  TitlePage,
  Motivation,
  Question,
  Sites,
  Deployment,
  Pipeline,
  Equation,
  Spectrogram,
  Result,
  ResultsTable,
  Surveys,
  Limitations,
  Conclusions,
  References,
  Thanks,
] satisfies Page[];

export const notes: (string | undefined)[] = [
  `先感謝主持人。自我介紹，並說明你來自哪個研究團隊。
用一句話講前提：我們想知道復育後的珊瑚礁是否真的有效，而我們認為這件事用「聽」的就能知道。
十五分鐘，分成四個部分：為什麼做、怎麼做、發現了什麼，以及哪些是這份研究沒辦法證明的。`,
  `先從規模講起：2010 年以來，本區域已啟動 332 個計畫，而且曲線還在往上爬。
接著講問題：其中只有 70 個，大約五分之一，在第一年之後還有回報任何資料。
多數評估只停在「珊瑚碎枝移交後有沒有活下來？」這不等於「這裡又變回一座珊瑚礁了嗎？」
潛水調查可以回答比較好的問題，但成本高，又受天氣限制。
最後一句要講得慢：健康的珊瑚礁很吵。那我們能不能改用聽的？`,
  `把研究問題大聲念一遍，然後讓它停一下，讓聽眾消化。
兩個假說。H1 講的是時間：六個月內就會與碎石礁明顯不同，接著逐漸趨近健康礁。
H2 講的是效度：如果聲音追蹤不到潛水員看到的現象，就沒有人該相信它。我們事先就把 r 的門檻訂在 0.5 以上。
設計：三種狀態各四個站位，錄音 18 個月。`,
  `先讓全場掌握方位：上方是北，Kalea 村位於主島的南岸。
黑色圓點是健康參照礁，多半在外圍淺灘。藍色方塊是復育站位。空心三角形是退化的碎石區，離村子比較近，那是炸魚留下的後果。
要點出各種狀態在島的周圍是交錯分布的，所以結果不是由某一段海岸線造成的。`,
  `由左到右帶著看這張圖。錄音機固定在鋼樁上，離海底半公尺，就在 Reef Star 礁框旁邊。
提到工作週期：每十分鐘錄兩分鐘，這樣電池才撐得了三個月。
弧線是魚類叫聲的標稱收音範圍，約一百公尺，是用回放試驗得出的。
未經任何篩選前，錄音機日數合計 6,480。`,
  `這是整個處理流程，所以一個階段一個階段講，但步調要保持。
值得停一下的是階段 2：船舶噪音。一艘經過的船會讓任何珊瑚礁看起來都很「複雜」，所以我們把這些音檔剔除，比例是 8.8%。
接著是 STFT，分成魚類頻帶與槍蝦頻帶，每段音檔算出三項指數，最後用混合模型處理各站位的每日平均值。`,
  `不要一個符號一個符號地念這條公式。直接說它在量什麼：每個頻格的強度從一個時刻到下一個時刻變化多少，再除以該頻格本身有多大聲來標準化。
引擎那種穩定的噪音分數低；很多短促的叫聲則分數高。
然後是我們報告的兩個量：rho，也就是復育站位已經彌合了「健康減退化」差距的比例；還有一個帶時間常數 tau 的飽和模型。`,
  `開口之前，先讓大家用眼睛「聽」一下。
指出 (a) 咕嚕聲序列；(b) 槍蝦的爆音，讓上半部看起來像雜訊；(c) 一艘船，注意那些諧波，這段音檔會被排除；還有 (d) 右緣逐漸增強的黃昏合唱。
這是礁框架設後的第十四個月。再往前十八個月，這個站位聽起來和退化站位沒有兩樣。`,
  `分三次點擊來呈現。
第一次：復育站位隨時間的變化。到第 4 個月就與退化站位分開了。
第二次：擬合曲線。時間常數大約六個月。
第三次：到第 18 個月，它們已經彌合約四分之三的差距，但還沒有全部補上。這點要講清楚，我們並不是宣稱已完全復育。`,
  `這張表是給想看數字的人看的。不要照著念。
強調兩件事：三項指數的方向一致；還有「健康減復育」的對比仍然顯著。復育後的珊瑚礁已經接近許多，但還沒到位。`,
  `這是 H2。圖 (a)：魚類頻帶 ACI 對照潛水員計數的魚類密度。圖 (b)：爆音率對照珊瑚覆蓋率，相關較弱，符合預期。
接著看下方的投入比較：每站每月潛水要 11.5 人時，而換電池和記憶卡只要 0.4 人時。這就是實務上的論點。`,
  `要誠實、節奏明快。最大的一項是 (i)：復育地點不是我們選的。
指數不等於物種名錄。船舶噪音在各站位之間分布不均。而且這只涵蓋一個區域、一種方法、十八個月。
然後是備註：最可能讓我們難堪的結果，也就是聽起來健康、看起來卻退化的站位，從來沒有出現過。`,
  `三句話，一點一句。放慢速度。
復育後的珊瑚礁在幾個月內就找回了聲音。聆聽與目視的結果相符。所以每個復育站位從第一天起，就該放一台錄音機。
簡短帶過下一步，然後進入提問。`,
  `除非有人要引用資料，否則這頁不用一直開著。方法部分最關鍵的參考文獻是 ACI 的 Pieretti，以及最接近的前人研究 Lamont 等人。`,
  `指名感謝潛水合作社。
開放提問。可能的問題有：站位選擇偏誤（回頭指向限制 i）、物種辨識，還有每台錄音機的成本，含外殼約 2,400 美元。`,
];
