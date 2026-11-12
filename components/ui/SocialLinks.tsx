import type { IconType } from "react-icons";
import { FaInstagram, FaLinkedinIn, FaPinterestP, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import type { SocialLink, SocialPlatform } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const ICONS: Record<SocialPlatform, IconType> = {
  instagram: FaInstagram,
  x: FaXTwitter,
  linkedin: FaLinkedinIn,
  pinterest: FaPinterestP,
  whatsapp: FaWhatsapp,
};

type Props = {
  links: SocialLink[];
  /** e.g. "opens in a new tab", appended to each accessible label. */
  newTabHint: string;
  showLabels?: boolean;
  className?: string;
};

/** Social profile links (URLs from content/site.ts). Icons only by default, with accessible labels. */
export function SocialLinks({ links, newTabHint, showLabels = false, className }: Props) {
  return (
    <ul className={cn(showLabels ? "space-y-3" : "-ml-2.5 flex flex-wrap gap-1", className)}>
      {links.map((link) => {
        const Icon = ICONS[link.platform];
        return (
          <li key={link.platform}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={showLabels ? undefined : `${link.label} (${newTabHint})`}
              className={cn(
                "text-ink transition-colors duration-200 hover:text-accent",
                showLabels
                  ? "inline-flex items-center gap-3 text-body-sm"
                  : "inline-flex size-11 items-center justify-center",
              )}
            >
              <Icon className="size-[18px]" aria-hidden="true" />
              {showLabels && (
                <>
                  <span className="link-grow">{link.label}</span>
                  <span className="sr-only"> ({newTabHint})</span>
                </>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
