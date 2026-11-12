import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  heading: string;
  intro?: string;
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  id?: string;
  className?: string;
};

const SIZE = {
  h1: "text-display-lg font-light",
  h2: "text-display-md",
  h3: "text-display-sm",
} as const;

export function SectionHeading({
  eyebrow,
  heading,
  intro,
  as: Tag = "h2",
  align = "left",
  id,
  className,
}: Props) {
  return (
    <div
      className={cn("max-w-3xl space-y-4", align === "center" && "mx-auto text-center", className)}
    >
      {eyebrow && <p className="eyebrow text-muted">{eyebrow}</p>}
      <Tag id={id} className={cn("font-display text-ink", SIZE[Tag])}>
        {heading}
      </Tag>
      {intro && <p className="text-body-lg font-light text-ink-soft">{intro}</p>}
    </div>
  );
}
