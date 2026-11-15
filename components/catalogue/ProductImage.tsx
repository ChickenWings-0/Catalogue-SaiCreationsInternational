import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import type { ImageAsset } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Props = {
  image: ImageAsset;
  sizes: string;
  preload?: boolean;
  /** Background tone of the frame (a palette token). The photo's white background blends into it. */
  tone?: "linen" | "white" | "ivory";
  /** Subtle zoom when a parent `.group` is hovered. */
  zoomOnHover?: boolean;
  className?: string;
};

const TONE = { linen: "bg-linen", white: "bg-white", ivory: "bg-ivory" } as const;

/**
 * Square frame for the client's product cut-outs (white-background photos).
 * `mix-blend-multiply` makes the white background take on the frame colour, so products sit
 * naturally in every palette. The image ignores pointer events and can't be dragged, so
 * right-click / long-press offers no "Save image". This is a light deterrent against copying,
 * not real protection.
 */
export function ProductImage({
  image,
  sizes,
  preload,
  tone = "linen",
  zoomOnHover = false,
  className,
}: Props) {
  return (
    <div className={cn("relative aspect-square overflow-hidden", TONE[tone], className)}>
      <ResponsiveImage
        image={image}
        fill
        sizes={sizes}
        preload={preload}
        imgClassName={cn(
          "pointer-events-none object-contain mix-blend-multiply select-none [-webkit-user-drag:none]",
          zoomOnHover &&
            "transition-transform duration-[1200ms] ease-soft group-hover:scale-[1.04]",
        )}
      />
    </div>
  );
}
