import type { Dimensions } from "./schemas";

const toInches = (cm: number) => (cm / 2.54).toFixed(1);
const trimCm = (cm: number) => (Number.isInteger(cm) ? String(cm) : cm.toFixed(1));

/**
 * Formats dimensions cm first, then inches:
 *   { widthCm: 45, heightCm: 30 }    → "45 × 30 cm / 17.7 × 11.8 in"
 *   { diameterCm: 30, heightCm: 40 } → "Ø 30 × 40 cm / Ø 11.8 × 15.7 in"
 * Order: diameter, width, length, depth, height. Returns "" if only a note is given.
 */
export function formatDimensions(d: Dimensions): string {
  const parts: { cm: number; prefix?: string }[] = [];
  if (d.diameterCm) parts.push({ cm: d.diameterCm, prefix: "Ø " });
  for (const v of [d.widthCm, d.lengthCm, d.depthCm, d.heightCm]) if (v) parts.push({ cm: v });
  if (!parts.length) return "";
  const cm = parts.map((p) => `${p.prefix ?? ""}${trimCm(p.cm)}`).join(" × ");
  const inches = parts.map((p) => `${p.prefix ?? ""}${toInches(p.cm)}`).join(" × ");
  return `${cm} cm / ${inches} in`;
}

/** Fills {placeholders} in a template string, e.g. fillTemplate("© {year}", { year: 2026 }). */
export function fillTemplate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, key: string) =>
    key in values ? String(values[key]) : m,
  );
}
