import type { ContactPageInput } from "@/lib/schemas";

// Contact details, socials, the map link (and the Google Form URL, when set) come from content/site.ts.
export const contactPage: ContactPageInput = {
  title: "Contact Us",
  intro:
    "We'd love to hear from you. For product enquiries, custom requests or trade orders, message us on WhatsApp, email us, request a quotation, or visit us in Noida.",
  whatsappHeading: "WhatsApp",
  whatsappCta: "Chat on WhatsApp",
  instagramHeading: "Instagram",
  instagramCta: "Follow us",
  visitHeading: "Visit us",
  mapLinkLabel: "Get directions",
  emailHeading: "Email",
  emailCta: "Send an email",
  formHeading: "Quotation",
  formCtaLabel: "Request a quotation",
  formNote:
    "Tell us which pieces you're interested in and the quantities you need, and we'll send you a quotation. The form opens in Google Forms.",
  seo: {
    description:
      "Contact SAI Creations International on WhatsApp (+91 9289 555 616), by email (info@saicreationsintl.com), request a quotation, or visit us at D-32, Sector 7, Noida.",
  },
};
