#!/usr/bin/env node
/**
 * Lists every `TODO(client)` marker in /content (and placeholder image references),
 * so it's easy to see what real content is still missing. See docs/CONTENT_TODO.md.
 */
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIRS = ["content"];

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])),
  );
  return out.flat().filter((f) => /\.(ts|tsx|json|md)$/.test(f));
}

let todos = 0;
let images = 0;
for (const d of DIRS) {
  for (const file of await walk(path.join(ROOT, d))) {
    const lines = (await fs.readFile(file, "utf8")).split(/\r?\n/);
    const rel = path.relative(ROOT, file).split(path.sep).join("/");
    const hits = [];
    lines.forEach((line, i) => {
      const m = line.match(/TODO\(client\):?\s*(.*)$/);
      if (m) {
        todos++;
        hits.push(`  ${String(i + 1).padStart(4)}  ${m[1] || "(no note)"}`);
      }
      images += (line.match(/["']placeholders\//g) || []).length;
    });
    if (hits.length) console.log(`\n${rel}\n${hits.join("\n")}`);
  }
}
console.log(`\n${todos} TODO(client) markers · ${images} placeholder image references remaining`);
