import type { NavigationInput } from "@/lib/schemas";

/**
 * Sidebar and footer navigation. `children: "categories"` expands to one link per
 * category from content/categories.ts, so a new category appears everywhere automatically.
 * Labels are written in normal case; uppercase styling is applied by CSS.
 */
export const navigation: NavigationInput = {
  sidebarMain: [
    { label: "Home", href: "/" },
    { label: "Product Catalogue", href: "/catalogue/", children: "categories" },
    { label: "The Studio", href: "/studio/" },
  ],
  sidebarBottom: [
    { label: "About Us", href: "/about/" },
    { label: "Contact Us", href: "/contact/" },
  ],
  footer: {
    columns: [
      { heading: "Get In Touch", links: [{ label: "Contact Us", href: "/contact/" }] },
      {
        heading: "Product Catalogue",
        links: [{ label: "Product Catalogue", href: "/catalogue/", children: "categories" }],
      },
      { heading: "The Studio", links: [{ label: "The Studio", href: "/studio/" }] },
      {
        heading: "About Us",
        links: [
          { label: "About Us", href: "/about/" },
          { label: "The Initiative", href: "/about/#the-initiative" },
          { label: "The Present", href: "/about/#the-present" },
        ],
      },
    ],
    socialsHeading: "Contacts",
    faqHeading: "FAQs",
    faqViewAll: { label: "View all FAQs", href: "/about/#faqs" },
  },
};
