#!/usr/bin/env node
/**
 * Generates editorial-style PLACEHOLDER originals: soft still-life "photographs" built from
 * simple shapes (wall + floor plane, product silhouette, shadow), material close-ups for
 * detail shots, room scenes for heroes and workshop scenes for The Studio.
 * Every image carries a small "PLACEHOLDER" label so it's never mistaken for a real photo.
 *
 *   assets/images/placeholders/**    (content images)
 *   public/brand/logo.png            (placeholder logo)
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

// ─── Colour helpers ──────────────────────────────────────────────────────────
const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgb2hex = (c) =>
  "#" +
  c
    .map((v) =>
      Math.round(Math.max(0, Math.min(255, v)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");
const mix = (a, b, t) => rgb2hex(hex2rgb(a).map((v, i) => v + (hex2rgb(b)[i] - v) * t));
const light = (c, t) => mix(c, "#FFFFFF", t);
const dark = (c, t) => mix(c, "#000000", t);

const C = {
  ink: "#4A443C",
  indigo: "#41507F",
  jute: "#C2A579",
  brass: "#B48E4E",
  ivory: "#EFE6D6",
  marble: "#F1EEE8",
  green: "#6F8C6C",
  wood: "#8A6849",
  teak: "#9A7550",
  terracotta: "#B46F52",
  iron: "#3E3B37",
  grey: "#9C9A94",
  rattan: "#BF9B67",
  clay: "#C98E73",
  orange: "#D98A3A",
  red: "#A2483D",
  glass: "#D8CBB0",
  velvet: "#4F6B57",
  teal: "#3F7B7A",
};

// ─── SVG building blocks ─────────────────────────────────────────────────────
let uid = 0;
const id = (p) => `${p}${++uid}`;

function grad(color, dir = "v") {
  const g = id("g");
  const [x2, y2] = dir === "v" ? [0, 1] : [1, 1];
  return {
    ref: `url(#${g})`,
    def: `<linearGradient id="${g}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${light(color, 0.18)}"/><stop offset="1" stop-color="${dark(color, 0.14)}"/></linearGradient>`,
  };
}

function scene(w, h, { wall, floor, horizon = 0.66 }) {
  const wg = id("w");
  const fg = id("f");
  const vg = id("v");
  const hy = h * horizon;
  return {
    hy,
    defs: `<linearGradient id="${wg}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${light(wall, 0.25)}"/><stop offset="1" stop-color="${wall}"/></linearGradient>
<linearGradient id="${fg}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dark(floor, 0.06)}"/><stop offset="1" stop-color="${light(floor, 0.08)}"/></linearGradient>
<radialGradient id="${vg}" cx="0.45" cy="0.35" r="0.85"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.12"/></radialGradient>
<filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${Math.min(w, h) * 0.012}"/></filter>
<filter id="blur-s" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${Math.min(w, h) * 0.004}"/></filter>`,
    base: `<rect width="${w}" height="${hy}" fill="url(#${wg})"/><rect y="${hy}" width="${w}" height="${h - hy}" fill="url(#${fg})"/><rect y="${hy - 1}" width="${w}" height="2" fill="${dark(floor, 0.12)}" opacity="0.35"/>`,
    vignette: `<rect width="${w}" height="${h}" fill="url(#${vg})"/>`,
  };
}

const floorShadow = (cx, cy, rx, ry, o = 0.28) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#2a2018" opacity="${o}" filter="url(#blur)"/>`;
const wallShadow = (svg, dx, dy) =>
  `<g transform="translate(${dx} ${dy})" opacity="0.22" filter="url(#blur)">${svg.replace(/fill="(?!none)[^"]*"/g, 'fill="#2a2018"').replace(/stroke="[^"]*"/g, 'stroke="#2a2018"')}</g>`;

function label(w, h, text) {
  const s = Math.min(w, h);
  const fs = Math.max(14, Math.round(s * 0.017));
  const pad = Math.round(s * 0.035);
  return `<text x="${pad}" y="${h - pad}" font-family="Arial, Helvetica, sans-serif" font-size="${fs}" letter-spacing="${fs * 0.22}" fill="#3a342d" fill-opacity="0.55">PLACEHOLDER · ${text}</text>`;
}

// ─── Product objects (drawn around a centre-bottom anchor on the floor) ─────
// Each returns { defs, svg, wall? } given anchor (cx, base y) and unit scale u.
const OBJ = {
  cushion: (cx, y, u, c) => {
    const g = grad(c);
    return {
      defs: g.def,
      svg: `${floorShadow(cx, y, u * 2.1, u * 0.25)}<path d="M ${cx - u * 1.9} ${y - u * 0.2} Q ${cx - u * 2.1} ${y - u * 2} ${cx - u * 1.7} ${y - u * 3.6} Q ${cx} ${y - u * 3.9} ${cx + u * 1.7} ${y - u * 3.6} Q ${cx + u * 2.1} ${y - u * 2} ${cx + u * 1.9} ${y - u * 0.2} Q ${cx} ${y + u * 0.15} ${cx - u * 1.9} ${y - u * 0.2} Z" fill="${g.ref}"/><g fill="${light(c, 0.55)}" opacity="0.8">${[0, 1, 2].map((r) => [0, 1, 2].map((k) => `<circle cx="${cx - u + k * u}" cy="${y - u * 2.9 + r * u * 1.05}" r="${u * 0.22}"/>`).join("")).join("")}</g>`,
    };
  },
  pouf: (cx, y, u, c) => {
    const g = grad(c);
    return {
      defs: g.def,
      svg: `${floorShadow(cx, y, u * 2.6, u * 0.35)}<path d="M ${cx - u * 2.3} ${y - u * 2.1} L ${cx - u * 2.2} ${y - u * 0.3} Q ${cx} ${y + u * 0.35} ${cx + u * 2.2} ${y - u * 0.3} L ${cx + u * 2.3} ${y - u * 2.1} Z" fill="${g.ref}"/><ellipse cx="${cx}" cy="${y - u * 2.1}" rx="${u * 2.3}" ry="${u * 0.55}" fill="${light(c, 0.15)}"/>${[0.3, 0.55, 0.8].map((t) => `<ellipse cx="${cx}" cy="${y - u * 2.1}" rx="${u * 2.3 * t}" ry="${u * 0.55 * t}" fill="none" stroke="${dark(c, 0.15)}" stroke-width="${u * 0.05}"/>`).join("")}`,
    };
  },
  budvase: (cx, y, u, c) => {
    const g = grad(c, "d");
    return {
      defs: g.def,
      svg: `${floorShadow(cx, y, u * 0.9, u * 0.15)}<path d="M ${cx - u * 0.15} ${y - u * 4.6} L ${cx - u * 0.15} ${y - u * 3.6} Q ${cx - u * 0.9} ${y - u * 2.6} ${cx - u * 0.8} ${y - u * 0.6} Q ${cx - u * 0.75} ${y} ${cx} ${y} Q ${cx + u * 0.75} ${y} ${cx + u * 0.8} ${y - u * 0.6} Q ${cx + u * 0.9} ${y - u * 2.6} ${cx + u * 0.15} ${y - u * 3.6} L ${cx + u * 0.15} ${y - u * 4.6} Z" fill="${g.ref}"/><path d="M ${cx} ${y - u * 4.6} Q ${cx + u * 0.4} ${y - u * 6} ${cx + u * 1.1} ${y - u * 6.6}" stroke="#6f6a4d" stroke-width="${u * 0.07}" fill="none"/><ellipse cx="${cx + u * 1.15}" cy="${y - u * 6.65}" rx="${u * 0.35}" ry="${u * 0.18}" fill="#8c8a62" transform="rotate(-30 ${cx + u * 1.15} ${y - u * 6.65})"/>`,
    };
  },
  throw: (cx, y, u, c) => {
    const g = grad(c);
    const layer = (i) =>
      `<rect x="${cx - u * 2.4}" y="${y - u * (0.75 + i * 0.7)}" width="${u * 4.8}" height="${u * 0.68}" rx="${u * 0.3}" fill="${i % 2 ? light(c, 0.08) : g.ref}"/>`;
    return {
      defs: g.def,
      svg: `${floorShadow(cx, y, u * 2.7, u * 0.3)}${[0, 1, 2, 3].map(layer).join("")}<g stroke="${dark(c, 0.2)}" stroke-width="${u * 0.04}">${Array.from({ length: 9 }, (_, k) => `<line x1="${cx + u * 2.3}" y1="${y - u * 0.35 - k * 0.3 * u}" x2="${cx + u * 2.65}" y2="${y - u * 0.2 - k * 0.3 * u}"/>`).join("")}</g>`,
    };
  },
  box: (cx, y, u, c) => {
    const g = grad(c);
    return {
      defs: g.def,
      svg: `${floorShadow(cx, y, u * 1.9, u * 0.22)}<rect x="${cx - u * 1.6}" y="${y - u * 1.5}" width="${u * 3.2}" height="${u * 1.5}" fill="${g.ref}"/><rect x="${cx - u * 1.7}" y="${y - u * 1.9}" width="${u * 3.4}" height="${u * 0.45}" fill="${light(c, 0.2)}"/><g fill="${C.teal}" opacity="0.7"><circle cx="${cx}" cy="${y - u * 0.8}" r="${u * 0.22}"/><circle cx="${cx - u * 0.6}" cy="${y - u * 0.8}" r="${u * 0.12}" fill="${C.red}"/><circle cx="${cx + u * 0.6}" cy="${y - u * 0.8}" r="${u * 0.12}" fill="${C.red}"/></g>`,
    };
  },
  lamp: (cx, y, u, c) => {
    const g = grad(c, "d");
    return {
      defs: g.def,
      svg: `${floorShadow(cx, y, u * 1.4, u * 0.2)}<path d="M ${cx - u * 1.3} ${y - u * 4.6} L ${cx - u * 1.9} ${y - u * 3} L ${cx + u * 1.9} ${y - u * 3} L ${cx + u * 1.3} ${y - u * 4.6} Z" fill="${C.ivory}"/><line x1="${cx}" y1="${y - u * 3}" x2="${cx}" y2="${y - u * 2.4}" stroke="${C.brass}" stroke-width="${u * 0.1}"/><path d="M ${cx - u * 0.3} ${y - u * 2.4} Q ${cx - u * 1.3} ${y - u * 1.6} ${cx - u * 1} ${y - u * 0.4} Q ${cx - u * 0.9} ${y} ${cx} ${y} Q ${cx + u * 0.9} ${y} ${cx + u * 1} ${y - u * 0.4} Q ${cx + u * 1.3} ${y - u * 1.6} ${cx + u * 0.3} ${y - u * 2.4} Z" fill="${g.ref}"/>`,
    };
  },
  tray: (cx, y, u, c) => {
    const g = grad(c);
    return {
      defs: g.def,
      svg: `${floorShadow(cx, y, u * 2.8, u * 0.3)}<path d="M ${cx - u * 2.6} ${y - u * 0.6} L ${cx - u * 2.4} ${y} L ${cx + u * 2.4} ${y} L ${cx + u * 2.6} ${y - u * 0.6} Z" fill="${g.ref}"/><rect x="${cx - u * 2.6}" y="${y - u * 0.75}" width="${u * 5.2}" height="${u * 0.18}" fill="${light(c, 0.2)}"/><path d="M ${cx - u * 1.1} ${y - u * 0.75} q ${u * 0.3} ${-u * 1.2} ${u * 1.1} ${-u * 1.25} q ${u * 0.8} 0 ${u * 1.1} ${u * 1.25} z" fill="${C.ivory}"/>`,
    };
  },
  rug: (cx, y, u, c) => {
    const g = grad(c);
    const w = u * 5.5;
    return {
      defs: g.def,
      svg: `<path d="M ${cx - w * 0.75} ${y} L ${cx - w * 0.5} ${y - u * 2.2} L ${cx + w * 0.5} ${y - u * 2.2} L ${cx + w * 0.75} ${y} Z" fill="${g.ref}"/><path d="M ${cx - w * 0.6} ${y - u * 0.25} L ${cx - w * 0.42} ${y - u * 1.95} L ${cx + w * 0.42} ${y - u * 1.95} L ${cx + w * 0.6} ${y - u * 0.25} Z" fill="none" stroke="${C.terracotta}" stroke-width="${u * 0.12}"/><path d="M ${cx - u * 1.2} ${y - u * 1.1} l ${u * 1.2} ${-u * 0.5} l ${u * 1.2} ${u * 0.5} l ${-u * 1.2} ${u * 0.5} z" fill="${C.terracotta}" opacity="0.8"/>`,
    };
  },
  planter: (cx, y, u, c) => {
    const g = grad(c, "d");
    return {
      defs: g.def,
      svg: `${floorShadow(cx, y, u * 2, u * 0.25)}<path d="M ${cx - u * 1.9} ${y - u * 3} L ${cx - u * 1.4} ${y} L ${cx + u * 1.4} ${y} L ${cx + u * 1.9} ${y - u * 3} Z" fill="${g.ref}"/><rect x="${cx - u * 2.05}" y="${y - u * 3.35}" width="${u * 4.1}" height="${u * 0.45}" fill="${light(c, 0.15)}"/><g stroke="${dark(c, 0.25)}" stroke-width="${u * 0.08}" fill="none">${[-1.2, -0.4, 0.4, 1.2].map((k) => `<path d="M ${cx + k * u - u * 0.35} ${y - u * 2.3} l ${u * 0.35} ${u * 0.6} l ${u * 0.35} ${-u * 0.6}"/>`).join("")}</g><g fill="#6E8B5E">${[-1, -0.3, 0.4, 1].map((k, i) => `<ellipse cx="${cx + k * u}" cy="${y - u * (4.3 + (i % 2) * 0.6)}" rx="${u * 0.45}" ry="${u * 1.3}" transform="rotate(${k * 18} ${cx + k * u} ${y - u * 3.4})"/>`).join("")}</g>`,
    };
  },
  lantern: (cx, y, u, c) => {
    const g = grad(c);
    return {
      defs: g.def,
      svg: `${floorShadow(cx, y, u * 1.6, u * 0.2)}<rect x="${cx - u * 1.1}" y="${y - u * 3.6}" width="${u * 2.2}" height="${u * 3.4}" fill="${light(C.glass, 0.4)}" opacity="0.9"/><ellipse cx="${cx}" cy="${y - u * 1.2}" rx="${u * 0.5}" ry="${u * 0.8}" fill="#F3C978" opacity="0.6" filter="url(#blur-s)"/><rect x="${cx - u * 0.25}" y="${y - u * 1.6}" width="${u * 0.5}" height="${u * 1.2}" fill="${C.ivory}"/><g fill="${g.ref}"><rect x="${cx - u * 1.25}" y="${y - u * 0.3}" width="${u * 2.5}" height="${u * 0.3}"/><rect x="${cx - u * 1.2}" y="${y - u * 3.6}" width="${u * 0.15}" height="${u * 3.3}"/><rect x="${cx + u * 1.05}" y="${y - u * 3.6}" width="${u * 0.15}" height="${u * 3.3}"/><path d="M ${cx - u * 1.35} ${y - u * 3.6} L ${cx} ${y - u * 4.6} L ${cx + u * 1.35} ${y - u * 3.6} Z"/></g><circle cx="${cx}" cy="${y - u * 4.9}" r="${u * 0.3}" fill="none" stroke="${c}" stroke-width="${u * 0.1}"/>`,
      def2: g.def,
    };
  },
  stool: (cx, y, u, c) => {
    const g = grad(c);
    return {
      defs: g.def,
      svg: `${floorShadow(cx, y, u * 2.2, u * 0.25)}<g fill="${dark(c, 0.15)}"><rect x="${cx - u * 1.6}" y="${y - u * 2.6}" width="${u * 0.3}" height="${u * 2.6}"/><rect x="${cx + u * 1.3}" y="${y - u * 2.6}" width="${u * 0.3}" height="${u * 2.6}"/><rect x="${cx - u * 1.5}" y="${y - u * 1}" width="${u * 3}" height="${u * 0.18}"/></g><g fill="${g.ref}">${[0, 1, 2, 3, 4].map((k) => `<rect x="${cx - u * 1.9 + k * u * 0.78}" y="${y - u * 3}" width="${u * 0.68}" height="${u * 0.4}"/>`).join("")}</g>`,
    };
  },
  birdhouse: (cx, y, u, c) => {
    const g = grad(c);
    return {
      defs: g.def,
      svg: `<line x1="${cx}" y1="0" x2="${cx}" y2="${y - u * 4.6}" stroke="${C.iron}" stroke-width="${u * 0.05}"/><rect x="${cx - u * 1.2}" y="${y - u * 3.4}" width="${u * 2.4}" height="${u * 2.4}" fill="${g.ref}"/><path d="M ${cx - u * 1.6} ${y - u * 3.2} L ${cx} ${y - u * 4.6} L ${cx + u * 1.6} ${y - u * 3.2} Z" fill="${dark(c, 0.2)}"/><circle cx="${cx}" cy="${y - u * 2.3}" r="${u * 0.35}" fill="${dark(c, 0.55)}"/><rect x="${cx - u * 1.5}" y="${y - u * 1.05}" width="${u * 3}" height="${u * 0.15}" fill="${dark(c, 0.2)}"/>${floorShadow(cx, y + u * 1.6, u * 1.3, u * 0.15, 0.15)}`,
    };
  },
  hanging: (cx, y, u, c) => {
    const g = grad(c);
    return {
      defs: g.def,
      svg: `<g stroke="${C.jute}" stroke-width="${u * 0.05}"><line x1="${cx}" y1="0" x2="${cx - u * 1.5}" y2="${y - u * 2}"/><line x1="${cx}" y1="0" x2="${cx + u * 1.5}" y2="${y - u * 2}"/><line x1="${cx}" y1="0" x2="${cx}" y2="${y - u * 2}"/></g><path d="M ${cx - u * 1.8} ${y - u * 2} Q ${cx - u * 1.6} ${y} ${cx} ${y} Q ${cx + u * 1.6} ${y} ${cx + u * 1.8} ${y - u * 2} Z" fill="${g.ref}"/><g stroke="${dark(c, 0.2)}" stroke-width="${u * 0.04}" fill="none">${[0.5, 1, 1.5].map((k) => `<path d="M ${cx - u * 1.7} ${y - u * 2 + k * u * 0.6} Q ${cx} ${y - u * 1.6 + k * u * 0.65} ${cx + u * 1.7} ${y - u * 2 + k * u * 0.6}"/>`).join("")}</g><g fill="#6E8B5E">${[-1.2, -0.4, 0.5, 1.2].map((k) => `<ellipse cx="${cx + k * u}" cy="${y - u * 2.5}" rx="${u * 0.35}" ry="${u * 0.8}" transform="rotate(${k * 25} ${cx + k * u} ${y - u * 2})"/>`).join("")}</g>`,
    };
  },
  toadstools: (cx, y, u, c) => {
    const g = grad(c);
    const t = (x, h, s) =>
      `${floorShadow(x, y, u * s, u * 0.12)}<rect x="${x - u * 0.25 * s}" y="${y - u * h}" width="${u * 0.5 * s}" height="${u * h}" fill="${C.ivory}"/><path d="M ${x - u * s} ${y - u * h} Q ${x} ${y - u * (h + 1.3 * s)} ${x + u * s} ${y - u * h} Z" fill="${g.ref}"/>`;
    return {
      defs: g.def,
      svg: t(cx - u * 1.6, 1.4, 0.8) + t(cx, 2.2, 1.1) + t(cx + u * 1.5, 1, 0.65),
    };
  },
  cylinder: (cx, y, u, c) => {
    const g = grad(c, "d");
    return {
      defs: g.def,
      svg: `${floorShadow(cx, y, u * 1.4, u * 0.2)}<rect x="${cx - u * 1}" y="${y - u * 3.6}" width="${u * 2}" height="${u * 3.6}" rx="${u * 0.1}" fill="${g.ref}"/><g fill="#F6D28A" opacity="0.85">${Array.from({ length: 24 }, (_, k) => `<circle cx="${cx - u * 0.7 + (k % 6) * u * 0.28}" cy="${y - u * 3 + Math.floor(k / 6) * u * 0.7}" r="${u * 0.07}"/>`).join("")}</g><ellipse cx="${cx}" cy="${y - u * 3.6}" rx="${u * 1.1}" ry="${u * 0.25}" fill="${dark(c, 0.25)}"/>`,
    };
  },
  // Wall-mounted pieces: (cx, cy) is the centre on the wall
  mirror: (cx, cy, u, c) => {
    const g = grad(c, "d");
    const s = `<circle cx="${cx}" cy="${cy}" r="${u * 2.6}" fill="${g.ref}"/>`;
    return {
      defs: g.def,
      svg:
        wallShadow(
          `<circle cx="${cx}" cy="${cy}" r="${u * 2.6}" fill="#000"/>`,
          u * 0.25,
          u * 0.35,
        ) +
        s +
        `<g fill="${dark(c, 0.2)}">${Array.from({ length: 24 }, (_, k) => {
          const a = (k / 24) * Math.PI * 2;
          return `<circle cx="${cx + Math.cos(a) * u * 2.25}" cy="${cy + Math.sin(a) * u * 2.25}" r="${u * 0.12}"/>`;
        }).join(
          "",
        )}</g><circle cx="${cx}" cy="${cy}" r="${u * 1.95}" fill="#D9DEDF"/><path d="M ${cx - u * 1.2} ${cy - u * 0.6} L ${cx - u * 0.4} ${cy - u * 1.4}" stroke="#fff" stroke-width="${u * 0.12}" opacity="0.7"/>`,
    };
  },
  baskets: (cx, cy, u, c) => {
    const g = grad(c, "d");
    const b = (x, y2, r) =>
      `<circle cx="${x}" cy="${y2}" r="${r}" fill="${g.ref}"/>${[0.35, 0.6, 0.85].map((t) => `<circle cx="${x}" cy="${y2}" r="${r * t}" fill="none" stroke="${dark(c, 0.2)}" stroke-width="${u * 0.05}"/>`).join("")}`;
    return {
      defs: g.def,
      svg:
        wallShadow(
          `<circle cx="${cx - u * 1.6}" cy="${cy - u * 0.6}" r="${u * 2}" fill="#000"/><circle cx="${cx + u * 1.9}" cy="${cy + u * 0.6}" r="${u * 1.4}" fill="#000"/><circle cx="${cx + u * 0.6}" cy="${cy - u * 2.3}" r="${u * 0.9}" fill="#000"/>`,
          u * 0.2,
          u * 0.3,
        ) +
        b(cx - u * 1.6, cy - u * 0.6, u * 2) +
        b(cx + u * 1.9, cy + u * 0.6, u * 1.4) +
        b(cx + u * 0.6, cy - u * 2.3, u * 0.9),
    };
  },
  panel: (cx, cy, u, c, opts = {}) => {
    const g = grad(c);
    const w = u * 3.2,
      h = u * 4.4;
    return {
      defs: g.def,
      svg:
        `<line x1="${cx - w * 0.62}" y1="${cy - h / 2}" x2="${cx + w * 0.62}" y2="${cy - h / 2}" stroke="${C.wood}" stroke-width="${u * 0.18}" stroke-linecap="round"/>` +
        wallShadow(
          `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" fill="#000"/>`,
          u * 0.15,
          u * 0.25,
        ) +
        `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" fill="${g.ref}"/>` +
        (opts.fringe
          ? `<g stroke="${dark(c, 0.15)}" stroke-width="${u * 0.06}">${Array.from({ length: 16 }, (_, k) => `<line x1="${cx - w / 2 + (k + 0.5) * (w / 16)}" y1="${cy + h / 2}" x2="${cx - w / 2 + (k + 0.5) * (w / 16)}" y2="${cy + h / 2 + u * 0.9}"/>`).join("")}</g><g fill="none" stroke="${dark(c, 0.18)}" stroke-width="${u * 0.07}">${[0, 1, 2, 3].map((r) => `<path d="M ${cx - w / 2} ${cy - h / 2 + u * (0.6 + r * 0.9)} l ${w / 4} ${u * 0.6} l ${w / 4} ${-u * 0.6} l ${w / 4} ${u * 0.6} l ${w / 4} ${-u * 0.6}"/>`).join("")}</g>`
          : `<g stroke="${light(c, 0.45)}" stroke-width="${u * 0.035}">${Array.from({ length: 22 }, (_, k) => `<line x1="${cx - w / 2 + u * 0.2}" y1="${cy - h / 2 + u * 0.2 + k * u * 0.19}" x2="${cx + w / 2 - u * 0.2}" y2="${cy - h / 2 + u * 0.2 + k * u * 0.19}" stroke-dasharray="${u * 0.12} ${u * 0.1}"/>`).join("")}</g>`),
    };
  },
  plate: (cx, cy, u, c) => {
    const g = grad(c, "d");
    return {
      defs: g.def,
      svg:
        wallShadow(`<circle cx="${cx}" cy="${cy}" r="${u * 2.3}" fill="#000"/>`, u * 0.2, u * 0.3) +
        `<circle cx="${cx}" cy="${cy}" r="${u * 2.3}" fill="${g.ref}"/><circle cx="${cx}" cy="${cy}" r="${u * 1.7}" fill="none" stroke="${dark(c, 0.15)}" stroke-width="${u * 0.06}"/><g fill="${light(c, 0.3)}">${Array.from(
          { length: 8 },
          (_, k) => {
            const a = (k / 8) * Math.PI * 2;
            return `<ellipse cx="${cx + Math.cos(a) * u * 0.9}" cy="${cy + Math.sin(a) * u * 0.9}" rx="${u * 0.5}" ry="${u * 0.2}" transform="rotate(${(a * 180) / Math.PI} ${cx + Math.cos(a) * u * 0.9} ${cy + Math.sin(a) * u * 0.9})"/>`;
          },
        ).join("")}</g><circle cx="${cx}" cy="${cy}" r="${u * 0.3}" fill="${dark(c, 0.1)}"/>`,
    };
  },
  shelf: (cx, cy, u, c) => {
    const g = grad(c);
    return {
      defs: g.def,
      svg:
        wallShadow(
          `<rect x="${cx - u * 3}" y="${cy}" width="${u * 6}" height="${u * 0.45}" fill="#000"/>`,
          0,
          u * 0.35,
        ) +
        `<rect x="${cx - u * 3}" y="${cy}" width="${u * 6}" height="${u * 0.45}" fill="${g.ref}"/>` +
        OBJ.budvase(cx - u * 1.6, cy, u * 0.45, C.ivory).svg +
        `<path d="M ${cx - u * 0.3} ${cy} q ${u * 0.2} ${-u * 1.2} ${u * 1} ${-u * 1.2} q ${u * 0.8} 0 ${u * 1} ${u * 1.2} z" fill="${C.terracotta}"/><rect x="${cx + u * 1.6}" y="${cy - u * 1.6}" width="${u * 0.35}" height="${u * 1.6}" fill="${C.indigo}"/><rect x="${cx + u * 2}" y="${cy - u * 1.4}" width="${u * 0.3}" height="${u * 1.4}" fill="${C.clay}"/>`,
    };
  },
  tiles: (cx, cy, u, c) => {
    const s = u * 1.5;
    const tile = (x, y2) =>
      `<rect x="${x}" y="${y2}" width="${s}" height="${s}" fill="${C.marble}"/><circle cx="${x + s / 2}" cy="${y2 + s / 2}" r="${s * 0.3}" fill="none" stroke="${c}" stroke-width="${u * 0.12}"/><g fill="${c}">${[0, 1, 2, 3].map((k) => `<circle cx="${x + s / 2 + Math.cos(k * 1.5708) * s * 0.3}" cy="${y2 + s / 2 + Math.sin(k * 1.5708) * s * 0.3}" r="${s * 0.08}"/>`).join("")}</g><path d="M ${x} ${y2} l ${s * 0.18} 0 l ${-s * 0.18} ${s * 0.18} z M ${x + s} ${y2 + s} l ${-s * 0.18} 0 l ${s * 0.18} ${-s * 0.18} z" fill="${c}"/>`;
    const x0 = cx - s - u * 0.1,
      y0 = cy - s - u * 0.1;
    return {
      defs: "",
      svg:
        wallShadow(
          `<rect x="${x0 - u * 0.25}" y="${y0 - u * 0.25}" width="${2 * s + u * 0.7}" height="${2 * s + u * 0.7}" fill="#000"/>`,
          u * 0.15,
          u * 0.25,
        ) +
        `<rect x="${x0 - u * 0.25}" y="${y0 - u * 0.25}" width="${2 * s + u * 0.7}" height="${2 * s + u * 0.7}" fill="${C.wood}"/>` +
        tile(x0, y0) +
        tile(x0 + s + u * 0.2, y0) +
        tile(x0, y0 + s + u * 0.2) +
        tile(x0 + s + u * 0.2, y0 + s + u * 0.2),
    };
  },
  leaves: (cx, cy, u, c) => {
    const g = grad(c, "d");
    const leaf = (x, y2, r, s) =>
      `<path d="M ${x} ${y2} q ${u * 0.7 * s} ${-u * 0.9 * s} 0 ${-u * 2 * s} q ${-u * 0.7 * s} ${u * 1.1 * s} 0 ${u * 2 * s} z" fill="${g.ref}" transform="rotate(${r} ${x} ${y2})"/>`;
    const items = [
      [-2.6, 0.6, -60, 1],
      [-1.8, -0.4, -35, 1.2],
      [-0.8, -0.9, -12, 1.35],
      [0.4, -0.9, 10, 1.4],
      [1.5, -0.5, 32, 1.2],
      [2.4, 0.4, 58, 1],
      [-1.2, 1, -80, 0.9],
      [1.3, 1, 82, 0.9],
    ];
    const svg = items.map(([x, y2, r, s]) => leaf(cx + x * u, cy + y2 * u + u, r, s)).join("");
    return { defs: g.def, svg: wallShadow(svg, u * 0.2, u * 0.3) + svg };
  },
  diyas: (cx, y, u, c) => {
    const g = grad(c, "d");
    const d = (x, s) =>
      `${floorShadow(x, y, u * 1.1 * s, u * 0.15)}<path d="M ${x - u * 0.9 * s} ${y} L ${x - u * 0.9 * s} ${y - u * 1.6 * s} Q ${x} ${y - u * 3.2 * s} ${x + u * 0.9 * s} ${y - u * 1.6 * s} L ${x + u * 0.9 * s} ${y} Z" fill="${g.ref}"/><g fill="#F6CF7A">${Array.from({ length: 10 }, (_, k) => `<circle cx="${x - u * 0.5 * s + (k % 5) * u * 0.25 * s}" cy="${y - u * 0.6 * s - Math.floor(k / 5) * u * 0.55 * s}" r="${u * 0.06 * s}"/>`).join("")}</g><circle cx="${x}" cy="${y - u * 3.3 * s}" r="${u * 0.18 * s}" fill="none" stroke="${c}" stroke-width="${u * 0.07}"/>`;
    return { defs: g.def, svg: d(cx - u * 1.2, 1.1) + d(cx + u * 1.3, 0.8) };
  },
  wreath: (cx, cy, u, c) => {
    const ring = Array.from({ length: 36 }, (_, k) => {
      const a = (k / 36) * Math.PI * 2;
      const r = u * (2.1 + (k % 3) * 0.12);
      return `<circle cx="${cx + Math.cos(a) * r}" cy="${cy + Math.sin(a) * r}" r="${u * (0.42 + (k % 2) * 0.1)}" fill="${k % 4 === 0 ? light(c, 0.2) : k % 3 ? c : dark(c, 0.1)}"/>`;
    }).join("");
    return {
      defs: "",
      svg:
        wallShadow(
          `<circle cx="${cx}" cy="${cy}" r="${u * 2.6}" fill="none" stroke="#000" stroke-width="${u}"/>`,
          u * 0.2,
          u * 0.3,
        ) +
        ring +
        `<path d="M ${cx - u * 0.4} ${cy + u * 2.4} l ${-u * 0.4} ${u * 1.2} M ${cx + u * 0.4} ${cy + u * 2.4} l ${u * 0.4} ${u * 1.2}" stroke="${C.red}" stroke-width="${u * 0.16}"/>`,
    };
  },
  stars: (cx, cy, u, c) => {
    const star = (x, y2, r, rot) => {
      const pts = Array.from({ length: 10 }, (_, k) => {
        const a = (k / 10) * Math.PI * 2 - Math.PI / 2 + rot;
        const rr = k % 2 ? r * 0.45 : r;
        return `${x + Math.cos(a) * rr},${y2 + Math.sin(a) * rr}`;
      }).join(" ");
      return `<line x1="${x}" y1="0" x2="${x}" y2="${y2 - r}" stroke="${C.ink}" stroke-width="${u * 0.03}" opacity="0.5"/><polygon points="${pts}" fill="${c}"/><circle cx="${x}" cy="${y2}" r="${r * 0.18}" fill="${light(c, 0.5)}"/>`;
    };
    return {
      defs: "",
      svg:
        star(cx - u * 1.8, cy - u * 0.6, u * 1.1, 0.1) +
        star(cx + u * 0.2, cy + u * 0.6, u * 1.4, -0.15) +
        star(cx + u * 2.2, cy - u * 1.2, u * 0.9, 0.3),
    };
  },
  garland: (cx, cy, u, c) => {
    const pts = Array.from({ length: 28 }, (_, k) => {
      const t = k / 27;
      const x = cx - u * 3.4 + t * u * 6.8;
      const y2 = cy + Math.sin(t * Math.PI) * u * 1.8;
      return [x, y2];
    });
    return {
      defs: "",
      svg: pts
        .map(
          ([x, y2], k) =>
            `<ellipse cx="${x}" cy="${y2}" rx="${u * 0.55}" ry="${u * 0.2}" fill="${c}" transform="rotate(${k % 2 ? 35 : -35} ${x} ${y2})"/>${k % 5 === 0 ? `<circle cx="${x}" cy="${y2 + u * 0.3}" r="${u * 0.18}" fill="${C.red}"/>` : ""}`,
        )
        .join(""),
    };
  },
  runner: (cx, y, u, c) => {
    const g = grad(C.wood);
    return {
      defs: g.def,
      svg: `${floorShadow(cx, y, u * 3.6, u * 0.3)}<rect x="${cx - u * 3.4}" y="${y - u * 2.2}" width="${u * 6.8}" height="${u * 0.35}" fill="${g.ref}"/><rect x="${cx - u * 3.1}" y="${y - u * 1.85}" width="${u * 0.3}" height="${u * 1.85}" fill="${dark(C.wood, 0.2)}"/><rect x="${cx + u * 2.8}" y="${y - u * 1.85}" width="${u * 0.3}" height="${u * 1.85}" fill="${dark(C.wood, 0.2)}"/><rect x="${cx - u * 3.5}" y="${y - u * 2.32}" width="${u * 7}" height="${u * 0.2}" fill="${c}"/><rect x="${cx - u * 1.2}" y="${y - u * 2.32}" width="${u * 2.4}" height="${u * 1.4}" fill="${c}"/><g fill="${C.brass}">${[0, 1, 2].map((k) => `<circle cx="${cx - u * 0.7 + k * u * 0.7}" cy="${y - u * 1.6}" r="${u * 0.18}"/>`).join("")}</g>`,
    };
  },
  tealight: (cx, y, u, c) => {
    return {
      defs: "",
      svg: `${floorShadow(cx, y, u * 1.2, u * 0.18)}<ellipse cx="${cx}" cy="${y - u * 1.4}" rx="${u * 1.6}" ry="${u * 1.6}" fill="#F7D990" opacity="0.35" filter="url(#blur)"/><path d="M ${cx - u * 0.9} ${y - u * 2} L ${cx - u * 0.8} ${y} L ${cx + u * 0.8} ${y} L ${cx + u * 0.9} ${y - u * 2} Z" fill="${light(c, 0.3)}" opacity="0.9"/><g fill="${C.red}" opacity="0.75">${Array.from({ length: 18 }, (_, k) => `<circle cx="${cx - u * 0.7 + (k % 6) * u * 0.28}" cy="${y - u * 0.4 - Math.floor(k / 6) * u * 0.5}" r="${u * 0.09}"/>`).join("")}</g><ellipse cx="${cx}" cy="${y - u * 2.2}" rx="${u * 0.12}" ry="${u * 0.3}" fill="#F2A43A"/>`,
    };
  },
  stocking: (cx, cy, u, c) => {
    const g = grad(c);
    const s = `<path d="M ${cx - u * 0.9} ${cy - u * 2.6} L ${cx + u * 0.9} ${cy - u * 2.6} L ${cx + u * 0.9} ${cy + u * 0.6} Q ${cx + u * 0.9} ${cy + u * 2.2} ${cx - u * 0.6} ${cy + u * 2.2} L ${cx - u * 1.9} ${cy + u * 2.2} Q ${cx - u * 2.6} ${cy + u * 1.4} ${cx - u * 1.9} ${cy + u * 0.8} L ${cx - u * 0.9} ${cy + u * 0.4} Z" fill="${g.ref}"/>`;
    return {
      defs: g.def,
      svg:
        wallShadow(s, u * 0.2, u * 0.3) +
        s +
        `<rect x="${cx - u * 1.05}" y="${cy - u * 3.1}" width="${u * 2.1}" height="${u * 0.8}" fill="${C.ivory}"/><g fill="${C.brass}">${Array.from({ length: 6 }, (_, k) => `<circle cx="${cx - u * 0.4 + (k % 2) * u * 0.8}" cy="${cy - u * 1.6 + Math.floor(k / 2) * u * 0.8}" r="${u * 0.15}"/>`).join("")}</g>`,
    };
  },
  baubles: (cx, y, u, c) => {
    const b = (x, r, col) =>
      `${floorShadow(x, y, r * 1.05, r * 0.18)}<circle cx="${x}" cy="${y - r}" r="${r}" fill="${col}"/><path d="M ${x - r * 0.9} ${y - r} q ${r * 0.9} ${-r * 0.5} ${r * 1.8} 0" stroke="${C.brass}" stroke-width="${u * 0.08}" fill="none"/><circle cx="${x - r * 0.35}" cy="${y - r * 1.4}" r="${r * 0.18}" fill="#fff" opacity="0.45"/><rect x="${x - r * 0.15}" y="${y - r * 2.15}" width="${r * 0.3}" height="${r * 0.22}" fill="${C.brass}"/>`;
    return {
      defs: "",
      svg: b(cx - u * 1.7, u * 1, C.teal) + b(cx + u * 1.5, u * 0.85, C.brass) + b(cx, u * 1.25, c),
    };
  },
};

function drawObject(shape, cx, y, u, color, extra) {
  return OBJ[shape](cx, y, u, color, extra);
}

/** A styled room or vignette with several objects. */
function vignette(
  w,
  h,
  { wall, floor, horizon = 0.7, items = [], wallItems = [], window = null, text },
) {
  const sc = scene(w, h, { wall, floor, horizon });
  let defs = sc.defs;
  let body = sc.base;
  if (window) {
    const { x, w: ww, h: wh } = window;
    const top = sc.hy - wh;
    body += `<path d="M ${x} ${sc.hy} L ${x} ${top + ww / 2} A ${ww / 2} ${ww / 2} 0 0 1 ${x + ww} ${top + ww / 2} L ${x + ww} ${sc.hy} Z" fill="${light(wall, 0.55)}"/><path d="M ${x + ww / 2} ${top} L ${x + ww / 2} ${sc.hy} M ${x} ${top + ww * 0.85} L ${x + ww} ${top + ww * 0.85}" stroke="${dark(wall, 0.08)}" stroke-width="${ww * 0.025}"/><path d="M ${x - ww * 0.1} ${sc.hy} L ${x + ww * 1.1} ${sc.hy} L ${x + ww * 1.9} ${h} L ${x - ww * 0.5} ${h} Z" fill="#fff" opacity="0.12"/>`;
  }
  for (const [shape, cx, cy, u, color, extra] of wallItems) {
    const o = drawObject(shape, cx * w, cy * h, u * w, color, extra);
    defs += o.defs;
    body += o.svg;
  }
  for (const [shape, cx, cy, u, color, extra] of items) {
    const o = drawObject(shape, cx * w, cy * h, u * w, color, extra);
    defs += o.defs;
    body += o.svg;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs>${defs}</defs>${body}${sc.vignette}${label(w, h, text)}</svg>`;
}

/** Workshop scenes for The Studio / About (deeper, warmer tones). */
function workshop(w, h, motif, text) {
  const wall = "#D8CBB6";
  const bench = "#8D6B4C";
  const sc = scene(w, h, { wall, floor: "#B9A285", horizon: 0.62 });
  let body = sc.base;
  const u = Math.min(w, h) * 0.07;
  const cx = w / 2;
  const top = sc.hy;
  const benchTop = `<rect x="0" y="${top + u * 1.2}" width="${w}" height="${u * 0.7}" fill="${bench}"/><rect x="0" y="${top + u * 1.9}" width="${w}" height="${h}" fill="${dark(bench, 0.25)}" opacity="0.5"/>`;
  switch (motif) {
    case "blocks":
      body +=
        benchTop +
        Array.from({ length: 9 }, (_, k) => {
          const x = cx - u * 4.2 + (k % 3) * u * 2.9 + (Math.floor(k / 3) % 2) * u * 0.6;
          const y = top - u * 2.6 + Math.floor(k / 3) * u * 1.4;
          return `<rect x="${x}" y="${y}" width="${u * 2.3}" height="${u * 1.1}" fill="${k % 2 ? "#9B7653" : "#7E5D40"}"/><g fill="#5c4330">${[0, 1, 2].map((j) => `<circle cx="${x + u * 0.55 + j * u * 0.6}" cy="${y + u * 0.55}" r="${u * 0.2}"/>`).join("")}</g>`;
        }).join("");
      break;
    case "printing":
      body +=
        benchTop +
        `<rect x="${cx - u * 4.5}" y="${top - u * 0.4}" width="${u * 9}" height="${u * 1.8}" fill="#F2EAD9" transform="skewX(-18)"/>` +
        Array.from(
          { length: 14 },
          (_, k) =>
            `<g transform="translate(${cx - u * 3.8 + (k % 7) * u * 1.2 - Math.floor(k / 7) * u * 0.25} ${top + Math.floor(k / 7) * u * 0.8})" fill="${C.indigo}"><circle r="${u * 0.18}"/>${[0, 1, 2, 3].map((j) => `<ellipse cx="${Math.cos(j * 1.57) * u * 0.32}" cy="${Math.sin(j * 1.57) * u * 0.22}" rx="${u * 0.16}" ry="${u * 0.08}"/>`).join("")}</g>`,
        ).join("") +
        `<rect x="${cx + u * 1.5}" y="${top - u * 2.4}" width="${u * 1.8}" height="${u * 1.2}" fill="#7E5D40"/><rect x="${cx + u * 2.1}" y="${top - u * 3.3}" width="${u * 0.6}" height="${u * 0.9}" fill="#6a4e36"/>`;
      break;
    case "loom":
      body += `<g stroke="#6a4e36" stroke-width="${u * 0.35}"><line x1="${cx - u * 4}" y1="${u}" x2="${cx - u * 4}" y2="${h}"/><line x1="${cx + u * 4}" y1="${u}" x2="${cx + u * 4}" y2="${h}"/><line x1="${cx - u * 4.4}" y1="${u * 1.6}" x2="${cx + u * 4.4}" y2="${u * 1.6}"/><line x1="${cx - u * 4.4}" y1="${top + u}" x2="${cx + u * 4.4}" y2="${top + u}"/></g><g stroke="#EFE6D6" stroke-width="${u * 0.05}">${Array.from({ length: 50 }, (_, k) => `<line x1="${cx - u * 3.7 + k * u * 0.15}" y1="${u * 1.6}" x2="${cx - u * 3.7 + k * u * 0.15}" y2="${top + u}"/>`).join("")}</g><rect x="${cx - u * 3.7}" y="${top - u * 1.6}" width="${u * 7.4}" height="${u * 2.6}" fill="${C.indigo}" opacity="0.85"/><g stroke="#EFE6D6" stroke-width="${u * 0.06}" opacity="0.6">${Array.from({ length: 10 }, (_, k) => `<line x1="${cx - u * 3.7}" y1="${top - u * 1.4 + k * u * 0.25}" x2="${cx + u * 3.7}" y2="${top - u * 1.4 + k * u * 0.25}" stroke-dasharray="${u * 0.3} ${u * 0.2}"/>`).join("")}</g><path d="M ${cx - u * 1.5} ${top - u * 2} l ${u * 3} 0 l ${u * 0.4} ${u * 0.25} l ${-u * 3.8} 0 z" fill="#9B7653"/>`;
      break;
    case "dyes":
      body +=
        `<line x1="0" y1="${u * 1.5}" x2="${w}" y2="${u * 1.5}" stroke="#6a4e36" stroke-width="${u * 0.25}"/>` +
        ["#41507F", "#B46F52", "#D98A3A", "#6F8C6C", "#A2483D", "#41507F", "#C2A579"]
          .map(
            (col, k) =>
              `<path d="M ${cx - u * 5.2 + k * u * 1.75} ${u * 1.5} q ${u * 0.7} ${u * 2} 0 ${u * 5.5} l ${u * 1.1} 0 q ${-u * 0.7} ${-u * 3.5} 0 ${-u * 5.5} z" fill="${col}"/><g stroke="${dark(col, 0.2)}" stroke-width="${u * 0.04}">${[0, 1, 2, 3].map((j) => `<line x1="${cx - u * 5.1 + k * u * 1.75 + j * u * 0.25}" y1="${u * 1.8}" x2="${cx - u * 5.1 + k * u * 1.75 + j * u * 0.25}" y2="${u * 6.8}"/>`).join("")}</g>`,
          )
          .join("");
      break;
    case "carving":
      body +=
        benchTop +
        OBJ.mirror(cx, top - u * 1.2, u * 0.9, C.wood).svg +
        `<rect x="${cx + u * 3}" y="${top}" width="${u * 2}" height="${u * 0.25}" fill="#5c4330"/><rect x="${cx + u * 3.4}" y="${top - u * 0.15}" width="${u * 0.5}" height="${u * 0.15}" fill="#9C9A94"/>`;
      break;
    case "metal":
      body +=
        benchTop +
        [-3, -1, 1.2, 3.2]
          .map(
            (k, i) =>
              `<path d="M ${cx + k * u - u * (0.9 - i * 0.1)} ${top + u * 1.2} q ${u * (0.9 - i * 0.1)} ${-u * (1.8 - i * 0.2)} ${u * (1.8 - i * 0.2)} 0 z" fill="${i % 2 ? C.brass : dark(C.brass, 0.15)}"/>`,
          )
          .join("") +
        `<rect x="${cx - u * 0.2}" y="${top - u * 3}" width="${u * 0.25}" height="${u * 2.4}" fill="#6a4e36" transform="rotate(25 ${cx} ${top})"/><rect x="${cx - u * 0.6}" y="${top - u * 3.3}" width="${u * 1}" height="${u * 0.5}" fill="#5f5b56" transform="rotate(25 ${cx} ${top})"/>`;
      break;
    case "finishing":
      body +=
        benchTop +
        ["#EFE6D6", "#41507F", "#C2A579", "#B46F52", "#EFE6D6", "#6F8C6C"]
          .map(
            (col, k) =>
              `<rect x="${cx - u * 2.6 + (k % 2) * u * 0.15}" y="${top + u * 1.2 - (k + 1) * u * 0.7}" width="${u * 5.2}" height="${u * 0.66}" rx="${u * 0.25}" fill="${col}"/>`,
          )
          .join("") +
        `<rect x="${cx + u * 3.4}" y="${top - u * 0.6}" width="${u * 1.4}" height="${u * 1.8}" fill="#F7F2E8"/><line x1="${cx + u * 3.6}" y1="${top - u * 0.2}" x2="${cx + u * 4.6}" y2="${top - u * 0.2}" stroke="#4A443C" stroke-width="${u * 0.04}"/>`;
      break;
    case "people":
      body += [-3.2, -1.1, 1.1, 3.2]
        .map((k, i) => {
          const x = cx + k * u;
          const tone = ["#7A5A44", "#5E4636", "#8C6A50", "#6B4F3C"][i];
          const cloth = ["#41507F", "#B46F52", "#EFE6D6", "#6F8C6C"][i];
          return `<ellipse cx="${x}" cy="${h}" rx="${u * 1.4}" ry="${u * 0.3}" fill="#2a2018" opacity="0.2" filter="url(#blur)"/><path d="M ${x - u * 1.2} ${h} L ${x - u * 1} ${top - u * 0.6} Q ${x} ${top - u * 1.6} ${x + u * 1} ${top - u * 0.6} L ${x + u * 1.2} ${h} Z" fill="${cloth}"/><circle cx="${x}" cy="${top - u * 2.1}" r="${u * 0.75}" fill="${tone}"/>`;
        })
        .join("");
      break;
    default:
      body += benchTop;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs>${sc.defs}</defs>${body}${sc.vignette}${label(w, h, text)}</svg>`;
}

function mapImage(w, h) {
  let s = `<rect width="${w}" height="${h}" fill="#EEE8DD"/>`;
  s += `<path d="M 0 ${h * 0.7} C ${w * 0.3} ${h * 0.55}, ${w * 0.5} ${h * 0.85}, ${w} ${h * 0.6} L ${w} ${h} L 0 ${h} Z" fill="#D9E3DC"/>`;
  for (let k = 0; k < 9; k++)
    s += `<line x1="${k * w * 0.13 - 40}" y1="0" x2="${k * w * 0.13 + 120}" y2="${h}" stroke="#fff" stroke-width="${k % 3 ? 6 : 14}"/>`;
  for (let k = 0; k < 6; k++)
    s += `<line x1="0" y1="${k * h * 0.2 + 30}" x2="${w}" y2="${k * h * 0.2 - 30}" stroke="#fff" stroke-width="${k % 2 ? 6 : 12}"/>`;
  s += `<g transform="translate(${w * 0.52} ${h * 0.45})"><path d="M 0 0 C -30 -40 -40 -60 -40 -80 A 40 40 0 0 1 40 -80 C 40 -60 30 -40 0 0 Z" fill="#1F6B45"/><circle cy="-80" r="14" fill="#fff"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${s}${label(w, h, "STATIC MAP")}</svg>`;
}

function ogImage(w, h) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#FAF8F4"/><rect x="40" y="40" width="${w - 80}" height="${h - 80}" fill="none" stroke="#D9D2C5" stroke-width="2"/><text x="50%" y="46%" text-anchor="middle" font-family="Georgia, serif" font-size="52" letter-spacing="14" fill="#2B2926">SAI CREATIONS INTERNATIONAL</text><text x="50%" y="58%" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" letter-spacing="6" fill="#625C53">A HOUSE OF HOME FURNISHING &amp; HANDICRAFTS</text>${label(w, h, "SHARE IMAGE")}</svg>`;
}

// ─── Output ──────────────────────────────────────────────────────────────────
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

const jpg = (svgString) => () =>
  sharp(Buffer.from(svgString)).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
const jobs = [];
const P = (rel, svgFactory) => jobs.push([path.join(PH, rel), () => jpg(svgFactory())()]);

// Product and category images are now the client's real photos (scripts/import-client-images.mjs).

const HW = 2400,
  HH = 1350;
P("home/hero-1.jpg", () =>
  vignette(HW, HH, {
    wall: "#E9E1D4",
    floor: "#D5C6B0",
    horizon: 0.74,
    window: { x: HW * 0.58, w: HW * 0.2, h: HH * 0.6 },
    items: [
      ["rug", 0.68, 0.98, 0.05, C.ivory],
      ["pouf", 0.52, 0.9, 0.035, C.jute],
      ["lamp", 0.86, 0.88, 0.04, C.green],
      ["budvase", 0.92, 0.88, 0.025, C.brass],
    ],
    wallItems: [["plate", 0.44, 0.36, 0.025, C.brass]],
    text: "HOME HERO 1",
  }),
);
P("home/studio-teaser.jpg", () => workshop(2000, 1250, "loom", "STUDIO TEASER"));
P("home/about-teaser.jpg", () => workshop(1200, 1500, "finishing", "ABOUT TEASER"));
P("about/initiative-1.jpg", () => workshop(1200, 1500, "blocks", "THE INITIATIVE 1"));
P("about/initiative-2.jpg", () => workshop(1200, 1500, "printing", "THE INITIATIVE 2"));
P("about/present-1.jpg", () => workshop(1200, 1500, "people", "THE PRESENT 1"));
P("about/present-2.jpg", () => workshop(1200, 1500, "finishing", "THE PRESENT 2"));
P("studio/poster.jpg", () => workshop(1920, 1080, "loom", "STUDIO VIDEO POSTER"));
["blocks", "printing", "loom", "dyes", "carving", "metal", "finishing", "people"].forEach((m, i) =>
  P(`studio/slide-${String(i + 1).padStart(2, "0")}.jpg`, () =>
    workshop(1200, 1500, m, `STUDIO ${i + 1}`),
  ),
);
P("contact/map.jpg", () => mapImage(1600, 900));
P("og/default.jpg", () => ogImage(1200, 630));

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
