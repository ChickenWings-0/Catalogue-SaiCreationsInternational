# Client Content Checklist

Everything we need from **SAI CREATIONS INTERNATIONAL** to replace the placeholders. Tick items off as they arrive.

In the code, every placeholder is marked `// TODO(client):` in `/content`. Run `npm run content:todo` for a live list with file/line numbers. Placeholder images all live in `/public/placeholders/`.

---

## 0. Status (2026-11-16)

- [x] **Product photos batch 1**: 56 products received and live (Home 11, Outdoor 11, Wall 12, Seasonal 22)
- [ ] **More product photos**: the Home Decor and Garden Decor folders were empty; any further pieces in all categories
- [ ] **Higher-resolution originals** for small images (at least 1500 px on the product's longest side; SCI-OD-002 is the weakest)
- [ ] **Product codes**: the site uses provisional codes (SCI-HD-001 …). Send the client's own codes if they exist
- [ ] **WhatsApp number** for enquiries (every product button uses it)
- [ ] **Lifestyle / hero photos** for the Home page (room settings), plus Studio video and photos
- [ ] Decide: **watermark** product photos with the logo? (stronger anti-copy measure)
- Product names, dimensions and specs are **not needed**: the client chose a visual-only catalogue. §2 below is kept for reference only.

## 1. Brand

- [ ] **Logo, master file**: vector (SVG/AI/EPS/PDF) preferred, otherwise a PNG ≥ 2000px wide with a transparent background
- [ ] Logo variants: full lockup (SC monogram + "Sai Creations Int'l" + tagline), **monogram only** (square, for the favicon), and a one-colour/white version if available
- [ ] Confirm the exact brand name spelling and casing: "SAI CREATIONS INTERNATIONAL" / "SAI Creations International" / "Sai Creations Int'l"
- [ ] Confirm the tagline: "A House of Home Furnishing & Handicrafts"
- [ ] Approve the wordmark font (default: Cormorant Garamond) and the colour palette (see `DESIGN_SYSTEM.md`)
- [ ] Any brand colours to honour (exact logo green hex, if known)

## 2. Products (per product, ×32 placeholders → real count TBC)

Template, one per product (a spreadsheet works well; we can provide one):

| Field | Required | Example |
|---|---|---|
| Category | ✅ | Home Decor / Outdoor Decor / Wall Decor / Seasonal Decor |
| Product name | ✅ | Jaipur Block-Print Cushion Cover |
| Product code / SKU | ✅ | SCI-HD-001 (or the client's own scheme) |
| Short summary (≤ 140 chars) | ✅ | |
| Description (50–150 words) | ✅ | |
| Dimensions (W × H × D, or Ø, in cm) | ✅ | 45 × 45 cm |
| Weight | optional | |
| Materials | ✅ | Cotton, Jute |
| Colours / finishes available | ✅ | Indigo, Natural |
| Technique / craft | optional | Hand-block printed |
| Care instructions | optional | |
| Featured on homepage? | optional | yes/no |
| Date added / collection | optional | for "Newest" sorting |
| MOQ / lead time / customisable | optional (B2B) | 50 pcs / 4–6 weeks / yes |
| Photos | ✅ | see §3 |

- [ ] Confirm the final **category list** (4 categories as planned?) and whether sub-categories are needed
- [ ] Confirm the **filter facets** (material, colour, size) and the size buckets (Small/Medium/Large definitions)

## 3. Photography

- [ ] **Product photos:** 2–5 per product. Ideally 1 clean shot on a consistent neutral background, 1 lifestyle/in-room shot and 1 detail close-up
  - Format: JPG/PNG/HEIC/RAW, **≥ 2000px on the long edge**, **4:5 portrait** preferred (or with enough room to crop to 4:5)
  - Consistent lighting and background across the catalogue
  - File naming: `SCI-HD-001_01.jpg`, `SCI-HD-001_02.jpg` …
- [ ] **Home hero:** 1–3 landscape images, ≥ 2400 × 1350px (16:9), with calm space for the tagline text
- [ ] **Category tile images:** 1 per category (4), ≥ 1600 × 2000px (4:5)
- [ ] **About page images:** The Initiative (2–3) and The Present (2–3): workshop, artisans, team, premises
- [ ] **Studio carousel photos:** 6–10 images of the company (workshop, process, people), ≥ 1600 × 2000px (4:5). Optional short title/caption per photo
- [ ] **Social share (OG) image:** we can create one from the logo + a hero photo (1200 × 630)
- [ ] Confirm image **usage rights** / photographer credits for all photos

## 4. The Studio

- [ ] **Studio video** (the site currently uses a free Mixkit stock clip of loom weaving as a placeholder): 12–20 s, loopable, no audio needed, no on-screen text, subject centered. Master in the highest quality available (ProRes/H.264 4K or 1080p). We'll handle compression (see `STUDIO_INTERACTION_SPEC.md` §4)
- [ ] Portrait version for mobile (optional, 4:5 or 9:16)
- [ ] Poster/still frame (or we'll take one from the video)
- [ ] Studio page heading + intro text (50–100 words) + outro text and CTA

## 5. Page copy

- [ ] **Home:** hero headline + subline (or slide-by-slide), category section intro, featured section title, Studio teaser text (30–50 words), About teaser text (40–60 words)
- [ ] **Catalogue:** intro paragraph (40–80 words)
- [ ] **Each category:** tagline (≤ 10 words) + intro (40–80 words) ×4
- [ ] **About, The Initiative:** heading + 150–300 words (founding story, purpose, craft heritage)
- [ ] **About, The Present:** heading + 150–300 words (what the company does today: capabilities, markets, team, values)
- [ ] Optional pull quote / founder quote
- [ ] **Contact page:** intro line (e.g. "We'd love to hear from you…")
- [ ] **404 page:** a friendly line (we can write this)
- [ ] SEO: a 1-sentence company description (≤ 160 chars) for search results

## 6. FAQs

- [ ] 6–12 FAQ questions + answers (e.g. ordering process, custom orders, MOQ, shipping/export, lead times, materials/care, sample requests, visiting the studio)
- [ ] Which 3–5 should appear in the **footer** (the rest go on the About page)

## 7. Contact details & links (all go into `content/site.ts`)

- [ ] Registered/business **address** (full, with postal code), plus the address line for the footer
- [ ] **Phone number(s)** with labels (e.g. Sales, Office)
- [ ] **WhatsApp number** for enquiries (with country code). Is it a WhatsApp Business account?
- [ ] Preferred **WhatsApp prefilled message** wording (default: "Hello SAI Creations, I'm interested in {product name} ({code}). {link}")
- [ ] **Email address** for enquiries
- [ ] Business hours (optional)
- [ ] **Google Maps** link to the business location (the site shows a static map image linking to it, no embed). Optional: a nicer static map screenshot
- [ ] **Instagram** URL + handle
- [ ] **X (Twitter)** URL
- [ ] **LinkedIn** URL (company page)
- [ ] **Pinterest** URL
- [ ] Any other channels (Facebook, YouTube, IndiaMART …)? Or should any of the five be removed if unused?
- [ ] **Google Form** URL for enquiries (plain link; product-code prefill may come later)

## 8. Domain, hosting & accounts

- [ ] **Domain name** and **registrar**
- [ ] **DNS access**: registrar login, or someone who can add records on request
- [ ] Is **email** set up on this domain, and with which provider? (If so, all existing MX/TXT records must be kept exactly as they are)
- [x] Main address is decided: **bare `domain`**, with `www` redirecting to it
- [x] Hosting is decided: Vercel Hobby, fully static (portable to Cloudflare Pages)
- [ ] **GitHub:** whose organisation owns the repository
- [ ] Analytics is decided: **Cloudflare Web Analytics**. Needs a free Cloudflare account and its beacon token (Phase 5)
- [ ] Google Search Console: who should own it (client Google account)

## 9. Decisions pending (from PLAN.md)

- [ ] Homepage sections and order
- [ ] Filters & sorting on category pages: keep, change or drop?
- [ ] Header shrink-on-scroll: yes/no
- [ ] Header search: needed at launch?
- [ ] Header contact icon: go to the Contact page, or open WhatsApp directly?
- [ ] Audience: retail, trade/B2B, or both (affects MOQ/lead-time fields)
- [ ] Language(s): English only?
- [ ] CMS phase: timing, who will edit, and approval of **Sanity** as the CMS
