---
name: slide-motion
description: 使用者要在簡報或選取的元素上加頁內動畫時使用——彈出、淡入、升起、滑入、模糊淡入、逐項彈入、依序出現、數字跳動、數字滾動、版面重排、排名變化，或直接說出型錄裡的效果名稱（Reveal、Stagger、CountUp、LayoutList）。`@slide-comment` 寫著「套用動畫」或 "apply motion" 時也用這個 skill。Use this skill for any in-page animation request — spring entrances, items appearing one after another, numbers counting up, rows re-ordering. 涵蓋 `@open-slide/core/motion` 的現成元件、各自適合的元素、觸發方式，以及讓縮圖與 PPTX/PDF 匯出保持正確的規則。換頁轉場不屬於這個 skill，請看 `slide-authoring` 的 `SlideTransition`。
---

# 簡報動畫型錄

`@open-slide/core/motion` 提供一組以彈簧物理為基礎的動畫元件。在簡報裡用動畫**只能透過它們**：從 `@open-slide/core/motion` 匯入，不要直接匯入 `motion` 或 `motion/react`，也不要自己用 `useEffect` 加 inline style 重做一套。「只能用 `react` 與 `@open-slide/core`」這條硬規則依然成立——這些元件就是 `@open-slide/core` 的一部分。

每個元件都已經處理好容易出錯的地方：

- **只在觀眾正在看的那一份播放。** 縮圖、總覽、講者預覽、PPTX/PDF 匯出都直接畫出最終狀態，不播動畫。
- **放在 `<Step>` 裡時，等那一步揭露才播**，而不是頁面一載入就播。（`<Step>` 會讓子元素一直掛著、只做淡入，一般的掛載動畫會在還看不見的時候就播完。）
- 系統設定 `prefers-reduced-motion: reduce`（減少動態效果）時，直接顯示最終狀態。

## 型錄

| 效果（說這些都可以） | 元件 | 包在什麼外面 | 主要參數 |
| --- | --- | --- | --- |
| **Reveal**：彈出／淡入／升起／滑入／模糊淡入 | `<Reveal effect="pop">` | 單一元素：標題、圖片、卡片 | `effect`：`fade` 淡入・`rise` 升起（預設）・`pop` 彈出・`slide` 滑入・`blur` 模糊淡入；`delay`（秒） |
| **Stagger**：逐項彈入／依序出現 | `<Stagger effect="rise">` | 一組並列的元素：條列、卡片、logo | `effect`、`interval`（每項間隔秒數，預設 `0.11`）、`itemStyle` |
| **CountUp**：數字跳動／數字滾動 | `<CountUp to={36} />` | 單一數字（取代原本寫死的數字） | `to`、`from`、`decimals`、`prefix`、`suffix`、`grouping`（千分位）、`duration`（秒） |
| **LayoutList**：版面重排／排名變化 | `<LayoutList items revealedItems getKey renderItem trigger>` | 名次或順序會改變的清單、表格列 | `items`（揭露前）、`revealedItems`（揭露後）、`trigger` |

```tsx
import { Step, Steps } from '@open-slide/core';
import { CountUp, LayoutList, Reveal, Stagger } from '@open-slide/core/motion';
```

## 什麼時候播？

三種觸發方式選一種。只有在使用者的要求看不出來時才問（說「按一下才出現」就是點擊觸發；其他情況預設進頁就播）。

1. **進頁就播**：外面不包 `<Step>`，頁面出現時就播。
   ```tsx
   <Reveal effect="pop"><h1 style={TITLE}>第三季成果</h1></Reveal>
   ```
2. **按一下才播**：包在 `<Steps>` 裡的 `<Step>` 中，那一步揭露時才播。
   ```tsx
   <Steps>
     <Step>
       <Stagger effect="slide" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
         <Row>…</Row>
         <Row>…</Row>
         <Row>…</Row>
       </Stagger>
     </Step>
   </Steps>
   ```
3. **按一下才播，但播之前也要看得到**：用在動畫前就必須在畫面上的內容（會重新排序的清單、會改變的數字）。在某個 `<Step>` 裡放一個帶 `data-reveal="<名稱>"` 的小標記，再把同一個名稱傳給 `trigger`。
   ```tsx
   <Steps>
     <Step><span data-reveal="after">→ 改用 agent 之後</span></Step>
   </Steps>
   <LayoutList
     trigger="after"
     items={before}
     revealedItems={after}
     getKey={(row) => row.id}
     renderItem={(row, i) => <RankRow rank={i + 1} {...row} />}
   />
   ```

## 規則

- **簡報的第一頁不要放「按一下才播」的動畫。** 開始簡報時，第一頁算是「直接跳進來」，直接跳進來的頁面會把所有 `<Step>` 都先展開，點擊永遠不會發生。前面放一張封面或標題頁。「進頁就播」放在第一頁沒問題。
- **一個元素只用一個動畫元件。** 不要在 `<Stagger>` 的項目裡再包 `<Reveal>`，也不要把 `<CountUp>` 包進 `<Reveal>`——只留外層那個。
- **不要包在 `MorphElement` 那個節點外面。** 動畫會改 `transform`，而 morph 要求 morph 節點本身不能有 transform（見 `slide-authoring` 的 `references/morph.md`）。改包它的父層。
- **最終畫面必須完整。** PPTX/PDF 匯出和縮圖只會看到最後一格，所以全部顯示時頁面就要能讀懂。動畫是強調，不能承載資訊。
- **節制。** 一頁一到兩組動畫就夠。整份簡報都在彈來彈去只會變成噪音。如果簡報的主題有 Motion 段落，跟著它的風格走：沉穩的主題用 `fade`／`rise`，活潑的主題才用 `pop` 和 Stagger。
- **版面和尺寸留在你自己的元素上。** 元件只負責動畫。flex/grid 版面放在 `style`（Reveal、Stagger、LayoutList）或 `itemStyle`（Stagger 的每個子項），字體樣式留在子元素上。

## 套用到選取的元素

使用者選取了某個元素（見 `current-slide` skill），或留言寫「套用動畫：逐項彈入」時：

1. 把要求對應到型錄的一列。不明確時，挑「包在什麼外面」跟這個元素最吻合的那一列，並告訴使用者你選了哪一個。
2. 把元素的 JSX 包起來，不要改它的樣式。CountUp 是取代寫死的數字，前後的文字改用 `prefix`／`suffix`。
3. 使用者說「按一下」或 "on click" 時，外面加 `<Steps><Step>…</Step></Steps>`（或照文件順序併入既有的 `<Steps>`）。
4. 加上 `@open-slide/core/motion` 的 import，並像 `apply-comments` 一樣移除已處理的 `@slide-comment` 標記。
5. 用 `slide-authoring` 裡的單頁預覽路由自我檢查。預覽畫的是最終狀態，所以在那裡確認版面就好；動畫本身請使用者按 `Enter`（簡報模式）再按 `→` 觀看。
