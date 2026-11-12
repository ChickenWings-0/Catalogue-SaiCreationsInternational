# SAI CREATIONS INTERNATIONAL: Catalogue Website

A static catalogue website for SAI Creations International, _"A House of Home Furnishing & Handicrafts"_.
Built with Next.js (App Router, static export), TypeScript and Tailwind CSS.

Planning and specs are in [`/docs`](./docs): start with [`PLAN.md`](./docs/PLAN.md).

## Requirements

- Node.js 22.12+ (24 recommended, see `.nvmrc`)
- npm

## Getting started

```bash
npm install
npm run dev          # builds image variants, then starts http://localhost:3000
```

## Scripts

| Script                                            | What it does                                                                                              |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `npm run dev`                                     | Development server (runs `images` first)                                                                  |
| `npm run build`                                   | Static export to `/out` (runs `images` first and `verify:export` after)                                   |
| `npm run preview`                                 | Serves `/out` with a plain static server on http://localhost:3000                                         |
| `npm run images`                                  | Resizes originals in `assets/images/` + `public/brand/` into WebP variants in `public/img/` (incremental) |
| `npm run placeholders`                            | Creates any missing placeholder originals (`--force` regenerates the placeholder set)                     |
| `npm run content:todo`                            | Lists every `TODO(client)` marker and placeholder image still in `/content`                               |
| `npm run lint` · `typecheck` · `format` · `check` | Code quality                                                                                              |
| `npm run verify:export`                           | Checks that every local URL in `/out` resolves to a file                                                  |

## How content works

- All text, links, products and image references live in **`/content`** (typed TypeScript files).
  Components read them only through **`lib/content.ts`**.
- Every external link, contact detail and social URL is in **`content/site.ts`**.
- Placeholders are marked `// TODO(client):`. Run `npm run content:todo` to see what's left.

## Images

- Put original images in **`assets/images/`** (e.g. `assets/images/products/sci-hd-001-1.jpg`) and reference them
  in content as `src: "products/sci-hd-001-1.jpg"` with an `alt` text. Width/height are read automatically.
- The logo lives at `public/brand/logo.png` (referenced as `brand/logo.png`).
- `npm run images` (automatic before dev/build) writes resized WebP files to `public/img/`. Don't edit or commit that folder.
- There's no runtime image service, so the site is a plain static export that runs on any static host.

## Hosting

Static export (`output: 'export'`) on Vercel, portable to Cloudflare Pages without code changes.
See [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md).
