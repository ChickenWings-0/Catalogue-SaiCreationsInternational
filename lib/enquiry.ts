import { fillTemplate } from "./format.ts";
import type { Product, SiteConfig } from "./schemas";

/**
 * WhatsApp click-to-chat link, prefilled with the product code and the product page URL.
 * Websites can't attach a photo to a WhatsApp message; instead WhatsApp shows the page's
 * og:image (the product photo) as a link preview, as long as the URL is in the message.
 */
export function buildWhatsAppUrl(
  site: Pick<SiteConfig, "contact" | "enquiry" | "url">,
  product: Pick<Product, "code" | "href">,
): string {
  const text = fillTemplate(site.enquiry.whatsappTemplate, {
    code: product.code,
    url: `${site.url}${product.href}`,
  });
  return `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Instagram direct-message link (ig.me opens a DM thread). Falls back to the profile URL if no
 * handle is configured.
 */
export function buildInstagramDmUrl(site: Pick<SiteConfig, "socials">): string | null {
  const ig = site.socials.find((s) => s.platform === "instagram");
  if (!ig) return null;
  return ig.handle ? `https://ig.me/m/${ig.handle.replace(/^@/, "")}` : ig.url;
}
