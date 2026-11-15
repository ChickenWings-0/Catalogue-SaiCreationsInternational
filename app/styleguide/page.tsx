import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { Button } from "@/components/ui/Button";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { resolveImage } from "@/lib/images";

// Internal design reference (Phase 0). Not linked from navigation, noindex, excluded from the sitemap.
// Labels here are developer-facing, not client content.
export const metadata: Metadata = {
  title: "Style guide",
  robots: { index: false, follow: false },
};

// Token names only: swatches follow the active palette (values: app/globals.css, app/palettes.css).
const COLOURS = [
  "ivory",
  "white",
  "linen",
  "greige",
  "hairline",
  "stone",
  "ink",
  "ink-soft",
  "muted",
  "accent",
  "accent-hover",
  "accent-dot",
  "accent-tint",
  "indigo",
  "cta",
  "cta-hover",
  "on-cta",
] as const;

const TYPE = [
  ["display-xl", "font-display text-display-xl font-light", "Crafted by hand, made for home"],
  ["display-lg", "font-display text-display-lg font-light", "Product Catalogue"],
  ["display-md", "font-display text-display-md", "Featured pieces"],
  ["display-sm", "font-display text-display-sm", "Jaipur Block-Print Cushion Cover"],
  ["eyebrow", "eyebrow", "Explore the collection"],
  ["nav", "text-nav uppercase", "Product Catalogue"],
  [
    "body-lg",
    "text-body-lg font-light",
    "Hand-made home furnishings and handicrafts, designed in India.",
  ],
  [
    "body",
    "text-body",
    "Body copy sits at 16px with a generous 1.65 line height for comfortable reading.",
  ],
  ["body-sm", "text-body-sm", "Specifications, captions and footer text use the small body size."],
  ["caption", "text-caption text-muted", "SCI-HD-001"],
] as const;

export default function StyleGuidePage() {
  const sample = resolveImage(
    { src: "products/sci-hd-001.jpg", alt: "Product photo" },
    "styleguide",
  );
  const hero = resolveImage(
    { src: "placeholders/home/hero-1.jpg", alt: "Placeholder hero image" },
    "styleguide",
  );

  return (
    <div className="mx-auto max-w-(--container-content) space-y-20 px-4 py-16 sm:px-6 lg:px-10 2xl:px-16">
      <header className="space-y-3">
        <p className="eyebrow text-muted">Internal reference</p>
        <h1 className="font-display text-display-lg font-light">Style guide</h1>
      </header>

      <section className="space-y-6" aria-labelledby="sg-wordmark">
        <h2 id="sg-wordmark" className="eyebrow text-muted">
          Wordmark
        </h2>
        <p className="font-display text-[22px] tracking-[0.28em] uppercase">
          Sai Creations International
        </p>
        <p className="flex flex-col items-start font-display uppercase">
          <span className="text-[17px] tracking-[0.2em]">Sai Creations</span>
          <span className="text-[10px] tracking-[0.42em]">International</span>
        </p>
      </section>

      <section className="space-y-6" aria-labelledby="sg-colours">
        <h2 id="sg-colours" className="eyebrow text-muted">
          Colour tokens
        </h2>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {COLOURS.map((name) => (
            <li key={name} className="space-y-2">
              <div
                className="h-16 border border-hairline"
                style={{ backgroundColor: `var(--color-${name})` }}
              />
              <p className="text-body-sm">{name}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-6" aria-labelledby="sg-type">
        <h2 id="sg-type" className="eyebrow text-muted">
          Type scale
        </h2>
        <dl className="divide-y divide-hairline">
          {TYPE.map(([token, cls, text]) => (
            <div key={token} className="grid gap-2 py-4 md:grid-cols-[10rem_1fr] md:items-baseline">
              <dt className="text-caption text-muted">{token}</dt>
              <dd className={cls}>{text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="space-y-6" aria-labelledby="sg-buttons">
        <h2 id="sg-buttons" className="eyebrow text-muted">
          Buttons &amp; links
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="accent" icon={<FaWhatsapp className="size-4" />}>
            Enquire on WhatsApp
          </Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
        </div>
        <p className="text-body">
          Inline{" "}
          <a
            href="#sg-buttons"
            className="text-accent underline underline-offset-[3px] hover:text-accent-hover"
          >
            body link
          </a>{" "}
          and an{" "}
          <a href="#sg-buttons" className="inline-flex items-center gap-2 link-grow eyebrow">
            arrow link <ArrowRight className="size-3.5" aria-hidden="true" />
          </a>
        </p>
      </section>

      <section className="space-y-6" aria-labelledby="sg-images">
        <h2 id="sg-images" className="eyebrow text-muted">
          Images (static loader, pre-built WebP)
        </h2>
        <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
          <ResponsiveImage image={sample} aspect="4/5" sizes="(min-width: 768px) 33vw, 100vw" />
          <ResponsiveImage image={hero} sizes="(min-width: 768px) 66vw, 100vw" />
        </div>
      </section>
    </div>
  );
}
