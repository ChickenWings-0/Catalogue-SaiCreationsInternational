import type { ProductInput } from "@/lib/schemas";

/*
 * SEASONAL DECOR: 8 PLACEHOLDER products.
 * TODO(client): replace every product below with real names, codes, specs, descriptions and photos.
 */
export const seasonalDecorProducts: ProductInput[] = [
  {
    // TODO(client): placeholder product
    code: "SCI-SD-001",
    slug: "brass-diya-lantern-set",
    name: "Brass Diya Lantern Set",
    category: "seasonal-decor",
    summary: "Pair of pierced brass lanterns for tealights and diyas.",
    description:
      "Pierced by hand so the flame throws a pattern of light. Made for Diwali evenings and kept out all year.",
    images: [
      { src: "placeholders/products/sci-sd-001-a.jpg", alt: "Pair of brass diya lanterns" },
      { src: "placeholders/products/sci-sd-001-b.jpg", alt: "Brass lantern, piercing detail" },
    ],
    dimensions: { diameterCm: 10, heightCm: 18, note: "Set of 2" },
    materials: ["Brass"],
    colours: ["Brass"],
    size: "small",
    technique: "Hand-pierced",
    featured: true,
    dateAdded: "2026-10-12",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-SD-002",
    slug: "dried-marigold-door-wreath",
    name: "Dried Marigold Door Wreath",
    category: "seasonal-decor",
    summary: "Wreath of preserved marigold heads on a woven base.",
    description:
      "Marigold heads are dried and preserved to keep their colour, then wired by hand onto a woven grass ring.",
    images: [
      { src: "placeholders/products/sci-sd-002-a.jpg", alt: "Dried marigold door wreath" },
      { src: "placeholders/products/sci-sd-002-b.jpg", alt: "Marigold wreath, close-up" },
    ],
    dimensions: { diameterCm: 40 },
    materials: ["Dried Flowers", "Grass"],
    colours: ["Orange"],
    size: "medium",
    technique: "Hand-wired",
    dateAdded: "2026-09-28",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-SD-003",
    slug: "hand-painted-wooden-star-ornaments",
    name: "Hand-Painted Wooden Star Ornaments",
    category: "seasonal-decor",
    summary: "Set of six wooden star ornaments, painted by hand.",
    description:
      "Cut from mango wood and painted by hand with fine folk patterns. Each comes with a cotton hanging loop.",
    images: [
      { src: "placeholders/products/sci-sd-003-a.jpg", alt: "Hand-painted wooden star ornaments" },
      {
        src: "placeholders/products/sci-sd-003-b.jpg",
        alt: "Wooden star ornament, painted detail",
      },
    ],
    dimensions: { widthCm: 9, heightCm: 9, note: "Set of 6" },
    materials: ["Mango Wood"],
    colours: ["Red", "Multi"],
    size: "small",
    technique: "Hand-painted",
    dateAdded: "2026-08-30",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-SD-004",
    slug: "felted-wool-pine-garland",
    name: "Felted Wool Pine Garland",
    category: "seasonal-decor",
    summary: "Garland of hand-felted wool pine sprigs and berries.",
    description:
      "Each sprig is needle-felted by hand from wool and strung on a cotton cord. Soft, light and reusable for years.",
    images: [
      { src: "placeholders/products/sci-sd-004-a.jpg", alt: "Felted wool pine garland" },
      { src: "placeholders/products/sci-sd-004-b.jpg", alt: "Felted pine sprig, detail" },
    ],
    dimensions: { lengthCm: 180 },
    materials: ["Wool", "Felt"],
    colours: ["Green", "Red"],
    size: "large",
    technique: "Hand-felted",
    featured: true,
    dateAdded: "2026-07-25",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-SD-005",
    slug: "block-print-festive-table-runner",
    name: "Block-Print Festive Table Runner",
    category: "seasonal-decor",
    summary: "Cotton table runner, hand-block printed in festive red and gold.",
    description:
      "Printed by hand with carved wooden blocks and finished with a narrow hem. Made for long festive tables.",
    images: [
      { src: "placeholders/products/sci-sd-005-a.jpg", alt: "Block-print festive table runner" },
      { src: "placeholders/products/sci-sd-005-b.jpg", alt: "Table runner, print detail" },
    ],
    dimensions: { widthCm: 35, lengthCm: 180 },
    materials: ["Cotton"],
    colours: ["Red", "Brass"],
    size: "large",
    technique: "Hand-block printed",
    care: "Gentle cold wash, iron on reverse.",
    dateAdded: "2026-06-18",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-SD-006",
    slug: "beaded-glass-tealight-holder",
    name: "Beaded Glass Tealight Holder",
    category: "seasonal-decor",
    summary: "Glass tealight holder wrapped in hand-strung glass beads.",
    description:
      "Tiny glass beads are strung and wrapped by hand around a clear glass votive, so it glows when lit.",
    images: [
      { src: "placeholders/products/sci-sd-006-a.jpg", alt: "Beaded glass tealight holder" },
      { src: "placeholders/products/sci-sd-006-b.jpg", alt: "Beaded tealight holder, bead detail" },
    ],
    dimensions: { diameterCm: 8, heightCm: 9 },
    materials: ["Glass"],
    colours: ["Brass", "Multi"],
    size: "small",
    technique: "Hand-beaded",
    dateAdded: "2026-05-06",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-SD-007",
    slug: "embroidered-velvet-stocking",
    name: "Embroidered Velvet Stocking",
    category: "seasonal-decor",
    summary: "Velvet stocking with hand-embroidered gold thread detail.",
    description:
      "Soft cotton velvet embroidered by hand with metallic thread, lined in cotton and finished with a hanging loop.",
    images: [
      { src: "placeholders/products/sci-sd-007-a.jpg", alt: "Embroidered velvet stocking" },
      { src: "placeholders/products/sci-sd-007-b.jpg", alt: "Velvet stocking, embroidery detail" },
    ],
    dimensions: { widthCm: 25, heightCm: 45 },
    materials: ["Velvet", "Cotton"],
    colours: ["Green", "Brass"],
    size: "medium",
    technique: "Hand-embroidered",
    dateAdded: "2026-04-01",
  },
  {
    // TODO(client): placeholder product
    code: "SCI-SD-008",
    slug: "papier-mache-bauble-set",
    name: "Papier-Mâché Bauble Set",
    category: "seasonal-decor",
    summary: "Six hand-painted papier-mâché baubles.",
    description:
      "Shaped from layered paper pulp and painted by hand with fine brushwork in the Kashmiri papier-mâché tradition.",
    images: [
      { src: "placeholders/products/sci-sd-008-a.jpg", alt: "Set of papier-mâché baubles" },
      { src: "placeholders/products/sci-sd-008-b.jpg", alt: "Papier-mâché bauble, painted detail" },
    ],
    dimensions: { diameterCm: 8, note: "Set of 6" },
    materials: ["Papier-Mâché"],
    colours: ["Red", "Multi"],
    size: "small",
    technique: "Hand-painted",
    dateAdded: "2026-02-14",
  },
];
