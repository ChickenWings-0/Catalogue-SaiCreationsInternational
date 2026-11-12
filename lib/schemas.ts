import { z } from "zod";

/* Content schemas: the single source of truth for content types (docs/CONTENT_MODEL.md).
   Content files are parsed with these at build time, so invalid content fails the build. */

// ─── Images ──────────────────────────────────────────────────────────────────
const focalPoint = z.object({ x: z.number().min(0).max(1), y: z.number().min(0).max(1) });

export const imageInputSchema = z
  .object({
    /** Path relative to /assets/images (e.g. "placeholders/products/sci-hd-001-a.jpg"), "brand/…", or an absolute URL. */
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

export type ImageInput = z.infer<typeof imageInputSchema>;
export type ImageAsset = Omit<ImageInput, "width" | "height"> & { width: number; height: number };
