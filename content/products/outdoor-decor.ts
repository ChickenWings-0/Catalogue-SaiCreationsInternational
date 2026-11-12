import type { ProductInput } from "@/lib/schemas";

/*
 * OUTDOOR DECOR: 8 PLACEHOLDER products.
 * TODO(client): replace every product below with real names, codes, specs, descriptions and photos.
 */
export const outdoorDecorProducts: ProductInput[] = [
  {
    // TODO(client): placeholder product
    code: "SCI-OD-001",
    slug: "terracotta-lattice-planter",
    name: "Terracotta Lattice Planter",
    category: "outdoor-decor",
    summary: "Hand-cut terracotta planter with an open lattice band.",
    description:
      "Thrown from local clay, then cut by hand into a lattice pattern before firing. A drainage hole sits at the base.",
    images: [
      { src: "placeholders/products/sci-od-001-a.jpg", alt: "Terracotta lattice planter" },
      { src: "placeholders/products/sci-od-001-b.jpg", alt: "Terracotta planter, lattice detail" },
    ],
    dimensions: { diameterCm: 30, heightCm: 28 },
    materials: ["Terracotta"],
    colours: ["Terracotta"],
    size: "medium",
    technique: "Hand-cut",
    featured: true,
    dateAdded: "2026-08-21",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-OD-002",
    slug: "wrought-iron-garden-lantern",
    name: "Wrought-Iron Garden Lantern",
    category: "outdoor-decor",
    summary: "Forged iron lantern with clear glass panels and a hanging ring.",
    description:
      "Forged and riveted by hand, then finished in a weather-resistant matte black. Holds a pillar candle or a battery light.",
    images: [
      { src: "placeholders/products/sci-od-002-a.jpg", alt: "Wrought-iron garden lantern" },
      { src: "placeholders/products/sci-od-002-b.jpg", alt: "Wrought-iron lantern, rivet detail" },
    ],
    dimensions: { widthCm: 20, depthCm: 20, heightCm: 45 },
    materials: ["Iron", "Glass"],
    colours: ["Black"],
    size: "medium",
    technique: "Hand-forged",
    dateAdded: "2026-07-02",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-OD-003",
    slug: "weatherproof-jute-look-outdoor-rug",
    name: "Weatherproof Jute-Look Outdoor Rug",
    category: "outdoor-decor",
    summary: "Flat-woven outdoor rug with the look of natural jute.",
    description:
      "Woven from recycled PET yarn that looks and feels like jute but stands up to sun and rain.",
    images: [
      { src: "placeholders/products/sci-od-003-a.jpg", alt: "Jute-look outdoor rug" },
      { src: "placeholders/products/sci-od-003-b.jpg", alt: "Outdoor rug, weave detail" },
    ],
    dimensions: { widthCm: 160, lengthCm: 230 },
    materials: ["Recycled PET"],
    colours: ["Natural"],
    size: "large",
    technique: "Flat-woven",
    care: "Hose down and dry flat.",
    dateAdded: "2026-05-30",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-OD-004",
    slug: "teak-slatted-garden-stool",
    name: "Teak Slatted Garden Stool",
    category: "outdoor-decor",
    summary: "Solid teak stool with a slatted top, for terraces and gardens.",
    description:
      "Joined by hand from solid teak, a timber naturally suited to outdoor use. It weathers to a soft silver-grey if left unoiled.",
    images: [
      { src: "placeholders/products/sci-od-004-a.jpg", alt: "Teak slatted garden stool" },
      { src: "placeholders/products/sci-od-004-b.jpg", alt: "Teak garden stool, joinery detail" },
    ],
    dimensions: { widthCm: 40, depthCm: 40, heightCm: 45 },
    materials: ["Teak"],
    colours: ["Natural"],
    size: "medium",
    technique: "Hand-joined",
    dateAdded: "2026-06-25",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-OD-005",
    slug: "galvanised-metal-bird-feeder",
    name: "Galvanised Metal Bird Feeder",
    category: "outdoor-decor",
    summary: "Hanging bird feeder in galvanised metal with a pitched roof.",
    description: "Folded and riveted from galvanised sheet, with a lift-off roof for easy filling.",
    images: [
      { src: "placeholders/products/sci-od-005-a.jpg", alt: "Galvanised metal bird feeder" },
      { src: "placeholders/products/sci-od-005-b.jpg", alt: "Bird feeder, roof detail" },
    ],
    dimensions: { widthCm: 18, depthCm: 15, heightCm: 25 },
    materials: ["Iron"],
    colours: ["Grey"],
    size: "small",
    technique: "Hand-riveted",
    dateAdded: "2026-04-17",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-OD-006",
    slug: "rattan-hanging-planter",
    name: "Rattan Hanging Planter",
    category: "outdoor-decor",
    summary: "Woven rattan basket planter with a jute hanging cord.",
    description:
      "Hand-woven rattan basket with a removable liner, for hanging plants on a covered porch or balcony.",
    images: [
      { src: "placeholders/products/sci-od-006-a.jpg", alt: "Rattan hanging planter" },
      { src: "placeholders/products/sci-od-006-b.jpg", alt: "Rattan planter, weave detail" },
    ],
    dimensions: { diameterCm: 25, heightCm: 20 },
    materials: ["Rattan", "Jute"],
    colours: ["Natural"],
    size: "small",
    technique: "Hand-woven",
    dateAdded: "2026-09-12",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-OD-007",
    slug: "stoneware-garden-toadstools-set-of-3",
    name: "Stoneware Garden Toadstools (Set of 3)",
    category: "outdoor-decor",
    summary: "Three hand-glazed stoneware toadstools for borders and pots.",
    description:
      "High-fired stoneware toadstools in three heights, hand-glazed in earthy tones and frost-resistant.",
    images: [
      {
        src: "placeholders/products/sci-od-007-a.jpg",
        alt: "Set of three stoneware garden toadstools",
      },
      { src: "placeholders/products/sci-od-007-b.jpg", alt: "Stoneware toadstool, glaze detail" },
    ],
    dimensions: { heightCm: 20, note: "Set of 3: 12 / 16 / 20 cm tall" },
    materials: ["Stoneware"],
    colours: ["Terracotta", "Ivory"],
    size: "small",
    technique: "Hand-glazed",
    dateAdded: "2026-03-28",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-OD-008",
    slug: "solar-mesh-metal-lantern",
    name: "Solar Mesh-Metal Lantern",
    category: "outdoor-decor",
    summary: "Perforated metal lantern with a built-in solar light.",
    description:
      "Hand-punched metal casts patterned light across a terrace after dark. The solar panel sits under the lid.",
    images: [
      { src: "placeholders/products/sci-od-008-a.jpg", alt: "Solar mesh-metal lantern" },
      {
        src: "placeholders/products/sci-od-008-b.jpg",
        alt: "Mesh-metal lantern, perforation detail",
      },
    ],
    dimensions: { diameterCm: 18, heightCm: 32 },
    materials: ["Iron"],
    colours: ["Brass"],
    size: "medium",
    technique: "Hand-punched",
    featured: true,
    dateAdded: "2026-10-10",
  },
];
