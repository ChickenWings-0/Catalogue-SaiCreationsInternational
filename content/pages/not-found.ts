import type { NotFoundPageInput } from "@/lib/schemas";

export const notFoundPage: NotFoundPageInput = {
  eyebrow: "Page not found",
  title: "We couldn't find that page",
  body: "The page you're looking for may have moved or no longer exists. Try the catalogue, or head back to the home page.",
  links: [
    { label: "Back to home", href: "/" },
    { label: "Explore the catalogue", href: "/catalogue/" },
  ],
};
