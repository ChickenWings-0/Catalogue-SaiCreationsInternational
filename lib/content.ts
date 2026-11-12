import { z } from "zod";
import * as S from "./schemas";
import type {
  AboutPage,
  CataloguePage,
  Category,
  CategorySlug,
  ContactPage,
  FAQ,
  HomePage,
  Navigation,
  NavItem,
  NotFoundPage,
  Product,
  SiteConfig,
  StudioPage,
} from "./schemas";
import { resolveImage } from "./images";

import { site } from "@/content/site";
import { navigation } from "@/content/navigation";
import { categories } from "@/content/categories";
import { faqs } from "@/content/faqs";
import { homeDecorProducts } from "@/content/products/home-decor";
import { outdoorDecorProducts } from "@/content/products/outdoor-decor";
import { wallDecorProducts } from "@/content/products/wall-decor";
import { seasonalDecorProducts } from "@/content/products/seasonal-decor";
import { homePage } from "@/content/pages/home";
import { cataloguePage } from "@/content/pages/catalogue";
import { aboutPage } from "@/content/pages/about";
import { contactPage } from "@/content/pages/contact";
import { studioPage } from "@/content/pages/studio";
import { notFoundPage } from "@/content/pages/not-found";

/*
 * CONTENT LAYER: the only way pages and components read content (docs/CONTENT_MODEL.md §3).
 *
 * Every getter is async so that a CMS (Phase 7) can replace the data source here
 * without touching components. Content is validated with Zod and images are resolved
 * against the build-time image manifest. Invalid content fails the build with a message
 * that names the file and field.
 *
 * Server-only (runs at build time).
 */

// ─── Helpers ─────────────────────────────────────────────────────────────────
const isProd = process.env.NODE_ENV === "production";

/** Memoise in production builds; re-evaluate in dev so content edits show up immediately. */
function once<T>(fn: () => T): () => T {
  let value: T | undefined;
  let done = false;
  return () => {
    if (!isProd) return fn();
    if (!done) {
      value = fn();
      done = true;
    }
    return value as T;
  };
}

function parse<T extends z.ZodType>(schema: T, data: unknown, where: string): z.output<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid content in ${where}:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

/** Deep-walks a value and replaces every image input ({ src, alt }) with a resolved ImageAsset. */
function resolveImages<T>(value: T, where: string): T {
  if (Array.isArray(value)) return value.map((v) => resolveImages(v, where)) as T;
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj.src === "string" && typeof obj.alt === "string") {
      return resolveImage(obj as S.ImageInput, where) as T;
    }
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, resolveImages(v, where)]),
    ) as T;
  }
  return value;
}

function load<T extends z.ZodType>(schema: T, data: unknown, where: string) {
  return resolveImages(parse(schema, data, where), where);
}

/** Canonical site origin, without trailing slash. Read at build time. */
export function getSiteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
    process.env.CF_PAGES_URL ||
    "http://localhost:3000";
  return fromEnv.replace(/\/+$/, "");
}

export const categoryHref = (slug: string) => `/catalogue/${slug}/`;
export const productHref = (category: string, slug: string) => `/catalogue/${category}/${slug}/`;

// ─── Site & navigation ───────────────────────────────────────────────────────
const loadSite = once(() => ({
  ...(load(S.siteConfigSchema, site, "content/site.ts") as Omit<SiteConfig, "url">),
  url: getSiteUrl(),
}));

export async function getSiteConfig(): Promise<SiteConfig> {
  return loadSite();
}

const loadNavigation = once(() => {
  const nav = parse(S.navigationInputSchema, navigation, "content/navigation.ts");
  const categoryLinks: NavItem[] = loadCategories().map((c) => ({
    label: c.name,
    href: categoryHref(c.slug),
  }));
  const expand = (items: typeof nav.sidebarMain): NavItem[] =>
    items.map(({ children, ...item }) => ({
      ...item,
      ...(children === "categories" ? { children: categoryLinks } : children ? { children } : {}),
    }));
  return {
    sidebarMain: expand(nav.sidebarMain),
    sidebarBottom: expand(nav.sidebarBottom),
    footer: {
      ...nav.footer,
      columns: nav.footer.columns.map((col) => ({ ...col, links: expand(col.links) })),
    },
  } satisfies Navigation;
});

export async function getNavigation(): Promise<Navigation> {
  return loadNavigation();
}

// ─── Categories ──────────────────────────────────────────────────────────────
const loadCategories = once(() => {
  const list = categories.map(
    (c, i) => load(S.categorySchema, c, `content/categories.ts [${i}]`) as Category,
  );
  const slugs = new Set<string>();
  for (const c of list) {
    if (slugs.has(c.slug)) throw new Error(`content/categories.ts: duplicate slug "${c.slug}".`);
    slugs.add(c.slug);
  }
  return list.sort((a, b) => a.order - b.order);
});

export async function getCategories(): Promise<Category[]> {
  return loadCategories();
}

export async function getCategory(slug: string): Promise<Category | null> {
  return loadCategories().find((c) => c.slug === slug) ?? null;
}

// ─── Products ────────────────────────────────────────────────────────────────
const PRODUCT_SOURCES: Record<CategorySlug, { file: string; items: unknown[] }> = {
  "home-decor": { file: "content/products/home-decor.ts", items: homeDecorProducts },
  "outdoor-decor": { file: "content/products/outdoor-decor.ts", items: outdoorDecorProducts },
  "wall-decor": { file: "content/products/wall-decor.ts", items: wallDecorProducts },
  "seasonal-decor": { file: "content/products/seasonal-decor.ts", items: seasonalDecorProducts },
};

const loadProducts = once(() => {
  const cats = loadCategories();
  const codes = new Set<string>();
  const products: Product[] = [];

  for (const category of cats) {
    const { file, items } = PRODUCT_SOURCES[category.slug];
    const slugs = new Set<string>();
    items.forEach((raw, i) => {
      const code = (raw as { code?: string })?.code ?? `#${i}`;
      const where = `${file} → ${code}`;
      const p = load(S.productSchema, raw, where);
      if (p.category !== category.slug) {
        throw new Error(
          `${where}: category "${p.category}" doesn't match file (${category.slug}).`,
        );
      }
      if (!p.code.startsWith(`SCI-${category.codePrefix}-`)) {
        throw new Error(`${where}: code should start with "SCI-${category.codePrefix}-".`);
      }
      if (codes.has(p.code)) throw new Error(`${where}: duplicate product code.`);
      if (slugs.has(p.slug)) throw new Error(`${where}: duplicate slug "${p.slug}" in category.`);
      codes.add(p.code);
      slugs.add(p.slug);
      products.push({
        ...(p as Omit<Product, "id" | "href">),
        id: p.code,
        href: productHref(p.category, p.slug),
      });
    });
  }
  return products;
});

export async function getAllProducts(): Promise<Product[]> {
  return loadProducts();
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  return loadProducts().filter((p) => p.category === slug);
}

export async function getProduct(category: string, slug: string): Promise<Product | null> {
  return loadProducts().find((p) => p.category === category && p.slug === slug) ?? null;
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  return loadProducts()
    .filter((p) => p.featured)
    .slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  return loadProducts()
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

export async function getProductStaticParams(): Promise<{ category: string; slug: string }[]> {
  return loadProducts().map((p) => ({ category: p.category, slug: p.slug }));
}

// ─── FAQs ────────────────────────────────────────────────────────────────────
const loadFaqs = once(() => {
  const list = faqs.map((f, i) => parse(S.faqSchema, f, `content/faqs.ts [${i}]`));
  const ids = new Set<string>();
  for (const f of list) {
    if (ids.has(f.id)) throw new Error(`content/faqs.ts: duplicate id "${f.id}".`);
    ids.add(f.id);
  }
  return list.sort((a, b) => a.order - b.order);
});

export async function getFaqs(opts: { footerOnly?: boolean } = {}): Promise<FAQ[]> {
  const list = loadFaqs();
  return opts.footerOnly ? list.filter((f) => f.showInFooter) : list;
}

// ─── Pages ───────────────────────────────────────────────────────────────────
const loadHome = once(() => load(S.homePageSchema, homePage, "content/pages/home.ts") as HomePage);
const loadCatalogue = once(() =>
  parse(S.cataloguePageSchema, cataloguePage, "content/pages/catalogue.ts"),
);
const loadAbout = once(
  () => load(S.aboutPageSchema, aboutPage, "content/pages/about.ts") as AboutPage,
);
const loadContact = once(() => parse(S.contactPageSchema, contactPage, "content/pages/contact.ts"));
const loadStudio = once(
  () => load(S.studioPageSchema, studioPage, "content/pages/studio.ts") as StudioPage,
);
const loadNotFound = once(() =>
  parse(S.notFoundPageSchema, notFoundPage, "content/pages/not-found.ts"),
);

export const getHomePage = async (): Promise<HomePage> => loadHome();
export const getCataloguePage = async (): Promise<CataloguePage> => loadCatalogue();
export const getAboutPage = async (): Promise<AboutPage> => loadAbout();
export const getContactPage = async (): Promise<ContactPage> => loadContact();
export const getStudioPage = async (): Promise<StudioPage> => loadStudio();
export const getNotFoundPage = async (): Promise<NotFoundPage> => loadNotFound();
