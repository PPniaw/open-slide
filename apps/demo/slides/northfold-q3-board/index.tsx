import {
  type DesignSystem,
  type Page,
  type SlideMeta,
  Step,
  Steps,
  useSlidePageNumber,
} from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';

export const design: DesignSystem = {
  palette: { bg: '#F3F1EC', text: '#141414', accent: '#E8471C' },
  fonts: {
    display:
      '"Geist", "Helvetica Neue", Arial, sans-serif, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif',
    body: '"Geist", "Helvetica Neue", Arial, sans-serif, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif',
  },
  typeScale: { hero: 520, body: 28 },
  radius: 0,
};

const muted = '#85817A';
const rule = '#D8D3C8';
const panel = '#E9E6DF';
const ink2 = '#3B3B3B';
const INK = 'var(--osd-text)';
const ACCENT = 'var(--osd-accent)';
const PAPER = 'var(--osd-bg)';
const DISPLAY = 'var(--osd-font-display)';
const MONO =
  '"Geist Mono", ui-monospace, "SF Mono", Menlo, monospace, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif';

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap';
const FONT_LINK_ID = 'osd-webfont-northfold-q3-board';
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

const colX = (col: number) => 120 + (col - 1) * 142;
const span = (cols: number) => cols * 142 - 24;
const pad2 = (n: number) => String(n).padStart(2, '0');

const abs = (left: number, top: number, width?: number): CSSProperties => ({
  position: 'absolute',
  left,
  top,
  width,
});

const root: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  background: PAPER,
  color: INK,
  fontFamily: 'var(--osd-font-body)',
  fontVariantNumeric: 'tabular-nums',
};

const chrome: CSSProperties = {
  fontFamily: MONO,
  fontSize: 20,
  lineHeight: '20px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: muted,
};

const label: CSSProperties = {
  fontFamily: MONO,
  fontSize: 20,
  lineHeight: '24px',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: muted,
};

const Glyph = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: 'block' }}>
    <polygon points="0,0 40,0 0,40" fill={INK} />
    <polygon points="40,3.5 40,40 3.5,40" fill={ACCENT} />
  </svg>
);

const Wordmark = ({ size = 40 }: { size?: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.34 }}>
    <Glyph size={size} />
    <span
      style={{
        fontFamily: DISPLAY,
        fontWeight: 600,
        fontSize: size * 0.98,
        lineHeight: 1,
        letterSpacing: '-0.04em',
        paddingBottom: size * 0.08,
      }}
    >
      northfold
    </span>
  </div>
);

const Frame = ({ section, children }: { section: string; children: ReactNode }) => {
  const { current, total } = useSlidePageNumber();
  return (
    <div style={root}>
      <div
        style={{
          ...chrome,
          position: 'absolute',
          left: 120,
          right: 120,
          top: 50,
          height: 38,
          borderBottom: `1px solid ${rule}`,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Northfold · 董事會報告 Q3 FY26</span>
        <span>機密</span>
      </div>
      {children}
      <div
        style={{
          ...chrome,
          position: 'absolute',
          left: 120,
          right: 120,
          top: 1000,
          paddingTop: 22,
          borderTop: `1px solid ${rule}`,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>{section}</span>
        <span>
          <span style={{ color: INK }}>{pad2(current)}</span> / {pad2(total)}
        </span>
      </div>
    </div>
  );
};

const Headline = ({
  num,
  topic,
  children,
  width = span(11),
}: {
  num: string;
  topic: string;
  children: ReactNode;
  width?: number;
}) => (
  <div style={abs(120, 128, width)}>
    <div style={{ ...chrome, color: INK }}>
      <span style={{ color: ACCENT }}>{num}</span>
      <span style={{ marginLeft: 18 }}>{topic}</span>
    </div>
    <h1
      style={{
        margin: '24px 0 0',
        fontFamily: DISPLAY,
        fontSize: 72,
        fontWeight: 500,
        lineHeight: 1.04,
        letterSpacing: '-0.04em',
      }}
    >
      {children}
    </h1>
  </div>
);

const Source = ({
  children,
  left = 120,
  width = 1680,
}: {
  children: ReactNode;
  left?: number;
  width?: number;
}) => (
  <div
    style={{
      ...abs(left, 948, width),
      fontFamily: MONO,
      fontSize: 20,
      lineHeight: '26px',
      color: muted,
    }}
  >
    {children}
  </div>
);

const ARR = [13.0, 15.4, 18.9, 22.6, 26.1, 29.8, 34.1, 38.6, 43.2, 48.2];
const ARR_Q = ['Q2', 'Q3', 'Q4', 'Q1', 'Q2', 'Q3', 'Q4', 'Q1', 'Q2', 'Q3'];

const ArrStrip = () => {
  const bw = 26;
  const gap = 14;
  const h = 112;
  const w = ARR.length * bw + (ARR.length - 1) * gap;
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      {ARR.map((v, i) => {
        const bh = (v / 48.2) * h;
        return (
          <rect
            key={`strip-${i}`}
            x={i * (bw + gap)}
            y={h - bh}
            width={bw}
            height={bh}
            fill={i === ARR.length - 1 ? ACCENT : INK}
          />
        );
      })}
    </svg>
  );
};

const Cover: Page = () => (
  <div style={root}>
    <div style={abs(120, 78)}>
      <Wordmark size={44} />
    </div>
    <div style={{ ...chrome, position: 'absolute', right: 120, top: 92 }}>
      季度結束日 2026 年 9 月 30 日
    </div>
    <div
      style={{ position: 'absolute', left: 120, right: 120, top: 160, height: 1, background: rule }}
    />
    <div style={abs(120, 244, span(9))}>
      <div style={chrome}>董事會 · 季度檢討</div>
      <h1
        style={{
          margin: '40px 0 0',
          fontFamily: DISPLAY,
          fontSize: 168,
          fontWeight: 500,
          lineHeight: 0.92,
          letterSpacing: '-0.05em',
        }}
      >
        董事會報告
      </h1>
      <div
        style={{
          marginTop: 30,
          fontSize: 60,
          lineHeight: 1.1,
          letterSpacing: '-0.035em',
          color: ink2,
        }}
      >
        2026 會計年度第三季
      </div>
      <div
        style={{ marginTop: 48, fontFamily: MONO, fontSize: 22, lineHeight: '30px', color: ink2 }}
      >
        2026 年 10 月 14 日 · 為董事會編製 · 機密
      </div>
    </div>
    <div
      style={{
        position: 'absolute',
        right: 168,
        top: 556,
        fontFamily: DISPLAY,
        fontSize: 'var(--osd-size-hero)',
        fontWeight: 500,
        lineHeight: 1,
        letterSpacing: '-0.07em',
      }}
    >
      Q3
    </div>
    <div style={{ ...abs(1760, 966), width: 40, height: 40, background: ACCENT }} />
    <div style={abs(120, 776)}>
      <div style={label}>ARR（百萬美元）· Q2 FY24 – Q3 FY26</div>
      <div style={{ marginTop: 20 }}>
        <ArrStrip />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: 386,
          marginTop: 12,
          fontFamily: MONO,
          fontSize: 20,
          lineHeight: '24px',
          color: muted,
        }}
      >
        <span>13.0</span>
        <span style={{ color: INK }}>48.2</span>
      </div>
    </div>
  </div>
);

const Spark = ({ data, w = 354, h = 72 }: { data: number[]; w?: number; h?: number }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const x = (i: number) => 8 + (i * (w - 16)) / (data.length - 1);
  const y = (v: number) => 8 + (1 - (v - min) / (max - min)) * (h - 16);
  const last = data.length - 1;
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polyline
        points={data.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
        fill="none"
        stroke={INK}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={x(last)} cy={y(data[last])} r={6} fill={ACCENT} />
    </svg>
  );
};

const Kpi = ({
  title,
  value,
  unit,
  detail,
  data,
  plan,
  delta,
  first = false,
}: {
  title: string;
  value: string;
  unit: string;
  detail: string;
  data: number[];
  plan: string;
  delta: string;
  first?: boolean;
}) => (
  <div
    style={{
      paddingTop: 32,
      paddingLeft: first ? 0 : 24,
      borderLeft: first ? 'none' : `1px solid ${rule}`,
    }}
  >
    <div style={label}>{title}</div>
    <div
      style={{
        marginTop: 40,
        fontFamily: DISPLAY,
        fontSize: 120,
        fontWeight: 500,
        lineHeight: 0.9,
        letterSpacing: '-0.05em',
      }}
    >
      {value}
      <span style={{ fontSize: 60, letterSpacing: '-0.03em', marginLeft: 6 }}>{unit}</span>
    </div>
    <div style={{ marginTop: 22, fontSize: 28, lineHeight: 1.3, color: ink2 }}>{detail}</div>
    <div style={{ marginTop: 52 }}>
      <Spark data={data} />
    </div>
    <div
      style={{
        marginTop: 36,
        paddingTop: 18,
        borderTop: `1px solid ${rule}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        width: 354,
        fontFamily: MONO,
      }}
    >
      <span style={{ fontSize: 22, color: muted }}>{plan}</span>
      <span style={{ fontSize: 24, fontWeight: 500, color: ACCENT }}>{delta}</span>
    </div>
  </div>
);

const Glance: Page = () => (
  <Frame section="01 經營績效">
    <Headline num="1.1" topic="本季總覽">
      成長超前計畫，
      <br />
      燒錢符合計畫。
    </Headline>
    <div
      style={{
        ...abs(120, 400, 1680),
        borderTop: `1px solid ${INK}`,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        columnGap: 24,
      }}
    >
      <Kpi
        first
        title="ARR（季末）"
        value="$48.2"
        unit="M"
        detail="季增 +11.6% · 年增 +62%"
        data={[26.1, 29.8, 34.1, 38.6, 43.2, 48.2]}
        plan="計畫 $46.5M"
        delta="+$1.7M"
      />
      <Kpi
        title="淨營收留存率"
        value="128"
        unit="%"
        detail="近十二個月"
        data={[118, 120, 121, 123, 125, 128]}
        plan="計畫 122%"
        delta="+6 個百分點"
      />
      <Kpi
        title="毛利率"
        value="81.4"
        unit="%"
        detail="年增 +1.9 個百分點"
        data={[78.9, 79.5, 80.0, 80.4, 80.9, 81.4]}
        plan="計畫 80.5%"
        delta="+0.9 個百分點"
      />
      <Kpi
        title="燒錢倍數"
        value="0.88"
        unit="×"
        detail="淨燒錢 ÷ 淨新增 ARR"
        data={[1.51, 1.41, 1.19, 1.09, 1.0, 0.88]}
        plan="計畫 0.90×"
        delta="優於計畫 0.02×"
      />
    </div>
    <Source>
      資料來源：Northfold 財務部，未經查核。ARR 為季末數字，NRR 為近十二個月。趨勢小圖涵蓋 Q2 FY25 –
      Q3 FY26。
    </Source>
  </Frame>
);

const ArrChart = () => {
  const W = span(9);
  const H = 584;
  const L = 64;
  const T = 40;
  const B = 496;
  const max = 60;
  const x0 = L + 32;
  const x1 = W - 48;
  const x = (i: number) => x0 + (i * (x1 - x0)) / 9;
  const y = (v: number) => B - (v / max) * (B - T);
  const line = ARR.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const area = `${x(0)},${B} ${line} ${x(9)},${B}`;
  const plan: [number, number][] = [
    [6, 34.1],
    [7, 37.9],
    [8, 42.0],
    [9, 46.5],
  ];
  const planLine = plan.map(([i, v]) => `${x(i)},${y(v)}`).join(' ');
  const ticks = [0, 10, 20, 30, 40, 50, 60];
  const years: [string, number, number][] = [
    ['FY24', 0, 2],
    ['FY25', 3, 6],
    ['FY26', 7, 9],
  ];
  const qx = x(9);
  const qy = y(48.2);
  return (
    <svg width={W} height={H} style={{ display: 'block', overflow: 'visible' }}>
      {ticks.map((t) => (
        <g key={`t${t}`}>
          <line x1={L} x2={W} y1={y(t)} y2={y(t)} stroke={t === 0 ? INK : rule} strokeWidth={1} />
          <text
            x={L - 16}
            y={y(t) + 7}
            textAnchor="end"
            fontFamily={MONO}
            fontSize={20}
            fill={muted}
          >
            {t}
          </text>
        </g>
      ))}
      <polygon points={area} fill={INK} fillOpacity={0.06} />
      <polyline
        points={line}
        fill="none"
        stroke={INK}
        strokeWidth={3}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <polyline
        points={planLine}
        fill="none"
        stroke={muted}
        strokeWidth={2}
        strokeDasharray="7 7"
      />
      {plan.slice(1).map(([i, v]) => (
        <circle
          key={`p${i}`}
          cx={x(i)}
          cy={y(v)}
          r={5}
          fill={PAPER}
          stroke={muted}
          strokeWidth={2}
        />
      ))}
      <text
        x={(x(7) + x(8)) / 2}
        y={y(40) + 30}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize={20}
        fill={ink2}
      >
        計畫
      </text>
      {ARR.slice(0, 9).map((v, i) => (
        <circle key={`a${i}`} cx={x(i)} cy={y(v)} r={4.5} fill={INK} />
      ))}
      <circle cx={qx} cy={qy} r={10} fill={ACCENT} stroke={PAPER} strokeWidth={3} />
      <polyline
        points={`${qx - 30},${T + 52} ${qx},${T + 52} ${qx},${qy - 16}`}
        fill="none"
        stroke={INK}
        strokeWidth={1.5}
      />
      <text
        x={qx - 42}
        y={T + 48}
        textAnchor="end"
        fontFamily={DISPLAY}
        fontSize={40}
        fontWeight={600}
        letterSpacing="-0.03em"
        fill={INK}
      >
        $48.2M
      </text>
      <text
        x={qx - 42}
        y={T + 78}
        textAnchor="end"
        fontFamily={MONO}
        fontSize={22}
        fontWeight={500}
        fill={ACCENT}
      >
        較計畫 +$1.7M
      </text>
      {ARR_Q.map((q, i) => (
        <text
          key={`q${i}`}
          x={x(i)}
          y={B + 36}
          textAnchor="middle"
          fontFamily={MONO}
          fontSize={20}
          fill={i === 9 ? INK : muted}
        >
          {q}
        </text>
      ))}
      {years.map(([fy, s, e]) => (
        <g key={fy}>
          <line x1={x(s) - 26} x2={x(e) + 26} y1={B + 54} y2={B + 54} stroke={rule} />
          <text x={x(s) - 26} y={B + 84} fontFamily={MONO} fontSize={20} fill={ink2}>
            {fy}
          </text>
        </g>
      ))}
    </svg>
  );
};

const Stat = ({
  title,
  value,
  unit,
  caption,
}: {
  title: string;
  value: string;
  unit?: string;
  caption: string;
}) => (
  <div style={{ paddingTop: 22, borderTop: `1px solid ${rule}` }}>
    <div style={label}>{title}</div>
    <div
      style={{
        marginTop: 16,
        fontFamily: DISPLAY,
        fontSize: 72,
        fontWeight: 500,
        lineHeight: 0.92,
        letterSpacing: '-0.045em',
      }}
    >
      {value}
      {unit ? <span style={{ fontSize: 36, marginLeft: 4 }}>{unit}</span> : null}
    </div>
    <div style={{ marginTop: 14, fontSize: 24, lineHeight: 1.35, color: ink2 }}>{caption}</div>
  </div>
);

const Trajectory: Page = () => (
  <Frame section="01 經營績效">
    <Headline num="1.2" topic="ARR 走勢">
      連續十季複利成長。
    </Headline>
    <div style={{ ...abs(120, 300), ...label }}>季末 ARR（百萬美元）</div>
    <div style={abs(120, 336)}>
      <ArrChart />
    </div>
    <div
      style={{
        ...abs(colX(10), 336, span(3)),
        display: 'flex',
        flexDirection: 'column',
        gap: 26,
      }}
    >
      <Stat title="自 Q2 FY24 起" value="3.7" unit="×" caption="ARR 成長，從 $13.0M 到 $48.2M。" />
      <Stat title="複合成長率" value="15.7" unit="%" caption="每季複合成長率。" />
      <Stat title="Q3 淨新增 ARR" value="$5.0" unit="M" caption="歷來最佳單季；Q2 為 $4.6M。" />
    </div>
    <Source>
      資料來源：Northfold 財務部，未經查核。季末 ARR，單位為百萬美元。計畫＝董事會核准的 FY26
      營運計畫。
    </Source>
  </Frame>
);

type Bar = { name: string; sub?: string; from: number; to: number; kind: 'total' | 'up' | 'down' };

const BRIDGE: Bar[] = [
  { name: '期初 ARR', sub: 'Q2 FY26', from: 40, to: 43.2, kind: 'total' },
  { name: '新客戶', from: 43.2, to: 46.3, kind: 'up' },
  { name: '擴展', from: 46.3, to: 49.2, kind: 'up' },
  { name: '縮減', from: 49.2, to: 48.8, kind: 'down' },
  { name: '流失', from: 48.8, to: 48.2, kind: 'down' },
  { name: '期末 ARR', sub: 'Q3 FY26', from: 40, to: 48.2, kind: 'total' },
];

const Waterfall = () => {
  const W = span(8);
  const H = 530;
  const B = 440;
  const k = 36;
  const L = 64;
  const x0 = 88;
  const slot = (W - x0) / 6;
  const bw = 104;
  const y = (v: number) => B - (v - 40) * k;
  const bx = (i: number) => x0 + i * slot + (slot - bw) / 2;
  const fmt = (b: Bar) => {
    if (b.kind === 'total') return b.to.toFixed(1);
    const d = b.to - b.from;
    return `${d > 0 ? '+' : '−'}${Math.abs(d).toFixed(1)}`;
  };
  return (
    <svg width={W} height={H} style={{ display: 'block' }}>
      <defs>
        <pattern
          id="nf-hatch"
          width={7}
          height={7}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width={7} height={7} fill={PAPER} />
          <line x1={0} y1={0} x2={0} y2={7} stroke={INK} strokeWidth={3} />
        </pattern>
      </defs>
      {[40, 42, 44, 46, 48].map((t) => (
        <g key={`g${t}`}>
          <line x1={L} x2={W} y1={y(t)} y2={y(t)} stroke={t === 40 ? INK : rule} />
          <text
            x={L - 16}
            y={y(t) + 7}
            textAnchor="end"
            fontFamily={MONO}
            fontSize={20}
            fill={muted}
          >
            {t}
          </text>
        </g>
      ))}
      {BRIDGE.slice(0, 5).map((b, i) => (
        <line
          key={`c${b.name}`}
          x1={bx(i) + bw}
          x2={bx(i + 1)}
          y1={y(b.to)}
          y2={y(b.to)}
          stroke={ink2}
          strokeDasharray="3 4"
        />
      ))}
      {BRIDGE.map((b, i) => {
        const top = y(Math.max(b.from, b.to));
        const h = Math.abs(b.to - b.from) * k;
        const fill = b.kind === 'up' ? ACCENT : b.kind === 'down' ? 'url(#nf-hatch)' : INK;
        return (
          <g key={b.name}>
            <rect
              x={bx(i)}
              y={top}
              width={bw}
              height={h}
              fill={fill}
              stroke={b.kind === 'down' ? INK : 'none'}
              strokeWidth={1.5}
            />
            {b.kind === 'total' ? (
              <polygon
                points={`${bx(i) - 2},${B - 20} ${bx(i) + bw + 2},${B - 32} ${bx(i) + bw + 2},${B - 24} ${bx(i) - 2},${B - 12}`}
                fill={PAPER}
              />
            ) : null}
            <text
              x={bx(i) + bw / 2}
              y={top - 16}
              textAnchor="middle"
              fontFamily={MONO}
              fontSize={24}
              fontWeight={500}
              fill={b.kind === 'up' ? ACCENT : INK}
            >
              {fmt(b)}
            </text>
            <text
              x={bx(i) + bw / 2}
              y={B + 40}
              textAnchor="middle"
              fontFamily={DISPLAY}
              fontSize={24}
              fill={INK}
            >
              {b.name}
            </text>
            {b.sub ? (
              <text
                x={bx(i) + bw / 2}
                y={B + 70}
                textAnchor="middle"
                fontFamily={MONO}
                fontSize={20}
                fill={muted}
              >
                {b.sub}
              </text>
            ) : null}
          </g>
        );
      })}
      <line x1={bx(2) + bw + 8} x2={bx(3) - 10} y1={186} y2={186} stroke={INK} strokeWidth={1.5} />
    </svg>
  );
};

const Bridge: Page = () => (
  <Frame section="01 經營績效">
    <Headline num="1.3" topic="ARR 變動橋接圖，Q2 至 Q3 FY26">
      擴展貢獻幾乎與
      <br />
      新客戶相當。
    </Headline>
    <div style={{ ...abs(120, 380), ...label }}>ARR（百萬美元）</div>
    <div style={abs(120, 410)}>
      <Waterfall />
    </div>
    <div style={abs(120 + 634, 410 + 166, 340)}>
      <div style={{ fontSize: 30, fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
        擴展約為新客戶的 94%
      </div>
      <div style={{ marginTop: 8, fontSize: 24, lineHeight: 1.35, color: ink2 }}>
        既有客戶擴展 $2.9M，新客戶 $3.1M。
      </div>
    </div>
    <div style={{ ...abs(colX(10), 380, span(3)) }}>
      <div style={{ paddingTop: 22, borderTop: `1px solid ${INK}` }}>
        <div style={label}>Q3 淨新增 ARR</div>
        <div
          style={{
            marginTop: 18,
            fontSize: 112,
            fontWeight: 500,
            lineHeight: 0.92,
            letterSpacing: '-0.05em',
          }}
        >
          $5.0<span style={{ fontSize: 56, marginLeft: 4 }}>M</span>
        </div>
        <div style={{ marginTop: 16, fontFamily: MONO, fontSize: 22, color: ink2 }}>
          3.1 + 2.9 − 0.4 − 0.6
        </div>
      </div>
      <div style={{ marginTop: 48, paddingTop: 22, borderTop: `1px solid ${rule}` }}>
        <div style={label}>總流失率</div>
        <div
          style={{
            marginTop: 18,
            fontSize: 80,
            fontWeight: 500,
            lineHeight: 0.92,
            letterSpacing: '-0.045em',
          }}
        >
          1.4<span style={{ fontSize: 40, marginLeft: 4 }}>%</span>
        </div>
        <div style={{ marginTop: 14, fontSize: 24, lineHeight: 1.35, color: ink2 }}>
          本季流失 ARR 占期初 ARR 的比例。
        </div>
      </div>
    </div>
    <Source>
      資料來源：Northfold 財務部，未經查核。ARR 單位為百萬美元，座標軸從 $40M 起算。總流失率＝流失
      ARR ÷ 期初 ARR。
    </Source>
  </Frame>
);

const Divider: Page = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div style={root}>
      <div
        style={{
          position: 'absolute',
          left: colX(7),
          top: 0,
          right: 0,
          bottom: 0,
          background: ACCENT,
        }}
      />
      <div style={{ ...chrome, ...abs(120, 50) }}>Northfold · 董事會報告 Q3 FY26</div>
      <div style={{ ...chrome, position: 'absolute', right: 120, top: 50, color: INK }}>機密</div>
      <div style={abs(120, 150, span(6))}>
        <div style={chrome}>章節</div>
        <div
          style={{
            marginTop: 28,
            fontSize: 120,
            fontWeight: 500,
            lineHeight: 0.95,
            letterSpacing: '-0.05em',
          }}
        >
          客戶
        </div>
        <div style={{ marginTop: 24, fontSize: 40, letterSpacing: '-0.02em', color: ink2 }}>
          留存率、同類群組與客群組成
        </div>
      </div>
      <div style={{ ...abs(colX(7) + 48, 150, span(5)), fontFamily: MONO, color: INK }}>
        <div style={{ ...chrome, color: INK }}>本章內容</div>
        <div style={{ marginTop: 32, fontSize: 26, lineHeight: '46px' }}>
          2.1&nbsp;&nbsp;同類群組留存率
          <br />
          2.2&nbsp;&nbsp;客群組成
          <br />
          2.3&nbsp;&nbsp;銷售管線與效率
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 80,
          top: 319,
          fontFamily: DISPLAY,
          fontSize: 820,
          fontWeight: 500,
          lineHeight: 1,
          letterSpacing: '-0.075em',
        }}
      >
        02
      </div>
      <div style={{ ...chrome, position: 'absolute', right: 120, top: 1022, color: INK }}>
        {pad2(current)} / {pad2(total)}
      </div>
    </div>
  );
};

const COHORTS: { name: string; v: number[] }[] = [
  { name: 'Q1 FY24', v: [100, 106, 113, 119, 124, 129, 133, 136, 138] },
  { name: 'Q2 FY24', v: [100, 107, 114, 120, 126, 131, 134, 137, 140] },
  { name: 'Q3 FY24', v: [100, 105, 112, 118, 122, 127, 131, 135, 137] },
  { name: 'Q4 FY24', v: [100, 108, 116, 122, 128, 133, 137, 140] },
  { name: 'Q1 FY25', v: [100, 107, 115, 121, 127, 132, 136] },
  { name: 'Q2 FY25', v: [100, 109, 117, 124, 130, 135] },
  { name: 'Q3 FY25', v: [100, 110, 118, 125, 131] },
  { name: 'Q4 FY25', v: [100, 109, 118, 124] },
];

const rgb = (hex: string) => [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
const ramp = (t: number) => {
  const a = rgb(panel);
  const b = rgb(design.palette.accent);
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return `rgb(${c.join(',')})`;
};

const Heatmap = () => {
  const LBL = 150;
  const pitch = 121;
  const cw = 117;
  const rp = 60;
  const rh = 56;
  const top = 64;
  const W = LBL + 9 * pitch;
  const H = top + 8 * rp;
  const fx = LBL + 4 * pitch;
  return (
    <svg width={W} height={H} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="nf-ramp" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={panel} />
          <stop offset="1" stopColor={design.palette.accent} />
        </linearGradient>
      </defs>
      <text x={0} y={22} fontFamily={MONO} fontSize={20} fill={muted} letterSpacing="0.06em">
        同類群組
      </text>
      <text x={W - 300} y={22} textAnchor="end" fontFamily={MONO} fontSize={20} fill={muted}>
        100%
      </text>
      <rect x={W - 288} y={8} width={208} height={14} fill="url(#nf-ramp)" />
      <text x={W - 68} y={22} fontFamily={MONO} fontSize={20} fill={muted}>
        140%
      </text>
      <text x={LBL} y={22} fontFamily={MONO} fontSize={20} fill={muted} letterSpacing="0.06em">
        起始後月數
      </text>
      {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((m, c) => (
        <text
          key={`m${m}`}
          x={LBL + c * pitch + cw / 2}
          y={top - 10}
          textAnchor="middle"
          fontFamily={MONO}
          fontSize={20}
          fontWeight={c === 4 ? 500 : 400}
          fill={c === 4 ? ACCENT : ink2}
        >
          {m}
        </text>
      ))}
      {COHORTS.map((row, r) => (
        <g key={row.name}>
          <text x={0} y={top + r * rp + rh / 2 + 7} fontFamily={MONO} fontSize={20} fill={ink2}>
            {row.name}
          </text>
          {row.v.map((v, c) => {
            const t = Math.min(1, Math.max(0, (v - 100) / 40));
            return (
              <g key={`${row.name}-${c}`}>
                <rect x={LBL + c * pitch} y={top + r * rp} width={cw} height={rh} fill={ramp(t)} />
                <text
                  x={LBL + c * pitch + cw / 2}
                  y={top + r * rp + rh / 2 + 8}
                  textAnchor="middle"
                  fontFamily={MONO}
                  fontSize={22}
                  fontWeight={500}
                  fill={t >= 0.55 ? '#FFFFFF' : INK}
                >
                  {v}
                </text>
              </g>
            );
          })}
        </g>
      ))}
      <rect
        x={fx - 5}
        y={top - 5}
        width={cw + 10}
        height={7 * rp - (rp - rh) + 10}
        fill="none"
        stroke={INK}
        strokeWidth={2.5}
      />
      <text
        x={fx + 2}
        y={top + 7 * rp + rh / 2 + 9}
        fontFamily={DISPLAY}
        fontSize={26}
        fontWeight={500}
        fill={INK}
      >
        第 12 個月：七個群組全數達 120% 以上
      </text>
    </svg>
  );
};

const Cohorts: Page = () => (
  <Frame section="02 客戶">
    <Headline num="2.1" topic="同類群組淨留存率">
      FY24 以來每個群組，
      <br />
      到第 12 個月都突破 120%。
    </Headline>
    <div style={abs(120, 372)}>
      <Heatmap />
    </div>
    <div
      style={{
        ...abs(colX(10), 372, span(3)),
        display: 'flex',
        flexDirection: 'column',
        gap: 30,
      }}
    >
      <Stat
        title="第 12 個月最佳"
        value="131"
        unit="%"
        caption="Q3 FY25 群組，是最近一個走到第 12 個月的群組。"
      />
      <Stat
        title="第 12 個月最弱"
        value="122"
        unit="%"
        caption="Q3 FY24 群組，之後持續複利成長，第 24 個月達 137%。"
      />
    </div>
    <Source>
      資料來源：Northfold 財務部，未經查核。群組 ARR 占起始 ARR 的百分比，按季統計。Q4 FY25 群組將於
      Q4 FY26 走到第 12 個月。
    </Source>
  </Frame>
);

const Segment = ({
  name,
  pct,
  customers,
  bg,
  fg,
}: {
  name: string;
  pct: number;
  customers: string;
  bg: string;
  fg: string;
}) => (
  <div
    style={{
      width: `${pct}%`,
      background: bg,
      color: fg,
      padding: '20px 24px 22px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}
  >
    <div
      style={{
        fontFamily: MONO,
        fontSize: 20,
        lineHeight: '26px',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}
    >
      {name}
      <br />
      <span style={{ opacity: 0.72 }}>{customers} 家客戶</span>
    </div>
    <div style={{ fontSize: 64, fontWeight: 500, lineHeight: 0.9, letterSpacing: '-0.045em' }}>
      {pct}%
    </div>
  </div>
);

const Mix: Page = () => (
  <Frame section="02 客戶">
    <Headline num="2.2" topic="客群組成">
      客戶規模更大，集中度更低。
    </Headline>
    <div style={{ ...abs(120, 300), ...label }}>各客群占 ARR 比重，Q3 FY26</div>
    <div style={{ ...abs(120, 336, 1680), height: 170, display: 'flex', gap: 3 }}>
      <Segment name="企業級" pct={31} customers="112" bg={ACCENT} fg="#FFFFFF" />
      <Segment name="中型市場" pct={54} customers="598" bg={INK} fg="#FFFFFF" />
      <Segment name="成長型" pct={15} customers="702" bg={panel} fg={INK} />
    </div>
    <div
      style={{
        ...abs(120 + 403, 336),
        height: 196,
        borderLeft: '2px dashed #FFFFFF',
      }}
    />
    <div style={{ ...abs(120 + 403, 506), height: 26, borderLeft: `2px solid ${INK}` }} />
    <div
      style={{
        ...abs(120 + 415, 512),
        fontFamily: MONO,
        fontSize: 20,
        lineHeight: '24px',
        color: INK,
      }}
    >
      一年前的企業級：24%
    </div>
    <div
      style={{
        ...abs(120, 600, 1680),
        borderTop: `1px solid ${INK}`,
        display: 'grid',
        gridTemplateColumns: `${span(5)}px ${span(3)}px ${span(4)}px`,
        columnGap: 24,
      }}
    >
      <div style={{ paddingTop: 28 }}>
        <div style={label}>ARR 超過 $100K 的客戶</div>
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'flex-end', gap: 32 }}>
          <div
            style={{ fontSize: 240, fontWeight: 500, lineHeight: 0.8, letterSpacing: '-0.06em' }}
          >
            96
          </div>
          <div style={{ paddingBottom: 4 }}>
            <div style={{ fontFamily: MONO, fontSize: 26, fontWeight: 500, color: ACCENT }}>
              年增 +57%
            </div>
            <div style={{ marginTop: 8, fontSize: 28, lineHeight: 1.3, color: ink2 }}>
              從一年前的
              <br />
              61 家成長而來
            </div>
          </div>
        </div>
      </div>
      <div style={{ paddingTop: 28, paddingLeft: 24, borderLeft: `1px solid ${rule}` }}>
        <div style={label}>客戶總數</div>
        <div
          style={{
            marginTop: 18,
            fontSize: 104,
            fontWeight: 500,
            lineHeight: 0.9,
            letterSpacing: '-0.05em',
          }}
        >
          1,412
        </div>
        <div style={{ marginTop: 20, fontSize: 28, lineHeight: 1.3, color: ink2 }}>
          本季新增 148 家
        </div>
      </div>
      <div style={{ paddingTop: 28, paddingLeft: 24, borderLeft: `1px solid ${rule}` }}>
        <div style={label}>前十大客戶占 ARR 比重</div>
        <div
          style={{
            marginTop: 18,
            fontSize: 104,
            fontWeight: 500,
            lineHeight: 0.9,
            letterSpacing: '-0.05em',
          }}
        >
          9.8<span style={{ fontSize: 52, marginLeft: 4 }}>%</span>
        </div>
        <div style={{ marginTop: 20, fontSize: 28, lineHeight: 1.3, color: ink2 }}>
          低於 Q3 FY25 的 13.5%
        </div>
      </div>
    </div>
    <Source>
      資料來源：Northfold 財務部，未經查核。客群依客戶年營收劃分：企業級高於 $500M，中型市場
      $50–500M，成長型低於 $50M。
    </Source>
  </Frame>
);

const FunnelRow = ({
  name,
  note,
  value,
  len,
  accent = false,
}: {
  name: string;
  note: string;
  value: string;
  len: number;
  accent?: boolean;
}) => (
  <div style={{ height: 132 }}>
    <div style={{ display: 'flex', gap: 20, alignItems: 'baseline' }}>
      <span style={{ ...label, color: INK }}>{name}</span>
      <span style={label}>{note}</span>
    </div>
    <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 20 }}>
      <div style={{ width: len, height: 64, background: accent ? ACCENT : INK }} />
      <span
        style={{
          fontSize: 40,
          fontWeight: 500,
          letterSpacing: '-0.03em',
          color: accent ? ACCENT : INK,
        }}
      >
        {value}
      </span>
    </div>
  </div>
);

const Metric = ({
  name,
  note,
  value,
  unit,
}: {
  name: string;
  note: string;
  value: string;
  unit?: string;
}) => (
  <div
    style={{
      borderTop: `1px solid ${rule}`,
      padding: '22px 0 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    }}
  >
    <div>
      <div style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-0.02em' }}>{name}</div>
      <div style={{ marginTop: 6, fontFamily: MONO, fontSize: 20, color: muted }}>{note}</div>
    </div>
    <div style={{ fontSize: 72, fontWeight: 500, lineHeight: 0.9, letterSpacing: '-0.045em' }}>
      {value}
      {unit ? <span style={{ fontSize: 30, marginLeft: 6, letterSpacing: 0 }}>{unit}</span> : null}
    </div>
  </div>
);

const Pipeline: Page = () => (
  <Frame section="02 客戶">
    <Headline num="2.3" topic="銷售管線與效率">
      銷售管線足以支撐 Q4 計畫。
    </Headline>
    <div style={abs(120, 316, span(8))}>
      <FunnelRow name="新增管線" note="Q3，新客戶" value="$21.4M" len={900} />
      <FunnelRow name="合格商機" note="占新增管線 60%" value="$12.9M" len={543} />
      <FunnelRow name="提案階段" note="占合格商機 59%" value="$7.6M" len={320} />
      <FunnelRow name="成交" note="占提案階段 41% · 新客戶 ARR" value="$3.1M" len={130} accent />
    </div>
    <div
      style={{
        ...abs(colX(5), 596, span(4)),
        borderLeft: `3px solid ${ACCENT}`,
        paddingLeft: 28,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ ...label, color: INK }}>Q4 覆蓋倍數</div>
      <div
        style={{
          marginTop: 14,
          fontSize: 80,
          fontWeight: 500,
          lineHeight: 0.9,
          letterSpacing: '-0.05em',
        }}
      >
        3.3<span style={{ fontSize: 40, marginLeft: 4 }}>×</span>
      </div>
      <div style={{ marginTop: 16, fontSize: 26, lineHeight: 1.35, color: ink2 }}>
        Q4 預計有 $11.2M 合格管線成交，對照新客戶計畫 $3.4M。
      </div>
    </div>
    <div
      style={{
        ...abs(colX(9), 316, span(4)),
        borderLeft: `1px solid ${rule}`,
        paddingLeft: 40,
        boxSizing: 'border-box',
      }}
    >
      <Steps>
        <div style={{ ...label, paddingBottom: 18 }}>銷售效率，Q3</div>
        <Step>
          <Metric name="贏單率" note="合格商機，依件數" value="27" unit="%" />
        </Step>
        <Step>
          <Metric name="銷售週期中位數" note="從合格到成交" value="54" unit="天" />
        </Step>
        <Step>
          <Metric name="Magic number" note="以總營收計算" value="1.3" />
        </Step>
        <Step>
          <Metric name="CAC 回收期" note="毛利調整後" value="14" unit="個月" />
        </Step>
      </Steps>
    </div>
    <Source width={span(8)}>
      資料來源：Northfold CRM 與財務部，未經查核。Q3 FY26 新客戶商機，ARR 單位為百萬美元。
    </Source>
  </Frame>
);

const TL_L = colX(5);
const TL_R = colX(8) + 118;
const dayX = (d: number) => TL_L + (d / 91) * (TL_R - TL_L);
const PLAN_MAX = 1.75;
const BAR_W = 420;

const Lane = ({
  n,
  area,
  name,
  date,
  day,
  desc,
  value,
  unit,
  pct,
  planText,
}: {
  n: string;
  area: string;
  name: string;
  date: string;
  day: number;
  desc: string;
  value: string;
  unit: string;
  pct: number;
  planText: string;
}) => {
  const mx = dayX(day) - 120;
  const end = TL_R - 120;
  return (
    <div style={{ position: 'relative', height: 190, borderTop: `1px solid ${rule}` }}>
      <div style={abs(0, 26, span(4))}>
        <div style={{ ...label, color: INK }}>
          <span style={{ color: ACCENT }}>{n}</span>
          <span style={{ marginLeft: 14 }}>{area}</span>
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 34,
            fontWeight: 500,
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
          }}
        >
          {name}
        </div>
        <div style={{ marginTop: 10, fontSize: 22, lineHeight: 1.4, color: ink2 }}>{desc}</div>
      </div>
      <svg width={end + 20} height={190} style={{ position: 'absolute', left: 0, top: 0 }}>
        <line x1={TL_L - 120} x2={end} y1={95} y2={95} stroke={rule} strokeWidth={2} />
        <rect x={mx} y={90} width={end - mx} height={10} fill={INK} />
        <rect x={mx - 9} y={86} width={18} height={18} fill={ACCENT} />
        <text x={mx} y={66} textAnchor="middle" fontFamily={MONO} fontSize={20} fill={INK}>
          {date}
        </text>
        <text x={end} y={134} textAnchor="end" fontFamily={MONO} fontSize={20} fill={muted}>
          已上線 {91 - day} 天
        </text>
      </svg>
      <div style={abs(colX(9) - 120, 30, span(4))}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontSize: 64, fontWeight: 500, lineHeight: 1, letterSpacing: '-0.045em' }}>
            {value}
          </span>
          <span style={{ fontSize: 24, color: ink2 }}>{unit}</span>
        </div>
        <svg width={BAR_W} height={30} style={{ display: 'block', marginTop: 16 }}>
          <rect x={0} y={10} width={BAR_W} height={10} fill={panel} />
          <rect x={0} y={10} width={(pct / PLAN_MAX) * BAR_W} height={10} fill={ACCENT} />
          <rect x={(1 / PLAN_MAX) * BAR_W - 1} y={0} width={2} height={30} fill={INK} />
        </svg>
        <div
          style={{
            marginTop: 8,
            width: BAR_W,
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: MONO,
            fontSize: 20,
            color: muted,
          }}
        >
          <span>{planText}</span>
          <span style={{ color: ACCENT, fontWeight: 500 }}>達成計畫 {Math.round(pct * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

const Product: Page = () => (
  <Frame section="03 營運">
    <Headline num="3.1" topic="產品">
      三項新產品上線，採用速度超乎預期。
    </Headline>
    <svg width={1680} height={640} style={{ position: 'absolute', left: 120, top: 296 }}>
      {[0, 31, 62, 91].map((d) => (
        <line
          key={`d${d}`}
          x1={dayX(d) - 120}
          x2={dayX(d) - 120}
          y1={36}
          y2={614}
          stroke={rule}
          strokeDasharray="2 5"
        />
      ))}
      {(
        [
          ['7 月', 0],
          ['8 月', 31],
          ['9 月', 62],
        ] as [string, number][]
      ).map(([m, d]) => (
        <text
          key={m}
          x={dayX(d) - 120 + 10}
          y={26}
          fontFamily={MONO}
          fontSize={20}
          letterSpacing="0.06em"
          fill={muted}
        >
          {m}
        </text>
      ))}
    </svg>
    <div style={{ ...abs(120, 300), ...label }}>上線</div>
    <div style={{ ...abs(colX(9), 300), ...label }}>截至 9 月 30 日的採用情況</div>
    <div style={abs(120, 344, 1680)}>
      <Lane
        n="01"
        area="資金管理"
        name="多實體資金管理"
        date="8/12"
        day={42}
        desc="合併現金與集團內部資金歸集。"
        value="214"
        unit="家客戶已上線"
        pct={214 / 150}
        planText="年底計畫 150"
      />
      <Lane
        n="02"
        area="卡片"
        name="卡片控管 v2"
        date="9/2"
        day={63}
        desc="特店層級限額，即時核准。"
        value="61%"
        unit="的卡片客戶已完成遷移"
        pct={61 / 40}
        planText="年底計畫 40%"
      />
      <Lane
        n="03"
        area="系統整合"
        name="ERP 同步，4 個新連接器"
        date="9/23"
        day={84}
        desc="NetSuite, Sage Intacct, Dynamics 365, Acumatica."
        value="388"
        unit="個連線"
        pct={388 / 250}
        planText="年底計畫 250"
      />
    </div>
    <Source>
      資料來源：Northfold 產品分析，2026 年 9 月 30 日。計畫＝上線商業案例中 2026 年 12 月 31
      日的目標；垂直線代表計畫的 100%。
    </Source>
  </Frame>
);

const BurnBars = () => {
  const data: [string, number][] = [
    ['Q4 FY25', 5.1],
    ['Q1 FY26', 4.9],
    ['Q2 FY26', 4.6],
    ['Q3 FY26', 4.4],
  ];
  const W = span(4);
  const H = 290;
  const B = 236;
  const T = 60;
  const y = (v: number) => B - (v / 6) * (B - T);
  const slot = W / 4;
  const bw = 76;
  const bx = (i: number) => i * slot + (slot - bw) / 2;
  return (
    <svg width={W} height={H} style={{ display: 'block' }}>
      <line x1={0} x2={W} y1={B} y2={B} stroke={INK} />
      {data.map(([q, v], i) => (
        <g key={q}>
          <rect x={bx(i)} y={y(v)} width={bw} height={B - y(v)} fill={i === 3 ? ACCENT : INK} />
          <text
            x={bx(i) + bw / 2}
            y={y(v) - 14}
            textAnchor="middle"
            fontFamily={MONO}
            fontSize={22}
            fontWeight={500}
            fill={i === 3 ? ACCENT : INK}
          >
            {v.toFixed(1)}
          </text>
          <text
            x={bx(i) + bw / 2}
            y={B + 32}
            textAnchor="middle"
            fontFamily={MONO}
            fontSize={20}
            fill={i === 3 ? INK : muted}
          >
            {q}
          </text>
        </g>
      ))}
      <line
        x1={bx(3) - 10}
        x2={bx(3) + bw + 10}
        y1={y(4.5)}
        y2={y(4.5)}
        stroke={INK}
        strokeWidth={2}
        strokeDasharray="4 3"
      />
      <text
        x={bx(3) + bw / 2}
        y={y(4.4) - 44}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize={20}
        fill={ink2}
      >
        計畫 4.5
      </text>
    </svg>
  );
};

const OpexRow = ({
  name,
  actual,
  plan,
  variance,
  favorable = false,
  total = false,
  sub = false,
}: {
  name: string;
  actual: string;
  plan: string;
  variance: string;
  favorable?: boolean;
  total?: boolean;
  sub?: boolean;
}) => {
  const cell: CSSProperties = {
    padding: '15px 0',
    textAlign: 'right',
    fontSize: 28,
    lineHeight: '32px',
    fontWeight: total ? 500 : 400,
  };
  return (
    <tr style={{ borderTop: `1px solid ${total ? INK : rule}` }}>
      <td
        style={{
          ...cell,
          textAlign: 'left',
          color: sub ? ink2 : INK,
          paddingLeft: sub ? 28 : 0,
        }}
      >
        {name}
      </td>
      <td style={cell}>{actual}</td>
      <td style={{ ...cell, color: muted }}>{plan}</td>
      <td style={{ ...cell, fontFamily: MONO, fontSize: 24, color: favorable ? ACCENT : INK }}>
        {variance}
      </td>
    </tr>
  );
};

const Runway: Page = () => (
  <Frame section="03 營運">
    <Headline num="3.2" topic="支出與資金跑道">
      按 FY27 計畫，資金仍可撐 36 個月以上。
    </Headline>
    <div style={abs(120, 300, span(4))}>
      <div style={label}>現金及約當現金，9 月 30 日</div>
      <div
        style={{
          marginTop: 18,
          fontSize: 120,
          fontWeight: 500,
          lineHeight: 0.9,
          letterSpacing: '-0.05em',
        }}
      >
        $112.6<span style={{ fontSize: 60, marginLeft: 4 }}>M</span>
      </div>
      <div style={{ marginTop: 24, fontSize: 28, lineHeight: 1.4 }}>
        依 Q3 淨燒錢可撐 76 個月
        <br />
        <span style={{ color: ink2 }}>依 FY27 計畫燒錢可撐 43 個月</span>
      </div>
      <div style={{ marginTop: 44, paddingTop: 22, borderTop: `1px solid ${rule}`, ...label }}>
        各季淨燒錢（百萬美元）
      </div>
      <div style={{ marginTop: 6 }}>
        <BurnBars />
      </div>
    </div>
    <table
      style={{
        ...abs(colX(6), 300, span(7)),
        borderCollapse: 'collapse',
        tableLayout: 'fixed',
      }}
    >
      <colgroup>
        <col />
        <col style={{ width: 170 }} />
        <col style={{ width: 170 }} />
        <col style={{ width: 170 }} />
      </colgroup>
      <thead>
        <tr>
          <th style={{ ...label, textAlign: 'left', fontWeight: 400, paddingBottom: 14 }}>
            單季（百萬美元）
          </th>
          <th style={{ ...label, textAlign: 'right', fontWeight: 400, paddingBottom: 14 }}>
            Q3 實際
          </th>
          <th style={{ ...label, textAlign: 'right', fontWeight: 400, paddingBottom: 14 }}>計畫</th>
          <th style={{ ...label, textAlign: 'right', fontWeight: 400, paddingBottom: 14 }}>
            對計畫差異
          </th>
        </tr>
      </thead>
      <tbody>
        <OpexRow name="研發" actual="9.8" plan="10.1" variance="−0.3" favorable />
        <OpexRow name="業務與行銷" actual="8.1" plan="8.0" variance="+0.1" />
        <OpexRow name="一般與行政" actual="3.0" plan="3.1" variance="−0.1" favorable />
        <OpexRow name="營業費用" actual="20.9" plan="21.2" variance="−0.3" favorable total />
        <OpexRow name="減：毛利" actual="(15.3)" plan="(15.5)" variance="+0.2" sub />
        <OpexRow name="減：利息收入" actual="(1.2)" plan="(1.2)" variance="0.0" sub />
        <OpexRow name="淨燒錢" actual="4.4" plan="4.5" variance="−0.1" favorable total />
      </tbody>
    </table>
    <div
      style={{
        ...abs(colX(6), 830, span(7)),
        fontSize: 26,
        lineHeight: 1.4,
        color: ink2,
      }}
    >
      營業費用較計畫低 $0.3M：六位研發人員的到職時間從 Q3 延到 Q4。毛利包含訂閱與交易營收。
    </div>
    <Source>
      資料來源：Northfold 財務部，未經查核。資金跑道＝現金 ÷ 每月淨燒錢。FY27 計畫燒錢
      $31.2M，含新增 38 人與 $6M 資本支出。
    </Source>
  </Frame>
);

const Risk = ({
  id,
  title,
  level,
  exposure,
  mitigation,
}: {
  id: string;
  title: string;
  level: string;
  exposure: string;
  mitigation: string;
}) => (
  <div
    style={{
      borderTop: `1px solid ${rule}`,
      padding: '22px 0 26px',
      display: 'grid',
      gridTemplateColumns: '94px 1fr',
    }}
  >
    <div style={{ fontFamily: MONO, fontSize: 22, lineHeight: '40px', color: ACCENT }}>{id}</div>
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span
          style={{ fontSize: 34, fontWeight: 500, lineHeight: '40px', letterSpacing: '-0.02em' }}
        >
          {title}
        </span>
        <span style={label}>{level}</span>
      </div>
      <div style={{ marginTop: 8, fontSize: 24, lineHeight: 1.4, color: ink2 }}>{exposure}</div>
      <div style={{ marginTop: 6, fontSize: 24, lineHeight: 1.4 }}>
        <span style={{ ...label, color: INK, marginRight: 12 }}>對策</span>
        {mitigation}
      </div>
    </div>
  </div>
);

const Decision = ({ n, title, detail }: { n: string; title: string; detail: string }) => (
  <div
    style={{
      borderTop: '1px solid #CFC9BC',
      padding: '22px 0 24px',
      display: 'grid',
      gridTemplateColumns: '72px 1fr',
    }}
  >
    <div
      style={{
        fontSize: 56,
        fontWeight: 500,
        lineHeight: '44px',
        letterSpacing: '-0.04em',
        color: ACCENT,
      }}
    >
      {n}
    </div>
    <div>
      <div style={{ fontSize: 32, fontWeight: 500, lineHeight: '38px', letterSpacing: '-0.02em' }}>
        {title}
      </div>
      <div style={{ marginTop: 8, fontSize: 24, lineHeight: 1.4, color: ink2 }}>{detail}</div>
    </div>
  </div>
);

const Decisions: Page = () => (
  <Frame section="04 公司治理">
    <Headline num="4.1" topic="風險與決議">
      三項風險已在掌握。
      <br />
      今天有三項決議。
    </Headline>
    <div style={abs(120, 380, span(6) - 24)}>
      <div style={{ ...label, paddingBottom: 16 }}>風險與因應</div>
      <Risk
        id="R1"
        title="歐盟資料在地化期限"
        level="高"
        exposure="2027/6/30 前須在歐盟境內存放資料；占企業級 ARR 22%。"
        mitigation="成立阿姆斯特丹實體、啟用法蘭克福區域，Q2 FY27 上線。"
      />
      <Risk
        id="R2"
        title="企業級業務產能"
        level="中"
        exposure="14 位企業級業務代表中 11 位已到位；管線成長快於業務覆蓋。"
        mitigation="FY27 招募 8 位企業級業務代表；合作夥伴管線占 18%。"
      />
      <Risk
        id="R3"
        title="卡片交換費壓縮"
        level="中"
        exposure="卡組織調整，自 Q1 FY27 起綜合交換費率約下降 12 bps。"
        mitigation="卡片占營收 19%；營收組合正轉向資金管理。"
      />
    </div>
    <div
      style={{
        ...abs(colX(7), 380, span(6)),
        height: 525,
        background: panel,
        padding: '36px 44px',
        boxSizing: 'border-box',
      }}
    >
      <Steps>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 18 }}>
          <span style={{ fontSize: 34, fontWeight: 500, letterSpacing: '-0.02em' }}>
            請求決議事項
          </span>
          <span style={{ ...label, color: INK, lineHeight: '40px' }}>待核准</span>
        </div>
        <Step>
          <Decision
            n="1"
            title="核准 FY27 招募計畫，新增 38 人"
            detail="研發 22、市場拓展 12、行政 4；年化營業費用 $7.6M。"
          />
        </Step>
        <Step>
          <Decision
            n="2"
            title="核准設立阿姆斯特丹實體"
            detail="由 Northfold B.V. 簽約並保管歐盟客戶資料（R1）。"
          />
        </Step>
        <Step>
          <Decision
            n="3"
            title="核准 FY27 資本支出 $6M"
            detail="在法蘭克福設置第二個主機區域，Q2 FY27 上線（R1）。"
          />
        </Step>
      </Steps>
    </div>
    <Source>
      風險負責人：R1 技術長、R2 營收長、R3 財務長。已於 2026 年 10 月 2 日提報審計委員會。
    </Source>
  </Frame>
);

const Priority = ({ n, title, detail }: { n: string; title: string; detail: string }) => (
  <div
    style={{
      borderTop: `1px solid ${rule}`,
      padding: '24px 0 28px',
      display: 'grid',
      gridTemplateColumns: '94px 1fr',
    }}
  >
    <div style={{ fontFamily: MONO, fontSize: 22, lineHeight: '42px', color: ACCENT }}>{n}</div>
    <div>
      <div style={{ fontSize: 36, fontWeight: 500, lineHeight: '42px', letterSpacing: '-0.025em' }}>
        {title}
      </div>
      <div style={{ marginTop: 8, fontSize: 26, lineHeight: 1.4, color: ink2 }}>{detail}</div>
    </div>
  </div>
);

const Target = ({ name, value, note }: { name: string; value: string; note: string }) => (
  <div
    style={{
      borderTop: `1px solid ${rule}`,
      padding: '30px 0 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    }}
  >
    <div>
      <div style={{ ...label, color: INK }}>{name}</div>
      <div style={{ marginTop: 6, fontFamily: MONO, fontSize: 20, color: muted }}>{note}</div>
    </div>
    <div style={{ fontSize: 80, fontWeight: 500, lineHeight: 0.9, letterSpacing: '-0.045em' }}>
      {value}
    </div>
  </div>
);

const Close: Page = () => (
  <Frame section="04 公司治理">
    <Headline num="4.2" topic="Q4 優先事項">
      FY26 超前計畫收尾，
      <br />
      歐盟區域資金到位。
    </Headline>
    <div style={abs(120, 380, span(7))}>
      <div style={{ ...label, paddingBottom: 16 }}>優先事項</div>
      <Priority
        n="01"
        title="依計畫贏單率轉化 Q4 管線"
        detail="$11.2M 合格管線預計在 Q4 成交；為 $3.4M 新客戶計畫的 3.3 倍。"
      />
      <Priority
        n="02"
        title="完成卡片控管 v2 遷移"
        detail="12 月 15 日前，從 61% 擴大到所有卡片客戶。"
      />
      <Priority
        n="03"
        title="啟動歐盟區域建置"
        detail="設立 Northfold B.V. 並啟動法蘭克福建置，以今日核准為前提。"
      />
    </div>
    <div style={abs(colX(9), 380, span(4))}>
      <div style={{ ...label, paddingBottom: 16 }}>Q4 季末目標</div>
      <Target name="ARR" value="$53.5M" note="季增 +11.0%" />
      <Target name="淨營收留存率" value="≥125%" note="近十二個月" />
      <Target name="淨燒錢" value="≤$4.6M" note="單季" />
    </div>
    <div style={{ ...abs(120, 902), display: 'flex', alignItems: 'center', gap: 40 }}>
      <Wordmark size={34} />
      <span style={{ ...chrome }}>下次董事會 · 2027 年 1 月 13 日</span>
    </div>
  </Frame>
);

export const meta: SlideMeta = {
  title: 'Northfold — 董事會報告，2026 會計年度第三季',
  createdAt: '2026-10-11T10:47:04.444Z',
};

export const notes: (string | undefined)[] = [
  `執行長開場。感謝董事會，確認 75 分鐘的時段安排：30 分鐘談數字、20 分鐘談客戶與產品，其餘時間處理三項核准事項。
先定調一句話：本季成長超前計畫，現金狀況符合計畫。`,
  `財務長。四個數字，一分鐘講完。
ARR 收在 $48.2M，比計畫高 $1.7M，季增 11.6%、年增 62%。NRR 為 128%，計畫是 122%。毛利率 81.4%，提升近兩個百分點。
燒錢倍數 0.88：我們花了 $4.4M，換來 $5.0M 的淨新增 ARR。`,
  `財務長。連續十季成長，從 $13.0M 到 $48.2M：27 個月內成長 3.7 倍。
請看虛線：今年每一季我們都達到或超過 FY26 計畫，而且 Q3 的差距進一步拉大。
Q3 淨新增 ARR $5.0M，是歷來最好的一季。`,
  `財務長。這 $5.0M 從哪裡來。
新客戶 $3.1M、擴展 $2.9M；擴展的貢獻已達新客戶 ARR 的 94%。縮減 $0.4M、流失 $0.6M，因此總流失率為期初 ARR 的 1.4%。
注意座標軸從 $40M 起算，這樣小的長條才看得清楚。`,
  `執行長。轉場到客戶。三頁：同類群組如何留存、我們賣給誰、銷售管線能否涵蓋 Q4。大約八分鐘。`,
  `執行長。熱度圖請以欄為單位來看。第 12 個月已用框標出：走到這個月份的群組，全部都在 122% 以上。
FY25 的群組成長速度，比 FY24 在同樣月齡時更快；Q3 FY25 已達 131%。
Q4 FY25 下一季會走到第 12 個月，目前第 9 個月是 124%。`,
  `執行長。客群正在往高階移動，但沒有變得更集中。
企業級占 ARR 的 31%，一年前是 24%。ARR 超過 $100K 的客戶有 96 家，一年前是 61 家。前十大客戶占比從 13.5% 降到 9.8%。
客戶總數 1,412 家，本季新增 148 家。`,
  `營收長。從上到下走一遍漏斗：新增 $21.4M、合格 $12.9M、提案階段 $7.6M、成交 $3.1M。
接著看覆蓋倍數的標註：Q4 預計有 $11.2M 合格管線成交，是 $3.4M 新客戶計畫的 3.3 倍。
按四次下一步，依序帶出贏單率、銷售週期、Magic number 與 CAC 回收期，每次講一個。`,
  `產品長。本季三項新產品上線，採用數字都已超過年底目標。
多實體資金管理：214 家客戶已上線，目標是 150 家。卡片控管 v2：四週內 61% 完成遷移，目標是 40%。ERP 連接器：上線一週就有 388 個連線，目標是 250 個。`,
  `財務長。現金 $112.6M。以 Q3 淨燒錢 $4.4M 計算可撐 76 個月；按 FY27 計畫（含今天的請求事項）則是 43 個月。
營業費用比計畫低 $0.3M，因為六位研發人員延到 Q4 到職。淨燒錢 $4.4M，計畫是 $4.5M，連續第四季下降。`,
  `執行長。先談風險，再談請求事項。歐盟資料在地化是要特別留意的一項：企業級 ARR 的 22% 必須在 2027 年 6 月前將資料存放在歐盟境內。
按三次下一步帶出決議事項：新增 38 人的招募計畫、阿姆斯特丹實體，以及法蘭克福的 $6M 資本支出。決議 2 和 3 可以解除風險 R1。
暫停讓董事提問，然後依序表決。`,
  `執行長收尾。Q4 季末目標：ARR $53.5M、NRR 達 125% 以上、淨燒錢不超過 $4.6M。
三項優先事項：轉化已有覆蓋的管線、完成卡片遷移、在核准後啟動歐盟區域建置。
下次會議在 1 月 13 日。`,
];

export default [
  Cover,
  Glance,
  Trajectory,
  Bridge,
  Divider,
  Cohorts,
  Mix,
  Pipeline,
  Product,
  Runway,
  Decisions,
  Close,
] satisfies Page[];
