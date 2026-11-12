/*
 * TEMPORARY: palette switcher config for client review. Values live in app/palettes.css.
 * Remove together with components/palette/ (see the note at the top of app/palettes.css).
 */

export type PaletteId = "classic" | "block-print" | "sage-brass" | "blush-teal" | "marigold";

export type Palette = { id: PaletteId; name: string; description: string };

export const DEFAULT_PALETTE: PaletteId = "classic";
export const PALETTE_STORAGE_KEY = "sci-palette";
export const PALETTE_QUERY_PARAM = "palette";

export const PALETTES: Palette[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Ivory, linen and charcoal with a forest-green accent",
  },
  {
    id: "block-print",
    name: "Block Print",
    description: "Sand and terracotta clay with a deep indigo highlight",
  },
  {
    id: "sage-brass",
    name: "Sage & Brass",
    description: "Calm sage and linen with an antique brass accent",
  },
  {
    id: "blush-teal",
    name: "Blush & Teal",
    description: "Soft blush clay with a deep teal highlight",
  },
  { id: "marigold", name: "Marigold", description: "Warm cream with a saffron highlight" },
];

/** Developer-facing labels for the review tool (not client content). */
export const PALETTE_UI = {
  open: "Colour palettes",
  title: "Colour palette",
  note: "Preview only. Your choice is remembered on this device.",
  copyLink: "Copy link to this palette",
  copied: "Link copied",
  current: "Current",
  close: "Close palette panel",
};

/**
 * Inline script for <head>: applies ?palette=… or the stored choice before first paint,
 * so there is no flash of the default palette. Works in the static export (no server).
 */
export function paletteBootScript(): string {
  const ids = JSON.stringify(PALETTES.map((p) => p.id));
  return `(function(){try{var ids=${ids},k=${JSON.stringify(PALETTE_STORAGE_KEY)},d=${JSON.stringify(DEFAULT_PALETTE)};var q=new URLSearchParams(location.search).get(${JSON.stringify(PALETTE_QUERY_PARAM)});var s=null;try{s=localStorage.getItem(k)}catch(e){}var v=null;if(q&&ids.indexOf(q)>-1){v=q;try{localStorage.setItem(k,q)}catch(e){}}else if(s&&ids.indexOf(s)>-1){v=s}if(v&&v!==d){document.documentElement.setAttribute("data-palette",v)}}catch(e){}})();`;
}
