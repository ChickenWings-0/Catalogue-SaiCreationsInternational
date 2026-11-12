import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

const TONES = {
  ivory: "bg-ivory",
  white: "bg-white",
  linen: "bg-linen",
  greige: "bg-greige",
} as const;

const SPACING = {
  default: "py-[clamp(4rem,10vw,9rem)]",
  tight: "py-12 md:py-16",
  none: "",
} as const;

type Props = {
  tone?: keyof typeof TONES;
  spacing?: keyof typeof SPACING;
  id?: string;
  labelledBy?: string;
  /** Render children without the Container (full-bleed). */
  bleed?: boolean;
  className?: string;
  children: ReactNode;
};

export function Section({
  tone = "ivory",
  spacing = "default",
  id,
  labelledBy,
  bleed,
  className,
  children,
}: Props) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(TONES[tone], SPACING[spacing], className)}
    >
      {bleed ? children : <Container>{children}</Container>}
    </section>
  );
}
