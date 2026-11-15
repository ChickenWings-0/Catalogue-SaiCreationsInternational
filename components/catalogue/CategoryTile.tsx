import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import type { Category } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Props = {
  category: Category;
  href: string;
  /** e.g. "Explore Home Decor" */
  cta: string;
  /** e.g. "8 pieces" */
  meta?: string;
  size?: "standard" | "large";
  sizes: string;
  headingLevel?: 2 | 3;
  index?: number;
  className?: string;
};

/** Editorial category tile: tall image with the name, tagline and an arrow link below. */
export function CategoryTile({
  category,
  href,
  cta,
  meta,
  size = "standard",
  sizes,
  headingLevel = 3,
  index = 0,
  className,
}: Props) {
  const Heading = `h${headingLevel}` as const;
  return (
    <article
      data-reveal
      style={{ "--reveal-i": index } as CSSProperties}
      className={cn("group", className)}
    >
      <Link href={href} className="block">
        <div
          className={cn(
            "relative overflow-hidden bg-linen",
            size === "large" ? "aspect-[4/5]" : "aspect-[3/4]",
          )}
        >
          <ResponsiveImage
            image={category.tileImage}
            fill
            sizes={sizes}
            // Product cut-outs on white: contain + multiply so the white takes the frame colour.
            imgClassName="pointer-events-none select-none object-contain p-[8%] mix-blend-multiply transition-transform duration-[1200ms] ease-soft [-webkit-user-drag:none] group-hover:scale-[1.04]"
          />
        </div>
        <div className="mt-5 space-y-2">
          <div className="flex items-baseline justify-between gap-4">
            <Heading
              className={cn(
                "font-display text-ink transition-colors duration-200 group-hover:text-accent",
                size === "large" ? "text-display-md" : "text-display-sm",
              )}
            >
              {category.name}
            </Heading>
            {meta && <span className="shrink-0 text-caption text-muted">{meta}</span>}
          </div>
          <p className="text-body-sm text-muted">{category.tagline}</p>
          <span className="inline-flex items-center gap-2 pt-1 eyebrow text-ink transition-colors group-hover:text-accent">
            {cta}
            <ArrowRight
              className="size-3.5 transition-transform duration-400 ease-soft group-hover:translate-x-1"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    </article>
  );
}
