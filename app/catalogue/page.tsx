import type { Metadata } from "next";
import { CategoryTile } from "@/components/catalogue/CategoryTile";
import { ProductWall } from "@/components/catalogue/ProductWall";
import { toWallItems } from "@/lib/catalogue";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import {
  categoryHref,
  getAllProducts,
  getCataloguePage,
  getCategories,
  getLabels,
  getSiteConfig,
} from "@/lib/content";
import { fillTemplate } from "@/lib/format";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCataloguePage();
  return { title: page.seo?.title ?? page.title, description: page.seo?.description };
}

export default async function CataloguePage() {
  const [page, categories, products, site, labels] = await Promise.all([
    getCataloguePage(),
    getCategories(),
    getAllProducts(),
    getSiteConfig(),
    getLabels(),
  ]);
  const count = (slug: string) => products.filter((p) => p.category === slug).length;

  return (
    <>
      <Container className="pt-10 pb-16 lg:pt-14 lg:pb-24">
        <Breadcrumbs
          label={site.ui.breadcrumbLabel}
          items={[{ label: site.ui.breadcrumbHome, href: "/" }, { label: page.title }]}
        />
        <div className="mt-12 grid gap-8 lg:mt-20 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-24">
          <h1 className="font-display text-display-xl font-light text-ink">{page.title}</h1>
          <p className="max-w-xl text-body-lg font-light text-ink-soft">{page.intro}</p>
        </div>
      </Container>

      <section aria-labelledby="catalogue-collections" className="pb-[clamp(4rem,10vw,9rem)]">
        <Container>
          <h2 id="catalogue-collections" className="mb-8 eyebrow text-muted">
            {page.categoriesHeading}
          </h2>
          <ul className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:gap-x-16">
            {categories.map((c, i) => (
              <li key={c.slug} className={i % 2 ? "md:mt-28" : undefined}>
                <CategoryTile
                  category={c}
                  href={categoryHref(c.slug)}
                  cta={fillTemplate(labels.catalogue.viewCategory, { name: c.name })}
                  meta={fillTemplate(labels.catalogue.productCount, { count: count(c.slug) })}
                  size="large"
                  sizes="(min-width: 768px) 45vw, 100vw"
                  index={i % 2}
                />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section
        aria-labelledby="catalogue-all"
        className="border-t border-hairline bg-white py-[clamp(4rem,10vw,9rem)]"
      >
        <Container>
          <div className="mb-12 flex items-baseline justify-between gap-6 lg:mb-16">
            <h2 id="catalogue-all" className="font-display text-display-md text-ink">
              {page.allProductsHeading}
            </h2>
            <p className="text-caption text-muted">
              {fillTemplate(labels.catalogue.productCount, { count: products.length })}
            </p>
          </div>
          <ProductWall
            items={toWallItems(products, site)}
            labels={{
              carousel: labels.carousel,
              lightbox: labels.lightbox,
              enquire: labels.enquire,
              product: labels.product,
            }}
            newTabHint={site.ui.opensInNewTab}
          />
        </Container>
      </section>
    </>
  );
}
