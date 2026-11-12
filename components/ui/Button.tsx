import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn, isExternalHref } from "@/lib/utils";

const VARIANTS = {
  primary: "bg-ink text-white hover:bg-accent-hover",
  secondary: "border border-ink text-ink hover:bg-ink hover:text-white",
  accent: "bg-accent text-white hover:bg-accent-hover",
  ghost: "text-ink underline decoration-1 underline-offset-[6px] hover:text-accent px-0",
} as const;

const SIZES = {
  md: "min-h-12 px-7",
  lg: "min-h-14 px-9",
} as const;

type Common = {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  className?: string;
  children: ReactNode;
};

type AsLink = Common & {
  href: string;
  /** Visually hidden hint for links that open in a new tab (from site.ui strings). */
  newTabHint?: string;
};
type AsButton = Common & { href?: undefined } & ComponentPropsWithoutRef<"button">;

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: Pick<Common, "variant" | "size" | "className">) {
  return cn(
    "inline-flex items-center justify-center gap-3 eyebrow font-medium tracking-[0.18em]",
    "transition-colors duration-400 ease-soft",
    "disabled:cursor-not-allowed disabled:opacity-40",
    SIZES[size],
    VARIANTS[variant],
    className,
  );
}

export function Button(props: AsLink | AsButton) {
  const { variant, size, icon, iconPosition = "start", className, children } = props;
  const classes = buttonClasses({ variant, size, className });
  const content = (
    <>
      {icon && iconPosition === "start" && <span aria-hidden="true">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "end" && <span aria-hidden="true">{icon}</span>}
    </>
  );

  if (props.href !== undefined) {
    const { href, newTabHint } = props;
    if (isExternalHref(href)) {
      const newTab = /^https?:|^\/\//.test(href);
      return (
        <a
          href={href}
          className={classes}
          {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {content}
          {newTab && newTabHint && <span className="sr-only"> ({newTabHint})</span>}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    icon: _i,
    iconPosition: _p,
    className: _c,
    children: _ch,
    type = "button",
    ...rest
  } = props;
  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  );
}
