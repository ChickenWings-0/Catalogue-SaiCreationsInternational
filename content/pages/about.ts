import type { AboutPageInput } from "@/lib/schemas";

export const aboutPage: AboutPageInput = {
  title: "About Us",
  // TODO(client): short intro line
  intro: "A house of home furnishing and handicrafts, built on craft, care and long relationships.",
  sections: [
    {
      id: "the-initiative",
      eyebrow: "Our beginnings",
      heading: "The Initiative",
      // TODO(client): The Initiative text (150–300 words): founding story, purpose, craft heritage
      body: [
        "SAI Creations International began with a simple idea: to bring the skill of traditional artisans to homes around the world, without losing what makes their work special.",
        "From the start, we worked directly with craftspeople: block printers, weavers, wood carvers and metalworkers. We built relationships based on fair work and mutual respect, and on a shared pride in doing things properly.",
        "This placeholder text will be replaced with the company's own account of how the initiative started and what it set out to do.",
      ],
      // TODO(client): 2–3 photos (workshop, artisans, early days)
      images: [
        {
          src: "placeholders/about/initiative-1.jpg",
          alt: "Artisan carving a wooden printing block",
        },
        {
          src: "placeholders/about/initiative-2.jpg",
          alt: "Early work samples laid out on a table",
        },
      ],
    },
    {
      id: "the-present",
      eyebrow: "Today",
      heading: "The Present",
      // TODO(client): The Present text (150–300 words): what the company does today
      body: [
        "Today we design and produce home decor, outdoor decor, wall decor and seasonal collections for homes, retailers and design studios.",
        "Our team works closely with each artisan group, from sampling to finishing and packing, so every piece meets the same standard of quality and care.",
        "This placeholder text will be replaced with the company's own description of its capabilities, markets, team and values.",
      ],
      // TODO(client): 2–3 photos (team, current workshop, products)
      images: [
        { src: "placeholders/about/present-1.jpg", alt: "The SAI Creations team in the workshop" },
        { src: "placeholders/about/present-2.jpg", alt: "Finished products ready for dispatch" },
      ],
    },
  ],
  faqHeading: "Frequently asked questions",
  seo: {
    description:
      "The story of SAI Creations International: The Initiative that started it, and The Present: who we are and what we make today.",
  },
};
