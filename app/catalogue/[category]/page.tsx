import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CatalogueBrowser } from "@/components/catalogue/CatalogueBrowser";
import { ProductGrid } from "@/components/catalogue/ProductGrid";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import {
  getCataloguePage,
  getCategories,
  getCategory,
  getLabels,
  getProductsByCategory,
  getSiteConfig,
} from "@/lib/content";
import { getFilterFacets } from "@/lib/filters";
import { fillTemplate } from "@/lib/format";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/catalogue/[category]">): Promise<Metadata> {
  const category = await getCategory((await params).category);
  if (!category) return {};
  return {
    title: category.seo?.title ?? category.name,
    description: category.seo?.description ?? category.intro,
  };
}

export default async function CategoryPage({ params }: PageProps<"/catalogue/[category]">) {
  const { category: slug } = await params;
  const [category, products, catalogue, site, labels] = await Promise.all([
    getCategory(slug),
    getProductsByCategory(slug),
    getCataloguePage(),
    getSiteConfig(),
    getLabels(),
  ]);
  if (!category) notFound();

  return (
    <>
      <Container className="pt-10 lg:pt-14">
        <Breadcrumbs
          label={site.ui.breadcrumbLabel}
          items={[
            { label: site.ui.breadcrumbHome, href: "/" },
            { label: catalogue.title, href: "/catalogue/" },
            { label: category.name },
          ]}
        />
        <div className="mt-10 grid items-end gap-10 md:grid-cols-[1fr_minmax(0,22rem)] lg:mt-14 lg:grid-cols-[1fr_minmax(0,26rem)] lg:gap-24">
          <div className="space-y-6 pb-2">
            <p className="eyebrow text-muted">{category.tagline}</p>
            <h1 className="font-display text-display-xl font-light text-ink">{category.name}</h1>
            <p className="max-w-xl text-body-lg font-light text-ink-soft">{category.intro}</p>
            <p className="text-caption text-muted">
              {fillTemplate(labels.catalogue.productCount, { count: products.length })}
            </p>
          </div>
          <ResponsiveImage
            image={category.heroImage ?? category.tileImage}
            aspect="4/5"
            sizes="(min-width: 1024px) 26rem, (min-width: 768px) 22rem, 100vw"
            preload
            className="hidden md:block"
          />
        </div>
      </Container>

      <Container className="mt-12 pb-[clamp(4rem,10vw,9rem)] lg:mt-20">
        {/* Without JS (or before hydration) the full grid is rendered statically. */}
        <Suspense fallback={<ProductGrid products={products} preloadCount={4} className="mt-16" />}>
          <CatalogueBrowser
            products={products}
            facets={getFilterFacets(products)}
            enabled={site.features.catalogueFilters}
            labels={labels.filters}
          />
        </Suspense>
      </Container>
    </>
  );
}
