# Hero shots

A ~54 s product film of open-slide's core features, shot with the `cinematic-shot` skill (`.claude/skills/cinematic-shot`): steep, oblique close-ups of the real UI floating in black, a thin focal plane, slow motivated drift, hard cuts, then one line of copy and a still logo.

## Shot list

| # | Cut | Len | Subject in focus | Scale | Roll | Action |
|---|---|---|---|---|---|---|
| 1 | 0.0 | 3.0 | Sidebar `Slides` nav item | macro 4× | −12° | Highlight moves from Themes to Slides |
| 2 | 3.0 | 5.5 | Home deck grid | medium 2.1× | +12° | Deck thumbnails resolve row by row, camera tracks along the row |
| 3 | 8.5 | 2.5 | `Agent connected` badge | extreme macro 6× | −16° | Badge flips from disconnected (rose) to connected (emerald) |
| 4 | 11.0 | 6.0 | Thumbnail rail | medium 2.3× | +12° | Pages 02–07 are written in one after another; camera follows down |
| 5 | 17.0 | 2.5 | Comment tool in the toolbar | extreme macro 6.2× | −17° | Comment mode is selected |
| 6 | 19.5 | 7.5 | Comment composer on `SPRING 2027` | macro 3× | +14° | Note typed at 12.5 cps, posted; focus racks to the pin |
| 7 | 27.0 | 2.5 | `/apply-comments` hint | extreme macro 5.5× | −15° | Footer hint switches to “1 comment · Run /apply-comments” |
| 8 | 29.5 | 2.5 | Design tokens › Accent hex | macro 3.3× | +13° | Accent hex selected and retyped |
| 9 | **32.0** | 7.0 | Whole editor (**only wide shot**) | 0.95× | 0° | **Payoff:** accent re-themes the canvas and every thumbnail live, then the background follows |
| 10 | 39.0 | 5.0 | Presenter speaker notes | macro 3× | −12° | Next page: notes resolve line by line, timer ticks |
| — | 44.0 | 4.8 | Black | — | — | `open-slide — slides your agent writes.` |
| — | 48.8 | 4.8 | Black | — | — | Still logo |

## Pipeline

Every frame is a pure function of time.

1. `capture.mjs` drives the real app (`apps/demo`, dev server on `:5173`) with Playwright and screenshots each UI state at the magnification it will be filmed at (DPR 2–6, clipped to the region the camera sees). It works on a throwaway copy of `aero-3-launch` (`hero-aero`) and deletes it at the end.
2. `outro.mjs` renders the copy line and the logo layers in Geist.
3. `film.py` is the camera: a CSS-style perspective transform (pitch → yaw → roll), optical depth of field from per-pixel plane depth, a neutral light pool that follows the focal point, 4-sample motion blur, and the stipple/fade reveals between captured states.
4. `foley.py` synthesises the soundtrack: key ticks, clicks, whooshes and a granular hiss over room tone. No music.
5. `render.sh` renders segments in parallel, adds film grain, and muxes the audio into `out/open-slide-hero-shots.mp4`.

```bash
pip install numpy opencv-python-headless
pnpm core build && (cd apps/demo && pnpm dev --port 5173) &
node scripts/hero-shots/capture.mjs     # optionally pass shot names, e.g. s06-comment
node scripts/hero-shots/outro.mjs
python3 scripts/hero-shots/film.py still stills 22.5 34   # frame grabs at given seconds
scripts/hero-shots/render.sh
```

Shot timings in `foley.py` mirror the shot list above; update both together.
