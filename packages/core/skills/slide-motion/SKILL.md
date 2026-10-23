---
name: slide-motion
description: Use this skill whenever the user asks for an in-page animation effect on a slide or on a selected element — spring entrances, items appearing one after another, numbers counting up, rows re-ordering — or names one of the catalog effects (Reveal, Stagger, CountUp, LayoutList; 彈出、淡入、升起、滑入、模糊淡入、逐項彈入、依序出現、數字跳動、數字滾動、版面重排、排名變化、動畫). Also use it when a `@slide-comment` asks to "套用動畫" / "apply motion". Covers the ready-made components in `@open-slide/core/motion`, when each fits, how they trigger, and the rules that keep thumbnails and PPTX/PDF exports correct. Page-to-page transitions are NOT this skill — those are `SlideTransition` in `slide-authoring`.
---

# Slide motion catalog

`@open-slide/core/motion` ships a small set of spring-based animation components. They are the **only** way to use motion in a slide: import from `@open-slide/core/motion`, never from `motion` or `motion/react` directly, and don't hand-roll a replacement with `useEffect` + inline styles. The hard rule "only `react` and `@open-slide/core`" still holds — this is part of `@open-slide/core`.

Every component already handles the parts that are easy to get wrong:

- It plays **only for the instance the audience is watching**. Thumbnails, the overview, presenter previews and PPTX/PDF exports render the final state, with no animation.
- Inside a `<Step>`, it plays **when that step is revealed**, not when the page mounts. (`<Step>` keeps its children mounted and only fades them in, so plain mount-time animations would finish while still invisible.)
- `prefers-reduced-motion: reduce` renders the final state immediately.

## Catalog

| Effect (say any of these) | Component | Wrap it around | Key props |
| --- | --- | --- | --- |
| **Reveal** — 彈出 / 淡入 / 升起 / 滑入 / 模糊淡入 | `<Reveal effect="pop">` | one element: a heading, an image, a card | `effect`: `fade` · `rise` (default) · `pop` · `slide` · `blur`; `delay` (s) |
| **Stagger** — 逐項彈入 / 依序出現 | `<Stagger effect="rise">` | a group of siblings: bullets, cards, logos | `effect`, `interval` (s between items, default `0.11`), `itemStyle` |
| **CountUp** — 數字跳動 / 數字滾動 | `<CountUp to={36} />` | a single number (replaces the literal) | `to`, `from`, `decimals`, `prefix`, `suffix`, `grouping`, `duration` (s) |
| **LayoutList** — 版面重排 / 排名變化 | `<LayoutList items revealedItems getKey renderItem trigger>` | a ranked list or table rows whose order changes | `items` (before), `revealedItems` (after), `trigger` |

```tsx
import { Step, Steps } from '@open-slide/core';
import { CountUp, LayoutList, Reveal, Stagger } from '@open-slide/core/motion';
```

## When does it play?

Pick one of three triggers. Ask the user only if the request doesn't make it obvious ("按一下才出現" → click; otherwise default to page entry).

1. **On page entry** — no `<Step>` around it. Plays as the page appears.
   ```tsx
   <Reveal effect="pop"><h1 style={TITLE}>Q3 results</h1></Reveal>
   ```
2. **On click** — wrap in `<Step>` inside `<Steps>`. Plays when that step is revealed.
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
3. **On click, but stay visible before it** — for content that must be on screen *before* it animates (a list that re-orders, a number that changes). Put a small marker with `data-reveal="<name>"` inside a `<Step>` and pass the same name as `trigger`.
   ```tsx
   <Steps>
     <Step><span data-reveal="after">→ After switching to agents</span></Step>
   </Steps>
   <LayoutList
     trigger="after"
     items={before}
     revealedItems={after}
     getKey={(row) => row.id}
     renderItem={(row, i) => <RankRow rank={i + 1} {...row} />}
   />
   ```

## Rules

- **Never animate on the first page of a deck with a step trigger.** Starting a presentation lands on page 1 as a *jump*, and jumps render every `<Step>` already revealed, so the click never happens. Put a cover or title page first. Page-entry triggers are fine on page 1.
- **One motion component per element.** Don't nest `<Reveal>` inside `<Stagger>` items or wrap a `<CountUp>` in a `<Reveal>` — use the outer one only.
- **Never wrap a `MorphElement` node.** Motion animates `transform`, and morphs require no transform on the morph node (see `references/morph.md` in `slide-authoring`). Wrap a parent instead.
- **Keep the final state complete.** PPTX/PDF exports and thumbnails show only the end frame, so the page must read correctly with everything shown. Motion adds emphasis; it must not carry information.
- **Restraint.** One or two animated groups per page. A deck where everything bounces reads as noise. If the deck's theme has a Motion section, match its philosophy: `fade`/`rise` for calm themes, `pop` and Stagger for playful ones.
- **Layout and sizing stay on your elements.** The components only add motion. Put flex/grid layout on `style` (Reveal, Stagger, LayoutList) or `itemStyle` (each Stagger child), and keep typography on the children.

## Applying an effect to a selected element

When the user selects an element (see the `current-slide` skill) or leaves a comment such as "套用動畫：逐項彈入":

1. Map the request to a catalog row. If it's ambiguous, choose the row whose "Wrap it around" matches the element, and say which one you picked.
2. Wrap the element's JSX — don't restyle it. For CountUp, replace the numeric literal and keep its surrounding `prefix`/`suffix` text.
3. If the user said "按一下" / "on click", add `<Steps><Step>…</Step></Steps>` around it (or extend an existing `<Steps>` block in document order).
4. Add the `@open-slide/core/motion` import and remove the resolved `@slide-comment` marker, as `apply-comments` does.
5. Self-check in the single-page preview route from `slide-authoring`. It renders the final state, so confirm the layout there and tell the user to press `Enter` (present mode) and `→` to see the animation itself.
