import { Mail, Search } from "lucide-react";
import Link from "next/link";
import type { Navigation, SiteConfig } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { Wordmark } from "./Wordmark";

type Props = {
  site: Pick<SiteConfig, "name" | "header" | "features" | "ui">;
  navigation: Pick<Navigation, "sidebarMain" | "sidebarBottom">;
  /**
   * Hook point for a future shrink-on-scroll effect (pending client, off by default).
   * When enabled, a small client observer should toggle `data-scrolled` and CSS does the rest.
   */
  shrinkOnScroll?: boolean;
};

const iconButton =
  "text-ink hover:text-accent inline-flex size-11 items-center justify-center transition-colors duration-200";

export function Header({ site, navigation, shrinkOnScroll = false }: Props) {
  const { ui } = site;
  return (
    <header
      data-shrink={shrinkOnScroll || undefined}
      className="sticky top-0 z-40 border-b border-hairline bg-ivory/95 backdrop-blur-sm"
    >
      <div className="mx-auto grid h-(--header-height) max-w-(--container-content) grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-10 2xl:px-16">
        <div className="flex items-center">
          <Sidebar
            main={navigation.sidebarMain}
            bottom={navigation.sidebarBottom}
            labels={{
              open: ui.openMenu,
              close: ui.closeMenu,
              title: ui.menuTitle,
              mainNav: ui.mainNavLabel,
              secondaryNav: ui.secondaryNavLabel,
            }}
          />
        </div>

        <Wordmark text={site.name} label={ui.homeLinkLabel} />

        <div className="-mr-2.5 flex items-center justify-end">
          {/* To refine later: search is a non-functional placeholder until the client confirms it. */}
          {site.features.headerSearch ? (
            <button type="button" className={iconButton}>
              <Search className="size-5" strokeWidth={1.5} aria-hidden="true" />
              <span className="sr-only">{ui.search}</span>
            </button>
          ) : (
            <button
              type="button"
              aria-disabled="true"
              title={ui.searchComingSoon}
              className={cn(
                iconButton,
                "hidden cursor-default opacity-60 hover:text-ink sm:inline-flex",
              )}
            >
              <Search className="size-5" strokeWidth={1.5} aria-hidden="true" />
              <span className="sr-only">{ui.searchComingSoon}</span>
            </button>
          )}
          {/* To refine later: destination pending client (Contact page for now). */}
          <Link href={site.header.contactHref} className={iconButton}>
            <Mail className="size-5" strokeWidth={1.5} aria-hidden="true" />
            <span className="sr-only">{ui.contact}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
