import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductWall } from "@/components/catalogue/ProductWall";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { toWallItems } from "@/lib/catalogue";
import {
  getCataloguePage,
  getCategories,
  getCategory,
  getLabels,
  getProductsByCategory,
  getSiteConfig,
} from "@/lib/content";
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

/** Visual-only category page: carousel + image wall. Click a photo → large view → WhatsApp. */
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
  const items = toWallItems(products, site);

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
        <div className="mx-auto mt-12 max-w-3xl space-y-5 text-center lg:mt-16">
          <p className="eyebrow text-muted">{category.tagline}</p>
          <h1 className="font-display text-display-xl font-light text-ink">{category.name}</h1>
          <p className="text-body-lg font-light text-ink-soft">{category.intro}</p>
          <p className="text-caption text-muted">
            {fillTemplate(labels.catalogue.productCount, { count: items.length })}
            {items.length > 0 && <> · {labels.catalogue.browse}</>}
          </p>
        </div>
      </Container>

      <Container className="mt-14 pb-[clamp(4rem,10vw,9rem)] lg:mt-20">
        {items.length ? (
          <ProductWall
            items={items}
            showCarousel
            labels={{
              carousel: labels.carousel,
              lightbox: labels.lightbox,
              enquire: labels.enquire,
              product: labels.product,
            }}
            newTabHint={site.ui.opensInNewTab}
          />
        ) : (
          <p className="py-24 text-center font-display text-display-sm text-muted">
            {labels.catalogue.comingSoon}
          </p>
        )}
      </Container>
    </>
  );
}
