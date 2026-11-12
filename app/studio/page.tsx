import type { Metadata } from "next";
import { StudioScrollVideo } from "@/components/studio/StudioScrollVideo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getLabels, getStudioPage } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getStudioPage();
  return { title: page.seo?.title ?? page.title, description: page.seo?.description };
}

export default async function StudioPage() {
  const [page, labels] = await Promise.all([getStudioPage(), getLabels()]);
  return (
    <>
      <Container className="pt-16 pb-12 text-center lg:pt-24 lg:pb-16">
        <h1 className="font-display text-display-xl font-light text-ink">{page.title}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-body-lg font-light text-ink-soft">{page.intro}</p>
      </Container>

      <StudioScrollVideo
        video={page.video}
        carousel={page.carousel}
        expandDistanceVh={page.interaction?.expandDistanceVh}
        deadZoneVh={page.interaction?.deadZoneVh}
        revealDistanceVh={page.interaction?.revealDistanceVh}
        labels={{ video: labels.video, carousel: labels.carousel }}
      />

      {page.outro && (
        <section aria-labelledby="studio-outro" className="py-[clamp(4rem,10vw,8rem)]">
          <Container className="text-center">
            <h2 id="studio-outro" className="font-display text-display-md text-ink" data-reveal>
              {page.outro.heading}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-body-lg font-light text-ink-soft" data-reveal>
              {page.outro.body}
            </p>
            {page.outro.cta && (
              <div className="mt-8" data-reveal>
                <Button href={page.outro.cta.href}>{page.outro.cta.label}</Button>
              </div>
            )}
          </Container>
        </section>
      )}
    </>
  );
}
