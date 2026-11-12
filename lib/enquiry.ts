import { fillTemplate } from "./format";
import type { Product, SiteConfig } from "./schemas";

/** WhatsApp click-to-chat link, prefilled with the product name, code and page URL. */
export function buildWhatsAppUrl(
  site: Pick<SiteConfig, "contact" | "enquiry" | "url">,
  product: Pick<Product, "name" | "code" | "href">,
): string {
  const text = fillTemplate(site.enquiry.whatsappTemplate, {
    name: product.name,
    code: product.code,
    url: `${site.url}${product.href}`,
  });
  return `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Instagram direct-message link (ig.me opens a DM thread). Instagram doesn't support
 * prefilled text, so the product page also offers a "copy code" button.
 * Falls back to the profile URL if no handle is configured.
 */
export function buildInstagramDmUrl(site: Pick<SiteConfig, "socials">): string | null {
  const ig = site.socials.find((s) => s.platform === "instagram");
  if (!ig) return null;
  return ig.handle ? `https://ig.me/m/${ig.handle.replace(/^@/, "")}` : ig.url;
}
