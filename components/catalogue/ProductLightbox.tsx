"use client";

import * as Dialog from "@radix-ui/react-dialog";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { Button } from "@/components/ui/Button";
import type { WallItem } from "@/lib/catalogue";
import { fillTemplate } from "@/lib/format";
import type { Labels } from "@/lib/schemas";
import { ProductImage } from "./ProductImage";

type Props = {
  items: WallItem[];
  /** Index of the product to show; null = closed. */
  index: number | null;
  onClose: () => void;
  labels: { lightbox: Labels["lightbox"]; enquire: Labels["enquire"]; product: Labels["product"] };
  newTabHint: string;
  /** Element to refocus after closing (the photo that opened the lightbox). */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
};

/**
 * Full-screen view of one product: large photo (swipe / arrows / ← → keys to move between
 * products), its code, and a single "Enquire on WhatsApp" button. No other product details.
 */
export function ProductLightbox({
  items,
  index,
  onClose,
  labels,
  newTabHint,
  returnFocusRef,
}: Props) {
  return (
    <Dialog.Root open={index !== null} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ivory/95 backdrop-blur-sm data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
        <Dialog.Content
          aria-describedby={undefined}
          onCloseAutoFocus={(e) => {
            if (returnFocusRef?.current) {
              e.preventDefault();
              returnFocusRef.current.focus();
            }
          }}
          className="fixed inset-0 z-50 flex flex-col outline-none data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in"
        >
          {index !== null && (
            <LightboxBody
              items={items}
              start={index}
              onClose={onClose}
              labels={labels}
              newTabHint={newTabHint}
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function LightboxBody({
  items,
  start,
  onClose,
  labels,
  newTabHint,
}: Omit<Props, "index" | "returnFocusRef"> & { start: number }) {
  const [viewportRef, api] = useEmblaCarousel({ loop: true, startIndex: start, duration: 26 });
  const [selected, setSelected] = useState(start);
  const total = items.length;
  const current = items[selected] ?? items[0];

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on("select", onSelect);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") api.scrollPrev();
      if (e.key === "ArrowRight") api.scrollNext();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      api.off("select", onSelect);
      document.removeEventListener("keydown", onKey);
    };
  }, [api]);

  if (!current) return null;
  const arrow =
    "hidden size-12 shrink-0 items-center justify-center rounded-full border border-hairline bg-white/80 text-ink transition-colors hover:border-ink sm:inline-flex";

  return (
    <>
      <Dialog.Title className="sr-only">
        {fillTemplate(labels.product.code, { code: current.code })}
      </Dialog.Title>

      <div className="flex h-(--header-height) shrink-0 items-center justify-between px-4 sm:px-6 lg:px-10">
        <p className="text-caption tracking-[0.12em] text-muted tabular-nums" aria-live="polite">
          {fillTemplate(labels.lightbox.position, { n: selected + 1, total })}
        </p>
        <Dialog.Close
          onClick={onClose}
          className="-mr-2.5 inline-flex size-11 items-center justify-center text-ink hover:text-accent"
        >
          <X className="size-6" strokeWidth={1.5} aria-hidden="true" />
          <span className="sr-only">{labels.lightbox.close}</span>
        </Dialog.Close>
      </div>

      <div className="flex min-h-0 flex-1 items-center gap-4 px-4 sm:px-6 lg:gap-8 lg:px-10">
        <button
          type="button"
          onClick={() => api?.scrollPrev()}
          aria-label={labels.lightbox.previous}
          className={arrow}
        >
          <ArrowLeft className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </button>

        <div ref={viewportRef} className="h-full min-w-0 flex-1 overflow-hidden">
          <div className="flex h-full touch-pan-y">
            {items.map((item, i) => (
              <div
                key={item.code}
                className="flex h-full min-w-0 flex-[0_0_100%] items-center justify-center"
                aria-hidden={i !== selected}
              >
                <ProductImage
                  image={item.image}
                  tone="white"
                  sizes="(min-width: 1024px) 70vh, 92vw"
                  className="w-full max-w-[min(92vw,calc(100svh-15rem))] border border-hairline"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => api?.scrollNext()}
          aria-label={labels.lightbox.next}
          className={arrow}
        >
          <ArrowRight className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <div className="flex shrink-0 flex-col items-center gap-4 px-4 pt-5 pb-8 sm:pb-10">
        <p className="eyebrow text-ink">
          {fillTemplate(labels.product.code, { code: current.code })}
        </p>
        <Button
          href={current.whatsappUrl}
          variant="accent"
          size="lg"
          icon={<FaWhatsapp className="size-4" />}
          newTabHint={newTabHint}
        >
          {labels.enquire.whatsapp}
        </Button>
      </div>
    </>
  );
}
