import Image from "next/image";
import type { ImageAsset } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const ASPECT = {
  "4/5": "aspect-[4/5]",
  "3/4": "aspect-[3/4]",
  "1/1": "aspect-square",
  "16/9": "aspect-video",
  "3/2": "aspect-[3/2]",
  "16/10": "aspect-[16/10]",
} as const;

type Props = {
  image: ImageAsset;
  /** Required so we never ship oversized images. E.g. "(min-width: 1024px) 25vw, 50vw". */
  sizes: string;
  /** Crop to a fixed aspect ratio (object-cover). Omit to keep the intrinsic ratio. */
  aspect?: keyof typeof ASPECT;
  /** Fill the (positioned) parent instead of using an aspect wrapper. */
  fill?: boolean;
  /** Only for the LCP image above the fold. */
  preload?: boolean;
  className?: string;
  imgClassName?: string;
};

/**
 * next/image + the static loader (lib/image-loader.ts). Every srcset width maps to a WebP
 * file pre-built by scripts/build-images.mjs, so there is no runtime image service.
 */
export function ResponsiveImage({
  image,
  sizes,
  aspect,
  fill,
  preload,
  className,
  imgClassName,
}: Props) {
  const alt = image.decorative ? "" : image.alt;
  const objectPosition = image.focalPoint
    ? `${image.focalPoint.x * 100}% ${image.focalPoint.y * 100}%`
    : undefined;

  if (fill || aspect) {
    const img = (
      <Image
        src={image.src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        className={cn("object-cover", imgClassName)}
        style={{ objectPosition }}
      />
    );
    if (fill) return img;
    return (
      <div
        className={cn("relative overflow-hidden bg-greige", aspect && ASPECT[aspect], className)}
      >
        {img}
      </div>
    );
  }

  return (
    <Image
      src={image.src}
      alt={alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      preload={preload}
      className={cn("h-auto w-full bg-greige", className, imgClassName)}
      style={{ objectPosition }}
    />
  );
}
