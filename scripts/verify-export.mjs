#!/usr/bin/env node
/**
 * Sanity check for the static export: every local URL referenced from HTML in /out
 * (href, src, srcset) must resolve to a file in /out. Catches broken image variants
 * and links before deploying. Run after `npm run build`.
 */
import fs from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(import.meta.dirname, "..", "out");

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])),
  );
  return files.flat();
}

const exists = async (p) => {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
};

/** Resolve a site URL to the file a static host would serve (trailingSlash: true). */
function candidates(urlPath) {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  const local = path.join(OUT, ...clean.split("/"));
  return clean.endsWith("/")
    ? [path.join(local, "index.html")]
    : [local, path.join(local, "index.html")];
}

const htmlFiles = (await walk(OUT)).filter((f) => f.endsWith(".html"));
const urls = new Map(); // url → first page referencing it
for (const file of htmlFiles) {
  const html = await fs.readFile(file, "utf8");
  const page = "/" + path.relative(OUT, file).split(path.sep).join("/");
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g))
    urls.set(m[1], urls.get(m[1]) ?? page);
  for (const m of html.matchAll(/\ssrcSet="([^"]+)"/gi)) {
    for (const part of m[1].split(",")) {
      const u = part.trim().split(/\s+/)[0];
      if (u) urls.set(u, urls.get(u) ?? page);
    }
  }
}

const missing = [];
for (const [url, page] of urls) {
  if (!url.startsWith("/") || url.startsWith("//")) continue; // external, anchors, mailto, etc.
  const found = await Promise.all(candidates(url).map(exists));
  if (!found.some(Boolean)) missing.push(`${url}  (referenced from ${page})`);
}

const local = [...urls.keys()].filter((u) => u.startsWith("/") && !u.startsWith("//")).length;
if (missing.length) {
  console.error(`[verify-export] ${missing.length} broken local URLs:\n  ${missing.join("\n  ")}`);
  process.exit(1);
}
console.log(`[verify-export] ${htmlFiles.length} HTML files · ${local} local URLs · all resolve`);
