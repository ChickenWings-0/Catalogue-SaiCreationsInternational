import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { getNotFoundPage } from "@/lib/content";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default async function NotFound() {
  const page = await getNotFoundPage();
  return (
    <Section className="flex min-h-[60svh] items-center">
      <div className="mx-auto max-w-2xl space-y-6 text-center">
        <p className="eyebrow text-muted">{page.eyebrow}</p>
        <h1 className="font-display text-display-lg font-light">{page.title}</h1>
        <p className="text-body-lg font-light text-ink-soft">{page.body}</p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          {page.links.map((link, i) => (
            <Button key={link.href} href={link.href} variant={i === 0 ? "primary" : "secondary"}>
              {link.label}
            </Button>
          ))}
        </div>
      </div>
    </Section>
  );
}
