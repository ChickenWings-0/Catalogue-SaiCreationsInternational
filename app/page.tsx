import { PhaseNote } from "@/components/dev/PhaseNote";
import { Button } from "@/components/ui/Button";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categoryHref, getCategories, getHomePage } from "@/lib/content";

// Phase 1 stub: the full, data-driven Home sections are built in Phase 2.
export default async function HomePage() {
  const [home, categories] = await Promise.all([getHomePage(), getCategories()]);
  const hero = home.sections.find((s) => s.type === "hero");
  const slide = hero?.slides[0];
  const tiles = home.sections.find((s) => s.type === "categoryTiles");

  return (
    <>
      {slide && (
        <section className="relative">
          <ResponsiveImage
            image={slide.image}
            aspect="16/9"
            sizes="100vw"
            preload
            className="max-h-[88svh] min-h-[60svh] w-full"
          />
          <div className="absolute inset-0 flex items-end bg-linear-to-t from-ivory/90 via-ivory/40 to-transparent">
            <div className="mx-auto w-full max-w-(--container-content) px-4 pb-12 sm:px-6 lg:px-10 lg:pb-20 2xl:px-16">
              <div className="max-w-2xl space-y-5">
                {slide.eyebrow && <p className="eyebrow text-muted">{slide.eyebrow}</p>}
                <h1 className="font-display text-display-xl font-light">{slide.heading}</h1>
                {slide.subheading && (
                  <p className="text-body-lg font-light text-ink-soft">{slide.subheading}</p>
                )}
                {slide.cta && <Button href={slide.cta.href}>{slide.cta.label}</Button>}
              </div>
            </div>
          </div>
        </section>
      )}

      {tiles && (
        <Section labelledBy="home-categories">
          <SectionHeading id="home-categories" heading={tiles.heading} intro={tiles.intro} />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <li key={c.slug} className="space-y-2">
                <LinkArrow href={categoryHref(c.slug)}>{c.name}</LinkArrow>
                <p className="text-body-sm text-muted">{c.tagline}</p>
              </li>
            ))}
          </ul>
          <PhaseNote>
            Phase 1 stub · Home sections (tiles, featured products, Studio and About teasers) arrive
            in Phase 2
          </PhaseNote>
        </Section>
      )}
    </>
  );
}
