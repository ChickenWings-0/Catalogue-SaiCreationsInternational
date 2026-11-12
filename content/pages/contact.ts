import type { ContactPageInput } from "@/lib/schemas";

// Contact details, socials, the Google Form URL and the map link all come from content/site.ts.
export const contactPage: ContactPageInput = {
  title: "Contact Us",
  // TODO(client): contact intro line
  intro:
    "We'd love to hear from you. Whether you have a question about a product, a custom request or a trade enquiry, reach us on WhatsApp, Instagram or through our enquiry form.",
  formCtaLabel: "Open the enquiry form",
  formNote: "The form opens in Google Forms.",
  mapLinkLabel: "Open in Google Maps",
  socialsHeading: "Follow us",
  seo: {
    description:
      "Contact SAI Creations International by WhatsApp, Instagram, email or our enquiry form.",
  },
};
