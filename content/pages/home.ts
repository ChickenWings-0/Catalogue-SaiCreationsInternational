import type { HomePageInput } from "@/lib/schemas";

/*
 * HOME PAGE. Sections render in this order. Reorder or remove entries to change the page
 * (pending client confirmation of the section list).
 */
export const homePage: HomePageInput = {
  sections: [
    {
      type: "hero",
      // TODO(client): hero headline, subline and image(s) (≥ 2400 × 1350, 16:9)
      slides: [
        {
          image: {
            src: "placeholders/home/hero-1.jpg",
            alt: "A calm living room styled with handcrafted pieces",
          },
          eyebrow: "A House of Home Furnishing & Handicrafts",
          heading: "Crafted by hand, made for home",
          subheading:
            "Home, outdoor, wall and seasonal decor, made by artisans who have practised their craft for generations.",
          cta: { label: "Explore the catalogue", href: "/catalogue/" },
        },
        {
          image: {
            src: "placeholders/home/hero-2.jpg",
            alt: "Handwoven textiles in natural tones",
          },
          heading: "Natural materials, honest craft",
          cta: { label: "Home decor", href: "/catalogue/home-decor/" },
        },
        {
          image: {
            src: "placeholders/home/hero-3.jpg",
            alt: "Lanterns and planters on a sunlit terrace",
          },
          heading: "For terraces, courtyards and gardens",
          cta: { label: "Outdoor decor", href: "/catalogue/outdoor-decor/" },
        },
      ],
    },
    {
      type: "categoryTiles",
      // TODO(client): section intro
      heading: "Shop by category",
      intro: "Four collections, each made by hand from natural materials.",
    },
    {
      type: "featuredProducts",
      heading: "Featured pieces",
      limit: 8,
      cta: { label: "View the full catalogue", href: "/catalogue/" },
    },
    {
      type: "studioTeaser",
      // TODO(client): Studio teaser text (30–50 words) and still image
      eyebrow: "The Studio",
      heading: "Inside our workshop",
      body: "Step inside the workshop where every piece begins: the people, the tools and the slow, careful processes behind our collections.",
      media: {
        src: "placeholders/home/studio-teaser.jpg",
        alt: "Artisans at work in the SAI Creations workshop",
      },
      cta: { label: "Visit The Studio", href: "/studio/" },
    },
    {
      type: "aboutTeaser",
      // TODO(client): About teaser text (40–60 words) and image
      eyebrow: "About Us",
      heading: "A house of home furnishing and handicrafts",
      body: "SAI Creations International brings together skilled artisans and thoughtful design to make home furnishings and handicrafts that are meant to be lived with and kept for years.",
      image: {
        src: "placeholders/home/about-teaser.jpg",
        alt: "Hands finishing a handcrafted piece",
      },
      cta: { label: "Our story", href: "/about/" },
    },
  ],
};
