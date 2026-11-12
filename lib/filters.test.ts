// Run with: npm test   (Node's built-in test runner; TypeScript is type-stripped by Node)
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  applyFilters,
  EMPTY_FILTERS,
  getFilterFacets,
  parseFilterParams,
  sortProducts,
  toFilterParams,
  type Filterable,
} from "./filters.ts";

const P: Filterable[] = [
  {
    id: "1",
    name: "Brass Vase",
    materials: ["Brass"],
    colours: ["Brass"],
    size: "small",
    dateAdded: "2026-01-01",
  },
  {
    id: "2",
    name: "Cotton Throw",
    materials: ["Cotton"],
    colours: ["Ivory", "Indigo"],
    size: "large",
    dateAdded: "2026-03-01",
    featured: true,
  },
  {
    id: "3",
    name: "Jute Pouf",
    materials: ["Jute", "Cotton"],
    colours: ["Natural"],
    size: "medium",
    dateAdded: "2026-02-01",
  },
];

test("no filters returns everything", () => {
  assert.equal(applyFilters(P, EMPTY_FILTERS).length, 3);
});

test("OR within a group", () => {
  const r = applyFilters(P, { ...EMPTY_FILTERS, materials: ["Brass", "Jute"] });
  assert.deepEqual(
    r.map((p) => p.id),
    ["1", "3"],
  );
});

test("AND across groups", () => {
  const r = applyFilters(P, { materials: ["Cotton"], colours: ["Indigo"], sizes: [] });
  assert.deepEqual(
    r.map((p) => p.id),
    ["2"],
  );
  assert.equal(applyFilters(P, { materials: ["Cotton"], colours: [], sizes: ["small"] }).length, 0);
});

test("facets count values and order sizes by size", () => {
  const f = getFilterFacets(P);
  assert.deepEqual(f.materials, [
    { value: "Brass", count: 1 },
    { value: "Cotton", count: 2 },
    { value: "Jute", count: 1 },
  ]);
  assert.deepEqual(
    f.sizes.map((s) => s.value),
    ["small", "medium", "large"],
  );
});

test("sorting", () => {
  assert.deepEqual(
    sortProducts(P, "newest").map((p) => p.id),
    ["2", "3", "1"],
  );
  assert.deepEqual(
    sortProducts(P, "name-asc").map((p) => p.id),
    ["1", "2", "3"],
  );
  assert.deepEqual(
    sortProducts(P, "name-desc").map((p) => p.id),
    ["3", "2", "1"],
  );
  assert.equal(sortProducts(P, "featured")[0]?.id, "2");
  assert.deepEqual(
    P.map((p) => p.id),
    ["1", "2", "3"],
    "input is not mutated",
  );
});

test("URL params round-trip and keep unrelated params", () => {
  const base = new URLSearchParams("palette=marigold");
  const params = toFilterParams(
    base,
    { materials: ["Mango Wood", "Cotton"], colours: [], sizes: ["large"] },
    "newest",
  );
  assert.equal(params.get("palette"), "marigold");
  const back = parseFilterParams(params);
  assert.deepEqual(back.filters, {
    materials: ["Mango Wood", "Cotton"],
    colours: [],
    sizes: ["large"],
  });
  assert.equal(back.sort, "newest");
});

test("invalid params are ignored", () => {
  const r = parseFilterParams(new URLSearchParams("size=huge,small&sort=price"));
  assert.deepEqual(r.filters.sizes, ["small"]);
  assert.equal(r.sort, "featured");
});
