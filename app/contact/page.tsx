import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getContactPage } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage();
  return { title: page.seo?.title ?? page.title, description: page.seo?.description };
}

// Phase 1 stub: contact details, static map, socials and the Google Form button arrive in Phase 4.
export default async function ContactPage() {
  const page = await getContactPage();
  return (
    <Section>
      <SectionHeading as="h1" heading={page.title} intro={page.intro} />
    </Section>
  );
}
