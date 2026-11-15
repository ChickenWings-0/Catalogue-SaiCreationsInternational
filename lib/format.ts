/** Fills {placeholders} in a template string, e.g. fillTemplate("© {year}", { year: 2026 }). */
export function fillTemplate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, key: string) =>
    key in values ? String(values[key]) : m,
  );
}
