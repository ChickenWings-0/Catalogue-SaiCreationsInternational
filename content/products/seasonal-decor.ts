import type { ProductInput } from "@/lib/schemas";

/*
 * SEASONAL DECOR: festive trees, stars and figures (22 products).
 * Visual-only: photos only. No names, codes or specifications are shown (client request);
 * the code is an internal key used in file names and URLs.
 * The order here is the display order. Photos: assets/images/products/<code>.jpg,
 * imported with `npm run import:images` (mapping in scripts/client-images.mjs).
 * TODO(client): more products to follow.
 */
export const seasonalDecorProducts: ProductInput[] = [
  {
    code: "SCI-SD-001",
    category: "seasonal-decor",
    images: [{ src: "products/sci-sd-001.jpg", alt: "Silver wire reindeer" }],
    featured: true,
  },
  {
    code: "SCI-SD-002",
    category: "seasonal-decor",
    images: [{ src: "products/sci-sd-002.jpg", alt: "Seven-point brass and glass star lantern" }],
    featured: true,
  },
  {
    code: "SCI-SD-003",
    category: "seasonal-decor",
    images: [{ src: "products/sci-sd-003.jpg", alt: "Wire JOY letters" }],
  },
  {
    code: "SCI-SD-004",
    category: "seasonal-decor",
    images: [
      { src: "products/sci-sd-004.jpg", alt: "White wire Christmas tree with scroll pattern" },
    ],
  },
  {
    code: "SCI-SD-005",
    category: "seasonal-decor",
    images: [{ src: "products/sci-sd-005.jpg", alt: "Gold wire Christmas tree with star topper" }],
  },
  {
    code: "SCI-SD-006",
    category: "seasonal-decor",
    images: [{ src: "products/sci-sd-006.jpg", alt: "Pair of green bottle-brush trees" }],
  },
  {
    code: "SCI-SD-007",
    category: "seasonal-decor",
    images: [{ src: "products/sci-sd-007.jpg", alt: "Red cone Christmas tree" }],
  },
  {
    code: "SCI-SD-008",
    category: "seasonal-decor",
    images: [
      { src: "products/sci-sd-008.jpg", alt: "Set of three wire scroll decorations on stands" },
    ],
  },
  {
    code: "SCI-SD-009",
    category: "seasonal-decor",
    images: [{ src: "products/sci-sd-009.jpg", alt: "Silver twig tree on a round base" }],
  },
  {
    code: "SCI-SD-010",
    category: "seasonal-decor",
    images: [{ src: "products/sci-sd-010.jpg", alt: "Gold wire cone tree with bauble top" }],
  },
  {
    code: "SCI-SD-011",
    category: "seasonal-decor",
    images: [{ src: "products/sci-sd-011.jpg", alt: "Silver branch tree on a round base" }],
  },
  {
    code: "SCI-SD-012",
    category: "seasonal-decor",
    images: [{ src: "products/sci-sd-012.jpg", alt: "Silver filigree Christmas tree with star" }],
  },
  {
    code: "SCI-SD-013",
    category: "seasonal-decor",
    images: [{ src: "products/sci-sd-013.jpg", alt: "Layered silver filigree Christmas tree" }],
  },
  {
    code: "SCI-SD-014",
    category: "seasonal-decor",
    images: [{ src: "products/sci-sd-014.jpg", alt: "Tall silver wire cone tree" }],
  },
  {
    code: "SCI-SD-015",
    category: "seasonal-decor",
    images: [{ src: "products/sci-sd-015.jpg", alt: "Small silver wire tree with star" }],
  },
  {
    code: "SCI-SD-016",
    category: "seasonal-decor",
    images: [{ src: "products/sci-sd-016.jpg", alt: "White tiered wire Christmas tree with star" }],
  },
  {
    code: "SCI-SD-017",
    category: "seasonal-decor",
    images: [{ src: "products/sci-sd-017.jpg", alt: "Beaded white and gold cone tree with star" }],
  },
  {
    code: "SCI-SD-018",
    category: "seasonal-decor",
    images: [
      { src: "products/sci-sd-018.jpg", alt: "Wire Christmas tree tealight holder with star" },
    ],
  },
  {
    code: "SCI-SD-019",
    category: "seasonal-decor",
    images: [{ src: "products/sci-sd-019.jpg", alt: "Silver beaded cone tree with star" }],
  },
  {
    code: "SCI-SD-020",
    category: "seasonal-decor",
    images: [{ src: "products/sci-sd-020.jpg", alt: "Slim tiered silver wire tree with star" }],
  },
  {
    code: "SCI-SD-021",
    category: "seasonal-decor",
    images: [{ src: "products/sci-sd-021.jpg", alt: "Silver wire cone tree" }],
  },
  {
    code: "SCI-SD-022",
    category: "seasonal-decor",
    images: [{ src: "products/sci-sd-022.jpg", alt: "Small brass and glass star lantern" }],
  },
];
