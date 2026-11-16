import { Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import type { HomeSection } from "@/lib/schemas";

type StudioTeaserData = Extract<HomeSection, { type: "studioTeaser" }>;
type AboutTeaserData = Extract<HomeSection, { type: "aboutTeaser" }>;

/** The Studio teaser: a wide still with a play-style mark, linking to /studio. No video on Home. */
export function StudioTeaser({ section }: { section: StudioTeaserData }) {
  return (
    <section aria-labelledby="studio-teaser" className="bg-linen py-[clamp(4rem,10vw,9rem)]">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[7fr_5fr] lg:gap-16">
          <div className="group relative overflow-hidden" data-reveal>
            <ResponsiveImage
              image={section.media}
              aspect="16/10"
              sizes="(min-width: 1024px) 58vw, 100vw"
              imgClassName="transition-transform duration-[1200ms] ease-soft group-hover:scale-[1.03]"
            />
            <span className="absolute top-1/2 left-1/2 inline-flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink backdrop-blur-sm transition-colors group-hover:bg-white">
              <Play className="ml-1 size-6" strokeWidth={1.25} aria-hidden="true" />
            </span>
          </div>
          <div className="max-w-md space-y-6" data-reveal>
            {section.eyebrow && <p className="eyebrow text-muted">{section.eyebrow}</p>}
            <h2 id="studio-teaser" className="font-display text-display-md text-ink">
              {section.heading}
            </h2>
            <p className="text-body-lg font-light text-ink-soft">{section.body}</p>
            <Button href={section.cta.href} variant="secondary">
              {section.cta.label}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** About teaser: text left, portrait image right. */
export function AboutTeaser({ section }: { section: AboutTeaserData }) {
  return (
    <section aria-labelledby="about-teaser" className="py-[clamp(4rem,10vw,9rem)]">
      <Container>
        <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-24">
          <div className="max-w-md space-y-6 md:order-1 md:justify-self-end" data-reveal>
            {section.eyebrow && <p className="eyebrow text-muted">{section.eyebrow}</p>}
            <h2 id="about-teaser" className="font-display text-display-md text-ink">
              {section.heading}
            </h2>
            <p className="text-body-lg font-light text-ink-soft">{section.body}</p>
            <Button href={section.cta.href} variant="ghost">
              {section.cta.label}
            </Button>
          </div>
          <div className="md:order-2 md:max-w-lg" data-reveal>
            <ResponsiveImage
              image={section.image}
              aspect="3/2"
              sizes="(min-width: 768px) 45vw, 100vw"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
