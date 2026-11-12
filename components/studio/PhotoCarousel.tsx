"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { fillTemplate } from "@/lib/format";
import type { Labels, StudioPage } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { PaginationDots } from "./PaginationDots";

type Props = {
  slides: StudioPage["carousel"]["slides"];
  autoplay: boolean;
  autoplayDelayMs: number;
  labels: Labels["carousel"];
  /** Called once Embla has measured, so the scroll sequence can refresh its measurements. */
  onReady?: () => void;
  className?: string;
};

/**
 * Centred-card photo carousel with neighbours peeking in (STUDIO_INTERACTION_SPEC §5).
 * Swipe/drag, arrow buttons, ← → keys on any carousel control, pagination dots, and optional
 * autoplay that pauses on hover/focus, stops after manual navigation and has a pause button.
 * Slides are not links (The Studio shows the company, not products).
 */
export function PhotoCarousel({
  slides,
  autoplay,
  autoplayDelayMs,
  labels,
  onReady,
  className,
}: Props) {
  const plugins = useMemo(
    () =>
      autoplay
        ? [
            Autoplay({
              delay: autoplayDelayMs,
              stopOnInteraction: true,
              stopOnMouseEnter: true,
              playOnInit: true,
            }),
          ]
        : [],
    [autoplay, autoplayDelayMs],
  );
  const [viewportRef, api] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false, duration: 30 },
    plugins,
  );
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(autoplay);
  const [announce, setAnnounce] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const total = slides.length;

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on("select", onSelect).on("reInit", onSelect);
    onReady?.();
    const ap = api.plugins().autoplay;
    if (ap && window.matchMedia("(prefers-reduced-motion: reduce)").matches) ap.stop();
    const onStop = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    api.on("autoplay:stop", onStop).on("autoplay:play", onPlay);
    return () => {
      api.off("select", onSelect).off("reInit", onSelect);
      api.off("autoplay:stop", onStop).off("autoplay:play", onPlay);
    };
  }, [api, onReady]);

  const navigate = useCallback(
    (fn: () => void) => {
      api?.plugins().autoplay?.stop();
      fn();
      // Announced for screen readers only on manual navigation (not autoplay).
      window.setTimeout(() => {
        if (api)
          setAnnounce(fillTemplate(labels.slideOf, { n: api.selectedScrollSnap() + 1, total }));
      }, 50);
    },
    [api, labels.slideOf, total],
  );

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      navigate(() => api?.scrollPrev());
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      navigate(() => api?.scrollNext());
    }
  };

  const togglePlay = () => {
    const ap = api?.plugins().autoplay;
    if (!ap) return;
    if (ap.isPlaying()) ap.stop();
    else ap.play();
  };

  const arrow =
    "border-hairline text-ink hover:border-ink inline-flex size-11 items-center justify-center rounded-full border transition-colors duration-200";

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={labels.region}
      className={cn("studio-card w-full", className)}
      onFocus={() => api?.plugins().autoplay?.stop()}
    >
      <div ref={viewportRef} className="overflow-hidden">
        <div className="flex touch-pan-y">
          {slides.map((slide, i) => {
            const active = i === selected;
            return (
              <div
                key={slide.image.src}
                role="group"
                aria-roledescription="slide"
                aria-label={fillTemplate(labels.slideOf, { n: i + 1, total })}
                className="min-w-0 shrink-0 grow-0 basis-[calc(var(--card-w)+1.5rem)] pl-6"
              >
                {/* Clicking a neighbouring card brings it to the centre (a pointer shortcut only;
                    keyboard users have the arrow buttons, dots and ← → keys). Not a link. */}
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                <figure
                  onClick={active ? undefined : () => navigate(() => api?.scrollTo(i))}
                  className={cn(
                    "transition-[opacity,transform] duration-500 ease-soft",
                    active ? "scale-100 opacity-100" : "scale-[0.92] cursor-pointer opacity-55",
                  )}
                >
                  <ResponsiveImage
                    image={slide.image}
                    aspect="4/5"
                    sizes="(min-width: 1024px) 32rem, (min-width: 768px) 56vw, 80vw"
                    preload={false}
                  />
                  {(slide.title || slide.caption) && (
                    <figcaption
                      className={cn(
                        "mt-4 space-y-1 text-center transition-opacity duration-500",
                        active ? "opacity-100" : "opacity-0",
                      )}
                    >
                      {slide.title && (
                        <span className="block font-display text-display-sm text-ink">
                          {slide.title}
                        </span>
                      )}
                      {slide.caption && (
                        <span className="block text-caption text-muted">{slide.caption}</span>
                      )}
                    </figcaption>
                  )}
                </figure>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4 sm:gap-6">
        <button
          type="button"
          onClick={() => navigate(() => api?.scrollPrev())}
          onKeyDown={onKeyDown}
          aria-label={labels.previous}
          className={arrow}
        >
          <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
        </button>
        <PaginationDots
          count={total}
          selectedIndex={selected}
          onSelect={(i) => navigate(() => api?.scrollTo(i))}
          onKeyDown={onKeyDown}
          groupLabel={labels.dots}
          label={(i, n) => fillTemplate(labels.goTo, { n: i + 1, total: n })}
        />
        <button
          type="button"
          onClick={() => navigate(() => api?.scrollNext())}
          onKeyDown={onKeyDown}
          aria-label={labels.next}
          className={arrow}
        >
          <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
        </button>
        {autoplay && (
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? labels.pause : labels.play}
            className="inline-flex size-11 items-center justify-center text-ink hover:text-accent"
          >
            {playing ? (
              <Pause className="size-4" aria-hidden="true" />
            ) : (
              <Play className="size-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}
