import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Max-width content column with the responsive page gutters (16 / 24 / 40 / 64px). */
export function Container({
  as: Tag = "div",
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-(--container-content) px-4 sm:px-6 lg:px-10 2xl:px-16",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
