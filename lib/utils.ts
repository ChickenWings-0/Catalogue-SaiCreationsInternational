import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge about the custom font-size tokens so `text-ink` (colour)
// and `text-body-sm` (size) are not treated as conflicting classes.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-xl",
            "display-lg",
            "display-md",
            "display-sm",
            "eyebrow",
            "nav",
            "body-lg",
            "body",
            "body-sm",
            "caption",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** True for absolute http(s) URLs, mailto:, tel: and protocol-relative links. */
export function isExternalHref(href: string) {
  return /^(https?:)?\/\//.test(href) || /^(mailto|tel):/.test(href);
}
