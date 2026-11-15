import type { ProductInput } from "@/lib/schemas";

/*
 * OUTDOOR DECOR: lanterns (11 products, client photos batch 1).
 * Visual-only: photo + reference code, no names or specifications (client request).
 * The order here is the display order. Photos: assets/images/products/<code>.jpg,
 * imported with `npm run import:images` (mapping in scripts/client-images.mjs).
 * TODO(client): more products to follow; codes are provisional.
 */
export const outdoorDecorProducts: ProductInput[] = [
  {
    code: "SCI-OD-001",
    category: "outdoor-decor",
    images: [{ src: "products/sci-od-001.jpg", alt: "Brass and glass lantern with carry handle" }],
    featured: true,
  },
  {
    code: "SCI-OD-002",
    category: "outdoor-decor",
    images: [
      { src: "products/sci-od-002.jpg", alt: "Lantern with red glass panels and domed metal top" },
    ],
    featured: true,
  },
  {
    code: "SCI-OD-003",
    category: "outdoor-decor",
    images: [
      {
        src: "products/sci-od-003.jpg",
        alt: "Tall hexagonal brass and glass lantern with peaked top",
      },
    ],
  },
  {
    code: "SCI-OD-004",
    category: "outdoor-decor",
    images: [{ src: "products/sci-od-004.jpg", alt: "Tall brass lantern with chimney top" }],
  },
  {
    code: "SCI-OD-005",
    category: "outdoor-decor",
    images: [
      { src: "products/sci-od-005.jpg", alt: "Tapered brass and glass lantern with handle" },
    ],
  },
  {
    code: "SCI-OD-006",
    category: "outdoor-decor",
    images: [{ src: "products/sci-od-006.jpg", alt: "Set of three textured-glass cube lanterns" }],
  },
  {
    code: "SCI-OD-007",
    category: "outdoor-decor",
    images: [
      { src: "products/sci-od-007.jpg", alt: "Square brass and glass lantern with hanging ring" },
    ],
  },
  {
    code: "SCI-OD-008",
    category: "outdoor-decor",
    images: [{ src: "products/sci-od-008.jpg", alt: "Brass and glass lantern with round cap" }],
  },
  {
    code: "SCI-OD-009",
    category: "outdoor-decor",
    images: [{ src: "products/sci-od-009.jpg", alt: "Brass and glass lantern with pointed top" }],
  },
  {
    code: "SCI-OD-010",
    category: "outdoor-decor",
    images: [{ src: "products/sci-od-010.jpg", alt: "Square brass lantern with flat cap" }],
  },
  {
    code: "SCI-OD-011",
    category: "outdoor-decor",
    images: [{ src: "products/sci-od-011.jpg", alt: "Small brass lantern with hinged door" }],
  },
];
