import type { ProductInput } from "@/lib/schemas";

/*
 * HOME DECOR: 8 PLACEHOLDER products.
 * TODO(client): replace every product below with real names, codes, specs, descriptions and photos.
 * Photos go in assets/images/products/ (≥ 2000px long edge, 4:5 portrait); update each `src`.
 */
export const homeDecorProducts: ProductInput[] = [
  {
    // TODO(client): placeholder product
    code: "SCI-HD-001",
    slug: "jaipur-block-print-cushion-cover",
    name: "Jaipur Block-Print Cushion Cover",
    category: "home-decor",
    summary: "Hand-block printed cotton cushion cover in a soft indigo motif.",
    description:
      "A cushion cover printed by hand with carved wooden blocks, one colour at a time. The slight variations in each impression are part of its character.\n\nFinished with a concealed zip. Insert not included.",
    images: [
      {
        src: "placeholders/products/sci-hd-001-a.jpg",
        alt: "Jaipur block-print cushion cover, front view",
      },
      {
        src: "placeholders/products/sci-hd-001-b.jpg",
        alt: "Jaipur block-print cushion cover, detail of the print",
      },
    ],
    dimensions: { widthCm: 45, heightCm: 45 },
    materials: ["Cotton"],
    colours: ["Indigo", "Ivory"],
    size: "small",
    technique: "Hand-block printed",
    care: "Gentle cold wash, dry in shade.",
    featured: true,
    dateAdded: "2026-09-02",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-HD-002",
    slug: "jute-braided-floor-pouf",
    name: "Jute Braided Floor Pouf",
    category: "home-decor",
    summary: "Round floor pouf, hand-braided from natural jute.",
    description:
      "Thick jute braid is coiled and stitched by hand into a firm, round pouf. Use it as extra seating, a footrest or a low side table.",
    images: [
      { src: "placeholders/products/sci-hd-002-a.jpg", alt: "Jute braided floor pouf" },
      {
        src: "placeholders/products/sci-hd-002-b.jpg",
        alt: "Jute braided floor pouf, close-up of the braid",
      },
    ],
    dimensions: { diameterCm: 50, heightCm: 35 },
    materials: ["Jute", "Cotton"],
    colours: ["Natural"],
    size: "medium",
    technique: "Hand-braided",
    dateAdded: "2026-07-18",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-HD-003",
    slug: "brass-hammered-bud-vase",
    name: "Brass Hammered Bud Vase",
    category: "home-decor",
    summary: "Slim brass bud vase with a hand-hammered finish.",
    description:
      "Shaped from brass sheet and hammered by hand to catch the light. Holds a single stem or a few dried grasses.",
    images: [
      { src: "placeholders/products/sci-hd-003-a.jpg", alt: "Brass hammered bud vase" },
      {
        src: "placeholders/products/sci-hd-003-b.jpg",
        alt: "Brass hammered bud vase, surface detail",
      },
    ],
    dimensions: { diameterCm: 8, heightCm: 22 },
    materials: ["Brass"],
    colours: ["Brass"],
    size: "small",
    technique: "Hand-hammered",
    care: "Wipe with a soft dry cloth. Not watertight: use a glass insert for fresh flowers.",
    dateAdded: "2026-08-05",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-HD-004",
    slug: "hand-loomed-cotton-throw",
    name: "Hand-Loomed Cotton Throw",
    category: "home-decor",
    summary: "Soft cotton throw woven on a hand loom, finished with knotted tassels.",
    description:
      "Woven on a traditional pit loom in a subtle herringbone. The throw softens with every wash.",
    images: [
      { src: "placeholders/products/sci-hd-004-a.jpg", alt: "Hand-loomed cotton throw, folded" },
      {
        src: "placeholders/products/sci-hd-004-b.jpg",
        alt: "Hand-loomed cotton throw, tassel detail",
      },
    ],
    dimensions: { widthCm: 130, lengthCm: 180 },
    materials: ["Cotton"],
    colours: ["Ivory", "Natural"],
    size: "large",
    technique: "Hand-loomed",
    care: "Gentle cold wash, dry flat.",
    featured: true,
    dateAdded: "2026-10-01",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-HD-005",
    slug: "marble-inlay-trinket-box",
    name: "Marble Inlay Trinket Box",
    category: "home-decor",
    summary: "White marble box with a hand-set floral inlay.",
    description:
      "Small pieces of semi-precious stone are cut and set into white marble by hand, a craft passed down through generations of inlay artisans.",
    images: [
      { src: "placeholders/products/sci-hd-005-a.jpg", alt: "Marble inlay trinket box" },
      {
        src: "placeholders/products/sci-hd-005-b.jpg",
        alt: "Marble inlay trinket box, lid detail",
      },
    ],
    dimensions: { widthCm: 12, depthCm: 8, heightCm: 6 },
    materials: ["Marble"],
    colours: ["Ivory", "Multi"],
    size: "small",
    technique: "Hand-inlaid",
    dateAdded: "2026-06-12",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-HD-006",
    slug: "ceramic-glazed-table-lamp-base",
    name: "Ceramic Glazed Table Lamp Base",
    category: "home-decor",
    summary: "Wheel-thrown ceramic lamp base in a reactive green glaze.",
    description:
      "Thrown on the wheel and finished in a reactive glaze, so no two bases are quite alike. Supplied wired, without shade.",
    images: [
      { src: "placeholders/products/sci-hd-006-a.jpg", alt: "Ceramic glazed table lamp base" },
      {
        src: "placeholders/products/sci-hd-006-b.jpg",
        alt: "Ceramic table lamp base, glaze detail",
      },
    ],
    dimensions: { diameterCm: 20, heightCm: 38 },
    materials: ["Ceramic"],
    colours: ["Green"],
    size: "medium",
    technique: "Wheel-thrown",
    dateAdded: "2026-05-20",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-HD-007",
    slug: "sheesham-wood-serving-tray",
    name: "Sheesham Wood Serving Tray",
    category: "home-decor",
    summary: "Solid sheesham wood tray with carved handles.",
    description:
      "Cut from solid sheesham wood and finished with food-safe oil. Carved handles make it easy to carry.",
    images: [
      { src: "placeholders/products/sci-hd-007-a.jpg", alt: "Sheesham wood serving tray" },
      {
        src: "placeholders/products/sci-hd-007-b.jpg",
        alt: "Sheesham wood serving tray, handle detail",
      },
    ],
    dimensions: { widthCm: 45, depthCm: 30, heightCm: 5 },
    materials: ["Sheesham Wood"],
    colours: ["Natural"],
    size: "medium",
    technique: "Hand-carved",
    care: "Wipe clean, re-oil occasionally. Do not soak.",
    dateAdded: "2026-04-08",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-HD-008",
    slug: "hand-tufted-wool-accent-rug",
    name: "Hand-Tufted Wool Accent Rug",
    category: "home-decor",
    summary: "Hand-tufted wool rug with a raised geometric pattern.",
    description:
      "Tufted by hand in pure wool, with a cut-and-loop pile that gives the pattern a gentle relief.",
    images: [
      { src: "placeholders/products/sci-hd-008-a.jpg", alt: "Hand-tufted wool accent rug" },
      { src: "placeholders/products/sci-hd-008-b.jpg", alt: "Hand-tufted wool rug, pile detail" },
    ],
    dimensions: { widthCm: 120, lengthCm: 180 },
    materials: ["Wool", "Cotton"],
    colours: ["Ivory", "Terracotta"],
    size: "large",
    technique: "Hand-tufted",
    dateAdded: "2026-03-15",
  },
];
