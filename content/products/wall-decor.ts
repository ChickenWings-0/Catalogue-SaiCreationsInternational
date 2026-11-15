import type { ProductInput } from "@/lib/schemas";

/*
 * WALL DECOR: sconces, candle holders and hanging lanterns (12 products, client photos batch 1).
 * Visual-only: photo + reference code, no names or specifications (client request).
 * The order here is the display order. Photos: assets/images/products/<code>.jpg,
 * imported with `npm run import:images` (mapping in scripts/client-images.mjs).
 * TODO(client): more products to follow; codes are provisional.
 */
export const wallDecorProducts: ProductInput[] = [
  {
    code: "SCI-WD-001",
    category: "wall-decor",
    images: [{ src: "products/sci-wd-001.jpg", alt: "Hanging amber glass star lantern" }],
    featured: true,
  },
  {
    code: "SCI-WD-002",
    category: "wall-decor",
    images: [
      {
        src: "products/sci-wd-002.jpg",
        alt: "Tall black iron wall sconce with circle and square motifs",
      },
    ],
    featured: true,
  },
  {
    code: "SCI-WD-003",
    category: "wall-decor",
    images: [
      { src: "products/sci-wd-003.jpg", alt: "White wire owl family wall planter with four pots" },
    ],
  },
  {
    code: "SCI-WD-004",
    category: "wall-decor",
    images: [
      { src: "products/sci-wd-004.jpg", alt: "Black iron ring wall sconce with red glass votive" },
    ],
  },
  {
    code: "SCI-WD-005",
    category: "wall-decor",
    images: [
      {
        src: "products/sci-wd-005.jpg",
        alt: "White iron wall sconce with rings and glass candle holder",
      },
    ],
  },
  {
    code: "SCI-WD-006",
    category: "wall-decor",
    images: [
      {
        src: "products/sci-wd-006.jpg",
        alt: "Black iron wall sconce with square motifs and patterned glass",
      },
    ],
  },
  {
    code: "SCI-WD-007",
    category: "wall-decor",
    images: [
      { src: "products/sci-wd-007.jpg", alt: "Wire owl family wall holder with four rings" },
    ],
  },
  {
    code: "SCI-WD-008",
    category: "wall-decor",
    images: [
      { src: "products/sci-wd-008.jpg", alt: "Black iron wall candle holder with three cups" },
    ],
  },
  {
    code: "SCI-WD-009",
    category: "wall-decor",
    images: [{ src: "products/sci-wd-009.jpg", alt: "Black iron ring wall candle holder" }],
  },
  {
    code: "SCI-WD-010",
    category: "wall-decor",
    images: [
      { src: "products/sci-wd-010.jpg", alt: "Slim black iron wall sconce with square motifs" },
    ],
  },
  {
    code: "SCI-WD-011",
    category: "wall-decor",
    images: [{ src: "products/sci-wd-011.jpg", alt: "Black wire owl wall decoration" }],
  },
  {
    code: "SCI-WD-012",
    category: "wall-decor",
    images: [
      { src: "products/sci-wd-012.jpg", alt: "Black iron wall candle holder with two cups" },
    ],
  },
];
