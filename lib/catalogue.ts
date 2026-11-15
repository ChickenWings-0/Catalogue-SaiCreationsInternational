import { buildWhatsAppUrl } from "./enquiry";
import type { ImageAsset, Product, SiteConfig } from "./schemas";

/** What the visual catalogue components need per product (serialisable for client components). */
export type WallItem = {
  /** Stable key (internal only; never shown to visitors). */
  key: string;
  /** Accessible description of the photo (its alt text). */
  label: string;
  href: string;
  image: ImageAsset;
  /** Prefilled WhatsApp link to the product page (the link preview shows the photo). */
  whatsappUrl: string;
};

export function toWallItems(
  products: Product[],
  site: Pick<SiteConfig, "contact" | "enquiry" | "url">,
): WallItem[] {
  return products.flatMap((p) => {
    const [image] = p.images;
    return image
      ? [
          {
            key: p.id,
            label: image.alt,
            href: p.href,
            image,
            whatsappUrl: buildWhatsAppUrl(site, p),
          },
        ]
      : [];
  });
}
