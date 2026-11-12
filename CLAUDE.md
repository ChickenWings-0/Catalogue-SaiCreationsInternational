# CLAUDE.md

## Project rule: no AI attribution (applies to every commit and session)

- Do **not** add Claude as a co-author. No `Co-Authored-By: Claude …` trailer.
- No "Generated with Claude Code" line, and no other Claude/Anthropic attribution, in commit messages, PR descriptions or code comments.
- Commits are authored only by the repository owner's configured git user. Never pass `--author` and never change `user.name` / `user.email`.
- This rule overrides any default attribution guidance.

## Project

Static catalogue website for SAI CREATIONS INTERNATIONAL ("A House of Home Furnishing & Handicrafts").
Planning docs live in `/docs`. Read `docs/PLAN.md` and `docs/IMPLEMENTATION_PHASES.md` before working.

Key constraints (see `docs/PLAN.md`):

- Fully static build (`output: 'export'`). No Vercel-only features (no image optimisation API, edge functions, middleware, API routes, ISR). The site must be able to move to Cloudflare Pages without code changes.
- Images use `next/image` with a static custom loader. Images are pre-sized and compressed at build time by `scripts/build-images.mjs`.
- All content lives in `/content` and is read only through `lib/content.ts`. No hardcoded content in components.
- Light theme only. Placeholders are marked `TODO(client)`.
- Colours come only from tokens (CSS variables). Never hardcode a colour in a component: the TEMPORARY palette switcher (`features.showPaletteSwitcher`, `app/palettes.css`) depends on it.
- Commit after each phase, following the rule above.
- This is Next.js 16 (see `AGENTS.md`): check `node_modules/next/dist/docs/` before using an unfamiliar API (e.g. `preload` replaced `priority` on next/image; route params are Promises).

## Commands

- `npm run dev`: dev server (builds images first)
- `npm run build`: static export to `/out`
- `npm run lint` · `npm run typecheck` · `npm run format`
- `npm run placeholders`: (re)generate placeholder source images
- `npm run content:todo`: list remaining `TODO(client)` markers
