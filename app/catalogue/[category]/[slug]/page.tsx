import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhaseNote } from "@/components/dev/PhaseNote";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { Section } from "@/components/ui/Section";
import {
  categoryHref,
  getCataloguePage,
  getCategory,
  getProduct,
  getProductStaticParams,
  getSiteConfig,
} from "@/lib/content";
import { formatDimensions } from "@/lib/format";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getProductStaticParams();
}

export async function generateMetadata({
  params,
}: PageProps<"/catalogue/[category]/[slug]">): Promise<Metadata> {
  const { category, slug } = await params;
  const product = await getProduct(category, slug);
  if (!product) return {};
  return {
    title: product.seo?.title ?? product.name,
    description: product.seo?.description ?? product.summary,
  };
}

// Phase 1 stub: gallery, specs, enquiry buttons and related products arrive in Phase 2.
export default async function ProductPage({ params }: PageProps<"/catalogue/[category]/[slug]">) {
  const { category: categorySlug, slug } = await params;
  const [product, category, catalogue, site] = await Promise.all([
    getProduct(categorySlug, slug),
    getCategory(categorySlug),
    getCataloguePage(),
    getSiteConfig(),
  ]);
  if (!product || !category) notFound();
  const [image] = product.images;
  const dimensions = formatDimensions(product.dimensions);

  return (
    <Section>
      <Breadcrumbs
        label={site.ui.breadcrumbLabel}
        items={[
          { label: site.ui.breadcrumbHome, href: "/" },
          { label: catalogue.title, href: "/catalogue/" },
          { label: category.name, href: categoryHref(category.slug) },
          { label: product.name },
        ]}
        className="mb-10"
      />
      <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
        {image && (
          <ResponsiveImage
            image={image}
            aspect="4/5"
            sizes="(min-width: 768px) 50vw, 100vw"
            preload
          />
        )}
        <div className="space-y-6">
          <h1 className="font-display text-display-lg font-light">{product.name}</h1>
          <p className="text-caption text-muted">{product.code}</p>
          <p className="text-body-lg font-light text-ink-soft">{product.summary}</p>
          <dl className="divide-y divide-hairline border-y border-hairline text-body-sm">
            {dimensions && (
              <div className="grid grid-cols-[8rem_1fr] gap-4 py-3">
                <dt className="text-muted">Dimensions</dt>
                <dd>
                  {dimensions}
                  {product.dimensions.note && (
                    <span className="block text-muted">{product.dimensions.note}</span>
                  )}
                </dd>
              </div>
            )}
            <div className="grid grid-cols-[8rem_1fr] gap-4 py-3">
              <dt className="text-muted">Materials</dt>
              <dd>{product.materials.join(", ")}</dd>
            </div>
          </dl>
          <LinkArrow href={categoryHref(category.slug)}>{category.name}</LinkArrow>
        </div>
      </div>
      <PhaseNote>
        Phase 1 stub · Gallery, full specs, enquiry buttons and related products arrive in Phase 2
      </PhaseNote>
    </Section>
  );
}
