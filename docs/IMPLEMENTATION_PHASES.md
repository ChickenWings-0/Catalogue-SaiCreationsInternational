# Implementation Phases

Each phase ends with a review checkpoint. Items marked ⏳ are **pending client feedback**. Build them flexibly or behind a flag.

---

## Status at a glance (updated 2026-11-17)

| Phase | Status |
|---|---|
| 0 Setup · 1 Layout shell · 2 Catalogue pages · 3 The Studio | ✅ Done |
| 3.5 Client feedback: visual-only catalogue + first real photos | ✅ Done |
| 3.6 Final palette (Sage & Brass), single hero, no codes, dev tools removed | ✅ Done |
| 3.7 Client content round 2: photos batch 2, logo, contact details, About text, Studio film | ✅ Done |
| 4 About, Contact, FAQs, 404 | ✅ Done (FAQ wording still to confirm) |
| 4b Product photos batch 2 (repeatable whenever the client sends more) | Waiting on client |
| 5 SEO, accessibility, performance, clean-up | Next |
| 6 Deployment + custom domain | To do (needs domain details) |
| 7 CMS for client editing | Later / optional |

---

## Phase 0: Project setup, tooling, design tokens, fonts ✅

- [x] `create-next-app` (latest stable): TypeScript, App Router, Tailwind v4, ESLint, `src`-less layout, `@/*` alias
- [x] `next.config.ts`: `output: 'export'`, `trailingSlash: true`, `images: { loader: 'custom', loaderFile: './lib/image-loader.ts', deviceSizes, imageSizes }`. No middleware, API routes, edge runtime or ISR
- [x] **Build-time image pipeline:** `scripts/build-images.mjs` (sharp). Originals in `/assets/images/**` → WebP variants at fixed widths in `/public/img/` (gitignored) + `lib/generated/image-manifest.json` (intrinsic sizes). Incremental (skips up-to-date files). Runs via `predev` / `prebuild`
- [x] `lib/image-loader.ts`: maps `(src, width)` → `/img/<path>-<width>.webp`; absolute URLs pass through
- [x] `tsconfig` `strict: true`, `noUncheckedIndexedAccess: true`
- [x] Prettier + `prettier-plugin-tailwindcss`. ESLint: `next/core-web-vitals`, `jsx-a11y`
- [x] `.editorconfig`, `.nvmrc` (Node LTS), `npm` scripts: `dev`, `build`, `start`, `lint`, `format`, `typecheck`, `test:e2e`, `content:todo`, `placeholders`
- [x] Install deps: `@radix-ui/react-dialog`, `lucide-react`, `react-icons`, `zod`, `clsx`, `tailwind-merge`. Dev: `sharp`, `prettier`, `prettier-plugin-tailwindcss`, `eslint-plugin-jsx-a11y`. (GSAP/Embla are added in the phases that need them. Playwright/axe come in Phase 5)
- [x] Design tokens in `app/globals.css` `@theme` (colours, fonts, easing, breakpoints) per DESIGN_SYSTEM
- [x] `next/font/google`: Cormorant Garamond (300/400/500 + 400 italic), Jost (300/400/500), exposed as CSS variables
- [x] `color-scheme: light`; no dark-mode styles
- [x] `scripts/generate-placeholders.mjs`: generates neutral-toned, labelled JPG placeholder originals (product 4:5, category tiles, hero 16:9, about, studio slides, static map, OG 1200×630) into `/assets/images/placeholders/`. It only creates missing files and never overwrites real images. The originals are committed
- [x] Placeholder logo at `/public/brand/logo.png` + favicon set (`app/icon.png`, `apple-icon.png`), created only if missing
- [x] A `/styleguide` page showing type scale, colours and buttons (`noindex`, not linked, excluded from the sitemap)
- [x] Git: `.gitignore` (incl. `/out`, `/public/img`, `lib/generated`), README with setup steps

**Acceptance criteria**
- `npm run dev` serves the style guide in ivory with the correct fonts loaded (no FOUT/CLS visible), and a placeholder image renders through the custom loader with a correct `srcset`.
- `npm run lint`, `npm run typecheck` and `npm run build` pass. The build writes a static `/out` folder with `index.html` files, and `/out/img/` holds the WebP variants.
- The style guide matches the DESIGN_SYSTEM values.

---

## Phase 1: Layout shell: header, sidebar, footer, routing, placeholder content ✅

- [x] `lib/schemas.ts` (Zod) + types; `lib/content.ts` async getters (all from CONTENT_MODEL §3)
- [x] Content files: `site.ts` (all links/contacts/socials/Google Form/feature flags), `navigation.ts`, `categories.ts` (4), `products/*.ts` (**8 per category = 32**, codes `SCI-XX-001…008`), `faqs.ts` (8 placeholder Q&As), `pages/*.ts`
- [x] Every placeholder value has a `// TODO(client):` marker. `scripts/content-todo-report.mjs` prints them
- [x] `Header` (sticky, wordmark centered, hamburger left, search + contact right). `shrinkOnScroll` prop wired to `site.features.headerShrink` (no effect yet) ⏳. Search icon is a placeholder ⏳. Contact icon target comes from `site.header.contactHref` (`/contact` for now) ⏳
- [x] `Wordmark` with the two-line mobile lockup (approved)
- [x] `Sidebar` (Radix Dialog): slides from left, overlay, Esc/overlay/X close, focus trap + return, scroll lock, closes on navigation, sub-categories always visible and indented, About/Contact pinned bottom, `aria-current`
- [x] `Footer`: all columns, `SocialLinks` (5 platforms, new tab, aria-labels), `FAQAccordion` (footer subset), bottom strip (logo, © year, address)
- [x] `SkipLink`, `Container`, `Section`, `Button`, `LinkArrow`, `SectionHeading`, `ResponsiveImage`, `Breadcrumbs`
- [x] Route stubs for every route in SITEMAP, with `generateStaticParams` + `dynamicParams = false` for category/product
- [x] `app/not-found.tsx` stub

**Acceptance criteria**
- All routes in SITEMAP export statically (`/out` contains 32 product pages + 4 category pages + the static pages + `404.html`).
- `npx serve out` (a plain static server, not Next.js) serves every route correctly. This is a proxy for portability.
- The sidebar passes keyboard-only use: Tab cycles inside it, Esc closes it, focus returns to the hamburger, and the page behind doesn't scroll. The screen reader announces a "Main" navigation dialog.
- Sub-categories are visible without any extra click.
- Changing a social URL in `content/site.ts` updates the footer, contact page and enquiry buttons (one source).
- A broken content entry (e.g. missing `alt`) fails the build with a readable Zod error.
- The layout is correct at 360 / 768 / 1024 / 1440 with no horizontal scroll.

---

## Phase 2: Home, Catalogue, Category and Product detail ✅

- [x] **Home** (`HomeSections` renders from `content/pages/home.ts` `sections[]`) ⏳ section list pending client
  - [x] `Hero`: full-bleed image (slideshow if `features.heroSlideshow`, with pause button), tagline, CTA
  - [x] `CategoryTiles` (4)
  - [x] `FeaturedProducts` (products with `featured: true`, limit 8)
  - [x] `StudioTeaser` (poster still → `/studio`)
  - [x] `AboutTeaser`
- [x] **Catalogue** `/catalogue`: intro, 4 large editorial `CategoryTile`s, "All products" `ProductGrid` (32)
- [x] **Category** `/catalogue/[category]`: breadcrumb, title/intro, optional banner, `CatalogueBrowser`
  - [x] ⏳ `Filters` (material, colour, size) + `SortSelect` (name A–Z, Z–A, newest) behind `features.catalogueFilters`
  - [x] URL query sync; result-count live region; clear-all; one expandable filter panel (works on mobile and desktop instead of separate popovers / bottom sheet)
  - [x] Unit tests for `applyFilters` / `sortProducts` / `getFilterFacets`
- [x] **Product detail** `/catalogue/[category]/[slug]`
  - [x] `ProductGallery` (Embla main + synced thumbnails, swipe, keyboard)
  - [x] Name (H1), code/SKU, `ProductSpecs` (dimensions as `45 × 30 cm / 17.7 × 11.8 in`, materials, technique, care; `moq` / `leadTime` rows rendered **only when set**, and not set on placeholders)
  - [x] Description
  - [x] `EnquireButtons`: WhatsApp (prefilled with name + code + URL), Instagram DM, copy-code helper, plain Google Form link (no prefill)
  - [x] `RelatedProducts` (same category, 4)
- [x] Section reveal-on-scroll (IntersectionObserver, reduced-motion aware)

**Acceptance criteria**
- Clicking any category tile or product card reaches the correct page. Breadcrumbs are correct.
- The WhatsApp button opens `wa.me/<number>?text=…` with the exact product name and code (verified for 3 products in different categories).
- Filters: combining material + colour narrows results correctly, the counts update, the URL reflects the state, reload restores it, and back/forward works. With the flag off, only the grid shows.
- The product gallery works by swipe (touch emulation), click and keyboard. Thumbnails sync.
- Home sections can be reordered or removed by editing only `content/pages/home.ts`.
- No component contains hardcoded copy (spot-check with a grep for literal English strings in `components/`).

---

## Phase 3: The Studio page interaction ✅

Follow [STUDIO_INTERACTION_SPEC.md](./STUDIO_INTERACTION_SPEC.md).

- [x] Placeholder video: free stock clip (Mixkit #4479, loom weaving) cut to a 14 s seamless loop: `studio.mp4` (720p, 2.6 MB), `studio.webm` (1.7 MB), `studio-mobile.mp4` (540p, 1.2 MB) in `/public/video/studio/`, poster frame in `assets/images/placeholders/studio/video-poster.jpg`
- [x] `StudioVideo` (autoplay muted loop playsInline, poster, mobile source, pause toggle, off-screen pause)
- [x] `StudioScrollVideo` timeline: `expand` → `hold` (dead zone) → `reveal` → `release`, with configurable distances
- [x] `gsap.matchMedia` branches: full / mobile / reduced-motion / short-landscape fallback
- [x] Install `gsap`, `@gsap/react`, `embla-carousel-react`, `embla-carousel-autoplay`
- [x] `PhotoCarousel` (Embla, centered + peek, arrows, keyboard, drag/swipe, optional autoplay with pause on hover/focus + pause button). Slides show the company (workshop, process, people) and are **not links**
- [x] `PaginationDots` (circle → pill animated width, accessible buttons)
- [x] GSAP + Embla dynamically imported on `/studio` only
- [x] Outro section with CTA to `/catalogue`
- [x] `debug` prop shows ScrollTrigger markers in dev

**Acceptance criteria**
- All items in STUDIO_INTERACTION_SPEC §9 are checked.
- Real-device test on iOS Safari + Android Chrome is recorded (short screen recordings attached to the PR). ⏳ Still to do on physical devices; desktop Chrome and emulated mobile widths are verified.
- The bundle analyser shows GSAP only in the `/studio` chunk.

---

## Phase 3.5: Client feedback: visual-only catalogue ✅

Client decisions (2026-11-16): **no product names, dimensions or specifications** on the site (to protect their designs from being copied), **no filters or sorting**, just a visual display. Visitors click a product photo to enquire on **WhatsApp**.

- [x] Import the client's first photo batch (56 products: 11 Home Decor, 11 Outdoor Decor, 12 Wall Decor, 22 Seasonal Decor) with `npm run import:images` (trim white margin, centre on a square canvas, no upscaling). Mapping in `scripts/client-images.mjs`
- [x] The "IMAGES" folder was split: terrariums, glass boxes, trays and vases go to **Home Decor**; lanterns go to **Outdoor Decor** (name kept)
- [x] Product model reduced to **code + category + photo(s) + featured flag** (codes provisional: `SCI-HD-001` …)
- [x] Category page: large product **carousel** + **image wall** (photos and codes only)
- [x] Click a photo → **lightbox** (large photo, swipe/arrows/keys between products, code, one "Enquire on WhatsApp" button)
- [x] WhatsApp message = product code + product page link. Each product page uses its photo as `og:image` (JPEG share image), so **WhatsApp shows the photo as a link preview**. (A website can't attach a photo to a WhatsApp message directly.)
- [x] Minimal product page (photo, code, WhatsApp button, more from the category): the target of shared links
- [x] Removed: filters, sorting, specs, dimensions, product gallery, Instagram/form enquiry buttons on product pages
- [x] Light anti-copy deterrent: product photos can't be dragged and right-click/long-press offers no "Save image" (not real protection)
- [x] Category tiles and Home "Featured pieces" use real product photos

**Acceptance criteria**
- No product name, size or specification appears anywhere on the site. ✅
- Every product opens in the lightbox, and its WhatsApp link carries the right code and URL. ✅
- The link preview works once the site is on a public URL (WhatsApp can't fetch `localhost`). ⏳ Verify after Phase 6.

---

## Phase 3.6: Client sign-off round ✅

- [x] **Sage & Brass** is the final palette: values moved into `@theme`. The palette switcher, `app/palettes.css`, `lib/palettes.ts` and the `showPaletteSwitcher` flag were removed
- [x] Home hero: one slide only ("Crafted by hand, made for home", the placeholder illustration the client liked). Slideshow off
- [x] **No product codes shown anywhere** (they were provisional, not the client's). Codes remain only internally (URL slugs, content keys). The WhatsApp message is now "I'm interested in this piece: <link>", and the link preview shows the photo
- [x] Dev-only items removed from the deployed site: palette switcher, `/styleguide` page, "arrives in Phase N" notes. Next.js dev indicator disabled (it only appeared in `npm run dev`)

---

## Phase 3.7: Client content round 2 ✅ (2026-11-17)

- [x] Photos batch 2 imported: **11 candelabras** (Home Decor) and **24 garden pieces** (Outdoor Decor: churns, tubs, baskets, bicycle planters, star lanterns, cushions). Duplicate files skipped (HOME 1=10, 6=8; GARDEN 6=8, 14=15)
- [x] Import modes: `cutout` (white bg, near-white lifted to white), `clean` (ignores corner marks), `pad` (black bg kept), `crop` (lifestyle → square), `fit` (wide lifestyle over a blurred copy). The trim box ignores dust specks
- [x] Removed the open glass box (was SCI-HD-010). Moved the textured cube lanterns from Outdoor to Home Decor (now SCI-HD-012)
- [x] Totals: Home 22 · Outdoor 34 · Wall 12 · Seasonal 22 = **90 products**
- [x] **Logo** (green "SC" monogram) beside the text wordmark in the header, in the footer brand strip, as the favicon/apple icon and on the default share image (`assets/images/site/og-default.jpg`). Default `og:image` wired in the root layout
- [x] **Contact details**: D-32, Sector 7, Noida, Uttar Pradesh 201301, India · WhatsApp Business +91 9289 555 616 (used by every enquiry button) · Instagram @saicreationsintl. Pinterest, X and LinkedIn removed
- [x] **About**: client text for The Initiative (with the two workshop photos) and The Present (four branches as cards)
- [x] **Contact page** built: WhatsApp, Instagram and Visit us cards (Google Maps directions). Email and Google Form appear automatically once supplied
- [x] **The Studio**: the client's film (86 s, re-encoded to MP4/WebM/mobile, about 0.5–1 MB each) and a carousel of their pieces. Home teasers use the workshop photos
- [x] Home hero: the approved illustration regenerated without its "PLACEHOLDER" label (`assets/images/home/hero.jpg`). All other placeholder images deleted
- [x] Header search icon removed (no dead controls)

---

## Phase 4b: Product photos batch 2 (repeat for every new batch) ⏳

When the client sends more photos:
1. Put them in `IMAGES FOR AKSH/<CATEGORY>/` (this inbox folder is not committed).
2. Add one line per photo to `scripts/client-images.mjs` (code, file, short alt text).
3. Run `npm run import:images`, then add the matching entries to `content/products/<category>.ts`.
4. `npm run build` → check → commit.

- [x] Home Decor and Garden photos received (batch 2)
- [ ] Ask for higher-resolution originals where the product is small in frame (e.g. SCI-OD-002 is only ~350 px wide)
- [ ] ~~Replace provisional codes~~ Not needed: codes are internal only and never shown

---

## Phase 4: About, Contact, FAQs, 404 ✅

- [x] **About** `/about`: intro, `#the-initiative` and `#the-present` sections (placeholder text + images, alternating layout), `#faqs` with the **full** `FAQAccordion` (same `faqs.ts` source as the footer). `scroll-margin-top` for the sticky header
- [x] Footer links `/about#the-initiative` and `#the-present` land at the correct sections (also when already on `/about`)
- [x] **Contact** `/contact`: `ContactDetails` (address, phone `tel:`, email `mailto:`, hours), a **Get directions** button to Google Maps (no map image, no iframe), `SocialLinks` with labels, `GoogleFormCta` (plain link, new tab, no prefill). No on-site form
- [x] **404**: styled page with copy from content, links to Home + Catalogue, featured product photos
- [x] **Home hero**: client approved the illustrated still life (label removed)
- [x] Header contact icon → `/contact`. Search icon removed

**Acceptance criteria**
- FAQ content is edited in one place and appears in both the footer (subset) and About (all).
- Anchor links aren't hidden under the sticky header.
- All external links open in a new tab with `rel="noopener noreferrer"` and an accessible "(opens in a new tab)" hint.
- A visit to `/catalogue/home-decor/does-not-exist` or `/xyz` shows the styled 404 with HTTP status 404.

---

- ⏳ FAQ wording is still the drafted text: ask the client to confirm or edit `content/faqs.ts`

## Phase 5: SEO, accessibility and performance pass

**Clean-up**
- [x] Client picked Sage & Brass; palette switcher removed (Phase 3.6)
- [x] Remove all `PhaseNote` scaffolding (Phase 3.6)
- [ ] Optional (client decision): watermark product photos with the logo at build time, as a stronger anti-copy measure

**SEO**
- [ ] `metadataBase` from `NEXT_PUBLIC_SITE_URL`. Per-page `generateMetadata` (title template `%s · SAI Creations International`, description, canonical)
- [ ] Open Graph + Twitter `summary_large_image` cards (default OG image with logo; product pages use the first product image)
- [ ] `app/sitemap.ts` + `app/robots.ts` (`dynamic = 'force-static'`, emitted as files). Sitemap: all static + 4 category + every product URL (56 in batch 1) with trailing slashes on the bare domain. Robots: allow all when `SITE_ENV=production`; otherwise `Disallow: /` + `<meta name="robots" content="noindex">` (host-independent, no headers/middleware)
- [ ] JSON-LD: `Organization` (root layout: name, logo, url, `sameAs` socials, `contactPoint`), `BreadcrumbList` (category/product), `Product` (image, brand, category; no name, code or specs, by client choice). *Note:* without price/offers Google won't show Product rich results, but the markup is still valid structured data. `FAQPage` on `/about` (low rich-result value since 2023, harmless)
- [ ] Semantic HTML audit: one H1 per page, landmark roles, lists for grids

**Analytics**
- [ ] **Cloudflare Web Analytics** beacon (`<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"…"}'>`). Token from `site.analytics.cloudflareBeaconToken`. Loaded only when the token is set and `SITE_ENV=production`. Cookieless, so no consent banner

**Accessibility (WCAG 2.1 AA)**
- [ ] Add `@playwright/test` + `@axe-core/playwright`. Run Playwright + axe on every route template against the static `/out` build: zero violations
- [ ] Keyboard pass on all interactive components; visible focus everywhere
- [ ] Screen reader pass (VoiceOver iOS/macOS + NVDA Windows) on sidebar, product carousel, lightbox, Studio carousel, FAQ
- [ ] `prefers-reduced-motion` honoured site-wide
- [ ] 200% zoom / 320px reflow without loss of content
- [ ] All images have meaningful alt text from content

**Performance**
- [ ] `next/image` `sizes` audited per usage; hero/LCP `priority`; everything else lazy
- [ ] Font subsetting; only the needed weights
- [ ] Bundle check: no GSAP/Embla outside routes that need them; Radix Dialog only in the client chunk
- [ ] Lighthouse (mobile + desktop) on Home, Category, Product, Studio, About

**Acceptance criteria**
- Lighthouse ≥ 90 in **Performance, Accessibility, Best Practices, SEO** on all five templates (mobile emulation).
- `sitemap.xml` and `robots.txt` validate. The Rich Results Test parses Organization/Breadcrumb/Product without errors.
- axe: zero violations. The manual keyboard + screen reader checklist is complete.
- Responsive check at 360, 768, 1024, 1440, 1920 is signed off.

---

## Phase 6: Vercel deployment + custom domain

Follow [DEPLOYMENT.md](./DEPLOYMENT.md).

- [ ] Vercel **Hobby** plan (decided). Collect domain name, registrar and email details from the client ⏳
- [ ] **Export the existing DNS zone first.** If the domain has email, keep all MX/TXT records untouched
- [ ] Push repo to GitHub; import into Vercel; set `NEXT_PUBLIC_SITE_URL` + `SITE_ENV` per environment
- [ ] Preview deployments on PRs (noindex via `SITE_ENV`); production from `main`
- [ ] Add the bare domain (primary) + `www` (308 → bare domain); add the A + CNAME records at the registrar
- [ ] Verify SSL issuance, HTTP → HTTPS, `www` → bare domain redirect
- [ ] Google Search Console: verify the domain (DNS TXT), submit the sitemap
- [ ] Do **not** enable any Vercel-only features (Image Optimization, Vercel Analytics, Speed Insights, Edge Config)

**Acceptance criteria**
- `https://<domain>` serves the site with a valid certificate. `http://`, `http://www.` and `https://www.` all 308-redirect to it.
- Existing email (MX/TXT records) keeps working after the DNS change. `dig MX` output is unchanged from the pre-change export.
- The same commit builds on Cloudflare Pages unchanged (optional dry run to a `*.pages.dev` URL).
- Search Console shows the sitemap as successfully read.
- Lighthouse on production URLs still meets Phase 5 targets.

---

## Phase 7 (later): CMS integration for client editing

See [CONTENT_MODEL.md §6](./CONTENT_MODEL.md#6-cms-integration-later-phase-7). Recommended: **Sanity**.

- [ ] Create a Sanity project (client-owned) and invite editors
- [ ] Schemas mirroring the content model; singleton documents for site config and pages; desk structure (Products by category, Pages, FAQs, Settings)
- [ ] Field validation mirroring Zod (required alt, code pattern `SCI-XX-NNN`, etc.)
- [ ] Migration script from `/content` → Sanity (documents + image uploads)
- [ ] Re-implement `lib/content.ts` with build-time GROQ queries; same Zod parsing; add a Sanity CDN branch to `lib/image-loader.ts`
- [ ] Sanity webhook on publish → host **Deploy Hook** → static rebuild (no API routes; the site stays `output: 'export'`)
- [ ] Studio hosted at `<name>.sanity.studio`
- [ ] Editor guide for the client (screenshots: add product, replace photo, edit FAQ, change social link)

**Acceptance criteria**
- The client can add a product with photos and see it live within ~2–3 minutes (rebuild), without a developer.
- The Phase 7 diff contains **no changes in `components/`** or page JSX layout.
- Invalid entries are blocked in the Studio UI, so they never reach the site.
