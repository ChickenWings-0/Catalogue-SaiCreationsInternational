"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState, type KeyboardEvent } from "react";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { fillTemplate } from "@/lib/format";
import type { ImageAsset, Labels } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Props = {
  images: ImageAsset[];
  productName: string;
  labels: Labels["gallery"];
};

/**
 * Product image gallery: swipe/drag on touch, arrow buttons, synced thumbnails.
 * ← → keys work while focus is on any gallery control.
 * A single image renders without carousel controls.
 */
export function ProductGallery({ images, productName, labels }: Props) {
  const [viewportRef, api] = useEmblaCarousel({ loop: false, duration: 28 });
  const [selected, setSelected] = useState(0);
  const total = images.length;

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on("select", onSelect).on("reInit", onSelect);
    return () => {
      api.off("select", onSelect).off("reInit", onSelect);
    };
  }, [api]);

  const go = useCallback((i: number) => api?.scrollTo(i), [api]);
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      api?.scrollPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      api?.scrollNext();
    }
  };

  const sizes = "(min-width: 1024px) 55vw, 100vw";

  if (total <= 1) {
    const [only] = images;
    return only ? <ResponsiveImage image={only} aspect="4/5" sizes={sizes} preload /> : null;
  }

  const arrow =
    "bg-white/85 text-ink hover:bg-white absolute top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center backdrop-blur-sm transition-opacity duration-200 disabled:pointer-events-none disabled:opacity-0";

  return (
    <div>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={productName}
        className="relative"
      >
        <div ref={viewportRef} className="overflow-hidden bg-greige">
          <div className="flex touch-pan-y">
            {images.map((img, i) => (
              <div
                key={img.src}
                role="group"
                aria-roledescription="slide"
                aria-label={fillTemplate(labels.imageOf, { n: i + 1, total })}
                className="relative aspect-[4/5] min-w-0 flex-[0_0_100%]"
              >
                <ResponsiveImage image={img} fill sizes={sizes} preload={i === 0} />
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => api?.scrollPrev()}
          onKeyDown={onKeyDown}
          disabled={selected === 0}
          className={cn(arrow, "left-3")}
          aria-label={labels.previous}
        >
          <ChevronLeft className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => api?.scrollNext()}
          onKeyDown={onKeyDown}
          disabled={selected === total - 1}
          className={cn(arrow, "right-3")}
          aria-label={labels.next}
        >
          <ChevronRight className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </button>
        <p className="absolute right-3 bottom-3 bg-white/85 px-2.5 py-1 text-caption text-ink backdrop-blur-sm">
          {selected + 1} / {total}
        </p>
      </div>

      <ul className="mt-4 grid grid-cols-5 gap-3 sm:grid-cols-6">
        {images.map((img, i) => (
          <li key={img.src}>
            <button
              type="button"
              onClick={() => go(i)}
              onKeyDown={onKeyDown}
              aria-label={fillTemplate(labels.viewImage, { n: i + 1, total })}
              aria-current={i === selected ? "true" : undefined}
              className={cn(
                "relative block aspect-[4/5] w-full overflow-hidden border transition-colors duration-200",
                i === selected ? "border-ink" : "border-transparent hover:border-stone",
              )}
            >
              <ResponsiveImage image={{ ...img, decorative: true }} fill sizes="120px" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
