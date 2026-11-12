/*
 * Pure catalogue filter / sort logic (no React, no DOM). Unit tested in lib/filters.test.ts.
 * Filters and sorting on category pages are PENDING CLIENT CONFIRMATION
 * (features.catalogueFilters in content/site.ts).
 */

export type SizeBucket = "small" | "medium" | "large";
export type SortKey = "featured" | "newest" | "name-asc" | "name-desc";
export const SORT_KEYS: SortKey[] = ["featured", "newest", "name-asc", "name-desc"];
export const SIZE_ORDER: SizeBucket[] = ["small", "medium", "large"];

/** The fields filtering needs: a subset of Product, so this module stays dependency-free. */
export type Filterable = {
  id: string;
  name: string;
  materials: string[];
  colours: string[];
  size: SizeBucket;
  dateAdded: string;
  featured?: boolean;
};

export type FilterState = { materials: string[]; colours: string[]; sizes: SizeBucket[] };
export type Facet = { value: string; count: number };
export type FilterFacets = { materials: Facet[]; colours: Facet[]; sizes: Facet[] };

export const EMPTY_FILTERS: FilterState = { materials: [], colours: [], sizes: [] };

/** Facet values (with counts) present in the given products, sorted by name (sizes by size). */
export function getFilterFacets(products: Filterable[]): FilterFacets {
  const count = (values: string[]) => {
    const m = new Map<string, number>();
    for (const v of values) m.set(v, (m.get(v) ?? 0) + 1);
    return m;
  };
  const toFacets = (m: Map<string, number>, order?: string[]) =>
    [...m.entries()]
      .map(([value, n]) => ({ value, count: n }))
      .sort((a, b) =>
        order ? order.indexOf(a.value) - order.indexOf(b.value) : a.value.localeCompare(b.value),
      );
  return {
    materials: toFacets(count(products.flatMap((p) => p.materials))),
    colours: toFacets(count(products.flatMap((p) => p.colours))),
    sizes: toFacets(count(products.map((p) => p.size)), SIZE_ORDER),
  };
}

/** AND across facet groups, OR within a group. An empty group doesn't filter. */
export function applyFilters<T extends Filterable>(products: T[], f: FilterState): T[] {
  return products.filter(
    (p) =>
      (!f.materials.length || p.materials.some((m) => f.materials.includes(m))) &&
      (!f.colours.length || p.colours.some((c) => f.colours.includes(c))) &&
      (!f.sizes.length || f.sizes.includes(p.size)),
  );
}

/** Returns a new sorted array. "featured" keeps featured pieces first, then the original order. */
export function sortProducts<T extends Filterable>(products: T[], sort: SortKey): T[] {
  const list = [...products];
  switch (sort) {
    case "newest":
      return list.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));
    case "name-asc":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return list.sort((a, b) => b.name.localeCompare(a.name));
    case "featured":
    default:
      return list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  }
}

export const activeFilterCount = (f: FilterState) =>
  f.materials.length + f.colours.length + f.sizes.length;

// ─── URL (de)serialisation: ?material=a,b&colour=c&size=small&sort=newest ────
const list = (v: string | null) => (v ? v.split(",").map(decodeURIComponent).filter(Boolean) : []);

export function parseFilterParams(params: URLSearchParams): {
  filters: FilterState;
  sort: SortKey;
} {
  const sort = params.get("sort") as SortKey | null;
  return {
    filters: {
      materials: list(params.get("material")),
      colours: list(params.get("colour")),
      sizes: list(params.get("size")).filter((s): s is SizeBucket =>
        (SIZE_ORDER as string[]).includes(s),
      ),
    },
    sort: sort && SORT_KEYS.includes(sort) ? sort : "featured",
  };
}

/** Writes filter state into a copy of `base`, keeping unrelated params (e.g. ?palette=). */
export function toFilterParams(
  base: URLSearchParams,
  filters: FilterState,
  sort: SortKey,
): URLSearchParams {
  const p = new URLSearchParams(base);
  const set = (key: string, values: string[]) =>
    values.length ? p.set(key, values.map(encodeURIComponent).join(",")) : p.delete(key);
  set("material", filters.materials);
  set("colour", filters.colours);
  set("size", filters.sizes);
  if (sort === "featured") p.delete("sort");
  else p.set("sort", sort);
  return p;
}
