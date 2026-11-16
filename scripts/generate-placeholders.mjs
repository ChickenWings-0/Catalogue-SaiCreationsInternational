#!/usr/bin/env node
/**
 * Generates the site's illustrated images (built from simple shapes, no photography):
 *
 *   assets/images/home/hero.jpg      the Home hero still life (approved by the client as-is)
 *   assets/images/site/og-default.jpg default link-preview image (logo + name)
 *
 * Files are only created if missing. `--force` regenerates them.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "assets", "images");
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
  if (!text) return "";
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
async function write(file, makeBuffer) {
  if ((await exists(file)) && !FORCE) {
    skipped++;
    return;
  }
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, await makeBuffer());
  created++;
}

const jpg = (svgString) => () =>
  sharp(Buffer.from(svgString)).jpeg({ quality: 86, mozjpeg: true }).toBuffer();

const HW = 2400,
  HH = 1350;
const jobs = [
  [
    path.join(OUT, "home", "hero.jpg"),
    jpg(
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
        text: null,
      }),
    ),
  ],
  [
    path.join(OUT, "site", "og-default.jpg"),
    async () => {
      // Sage & Brass ivory background, the client's logo and the wordmark text.
      const W = 1200,
        H = 630;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="100%" height="100%" fill="#F7F7F1"/><rect x="36" y="36" width="${W - 72}" height="${H - 72}" fill="none" stroke="#CDD4C3" stroke-width="2"/><text x="50%" y="62%" text-anchor="middle" font-family="Georgia, serif" font-size="40" letter-spacing="11" fill="#253028">SAI CREATIONS INTERNATIONAL</text><text x="50%" y="72%" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" letter-spacing="6" fill="#545F55">A HOUSE OF HOME FURNISHING &amp; HANDICRAFTS</text></svg>`;
      const logo = await sharp(path.join(ROOT, "public", "brand", "logo.png"))
        .resize(150, 150)
        .toBuffer();
      return sharp(Buffer.from(svg))
        .composite([{ input: logo, left: (W - 150) / 2, top: 120 }])
        .jpeg({ quality: 88, mozjpeg: true })
        .toBuffer();
    },
  ],
];

for (const [file, make] of jobs) await write(file, make);
console.log(
  `[illustrations] ${created} created · ${skipped} already present${FORCE ? " (--force)" : ""}`,
);
