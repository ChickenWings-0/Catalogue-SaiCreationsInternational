import type { SiteConfigInput } from "@/lib/schemas";

/**
 * SITE CONFIG: the ONE place for contact details, social links, the Google Form URL,
 * feature flags and interface microcopy. Every link on the site that points outside
 * comes from here.
 */

/** WhatsApp Business number: +91 9289 555 616 (digits only, with country code). */
const WHATSAPP_NUMBER = "919289555616";

export const site: SiteConfigInput = {
  name: "SAI CREATIONS INTERNATIONAL",
  legalName: "SAI Creations International",
  tagline: "A House of Home Furnishing & Handicrafts",
  /** The green "SC" monogram (shown beside the text wordmark, in the footer and as the favicon). */
  logo: { src: "brand/logo.png", alt: "SAI Creations International logo" },

  contact: {
    email: "info@saicreationsintl.com",
    phones: [{ label: "WhatsApp", number: "+91 9289 555 616" }],
    whatsappNumber: WHATSAPP_NUMBER,
    address: {
      lines: ["D-32, Sector 7"],
      city: "Noida",
      region: "Uttar Pradesh",
      postalCode: "201301",
      country: "India",
    },
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=D-32%2C%20Sector%207%2C%20Noida%2C%20Uttar%20Pradesh%20201301%2C%20India",
  },

  socials: [
    {
      platform: "instagram",
      label: "SAI Creations on Instagram",
      url: "https://www.instagram.com/saicreationsintl/",
      handle: "saicreationsintl",
    },
    {
      platform: "whatsapp",
      label: "Chat with SAI Creations on WhatsApp",
      url: `https://wa.me/${WHATSAPP_NUMBER}`,
    },
  ],

  /** Google Form for quotation requests (Contact page, product views, footer). */
  googleFormUrl: "https://forms.gle/Q54M1nwHjC83uLfU8",

  header: {
    // Pending client: contact icon may later open WhatsApp directly instead of the Contact page.
    contactHref: "/contact/",
  },

  analytics: {
    // Phase 5: Cloudflare Web Analytics beacon token (public value). Unset → no analytics script.
    cloudflareBeaconToken: undefined,
  },

  enquiry: {
    // TODO(client): confirm wording. {url} is the product page; keep it at the end so WhatsApp
    // shows the product photo as the link preview. (No product codes are shown on the site.)
    whatsappTemplate: "Hello SAI Creations, I'm interested in this piece: {url}",
    instagramNote: "Send us the link to the piece you like.",
  },

  features: {
    headerShrink: false, // pending client
    headerSearch: false, // no search for a photo-only catalogue; icon hidden
    heroSlideshow: false, // client chose a single still hero
  },

  seo: {
    defaultTitle: "SAI Creations International | Home Furnishing & Handicrafts",
    titleTemplate: "%s · SAI Creations International",
    // TODO(client): one-sentence company description for search results (≤ 160 characters)
    description:
      "Handcrafted home decor, outdoor decor, wall decor and seasonal pieces from SAI Creations International, a house of home furnishing and handicrafts.",
    ogImage: { src: "site/og-default.jpg", alt: "SAI Creations International" },
  },

  ui: {
    email: "Email",
    requestQuote: "Request a quotation",
    skipToContent: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menuTitle: "Menu",
    mainNavLabel: "Main",
    secondaryNavLabel: "Company",
    search: "Search",
    searchComingSoon: "Search (coming soon)",
    contact: "Contact us",
    homeLinkLabel: "SAI Creations International, home",
    opensInNewTab: "opens in a new tab",
    breadcrumbLabel: "Breadcrumb",
    breadcrumbHome: "Home",
    copyright: "© {year} SAI Creations International",
    footerNavLabel: "Footer",
  },
};
