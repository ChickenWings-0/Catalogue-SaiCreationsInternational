import Link from "next/link";
import type { CSSProperties } from "react";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import type { Product } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Props = {
  product: Pick<Product, "name" | "code" | "href" | "images" | "materials">;
  sizes: string;
  preload?: boolean;
  headingLevel?: 2 | 3;
  /** Position in a grid, used to stagger the reveal animation. */
  index?: number;
  className?: string;
};

/**
 * Product tile: 4:5 image (second image cross-fades in on hover), name, code and material.
 * The whole card is one link. Safe to render from server or client components.
 */
export function ProductCard({
  product,
  sizes,
  preload,
  headingLevel = 3,
  index = 0,
  className,
}: Props) {
  const [first, second] = product.images;
  const Heading = `h${headingLevel}` as const;
  return (
    <article
      data-reveal
      style={{ "--reveal-i": index % 4 } as CSSProperties}
      className={cn("group", className)}
    >
      <Link href={product.href} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-greige">
          {first && (
            <ResponsiveImage
              image={first}
              fill
              sizes={sizes}
              preload={preload}
              imgClassName="transition-transform duration-[1200ms] ease-soft group-hover:scale-[1.03]"
            />
          )}
          {second && (
            <ResponsiveImage
              image={{ ...second, decorative: true }}
              fill
              sizes={sizes}
              imgClassName="opacity-0 transition-opacity duration-700 ease-soft group-hover:opacity-100"
            />
          )}
        </div>
        <div className="mt-4 space-y-1.5 pr-2">
          <Heading className="font-display text-[1.3rem] leading-snug text-ink transition-colors duration-200 group-hover:text-accent">
            {product.name}
          </Heading>
          <p className="text-caption text-muted">
            {product.code}
            {product.materials[0] && <span aria-hidden="true"> · </span>}
            {product.materials.slice(0, 2).join(", ")}
          </p>
        </div>
      </Link>
    </article>
  );
}
