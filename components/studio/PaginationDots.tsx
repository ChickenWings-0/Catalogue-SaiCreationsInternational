"use client";

import type { KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

type Props = {
  count: number;
  selectedIndex: number;
  onSelect: (i: number) => void;
  /** e.g. (i, total) => "Go to slide 3 of 8" */
  label: (i: number, total: number) => string;
  groupLabel: string;
  onKeyDown?: (e: KeyboardEvent) => void;
  className?: string;
};

/**
 * One dot per slide. Inactive: 8px circle. Active: 28px pill in the accent colour, with a smooth
 * width transition. Each dot is a button with a 24px minimum hit area (WCAG 2.5.8).
 */
export function PaginationDots({
  count,
  selectedIndex,
  onSelect,
  label,
  groupLabel,
  onKeyDown,
  className,
}: Props) {
  return (
    <div role="group" aria-label={groupLabel} className={cn("flex items-center", className)}>
      {Array.from({ length: count }, (_, i) => {
        const active = i === selectedIndex;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            onKeyDown={onKeyDown}
            aria-label={label(i, count)}
            aria-current={active ? "true" : undefined}
            className="group inline-flex h-6 min-w-6 items-center justify-center px-1"
          >
            <span
              className={cn(
                "block h-2 rounded-full transition-[width,background-color] duration-400 ease-soft",
                active ? "w-7 bg-accent-dot" : "w-2 bg-stone group-hover:bg-ink-soft",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
