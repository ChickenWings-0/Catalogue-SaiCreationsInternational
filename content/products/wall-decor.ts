import type { ProductInput } from "@/lib/schemas";

/*
 * WALL DECOR: 8 PLACEHOLDER products.
 * TODO(client): replace every product below with real names, codes, specs, descriptions and photos.
 */
export const wallDecorProducts: ProductInput[] = [
  {
    // TODO(client): placeholder product
    code: "SCI-WD-001",
    slug: "hand-carved-mango-wood-mirror",
    name: "Hand-Carved Mango Wood Mirror",
    category: "wall-decor",
    summary: "Round mirror in a deeply carved mango wood frame.",
    description:
      "The frame is carved by hand from a single piece of mango wood, then lightly waxed to show the grain.",
    images: [
      { src: "placeholders/products/sci-wd-001-a.jpg", alt: "Hand-carved mango wood mirror" },
      { src: "placeholders/products/sci-wd-001-b.jpg", alt: "Mango wood mirror, carving detail" },
    ],
    dimensions: { diameterCm: 60, depthCm: 3 },
    materials: ["Mango Wood", "Glass"],
    colours: ["Natural"],
    size: "medium",
    technique: "Hand-carved",
    featured: true,
    dateAdded: "2026-09-20",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-WD-002",
    slug: "woven-seagrass-wall-basket-set",
    name: "Woven Seagrass Wall Basket Set",
    category: "wall-decor",
    summary: "Set of three flat woven seagrass baskets for wall display.",
    description: "Coiled and woven by hand from seagrass, in three sizes to arrange as a cluster.",
    images: [
      { src: "placeholders/products/sci-wd-002-a.jpg", alt: "Set of woven seagrass wall baskets" },
      { src: "placeholders/products/sci-wd-002-b.jpg", alt: "Seagrass wall basket, weave detail" },
    ],
    dimensions: { diameterCm: 50, note: "Set of 3: 30 / 40 / 50 cm diameter" },
    materials: ["Seagrass"],
    colours: ["Natural", "Black"],
    size: "medium",
    technique: "Hand-woven",
    dateAdded: "2026-07-09",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-WD-003",
    slug: "kantha-stitch-wall-hanging",
    name: "Kantha Stitch Wall Hanging",
    category: "wall-decor",
    summary: "Layered cotton hanging with dense running-stitch embroidery.",
    description:
      "Layers of soft cotton are stitched together by hand with fine running stitches in the kantha tradition. Supplied with a wooden hanging rod.",
    images: [
      { src: "placeholders/products/sci-wd-003-a.jpg", alt: "Kantha stitch wall hanging" },
      { src: "placeholders/products/sci-wd-003-b.jpg", alt: "Kantha wall hanging, stitch detail" },
    ],
    dimensions: { widthCm: 90, heightCm: 120 },
    materials: ["Cotton"],
    colours: ["Indigo", "Multi"],
    size: "large",
    technique: "Hand-embroidered",
    dateAdded: "2026-06-03",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-WD-004",
    slug: "embossed-brass-wall-plate",
    name: "Embossed Brass Wall Plate",
    category: "wall-decor",
    summary: "Decorative brass plate with a hand-embossed floral pattern.",
    description:
      "Brass sheet is worked from the back with small punches to raise the pattern. Fitted with a hanging hook.",
    images: [
      { src: "placeholders/products/sci-wd-004-a.jpg", alt: "Embossed brass wall plate" },
      { src: "placeholders/products/sci-wd-004-b.jpg", alt: "Brass wall plate, embossed detail" },
    ],
    dimensions: { diameterCm: 35 },
    materials: ["Brass"],
    colours: ["Brass"],
    size: "small",
    technique: "Hand-embossed",
    dateAdded: "2026-05-11",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-WD-005",
    slug: "macrame-cotton-wall-panel",
    name: "Macramé Cotton Wall Panel",
    category: "wall-decor",
    summary: "Knotted cotton macramé panel on a driftwood-style dowel.",
    description:
      "Knotted by hand from soft cotton cord in a layered pattern, with a fringed finish.",
    images: [
      { src: "placeholders/products/sci-wd-005-a.jpg", alt: "Macramé cotton wall panel" },
      { src: "placeholders/products/sci-wd-005-b.jpg", alt: "Macramé panel, knot detail" },
    ],
    dimensions: { widthCm: 60, heightCm: 90 },
    materials: ["Cotton", "Mango Wood"],
    colours: ["Ivory"],
    size: "medium",
    technique: "Hand-knotted",
    dateAdded: "2026-04-22",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-WD-006",
    slug: "reclaimed-wood-floating-shelf",
    name: "Reclaimed Wood Floating Shelf",
    category: "wall-decor",
    summary: "Floating shelf cut from reclaimed timber, with hidden fixings.",
    description:
      "Made from reclaimed timber, so nail holes and saw marks are part of the story. Hidden bracket included.",
    images: [
      { src: "placeholders/products/sci-wd-006-a.jpg", alt: "Reclaimed wood floating shelf" },
      { src: "placeholders/products/sci-wd-006-b.jpg", alt: "Reclaimed wood shelf, grain detail" },
    ],
    dimensions: { widthCm: 80, depthCm: 20, heightCm: 5 },
    weightKg: 3.2,
    materials: ["Reclaimed Wood"],
    colours: ["Natural"],
    size: "medium",
    technique: "Hand-finished",
    dateAdded: "2026-08-14",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-WD-007",
    slug: "hand-painted-ceramic-tile-art",
    name: "Hand-Painted Ceramic Tile Art",
    category: "wall-decor",
    summary: "Framed panel of four hand-painted ceramic tiles.",
    description:
      "Four tiles painted by hand in cobalt and white, set in a slim wooden frame ready to hang.",
    images: [
      { src: "placeholders/products/sci-wd-007-a.jpg", alt: "Hand-painted ceramic tile art panel" },
      { src: "placeholders/products/sci-wd-007-b.jpg", alt: "Ceramic tile, painted detail" },
    ],
    dimensions: { widthCm: 32, heightCm: 32, depthCm: 3 },
    materials: ["Ceramic", "Mango Wood"],
    colours: ["Indigo", "Ivory"],
    size: "small",
    technique: "Hand-painted",
    dateAdded: "2026-03-05",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-WD-008",
    slug: "metal-leaf-wall-sculpture",
    name: "Metal Leaf Wall Sculpture",
    category: "wall-decor",
    summary: "Cluster of hand-cut metal leaves in an aged brass finish.",
    description:
      "Individual leaves are cut, veined and shaped by hand, then mounted on a hidden frame for a layered, three-dimensional effect.",
    images: [
      { src: "placeholders/products/sci-wd-008-a.jpg", alt: "Metal leaf wall sculpture" },
      { src: "placeholders/products/sci-wd-008-b.jpg", alt: "Metal leaf sculpture, close-up" },
    ],
    dimensions: { widthCm: 100, heightCm: 60, depthCm: 6 },
    materials: ["Iron"],
    colours: ["Brass"],
    size: "large",
    technique: "Hand-cut",
    dateAdded: "2026-10-04",
  },
];
