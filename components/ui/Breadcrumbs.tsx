import Link from "next/link";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

/**
 * Breadcrumb trail. The last item is the current page. BreadcrumbList JSON-LD is added in Phase 5.
 */
export function Breadcrumbs({
  items,
  label,
  className,
}: {
  items: Crumb[];
  label: string;
  className?: string;
}) {
  return (
    <nav aria-label={label} className={cn("text-caption text-muted", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link href={item.href} className="link-grow transition-colors hover:text-ink">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "text-ink" : ""}>
                  {item.label}
                </span>
              )}
              {!last && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
