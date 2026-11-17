import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa6";
import { ProductImage } from "@/components/catalogue/ProductImage";
import { ProductWall } from "@/components/catalogue/ProductWall";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { toWallItems } from "@/lib/catalogue";
import {
  categoryHref,
  getCataloguePage,
  getCategory,
  getLabels,
  getProduct,
  getProductStaticParams,
  getProductsByCategory,
  getRelatedProducts,
  getSiteConfig,
} from "@/lib/content";
import { buildWhatsAppUrl } from "@/lib/enquiry";
import { fillTemplate } from "@/lib/format";
import { sharePath } from "@/lib/image-widths.mjs";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getProductStaticParams();
}

/**
 * The product photo is the page's share image, so when this URL is sent on WhatsApp
 * (the enquiry message includes it) the chat shows the photo as a link preview.
 */
export async function generateMetadata({
  params,
}: PageProps<"/catalogue/[category]/[slug]">): Promise<Metadata> {
  const { category: categorySlug, slug } = await params;
  const [product, category, site, labels, siblings] = await Promise.all([
    getProduct(categorySlug, slug),
    getCategory(categorySlug),
    getSiteConfig(),
    getLabels(),
    getProductsByCategory(categorySlug),
  ]);
  if (!product || !category) return {};
  const [image] = product.images;
  const piece = fillTemplate(labels.product.piece, {
    n: siblings.findIndex((p) => p.id === product.id) + 1,
  });
  const title = `${category.name} · ${piece}`;
  const ogImage = image
    ? [
        {
          url: sharePath(image.src),
          width: Math.min(image.width, 1200),
          height: Math.min(image.height, 1200),
          alt: image.alt,
        },
      ]
    : undefined;
  return {
    title,
    description: category.intro,
    openGraph: {
      title: `${title} · ${site.legalName}`,
      description: category.tagline,
      url: product.href,
      siteName: site.legalName,
      type: "website",
      images: ogImage,
    },
    twitter: { card: "summary_large_image", images: ogImage?.map((i) => i.url) },
  };
}

/** Minimal product page: photo + WhatsApp (no codes or details). Target of shared WhatsApp links. */
export default async function ProductPage({ params }: PageProps<"/catalogue/[category]/[slug]">) {
  const { category: categorySlug, slug } = await params;
  const [product, category, catalogue, site, labels, siblings] = await Promise.all([
    getProduct(categorySlug, slug),
    getCategory(categorySlug),
    getCataloguePage(),
    getSiteConfig(),
    getLabels(),
    getProductsByCategory(categorySlug),
  ]);
  if (!product || !category) notFound();
  const [image] = product.images;
  const related = await getRelatedProducts(product, 8);
  const piece = fillTemplate(labels.product.piece, {
    n: siblings.findIndex((p) => p.id === product.id) + 1,
  });

  return (
    <>
      <Container className="pt-8 pb-[clamp(4rem,8vw,7rem)] lg:pt-12">
        <Breadcrumbs
          label={site.ui.breadcrumbLabel}
          items={[
            { label: site.ui.breadcrumbHome, href: "/" },
            { label: catalogue.title, href: "/catalogue/" },
            { label: category.name, href: categoryHref(category.slug) },
            { label: piece },
          ]}
        />

        <div className="mt-8 grid items-center gap-10 lg:mt-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
          {image && (
            <ProductImage
              image={image}
              tone="white"
              sizes="(min-width: 1024px) 55vw, 100vw"
              preload
              className="border border-hairline"
            />
          )}

          <div className="space-y-8">
            <div className="space-y-4">
              <p className="eyebrow text-muted">{category.tagline}</p>
              <h1 className="font-display text-display-lg font-light text-ink">
                <Link
                  href={categoryHref(category.slug)}
                  className="transition-colors hover:text-accent"
                >
                  {category.name}
                </Link>
              </h1>
            </div>
            <div className="space-y-5 border border-hairline bg-white p-6 sm:p-8">
              <h2 className="eyebrow text-ink">{labels.enquire.heading}</h2>
              <p className="text-body-sm text-muted">{labels.enquire.intro}</p>
              <Button
                href={buildWhatsAppUrl(site, product)}
                variant="accent"
                size="lg"
                icon={<FaWhatsapp className="size-4" />}
                newTabHint={site.ui.opensInNewTab}
                className="w-full"
              >
                {labels.enquire.whatsapp}
              </Button>
              {site.googleFormUrl && (
                <Button
                  href={site.googleFormUrl}
                  variant="secondary"
                  size="lg"
                  newTabHint={site.ui.opensInNewTab}
                  className="w-full"
                >
                  {labels.enquire.quote}
                </Button>
              )}
            </div>
            <LinkArrow href={categoryHref(category.slug)}>
              {fillTemplate(labels.product.back, { category: category.name })}
            </LinkArrow>
          </div>
        </div>
      </Container>

      {related.length > 0 && (
        <section
          aria-labelledby="related"
          className="border-t border-hairline bg-white py-[clamp(4rem,10vw,8rem)]"
        >
          <Container>
            <h2 id="related" className="mb-12 font-display text-display-md text-ink">
              {fillTemplate(labels.product.more, { category: category.name })}
            </h2>
            <ProductWall
              items={toWallItems(related, site)}
              labels={{
                carousel: labels.carousel,
                lightbox: labels.lightbox,
                enquire: labels.enquire,
                product: labels.product,
              }}
              newTabHint={site.ui.opensInNewTab}
              quoteUrl={site.googleFormUrl}
            />
          </Container>
        </section>
      )}
    </>
  );
}
