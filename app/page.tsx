import { CategoryTile } from "@/components/catalogue/CategoryTile";
import { ProductWall } from "@/components/catalogue/ProductWall";
import { toWallItems } from "@/lib/catalogue";
import { Hero } from "@/components/home/Hero";
import { AboutTeaser, StudioTeaser } from "@/components/home/Teasers";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  categoryHref,
  getCategories,
  getFeaturedProducts,
  getHomePage,
  getLabels,
  getProductsByCategory,
  getSiteConfig,
} from "@/lib/content";
import { fillTemplate } from "@/lib/format";
import type { HomeSection } from "@/lib/schemas";

/**
 * Home: sections render in the order given in content/pages/home.ts
 * (pending client confirmation of the section list).
 */
export default async function HomePage() {
  const [home, site, labels, categories] = await Promise.all([
    getHomePage(),
    getSiteConfig(),
    getLabels(),
    getCategories(),
  ]);
  const counts = Object.fromEntries(
    await Promise.all(
      categories.map(async (c) => [c.slug, (await getProductsByCategory(c.slug)).length] as const),
    ),
  );

  const render = async (section: HomeSection, i: number) => {
    switch (section.type) {
      case "hero":
        return (
          <Hero
            key={i}
            slides={section.slides}
            slideshow={site.features.heroSlideshow}
            labels={labels.carousel}
          />
        );
      case "categoryTiles":
        return (
          <section key={i} aria-labelledby="home-categories" className="py-[clamp(4rem,10vw,9rem)]">
            <Container>
              <div data-reveal>
                <SectionHeading
                  id="home-categories"
                  heading={section.heading}
                  intro={section.intro}
                />
              </div>
              <ul className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-x-8">
                {categories.map((c, j) => (
                  <li key={c.slug} className={j % 2 ? "lg:mt-16" : undefined}>
                    <CategoryTile
                      category={c}
                      href={categoryHref(c.slug)}
                      cta={fillTemplate(labels.catalogue.viewCategory, { name: c.name })}
                      meta={fillTemplate(labels.catalogue.productCount, {
                        count: counts[c.slug] ?? 0,
                      })}
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      index={j}
                    />
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        );
      case "featuredProducts": {
        const products = await getFeaturedProducts(section.limit);
        return (
          <section
            key={i}
            aria-labelledby="home-featured"
            className="border-t border-hairline py-[clamp(4rem,10vw,9rem)]"
          >
            <Container>
              <div
                className="mb-12 flex flex-wrap items-end justify-between gap-6 lg:mb-16"
                data-reveal
              >
                <SectionHeading id="home-featured" heading={section.heading} />
                {section.cta && (
                  <Button href={section.cta.href} variant="ghost">
                    {section.cta.label}
                  </Button>
                )}
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
        );
      }
      case "studioTeaser":
        return <StudioTeaser key={i} section={section} />;
      case "aboutTeaser":
        return <AboutTeaser key={i} section={section} />;
    }
  };

  return <>{await Promise.all(home.sections.map(render))}</>;
}
