# Components

Rules:
- **No hardcoded content.** Every visible string, image and link comes in through props, which pages get from `lib/content.ts`. The only exceptions are generic UI microcopy like "Close menu" and "Next slide", which live in `content/site.ts` → `ui` strings so they're editable too.
- **Server components by default.** `'use client'` is used only where interaction requires it (marked **C** below).
- Styling uses Tailwind design tokens only (no ad-hoc hex values). Class merging goes through `cn()`.
- Every component accepts `className?: string` for layout overrides (not listed below).

Legend: **S** = Server component · **C** = Client component

---

## 1. Layout

### `Header` (S, with C children)
Sticky top bar: hamburger · centered wordmark · search + contact icons.
| Prop | Type | Notes |
|---|---|---|
| `siteName` | `string` | Passed to `Wordmark` |
| `contactHref` | `string` | Contact icon target (`/contact`) |
| `searchEnabled` | `boolean` | `false` → icon shown as placeholder (`aria-disabled`, tooltip "Search coming soon"). **To refine later** |
| `shrinkOnScroll` | `boolean` (default `false`) | Hook point for the future shrink effect. When true, a small client observer toggles `data-scrolled` on the header and CSS handles the rest. **Pending client** |
| `navigation` | `Navigation` | Forwarded to `Sidebar` |

Structure: `<header role="banner">`, `position: sticky; top: 0`, ivory background with a hairline bottom border once the page is scrolled.

### `Wordmark` (S)
Renders the text wordmark as a home link, one line ≥640px and two lines below.
| Prop | Type |
|---|---|
| `text` | `string` (split into "SAI CREATIONS" / "INTERNATIONAL" at the last space) |
| `href` | `string` (default `/`) |
| `as` | `'div' \| 'h1'` (default `div`. Never `h1`, since each page has its own H1) |

### `Sidebar` (C)
Left slide-in drawer built on Radix Dialog.
| Prop | Type | Notes |
|---|---|---|
| `main` | `NavItem[]` | Top group. Children rendered **always expanded and indented** |
| `bottom` | `NavItem[]` | Pinned to bottom (About Us, Contact Us) |
| `labels` | `{ open: string; close: string; title: string }` | a11y strings |

Behaviour:
- The trigger (hamburger) is `Dialog.Trigger`. Radix adds `aria-expanded`, `aria-controls` and `aria-haspopup="dialog"`.
- The overlay is a scrim (`Dialog.Overlay`). Clicking it closes the sidebar. Esc closes it. The X button closes it.
- Focus is trapped while open. Focus goes first to the close button, and returns to the hamburger on close.
- Body scroll is locked (Radix `RemoveScroll`) with scrollbar-gap compensation, so there's no layout shift.
- It closes on route change (`usePathname` effect).
- Content is `<nav aria-label="Main">` inside `Dialog.Content` with a visually-hidden `Dialog.Title`.
- Width: `min(88vw, 380px)`. Animation: translateX, 700ms (see design system). Reduced motion gives a 150ms fade.

### `SidebarNav` (S-compatible, used inside `Sidebar`)
| Prop | Type |
|---|---|
| `items` | `NavItem[]` |
| `currentPath` | `string` (sets `aria-current="page"`) |
| `variant` | `'main' \| 'bottom'` |

Renders nested `<ul>`s. Level-2 items are indented by 20px with lighter weight. There's no toggle.

### `Footer` (S)
| Prop | Type |
|---|---|
| `columns` | `{ heading: string; links: NavItem[] }[]` |
| `socials` | `SocialLink[]` |
| `faqs` | `FAQ[]` (footer subset) |
| `faqLink` | `Link` ("View all FAQs" → `/about#faqs`) |
| `logo` | `ImageAsset` |
| `legalName` | `string` |
| `addressLine` | `string` |

Renders `<footer role="contentinfo">` with link columns, `SocialLinks` under "Contacts", `FAQAccordion` under "FAQs", then the bottom strip (logo · © year · address). The year is computed at build time.

### `SkipLink` (S)
A "Skip to content" link, visible on focus, targeting `#main`.

### `Container` / `Section` (S)
`Container`: max-width + responsive gutters.
`Section` props: `tone: 'ivory' | 'linen' | 'greige' | 'white'`, `spacing: 'default' | 'tight' | 'none'`, `id?`, `as?: 'section' | 'div'`, `labelledBy?`.

## 2. UI primitives

### `Button` (S)
| Prop | Type |
|---|---|
| `variant` | `'primary' \| 'secondary' \| 'accent' \| 'ghost'` |
| `size` | `'md' \| 'lg'` |
| `href?` | `string`. Renders `next/link` (internal) or `<a target="_blank" rel="noopener noreferrer">` (external, auto-detected) |
| `icon?` | `ReactNode` |
| `iconPosition?` | `'start' \| 'end'` |
| …native button props | |

External links get a visually-hidden "(opens in a new tab)".

### `LinkArrow` (S)
Eyebrow-style text link with an animated arrow. Props: `href`, `children`.

### `SectionHeading` (S)
Props: `eyebrow?`, `heading`, `intro?`, `as?: 'h1' | 'h2' | 'h3'`, `align?: 'left' | 'center'`, `id?` (for `aria-labelledby`).

### `ResponsiveImage` (S)
A thin wrapper around `next/image` that takes an `ImageAsset`.
| Prop | Type |
|---|---|
| `image` | `ImageAsset` |
| `sizes` | `string` (required, so we never ship oversized images) |
| `aspect?` | `'4/5' \| '3/4' \| '1/1' \| '16/9' \| '3/2' \| 'auto'` |
| `priority?` | `boolean` (hero/LCP only) |
| `fill?` | `boolean` |

Applies `focalPoint` as `object-position`, a `greige` background while loading, and `alt` from the asset. Uses the global custom loader (`lib/image-loader.ts`), which maps each srcset width to a pre-built WebP in `/img/`. There's no runtime optimisation, so it works on any static host.

### `Breadcrumbs` (S)
Props: `items: { label: string; href?: string }[]`. Renders `<nav aria-label="Breadcrumb">` with an `<ol>` and `aria-current` on the last item. It also outputs `BreadcrumbList` JSON-LD.

### `SocialLinks` (S)
| Prop | Type |
|---|---|
| `links` | `SocialLink[]` |
| `size?` | `'sm' \| 'md'` |
| `showLabels?` | `boolean` (icons only by default, with `aria-label` from `link.label`) |

Maps `platform` to a react-icons/fa6 icon. Links open in a new tab.

### `FAQAccordion` (S)
| Prop | Type | Notes |
|---|---|---|
| `items` | `FAQ[]` | |
| `name` | `string` | Native `<details name>` makes it exclusive (one open at a time) |
| `headingLevel?` | `2 \| 3 \| 4` | Each summary wraps a heading for structure |
| `emitJsonLd?` | `boolean` | FAQPage JSON-LD (on `/about` only) |

Built on native `<details>/<summary>`, with a chevron rotating 180°. The height animation uses `::details-content` + `interpolate-size` where supported. Other browsers fall back to no animation. Works without JS.

## 3. Home

| Component | Type | Props | Notes |
|---|---|---|---|
| `Hero` | C if `slides.length > 1`, else S | `slides`, `autoplay: boolean`, `intervalMs` | Full-bleed image (or Embla fade slideshow), heading/tagline over a scrim, CTA. The first image is `priority`. The slideshow gets a pause button and respects reduced motion |
| `CategoryTiles` | S | `heading`, `intro?`, `categories: Category[]` | 4 `CategoryTile`s |
| `FeaturedProducts` | S | `heading`, `products: Product[]`, `cta?` | Uses `ProductGrid` |
| `StudioTeaser` | S | `heading`, `body`, `media: ImageAsset`, `cta` | Video poster still with a play-style affordance linking to `/studio`. No video on Home (performance) |
| `AboutTeaser` | S | `heading`, `body`, `image`, `cta` | Split image/text layout |
| `HomeSections` | S | `sections: HomeSection[]`, data deps | Switch on `section.type`. This is what makes homepage order/content data-driven (**pending client**) |

## 4. Catalogue

### `CategoryTile` (S)
| Prop | Type |
|---|---|
| `category` | `Category` |
| `size` | `'standard' \| 'large'` (editorial grid on `/catalogue`) |
| `headingLevel?` | `2 \| 3` |

### `ProductCard` (S)
| Prop | Type |
|---|---|
| `product` | `Product` (uses name, code, first 1–2 images, first material) |
| `sizes` | `string` |
| `priority?` | `boolean` |
| `headingLevel?` | `2 \| 3` |

The whole card is a link to `/catalogue/{category}/{slug}`. Hover cross-fades to the second image (pointer devices only).

### `ProductGrid` (S)
| Prop | Type |
|---|---|
| `products` | `Product[]` |
| `columns?` | `{ base: 1 \| 2; md: 2 \| 3; xl: 3 \| 4 }` |
| `emptyState?` | `ReactNode` |

Renders a `<ul>` of `ProductCard`s (list semantics, so screen readers announce the count).

### `CatalogueBrowser` (C)
Client wrapper on category pages that owns filter/sort state and renders `Filters`, `SortSelect` and `ProductGrid`. **Pending client confirmation.**
| Prop | Type |
|---|---|
| `products` | `Product[]` (all products in category, serialised from server) |
| `facets` | `FilterFacets` (`{ materials: Facet[]; colours: Facet[]; sizes: Facet[] }`, with counts) |
| `enabled` | `boolean` (`site.features.catalogueFilters`. When false, it renders the grid only) |
| `labels` | UI strings |

- State syncs to URL query params (`useSearchParams`/`router.replace`, `scroll: false`), so filters are shareable and survive back/forward.
- It uses the pure functions `applyFilters(products, state)` and `sortProducts(products, sort)` from `lib/filters.ts`, which are unit-testable.
- A live region announces "Showing 5 of 8 products".
- The server renders the full unfiltered grid first, so the HTML has all products (SEO + no-JS).

### `Filters` (C)
| Prop | Type |
|---|---|
| `facets` | `FilterFacets` |
| `value` | `FilterState` (`{ materials: string[]; colours: string[]; sizes: SizeBucket[] }`) |
| `onChange` | `(next: FilterState) => void` |
| `onClear` | `() => void` |

Desktop: a horizontal bar of facet triggers (popover checkbox lists) plus selected chips. Mobile: a "Filter & Sort" button that opens a bottom sheet (Radix Dialog). Checkbox groups are `<fieldset>`/`<legend>`.

### `SortSelect` (C)
Props: `value: 'name-asc' | 'name-desc' | 'newest'`, `onChange`, `options: { value; label }[]`. Native `<select>` with a visible label.

### `ProductGallery` (C)
| Prop | Type |
|---|---|
| `images` | `ImageAsset[]` |
| `productName` | `string` (alt fallback, `aria-label`) |

- Main viewer: an Embla carousel (swipe/drag on touch, arrow buttons, keyboard ← →).
- Thumbnails: a second synced Embla strip (vertical on `lg+` to the left, horizontal below the main image on mobile). The active thumb is outlined in `ink`. Thumbs are buttons labelled "View image 2 of 5".
- Only the first image is `priority`. The rest are lazy.
- A single image renders without carousel chrome.
- *Later (optional):* fullscreen zoom lightbox.

### `ProductSpecs` (S)
Props: `product: Product`. Renders a `<dl>` with SKU/code, dimensions (cm + in via `formatDimensions`), materials, technique/finish, care, and optional MOQ/lead time/customisable. Rows with no data are hidden.

### `EnquireButtons` (S)
| Prop | Type |
|---|---|
| `product` | `Pick<Product, 'name' \| 'code' \| 'slug' \| 'category'>` |
| `whatsappUrl` | `string` (built by `buildWhatsAppUrl`, prefilled with name + code + page URL) |
| `instagramUrl` | `string` (`ig.me/m/<handle>` DM link) |
| `googleFormUrl?` | `string` (optional third button, plain link, no prefill) |
| `labels` | `{ whatsapp: string; instagram: string; form?: string; copyCode: string; copied: string }` |

Primary: `accent` "ENQUIRE ON WHATSAPP" button. Secondary: outline "MESSAGE ON INSTAGRAM". Below them is a small `CopyCodeButton` (C) child ("Copy product code SCI-HD-001"), because Instagram can't prefill messages. All open in a new tab.

### `RelatedProducts` (S)
Props: `heading`, `products: Product[]` (max 4). A `ProductGrid` (or a horizontal Embla strip on mobile).

## 5. Studio

Full behaviour is in [STUDIO_INTERACTION_SPEC.md](./STUDIO_INTERACTION_SPEC.md).

### `StudioScrollVideo` (C)
Orchestrates the pinned scroll sequence.
| Prop | Type | Default |
|---|---|---|
| `heading` | `string` | |
| `intro` | `string` | |
| `video` | `VideoAsset` | |
| `carousel` | `StudioPage['carousel']` | |
| `expandDistanceVh` | `number` | 100 |
| `deadZoneVh` | `number` | 80 (mobile 50) |
| `revealDistanceVh` | `number` | 60 |
| `insetFrame` | `{ x: string; y: string; radius: string }` | `{ x: '12vw', y: '18svh', radius: '4px' }` (mobile `{ x: '16px', y: '22svh' }`) |
| `debug` | `boolean` | `false` (shows ScrollTrigger markers in dev) |

Uses `gsap.matchMedia()` to choose the full timeline, the simplified mobile timeline, or the reduced-motion static layout. Cleans up on unmount (`ctx.revert()`).

### `StudioVideo` (C)
Props: `video: VideoAsset`, `playing: boolean`, `className`.
`<video autoPlay muted loop playsInline preload="metadata" poster=…>`. Picks `srcMobile` under 768px via `matchMedia`. It pauses when off-screen (IntersectionObserver) and when the document is hidden. A visible pause/play toggle meets WCAG 2.2.2. It's `aria-hidden` if purely decorative; otherwise it gets an `aria-label`.

### `PhotoCarousel` (C)
| Prop | Type | Default |
|---|---|---|
| `slides` | `StudioSlide[]` | |
| `heading?` | `string` | |
| `autoplay` | `boolean` | `false` |
| `autoplayDelayMs` | `number` | 5000 |
| `loop` | `boolean` | `true` |
| `labels` | `{ region; prev; next; pause; play; slideOf: '{n} of {total}'; goTo: 'Go to slide {n} of {total}' }` | |
| `onReady?` | `(api) => void` | lets `StudioScrollVideo` know layout is measured |

- Embla, centered active card with neighbours peeking (see spec §5).
- Prev/next arrow buttons, swipe/drag, and ← → keys when focus is inside the region.
- Autoplay (`embla-carousel-autoplay`) pauses on hover and on focus-within, and stops completely after any manual interaction. There's a pause/play button whenever autoplay is on. Autoplay is off under reduced motion.
- `role="region"` + `aria-roledescription="carousel"` + `aria-label`. Each slide is `role="group"` + `aria-roledescription="slide"` + `aria-label="3 of 8"`. Inactive slides are `inert` to keep tab order sane.
- Images are lazy-loaded except the first two.
- Renders `PaginationDots` below.

### `PaginationDots` (C)
| Prop | Type |
|---|---|
| `count` | `number` |
| `selectedIndex` | `number` |
| `onSelect` | `(i: number) => void` |
| `label` | `(i, total) => string` ("Go to slide 3 of 8") |
| `tone?` | `'light' \| 'dark'` (dark-bg variant uses white dots) |

- A row of `<button>`s inside `<div role="group" aria-label="Choose slide">`.
- Inactive: 8×8px circle, `stone`. **Active: 28×8px pill, `accent-dot`, `aria-current="true"`.**
- Transition: `width` + `background-color` at 400ms `ease-soft`. Reduced motion makes it instant.
- Hit area is 24×24px minimum via padding, even though the visual dot is 8px (WCAG 2.5.8).

## 6. About, Contact, 404

| Component | Type | Props | Notes |
|---|---|---|---|
| `AboutSectionBlock` | S | `section: AboutSection`, `reverse?: boolean` | `<section id="the-initiative">` with `scroll-margin-top` = header height so anchor links land below the sticky header |
| `ContactDetails` | S | `contact: SiteConfig['contact']` | `<address>` with `tel:` / `mailto:` links |
| `MapPlaceholder` | S | `image`, `mapUrl`, `label` | Static image wrapped in a link to Google Maps (new tab). **No iframe embed** |
| `GoogleFormCta` | S | `href`, `label`, `note?` | External button |
| `NotFound` content | S | from `content/pages/not-found.ts` | Heading, short copy, links to Home + Catalogue, 4 featured products |

## 7. Hooks & utilities

| Name | Purpose |
|---|---|
| `usePrefersReducedMotion()` | Boolean via `matchMedia('(prefers-reduced-motion: reduce)')`, SSR-safe (defaults to `true` until mounted so nothing animates before hydration) |
| `useMediaQuery(q)` | Generic |
| `cn(...)` | `clsx` + `tailwind-merge` |
| `formatDimensions(d, opts)` | "45 × 45 cm (17.7 × 17.7 in)" |
| `applyFilters`, `sortProducts`, `getFilterFacets` | Pure functions in `lib/filters.ts` (unit tested) |
| `buildWhatsAppUrl`, `buildInstagramDmUrl`, `buildGoogleFormUrl` | `lib/enquiry.ts` |
| `buildMetadata(page)`, `organizationJsonLd()`, `productJsonLd()`, `breadcrumbJsonLd()` | `lib/seo.ts` |
