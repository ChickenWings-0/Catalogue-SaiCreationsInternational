import fs from "node:fs";
import path from "node:path";
import type { ImageAsset, ImageInput } from "./schemas";

/**
 * Server-only (build time). Resolves content image inputs to full ImageAssets using the
 * manifest written by scripts/build-images.mjs, so content authors only provide src + alt.
 */
type Manifest = Record<string, { width: number; height: number }>;

const MANIFEST_PATH = path.join(process.cwd(), "lib", "generated", "image-manifest.json");
let manifest: Manifest | null = null;
let manifestMtime = 0;

function getManifest(): Manifest {
  try {
    // In dev, pick up a re-run of `npm run images` without restarting the server.
    const mtime = fs.statSync(MANIFEST_PATH).mtimeMs;
    if (manifest && mtime === manifestMtime) return manifest;
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")) as Manifest;
    manifestMtime = mtime;
  } catch {
    throw new Error(
      `Image manifest not found at ${MANIFEST_PATH}. Run "npm run images" (it runs automatically before dev/build).`,
    );
  }
  return manifest;
}

const isAbsolute = (src: string) => /^(https?:)?\/\//.test(src);

export function resolveImage(input: ImageInput, where = "content"): ImageAsset {
  if (isAbsolute(input.src)) {
    if (!input.width || !input.height) {
      throw new Error(`${where}: absolute image URL "${input.src}" needs width and height.`);
    }
    return { ...input, width: input.width, height: input.height };
  }
  const src = input.src.replace(/^\/+/, "");
  const entry = getManifest()[src];
  if (!entry) {
    throw new Error(
      `${where}: image "${src}" not found. Put the file in assets/images/${src} (or public/brand/ for "brand/…") and run "npm run images".`,
    );
  }
  return { ...input, src, width: input.width ?? entry.width, height: input.height ?? entry.height };
}
