#!/usr/bin/env node
/**
 * Generates neutral-toned, clearly labelled PLACEHOLDER originals.
 *
 *   assets/images/placeholders/**   (content images: products, tiles, pages, studio, map, og)
 *   public/brand/logo.png           (placeholder logo, the client will supply the real one)
 *   app/icon.png, app/apple-icon.png (placeholder favicon)
 *
 * Files are only created if missing, so real images are never overwritten.
 * `--force` regenerates files inside assets/images/placeholders/ only.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const PH = path.join(ROOT, "assets", "images", "placeholders");
const FORCE = process.argv.includes("--force");

const INK = "#6B655C";
const TONES = {
  HD: { bg: "#EDE6DA", shape: "#DDD3C3", name: "HOME DECOR" },
  OD: { bg: "#E4E6DC", shape: "#CFD4C5", name: "OUTDOOR DECOR" },
  WD: { bg: "#EFE5D7", shape: "#E0D0BC", name: "WALL DECOR" },
  SD: { bg: "#F0E2DA", shape: "#E3CCC0", name: "SEASONAL DECOR" },
  PAGE: { bg: "#E8E2D8", shape: "#D9D0C2", name: "" },
  STUDIO: { bg: "#DDD4C7", shape: "#CABFAF", name: "THE STUDIO" },
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Editorial placeholder: soft background, an abstract arch/circle and a centred label. */
function svg({ w, h, tone, eyebrow, title, variant = "a" }) {
  const t = TONES[tone];
  const s = Math.min(w, h);
  const cx = w / 2;
  const shape =
    variant === "b"
      ? `<circle cx="${cx}" cy="${h * 0.44}" r="${s * 0.26}" fill="${t.shape}"/>`
      : `<path d="M ${cx - s * 0.24} ${h * 0.72} V ${h * 0.4} A ${s * 0.24} ${s * 0.24} 0 0 1 ${cx + s * 0.24} ${h * 0.4} V ${h * 0.72} Z" fill="${t.shape}"/>`;
  const fs1 = Math.round(s * 0.032);
  const fs2 = Math.round(s * 0.05);
  const pad = Math.round(s * 0.04);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${t.bg}"/><stop offset="1" stop-color="${t.shape}" stop-opacity="0.55"/>
  </linearGradient></defs>
  <rect width="100%" height="100%" fill="${t.bg}"/>
  <rect width="100%" height="100%" fill="url(#g)"/>
  ${shape}
  <rect x="${pad}" y="${pad}" width="${w - pad * 2}" height="${h - pad * 2}" fill="none" stroke="${INK}" stroke-opacity="0.18" stroke-width="${Math.max(1, s * 0.002)}"/>
  <text x="${pad * 1.6}" y="${pad * 2.2}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(fs1 * 0.8)}" letter-spacing="${fs1 * 0.25}" fill="${INK}" fill-opacity="0.7">PLACEHOLDER</text>
  ${eyebrow ? `<text x="${cx}" y="${h * 0.84}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${fs1}" letter-spacing="${fs1 * 0.3}" fill="${INK}">${esc(eyebrow)}</text>` : ""}
  <text x="${cx}" y="${h * 0.84 + fs2 * 1.5}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${fs2}" letter-spacing="${fs2 * 0.06}" fill="${INK}">${esc(title)}</text>
</svg>`;
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

let created = 0;
let skipped = 0;
async function write(file, makeBuffer, { forceable = true } = {}) {
  if ((await exists(file)) && !(FORCE && forceable)) {
    skipped++;
    return;
  }
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, await makeBuffer());
  created++;
}

const jpg = (spec) => () =>
  sharp(Buffer.from(svg(spec)))
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

// ─── Spec ───────────────────────────────────────────────────────────────────
const jobs = [];
const P = (rel, spec) => jobs.push([path.join(PH, rel), jpg(spec)]);

for (const cat of ["HD", "OD", "WD", "SD"]) {
  for (let i = 1; i <= 8; i++) {
    const code = `SCI-${cat}-${String(i).padStart(3, "0")}`;
    for (const v of ["a", "b"]) {
      P(`products/${code.toLowerCase()}-${v}.jpg`, {
        w: 1200,
        h: 1500,
        tone: cat,
        variant: v,
        eyebrow: TONES[cat].name,
        title: `${code} · ${v.toUpperCase()}`,
      });
    }
  }
}
const catSlugs = { HD: "home-decor", OD: "outdoor-decor", WD: "wall-decor", SD: "seasonal-decor" };
for (const [cat, slug] of Object.entries(catSlugs)) {
  P(`categories/${slug}-tile.jpg`, {
    w: 1200,
    h: 1500,
    tone: cat,
    eyebrow: "CATEGORY TILE",
    title: TONES[cat].name,
  });
}
for (let i = 1; i <= 3; i++) {
  P(`home/hero-${i}.jpg`, {
    w: 2400,
    h: 1350,
    tone: "PAGE",
    variant: i % 2 ? "a" : "b",
    eyebrow: "HOME HERO",
    title: `Slide ${i}`,
  });
}
P("home/studio-teaser.jpg", {
  w: 2000,
  h: 1250,
  tone: "STUDIO",
  eyebrow: "THE STUDIO",
  title: "Teaser still",
});
P("home/about-teaser.jpg", {
  w: 1200,
  h: 1500,
  tone: "PAGE",
  variant: "b",
  eyebrow: "ABOUT US",
  title: "Teaser image",
});
for (const [sec, label] of [
  ["initiative", "THE INITIATIVE"],
  ["present", "THE PRESENT"],
]) {
  for (let i = 1; i <= 2; i++) {
    P(`about/${sec}-${i}.jpg`, {
      w: 1200,
      h: 1500,
      tone: "PAGE",
      variant: i === 1 ? "a" : "b",
      eyebrow: label,
      title: `Image ${i}`,
    });
  }
}
P("studio/poster.jpg", {
  w: 1920,
  h: 1080,
  tone: "STUDIO",
  eyebrow: "THE STUDIO",
  title: "Video poster",
});
for (let i = 1; i <= 8; i++) {
  P(`studio/slide-${String(i).padStart(2, "0")}.jpg`, {
    w: 1200,
    h: 1500,
    tone: "STUDIO",
    variant: i % 2 ? "a" : "b",
    eyebrow: "WORKSHOP · PROCESS · PEOPLE",
    title: `Photo ${i}`,
  });
}
P("contact/map.jpg", {
  w: 1600,
  h: 900,
  tone: "PAGE",
  variant: "b",
  eyebrow: "MAP",
  title: "Static map placeholder",
});
P("og/default.jpg", {
  w: 1200,
  h: 630,
  tone: "PAGE",
  eyebrow: "SAI CREATIONS INTERNATIONAL",
  title: "Share image",
});

// Brand placeholders (never overwritten, even with --force)
const GREEN = "#1F6B45";
const monogram = (size) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="100%" height="100%" rx="${size * 0.08}" fill="${GREEN}"/><text x="50%" y="62%" text-anchor="middle" font-family="Georgia, serif" font-size="${size * 0.42}" fill="#FFFFFF">SC</text></svg>`;
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="300">
  <rect x="20" y="30" width="240" height="240" rx="18" fill="${GREEN}"/>
  <text x="140" y="185" text-anchor="middle" font-family="Georgia, serif" font-size="100" fill="#FFFFFF">SC</text>
  <text x="300" y="140" font-family="Georgia, serif" font-size="58" fill="#2B2926">Sai Creations Int'l</text>
  <text x="302" y="190" font-family="Arial, sans-serif" font-size="24" letter-spacing="2" fill="#625C53">LOGO PLACEHOLDER</text>
</svg>`;
const brandJobs = [
  [
    path.join(ROOT, "public", "brand", "logo.png"),
    () => sharp(Buffer.from(logoSvg)).png().toBuffer(),
  ],
  [
    path.join(ROOT, "app", "icon.png"),
    () =>
      sharp(Buffer.from(monogram(512)))
        .png()
        .toBuffer(),
  ],
  [
    path.join(ROOT, "app", "apple-icon.png"),
    () =>
      sharp(Buffer.from(monogram(180)))
        .flatten({ background: GREEN })
        .png()
        .toBuffer(),
  ],
];

for (const [file, make] of jobs) await write(file, make);
for (const [file, make] of brandJobs) await write(file, make, { forceable: false });
console.log(
  `[placeholders] ${created} created · ${skipped} already present${FORCE ? " (--force)" : ""}`,
);
