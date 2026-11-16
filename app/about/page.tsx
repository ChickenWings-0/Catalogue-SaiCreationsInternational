import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAboutPage, getFaqs } from "@/lib/content";
import type { AboutSection } from "@/lib/schemas";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage();
  return { title: page.seo?.title ?? page.title, description: page.seo?.description };
}

function Paragraphs({ items, className }: { items: string[]; className?: string }) {
  return (
    <div className={cn("space-y-5 text-body-lg font-light text-ink-soft", className)}>
      {items.map((p, j) => (
        <p key={j}>{p}</p>
      ))}
    </div>
  );
}

function SectionBody({ section }: { section: AboutSection }) {
  return (
    <>
      <Paragraphs items={section.body} className="mt-8" />
      {section.points && section.points.length > 0 && (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {section.points.map((pt, k) => (
            <li
              key={pt.title}
              data-reveal
              style={{ "--reveal-i": k } as React.CSSProperties}
              className="flex gap-4 border border-hairline bg-white p-6"
            >
              <MapPin
                className="mt-0.5 size-5 shrink-0 text-accent"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <div>
                <p className="font-display text-display-sm text-ink">{pt.title}</p>
                {pt.detail && <p className="mt-1 text-body-sm text-muted">{pt.detail}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
      {section.closing && <Paragraphs items={section.closing} className="mt-10" />}
    </>
  );
}

export default async function AboutPage() {
  const [page, faqs] = await Promise.all([getAboutPage(), getFaqs()]);
  return (
    <>
      <Container className="pt-16 pb-12 text-center lg:pt-24 lg:pb-16">
        <h1 className="font-display text-display-xl font-light text-ink">{page.title}</h1>
        {page.intro && (
          <p className="mx-auto mt-6 max-w-2xl text-body-lg font-light text-ink-soft">
            {page.intro}
          </p>
        )}
      </Container>

      {page.sections.map((section, i) => {
        const [first, second] = section.images;
        return (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-heading`}
            className={cn("py-[clamp(4rem,10vw,8rem)]", i % 2 ? "bg-ivory" : "bg-linen")}
          >
            <Container>
              {first ? (
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                  <div data-reveal>
                    <SectionHeading
                      id={`${section.id}-heading`}
                      eyebrow={section.eyebrow}
                      heading={section.heading}
                    />
                    <SectionBody section={section} />
                  </div>
                  {/* Editorial pair: a large photo with a smaller one overlapping its corner. */}
                  <div className="relative pb-16 sm:pb-24" data-reveal>
                    <ResponsiveImage
                      image={first}
                      aspect="3/2"
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      className={second ? "sm:w-[88%]" : undefined}
                    />
                    {second && (
                      <ResponsiveImage
                        image={second}
                        aspect="3/2"
                        sizes="(min-width: 1024px) 25vw, 60vw"
                        className="absolute right-0 bottom-0 w-[62%] border-8 border-linen shadow-float"
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="mx-auto max-w-3xl" data-reveal>
                  <SectionHeading
                    id={`${section.id}-heading`}
                    eyebrow={section.eyebrow}
                    heading={section.heading}
                  />
                  <SectionBody section={section} />
                </div>
              )}
            </Container>
          </section>
        );
      })}

      <section
        id="faqs"
        aria-labelledby="faqs-heading"
        className="border-t border-hairline py-[clamp(4rem,10vw,8rem)]"
      >
        <Container>
          <div className="mx-auto max-w-3xl">
            <SectionHeading id="faqs-heading" heading={page.faqHeading} />
            <FAQAccordion items={faqs} name="about-faq" className="mt-10" />
          </div>
        </Container>
      </section>
    </>
  );
}
