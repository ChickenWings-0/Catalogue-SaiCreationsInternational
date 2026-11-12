# SAI CREATIONS INTERNATIONAL — Catalogue Website: Plan

> Status: **Approved 2026-11-12.** Phases 0–1 in progress.
> Last updated: 2026-11-12

Related docs: [SITEMAP](./SITEMAP.md) · [DESIGN_SYSTEM](./DESIGN_SYSTEM.md) · [CONTENT_MODEL](./CONTENT_MODEL.md) · [COMPONENTS](./COMPONENTS.md) · [STUDIO_INTERACTION_SPEC](./STUDIO_INTERACTION_SPEC.md) · [IMPLEMENTATION_PHASES](./IMPLEMENTATION_PHASES.md) · [DEPLOYMENT](./DEPLOYMENT.md) · [CONTENT_TODO](./CONTENT_TODO.md)

---

## 1. Overview

A static, premium-feeling catalogue website for **SAI CREATIONS INTERNATIONAL** — *"A House of Home Furnishing & Handicrafts"*. The site shows products by category and sends interested visitors to the company's own channels (WhatsApp, Instagram, other socials, Google Form). There is no cart, no prices, no login and no backend.

Visual direction: calm, editorial and light, inspired by the layout rhythm of rh.com (full-bleed imagery, lots of whitespace, letter-spaced uppercase labels, slow transitions). **No RH assets, copy, logo or proprietary fonts are used.** Light theme only, with no dark mode.

## 2. Goals

| # | Goal | Measure |
|---|---|---|
| G1 | Present the catalogue beautifully and clearly | 4 categories, product detail pages, editorial layout matching the design system |
| G2 | Turn interest into enquiries | Every product page has WhatsApp + Instagram enquiry buttons; site-wide contact links; Google Form link |
| G3 | Signature brand moment | `/studio` scroll sequence: video → fullscreen → dead zone → photo carousel |
| G4 | Client can edit content later | All content in `/content` behind `/lib/content.ts`; CMS can replace the data source without component changes |
| G5 | Quality | Lighthouse ≥ 90 in all four categories; WCAG 2.1 AA; mobile-first; SEO basics complete |
| G6 | Easy hand-off of real content | Every placeholder is tagged `TODO(client)` and listed in `CONTENT_TODO.md` |

### Non-goals (v1)
E-commerce, prices, cart/checkout, user accounts, on-site form submission, multi-language, dark mode, blog.

## 3. Tech stack (recommended)

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router, latest stable) + TypeScript** | Pages are statically generated (SSG via `generateStaticParams`). Gives `next/image`, `next/font`, the Metadata API, `sitemap.ts`/`robots.ts` and great Vercel support. It also has a clear path to ISR/on-demand revalidation once a CMS is added. |
| Rendering | **Fully static export: `output: 'export'`, `trailingSlash: true`** | The build emits plain HTML/CSS/JS in `/out`, which any static host can serve. There's no server runtime, so we avoid Vercel-only features: **no image optimisation API, edge functions, middleware, API routes or ISR**. `trailingSlash: true` emits `page/index.html` for every route, which is the most portable layout across Vercel, Cloudflare Pages, Netlify and S3. |
| Images | **`next/image` + a static custom loader + build-time sharp pipeline** | `scripts/build-images.mjs` (sharp) resizes originals from `/assets/images/` into fixed WebP widths in `/public/img/` and writes a manifest of intrinsic sizes. `lib/image-loader.ts` maps each `next/image` srcset width to its pre-built file. We keep responsive `srcset`, lazy loading and no CLS, with zero runtime image service. |
| Styling | **Tailwind CSS v4** (CSS-first `@theme` tokens) | Design tokens live in one CSS file and map 1:1 to `DESIGN_SYSTEM.md`. Small production CSS. |
| Scroll animation | **GSAP + ScrollTrigger** | Best-in-class `pin` + `scrub`, a timeline with labels (which makes the dead zone trivial), `matchMedia()` for responsive/reduced-motion branches, and mature iOS handling. GSAP, including all plugins, is free for commercial use. Framer Motion's `useScroll` can do scrubbing but has no built-in pinning, and pin-spacing by hand is fragile on iOS. |
| Micro-interactions | CSS transitions (+ GSAP where needed) | Hover, drawer slide and dot widths are plain CSS. No second animation library. |
| Carousel | **Embla Carousel** (`embla-carousel-react` + `embla-carousel-autoplay`) | Headless, ~7 kB, native-feeling swipe/drag, loop, `scrollTo` API for dots. Used for the Studio carousel, home hero slideshow and product gallery. |
| Dialog / Sidebar | **Radix UI Dialog** (`@radix-ui/react-dialog`) | Focus trap, Esc to close, overlay click, scroll lock, `aria-expanded`/`aria-controls` on the trigger, and portal. All are battle-tested. We style it ourselves. |
| FAQ accordion | Native `<details>/<summary>` (exclusive via `name`) | Zero JS, accessible, content is in the HTML for SEO. Animated as progressive enhancement. |
| Icons | **lucide-react** (UI) + **react-icons/fa6** (brand icons) | Lucide has no brand icons. `simple-icons` no longer ships LinkedIn, so Font Awesome 6 brands (via react-icons) gives one consistent set: Instagram, X, LinkedIn, Pinterest and WhatsApp. |
| Content validation | **Zod** | Content files are parsed at build time. A typo in a product (missing image, wrong category) fails the build with a clear message instead of shipping a broken page. This matters once the client edits content. |
| Utilities | `clsx` + `tailwind-merge` (`cn()`) | Class composition. |
| Quality | ESLint (next config + jsx-a11y), Prettier (+ tailwind plugin), TypeScript `strict` | Required by brief. |
| Testing (light) | Playwright smoke tests + `@axe-core/playwright` | Catches route regressions and a11y violations. Lighthouse CI is optional. |
| Hosting | **Vercel Hobby** + client's custom domain (bare domain primary, `www` → apex) | Traffic is expected to be under 100 visitors/month. Because the output is static, the site can move to **Cloudflare Pages with no code changes**. See [DEPLOYMENT.md](./DEPLOYMENT.md). |
| Analytics (Phase 5) | **Cloudflare Web Analytics** | Free, cookieless (no consent banner) and host-independent: a single beacon script with a token from `content/site.ts`. |
| CMS (later, Phase 7) | **Sanity** (recommended); TinaCMS is the runner-up | Publishing triggers a static rebuild through a host deploy hook. See [CONTENT_MODEL.md §6](./CONTENT_MODEL.md#6-cms-integration-later-phase-7). |

## 4. Folder structure

```
/
├─ app/
│  ├─ layout.tsx                 # fonts, <Header/>, <Sidebar/>, <Footer/>, Organization JSON-LD
│  ├─ page.tsx                   # Home
│  ├─ globals.css                # Tailwind + @theme design tokens
│  ├─ not-found.tsx              # 404
│  ├─ sitemap.ts · robots.ts     # force-static, emitted as files in /out
│  ├─ icon.png · apple-icon.png  # favicon (placeholder from logo)
│  ├─ catalogue/
│  │  ├─ page.tsx                # Product Catalogue
│  │  └─ [category]/
│  │     ├─ page.tsx             # Category grid + filters/sort
│  │     └─ [slug]/page.tsx      # Product detail
│  ├─ studio/page.tsx
│  ├─ about/page.tsx
│  └─ contact/page.tsx
├─ components/
│  ├─ layout/    Header, Sidebar, SidebarNav, Footer, FooterColumns, SkipLink, Wordmark
│  ├─ ui/        Button, LinkArrow, Container, Section, SectionHeading, Eyebrow, Prose,
│  │             SocialLinks, Breadcrumbs, FAQAccordion, ResponsiveImage
│  ├─ home/      Hero, CategoryTiles, FeaturedProducts, StudioTeaser, AboutTeaser
│  ├─ catalogue/ CategoryTile, ProductCard, ProductGrid, CatalogueBrowser, Filters,
│  │             SortSelect, ProductGallery, ProductSpecs, EnquireButtons, RelatedProducts
│  └─ studio/    StudioScrollVideo, StudioVideo, PhotoCarousel, PaginationDots
├─ content/                      # ← ALL editable content lives here
│  ├─ site.ts                    # name, contact, socials, Google Form, feature flags (ONE config file for links)
│  ├─ navigation.ts              # sidebar + footer structure
│  ├─ categories.ts
│  ├─ products/
│  │  ├─ home-decor.ts · outdoor-decor.ts · wall-decor.ts · seasonal-decor.ts
│  ├─ faqs.ts
│  └─ pages/ home.ts · catalogue.ts · studio.ts · about.ts · contact.ts · not-found.ts
├─ assets/
│  └─ images/                    # ORIGINAL images (source of truth, committed)
│     ├─ placeholders/           # generated neutral placeholders (TODO(client): replace)
│     └─ products/ · pages/ · studio/   # real photos once supplied
├─ lib/
│  ├─ content.ts                 # the ONLY way components read content (async functions)
│  ├─ schemas.ts                 # Zod schemas → TS types
│  ├─ images.ts                  # resolves ImageAsset dimensions from the build manifest
│  ├─ image-loader.ts            # next/image custom loader → /img/<path>-<width>.webp
│  ├─ filters.ts                 # pure filter/sort functions
│  ├─ enquiry.ts                 # WhatsApp / Instagram link builders
│  ├─ seo.ts                     # metadata + JSON-LD helpers
│  ├─ utils.ts                   # cn(), formatDimensions(), etc.
│  └─ hooks/                     # usePrefersReducedMotion, useMediaQuery
├─ public/
│  ├─ brand/logo.png             # TODO(client) — placeholder until supplied
│  ├─ img/                       # GENERATED responsive WebP variants (gitignored)
│  └─ video/studio/              # studio.mp4, studio.webm, studio-mobile.mp4, poster.jpg
├─ scripts/
│  ├─ generate-placeholders.mjs  # creates neutral-toned labelled placeholder originals (sharp)
│  ├─ build-images.mjs           # originals → /public/img/*-<w>.webp + lib/generated/image-manifest.json
│  └─ content-todo-report.mjs    # lists every TODO(client) marker still in /content
├─ tests/                        # Playwright smoke + axe
└─ docs/                         # this folder
```

## 5. Key decisions

1. **Content layer first.** Components never import from `/content` directly. They call `async` helpers in `lib/content.ts` (`getProducts()`, `getCategory()`, …). The functions are async from day one, so swapping the TS files for a CMS fetch later changes **only** `lib/content.ts`.
2. **Content files are TypeScript, not JSON.** This allows `// TODO(client):` comments right next to placeholder values (JSON can't hold comments), plus type-checking while editing. Zod validates at build time.
3. **One link config.** Every social URL, phone, email, WhatsApp number, Google Form URL and map link lives in `content/site.ts`.
4. **Placeholders are local, generated images** in `/assets/images/placeholders/` (warm neutral tones with a label like `HOME DECOR · SCI-HD-003`). They don't depend on any external service, work offline and in CI, and are easy to spot. Content references them by path, so replacing an image means changing one string (or dropping a file at the same path). Width/height come from the build manifest, so editors only supply `src` + `alt`.
5. **Sidebar = Radix Dialog** sliding in from the left. Sub-categories are always visible and indented, never a dropdown.
6. **Header shrink is behind a flag:** `site.features.headerShrink` (default `false`) → `<Header shrinkOnScroll />`. It's not built in v1 beyond the prop plumbing.
7. **Studio interaction = one pinned GSAP timeline** with named stages and configurable distances (see the spec). There's a full non-pinned fallback for reduced motion.
8. **Enquiries:** WhatsApp via `https://wa.me/<number>?text=<prefilled>` (message includes product name + code). Instagram via `https://ig.me/m/<username>`, which opens a DM; Instagram doesn't support prefilled text, so we show a "copy product code" helper next to it. The Google Form is a plain link (URL in `content/site.ts`). Prefilling it with the product code is a later option.
9. **Dimensions stored in cm**, displayed cm first then inches: `45 × 30 cm / 17.7 × 11.8 in`.
10. **FAQs have one source** (`content/faqs.ts`), rendered in both the footer and `/about`. Each FAQ has a `showInFooter` flag so the footer can show a subset.
11. **Analytics: Cloudflare Web Analytics** (cookieless, so no consent banner), added in Phase 5.
12. **Host portability.** The build is a pure static export. Host-specific behaviour (redirects, headers) is configured at the host or DNS level, never in app code. Search-engine blocking for non-production builds comes from the build-time `SITE_ENV` variable (robots.txt + meta robots), not from host headers.
13. **Optional B2B fields** `moq` and `leadTime` exist on Product and are rendered only when filled in. Placeholders leave them empty.
14. **Map:** a static placeholder image that links to Google Maps. No iframe embed.

## 6. Pending client feedback (build flexibly, don't over-invest)

| Item | Current assumption | Where |
|---|---|---|
| **Homepage sections** | Hero → 4 category tiles → featured products → Studio teaser → About teaser | Sections are data-driven (`content/pages/home.ts` `sections[]`), so they can be reordered or removed without code |
| **Filters & sorting** on category pages | Material, colour, size (Small/Medium/Large buckets); sort by name A–Z/Z–A, newest | Feature-flagged: `site.features.catalogueFilters` |
| **Header shrink on scroll** | Off | `site.features.headerShrink` |
| **Header search icon** | Visual placeholder (disabled / "coming soon" tooltip) | Later: client-side search over content (e.g. Fuse.js) in a dialog |
| **Header contact icon** destination | Links to `/contact` | Could open WhatsApp directly instead. Target comes from `content/site.ts` |

## 7. Decisions confirmed (2026-11-12)

| Topic | Decision |
|---|---|
| Hosting | Vercel Hobby, fully static export, portable to Cloudflare Pages |
| Mobile wordmark | Two-line lockup below 640px ("SAI CREATIONS" / "INTERNATIONAL") ✅ |
| Product JSON-LD without prices | Keep it, valid markup |
| Audience | Not confirmed. Optional `moq` / `leadTime` fields, hidden when empty |
| The Studio | A showcase of the company (workshop, process, people), not products. Carousel photos don't link anywhere |
| Units | Both, cm first: `45 × 30 cm / 17.7 × 11.8 in` |
| Map | Static placeholder image linking to Google Maps. No embed |
| Google Form | Plain link, no prefill (URL in site config) |
| Domain | Bare domain is primary, `www` redirects to it. Name, registrar and email details are to follow from the client |
| Analytics | Cloudflare Web Analytics, Phase 5 |

## 7a. Still open (for the client)

Pending client feedback: homepage sections, filters/sorting, header shrink, header search, contact icon destination (see §6). Also:

1. **Audience:** retail, trade/B2B export, or both? (Decides whether `moq` / `leadTime` get filled in.)
2. How many products at launch and in a year, and how often will they change? This affects CMS urgency.
3. Who will edit content, and how comfortable are they with technology?
4. Will categories need **sub-categories** later (e.g. Home Decor → Cushions, Throws, Vases)?
5. FAQs: confirm which ones should appear in the footer subset.
6. WhatsApp number(s), WhatsApp Business account, and preferred prefilled message wording.
7. Should an email address be shown or used as an enquiry option?
8. Approve the wordmark font (Cormorant Garamond) and the palette, including the green accent.
9. Product photography: consistent backgrounds and 4:5 portrait crops? (2000px+ long edge recommended.)
10. Domain name, registrar, DNS access, and whether the domain has email (MX/TXT records must be preserved).
11. Is English-only OK for launch?

## 8. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Scroll-jacking on iOS Safari (address bar resize, momentum) | `ScrollTrigger.config({ ignoreMobileResize: true })`, `svh/lvh` units, simplified mobile timeline, real-device QA (see spec) |
| Large Studio video hurts LCP/bandwidth | Poster image is the LCP element; compressed H.264 + WebM; separate mobile encode; `preload="metadata"` |
| Client content arrives in inconsistent formats | Zod validation + `CONTENT_TODO.md` with specs (sizes, ratios, word counts) |
| Wordmark too wide on small screens | Two-line mobile lockup (approved) |
| Content edits break the build | Zod error messages name the file and field; the host keeps the last good deployment live |
| Hosting terms or limits change (Vercel Hobby is officially for non-commercial use) | Pure static export, so we can move to Cloudflare Pages without code changes (DEPLOYMENT.md §7) |
| Build-time image processing slows builds as photos grow | The image script skips variants that are already up to date. Originals are capped at ~2400px |
