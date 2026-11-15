import type { Metadata } from "next";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAboutPage, getFaqs } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage();
  return { title: page.seo?.title ?? page.title, description: page.seo?.description };
}

// Phase 1 stub: anchors (#the-initiative, #the-present, #faqs) work now; the full layout with images arrives in Phase 4.
export default async function AboutPage() {
  const [page, faqs] = await Promise.all([getAboutPage(), getFaqs()]);
  return (
    <>
      <Section spacing="tight" className="pt-16 md:pt-24">
        <SectionHeading as="h1" heading={page.title} intro={page.intro} />
      </Section>

      {page.sections.map((section, i) => (
        <Section
          key={section.id}
          id={section.id}
          labelledBy={`${section.id}-heading`}
          tone={i % 2 ? "ivory" : "linen"}
        >
          <SectionHeading
            id={`${section.id}-heading`}
            eyebrow={section.eyebrow}
            heading={section.heading}
          />
          <div className="mt-8 max-w-prose space-y-5 text-body text-ink-soft">
            {section.body.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
          </div>
        </Section>
      ))}

      <Section id="faqs" labelledBy="faqs-heading">
        <SectionHeading id="faqs-heading" heading={page.faqHeading} />
        <FAQAccordion items={faqs} name="about-faq" className="mt-10 max-w-4xl" />
      </Section>
    </>
  );
}
