import type { CataloguePageInput } from "@/lib/schemas";

export const cataloguePage: CataloguePageInput = {
  title: "Product Catalogue",
  // TODO(client): catalogue intro (40–80 words)
  intro:
    "Explore our collections of handcrafted home furnishings and decor. Every piece is made by hand, so each one carries the marks of the person who made it. To enquire about any product, message us with its product code.",
  categoriesHeading: "Collections",
  allProductsHeading: "All products",
  seo: {
    description:
      "Browse the SAI Creations International catalogue: home decor, outdoor decor, wall decor and seasonal decor, all handcrafted.",
  },
};
