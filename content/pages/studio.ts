import type { StudioPageInput } from "@/lib/schemas";

/*
 * THE STUDIO: a showcase of the company itself (workshop, process, people), not products.
 * The scroll interaction is built in Phase 3 (docs/STUDIO_INTERACTION_SPEC.md).
 */
export const studioPage: StudioPageInput = {
  title: "The Studio",
  // TODO(client): Studio intro (50–100 words)
  intro:
    "Every piece we make begins in the workshop. Step inside to meet the people, the tools and the patient processes behind our collections.",
  video: {
    // TODO(client): replace with the client's own film (12–20 s seamless loop, no audio).
    // PLACEHOLDER: free stock clip "Woman weaving a cloth on a large wooden loom" (Mixkit #4479,
    // Mixkit Stock Video Free License), cut to a 14 s loop. Encode commands: STUDIO_INTERACTION_SPEC §4.1.
    src: "/video/studio/studio.mp4",
    srcWebm: "/video/studio/studio.webm",
    srcMobile: "/video/studio/studio-mobile.mp4",
    poster: {
      src: "placeholders/studio/video-poster.jpg",
      alt: "A weaver working at a wooden hand loom",
    },
  },
  carousel: {
    heading: "Workshop, process and people",
    autoplay: false,
    autoplayDelayMs: 5000,
    // TODO(client): 6–10 photos of the workshop, process and people (≥ 1600 × 2000, 4:5). Not links.
    slides: [
      {
        image: {
          src: "placeholders/studio/slide-01.jpg",
          alt: "Carved wooden blocks ready for printing",
        },
        title: "The blocks",
      },
      {
        image: {
          src: "placeholders/studio/slide-02.jpg",
          alt: "A printer aligning a block on fabric",
        },
        title: "Printing by hand",
      },
      {
        image: { src: "placeholders/studio/slide-03.jpg", alt: "Weaver at a hand loom" },
        title: "At the loom",
      },
      {
        image: { src: "placeholders/studio/slide-04.jpg", alt: "Dyed yarn drying in the sun" },
        title: "Natural dyes",
      },
      {
        image: {
          src: "placeholders/studio/slide-05.jpg",
          alt: "Woodcarver shaping a mirror frame",
        },
        title: "Carving",
      },
      {
        image: { src: "placeholders/studio/slide-06.jpg", alt: "Metalworker hammering brass" },
        title: "Metalwork",
      },
      {
        image: { src: "placeholders/studio/slide-07.jpg", alt: "Quality check of finished pieces" },
        title: "Finishing",
      },
      {
        image: {
          src: "placeholders/studio/slide-08.jpg",
          alt: "The team in the workshop courtyard",
        },
        title: "Our people",
      },
    ],
  },
  outro: {
    heading: "From our workshop to your home",
    body: "Explore the collections our artisans make by hand.",
    cta: { label: "Explore the catalogue", href: "/catalogue/" },
  },
  seo: {
    description:
      "Inside the SAI Creations International workshop: our process, our people and the craft behind every piece.",
  },
};
