---
name: 清新營養
description: 健康營養品牌簡報——淡薄荷白底、草本綠主色、柑橘橘點綴大數字，營養標示表和去背產品圖讓數據看起來可信。
mode: light
---

# 清新營養

給保健食品、營養品、健康飲食、運動營養這類品牌用的主題。核心是「乾淨、可信、有依據」：大量留白、數字放大、每個數字都附來源，產品用去背圖放在柔和的色塊上。

## Palette

| 角色 | 色碼 | 用途 |
| --- | --- | --- |
| bg | `#F6FAF6` | 頁面背景（淡薄荷白） |
| surface | `#FFFFFF` | 卡片、表格底色 |
| text | `#1D2A22` | 主要文字（深墨綠黑） |
| muted | `#647368` | 次要文字、註腳、來源 |
| accent | `#2E9E5B` | 主色：標題重點、圖示、進度條（草本綠） |
| accentSoft | `#E2F2E7` | 產品底色塊、標籤底色 |
| highlight | `#F28C28` | 重點數字（柑橘橘）——一頁最多一處 |
| rule | `#DCE7DE` | 分隔線、表格線 |

## Typography

- Display font: `"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", system-ui, sans-serif`——標題 900、小標 700。
- Body font: 同上，內文 400、強調 500。
- 數字一律 `font-variant-numeric: tabular-nums`，營養數據才會對齊。
- Webfont import: `https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&display=swap`——依 `slide-authoring` 的 `references/webfonts.md` 在模組頂層注入一次。文字固定時可加 `&text=` 只載需要的字。
- Type-scale overrides：
  - Hero title：128 px（中文筆畫多，比預設略小）
  - 頁標題：72 px
  - Body text：34 px，行高 1.6
  - 大數字：200 px，字重 900
  - 註腳／來源：22 px

## Layout

- 內容邊距：上下 100 px、左右 140 px（1920 × 1080）。
- 左文右圖為主：左側 7 欄放標題與重點，右側 5 欄放產品圖或數據卡。
- 數據頁用 3 欄卡片並排，卡片之間 40 px。
- 每頁右下角固定留給 Footer，底部 72 px 內不放內容。

## Fixed components

這些可以直接貼進使用此主題的簡報。

### Title

```tsx
const Title = ({ children }: { children: React.ReactNode }) => (
  <h1
    style={{
      fontSize: 72,
      fontWeight: 900,
      lineHeight: 1.25,
      letterSpacing: '0.01em',
      margin: 0,
      color: '#1D2A22',
    }}
  >
    {children}
  </h1>
);
```

### Footer

頁碼一律用 `useSlidePageNumber()`，不要寫死。

```tsx
import { useSlidePageNumber } from '@open-slide/core';

const Footer = ({ source }: { source?: string }) => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: 140,
        right: 140,
        bottom: 44,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 22,
        color: '#647368',
      }}
    >
      <span>{source ? `資料來源：${source}` : '清新營養 · 2026'}</span>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>
        {current} / {total}
      </span>
    </div>
  );
};
```

### Eyebrow

```tsx
const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      padding: '8px 20px',
      borderRadius: 999,
      background: '#E2F2E7',
      color: '#2E9E5B',
      fontSize: 26,
      fontWeight: 700,
    }}
  >
    {children}
  </div>
);
```

### NutritionTable（營養標示表）

```tsx
const NutritionTable = ({ rows }: { rows: { label: string; value: string; daily?: string }[] }) => (
  <div
    style={{
      background: '#FFFFFF',
      border: '2px solid #1D2A22',
      borderRadius: 16,
      padding: '28px 36px',
      width: 560,
      fontVariantNumeric: 'tabular-nums',
    }}
  >
    <div style={{ fontSize: 34, fontWeight: 900, borderBottom: '6px solid #1D2A22', paddingBottom: 12 }}>
      營養標示
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, color: '#647368', padding: '10px 0' }}>
      <span>每份</span>
      <span>每日參考值</span>
    </div>
    {rows.map((r) => (
      <div
        key={r.label}
        style={{ display: 'flex', justifyContent: 'space-between', fontSize: 28, padding: '12px 0', borderTop: '1px solid #DCE7DE' }}
      >
        <span>
          {r.label} <strong style={{ marginLeft: 12 }}>{r.value}</strong>
        </span>
        <span style={{ color: '#2E9E5B', fontWeight: 700 }}>{r.daily ?? ''}</span>
      </div>
    ))}
  </div>
);
```

### StatCard（大數字卡）

```tsx
const StatCard = ({ value, unit, label, highlight = false }: { value: React.ReactNode; unit: string; label: string; highlight?: boolean }) => (
  <div style={{ background: '#FFFFFF', borderRadius: 24, padding: '40px 44px', boxShadow: '0 1px 0 #DCE7DE, 0 12px 32px -18px rgba(29, 42, 34, 0.25)' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, color: highlight ? '#F28C28' : '#2E9E5B' }}>
      <span style={{ fontSize: 140, fontWeight: 900, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      <span style={{ fontSize: 40, fontWeight: 700 }}>{unit}</span>
    </div>
    <div style={{ fontSize: 30, color: '#1D2A22', marginTop: 20 }}>{label}</div>
  </div>
);
```

## Motion

- Philosophy：**subtle**。動畫只用來把注意力帶到數字上，不搶戲。
- 優先使用 `@open-slide/core/motion`（見 `slide-motion` skill）：標題與產品圖用 `<Reveal effect="rise">`，三張數據卡用 `<Stagger effect="rise">`，大數字用 `<CountUp>`。不要用 `pop`，彈跳感跟「可信」的調性不合。
- 換頁轉場用 `slide-authoring` 的 RISE（6 px 上移）當整份預設。

## Aesthetic

像一家誠實的營養品牌官網：大面積淡綠白、圓潤的膠囊標籤、數字大到一眼就看懂，旁邊永遠有一行小字寫資料來源。產品用去背照片放在淺綠色塊上，周圍留白。參考保健品官網、超市營養標示、運動營養 app。避免：螢光色、大面積漸層、深色模式、誇張療效字眼（「根治」「保證」）、沒有來源的數字、同一頁出現兩個橘色重點。

## Example usage

```tsx
const Cover: Page = () => (
  <div style={{ width: '100%', height: '100%', background: '#F6FAF6', color: '#1D2A22', padding: '100px 140px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
    <Eyebrow>🌿 2026 新品發表</Eyebrow>
    <h1 style={{ fontSize: 128, fontWeight: 900, lineHeight: 1.2, margin: '32px 0 0' }}>每天一包，補足膳食纖維</h1>
    <p style={{ fontSize: 34, color: '#647368', maxWidth: 1100, marginTop: 28 }}>
      一句話說明這份簡報要回答的問題。
    </p>
    <Footer />
  </div>
);
```
