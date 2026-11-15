#!/usr/bin/env node
/**
 * Build-time image pipeline (replaces a runtime image optimisation service).
 *
 * Sources (originals, committed):
 *   assets/images/**        → logical src "placeholders/products/sci-hd-001-a.jpg"
 *   public/brand/**         → logical src "brand/logo.png"
 *
 * Outputs (generated, gitignored):
 *   public/img/<logical-without-ext>-<width>.webp   for every width next/image can request
 *   lib/generated/image-manifest.json               { "<logical src>": { width, height } }
 *
 * Incremental: a source is re-encoded only if any of its variants is missing or older than it.
 * Variants whose source has been deleted are removed.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { ALL_IMAGE_WIDTHS, sharePath, variantPath } from "../lib/image-widths.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE_ROOTS = [
  { dir: path.join(ROOT, "assets", "images"), prefix: "" },
  { dir: path.join(ROOT, "public", "brand"), prefix: "brand/" },
];
const OUT_DIR = path.join(ROOT, "public", "img");
const MANIFEST = path.join(ROOT, "lib", "generated", "image-manifest.json");
const EXT = /\.(jpe?g|png|webp|avif|tiff?)$/i;
const MAX_WIDTH = Math.max(...ALL_IMAGE_WIDTHS);
const WEBP = { quality: 78, effort: 4 };

async function walk(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = await Promise.all(
    entries.map((e) => {
      const full = path.join(dir, e.name);
      return e.isDirectory() ? walk(full) : EXT.test(e.name) ? [full] : [];
    }),
  );
  return files.flat();
}

const mtime = async (p) => {
  try {
    return (await fs.stat(p)).mtimeMs;
  } catch {
    return 0;
  }
};

const toPosix = (p) => p.split(path.sep).join("/");
const outFile = (logical, w) => path.join(ROOT, "public", ...variantPath(logical, w).split("/"));

/** Products and OG images also get a JPEG "share" image for link previews (WhatsApp, social). */
const SHARE_PREFIXES = ["products/", "placeholders/og/"];
const needsShare = (logical) => SHARE_PREFIXES.some((p) => logical.startsWith(p));
const shareFile = (logical) => path.join(ROOT, "public", ...sharePath(logical).split("/"));

async function processImage(file, logical) {
  const meta = await sharp(file).metadata();
  const rotated = (meta.orientation ?? 1) >= 5;
  const width = rotated ? meta.height : meta.width;
  const height = rotated ? meta.width : meta.height;

  const srcTime = await mtime(file);
  const outputs = ALL_IMAGE_WIDTHS.map((w) => outFile(logical, w));
  if (needsShare(logical)) outputs.push(shareFile(logical));
  const times = await Promise.all(outputs.map(mtime));
  const upToDate = times.every((t) => t >= srcTime);

  if (!upToDate) {
    await fs.mkdir(path.dirname(outputs[0]), { recursive: true });
    const cap = Math.min(width, MAX_WIDTH);
    // Encode each distinct target width once. Widths above the original are
    // copies of the largest real size (never upscaled), so every srcset URL exists.
    const encoded = new Map();
    for (const w of ALL_IMAGE_WIDTHS) {
      const target = Math.min(w, cap);
      if (!encoded.has(target)) {
        encoded.set(
          target,
          await sharp(file)
            .rotate()
            .resize({ width: target, withoutEnlargement: true })
            .webp(WEBP)
            .toBuffer(),
        );
      }
      await fs.writeFile(outFile(logical, w), encoded.get(target));
    }
    if (needsShare(logical)) {
      await sharp(file)
        .rotate()
        .flatten({ background: "#ffffff" })
        .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(shareFile(logical));
    }
  }
  return { width, height, encoded: !upToDate };
}

async function main() {
  const started = Date.now();
  const manifest = {};
  const expected = new Set();
  let encodedCount = 0;

  for (const { dir, prefix } of SOURCE_ROOTS) {
    for (const file of await walk(dir)) {
      const logical = prefix + toPosix(path.relative(dir, file));
      if (manifest[logical]) {
        throw new Error(
          `Duplicate logical image path "${logical}" (check assets/images and public/brand).`,
        );
      }
      const { width, height, encoded } = await processImage(file, logical);
      manifest[logical] = { width, height };
      ALL_IMAGE_WIDTHS.forEach((w) => expected.add(path.normalize(outFile(logical, w))));
      if (needsShare(logical)) expected.add(path.normalize(shareFile(logical)));
      if (encoded) encodedCount++;
    }
  }

  // Remove variants whose originals no longer exist.
  let removed = 0;
  for (const f of await walk(OUT_DIR)) {
    if (!expected.has(path.normalize(f))) {
      await fs.rm(f);
      removed++;
    }
  }

  await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
  const sorted = Object.fromEntries(
    Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)),
  );
  await fs.writeFile(MANIFEST, JSON.stringify(sorted, null, 2) + "\n");

  const total = Object.keys(manifest).length;
  console.log(
    `[images] ${total} originals · ${encodedCount} encoded · ${total - encodedCount} up to date · ${removed} stale removed · ${((Date.now() - started) / 1000).toFixed(1)}s`,
  );
}

main().catch((err) => {
  console.error("[images] failed:", err);
  process.exit(1);
});
