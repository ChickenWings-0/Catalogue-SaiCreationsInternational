# Content Model

All editable content lives in `/content` as **typed TypeScript files**. Components never import those files. They call the async functions in **`/lib/content.ts`**. That boundary is what lets a CMS replace the data source later without touching any page or component.

```
content/*.ts  ──►  lib/schemas.ts (Zod parse at build)  ──►  lib/content.ts (async getters)  ──►  app/ + components/
                                                                    ▲
                                              Phase 7: swap the implementation here for a CMS client
```

---

## 1. Conventions

- **Schemas are the source of truth.** `lib/schemas.ts` defines Zod schemas, and types are derived with `z.infer`. The interfaces below are the readable equivalent.
- **Placeholders** carry a `// TODO(client): <what is needed>` comment on the line above. `npm run content:todo` (script `scripts/content-todo-report.mjs`) lists every remaining marker with file and line. Placeholder images live under `/assets/images/placeholders/`, so `grep "placeholders/"` also finds every unreplaced image.
- **Images:** content gives only `src` (a path relative to `/assets/images/`) and `alt`. At build time `scripts/build-images.mjs` writes resized WebP variants to `/public/img/` and a manifest (`lib/generated/image-manifest.json`) with each original's width/height. `lib/content.ts` fills those in, so editors never type pixel sizes. Absolute URLs (`https://…`, e.g. a CMS CDN later) are passed through and must include width/height.
- **Slugs** are lowercase kebab-case and unique within a category. **Product codes** follow `SCI-<CAT>-<NNN>`: `HD` home, `OD` outdoor, `WD` wall, `SD` seasonal.
- **Dimensions** are stored in **centimetres**. Inches are computed for display.
- **Dates** are ISO `YYYY-MM-DD`.
- **Every image has `alt`.** Alt is required in the schema (an empty string is allowed only with `decorative: true`).

## 2. Types

```ts
// ─── Shared ────────────────────────────────────────────────────────────────
export type CategorySlug =
  | 'home-decor'
  | 'outdoor-decor'
  | 'wall-decor'
  | 'seasonal-decor';

// What editors write in /content:
export interface ImageInput {
  src: string;              // 'placeholders/products/sci-hd-001-a.jpg' (relative to /assets/images/) or absolute URL
  alt: string;              // required, describe the product/scene
  width?: number;           // only needed for absolute URLs
  height?: number;
  decorative?: boolean;
  focalPoint?: { x: number; y: number };
  credit?: string;
}

// What components receive (resolved by lib/content.ts from the image manifest):
export interface ImageAsset {
  src: string;              // same logical path; lib/image-loader.ts maps it to /img/<path>-<w>.webp
  alt: string;
  width: number;            // intrinsic px of the original, used by next/image to avoid layout shift
  height: number;
  decorative?: boolean;     // true → alt="" allowed
  focalPoint?: { x: number; y: number }; // 0–1, maps to object-position (CMS hotspot later)
  credit?: string;
}

export interface VideoAsset {
  src: string;              // MP4 (H.264), required
  srcWebm?: string;         // optional WebM (VP9/AV1)
  srcMobile?: string;       // lighter encode for <768px
  poster: ImageAsset;       // required, also the LCP image
  captionsSrc?: string;     // .vtt, only needed if video ever carries speech/text
}

export interface SeoFields {
  title?: string;           // falls back to page title
  description?: string;     // ≤160 chars
  ogImage?: ImageAsset;     // falls back to site default
  noIndex?: boolean;
}

export interface Link {
  label: string;
  href: string;             // internal path or absolute URL
  external?: boolean;       // → target="_blank" rel="noopener noreferrer"
}

// ─── Category ──────────────────────────────────────────────────────────────
export interface Category {
  slug: CategorySlug;
  name: string;             // 'Home Decor'
  codePrefix: 'HD' | 'OD' | 'WD' | 'SD';
  tagline: string;          // short line on tiles
  intro: string;            // paragraph at top of category page
  tileImage: ImageAsset;    // used on Home + Catalogue tiles
  heroImage?: ImageAsset;   // optional banner on category page
  order: number;            // display order
  seo?: SeoFields;
}

// ─── Product ───────────────────────────────────────────────────────────────
export type SizeBucket = 'small' | 'medium' | 'large';

export interface Dimensions {
  widthCm?: number;
  heightCm?: number;
  depthCm?: number;
  diameterCm?: number;      // for round items (planters, wreaths, plates)
  lengthCm?: number;        // for throws, runners
  note?: string;            // 'Set of 3: 20/25/30 cm'
}

export interface Product {
  id: string;               // stable id, = code by default
  slug: string;             // 'jaipur-block-print-cushion-cover'
  code: string;             // 'SCI-HD-001' (SKU shown on page)
  name: string;
  category: CategorySlug;
  summary: string;          // one line, for cards/meta description
  description: string;      // 1–3 short paragraphs (plain text, \n\n separated; rich text with CMS)
  images: ImageAsset[];     // ≥1; first = card + OG image
  dimensions: Dimensions;
  weightKg?: number;        // display only
  materials: string[];      // ['Cotton', 'Jute']  → filter facet
  colours: string[];        // ['Natural', 'Indigo'] → filter facet
  size: SizeBucket;         // → filter facet
  finish?: string;          // 'Hand-block printed'
  technique?: string;       // 'Hand-woven', 'Hand-carved'
  care?: string;
  featured?: boolean;       // shows in Home "Featured" grid
  dateAdded: string;        // ISO date, drives "Newest" sort
  tags?: string[];
  // Optional B2B fields: audience not yet confirmed. Rendered ONLY when non-empty.
  // Placeholder products leave these unset.
  moq?: string;             // 'Minimum order: 50 pieces'
  leadTime?: string;        // '4–6 weeks'
  seo?: SeoFields;
}

// ─── FAQ ───────────────────────────────────────────────────────────────────
export interface FAQ {
  id: string;
  question: string;
  answer: string;           // plain text; simple paragraphs (\n\n). Links allowed via markdown-lite later
  order: number;
  showInFooter: boolean;    // footer shows a subset; /about shows all
  group?: 'general' | 'orders' | 'shipping' | 'care';
}

// ─── Site config (the ONE place for contact details & external links) ─────
export type SocialPlatform = 'instagram' | 'x' | 'linkedin' | 'pinterest' | 'whatsapp';

export interface SocialLink {
  platform: SocialPlatform;
  label: string;            // accessible label: 'SAI Creations on Instagram'
  url: string;
  handle?: string;          // '@saicreations' (used for ig.me DM link)
}

export interface SiteConfig {
  name: string;             // 'SAI CREATIONS INTERNATIONAL'
  legalName: string;        // 'SAI Creations International'
  tagline: string;          // 'A House of Home Furnishing & Handicrafts'
  url: string;              // from NEXT_PUBLIC_SITE_URL
  logo: ImageAsset;         // '/brand/logo.png'
  contact: {
    email: string;
    phones: { label: string; number: string }[];   // display + tel:
    whatsappNumber: string;  // E.164 digits only, e.g. '919999999999'
    address: { lines: string[]; city: string; region: string; postalCode: string; country: string };
    hours?: string;
    mapUrl: string;          // Google Maps link (the static map image links here; no iframe embed)
    mapImage: ImageAsset;    // static map image (placeholder until supplied)
  };
  socials: SocialLink[];
  googleFormUrl: string;     // plain link, no prefill for now (a prefill field can be added later)
  header: {
    contactHref: string;     // contact icon target: '/contact' (pending client: may become WhatsApp)
  };
  analytics: {
    cloudflareBeaconToken?: string; // Cloudflare Web Analytics (Phase 5); unset → no script
  };
  enquiry: {
    whatsappTemplate: string; // "Hello SAI Creations, I'm interested in {name} ({code}). {url}"
    instagramNote: string;    // helper text: 'Mention code {code} in your message'
  };
  features: {
    headerShrink: boolean;      // pending client
    headerSearch: boolean;      // placeholder icon only for now
    catalogueFilters: boolean;  // pending client
    heroSlideshow: boolean;
  };
  seo: { defaultTitle: string; titleTemplate: string; description: string; ogImage: ImageAsset; twitterHandle?: string };
}

// ─── Navigation ────────────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];      // always rendered expanded (sidebar) — never a dropdown
}
export interface Navigation {
  sidebarMain: NavItem[];    // HOME, PRODUCT CATALOGUE (+4 children), THE STUDIO
  sidebarBottom: NavItem[];  // About Us, Contact Us
  footerColumns: { heading: string; links: NavItem[] }[];
}
// Category children are generated from categories.ts so a new category appears everywhere automatically.

// ─── Page content ──────────────────────────────────────────────────────────
export interface Cta { label: string; href: string; variant?: 'primary' | 'secondary' | 'ghost' }

export type HomeSection =
  | { type: 'hero'; slides: { image: ImageAsset; eyebrow?: string; heading: string; subheading?: string; cta?: Cta }[] }
  | { type: 'categoryTiles'; heading: string; intro?: string }
  | { type: 'featuredProducts'; heading: string; limit: number; cta?: Cta }
  | { type: 'studioTeaser'; heading: string; body: string; media: ImageAsset; cta: Cta }
  | { type: 'aboutTeaser'; heading: string; body: string; image: ImageAsset; cta: Cta };

export interface HomePage { seo?: SeoFields; sections: HomeSection[] }   // order = render order

export interface CataloguePage { title: string; intro: string; allProductsHeading: string; seo?: SeoFields }

export interface AboutSection {
  id: 'the-initiative' | 'the-present';   // anchor ids
  eyebrow?: string;
  heading: string;
  body: string[];                        // paragraphs
  images: ImageAsset[];
  pullQuote?: string;
}
export interface AboutPage { title: string; intro?: string; sections: AboutSection[]; faqHeading: string; seo?: SeoFields }

export interface ContactPage {
  title: string;
  intro: string;
  formCta: Cta;          // href resolved from site.googleFormUrl
  showMap: boolean;
  seo?: SeoFields;
}

// The Studio showcases the company itself (workshop, process, people), not products.
// Slides are not links (for now).
export interface StudioSlide { image: ImageAsset; title?: string; caption?: string }

export interface StudioPage {
  title: string;
  intro: string;
  video: VideoAsset;
  carousel: { heading?: string; slides: StudioSlide[]; autoplay: boolean; autoplayDelayMs: number };
  outro?: { heading: string; body: string; cta?: Cta };
  interaction?: {        // optional overrides of the scroll timeline (see STUDIO_INTERACTION_SPEC)
    expandDistanceVh?: number;   // default 100
    deadZoneVh?: number;         // default 80
    revealDistanceVh?: number;   // default 60
  };
  seo?: SeoFields;
}
```

## 3. `lib/content.ts` API

All functions are `async` and return validated, plain data. They're memoised per build with React `cache()`.

```ts
getSiteConfig(): Promise<SiteConfig>
getNavigation(): Promise<Navigation>

getCategories(): Promise<Category[]>                         // sorted by order
getCategory(slug: string): Promise<Category | null>

getAllProducts(): Promise<Product[]>
getProductsByCategory(slug: CategorySlug): Promise<Product[]>
getProduct(category: string, slug: string): Promise<Product | null>
getFeaturedProducts(limit?: number): Promise<Product[]>
getRelatedProducts(product: Product, limit?: number): Promise<Product[]>  // same category, excl. self
getProductStaticParams(): Promise<{ category: string; slug: string }[]>

getFilterFacets(products: Product[]): FilterFacets           // pure, sync (lib/filters.ts)
getFaqs(opts?: { footerOnly?: boolean }): Promise<FAQ[]>

getHomePage(): Promise<HomePage>
getCataloguePage(): Promise<CataloguePage>
getAboutPage(): Promise<AboutPage>
getContactPage(): Promise<ContactPage>
getStudioPage(): Promise<StudioPage>
```

Helpers in `lib/enquiry.ts`:

```ts
buildWhatsAppUrl(site, product, pageUrl): string
// https://wa.me/919999999999?text=Hello%20SAI%20Creations%2C%20I'm%20interested%20in%20…%20(SCI-HD-001)
buildInstagramDmUrl(site): string      // https://ig.me/m/<handle>
```

Helpers in `lib/utils.ts`:

```ts
formatDimensions(d: Dimensions): string
// { widthCm: 45, heightCm: 30 } → '45 × 30 cm / 17.7 × 11.8 in'   (cm first, inches 1 dp)
// { diameterCm: 30, heightCm: 40 } → 'Ø 30 × 40 cm / Ø 11.8 × 15.7 in'
```

## 4. Example content file

```ts
// content/products/home-decor.ts
import type { ProductInput } from '@/lib/schemas';

export const homeDecorProducts: ProductInput[] = [
  {
    // TODO(client): replace with real product name, code, specs and photos
    code: 'SCI-HD-001',
    slug: 'jaipur-block-print-cushion-cover',
    name: 'Jaipur Block-Print Cushion Cover',
    category: 'home-decor',
    summary: 'Hand-block printed cotton cushion cover in a soft indigo motif.',
    description: 'Placeholder description. …',
    images: [
      // TODO(client): product photos
      { src: 'placeholders/products/sci-hd-001-a.jpg', alt: 'Indigo block-print cushion cover on a linen sofa' },
      { src: 'placeholders/products/sci-hd-001-b.jpg', alt: 'Close-up of block-print motif' },
    ],
    dimensions: { widthCm: 45, heightCm: 45 },
    materials: ['Cotton'],
    colours: ['Indigo', 'Ivory'],
    size: 'small',
    technique: 'Hand-block printed',
    featured: true,
    dateAdded: '2026-09-01',
  },
  // …7 more
];
```

## 5. Placeholder product set (32 items)

Names are realistic but obviously fake and stand in for the real ones. All are marked `TODO(client)`.

| Home Decor (HD) | Outdoor Decor (OD) | Wall Decor (WD) | Seasonal Decor (SD) |
|---|---|---|---|
| 001 Jaipur Block-Print Cushion Cover | 001 Terracotta Lattice Planter | 001 Hand-Carved Mango Wood Mirror | 001 Brass Diya Lantern Set |
| 002 Jute Braided Floor Pouf | 002 Wrought-Iron Garden Lantern | 002 Woven Seagrass Wall Basket Set | 002 Dried Marigold Door Wreath |
| 003 Brass Hammered Bud Vase | 003 Weatherproof Jute-Look Outdoor Rug | 003 Kantha Stitch Wall Hanging | 003 Hand-Painted Wooden Star Ornaments |
| 004 Hand-Loomed Cotton Throw | 004 Teak Slatted Garden Stool | 004 Embossed Brass Wall Plate | 004 Felted Wool Pine Garland |
| 005 Marble Inlay Trinket Box | 005 Galvanised Metal Bird Feeder | 005 Macramé Cotton Wall Panel | 005 Block-Print Festive Table Runner |
| 006 Ceramic Glazed Table Lamp Base | 006 Rattan Hanging Planter | 006 Reclaimed Wood Floating Shelf | 006 Beaded Glass Tealight Holder |
| 007 Sheesham Wood Serving Tray | 007 Stoneware Garden Toadstools (Set of 3) | 007 Hand-Painted Ceramic Tile Art | 007 Embroidered Velvet Stocking |
| 008 Hand-Tufted Wool Accent Rug | 008 Solar Mesh-Metal Lantern | 008 Metal Leaf Wall Sculpture | 008 Papier-Mâché Bauble Set |

Materials vocabulary (filter facet): Cotton, Jute, Wool, Brass, Iron, Mango Wood, Sheesham Wood, Teak, Reclaimed Wood, Rattan, Seagrass, Terracotta, Ceramic, Stoneware, Marble, Glass, Velvet, Felt, Papier-Mâché.
Colours vocabulary: Natural, Ivory, Indigo, Terracotta, Brass/Gold, Black, Green, Red, Multi.

## 6. CMS integration (later, Phase 7)

### 6.1 Comparison

| Criterion | **Sanity** | **TinaCMS** | **Decap CMS** |
|---|---|---|---|
| Where content lives | Sanity Content Lake (hosted API) | Git repo (Markdown/JSON/MDX), Tina Cloud indexes it | Git repo (Markdown/YAML/JSON) |
| Editor UX for a non-technical client | ★★★★★ Polished Studio, custom desk, previews, validation | ★★★★ Visual/inline editing on the live page | ★★★ Functional but dated; few field types |
| Images | ★★★★★ Built-in asset pipeline, CDN, crop + **hotspot**, auto WebP/AVIF | Repo or external media store (Cloudinary etc.) | Committed to repo (repo bloat with hundreds of photos) |
| Structured product data (arrays, references, validation) | Excellent (references, rules, arrays of objects) | Good (schema in TS) | Basic |
| Publishing flow (static export) | Publish → webhook → host **Deploy Hook** → rebuild (1–2 min) | Commit → rebuild (1–2 min) | Commit → rebuild |
| Auth for client | Sanity accounts, invite by email | Tina Cloud accounts | Needs a GitHub OAuth backend on Vercel (Netlify Identity is deprecated) |
| Cost at this scale | Free plan covers it (few users, small dataset) | Free tier for small teams | Free (open source) |
| Vendor lock-in | Medium (GROQ queries; export available) | Low (content stays in git) | Lowest |
| Fit with our TS content layer | Rewrite `lib/content.ts` to GROQ fetch; one-time migration script | Convert `/content/*.ts` → JSON/MD and point `lib/content.ts` at Tina client | Convert to JSON/MD |

### 6.2 Recommendation: **Sanity**

For a **photo-heavy product catalogue edited by a non-technical client**, Sanity wins on the things that matter most. Uploading images is easy and gets focal-point cropping. Sanity's own image CDN does the resizing, which works with any static host and needs no Vercel image API. Product fields can be structured and validated so the client can't break a page. The free plan covers this size of site. Because the site is a static export, a publish triggers a rebuild (~1–2 min) rather than instant revalidation, which is fine at this scale.

**Runner-up: TinaCMS**, if the client or agency prefers content to stay in git with no third-party content store. **Decap** is only worth it if budget or lock-in is the overriding concern.

### 6.3 How it plugs in (no component changes)

1. Host the Sanity Studio (editor UI) on Sanity's free hosting at `<name>.sanity.studio`, kept in a separate `/cms` folder or repo. It isn't embedded in the site, so the site stays a pure static export. (This also avoids a clash with the public `/studio` page.)
2. Define Sanity schemas that mirror §2 (`product`, `category`, `faq`, `siteConfig` singleton, `homePage`/`aboutPage`/`contactPage`/`studioPage` singletons). Category becomes a **reference** on product.
3. Write a one-off migration script: read `/content/*.ts` → push documents and upload images.
4. Re-implement **only** `lib/content.ts`: each getter runs a GROQ query **at build time** and maps the result through the **same Zod schemas**. Images come back as absolute Sanity CDN URLs with width/height from asset metadata. `lib/image-loader.ts` gains one branch that appends `?w=<width>&auto=format` for `cdn.sanity.io` URLs.
5. Publishing: a Sanity webhook (on publish) calls the host's **Deploy Hook** URL (Vercel: Settings → Git → Deploy Hooks; Cloudflare Pages: Settings → Builds → Deploy hooks). No API routes are needed.
6. Build-time env vars: `SANITY_PROJECT_ID`, `SANITY_DATASET`, and `SANITY_API_READ_TOKEN` (only if the dataset is private).
7. Remove `/content` (or keep it as seed data).

Acceptance: `git diff` for Phase 7 touches `lib/`, config and new CMS schema files, and **no** `components/` or page markup. The build is still `output: 'export'`.
