# Implementation Phases

Each phase ends with a review checkpoint. Items marked ⏳ are **pending client feedback**. Build them flexibly or behind a flag.

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

## Phase 2: Home, Catalogue, Category and Product detail

- [ ] **Home** (`HomeSections` renders from `content/pages/home.ts` `sections[]`) ⏳ section list pending client
  - [ ] `Hero`: full-bleed image (slideshow if `features.heroSlideshow`, with pause button), tagline, CTA
  - [ ] `CategoryTiles` (4)
  - [ ] `FeaturedProducts` (products with `featured: true`, limit 8)
  - [ ] `StudioTeaser` (poster still → `/studio`)
  - [ ] `AboutTeaser`
- [ ] **Catalogue** `/catalogue`: intro, 4 large editorial `CategoryTile`s, "All products" `ProductGrid` (32)
- [ ] **Category** `/catalogue/[category]`: breadcrumb, title/intro, optional banner, `CatalogueBrowser`
  - [ ] ⏳ `Filters` (material, colour, size) + `SortSelect` (name A–Z, Z–A, newest) behind `features.catalogueFilters`
  - [ ] URL query sync; result-count live region; clear-all; mobile bottom sheet
  - [ ] Unit tests for `applyFilters` / `sortProducts` / `getFilterFacets`
- [ ] **Product detail** `/catalogue/[category]/[slug]`
  - [ ] `ProductGallery` (Embla main + synced thumbnails, swipe, keyboard)
  - [ ] Name (H1), code/SKU, `ProductSpecs` (dimensions as `45 × 30 cm / 17.7 × 11.8 in`, materials, technique, care; `moq` / `leadTime` rows rendered **only when set**, and not set on placeholders)
  - [ ] Description
  - [ ] `EnquireButtons`: WhatsApp (prefilled with name + code + URL), Instagram DM, copy-code helper, plain Google Form link (no prefill)
  - [ ] `RelatedProducts` (same category, 4)
- [ ] Section reveal-on-scroll (IntersectionObserver, reduced-motion aware)

**Acceptance criteria**
- Clicking any category tile or product card reaches the correct page. Breadcrumbs are correct.
- The WhatsApp button opens `wa.me/<number>?text=…` with the exact product name and code (verified for 3 products in different categories).
- Filters: combining material + colour narrows results correctly, the counts update, the URL reflects the state, reload restores it, and back/forward works. With the flag off, only the grid shows.
- The product gallery works by swipe (touch emulation), click and keyboard. Thumbnails sync.
- Home sections can be reordered or removed by editing only `content/pages/home.ts`.
- No component contains hardcoded copy (spot-check with a grep for literal English strings in `components/`).

---

## Phase 3: The Studio page interaction

Follow [STUDIO_INTERACTION_SPEC.md](./STUDIO_INTERACTION_SPEC.md).

- [ ] Placeholder video assets (a short neutral clip, or a generated gradient loop) + poster in `/public/video/studio/`
- [ ] `StudioVideo` (autoplay muted loop playsInline, poster, mobile source, pause toggle, off-screen pause)
- [ ] `StudioScrollVideo` timeline: `expand` → `hold` (dead zone) → `reveal` → `release`, with configurable distances
- [ ] `gsap.matchMedia` branches: full / mobile / reduced-motion / short-landscape fallback
- [ ] Install `gsap`, `@gsap/react`, `embla-carousel-react`, `embla-carousel-autoplay`
- [ ] `PhotoCarousel` (Embla, centered + peek, arrows, keyboard, drag/swipe, optional autoplay with pause on hover/focus + pause button). Slides show the company (workshop, process, people) and are **not links**
- [ ] `PaginationDots` (circle → pill animated width, accessible buttons)
- [ ] GSAP + Embla dynamically imported on `/studio` only
- [ ] Outro section with CTA to `/catalogue`
- [ ] `debug` prop shows ScrollTrigger markers in dev

**Acceptance criteria**
- All items in STUDIO_INTERACTION_SPEC §9 are checked.
- Real-device test on iOS Safari + Android Chrome is recorded (short screen recordings attached to the PR).
- The bundle analyser shows GSAP only in the `/studio` chunk.

---

## Phase 4: About, Contact, FAQs, 404

- [ ] **About** `/about`: intro, `#the-initiative` and `#the-present` sections (placeholder text + images, alternating layout), `#faqs` with the **full** `FAQAccordion` (same `faqs.ts` source as the footer). `scroll-margin-top` for the sticky header
- [ ] Footer links `/about#the-initiative` and `#the-present` land at the correct sections (also when already on `/about`)
- [ ] **Contact** `/contact`: `ContactDetails` (address, phone `tel:`, email `mailto:`, hours), `MapPlaceholder` (a static placeholder image linking to Google Maps; **no iframe embed**), `SocialLinks` with labels, `GoogleFormCta` (plain link, new tab, no prefill). No on-site form
- [ ] **404**: styled page with copy from content, links to Home + Catalogue, featured products
- [ ] Header contact icon → `/contact`. Search icon placeholder state finalised ⏳

**Acceptance criteria**
- FAQ content is edited in one place and appears in both the footer (subset) and About (all).
- Anchor links aren't hidden under the sticky header.
- All external links open in a new tab with `rel="noopener noreferrer"` and an accessible "(opens in a new tab)" hint.
- A visit to `/catalogue/home-decor/does-not-exist` or `/xyz` shows the styled 404 with HTTP status 404.

---

## Phase 5: SEO, accessibility and performance pass

**SEO**
- [ ] `metadataBase` from `NEXT_PUBLIC_SITE_URL`. Per-page `generateMetadata` (title template `%s · SAI Creations International`, description, canonical)
- [ ] Open Graph + Twitter `summary_large_image` cards (default OG image with logo; product pages use the first product image)
- [ ] `app/sitemap.ts` + `app/robots.ts` (`dynamic = 'force-static'`, emitted as files). Sitemap: all static + 4 category + 32 product URLs with trailing slashes on the bare domain. Robots: allow all when `SITE_ENV=production`; otherwise `Disallow: /` + `<meta name="robots" content="noindex">` (host-independent, no headers/middleware)
- [ ] JSON-LD: `Organization` (root layout: name, logo, url, `sameAs` socials, `contactPoint`), `BreadcrumbList` (category/product), `Product` (name, sku, image, material, brand, category). *Note:* without price/offers Google won't show Product rich results, but the markup is still valid structured data. `FAQPage` on `/about` (low rich-result value since 2023, harmless)
- [ ] Semantic HTML audit: one H1 per page, landmark roles, lists for grids

**Analytics**
- [ ] **Cloudflare Web Analytics** beacon (`<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"…"}'>`). Token from `site.analytics.cloudflareBeaconToken`. Loaded only when the token is set and `SITE_ENV=production`. Cookieless, so no consent banner

**Accessibility (WCAG 2.1 AA)**
- [ ] Add `@playwright/test` + `@axe-core/playwright`. Run Playwright + axe on every route template against the static `/out` build: zero violations
- [ ] Keyboard pass on all interactive components; visible focus everywhere
- [ ] Screen reader pass (VoiceOver iOS/macOS + NVDA Windows) on sidebar, filters, gallery, carousel, FAQ
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
