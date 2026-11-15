"use client";

import { useRef, useState, type CSSProperties } from "react";
import { PhotoCarousel } from "@/components/studio/PhotoCarousel";
import type { WallItem } from "@/lib/catalogue";
import { fillTemplate } from "@/lib/format";
import type { Labels } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { ProductImage } from "./ProductImage";
import { ProductLightbox } from "./ProductLightbox";

type Props = {
  items: WallItem[];
  /** Large centred-card carousel above the grid (category pages). */
  showCarousel?: boolean;
  /** 4 columns from 1280px (default) or 3. */
  maxColumns?: 3 | 4;
  /** Preload the first N grid images (above-the-fold grids only). */
  preloadCount?: number;
  labels: {
    carousel: Labels["carousel"];
    lightbox: Labels["lightbox"];
    enquire: Labels["enquire"];
    product: Labels["product"];
  };
  newTabHint: string;
  className?: string;
};

/**
 * Visual-only product display: an optional carousel plus a wall of photos. Clicking any photo
 * opens the lightbox with a single "Enquire on WhatsApp" button (prefilled product link).
 * Only photos are shown (no names, codes, sizes or specifications).
 */
export function ProductWall({
  items,
  showCarousel = false,
  maxColumns = 4,
  preloadCount = 0,
  labels,
  newTabHint,
  className,
}: Props) {
  const [open, setOpenState] = useState<number | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const setOpen = (i: number | null) => {
    if (i !== null) lastTrigger.current = document.activeElement as HTMLElement | null;
    setOpenState(i);
  };
  const sizes =
    maxColumns === 4
      ? "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
      : "(min-width: 768px) 33vw, 50vw";

  return (
    <div className={className}>
      {showCarousel && items.length > 1 && (
        <div className="mb-20 lg:mb-28">
          <PhotoCarousel
            slides={items.map((it) => ({ image: it.image }))}
            cardClassName="product-card"
            autoplay={false}
            autoplayDelayMs={5000}
            maxDots={9}
            labels={labels.carousel}
            renderSlide={(_slide, i, active) => {
              const item = items[i]!;
              return (
                <button
                  type="button"
                  tabIndex={active ? 0 : -1}
                  onClick={active ? () => setOpen(i) : undefined}
                  aria-label={fillTemplate(labels.lightbox.open, { label: item.label })}
                  className={cn("group block w-full text-left", active ? "cursor-zoom-in" : "")}
                >
                  <ProductImage
                    image={item.image}
                    tone="white"
                    sizes="(min-width: 1024px) 28rem, 76vw"
                    preload={i === 0}
                    zoomOnHover={active}
                  />
                </button>
              );
            }}
          />
        </div>
      )}

      <ul
        className={cn(
          "grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:gap-x-6 lg:gap-y-10",
          maxColumns === 4 && "xl:grid-cols-4",
        )}
      >
        {items.map((item, i) => (
          <li key={item.key} data-reveal style={{ "--reveal-i": i % 4 } as CSSProperties}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={fillTemplate(labels.lightbox.open, { label: item.label })}
              className="group block w-full cursor-zoom-in text-left"
            >
              <ProductImage
                image={item.image}
                sizes={sizes}
                preload={i < preloadCount}
                zoomOnHover
              />
            </button>
          </li>
        ))}
      </ul>

      <ProductLightbox
        items={items}
        index={open}
        onClose={() => setOpen(null)}
        labels={{ lightbox: labels.lightbox, enquire: labels.enquire, product: labels.product }}
        newTabHint={newTabHint}
        returnFocusRef={lastTrigger}
      />
    </div>
  );
}
