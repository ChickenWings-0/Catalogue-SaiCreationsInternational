#!/usr/bin/env node
/**
 * Imports the client's product photos into consistent square originals:
 *   assets/images/products/<code>.jpg
 * Modes (see scripts/client-images.mjs):
 *   cutout – trim the white margin, centre the product on a white square (product ≈ 80%)
 *   clean  – like cutout, but ignores larger corner marks/specks when finding the product box
 *   pad    – trim on the corner colour (e.g. black), pad to a square with that colour
 *   crop   – lifestyle photo: square crop around the most interesting area (sharp "attention")
 *   fit    – wide lifestyle photo: whole image contained in the square over a blurred copy of itself
 * Never upscales. Removes product images that are no longer in the mapping.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { CLIENT_IMAGES, SOURCE_ROOT } from "./client-images.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "assets", "images", "products");
const FILL = 0.8; // product's longest side as a share of the canvas (cutout / pad)

async function cornerColour(src) {
  const { data, info } = await sharp(src)
    .flatten({ background: "#ffffff" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const at = (x, y) => {
    const i = (y * info.width + x) * info.channels;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const pts = [
    at(1, 1),
    at(info.width - 2, 1),
    at(1, info.height - 2),
    at(info.width - 2, info.height - 2),
  ];
  const avg = [0, 1, 2].map((c) => Math.round(pts.reduce((s, p) => s + p[c], 0) / pts.length));
  return { r: avg[0], g: avg[1], b: avg[2] };
}

/** Lifts near-white backgrounds (≈ 242+) to pure white so trimming and blending are clean. */
const LIFT = 255 / 242;

async function trimAndPad(src, bg, lift = false, probeMedian = 7) {
  const hex = "#" + [bg.r, bg.g, bg.b].map((v) => v.toString(16).padStart(2, "0")).join("");
  const base = await sharp(src)
    .rotate()
    .flatten({ background: bg })
    .linear(lift ? LIFT : 1, 0)
    .toBuffer();
  // Find the product box on a lightly smoothed copy so isolated specks/dust don't widen it,
  // then cut that box from the unsmoothed image.
  // (sharp applies trim before other operations in one pipeline, so smooth in a separate pass.)
  const smoothed = await sharp(base).median(probeMedian).toBuffer();
  const probe = await sharp(smoothed)
    .trim({ background: hex, threshold: 14 })
    .toBuffer({ resolveWithObject: true });
  const { width, height } = probe.info;
  const left = -(probe.info.trimOffsetLeft ?? 0);
  const top = -(probe.info.trimOffsetTop ?? 0);
  const cut = await sharp(base).extract({ left, top, width, height }).toBuffer();
  const side = Math.ceil(Math.max(width, height) / FILL);
  return sharp({ create: { width: side, height: side, channels: 3, background: bg } }).composite([
    { input: cut, left: Math.round((side - width) / 2), top: Math.round((side - height) / 2) },
  ]);
}

async function cropSquare(src) {
  const meta = await sharp(src).rotate().metadata();
  const side = Math.min(meta.width, meta.height);
  return sharp(src)
    .rotate()
    .resize(side, side, { fit: "cover", position: sharp.strategy.attention });
}

async function fitSquare(src) {
  const meta = await sharp(src).rotate().metadata();
  const side = Math.max(meta.width, meta.height);
  const backdrop = await sharp(src)
    .rotate()
    .resize(side, side, { fit: "cover" })
    .blur(40)
    .modulate({ brightness: 1.05 })
    .toBuffer();
  const fg = await sharp(src).rotate().toBuffer();
  return sharp(backdrop).composite([
    {
      input: fg,
      left: Math.round((side - meta.width) / 2),
      top: Math.round((side - meta.height) / 2),
    },
  ]);
}

await fs.mkdir(OUT, { recursive: true });
const wanted = new Set();
const missing = [];
let done = 0;
for (const [code, rel, , mode = "cutout"] of CLIENT_IMAGES) {
  const src = path.join(ROOT, SOURCE_ROOT, rel);
  const out = path.join(OUT, `${code.toLowerCase()}.jpg`);
  wanted.add(path.normalize(out));
  try {
    await fs.access(src);
  } catch {
    missing.push(`${code}: ${rel}`);
    continue;
  }
  const img =
    mode === "crop"
      ? await cropSquare(src)
      : mode === "fit"
        ? await fitSquare(src)
        : mode === "pad"
          ? await trimAndPad(src, await cornerColour(src))
          : await trimAndPad(src, { r: 255, g: 255, b: 255 }, true, mode === "clean" ? 45 : 7);
  await img.jpeg({ quality: 90, mozjpeg: true }).toFile(out);
  done++;
}

let removed = 0;
for (const f of await fs.readdir(OUT)) {
  const p = path.normalize(path.join(OUT, f));
  if (!wanted.has(p)) {
    await fs.rm(p);
    removed++;
  }
}
console.log(`[import] ${done} product images written · ${removed} removed (no longer mapped)`);
if (missing.length) {
  console.error(`[import] ${missing.length} source files not found:\n  ${missing.join("\n  ")}`);
  process.exit(1);
}
