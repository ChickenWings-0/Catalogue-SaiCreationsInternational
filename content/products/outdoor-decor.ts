import type { ProductInput } from "@/lib/schemas";

/*
 * OUTDOOR DECOR: garden planters, baskets, cushions and lanterns (34 products).
 * Visual-only: photos only. No names, codes or specifications are shown (client request);
 * the code is an internal key used in file names and URLs.
 * The order here is the display order. Photos: assets/images/products/<code>.jpg,
 * imported with `npm run import:images` (mapping in scripts/client-images.mjs).
 * TODO(client): more products to follow.
 */
export const outdoorDecorProducts: ProductInput[] = [
  {
    code: "SCI-OD-012",
    category: "outdoor-decor",
    images: [
      { src: "products/sci-od-012.jpg", alt: "Set of four pastel enamel milk churn planters" },
    ],
    featured: true,
  },
  {
    code: "SCI-OD-013",
    category: "outdoor-decor",
    images: [{ src: "products/sci-od-013.jpg", alt: "White iron bicycle planter in a garden" }],
  },
  {
    code: "SCI-OD-014",
    category: "outdoor-decor",
    images: [
      {
        src: "products/sci-od-014.jpg",
        alt: "Set of four milk churn planters in brown, green, silver and white",
      },
    ],
  },
  {
    code: "SCI-OD-015",
    category: "outdoor-decor",
    images: [
      { src: "products/sci-od-015.jpg", alt: "Coloured glass star lanterns hanging in a garden" },
    ],
  },
  {
    code: "SCI-OD-016",
    category: "outdoor-decor",
    images: [{ src: "products/sci-od-016.jpg", alt: "Galvanised milk churn planter" }],
  },
  {
    code: "SCI-OD-017",
    category: "outdoor-decor",
    images: [{ src: "products/sci-od-017.jpg", alt: "Galvanised milk churn with embossed fern" }],
  },
  {
    code: "SCI-OD-018",
    category: "outdoor-decor",
    images: [
      { src: "products/sci-od-018.jpg", alt: "Galvanised milk churn with embossed grass motif" },
    ],
  },
  {
    code: "SCI-OD-019",
    category: "outdoor-decor",
    images: [
      { src: "products/sci-od-019.jpg", alt: "White scroll bicycle planter with flower pots" },
    ],
  },
  {
    code: "SCI-OD-020",
    category: "outdoor-decor",
    images: [
      {
        src: "products/sci-od-020.jpg",
        alt: "Pair of oval galvanised planter tubs with embossed design",
      },
    ],
  },
  {
    code: "SCI-OD-021",
    category: "outdoor-decor",
    images: [
      { src: "products/sci-od-021.jpg", alt: "Pair of oval galvanised tubs with embossed leaf" },
    ],
  },
  {
    code: "SCI-OD-022",
    category: "outdoor-decor",
    images: [
      { src: "products/sci-od-022.jpg", alt: "Pair of oval galvanised tubs with embossed flower" },
    ],
  },
  {
    code: "SCI-OD-023",
    category: "outdoor-decor",
    images: [{ src: "products/sci-od-023.jpg", alt: "Set of galvanised tubs and a tall vase" }],
  },
  {
    code: "SCI-OD-024",
    category: "outdoor-decor",
    images: [{ src: "products/sci-od-024.jpg", alt: "White galvanised tubs and vase in a garden" }],
  },
  {
    code: "SCI-OD-025",
    category: "outdoor-decor",
    images: [{ src: "products/sci-od-025.jpg", alt: "Rainbow glass star lantern in a garden" }],
  },
  {
    code: "SCI-OD-026",
    category: "outdoor-decor",
    images: [{ src: "products/sci-od-026.jpg", alt: "Rust-finish wire gazebo plant stand" }],
  },
  {
    code: "SCI-OD-027",
    category: "outdoor-decor",
    images: [{ src: "products/sci-od-027.jpg", alt: "White wire hanging basket with hook" }],
  },
  {
    code: "SCI-OD-028",
    category: "outdoor-decor",
    images: [
      { src: "products/sci-od-028.jpg", alt: "White wire heart hanging planter with mint pot" },
    ],
  },
  {
    code: "SCI-OD-029",
    category: "outdoor-decor",
    images: [{ src: "products/sci-od-029.jpg", alt: "Set of three nested white wire baskets" }],
  },
  {
    code: "SCI-OD-030",
    category: "outdoor-decor",
    images: [{ src: "products/sci-od-030.jpg", alt: "Polka dot seat cushion on a garden chair" }],
  },
  {
    code: "SCI-OD-031",
    category: "outdoor-decor",
    images: [{ src: "products/sci-od-031.jpg", alt: "Polka dot seat cushion" }],
  },
  {
    code: "SCI-OD-032",
    category: "outdoor-decor",
    images: [{ src: "products/sci-od-032.jpg", alt: "Strawberry print seat cushion" }],
  },
  {
    code: "SCI-OD-033",
    category: "outdoor-decor",
    images: [{ src: "products/sci-od-033.jpg", alt: "Striped seat cushion" }],
  },
  {
    code: "SCI-OD-034",
    category: "outdoor-decor",
    images: [{ src: "products/sci-od-034.jpg", alt: "Floral print seat cushion on blue" }],
  },
  {
    code: "SCI-OD-035",
    category: "outdoor-decor",
    images: [{ src: "products/sci-od-035.jpg", alt: "Floral print seat cushion on pink" }],
  },
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
