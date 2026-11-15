import type { ProductInput } from "@/lib/schemas";

/*
 * HOME DECOR: terrariums, glass boxes, trays and vases (11 products, client photos batch 1).
 * Visual-only: photo + reference code, no names or specifications (client request).
 * The order here is the display order. Photos: assets/images/products/<code>.jpg,
 * imported with `npm run import:images` (mapping in scripts/client-images.mjs).
 * TODO(client): more products to follow; codes are provisional.
 */
export const homeDecorProducts: ProductInput[] = [
  {
    code: "SCI-HD-001",
    category: "home-decor",
    images: [
      { src: "products/sci-hd-001.jpg", alt: "Hexagonal brass and glass greenhouse terrarium" },
    ],
    featured: true,
  },
  {
    code: "SCI-HD-002",
    category: "home-decor",
    images: [
      { src: "products/sci-hd-002.jpg", alt: "Hanging geometric glass terrarium with brass frame" },
    ],
    featured: true,
  },
  {
    code: "SCI-HD-003",
    category: "home-decor",
    images: [{ src: "products/sci-hd-003.jpg", alt: "House-shaped brass and glass terrarium" }],
  },
  {
    code: "SCI-HD-004",
    category: "home-decor",
    images: [
      {
        src: "products/sci-hd-004.jpg",
        alt: "Hexagonal glass terrarium with brass frame and handle",
      },
    ],
  },
  {
    code: "SCI-HD-005",
    category: "home-decor",
    images: [{ src: "products/sci-hd-005.jpg", alt: "Hexagonal brass and glass box" }],
  },
  {
    code: "SCI-HD-006",
    category: "home-decor",
    images: [{ src: "products/sci-hd-006.jpg", alt: "Pair of mercury-glass teardrop vases" }],
  },
  {
    code: "SCI-HD-007",
    category: "home-decor",
    images: [{ src: "products/sci-hd-007.jpg", alt: "Hexagonal brass and glass tray" }],
  },
  {
    code: "SCI-HD-008",
    category: "home-decor",
    images: [{ src: "products/sci-hd-008.jpg", alt: "Rectangular brass and glass tray" }],
  },
  {
    code: "SCI-HD-009",
    category: "home-decor",
    images: [{ src: "products/sci-hd-009.jpg", alt: "Long brass and glass display box" }],
  },
  {
    code: "SCI-HD-010",
    category: "home-decor",
    images: [{ src: "products/sci-hd-010.jpg", alt: "Brass and glass box with hinged lid" }],
  },
  {
    code: "SCI-HD-011",
    category: "home-decor",
    images: [
      { src: "products/sci-hd-011.jpg", alt: "Small square glass box with dark metal frame" },
    ],
  },
];
