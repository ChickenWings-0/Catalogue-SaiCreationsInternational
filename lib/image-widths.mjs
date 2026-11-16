// Shared between next.config.ts, lib/image-loader.ts and scripts/build-images.mjs.
// next/image only ever requests widths from these two lists, and the build script
// emits a WebP file for every one of them, so every srcset URL resolves to a real file.

/** Widths used for full-width / large images (`sizes` with vw, or fill). */
export const IMAGE_DEVICE_SIZES = [640, 828, 1080, 1280, 1600, 1920, 2400];

/** Widths used for small images (thumbnails, logos). All are smaller than the smallest device size. */
export const IMAGE_SIZES = [160, 320, 480];

export const ALL_IMAGE_WIDTHS = [...IMAGE_SIZES, ...IMAGE_DEVICE_SIZES];

/** Public URL prefix of the generated variants (written to /public/img). */
export const IMAGE_OUTPUT_PREFIX = "/img/";

/** Turns a logical src ("products/sci-hd-001.jpg") into a variant URL. */
export function variantPath(src, width) {
  const clean = src.replace(/^\/+/, "").replace(/\.[a-z0-9]+$/i, "");
  return `${IMAGE_OUTPUT_PREFIX}${clean}-${width}.webp`;
}

/** Public URL of the JPEG share image (link previews) for products and OG images. */
export function sharePath(src) {
  const clean = src.replace(/^\/+/, "").replace(/\.[a-z0-9]+$/i, "");
  return `${IMAGE_OUTPUT_PREFIX}${clean}-share.jpg`;
}
