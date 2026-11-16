import type { HomePageInput } from "@/lib/schemas";

/*
 * HOME PAGE. Sections render in this order. Reorder or remove entries to change the page
 * (pending client confirmation of the section list).
 */
export const homePage: HomePageInput = {
  sections: [
    {
      type: "hero",
      // Client approved this hero (illustrated still life and copy) on 2026-11-16.
      slides: [
        {
          image: {
            src: "home/hero.jpg",
            // Keeps the styled objects in view when cropped to portrait on phones.
            focalPoint: { x: 0.72, y: 0.6 },
            alt: "A calm living room styled with handcrafted pieces",
          },
          eyebrow: "A House of Home Furnishing & Handicrafts",
          heading: "Crafted by hand, made for home",
          subheading:
            "Home, outdoor, wall and seasonal decor, made by artisans who have practised their craft for generations.",
          cta: { label: "Explore the catalogue", href: "/catalogue/" },
        },
      ],
    },
    {
      type: "categoryTiles",
      heading: "Shop by category",
      intro: "Four collections, each made by hand in our workshops.",
    },
    {
      type: "featuredProducts",
      heading: "Featured pieces",
      limit: 8,
      cta: { label: "View the full catalogue", href: "/catalogue/" },
    },
    {
      type: "studioTeaser",
      eyebrow: "The Studio",
      heading: "Inside our workshops",
      body: "Watch our pieces come to life and see the craft behind them: brass and glass, hand-forged iron and wire, finished by hand.",
      media: {
        src: "about/initiative-1.jpg",
        alt: "Women artisans at work in the SAI Creations workshop",
      },
      cta: { label: "Visit The Studio", href: "/studio/" },
    },
    {
      type: "aboutTeaser",
      eyebrow: "About Us",
      heading: "Empowering women artisans",
      body: "Our primary initiative creates meaningful livelihoods for women makers with deep, generational craft expertise, through fair pay, safe workplaces and direct access to international buyers.",
      image: {
        src: "about/initiative-2.jpg",
        alt: "Artisans assembling and packing handcrafted products",
      },
      cta: { label: "Our story", href: "/about/" },
    },
  ],
};
