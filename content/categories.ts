import type { CategoryInput } from "@/lib/schemas";

// TODO(client): category taglines, intros and tile photos (1200 × 1500 or larger, 4:5)
export const categories: CategoryInput[] = [
  {
    slug: "home-decor",
    name: "Home Decor",
    codePrefix: "HD",
    order: 1,
    tagline: "Textiles, vessels and accents for every room",
    intro:
      "Cushions, throws, vases and trays made by hand, in natural fibres, brass and wood. Pieces that bring warmth and texture to a living space without asking for attention.",
    tileImage: { src: "placeholders/categories/home-decor-tile.jpg", alt: "Home decor collection" },
  },
  {
    slug: "outdoor-decor",
    name: "Outdoor Decor",
    codePrefix: "OD",
    order: 2,
    tagline: "Planters, lanterns and pieces for open air",
    intro:
      "Terracotta, iron and teak, chosen to weather well. Planters, lanterns and garden pieces for terraces, courtyards and gardens.",
    tileImage: {
      src: "placeholders/categories/outdoor-decor-tile.jpg",
      alt: "Outdoor decor collection",
    },
  },
  {
    slug: "wall-decor",
    name: "Wall Decor",
    codePrefix: "WD",
    order: 3,
    tagline: "Mirrors, hangings and art for the wall",
    intro:
      "Carved mirrors, woven baskets, embroidered hangings and metal art. Each piece is finished by hand and brings depth to a bare wall.",
    tileImage: { src: "placeholders/categories/wall-decor-tile.jpg", alt: "Wall decor collection" },
  },
  {
    slug: "seasonal-decor",
    name: "Seasonal Decor",
    codePrefix: "SD",
    order: 4,
    tagline: "Festive pieces, made to be kept",
    intro:
      "Lanterns, wreaths, garlands and ornaments for festivals and celebrations through the year, made to be brought out again season after season.",
    tileImage: {
      src: "placeholders/categories/seasonal-decor-tile.jpg",
      alt: "Seasonal decor collection",
    },
  },
];
