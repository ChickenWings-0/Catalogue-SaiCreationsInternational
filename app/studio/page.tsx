import type { Metadata } from "next";
import { PhaseNote } from "@/components/dev/PhaseNote";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getStudioPage } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getStudioPage();
  return { title: page.seo?.title ?? page.title, description: page.seo?.description };
}

// Phase 1 stub: the scroll-driven video → fullscreen → carousel sequence is built in Phase 3.
export default async function StudioPage() {
  const page = await getStudioPage();
  return (
    <Section>
      <SectionHeading as="h1" heading={page.title} intro={page.intro} />
      <ResponsiveImage
        image={page.video.poster}
        aspect="16/9"
        sizes="(min-width: 1600px) 1472px, 100vw"
        className="mt-12"
      />
      <PhaseNote>
        Phase 1 stub · Video scroll sequence and photo carousel arrive in Phase 3
      </PhaseNote>
    </Section>
  );
}
