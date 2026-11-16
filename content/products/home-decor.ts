import type { ProductInput } from "@/lib/schemas";

/*
 * HOME DECOR: candelabras, terrariums, glass boxes, trays and vases (22 products).
 * Visual-only: photos only. No names, codes or specifications are shown (client request);
 * the code is an internal key used in file names and URLs.
 * The order here is the display order. Photos: assets/images/products/<code>.jpg,
 * imported with `npm run import:images` (mapping in scripts/client-images.mjs).
 * TODO(client): more products to follow.
 */
export const homeDecorProducts: ProductInput[] = [
  {
    code: "SCI-HD-013",
    category: "home-decor",
    images: [
      {
        src: "products/sci-hd-013.jpg",
        alt: "Ornate black iron candelabra with five amber tealight glasses",
      },
    ],
    featured: true,
  },
  {
    code: "SCI-HD-014",
    category: "home-decor",
    images: [
      {
        src: "products/sci-hd-014.jpg",
        alt: "Hexagonal black iron frame with three lit mosaic tealights",
      },
    ],
  },
  {
    code: "SCI-HD-015",
    category: "home-decor",
    images: [
      {
        src: "products/sci-hd-015.jpg",
        alt: "Black scroll iron candelabra with three amber tealight glasses",
      },
    ],
  },
  {
    code: "SCI-HD-016",
    category: "home-decor",
    images: [
      {
        src: "products/sci-hd-016.jpg",
        alt: "Five-light iron candelabra with mosaic glass tealights",
      },
    ],
  },
  {
    code: "SCI-HD-017",
    category: "home-decor",
    images: [
      { src: "products/sci-hd-017.jpg", alt: "Black iron candelabra with five tealight holders" },
    ],
  },
  {
    code: "SCI-HD-018",
    category: "home-decor",
    images: [
      {
        src: "products/sci-hd-018.jpg",
        alt: "Scroll iron candelabra with five lit amber tealights",
      },
    ],
  },
  {
    code: "SCI-HD-019",
    category: "home-decor",
    images: [
      { src: "products/sci-hd-019.jpg", alt: "Cream iron loop candelabra with three tealights" },
    ],
  },
  {
    code: "SCI-HD-020",
    category: "home-decor",
    images: [
      {
        src: "products/sci-hd-020.jpg",
        alt: "Black iron ring candelabra with three amber tealights",
      },
    ],
  },
  {
    code: "SCI-HD-021",
    category: "home-decor",
    images: [
      { src: "products/sci-hd-021.jpg", alt: "Black iron frame with five tealight glasses" },
    ],
  },
  {
    code: "SCI-HD-022",
    category: "home-decor",
    images: [
      {
        src: "products/sci-hd-022.jpg",
        alt: "Five-light candelabra with mosaic glass on a black base",
      },
    ],
  },
  {
    code: "SCI-HD-023",
    category: "home-decor",
    images: [{ src: "products/sci-hd-023.jpg", alt: "Zigzag black iron tealight holder" }],
  },
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
  },
  {
    code: "SCI-HD-003",
    category: "home-decor",
    images: [{ src: "products/sci-hd-003.jpg", alt: "House-shaped brass and glass terrarium" }],
  },
  {
    code: "SCI-HD-012",
    category: "home-decor",
    images: [{ src: "products/sci-hd-012.jpg", alt: "Set of three textured-glass cube lanterns" }],
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
    code: "SCI-HD-011",
    category: "home-decor",
    images: [
      { src: "products/sci-hd-011.jpg", alt: "Small square glass box with dark metal frame" },
    ],
  },
];
