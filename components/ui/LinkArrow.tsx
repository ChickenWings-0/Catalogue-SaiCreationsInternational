import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Eyebrow-style text link with an arrow that nudges right on hover. */
export function LinkArrow({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 eyebrow text-ink transition-colors duration-200 hover:text-accent",
        className,
      )}
    >
      <span className="link-grow">{children}</span>
      <ArrowRight
        className="size-3.5 transition-transform duration-400 ease-soft group-hover:translate-x-1"
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </Link>
  );
}
