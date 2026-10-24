---
name: 溫暖居家
description: 生活用品電商簡報——燕麥米色底、陶土橘主色、鼠尾草綠輔色，宋體標題配柔和陰影的商品卡，價格與促銷標籤一眼就看到。
mode: light
---

# 溫暖居家

給生活用品、家居雜貨、廚房用品、寢具、選品電商用的主題。核心是「有生活感、讓人想買」：溫暖的米色與木質調、商品卡片整齊排列、價格清楚，促銷紅只用在真正的優惠上。

## Palette

| 角色 | 色碼 | 用途 |
| --- | --- | --- |
| bg | `#F6F1EA` | 頁面背景（燕麥米） |
| surface | `#FFFDF9` | 商品卡、資訊卡底色 |
| text | `#2E2620` | 主要文字（深咖） |
| muted | `#8A7D70` | 次要文字、規格、註腳 |
| accent | `#C8643B` | 主色：標題重點、按鈕、價格（陶土橘） |
| sage | `#6E8B6A` | 輔色：分類標籤、圖示（鼠尾草綠） |
| sale | `#D9483B` | 促銷標籤專用——一頁最多一個 |
| wood | `#E9DCCB` | 商品圖底色、分區色塊 |
| rule | `#E7DDD0` | 分隔線 |

## Typography

- Display font: `"Noto Serif TC", "Songti TC", "PMingLiU", serif`——標題 700、大標 900。
- Body font: `"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", system-ui, sans-serif`——內文 400、價格 700。
- 價格與數字用 `font-variant-numeric: tabular-nums`。
- Webfont import: `https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@700;900&family=Noto+Sans+TC:wght@400;500;700&display=swap`——依 `slide-authoring` 的 `references/webfonts.md` 在模組頂層注入一次。
- Type-scale overrides：
  - Hero title：120 px（宋體）
  - 頁標題：68 px（宋體）
  - Body text：32 px，行高 1.6
  - 商品名：32 px；價格：40 px，字重 700
  - 註腳：22 px

## Layout

- 內容邊距：上下 96 px、左右 128 px（1920 × 1080）。
- 商品頁用 3 或 4 欄卡片網格，間距 36 px，卡片圓角 24 px。
- 封面與情境頁可以左右各半：一邊大圖（生活情境照），一邊標題。
- 底部 72 px 留給 Footer。

## Fixed components

這些可以直接貼進使用此主題的簡報。商品圖在真實簡報裡放去背或情境照片（`slide-assets` skill 會從 `assets/INDEX.md` 挑），沒有照片時用 `<ImagePlaceholder>`。

### Title

```tsx
const Title = ({ children }: { children: React.ReactNode }) => (
  <h1
    style={{
      fontFamily: '"Noto Serif TC", "Songti TC", "PMingLiU", serif',
      fontSize: 68,
      fontWeight: 700,
      lineHeight: 1.3,
      margin: 0,
      color: '#2E2620',
    }}
  >
    {children}
  </h1>
);
```

### Footer

```tsx
import { useSlidePageNumber } from '@open-slide/core';

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: 128,
        right: 128,
        bottom: 40,
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 22,
        color: '#8A7D70',
        borderTop: '1px solid #E7DDD0',
        paddingTop: 16,
      }}
    >
      <span>溫暖居家選物 · 2026 春季</span>
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
  <div style={{ fontSize: 26, fontWeight: 700, color: '#6E8B6A', letterSpacing: '0.12em' }}>
    {children}
  </div>
);
```

### ProductCard（商品卡）

```tsx
const ProductCard = ({
  image,
  name,
  spec,
  price,
  was,
  sale,
}: {
  image: React.ReactNode;
  name: string;
  spec: string;
  price: number;
  was?: number;
  sale?: string;
}) => (
  <div style={{ background: '#FFFDF9', borderRadius: 24, overflow: 'hidden', boxShadow: '0 1px 0 #E7DDD0, 0 18px 40px -24px rgba(46, 38, 32, 0.35)', position: 'relative' }}>
    <div style={{ height: 300, background: '#E9DCCB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{image}</div>
    {sale && (
      <div style={{ position: 'absolute', top: 20, left: 20, background: '#D9483B', color: '#FFFFFF', fontSize: 22, fontWeight: 700, padding: '6px 16px', borderRadius: 999 }}>
        {sale}
      </div>
    )}
    <div style={{ padding: '24px 28px 28px' }}>
      <div style={{ fontSize: 32, fontWeight: 700 }}>{name}</div>
      <div style={{ fontSize: 22, color: '#8A7D70', marginTop: 6 }}>{spec}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 16, fontVariantNumeric: 'tabular-nums' }}>
        <span style={{ fontSize: 40, fontWeight: 700, color: '#C8643B' }}>NT$ {price.toLocaleString('en-US')}</span>
        {was && <span style={{ fontSize: 24, color: '#8A7D70', textDecoration: 'line-through' }}>NT$ {was.toLocaleString('en-US')}</span>}
      </div>
    </div>
  </div>
);
```

## Motion

- Philosophy：**subtle**。像商品慢慢上架，不要彈跳。
- 優先使用 `@open-slide/core/motion`（見 `slide-motion` skill）：商品卡網格用 `<Stagger effect="rise" interval={0.08}>`，銷售數字用 `<CountUp grouping>`，熱銷排行用 `<LayoutList>`。
- 換頁轉場用 `slide-authoring` 的 DISSOLVE 或 RISE。

## Aesthetic

像一本溫暖的居家選物型錄：燕麥米底、木頭與亞麻的色調、宋體標題帶點雜誌感，商品卡有柔和陰影和大圓角，照片是自然光下的生活情境。價格永遠清楚，促銷紅只出現在真的有優惠的地方。參考無印良品、日系選物店、北歐家居電商。避免：螢光色、冷藍色主調、玻璃擬態、生硬的黑色粗框、一頁超過一個促銷標籤、整頁都是大寫英文。

## Example usage

```tsx
const Cover: Page = () => (
  <div style={{ width: '100%', height: '100%', background: '#F6F1EA', color: '#2E2620', padding: '96px 128px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
    <Eyebrow>SPRING EDIT · 春季選物</Eyebrow>
    <h1 style={{ fontFamily: '"Noto Serif TC", "Songti TC", serif', fontSize: 120, fontWeight: 900, lineHeight: 1.2, margin: '28px 0 0' }}>讓家，慢一點</h1>
    <p style={{ fontSize: 32, color: '#8A7D70', marginTop: 24 }}>一句話說明這季的主題或檔期。</p>
    <Footer />
  </div>
);
```
