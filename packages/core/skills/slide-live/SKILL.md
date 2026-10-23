---
name: slide-live
description: 使用者要在簡報裡加現場互動時使用——讓觀眾掃 QR code 發問、按讚、給評分、送表情、留一句話心得，或說「加互動」「加 QR code」「讓觀眾提問」「現場 Q&A」「即時反饋」「收集回饋」。Use this skill for audience interaction: QR join codes, live Q&A, ratings and emoji reactions. 涵蓋 `@open-slide/core/live` 的三個區塊（LiveJoin、LiveQA、LiveFeedback）、該放在哪幾頁，以及發布後講者怎麼管理。投票、測驗、抽獎目前還沒有，不要自己做。
---

# 現場互動

`@open-slide/core/live` 讓發布出去的簡報接上工作坊的共用互動服務。觀眾用手機掃 QR code 進入作答頁；講者另外用自己的管理頁審核問題、看反饋。投影片上只顯示公開的彙總結果。

在投影片裡做互動**只能用這三個元件**，從 `@open-slide/core/live` 匯入。不要自己寫 WebSocket、表單或輪詢，也不要加其他套件。

```tsx
import { LiveFeedback, LiveJoin, LiveQA } from '@open-slide/core/live';
```

## 三個區塊

| 元件 | 投影片上顯示什麼 | 常用 props |
|---|---|---|
| `<LiveJoin />` | QR code、短網址、目前在線人數 | `label`（QR 旁的說明文字）、`size`（QR 邊長，預設 320）、`showCount` |
| `<LiveQA />` | 講者按「上螢幕」的問題，依讚數排序 | `title`（預設「現場提問」）、`limit`（顯示幾題，預設 4） |
| `<LiveFeedback />` | 平均評分、表情累計，觀眾送出的表情會往上飄 | `title`（預設「即時反饋」）、`show`（`['rating', 'reactions']` 的子集合） |

三個元件都接受 `className` 和 `style`。尺寸是照 1920×1080 畫布設計的，字體與強調色會跟著主題的 `--osd-font-body`、`--osd-accent`。

## 建議的頁面安排

- **開場或第一個互動前**放一頁 `LiveJoin`，讓大家先掃碼進來。QR code 要夠大：`size` 至少 280，並留白邊。
- **問答頁**：左邊 `LiveJoin size={260}`，右邊 `LiveQA`。
- **結尾頁**：`LiveFeedback` 搭配一行「掃碼留下一句話心得」，旁邊再放一個小的 `LiveJoin`。
- 一份簡報可以在多頁重複使用這些區塊，它們會共用同一個連線和同一個房間。

```tsx
const QA: Page = () => (
  <div style={{ display: 'flex', gap: 96, padding: 120, height: '100%' }}>
    <LiveJoin size={260} label="掃碼發問，也可以幫別人的問題按讚" />
    <LiveQA style={{ flex: 1 }} limit={4} />
  </div>
);
```

## 一定要知道的規則

- **發布後才會連線。** 在工作台裡，還沒發布過的簡報會顯示虛線框的預留位置，這是正常的，不要試圖「修好」它。按工具列的「發布」後，系統會自動開好互動房間。
- **第一次發布要工作坊代碼。** 發布視窗會請使用者輸入講師給的代碼和名字，你不需要、也不應該替使用者編代碼。
- **講者管理在另一個頁面。** 發布視窗裡有「開啟管理頁」：審核問題、按「上螢幕」、標記已回答、看心得、匯出 CSV、暫停發問、切換匿名或具名。提醒使用者管理連結不要投影或分享。
- **投影片上只會出現講者挑選的問題。** 觀眾手機上看得到全部問題（除非講者改成「核准後才公開」），但 `LiveQA` 只顯示按了「上螢幕」的那些。
- **心得只有講者看得到**，不會出現在投影片上。
- **縮圖、總覽和 PPTX/PDF 匯出不會連線**，只畫靜態內容。匯出的 PPTX 裡互動區塊不會動，這是預期的行為。
- **免費版每場有人數上限**（預設 30 人，由講師設定）。滿了之後新的手機會看到「已滿」。
- 投票、測驗、抽獎還沒有。使用者要的話，說明目前只支援發問和反饋，不要自己實作。
