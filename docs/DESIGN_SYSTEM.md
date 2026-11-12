# Design System

Direction: **quiet luxury, light and warm.** The layout rhythm is inspired by rh.com: full-bleed imagery, generous whitespace, small letter-spaced uppercase labels, hairline rules, and slow, soft motion. **No RH assets, copy or fonts.** Light theme only.

All tokens below become CSS variables in `app/globals.css` (Tailwind v4 `@theme`), so the Tailwind classes are `bg-ivory`, `text-ink`, `font-display`, etc.

---

## 1. Typography

### 1.1 Wordmark / display serif: options

The client's logo typeface is **not** used anywhere on the site.

| Option | Character | Pros | Cons |
|---|---|---|---|
| **Cormorant Garamond** ✅ *default* | Garamond-derived display serif with high contrast, delicate hairlines and tall elegant caps | Closest feel to a thin, classical, letter-spaced wordmark; light weights (300) available; also lovely for editorial headings and italics | Hairlines get fragile below ~14px, so it isn't used for body text |
| **Cinzel** | Roman inscriptional capitals (caps only) | Very "classical", strong monumental presence in uppercase | No lowercase, so it can only be the wordmark; heavier and more formal; less thin and elegant |
| **Bodoni Moda** | Didone with extreme contrast and an optical-size axis | Fashion/editorial glamour; variable `opsz` keeps hairlines crisp | Colder and more "fashion magazine" than "handicraft house"; busier at wide tracking |
| Playfair Display | Transitional/Didone hybrid | Familiar and robust | Overused; the large x-height feels less refined at wide tracking |

**Final pick: Cormorant Garamond** for the wordmark and display headings (H1–H3, pull quotes). Weights loaded: 300, 400, 500, plus 400 italic.

### 1.2 UI / body sans

| Option | Notes |
|---|---|
| **Jost** ✅ *default* | Geometric (Futura-inspired) and calm; it pairs well with Cormorant's classical caps and looks refined in letter-spaced uppercase nav labels. Weights 300, 400, 500. |
| Inter | Maximum screen legibility and neutral. Fallback choice if the client finds Jost too stylised. |
| Montserrat | Wider and more assertive; less quiet. |

Both fonts load through `next/font/google` (self-hosted at build time, `display: swap`, subset `latin`). They're exposed as `--font-display` and `--font-sans`.

### 1.3 Wordmark spec

| Property | Desktop (≥1024) | Tablet (640–1023) | Mobile (<640) |
|---|---|---|---|
| Text | `SAI CREATIONS INTERNATIONAL` (1 line) | 1 line | 2 lines: `SAI CREATIONS` / `INTERNATIONAL` |
| Font | Cormorant Garamond 400 | 400 | line 1: 400 · line 2: 400, smaller |
| Size | 22px | 18px | 17px / 11px |
| Letter-spacing | 0.28em | 0.24em | 0.2em / 0.56em (measured: both lines ≈167px wide at 360px) |
| Case | Uppercase | | |
| Colour | `--color-ink` | | |

It's implemented as real text (good for SEO and accessibility), not an image. Fixed sizes per breakpoint rather than fluid sizing prevent wobble.

### 1.4 Type scale

Base 16px. Display sizes use `clamp()` for fluid scaling between 360px and 1440px.

| Token | Font | Size (mobile → desktop) | Line-height | Tracking | Usage |
|---|---|---|---|---|---|
| `display-xl` | Display 300 | 40 → 72px | 1.05 | -0.01em | Home hero |
| `display-lg` | Display 300 | 34 → 56px | 1.1 | -0.005em | Page titles (H1) |
| `display-md` | Display 400 | 28 → 40px | 1.15 | 0 | Section titles (H2) |
| `display-sm` | Display 400 | 22 → 28px | 1.25 | 0 | Product name, H3 |
| `eyebrow` | Sans 400, UPPERCASE | 11 → 12px | 1.4 | 0.2em | Section labels, nav, tile labels |
| `nav` | Sans 400, UPPERCASE | 13px | 1.4 | 0.16em | Sidebar level-1 items |
| `nav-sub` | Sans 300 | 15px | 1.5 | 0.02em | Sidebar sub-categories |
| `body-lg` | Sans 300 | 18px | 1.65 | 0 | Intro paragraphs |
| `body` | Sans 400 | 16px | 1.65 | 0 | Default body |
| `body-sm` | Sans 400 | 14px | 1.55 | 0.01em | Specs, captions, footer |
| `caption` | Sans 400 | 12px | 1.5 | 0.04em | Image credits, SKU |

Measure: body text max-width is about 68ch (`max-w-prose`). Weight 300 is used only at ≥18px to keep legibility.

## 2. Colour palette

Warm ivory base, charcoal text, and a deepened version of the logo green used sparingly. Contrast ratios below were computed with the WCAG 2.1 formula.

### 2.1 Tokens

| Token | Hex | Role |
|---|---|---|
| `ivory` | `#FAF8F4` | Page background (`body` default) |
| `white` | `#FFFFFF` | Cards, sidebar panel, image mats |
| `linen` | `#F3EFE8` | Soft section bands (alternating) |
| `greige` | `#E8E2D8` | Deeper bands, footer background, image placeholders |
| `hairline` | `#D9D2C5` | Dividers, card borders (decorative only) |
| `stone` | `#8A8378` | Inactive pagination dots, input borders (non-text UI) |
| `ink` | `#2B2926` | Primary text, wordmark, primary button fill |
| `ink-soft` | `#3D3A35` | Long-form body text (optional softer variant) |
| `muted` | `#625C53` | Secondary text, captions, SKU, meta |
| `accent` | `#1F6B45` | Links, active nav item, focus accents, accent button |
| `accent-hover` | `#185A3A` | Hover/pressed state of accent |
| `accent-dot` | `#2E8B57` | Carousel active pill, small non-text indicators |
| `accent-tint` | `#E6F0EA` | Selected filter chip background, subtle highlights |
| `indigo` | `#3F4A7A` | Optional secondary accent: keyboard focus ring, occasional editorial highlight |
| `scrim` | `rgba(20,19,17,0.45)` | Overlay behind sidebar; text-over-image gradient |

The logo green (`#00A651`) is **not** used for text. It's only 3.01:1 on ivory. `accent` is the same hue, deepened to pass AA.

### 2.2 Contrast matrix (text / UI on background)

| Foreground | on ivory `#FAF8F4` | on white | on linen `#F3EFE8` | on greige `#E8E2D8` | Allowed use |
|---|---|---|---|---|---|
| `ink` `#2B2926` | **13.67** | 14.50 | 12.65 | 11.26 | Any text ✅ AAA |
| `ink-soft` `#3D3A35` | **10.67** | 11.32 | 9.88 | 8.79 | Any text ✅ AAA |
| `muted` `#625C53` | **6.24** | 6.61 | 5.77 | 5.13 | Any text ✅ AA |
| `accent` `#1F6B45` | **6.10** | 6.47 | 5.64 | 5.02 | Any text, links ✅ AA |
| `accent-hover` `#185A3A` | **7.73** | 8.20 | 7.15 | 6.36 | Any text ✅ AAA |
| `indigo` `#3F4A7A` | **8.01** | 8.50 | 7.41 | 6.59 | Text, focus ring ✅ |
| `accent-dot` `#2E8B57` | 4.00 | 4.25 | 3.70 | 3.30 | Non-text UI only (≥3:1) ✅; large text only |
| `stone` `#8A8378` | 3.54 | 3.75 | 3.27 | 2.91 | Non-text UI on ivory/white/linen ✅, **not on greige** |
| `hairline` `#D9D2C5` | 1.42 | — | — | — | Decorative dividers only (not meaningful borders) |
| Logo green `#00A651` | 3.01 | 3.19 | 2.79 | 2.48 | ❌ Not for text |

| Inverse pairs | Ratio |
|---|---|
| `white` on `ink` (primary button) | 14.50 ✅ |
| `ivory` on `ink` | 13.67 ✅ |
| `white` on `accent` (accent button) | 6.47 ✅ |
| `accent` on `accent-tint` (selected chip) | 5.55 ✅ |
| White text on images | Always over a gradient scrim reaching ≥45% black behind the text area. Verify per image during QA. |

### 2.3 Usage ratios
About 85% ivory/white/linen, 12% ink text, and ≤3% accent. Green appears in links, the active nav item, the active carousel pill, selected filters and the focus details. Never use it as large fills.

## 3. Spacing scale

Base unit 4px (Tailwind default scale). Named section rhythm:

| Token | Value | Usage |
|---|---|---|
| `space-1…4` | 4 / 8 / 12 / 16px | Inline gaps, icon padding |
| `space-6` | 24px | Card internal padding, grid gap (mobile) |
| `space-8` | 32px | Grid gap (desktop), stack between heading and content |
| `space-12` | 48px | Small section padding (mobile) |
| `section-y` | `clamp(64px, 10vw, 144px)` | Vertical padding of every major section |
| `gutter` | 16px (<640) · 24px (640–1023) · 40px (1024–1439) · 64px (≥1440) | Page side padding (`Container`) |
| `content-max` | 1600px | Max container width; full-bleed media ignores it |
| `prose-max` | 68ch | Running text |

## 4. Breakpoints

Mobile-first. QA widths: **360, 768, 1024, 1440, 1920**.

| Name | Min width | Notes |
|---|---|---|
| (base) | 0 | 360px is the design floor |
| `sm` | 640px | Wordmark becomes one line |
| `md` | 768px | 2→3 column grids, footer 2 cols |
| `lg` | 1024px | Desktop layout, filters inline, full Studio timeline |
| `xl` | 1280px | |
| `2xl` | 1440px | Wider gutters, 4-col product grid |
| `3xl` | 1920px | Cap media heights so hero doesn't become absurdly tall |

Product grid columns: 2 (base) → 3 (`md`) → 4 (`2xl`). Category tiles: 1 → 2 (`md`) → 4 in a row or a 2×2 editorial layout (`lg`).

## 5. Components: visual specs

### 5.1 Buttons
All buttons are uppercase `eyebrow`-style labels (12–13px, 0.18em tracking, sans 500). They have a minimum height of 48px (touch target ≥44px), horizontal padding of 28px, and **square corners** (radius 0). Square corners echo the editorial feel; the only rounded shapes are the pagination dots and pills.

| Variant | Default | Hover / focus-visible | Disabled |
|---|---|---|---|
| `primary` | `ink` fill, `white` text | `accent-hover` fill (400ms) | 40% opacity, `cursor-not-allowed` |
| `secondary` (outline) | 1px `ink` border, `ink` text, transparent | `ink` fill, `white` text | |
| `accent` (WhatsApp enquire) | `accent` fill, white text, WhatsApp icon | `accent-hover` | |
| `ghost` / text link button | `ink` text with 1px underline offset 6px | underline animates to `accent` | |
| `icon` | 44×44 hit area, 20px lucide icon, 1.5 stroke | `accent` colour | |

### 5.2 Links
- Inline body links: `accent`, underline thickness 1px, offset 3px; hover → `accent-hover`.
- Nav/footer links: `ink` (or `muted` in footer), no underline. Hover gives a 1px underline that grows from left (`scaleX` 0→1, 400ms).
- "Arrow links" (e.g. `VIEW ALL HOME DECOR →`): eyebrow style. The arrow nudges 4px right on hover.
- Current page: `aria-current="page"`, `accent` colour.

### 5.3 Cards

**ProductCard**
- Image: aspect **4:5**, `object-cover`, background `greige` while loading. No border, no shadow.
- Hover (pointer devices only): image scales to 1.03 over 1200ms `ease-soft`. An optional second image cross-fades in if one is available.
- Below image (16px gap): product name in `display-sm` (20px on cards), then SKU in `caption`/`muted`, then a one-line material.
- The whole card is one link. The focus-visible ring sits around the image.

**CategoryTile**
- Large image (aspect 4:5 on mobile, 3:4 or 1:1 in the editorial grid), category name overlaid bottom-left in `display-md` white over a bottom gradient scrim, *or* below the image in ink. The final layout is chosen in Phase 2; default is **below the image** (better contrast and simpler).
- Eyebrow `EXPLORE →` below the name.

### 5.4 Forms & filters
- Filter triggers: eyebrow-style text buttons with a chevron. The open panel uses checkboxes with 1px `stone` borders and an `accent` check.
- Selected filters show as chips: `accent-tint` bg, `accent` text, × remove button.
- Sort: native `<select>` styled minimally (accessible by default).

### 5.5 Focus states
`:focus-visible` gives a 2px solid `indigo` outline with 3px offset, on every interactive element. It's never removed. On dark/image backgrounds it switches to a 2px white outline plus a 4px ink shadow.

### 5.6 Imagery
- Hero: full-bleed, 100vw, height `min(88svh, 960px)`, `object-cover`, with an optional subtle Ken Burns effect (disabled with reduced motion).
- Editorial grids: mix 4:5 portraits with one 16:9 landscape per row group (RH-style rhythm).
- Image backgrounds: warm neutrals, consistent across products (photography brief in CONTENT_TODO).

## 6. Motion guidelines

Principle: **slow, soft, purposeful.** Nothing bounces. Everything respects `prefers-reduced-motion`.

| Token | Value | Usage |
|---|---|---|
| `duration-fast` | 200ms | Colour changes, icon hovers |
| `duration-base` | 400ms | Underlines, buttons, dot → pill width |
| `duration-slow` | 700ms | Sidebar slide, overlay fade, section reveals |
| `duration-image` | 1200ms | Image hover zoom |
| `ease-soft` | `cubic-bezier(0.22, 1, 0.36, 1)` | Default (ease-out-quint-like) |
| `ease-in-out-soft` | `cubic-bezier(0.65, 0, 0.35, 1)` | Sidebar, carousel |

Patterns:
- **Sidebar:** panel `translateX(-100%) → 0` (700ms ease-in-out-soft), overlay opacity 0 → 1 (500ms). It closes at ~70% of the duration.
- **Section reveal on scroll:** fade + `translateY(16px → 0)` over 700ms, triggered once at 15% visibility (IntersectionObserver, no GSAP needed). Staggered by 80ms in grids, max 6 items.
- **Pagination dots:** `width` 8px → 28px, `background-color` stone → accent-dot, 400ms ease-soft.
- **Studio scroll sequence:** scroll-scrubbed (no time-based easing). See [STUDIO_INTERACTION_SPEC.md](./STUDIO_INTERACTION_SPEC.md).
- **Reduced motion:** all transforms/zooms are disabled and opacity fades are capped at 150ms. Autoplay is off by default. The Studio has no pinning.
- Never animate layout properties (`top/left/height`) except the dot width, which is tiny and isolated.

## 7. Iconography
- lucide-react: `Menu`, `X`, `Search`, `Mail` (contact), `ChevronDown`, `ChevronLeft/Right`, `ArrowRight`, `Copy`, `MapPin`, `Phone`. Stroke 1.5, size 20 (24 in header).
- Brand icons via `react-icons/fa6`: `FaInstagram`, `FaXTwitter`, `FaLinkedinIn`, `FaPinterestP`, `FaWhatsapp`. Size 18, colour `ink` → `accent` on hover.

## 8. Tailwind v4 token sketch

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-ivory: #FAF8F4;
  --color-white: #FFFFFF;
  --color-linen: #F3EFE8;
  --color-greige: #E8E2D8;
  --color-hairline: #D9D2C5;
  --color-stone: #8A8378;
  --color-ink: #2B2926;
  --color-ink-soft: #3D3A35;
  --color-muted: #625C53;
  --color-accent: #1F6B45;
  --color-accent-hover: #185A3A;
  --color-accent-dot: #2E8B57;
  --color-accent-tint: #E6F0EA;
  --color-indigo: #3F4A7A;

  --font-display: var(--font-cormorant), "Cormorant Garamond", Georgia, serif;
  --font-sans: var(--font-jost), "Jost", system-ui, sans-serif;

  --ease-soft: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out-soft: cubic-bezier(0.65, 0, 0.35, 1);

  --breakpoint-2xl: 90rem;  /* 1440 */
  --breakpoint-3xl: 120rem; /* 1920 */
}

html { color-scheme: light; }  /* light only, no dark mode */
body { background: var(--color-ivory); color: var(--color-ink); }
```
