import type { SiteConfigInput } from "@/lib/schemas";

/**
 * SITE CONFIG: the ONE place for contact details, social links, the Google Form URL,
 * feature flags and interface microcopy. Every link on the site that points outside
 * comes from here.
 */

// TODO(client): WhatsApp number in international format, digits only (e.g. 91XXXXXXXXXX)
const WHATSAPP_NUMBER = "910000000000";

export const site: SiteConfigInput = {
  name: "SAI CREATIONS INTERNATIONAL",
  legalName: "SAI Creations International",
  tagline: "A House of Home Furnishing & Handicrafts",
  // TODO(client): replace public/brand/logo.png with the real logo (transparent PNG, ≥ 960px wide)
  logo: { src: "brand/logo.png", alt: "SAI Creations International logo" },

  contact: {
    // TODO(client): enquiries email address
    email: "hello@example.com",
    // TODO(client): phone number(s) with labels
    phones: [{ label: "Sales", number: "+91 00000 00000" }],
    whatsappNumber: WHATSAPP_NUMBER,
    // TODO(client): registered business address
    address: {
      lines: ["Plot 00, Placeholder Industrial Area"],
      city: "City",
      region: "State",
      postalCode: "000000",
      country: "India",
    },
    // TODO(client): business hours (optional)
    hours: "Monday to Saturday, 10:00–18:00",
    // TODO(client): Google Maps link to the business location
    mapUrl: "https://maps.google.com/",
    // TODO(client): optional nicer static map image (the image links to mapUrl, no embed)
    mapImage: {
      src: "placeholders/contact/map.jpg",
      alt: "Map showing the location of SAI Creations International",
    },
  },

  // TODO(client): real profile URLs and handles. Remove any platform the client doesn't use.
  socials: [
    {
      platform: "instagram",
      label: "SAI Creations on Instagram",
      url: "https://www.instagram.com/your-handle/",
      handle: "your-handle",
    },
    { platform: "x", label: "SAI Creations on X (Twitter)", url: "https://x.com/your-handle" },
    {
      platform: "linkedin",
      label: "SAI Creations on LinkedIn",
      url: "https://www.linkedin.com/company/your-company/",
    },
    {
      platform: "pinterest",
      label: "SAI Creations on Pinterest",
      url: "https://www.pinterest.com/your-handle/",
    },
    {
      platform: "whatsapp",
      label: "Chat with SAI Creations on WhatsApp",
      url: `https://wa.me/${WHATSAPP_NUMBER}`,
    },
  ],

  // TODO(client): Google Form URL for enquiries (plain link; product-code prefill may come later)
  googleFormUrl: "https://forms.gle/your-form-id",

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
    headerSearch: false, // pending client: icon shown as a placeholder only
    heroSlideshow: false, // client chose a single still hero
  },

  seo: {
    defaultTitle: "SAI Creations International | Home Furnishing & Handicrafts",
    titleTemplate: "%s · SAI Creations International",
    // TODO(client): one-sentence company description for search results (≤ 160 characters)
    description:
      "Handcrafted home decor, outdoor decor, wall decor and seasonal pieces from SAI Creations International, a house of home furnishing and handicrafts.",
    // TODO(client): share image (1200 × 630)
    ogImage: { src: "placeholders/og/default.jpg", alt: "SAI Creations International" },
  },

  ui: {
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
