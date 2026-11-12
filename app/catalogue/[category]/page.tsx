import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhaseNote } from "@/components/dev/PhaseNote";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  getCataloguePage,
  getCategories,
  getCategory,
  getProductsByCategory,
  getSiteConfig,
} from "@/lib/content";

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

// Phase 1 stub: product grid, filters and sorting arrive in Phase 2.
export default async function CategoryPage({ params }: PageProps<"/catalogue/[category]">) {
  const { category: slug } = await params;
  const [category, products, catalogue, site] = await Promise.all([
    getCategory(slug),
    getProductsByCategory(slug),
    getCataloguePage(),
    getSiteConfig(),
  ]);
  if (!category) notFound();

  return (
    <Section>
      <Breadcrumbs
        label={site.ui.breadcrumbLabel}
        items={[
          { label: site.ui.breadcrumbHome, href: "/" },
          { label: catalogue.title, href: "/catalogue/" },
          { label: category.name },
        ]}
        className="mb-10"
      />
      <SectionHeading
        as="h1"
        eyebrow={category.tagline}
        heading={category.name}
        intro={category.intro}
      />

      <ul className="mt-12 divide-y divide-hairline border-y border-hairline">
        {products.map((p) => (
          <li key={p.id}>
            <Link
              href={p.href}
              className="group flex items-baseline justify-between gap-6 py-4 transition-colors"
            >
              <span className="font-display text-display-sm transition-colors group-hover:text-accent">
                {p.name}
              </span>
              <span className="shrink-0 text-caption text-muted">{p.code}</span>
            </Link>
          </li>
        ))}
      </ul>
      <PhaseNote>Phase 1 stub · Product grid, filters and sorting arrive in Phase 2</PhaseNote>
    </Section>
  );
}
