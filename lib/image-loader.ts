"use client";

import { variantPath } from "./image-widths.mjs";

type LoaderArgs = { src: string; width: number; quality?: number };

/**
 * Static image loader for next/image (no runtime optimisation service).
 *
 * - Logical paths (relative to /assets/images, e.g. "placeholders/products/sci-hd-001-a.jpg")
 *   map to the pre-built variant "/img/placeholders/products/sci-hd-001-a-1080.webp".
 * - Absolute URLs (https://…) and paths that are already public (start with "/")
 *   are returned unchanged.
 *
 * Quality is fixed at build time, so the `quality` argument is ignored.
 */
export default function staticImageLoader({ src, width }: LoaderArgs): string {
  if (/^(https?:)?\/\//.test(src) || src.startsWith("/") || src.startsWith("data:")) {
    return src;
  }
  return variantPath(src, width);
}
