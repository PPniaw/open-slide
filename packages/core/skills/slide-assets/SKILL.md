---
name: slide-assets
description: Use this skill whenever a slide needs a photo, image, illustration, logo or icon, or when the user adds, renames or asks about files in the asset library (素材庫、圖庫、照片庫、放一張照片、換張圖、加 logo). It maintains `assets/INDEX.md`, the catalog that lets you pick the right existing file by meaning instead of guessing from file names, and records where each file came from and whether it may be used publicly.
---

# Asset library (`assets/INDEX.md`)

Global assets live in the project-root `assets/` folder and are imported with the `@assets` alias (see `references/assets.md` in `slide-authoring`). File names rarely say what a picture shows, so this project keeps a catalog next to them: `assets/INDEX.md`. Read it **before** choosing any image, and update it whenever you add one.

## Format

One row per file, path relative to `assets/`:

```md
# Asset index

| File | What it shows | Tags | Source / license |
| --- | --- | --- | --- |
| photos/team-offsite-2026.jpg | Twelve people on a rooftop at sunset, casual, smiling | team, people, outdoor, warm | Own photo — internal use |
| logos/acme.svg | Acme wordmark, black on transparent | logo, brand | Acme brand kit — OK with permission |
| photos/city-night.jpg | Taipei skyline at night, long exposure | city, night, cover, blue | Unsplash (@author) — free, credit appreciated |
```

- **What it shows** — one plain sentence a reader could check against the picture: subjects, setting, mood, dominant colours.
- **Tags** — 3–6 lowercase words used for matching ("cover", "people", "product", "dark", "warm").
- **Source / license** — where it came from and what that allows. Use `unknown` if nobody knows. Never invent a license.

## Picking an image

1. Read `assets/INDEX.md` and match the slide's need against **What it shows** and **Tags**.
2. If there's a good match, import it: `import photo from '@assets/photos/team-offsite-2026.jpg';`
3. If the deck will be shared publicly (deployed, exported for an external audience, or the user says so), skip rows whose license is `unknown` or internal-only, and tell the user which one you skipped and why.
4. If nothing fits, don't stretch a poor match. Use `<ImagePlaceholder>` (see `slide-authoring`) and tell the user what kind of picture would fit. They can drop one into the Assets panel (dev UI → Assets), which also searches brand logos (svgl) and Google Fonts.

Deck-specific images that no other deck will use still go in `slides/<id>/assets/` and don't need an index row.

## Keeping the index current

- **Adding a file** (the user drops one in, or you download a logo or font through the Assets panel): add its row in the same turn. If you can view the image, write **What it shows** yourself from what you see; ask the user only for **Source / license**.
- **Missing index**: if `assets/INDEX.md` doesn't exist, create it. List every image under `assets/`, view each to describe it, and mark sources `unknown` for the user to fill in.
- **Files without a row**: when you notice one, view it, add the row, and mention it.
- **Removed or renamed files**: fix or delete the row so the index never points at a missing file.
