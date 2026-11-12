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
| `cta` / `cta-hover` / `on-cta` | `#2B2926` / `#185A3A` / `#FFFFFF` | Primary button background, hover background and text |
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

### 2.4 Alternative palettes (TEMPORARY review tool)

> **TEMPORARY.** A floating palette switcher (bottom-right on every page) lets the client compare these palettes live. It is controlled by `features.showPaletteSwitcher` in `content/site.ts`. Set it to `false` to hide it in one line.

**How it works**
- Palettes swap **CSS variables only** (`app/palettes.css`, `[data-palette="…"]` blocks). No component hardcodes a colour. Button colours use dedicated tokens: `cta`, `cta-hover`, `on-cta`. The scrim and shadows are derived from `ink` with `color-mix()`.
- An inline script in `<head>` applies the palette **before first paint** from `?palette=<id>` (which takes priority and is also saved) or from `localStorage["sci-palette"]` (wrapped in try/catch). It works in the static export on any host.
- Direct links: `https://<domain>/?palette=block-print` (any page works, e.g. `/catalogue/?palette=marigold`).
- Choosing a palette in the panel updates the address bar, and "Copy link to this palette" copies it.

**Removing it later:** delete `app/palettes.css` (and its import in `app/layout.tsx`), `components/palette/`, `lib/palettes.ts`, the boot `<script>` and `<PaletteSwitcher />` in `app/layout.tsx`, and `showPaletteSwitcher` in `content/site.ts` + `lib/schemas.ts`. **To adopt a palette permanently**, copy its values into `@theme` in `app/globals.css`.

Styles: **calm** palettes (Classic, Sage & Brass) keep buttons dark and use the accent sparingly. **Bold highlight** palettes (Block Print, Blush & Teal, Marigold) pair 2–3 base colours with one strong highlight on primary buttons, links, hover states and the active carousel dot. Every value below was checked with the WCAG 2.1 formula. All text pairs are ≥ 4.5:1 and UI indicators ≥ 3:1.

#### Classic (`?palette=classic`), calm · default

Ivory, linen and charcoal with a forest-green accent. Primary buttons are charcoal.

| Token | Hex |  | Token | Hex |
|---|---|---|---|---|
| `ivory` | `#FAF8F4` |  | `accent` | `#1F6B45` |
| `white` | `#FFFFFF` |  | `accent-hover` | `#185A3A` |
| `linen` | `#F3EFE8` |  | `accent-dot` | `#2E8B57` |
| `greige` | `#E8E2D8` |  | `accent-tint` | `#E6F0EA` |
| `hairline` | `#D9D2C5` |  | `indigo` | `#3F4A7A` |
| `stone` | `#8A8378` |  | `cta` | `#2B2926` |
| `ink` | `#2B2926` |  | `cta-hover` | `#185A3A` |
| `ink-soft` | `#3D3A35` |  | `on-cta` | `#FFFFFF` |
| `muted` | `#625C53` |  |  |  |

| Check (min) | on ivory | on white | on linen | on greige |
|---|---|---|---|---|
| `ink` text (4.5) | 13.67 | 14.50 | 12.65 | 11.26 |
| `muted` text (4.5) | 6.24 | 6.61 | 5.77 | 5.13 |
| `accent` text (4.5) | 6.10 | 6.47 | 5.64 | 5.02 |
| `accent-hover` text (4.5) | 7.73 | 8.20 | 7.15 | 6.36 |

| Pair (min) | Ratio |
|---|---|
| `on-cta` on `cta` (4.5) | 14.50 |
| `on-cta` on `cta-hover` (4.5) | 8.20 |
| white on `accent` (WhatsApp button, 4.5) | 6.47 |
| `accent` on `accent-tint` (4.5) | 5.55 |
| `accent-dot` on ivory (UI, 3.0) | 4.00 |
| `stone` on ivory / white / linen (UI, 3.0) | 3.54 / 3.75 / 3.27 |
| `indigo` focus ring on ivory / greige (3.0) | 8.01 / 6.59 |

#### Block Print (`?palette=block-print`), bold highlight

Sand and terracotta clay bands with a **deep indigo** highlight, inspired by hand-block printing. Primary buttons, links and the active dot are indigo.

| Token | Hex |  | Token | Hex |
|---|---|---|---|---|
| `ivory` | `#FBF5EE` |  | `accent` | `#2F3E8C` |
| `white` | `#FFFDFA` |  | `accent-hover` | `#232F6E` |
| `linen` | `#F5E7DA` |  | `accent-dot` | `#3B4DA8` |
| `greige` | `#E6C7AF` |  | `accent-tint` | `#E5E8F5` |
| `hairline` | `#DDC2AC` |  | `indigo` | `#2F3E8C` |
| `stone` | `#9A7F6C` |  | `cta` | `#2F3E8C` |
| `ink` | `#2E2420` |  | `cta-hover` | `#232F6E` |
| `ink-soft` | `#42352F` |  | `on-cta` | `#FFFFFF` |
| `muted` | `#634A40` |  |  |  |

| Check (min) | on ivory | on white | on linen | on greige |
|---|---|---|---|---|
| `ink` text (4.5) | 13.96 | 14.89 | 12.47 | 9.47 |
| `muted` text (4.5) | 7.51 | 8.00 | 6.70 | 5.09 |
| `accent` text (4.5) | 8.86 | 9.45 | 7.92 | 6.01 |
| `accent-hover` text (4.5) | 11.39 | 12.14 | 10.17 | 7.72 |

| Pair (min) | Ratio |
|---|---|
| `on-cta` on `cta` (4.5) | 9.60 |
| `on-cta` on `cta-hover` (4.5) | 12.33 |
| white on `accent` (WhatsApp button, 4.5) | 9.60 |
| `accent` on `accent-tint` (4.5) | 7.86 |
| `accent-dot` on ivory (UI, 3.0) | 6.90 |
| `stone` on ivory / white / linen (UI, 3.0) | 3.45 / 3.68 / 3.08 |
| `indigo` focus ring on ivory / greige (3.0) | 8.86 / 6.01 |

#### Sage & Brass (`?palette=sage-brass`), calm

Soft sage and linen with an **antique brass** accent. Primary buttons are deep green-charcoal and turn brass on hover. Links are brass.

| Token | Hex |  | Token | Hex |
|---|---|---|---|---|
| `ivory` | `#F7F7F1` |  | `accent` | `#7A5718` |
| `white` | `#FFFFFC` |  | `accent-hover` | `#5F4311` |
| `linen` | `#ECEFE5` |  | `accent-dot` | `#A27A2E` |
| `greige` | `#DDE3D4` |  | `accent-tint` | `#F3EBD9` |
| `hairline` | `#CDD4C3` |  | `indigo` | `#3E5A4A` |
| `stone` | `#7F8A78` |  | `cta` | `#253028` |
| `ink` | `#253028` |  | `cta-hover` | `#5F4311` |
| `ink-soft` | `#364238` |  | `on-cta` | `#FFFFFF` |
| `muted` | `#545F55` |  |  |  |

| Check (min) | on ivory | on white | on linen | on greige |
|---|---|---|---|---|
| `ink` text (4.5) | 12.75 | 13.68 | 11.78 | 10.45 |
| `muted` text (4.5) | 6.21 | 6.67 | 5.74 | 5.09 |
| `accent` text (4.5) | 6.10 | 6.54 | 5.63 | 5.00 |
| `accent-hover` text (4.5) | 8.50 | 9.12 | 7.85 | 6.97 |

| Pair (min) | Ratio |
|---|---|
| `on-cta` on `cta` (4.5) | 13.71 |
| `on-cta` on `cta-hover` (4.5) | 9.14 |
| white on `accent` (WhatsApp button, 4.5) | 6.55 |
| `accent` on `accent-tint` (4.5) | 5.52 |
| `accent-dot` on ivory (UI, 3.0) | 3.64 |
| `stone` on ivory / white / linen (UI, 3.0) | 3.36 / 3.61 / 3.11 |
| `indigo` focus ring on ivory / greige (3.0) | 7.06 / 5.79 |

#### Blush & Teal (`?palette=blush-teal`), bold highlight

Ivory and soft blush clay with a **deep teal** highlight. Primary buttons, links and the active dot are teal.

| Token | Hex |  | Token | Hex |
|---|---|---|---|---|
| `ivory` | `#FCF7F4` |  | `accent` | `#0E5F63` |
| `white` | `#FFFFFF` |  | `accent-hover` | `#0A4A4D` |
| `linen` | `#F7EAE4` |  | `accent-dot` | `#16777C` |
| `greige` | `#EFD9D0` |  | `accent-tint` | `#DDEEEE` |
| `hairline` | `#E5CCC2` |  | `indigo` | `#0E5F63` |
| `stone` | `#927A75` |  | `cta` | `#0E5F63` |
| `ink` | `#2C2526` |  | `cta-hover` | `#0A4A4D` |
| `ink-soft` | `#41383A` |  | `on-cta` | `#FFFFFF` |
| `muted` | `#6B5A5A` |  |  |  |

| Check (min) | on ivory | on white | on linen | on greige |
|---|---|---|---|---|
| `ink` text (4.5) | 14.11 | 15.00 | 12.75 | 11.08 |
| `muted` text (4.5) | 6.10 | 6.49 | 5.52 | 4.79 |
| `accent` text (4.5) | 6.96 | 7.41 | 6.29 | 5.47 |
| `accent-hover` text (4.5) | 9.41 | 10.00 | 8.50 | 7.39 |

| Pair (min) | Ratio |
|---|---|
| `on-cta` on `cta` (4.5) | 7.41 |
| `on-cta` on `cta-hover` (4.5) | 10.00 |
| white on `accent` (WhatsApp button, 4.5) | 7.41 |
| `accent` on `accent-tint` (4.5) | 6.18 |
| `accent-dot` on ivory (UI, 3.0) | 4.98 |
| `stone` on ivory / white / linen (UI, 3.0) | 3.75 / 3.99 / 3.39 |
| `indigo` focus ring on ivory / greige (3.0) | 6.96 / 5.47 |

#### Marigold (`?palette=marigold`), bold highlight

Warm cream with a **saffron** highlight. Primary buttons are saffron with dark text. Links use a darkened burnt-saffron so they pass AA.

| Token | Hex |  | Token | Hex |
|---|---|---|---|---|
| `ivory` | `#FFFBF3` |  | `accent` | `#8F4A00` |
| `white` | `#FFFFFF` |  | `accent-hover` | `#713A00` |
| `linen` | `#FBF1DC` |  | `accent-dot` | `#C27400` |
| `greige` | `#F3E3C3` |  | `accent-tint` | `#FCEBCB` |
| `hairline` | `#E9D6B0` |  | `indigo` | `#5A3A8C` |
| `stone` | `#9A8565` |  | `cta` | `#E8A019` |
| `ink` | `#2A241C` |  | `cta-hover` | `#D18A0B` |
| `ink-soft` | `#3E362B` |  | `on-cta` | `#2A241C` |
| `muted` | `#66573F` |  |  |  |

| Check (min) | on ivory | on white | on linen | on greige |
|---|---|---|---|---|
| `ink` text (4.5) | 14.88 | 15.36 | 13.69 | 12.13 |
| `muted` text (4.5) | 6.78 | 7.00 | 6.24 | 5.53 |
| `accent` text (4.5) | 6.46 | 6.67 | 5.95 | 5.27 |
| `accent-hover` text (4.5) | 8.82 | 9.10 | 8.11 | 7.19 |

| Pair (min) | Ratio |
|---|---|
| `on-cta` on `cta` (4.5) | 6.93 |
| `on-cta` on `cta-hover` (4.5) | 5.38 |
| white on `accent` (WhatsApp button, 4.5) | 6.67 |
| `accent` on `accent-tint` (4.5) | 5.68 |
| `accent-dot` on ivory (UI, 3.0) | 3.51 |
| `stone` on ivory / white / linen (UI, 3.0) | 3.44 / 3.55 / 3.16 |
| `indigo` focus ring on ivory / greige (3.0) | 8.41 / 6.86 |

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
