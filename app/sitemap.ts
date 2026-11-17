import type { MetadataRoute } from "next";
import { categoryHref, getAllProducts, getCategories, getSiteUrl } from "@/lib/content";

// Emitted as a static /sitemap.xml in the export.
export const dynamic = "force-static";

/** Every public page, with trailing slashes to match the site's URLs. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = getSiteUrl();
  const now = new Date();
  const [categories, products] = await Promise.all([getCategories(), getAllProducts()]);

  const page = (
    path: string,
    priority: number,
    changeFrequency: "weekly" | "monthly",
  ): MetadataRoute.Sitemap[number] => ({
    url: `${url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    page("/", 1, "weekly"),
    page("/catalogue/", 0.9, "weekly"),
    ...categories.map((c) => page(categoryHref(c.slug), 0.8, "weekly")),
    page("/studio/", 0.6, "monthly"),
    page("/about/", 0.6, "monthly"),
    page("/contact/", 0.7, "monthly"),
    ...products.map((p) => page(p.href, 0.5, "monthly")),
  ];
}
