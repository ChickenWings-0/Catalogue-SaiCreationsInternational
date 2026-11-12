import type { ReactNode } from "react";
import type { Product } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { ProductCard } from "./ProductCard";

type Props = {
  products: Product[];
  /** 4 columns from 1280px (default) or 3 (inside narrower layouts). */
  maxColumns?: 3 | 4;
  headingLevel?: 2 | 3;
  /** Preload the first N images (above-the-fold grids only). */
  preloadCount?: number;
  emptyState?: ReactNode;
  className?: string;
};

export function ProductGrid({
  products,
  maxColumns = 4,
  headingLevel = 3,
  preloadCount = 0,
  emptyState,
  className,
}: Props) {
  if (!products.length) return <>{emptyState}</>;
  const sizes =
    maxColumns === 4
      ? "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
      : "(min-width: 768px) 33vw, 50vw";
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:grid-cols-3 lg:gap-x-8 lg:gap-y-16",
        maxColumns === 4 && "xl:grid-cols-4",
        className,
      )}
    >
      {products.map((p, i) => (
        <li key={p.id}>
          <ProductCard
            product={p}
            sizes={sizes}
            index={i}
            headingLevel={headingLevel}
            preload={i < preloadCount}
          />
        </li>
      ))}
    </ul>
  );
}
