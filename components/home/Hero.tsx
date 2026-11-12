"use client";

import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { fillTemplate } from "@/lib/format";
import type { HomeSection, Labels } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Slide = Extract<HomeSection, { type: "hero" }>["slides"][number];

type Props = {
  slides: Slide[];
  /** features.heroSlideshow: when false only the first slide is shown. */
  slideshow: boolean;
  intervalMs?: number;
  labels: Labels["carousel"];
};

/**
 * Full-bleed home hero. With several slides it cross-fades automatically, pausing on hover or
 * focus and stopping after manual navigation. There's a visible pause button (WCAG 2.2.2) and
 * no autoplay with reduced motion. The first image is preloaded (LCP).
 */
export function Hero({ slides: all, slideshow, intervalMs = 6500, labels }: Props) {
  const slides = slideshow ? all : all.slice(0, 1);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(slideshow && slides.length > 1);
  const [hovered, setHovered] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const multi = slides.length > 1;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- respect a user preference read after mount
      setPlaying(false);
    }
  }, []);

  useEffect(() => {
    if (!playing || hovered || !multi) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), intervalMs);
    return () => window.clearTimeout(t);
  }, [playing, hovered, index, multi, slides.length, intervalMs]);

  const goTo = useCallback((i: number) => {
    setIndex(i);
    setPlaying(false);
  }, []);

  const slide = slides[index] ?? slides[0];
  if (!slide) return null;

  return (
    <section
      ref={rootRef}
      aria-roledescription={multi ? "carousel" : undefined}
      aria-label={multi ? labels.region : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) setHovered(false);
      }}
      className="relative h-[min(88svh,960px)] min-h-[560px] overflow-hidden bg-greige"
    >
      {slides.map((s, i) => (
        <div
          key={s.image.src}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 transition-opacity duration-[1400ms] ease-soft",
            i === index ? "opacity-100" : "opacity-0",
          )}
        >
          <ResponsiveImage
            image={s.image}
            fill
            sizes="100vw"
            preload={i === 0}
            imgClassName={cn(
              "transition-transform duration-[8000ms] ease-soft",
              i === index ? "scale-[1.04]" : "scale-100",
            )}
          />
        </div>
      ))}

      {/* Legibility wash: bottom on mobile, left on desktop (token colours, follows the palette). */}
      <div className="absolute inset-0 bg-linear-to-t from-ivory/95 via-ivory/55 to-transparent md:bg-linear-to-r md:from-ivory/90 md:via-ivory/45" />

      <div className="relative mx-auto flex h-full max-w-(--container-content) items-end px-4 pb-14 sm:px-6 md:items-center md:pb-0 lg:px-10 2xl:px-16">
        <div key={index} className="max-w-xl animate-fade-in space-y-6 md:max-w-2xl">
          {slide.eyebrow && <p className="eyebrow text-muted">{slide.eyebrow}</p>}
          {index === 0 ? (
            <h1 className="font-display text-display-xl font-light text-ink">{slide.heading}</h1>
          ) : (
            <p className="font-display text-display-xl font-light text-ink">{slide.heading}</p>
          )}
          {slide.subheading && (
            <p className="max-w-lg text-body-lg font-light text-ink-soft">{slide.subheading}</p>
          )}
          {slide.cta && (
            <div className="pt-2">
              <Button href={slide.cta.href} size="lg">
                {slide.cta.label}
              </Button>
            </div>
          )}
        </div>
      </div>

      {multi && (
        <div className="absolute inset-x-0 bottom-5 mx-auto flex max-w-(--container-content) items-center gap-4 px-4 sm:px-6 lg:px-10 2xl:px-16">
          <ul className="flex items-center gap-2">
            {slides.map((s, i) => (
              <li key={s.image.src}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={fillTemplate(labels.goTo, { n: i + 1, total: slides.length })}
                  aria-current={i === index ? "true" : undefined}
                  className="group flex h-8 items-center"
                >
                  <span
                    className={cn(
                      "block h-[2px] transition-all duration-500 ease-soft",
                      i === index ? "w-10 bg-ink" : "w-5 bg-stone group-hover:bg-ink",
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? labels.pause : labels.play}
            className="inline-flex size-9 items-center justify-center text-ink hover:text-accent"
          >
            {playing ? (
              <Pause className="size-4" strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <Play className="size-4" strokeWidth={1.5} aria-hidden="true" />
            )}
          </button>
        </div>
      )}
    </section>
  );
}
