import type { CategoryInput } from "@/lib/schemas";

// TODO(client): confirm category taglines and intros. Tile photos use a product photo.
export const categories: CategoryInput[] = [
  {
    slug: "home-decor",
    name: "Home Decor",
    codePrefix: "HD",
    order: 1,
    tagline: "Candelabras, terrariums and glassware",
    intro:
      "Hand-forged iron candelabras, brass-framed glass terrariums, display boxes, trays and vessels, each piece finished by hand.",
    tileImage: {
      src: "products/sci-hd-013.jpg",
      alt: "Ornate black iron candelabra with five amber tealight glasses",
    },
  },
  {
    slug: "outdoor-decor",
    name: "Outdoor Decor",
    codePrefix: "OD",
    order: 2,
    tagline: "Garden planters, lanterns and cushions",
    intro:
      "Milk churn planters, galvanised tubs, wire baskets, garden cushions and brass and glass lanterns for terraces, courtyards and gardens.",
    tileImage: {
      src: "products/sci-od-012.jpg",
      alt: "Set of four pastel enamel milk churn planters",
    },
  },
  {
    slug: "wall-decor",
    name: "Wall Decor",
    codePrefix: "WD",
    order: 3,
    tagline: "Sconces, candle holders and wall pieces",
    intro:
      "Hand-forged iron sconces, candle holders, planters and hanging lanterns that bring light and character to a wall.",
    tileImage: { src: "products/sci-wd-001.jpg", alt: "Hanging amber glass star lantern" },
  },
  {
    slug: "seasonal-decor",
    name: "Seasonal Decor",
    codePrefix: "SD",
    order: 4,
    tagline: "Festive pieces, made to be kept",
    intro:
      "Wire trees, stars, lanterns and festive figures, handmade to be brought out again season after season.",
    tileImage: { src: "products/sci-sd-001.jpg", alt: "Silver wire reindeer" },
  },
];
