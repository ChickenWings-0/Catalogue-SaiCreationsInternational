import type { StudioPageInput } from "@/lib/schemas";

/*
 * THE STUDIO: the client's own film (scroll-to-fullscreen sequence, docs/STUDIO_INTERACTION_SPEC.md),
 * followed by a carousel of pieces made in their workshops (photos only, not links).
 */

/** A product photo shown whole in the carousel (no names or codes, by client request). */
const piece = (code: string, alt: string) => ({
  image: { src: `products/${code}.jpg`, alt },
  fit: "product" as const,
});

export const studioPage: StudioPageInput = {
  title: "The Studio",
  intro:
    "A closer look at the pieces our artisans make by hand: brass and glass, hand-forged iron, wire and enamel, finished with care in our workshops in Delhi and Uttar Pradesh.",
  video: {
    // The client's film (WhatsApp video, 16 Nov 2026), re-encoded for the web: MP4, WebM and a mobile size.
    src: "/video/studio/studio.mp4",
    srcWebm: "/video/studio/studio.webm",
    srcMobile: "/video/studio/studio-mobile.mp4",
    poster: { src: "studio/video-poster.jpg", alt: "Handcrafted lanterns and terrariums" },
  },
  carousel: {
    heading: "Made in our workshops",
    autoplay: false,
    autoplayDelayMs: 5000,
    slides: [
      piece("sci-hd-013", "Ornate black iron candelabra with five amber tealight glasses"),
      piece("sci-wd-001", "Hanging amber glass star lantern"),
      piece("sci-od-012", "Set of four pastel enamel milk churn planters"),
      piece("sci-hd-001", "Hexagonal brass and glass greenhouse terrarium"),
      piece("sci-sd-001", "Silver wire reindeer"),
      piece("sci-od-026", "Rust-finish wire gazebo plant stand"),
      piece("sci-hd-012", "Set of three textured-glass cube lanterns"),
      piece("sci-sd-002", "Seven-point brass and glass star lantern"),
    ],
  },
  outro: {
    heading: "From our workshop to your home",
    body: "Explore the collections our artisans make by hand.",
    cta: { label: "Explore the catalogue", href: "/catalogue/" },
  },
  seo: {
    description:
      "Inside SAI Creations International: handcrafted lanterns, terrariums, candelabras and decor made by our artisans in Delhi and Uttar Pradesh.",
  },
};
