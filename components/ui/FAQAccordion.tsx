import { ChevronDown } from "lucide-react";
import type { FAQ } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Props = {
  items: FAQ[];
  /** Shared `name` makes the <details> group exclusive: one item open at a time. */
  name: string;
  size?: "sm" | "md";
  className?: string;
};

/**
 * Native <details>/<summary> accordion: zero JS, keyboard accessible, and the content is in the HTML.
 * Height animates where the browser supports ::details-content (see globals.css).
 */
export function FAQAccordion({ items, name, size = "md", className }: Props) {
  return (
    <div className={cn("divide-y divide-hairline border-y border-hairline", className)}>
      {items.map((faq) => (
        <details key={faq.id} name={name} id={`faq-${faq.id}`} className="faq-item group">
          <summary
            className={cn(
              "flex cursor-pointer items-start justify-between gap-6 text-ink transition-colors duration-200 hover:text-accent",
              size === "sm" ? "py-4 text-body-sm" : "py-5 text-body-lg",
            )}
          >
            <span>{faq.question}</span>
            <ChevronDown
              className="mt-1 size-4 shrink-0 transition-transform duration-400 ease-soft group-open:rotate-180"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </summary>
          <div
            className={cn(
              "max-w-prose space-y-3 pr-10 text-muted",
              size === "sm" ? "pb-5 text-body-sm" : "pb-6 text-body",
            )}
          >
            {faq.answer.split(/\n{2,}/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
