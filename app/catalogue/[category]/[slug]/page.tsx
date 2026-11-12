import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnquireButtons } from "@/components/catalogue/EnquireButtons";
import { ProductGallery } from "@/components/catalogue/ProductGallery";
import { ProductGrid } from "@/components/catalogue/ProductGrid";
import { ProductSpecs } from "@/components/catalogue/ProductSpecs";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { LinkArrow } from "@/components/ui/LinkArrow";
import {
  categoryHref,
  getCataloguePage,
  getCategory,
  getLabels,
  getProduct,
  getProductStaticParams,
  getRelatedProducts,
  getSiteConfig,
} from "@/lib/content";
import { fillTemplate } from "@/lib/format";

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
    title: product.seo?.title ?? `${product.name} (${product.code})`,
    description: product.seo?.description ?? product.summary,
  };
}

export default async function ProductPage({ params }: PageProps<"/catalogue/[category]/[slug]">) {
  const { category: categorySlug, slug } = await params;
  const [product, category, catalogue, site, labels] = await Promise.all([
    getProduct(categorySlug, slug),
    getCategory(categorySlug),
    getCataloguePage(),
    getSiteConfig(),
    getLabels(),
  ]);
  if (!product || !category) notFound();
  const related = await getRelatedProducts(product, 4);

  return (
    <>
      <Container className="pt-8 pb-[clamp(4rem,8vw,7rem)] lg:pt-12">
        <Breadcrumbs
          label={site.ui.breadcrumbLabel}
          items={[
            { label: site.ui.breadcrumbHome, href: "/" },
            { label: catalogue.title, href: "/catalogue/" },
            { label: category.name, href: categoryHref(category.slug) },
            { label: product.name },
          ]}
        />

        <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 xl:gap-24">
          <ProductGallery
            images={product.images}
            productName={product.name}
            labels={labels.gallery}
          />

          <div className="space-y-8 lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
            <div className="space-y-4">
              <Link
                href={categoryHref(category.slug)}
                className="link-grow eyebrow text-muted transition-colors hover:text-accent"
              >
                {category.name}
              </Link>
              <h1 className="font-display text-display-lg font-light text-ink">{product.name}</h1>
              <p className="text-caption tracking-[0.12em] text-muted">{product.code}</p>
              <p className="text-body-lg font-light text-ink-soft">{product.summary}</p>
            </div>

            <EnquireButtons product={product} site={site} labels={labels.enquire} />

            <section aria-labelledby="product-details" className="space-y-4">
              <h2 id="product-details" className="eyebrow text-ink">
                {labels.product.details}
              </h2>
              <ProductSpecs product={product} labels={labels.product} />
            </section>

            <section aria-labelledby="product-description" className="space-y-4">
              <h2 id="product-description" className="eyebrow text-ink">
                {labels.product.description}
              </h2>
              <div className="space-y-4 text-body text-ink-soft">
                {product.description.split(/\n{2,}/).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          </div>
        </div>
      </Container>

      {related.length > 0 && (
        <section aria-labelledby="related" className="bg-linen py-[clamp(4rem,10vw,8rem)]">
          <Container>
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <h2 id="related" className="font-display text-display-md text-ink">
                {fillTemplate(labels.product.related, { category: category.name })}
              </h2>
              <LinkArrow href={categoryHref(category.slug)}>
                {fillTemplate(labels.catalogue.viewCategory, { name: category.name })}
              </LinkArrow>
            </div>
            <ProductGrid products={related} />
          </Container>
        </section>
      )}
    </>
  );
}
