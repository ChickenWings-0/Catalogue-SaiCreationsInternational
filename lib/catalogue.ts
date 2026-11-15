import { buildWhatsAppUrl } from "./enquiry";
import type { ImageAsset, Product, SiteConfig } from "./schemas";

/** What the visual catalogue components need per product (serialisable for client components). */
export type WallItem = {
  code: string;
  href: string;
  image: ImageAsset;
  /** Prefilled WhatsApp link: product code + product page URL (link preview shows the photo). */
  whatsappUrl: string;
};

export function toWallItems(
  products: Product[],
  site: Pick<SiteConfig, "contact" | "enquiry" | "url">,
): WallItem[] {
  return products.flatMap((p) => {
    const [image] = p.images;
    return image
      ? [{ code: p.code, href: p.href, image, whatsappUrl: buildWhatsAppUrl(site, p) }]
      : [];
  });
}
