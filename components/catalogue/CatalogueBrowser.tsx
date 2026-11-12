"use client";

/*
 * Category product grid with filters (material, colour, size) and sorting.
 * PENDING CLIENT CONFIRMATION: controlled by features.catalogueFilters in content/site.ts.
 * State lives in the URL (?material=…&colour=…&size=…&sort=…), so it is shareable and
 * survives reloads and back/forward. Works in the static export (client-side only).
 */

import { SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { fillTemplate } from "@/lib/format";
import {
  activeFilterCount,
  applyFilters,
  EMPTY_FILTERS,
  parseFilterParams,
  SORT_KEYS,
  sortProducts,
  toFilterParams,
  type FilterFacets,
  type FilterState,
  type SizeBucket,
  type SortKey,
} from "@/lib/filters";
import type { Labels, Product } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { ProductGrid } from "./ProductGrid";

type Props = {
  products: Product[];
  facets: FilterFacets;
  enabled: boolean;
  labels: Labels["filters"];
};

type Group = "materials" | "colours" | "sizes";

export function CatalogueBrowser({ products, facets, enabled, labels }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const { filters, sort } = useMemo(
    () => parseFilterParams(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );
  const shown = useMemo(
    () => (enabled ? sortProducts(applyFilters(products, filters), sort) : products),
    [enabled, products, filters, sort],
  );

  if (!enabled) return <ProductGrid products={products} preloadCount={4} />;

  const update = (next: FilterState, nextSort: SortKey = sort) => {
    const params = toFilterParams(new URLSearchParams(searchParams.toString()), next, nextSort);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const toggle = (group: Group, value: string) => {
    const current = filters[group] as string[];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    update({ ...filters, [group]: next } as FilterState);
  };

  const count = activeFilterCount(filters);
  const sizeLabel = (v: string) => labels.sizes[v as SizeBucket] ?? v;
  const groups: {
    key: Group;
    legend: string;
    facets: FilterFacets[Group];
    label: (v: string) => string;
  }[] = [
    { key: "materials", legend: labels.material, facets: facets.materials, label: (v) => v },
    { key: "colours", legend: labels.colour, facets: facets.colours, label: (v) => v },
    { key: "sizes", legend: labels.size, facets: facets.sizes, label: sizeLabel },
  ];
  const chips = groups.flatMap((g) =>
    (filters[g.key] as string[]).map((value) => ({ group: g.key, value, text: g.label(value) })),
  );

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-hairline py-3">
        <div className="flex items-center gap-5">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((o) => !o)}
            className="inline-flex min-h-11 items-center gap-2.5 eyebrow text-ink transition-colors hover:text-accent"
          >
            <SlidersHorizontal className="size-4" strokeWidth={1.5} aria-hidden="true" />
            {open ? labels.hide : labels.toggle}
            {count > 0 && (
              <span className="inline-flex size-5 items-center justify-center rounded-full bg-accent text-[10px] tracking-normal text-white">
                {count}
              </span>
            )}
          </button>
          <p className="hidden text-caption text-muted sm:block" aria-live="polite">
            {fillTemplate(labels.results, { shown: shown.length, total: products.length })}
          </p>
        </div>
        <label className="flex items-center gap-3 text-caption text-muted">
          <span className="eyebrow">{labels.sort}</span>
          <select
            value={sort}
            onChange={(e) => update(filters, e.target.value as SortKey)}
            className="min-h-11 cursor-pointer border border-hairline bg-transparent px-3 pr-8 text-body-sm text-ink hover:border-stone"
          >
            {SORT_KEYS.map((k) => (
              <option key={k} value={k}>
                {labels.sortOptions[k]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Filter panel */}
      <div id={panelId} hidden={!open} className="border-b border-hairline py-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {groups.map((g) => (
            <fieldset key={g.key}>
              <legend className="mb-4 eyebrow text-ink">{g.legend}</legend>
              <ul className="space-y-2.5">
                {g.facets.map((f) => {
                  const checked = (filters[g.key] as string[]).includes(f.value);
                  return (
                    <li key={f.value}>
                      <label className="flex cursor-pointer items-center gap-3 text-body-sm text-ink-soft hover:text-ink">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggle(g.key, f.value)}
                          className="size-4 cursor-pointer accent-accent"
                        />
                        <span>{g.label(f.value)}</span>
                        <span className="text-caption text-muted">({f.count})</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          ))}
        </div>
        {count > 0 && (
          <button
            type="button"
            onClick={() => update(EMPTY_FILTERS)}
            className="mt-8 link-grow eyebrow text-muted hover:text-ink"
          >
            {labels.clearAll}
          </button>
        )}
      </div>

      {/* Active filter chips */}
      {chips.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {chips.map((c) => (
            <li key={`${c.group}-${c.value}`}>
              <button
                type="button"
                onClick={() => toggle(c.group, c.value)}
                aria-label={fillTemplate(labels.remove, { value: c.text })}
                className="inline-flex min-h-9 items-center gap-2 bg-accent-tint px-3 text-body-sm text-accent transition-colors hover:bg-accent hover:text-white"
              >
                {c.text}
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => update(EMPTY_FILTERS)}
              className="min-h-9 px-2 eyebrow text-muted hover:text-ink"
            >
              {labels.clearAll}
            </button>
          </li>
        </ul>
      )}

      <p className="mt-5 text-caption text-muted sm:hidden" aria-live="polite">
        {fillTemplate(labels.results, { shown: shown.length, total: products.length })}
      </p>

      <ProductGrid
        products={shown}
        preloadCount={4}
        className={cn("mt-10")}
        emptyState={
          <div className="py-24 text-center">
            <p className="font-display text-display-sm text-ink">{labels.empty}</p>
            <button
              type="button"
              onClick={() => update(EMPTY_FILTERS)}
              className="mt-6 link-grow eyebrow text-accent"
            >
              {labels.clearAll}
            </button>
          </div>
        }
      />
    </div>
  );
}
