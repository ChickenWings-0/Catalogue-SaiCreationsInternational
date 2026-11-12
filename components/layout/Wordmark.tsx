import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  /** Full name, e.g. "SAI CREATIONS INTERNATIONAL". Split at the last space for the mobile lockup. */
  text: string;
  href?: string;
  /** Accessible name for the link, e.g. "SAI Creations International, home". */
  label: string;
  className?: string;
};

/**
 * Centered text wordmark (DESIGN_SYSTEM §1.3).
 * One line from 640px; below that, a two-line lockup with both lines at equal optical width.
 * Real text, not an image. It's never the page's H1.
 */
export function Wordmark({ text, href = "/", label, className }: Props) {
  const i = text.lastIndexOf(" ");
  const first = i > 0 ? text.slice(0, i) : text;
  const second = i > 0 ? text.slice(i + 1) : "";

  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "flex flex-col items-center font-display leading-none font-normal whitespace-nowrap text-ink uppercase sm:block",
        className,
      )}
    >
      {/* Trailing tracking is cancelled with a negative right margin so each line centres optically.
          From 640px both spans sit inline, separated by a real (tracked) word space. */}
      <span className="-mr-[0.2em] text-[17px] tracking-[0.2em] sm:mr-0 sm:text-[18px] sm:tracking-[0.24em] lg:text-[22px] lg:tracking-[0.28em]">
        {first}
        {second && <span className="hidden sm:inline"> </span>}
      </span>
      {second && (
        <span className="mt-1.5 -mr-[0.56em] text-[11px] tracking-[0.56em] sm:mt-0 sm:-mr-[0.24em] sm:text-[18px] sm:tracking-[0.24em] lg:-mr-[0.28em] lg:text-[22px] lg:tracking-[0.28em]">
          {second}
        </span>
      )}
    </Link>
  );
}
