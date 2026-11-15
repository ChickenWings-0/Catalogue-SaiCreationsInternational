#!/usr/bin/env node
/**
 * Imports the client's product photos (white-background cut-outs of varying framing) into
 * consistent originals: trims the white margin, centres the product on a square white canvas
 * (product ≈ 80% of the canvas), never upscales, and writes
 *   assets/images/products/<code>.jpg
 * Re-runnable: existing outputs are overwritten. Mapping: scripts/client-images.mjs.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { CLIENT_IMAGES, SOURCE_ROOT } from "./client-images.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "assets", "images", "products");
const FILL = 0.8; // product's longest side as a share of the canvas
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

await fs.mkdir(OUT, { recursive: true });
let done = 0;
const missing = [];
for (const [code, rel] of CLIENT_IMAGES) {
  const src = path.join(ROOT, SOURCE_ROOT, rel);
  try {
    await fs.access(src);
  } catch {
    missing.push(`${code}: ${rel}`);
    continue;
  }
  const trimmed = await sharp(src)
    .flatten({ background: WHITE })
    .trim({ background: "#ffffff", threshold: 12 })
    .toBuffer({ resolveWithObject: true });
  const { width, height } = trimmed.info;
  const side = Math.ceil(Math.max(width, height) / FILL);
  await sharp({ create: { width: side, height: side, channels: 3, background: WHITE } })
    .composite([
      {
        input: trimmed.data,
        left: Math.round((side - width) / 2),
        top: Math.round((side - height) / 2),
      },
    ])
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(OUT, `${code.toLowerCase()}.jpg`));
  done++;
}
console.log(`[import] ${done} product images written to assets/images/products/`);
if (missing.length) {
  console.error(`[import] ${missing.length} source files not found:\n  ${missing.join("\n  ")}`);
  process.exit(1);
}
