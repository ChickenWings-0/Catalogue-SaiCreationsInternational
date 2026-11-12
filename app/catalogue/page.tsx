import type { Metadata } from "next";
import { PhaseNote } from "@/components/dev/PhaseNote";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  categoryHref,
  getCataloguePage,
  getCategories,
  getProductsByCategory,
  getSiteConfig,
} from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCataloguePage();
  return { title: page.seo?.title ?? page.title, description: page.seo?.description };
}

// Phase 1 stub: editorial tiles and the all-products grid arrive in Phase 2.
export default async function CataloguePage() {
  const [page, categories, site] = await Promise.all([
    getCataloguePage(),
    getCategories(),
    getSiteConfig(),
  ]);
  const counts = await Promise.all(categories.map((c) => getProductsByCategory(c.slug)));

  return (
    <Section>
      <Breadcrumbs
        label={site.ui.breadcrumbLabel}
        items={[{ label: site.ui.breadcrumbHome, href: "/" }, { label: page.title }]}
        className="mb-10"
      />
      <SectionHeading as="h1" heading={page.title} intro={page.intro} />

      <h2 className="mt-16 mb-6 eyebrow text-muted">{page.categoriesHeading}</h2>
      <ul className="divide-y divide-hairline border-y border-hairline">
        {categories.map((c, i) => (
          <li
            key={c.slug}
            className="flex flex-col gap-2 py-6 md:flex-row md:items-baseline md:justify-between"
          >
            <div>
              <LinkArrow href={categoryHref(c.slug)}>{c.name}</LinkArrow>
              <p className="mt-2 text-body-sm text-muted">{c.tagline}</p>
            </div>
            <p className="text-caption text-muted">{counts[i]?.length ?? 0} products</p>
          </li>
        ))}
      </ul>
      <PhaseNote>
        Phase 1 stub · Editorial category tiles and the all-products grid arrive in Phase 2
      </PhaseNote>
    </Section>
  );
}
