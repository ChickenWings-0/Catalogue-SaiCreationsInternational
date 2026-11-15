import type { CategoryInput } from "@/lib/schemas";

// TODO(client): confirm category taglines and intros. Tile photos use a product photo for now.
export const categories: CategoryInput[] = [
  {
    slug: "home-decor",
    name: "Home Decor",
    codePrefix: "HD",
    order: 1,
    tagline: "Terrariums, glass boxes and trays",
    intro:
      "Brass-framed glass terrariums, display boxes, trays and vessels, each piece cut, soldered and finished by hand.",
    tileImage: { src: "products/sci-hd-001.jpg", alt: "Brass and glass greenhouse terrarium" },
  },
  {
    slug: "outdoor-decor",
    name: "Outdoor Decor",
    codePrefix: "OD",
    order: 2,
    tagline: "Lanterns for terraces and gardens",
    intro:
      "Brass and glass lanterns in many shapes and sizes, made by hand to bring a soft glow to terraces, courtyards and gardens.",
    tileImage: { src: "products/sci-od-001.jpg", alt: "Brass and glass lantern with carry handle" },
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
