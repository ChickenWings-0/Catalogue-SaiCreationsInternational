# The Studio: Scroll Interaction Spec

Applies **only to `/studio`**. Component: `StudioScrollVideo` (with `StudioVideo`, `PhotoCarousel`, `PaginationDots`).

Sequence: **inset video → scroll-scrubbed expansion to fullscreen → pinned dead zone → carousel reveal → release to normal scrolling.**

---

## 1. Library choice

**GSAP 3 + ScrollTrigger** (via `@gsap/react`'s `useGSAP` for React-safe setup and cleanup).

| Need | GSAP ScrollTrigger | Framer Motion `useScroll` | CSS scroll-driven animations |
|---|---|---|---|
| Pin a section with correct spacing | ✅ `pin: true`, handles pin-spacer | ❌ manual `position: sticky` + tall wrapper | sticky only |
| Scrub a multi-stage timeline | ✅ timeline + labels, `scrub: 0.6` smoothing | Possible with many `useTransform`s | ✅ but no stage logic |
| Dead zone between stages | ✅ an empty tween / `.to({}, {duration})` | manual maths | manual |
| Responsive + reduced-motion branches | ✅ `gsap.matchMedia()` with auto revert | manual | media queries |
| iOS Safari quirks | ✅ `ignoreMobileResize`, `normalizeScroll`, `anticipatePin` | none | Safari support only recent |
| Licence | Free, incl. commercial | MIT | — |

Decision: GSAP. Framer Motion isn't added. CSS transitions handle everything else on the site.

## 2. Page structure

```
<main id="main">
  <section class="studio-intro">          ← H1 "The Studio" + intro paragraph (normal flow)
  <section class="studio-stage" aria-label="Studio film and gallery">   ← PINNED
     <div class="stage-video">            ← 100vw × 100lvh, absolutely positioned, clip-path animated
        <video …/>
        <div class="stage-scrim"/>         ← darkens slightly as it expands
     </div>
     <div class="stage-heading">           ← optional overlay heading that fades out during expansion
     <div class="stage-carousel">          ← ivory panel + PhotoCarousel, initially hidden
  </section>
  <section class="studio-outro">           ← normal flow: text + CTA to /catalogue
</main>
```

## 3. Scroll stages (desktop / tablet ≥ 768px)

Distances are expressed in viewport heights (vh) of extra scroll while pinned. All are **configurable** via props or `content/pages/studio.ts → interaction`.

| # | Stage (timeline label) | Scroll distance | What happens |
|---|---|---|---|
| 0 | `intro` (before pin) | — | Heading and intro text in normal flow. The stage section scrolls into view showing the **inset video**: `clip-path: inset(18svh 12vw round 4px)`. The video is visible as a centered framed rectangle with ivory margins. It's autoplaying, muted and looping. |
| 1 | `expand` | **100vh** (`expandDistanceVh`) | Pin starts when the stage top hits the viewport top. Scrubbed: `clip-path` inset → `inset(0 0 round 0)`, so the video fills the viewport edge to edge. At the same time the overlay heading fades out and moves up 24px, and the scrim goes 0 → 0.15. |
| 2 | `hold` (dead zone) | **80vh** (`deadZoneVh`, recommended 60–100) | Nothing animates. The video stays fullscreen and pinned. This is the deliberate threshold: the user must keep scrolling through this distance before anything else happens. A subtle scroll cue ("Scroll to explore the collection ↓", fades in at hold start) tells users the page continues. |
| 3 | `reveal` | **60vh** (`revealDistanceVh`) | Scrubbed: an ivory panel fades over the video (opacity 0 → 1), and the carousel heading + cards translate `y: 48px → 0` and fade in (stagger 0.05). The video pauses when the panel reaches full opacity, to save CPU. |
| 4 | `release` | — | Pin ends. The carousel is fully visible and **in normal document flow**, so the user interacts with it without the scroll position fighting them. Further scrolling moves on to the outro. |

Total pinned scroll ≈ **240vh** (default). `end: () => "+=" + totalPx` is computed from window height on refresh.

```
scroll ─────────────────────────────────────────────────────────────────►
        │◄── expand 100vh ──►│◄── hold 80vh ──►│◄─ reveal 60vh ─►│
 inset video ───────► fullscreen ════ pinned, nothing moves ════ carousel in ► unpin
```

### 3.1 Why `clip-path` instead of `transform: scale`
The video element is always full-viewport and `object-cover`. Only its visible window changes. This keeps the image **sharp** (no upscaling blur) and the **crop stable**, because aspect-ratio changes during a scale would shift the framing. Animating `clip-path: inset()` is smooth in all modern browsers. Fallback: if a performance problem shows on low-end Android during QA, switch to `transform: scale()` on a wrapper with a matched aspect ratio.

### 3.2 Timeline sketch

```ts
useGSAP(() => {
  const mm = gsap.matchMedia();

  mm.add({
    full:    '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
    mobile:  '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
    reduced: '(prefers-reduced-motion: reduce)',
  }, (ctx) => {
    const { full, mobile, reduced } = ctx.conditions!;
    if (reduced) return;                       // static layout, see §6

    const vh = () => window.innerHeight / 100;
    const d = {
      expand: expandDistanceVh,
      hold:   mobile ? Math.min(deadZoneVh, 50) : deadZoneVh,
      reveal: mobile ? 40 : revealDistanceVh,
    };
    const inset = mobile ? 'inset(22svh 16px round 4px)' : 'inset(18svh 12vw round 4px)';

    const tl = gsap.timeline({
      defaults: { ease: 'none' },              // scrubbed: linear mapping to scroll
      scrollTrigger: {
        trigger: stageRef.current,
        start: 'top top',
        end: () => '+=' + (d.expand + d.hold + d.reveal) * vh(),
        pin: true,
        scrub: 0.6,                            // slight smoothing
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onLeave: () => setCarouselInteractive(true),
        onEnterBack: () => setCarouselInteractive(false),
      },
    });

    tl.addLabel('expand')
      .fromTo(videoWrap, { clipPath: inset }, { clipPath: 'inset(0px 0px round 0px)', duration: d.expand })
      .to(overlayHeading, { autoAlpha: 0, y: -24, duration: d.expand * 0.5 }, '<')
      .to(scrim, { opacity: 0.15, duration: d.expand }, '<')
      .addLabel('hold')
      .to(scrollCue, { autoAlpha: 1, duration: d.hold * 0.15 })
      .to({}, { duration: d.hold * 0.85 })     // ← dead zone: time passes, nothing moves
      .addLabel('reveal')
      .to(scrollCue, { autoAlpha: 0, duration: d.reveal * 0.2 })
      .to(panel, { autoAlpha: 1, duration: d.reveal }, '<')
      .from(carouselItems, { y: 48, autoAlpha: 0, stagger: 0.05, duration: d.reveal * 0.6 }, '<+=' + d.reveal * 0.3)
      .addLabel('release');
  });

  return () => mm.revert();
}, { scope: rootRef });
```

Using vh values directly as timeline durations makes each stage's share of the scroll exactly proportional to its configured distance.

### 3.3 Scroll-back behaviour
Everything is scrubbed, so scrolling up reverses the stages exactly (carousel out → hold → video shrinks back to inset). The carousel is made non-interactive (`inert`) whenever the pin is active, so a half-revealed carousel can't take focus.

### 3.4 Snapping (optional, off by default)
`snap: { snapTo: 'labelsDirectional', duration: 0.6, delay: 0.1 }` could settle the user at `hold` or `release`. It's **off by default** because snapping can feel like scroll-jacking. We'll evaluate it in QA.

## 4. The video

| Property | Value |
|---|---|
| Attributes | `autoPlay muted loop playsInline preload="metadata" poster="…" disablePictureInPicture` + `aria-hidden="true"` if decorative |
| Sources | `<source src="studio.webm" type="video/webm">` then `<source src="studio.mp4" type="video/mp4">`. Below 768px, swap to `studio-mobile.mp4` via `matchMedia` before setting `src` |
| Pause/play | Visible toggle button in the stage corner (WCAG 2.2.2). The video also auto-pauses when off-screen or the tab is hidden |
| Poster | Shown instantly and used as the LCP candidate (preloaded with `<link rel="preload" as="image">` via `next/image` priority on a sibling `<img>` behind the video) |
| Autoplay failure (Low Power Mode on iOS, data saver) | Poster remains, with a play button overlay. The sequence still works with the poster |

### 4.1 Recommended encoding

| File | Resolution | Codec | Target bitrate / size | Notes |
|---|---|---|---|---|
| `studio.mp4` | 1920×1080 (16:9) | H.264 High, yuv420p, `+faststart` | ~4–5 Mbps · ≤ 8 MB for 12–20 s | Universal fallback. **No audio track** |
| `studio.webm` | 1920×1080 | VP9 (or AV1) | ~2.5–3 Mbps · ≤ 5 MB | Smaller for Chrome/Firefox/Edge |
| `studio-mobile.mp4` | 1280×720 (or 1080×1350 4:5 if the client shoots portrait) | H.264 Main | ~1.5–2 Mbps · ≤ 3 MB | Served < 768px |
| `poster.jpg` / `.webp` | 1920×1080 | WebP q≈75 | ≤ 200 KB | First frame or a curated still |

Example ffmpeg:
```bash
ffmpeg -i master.mov -an -vf "scale=1920:-2,fps=30" -c:v libx264 -profile:v high -crf 23 -preset slow -pix_fmt yuv420p -movflags +faststart studio.mp4
ffmpeg -i master.mov -an -vf "scale=1920:-2,fps=30" -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 studio.webm
ffmpeg -i master.mov -an -vf "scale=1280:-2,fps=30" -c:v libx264 -profile:v main -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart studio-mobile.mp4
```
Content guidance for the client: a 12–20 s seamless loop, slow camera moves, no on-screen text (it gets cropped at different aspect ratios), and the subject centered (safe area: the middle 60% of the frame).

Hosting: files under ~10 MB are fine in `/public/video/studio/` (served as static files by any host). If the client supplies a longer or heavier film, use a host-independent video service (Cloudflare Stream, Mux or Bunny Stream) for adaptive streaming. Don't use Vercel Blob, which would tie the site to Vercel.

## 5. Photo carousel

**Layout recommendation: a centered active card with partially visible neighbours ("peek").** It shows that there's more to see without explanation, feels editorial, and works for both touch and pointer.

| Breakpoint | Active card width | Peek | Card aspect |
|---|---|---|---|
| < 640px | 82vw | ~7vw each side | 4:5 |
| 640–1023px | 60vw | ~15vw | 4:5 |
| ≥ 1024px | min(44vw, 640px) | neighbours at 0.55 opacity, scale 0.92 | 4:5 |

- Engine: Embla (`loop: true`, `align: 'center'`, `containScroll: false`, `skipSnaps: false`, `dragFree: false`, `duration: 30`).
- Inactive cards: `opacity 0.55`, `scale 0.92`, transitioned with 400ms `ease-soft`. Clicking an inactive card scrolls to it.
- Optional caption below the active card (`caption` sans `body-sm`, `title` display). Slides show the company (workshop, process, people) and are **not links**. Clicking only centres the card.
- **Navigation:** swipe/drag (touch-action `pan-y` so vertical page scroll still works), prev/next buttons (44×44, either side of the dots on mobile, overlaid at card edges on desktop), keyboard ← → when the region has focus, and the pagination dots.
- **Autoplay** (`content.carousel.autoplay`, default `false`): `delay` 5000ms. It pauses on `mouseenter` and `focusin`, resumes on leave, and stops permanently after the first manual interaction. A visible pause/play button appears whenever autoplay is enabled. It's never on with reduced motion.
- **Pagination dots** (`PaginationDots`):
  - One dot per slide, centered **under the images**, gap 8px.
  - Inactive: 8×8px circle, `--color-stone`.
  - Active: **28×8px pill** (`border-radius: 9999px`), `--color-accent-dot`, `aria-current="true"`.
  - The `width` and `background-color` transition at 400ms `ease-soft`, so the dot stretches into a pill.
  - Buttons with `aria-label="Go to slide 3 of 8"`, and a 24×24px minimum hit area.
- **Lazy-loading:** `next/image` `loading="lazy"` for all slides except the first two. Slides use `sizes` matching the card widths above.
- **Accessibility:** the region/slide roles from COMPONENTS.md. Off-screen slides are `inert`. A polite live region announces "Slide 3 of 8" only on manual navigation (not autoplay).

## 6. Reduced motion (`prefers-reduced-motion: reduce`)

No pinning, no scrubbing, no scroll-jacking.
- The stage renders as a normal section: the video at full container width in a 16:9 frame. It's **not autoplaying**: the poster shows with a play button the user can press.
- The carousel renders directly below in normal flow, fully visible, with no entry animation. Autoplay is off. Dot width changes are instant.
- Heading and intro text are unchanged.

## 7. Mobile (< 768px) and iOS / Android specifics

| Concern | Handling |
|---|---|
| Address-bar show/hide changes `innerHeight` → re-layout jumps | `ScrollTrigger.config({ ignoreMobileResize: true })`. The video stage is sized with `100lvh` (large viewport) so it stays covered when the bar hides. The text uses `svh`. |
| Pin jitter on iOS Safari | `anticipatePin: 1`, and pin on a plain wrapper (no transforms on ancestors). Test `pinType: 'transform'` vs `'fixed'`. Consider `ScrollTrigger.normalizeScroll(true)` **only if** QA shows momentum issues (it changes scroll feel, so we test before enabling). |
| Shorter timeline | Hold 50vh, reveal 40vh, expand 100vh. Inset frame is `22svh 16px`. |
| Video weight | `studio-mobile.mp4` (≤ 3 MB). Data-saver (`navigator.connection.saveData`) → poster only. |
| Autoplay | Requires `muted` + `playsInline`. Both are set. Low Power Mode blocks autoplay, so the poster fallback applies. |
| Horizontal swipe vs vertical scroll in carousel | Embla handles axis locking. The carousel is outside the pin when interactive (stage 4), so there's no conflict. |
| Very small/landscape phones (height < 500px) | Skip pinning. Use the reduced-motion layout but keep the autoplaying video. |

**QA devices:** iPhone (Safari, current + previous iOS), iPad Safari, Android Chrome (mid-range device, e.g. Pixel or Samsung A-series), desktop Chrome/Safari/Firefox/Edge. Test checks: no jumps at pin start/end, the dead zone is clearly felt, scroll-back reverses cleanly, the orientation change refresh is correct, and there's no horizontal overflow.

## 8. Performance budget

- JS for the Studio route: GSAP core + ScrollTrigger (~45 kB gz) + Embla (~7 kB). They're dynamically imported **only on `/studio`**, so no other route pays for them.
- Animated properties are only `clip-path`, `opacity` and `transform`. `will-change` is applied only while pinned.
- LCP = poster image < 2.5 s on 4G. CLS = 0 (stage has fixed dimensions, carousel space reserved).
- `ScrollTrigger.refresh()` runs after fonts load (`document.fonts.ready`) and after the carousel reports `onReady`.

## 9. Acceptance criteria

- [ ] Desktop: the video starts inset, expands smoothly to edge-to-edge as the user scrolls, and stays pinned.
- [ ] After the video is fullscreen, ~80vh of further scroll (configurable) passes with **no** visual change before the carousel begins to appear.
- [ ] The carousel reveals, then the page unpins and continues normally. Scrolling back reverses everything.
- [ ] Carousel: swipe, drag, arrow buttons and keyboard all work. Dots show a pill for the active slide with animated width. Dots are clickable with correct aria-labels.
- [ ] Autoplay (if enabled) pauses on hover/focus and has a pause button.
- [ ] Reduced motion: no pinning, a static poster with a play button, and a normal carousel.
- [ ] Works on iOS Safari and Android Chrome without jumps. Small landscape phones get the fallback.
- [ ] Lighthouse mobile performance ≥ 90 on `/studio`. No CLS.
- [ ] axe: no violations on `/studio`.
