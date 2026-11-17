import type { MetadataRoute } from "next";
import { getSiteUrl, isProductionSite } from "@/lib/content";

// Emitted as a static /robots.txt in the export.
export const dynamic = "force-static";

/** Live site: crawl everything. Previews and local builds: block all crawlers. */
export default function robots(): MetadataRoute.Robots {
  const url = getSiteUrl();
  if (!isProductionSite()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${url}/sitemap.xml`,
    host: url,
  };
}
