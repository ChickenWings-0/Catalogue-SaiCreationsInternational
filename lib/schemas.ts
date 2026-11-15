import { z } from "zod";

/* Content schemas: the single source of truth for content types (docs/CONTENT_MODEL.md).
   Content files in /content are validated with these at build time (see lib/content.ts),
   so invalid content fails the build with a readable message.

   Client components must only `import type` from this file. */

// ─── Shared ──────────────────────────────────────────────────────────────────
const text = z.string().trim().min(1);
const href = z.string().trim().min(1);
const focalPoint = z.object({ x: z.number().min(0).max(1), y: z.number().min(0).max(1) });

export const CATEGORY_SLUGS = [
  "home-decor",
  "outdoor-decor",
  "wall-decor",
  "seasonal-decor",
] as const;
export const categorySlugSchema = z.enum(CATEGORY_SLUGS);

export const imageInputSchema = z
  .object({
    /** Path relative to /assets/images ("placeholders/products/sci-hd-001-a.jpg"), "brand/…", or an absolute URL. */
    src: z.string().min(1),
    alt: z.string(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    decorative: z.boolean().optional(),
    focalPoint: focalPoint.optional(),
    credit: z.string().optional(),
  })
  .refine((img) => img.decorative || img.alt.trim().length > 0, {
    message: "Images need alt text (or decorative: true).",
    path: ["alt"],
  });

const videoSchema = z.object({
  src: text,
  srcWebm: text.optional(),
  srcMobile: text.optional(),
  poster: imageInputSchema,
  captionsSrc: text.optional(),
});

const seoSchema = z
  .object({
    title: text.optional(),
    description: z.string().max(170).optional(),
    ogImage: imageInputSchema.optional(),
    noIndex: z.boolean().optional(),
  })
  .optional();

export const linkSchema = z.object({ label: text, href });
const ctaSchema = z.object({
  label: text,
  href,
  variant: z.enum(["primary", "secondary", "ghost"]).optional(),
});

// ─── Category ────────────────────────────────────────────────────────────────
export const categorySchema = z.object({
  slug: categorySlugSchema,
  name: text,
  codePrefix: z.enum(["HD", "OD", "WD", "SD"]),
  tagline: text,
  intro: text,
  tileImage: imageInputSchema,
  heroImage: imageInputSchema.optional(),
  order: z.number().int(),
  seo: seoSchema,
});

// ─── Product ─────────────────────────────────────────────────────────────────
/*
 * Visual-only catalogue: the client doesn't want names, dimensions or specifications published
 * (to protect their designs). A product is a photo with a reference code that visitors quote
 * on WhatsApp. The slug is derived from the code (sci-hd-001).
 */
export const productSchema = z.object({
  code: z.string().regex(/^SCI-(HD|OD|WD|SD)-\d{3}$/, 'Codes look like "SCI-HD-001".'),
  category: categorySlugSchema,
  /** First image is the main photo (also the WhatsApp link preview). Alt text is required. */
  images: z.array(imageInputSchema).min(1),
  /** Shown in the Home "featured" section. */
  featured: z.boolean().optional(),
});

// ─── FAQ ─────────────────────────────────────────────────────────────────────
export const faqSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  question: text,
  answer: text,
  order: z.number().int(),
  showInFooter: z.boolean(),
});

// ─── Site config ─────────────────────────────────────────────────────────────
export const SOCIAL_PLATFORMS = ["instagram", "x", "linkedin", "pinterest", "whatsapp"] as const;

export const siteConfigSchema = z.object({
  name: text,
  legalName: text,
  tagline: text,
  logo: imageInputSchema,
  contact: z.object({
    email: z.email(),
    phones: z.array(z.object({ label: text, number: text })),
    whatsappNumber: z
      .string()
      .regex(/^\d{8,15}$/, "WhatsApp number: digits only, with country code."),
    address: z.object({
      lines: z.array(text).min(1),
      city: text,
      region: text,
      postalCode: text,
      country: text,
    }),
    hours: text.optional(),
    mapUrl: href,
    mapImage: imageInputSchema,
  }),
  socials: z.array(
    z.object({
      platform: z.enum(SOCIAL_PLATFORMS),
      label: text,
      url: href,
      handle: text.optional(),
    }),
  ),
  googleFormUrl: href,
  header: z.object({ contactHref: href }),
  analytics: z.object({ cloudflareBeaconToken: text.optional() }),
  enquiry: z.object({ whatsappTemplate: text, instagramNote: text }),
  features: z.object({
    headerShrink: z.boolean(),
    headerSearch: z.boolean(),
    heroSlideshow: z.boolean(),
    /** TEMPORARY: floating colour-palette switcher for client review. */
    showPaletteSwitcher: z.boolean(),
  }),
  seo: z.object({
    defaultTitle: text,
    titleTemplate: text.includes("%s"),
    description: text.max(170),
    ogImage: imageInputSchema,
  }),
  /** Interface microcopy (accessible labels etc.), kept here so it's editable too. */
  ui: z.object({
    skipToContent: text,
    openMenu: text,
    closeMenu: text,
    menuTitle: text,
    mainNavLabel: text,
    secondaryNavLabel: text,
    search: text,
    searchComingSoon: text,
    contact: text,
    homeLinkLabel: text,
    opensInNewTab: text,
    breadcrumbLabel: text,
    breadcrumbHome: text,
    copyright: text.includes("{year}"),
    footerNavLabel: text,
  }),
});

// ─── Navigation ──────────────────────────────────────────────────────────────
type NavItemShape = { label: string; href: string; children?: NavItemShape[] };
export const navItemSchema: z.ZodType<NavItemShape> = z.lazy(() =>
  z.object({ label: text, href, children: z.array(navItemSchema).optional() }),
);
/** In navigation.ts, `children: "categories"` expands to one link per category. */
const navItemInputSchema = z.object({
  label: text,
  href,
  children: z.union([z.literal("categories"), z.array(navItemSchema)]).optional(),
});

export const navigationInputSchema = z.object({
  sidebarMain: z.array(navItemInputSchema),
  sidebarBottom: z.array(navItemInputSchema),
  footer: z.object({
    columns: z.array(z.object({ heading: text, links: z.array(navItemInputSchema) })),
    socialsHeading: text,
    faqHeading: text,
    faqViewAll: linkSchema,
  }),
});

// ─── Pages ───────────────────────────────────────────────────────────────────
const heroSlideSchema = z.object({
  image: imageInputSchema,
  eyebrow: text.optional(),
  heading: text,
  subheading: text.optional(),
  cta: ctaSchema.optional(),
});

export const homeSectionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("hero"), slides: z.array(heroSlideSchema).min(1) }),
  z.object({ type: z.literal("categoryTiles"), heading: text, intro: text.optional() }),
  z.object({
    type: z.literal("featuredProducts"),
    heading: text,
    limit: z.number().int().positive(),
    cta: ctaSchema.optional(),
  }),
  z.object({
    type: z.literal("studioTeaser"),
    eyebrow: text.optional(),
    heading: text,
    body: text,
    media: imageInputSchema,
    cta: ctaSchema,
  }),
  z.object({
    type: z.literal("aboutTeaser"),
    eyebrow: text.optional(),
    heading: text,
    body: text,
    image: imageInputSchema,
    cta: ctaSchema,
  }),
]);

export const homePageSchema = z.object({
  seo: seoSchema,
  /** Render order = array order. Pending client confirmation of the section list. */
  sections: z.array(homeSectionSchema),
});

export const cataloguePageSchema = z.object({
  title: text,
  intro: text,
  categoriesHeading: text,
  allProductsHeading: text,
  seo: seoSchema,
});

export const aboutPageSchema = z.object({
  title: text,
  intro: text.optional(),
  sections: z.array(
    z.object({
      id: z.enum(["the-initiative", "the-present"]),
      eyebrow: text.optional(),
      heading: text,
      body: z.array(text).min(1),
      images: z.array(imageInputSchema),
      pullQuote: text.optional(),
    }),
  ),
  faqHeading: text,
  seo: seoSchema,
});

export const contactPageSchema = z.object({
  title: text,
  intro: text,
  formCtaLabel: text,
  formNote: text.optional(),
  mapLinkLabel: text,
  socialsHeading: text,
  seo: seoSchema,
});

export const studioPageSchema = z.object({
  title: text,
  intro: text,
  video: videoSchema,
  carousel: z.object({
    heading: text.optional(),
    /** The Studio shows the company itself (workshop, process, people). Slides are not links. */
    slides: z
      .array(
        z.object({ image: imageInputSchema, title: text.optional(), caption: text.optional() }),
      )
      .min(1),
    autoplay: z.boolean(),
    autoplayDelayMs: z.number().int().min(2000),
  }),
  outro: z.object({ heading: text, body: text, cta: ctaSchema.optional() }).optional(),
  interaction: z
    .object({
      expandDistanceVh: z.number().positive().optional(),
      deadZoneVh: z.number().nonnegative().optional(),
      revealDistanceVh: z.number().positive().optional(),
    })
    .optional(),
  seo: seoSchema,
});

export const notFoundPageSchema = z.object({
  eyebrow: text,
  title: text,
  body: text,
  links: z.array(linkSchema),
});

// ─── Interface labels ───────────────────────────────────────────────────────
export const labelsSchema = z.object({
  catalogue: z.object({
    productCount: text,
    viewCategory: text,
    allProducts: text,
    browse: text,
    comingSoon: text,
  }),
  product: z.object({ code: text, more: text, back: text }),
  enquire: z.object({ heading: text, intro: text, whatsapp: text }),
  lightbox: z.object({
    open: text,
    close: text,
    previous: text,
    next: text,
    position: text,
  }),
  gallery: z.object({ previous: text, next: text, viewImage: text, imageOf: text }),
  carousel: z.object({
    region: text,
    previous: text,
    next: text,
    goTo: text,
    slideOf: text,
    pause: text,
    play: text,
    dots: text,
  }),
  video: z.object({ pause: text, play: text, scrollCue: text }),
});

// ─── Types ───────────────────────────────────────────────────────────────────
export type ImageInput = z.input<typeof imageInputSchema>;
/** An image as components receive it: intrinsic size always known. */
export type ImageAsset = Omit<z.output<typeof imageInputSchema>, "width" | "height"> & {
  width: number;
  height: number;
};

/** Replaces every ImageInput inside T with a resolved ImageAsset. */
type Resolved<T> =
  T extends z.output<typeof imageInputSchema>
    ? ImageAsset
    : T extends (infer U)[]
      ? Resolved<U>[]
      : T extends object
        ? { [K in keyof T]: Resolved<T[K]> }
        : T;

export type CategorySlug = z.infer<typeof categorySlugSchema>;
export type Category = Resolved<z.output<typeof categorySchema>>;
export type ProductInput = z.input<typeof productSchema>;
export type Product = Resolved<z.output<typeof productSchema>> & {
  id: string;
  slug: string;
  href: string;
};
export type FAQ = z.output<typeof faqSchema>;
export type SiteConfigInput = z.input<typeof siteConfigSchema>;
export type SiteConfig = Resolved<z.output<typeof siteConfigSchema>> & { url: string };
export type SocialLink = SiteConfig["socials"][number];
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];
export type NavItem = NavItemShape;
export type NavigationInput = z.input<typeof navigationInputSchema>;
export type Navigation = {
  sidebarMain: NavItem[];
  sidebarBottom: NavItem[];
  footer: {
    columns: { heading: string; links: NavItem[] }[];
    socialsHeading: string;
    faqHeading: string;
    faqViewAll: { label: string; href: string };
  };
};
export type Link = z.output<typeof linkSchema>;
export type Cta = z.output<typeof ctaSchema>;
export type HomeSection = Resolved<z.output<typeof homeSectionSchema>>;
export type HomePage = Resolved<z.output<typeof homePageSchema>>;
export type CataloguePage = z.output<typeof cataloguePageSchema>;
export type AboutPage = Resolved<z.output<typeof aboutPageSchema>>;
export type AboutSection = AboutPage["sections"][number];
export type ContactPage = z.output<typeof contactPageSchema>;
export type StudioPage = Resolved<z.output<typeof studioPageSchema>>;
export type NotFoundPage = z.output<typeof notFoundPageSchema>;
export type Labels = z.output<typeof labelsSchema>;

// Input types used to type the files in /content.
export type CategoryInput = z.input<typeof categorySchema>;
export type FAQInput = z.input<typeof faqSchema>;
export type HomePageInput = z.input<typeof homePageSchema>;
export type CataloguePageInput = z.input<typeof cataloguePageSchema>;
export type AboutPageInput = z.input<typeof aboutPageSchema>;
export type ContactPageInput = z.input<typeof contactPageSchema>;
export type StudioPageInput = z.input<typeof studioPageSchema>;
export type NotFoundPageInput = z.input<typeof notFoundPageSchema>;
export type LabelsInput = z.input<typeof labelsSchema>;
