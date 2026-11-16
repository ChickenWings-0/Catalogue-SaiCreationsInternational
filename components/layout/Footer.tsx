import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { fillTemplate } from "@/lib/format";
import type { FAQ, Navigation, NavItem, SiteConfig } from "@/lib/schemas";

type Props = {
  site: Pick<SiteConfig, "name" | "tagline" | "legalName" | "logo" | "contact" | "socials" | "ui">;
  footer: Navigation["footer"];
  faqs: FAQ[];
};

const heading = "eyebrow text-ink mb-5";

function LinkList({ links }: { links: NavItem[] }) {
  return (
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="link-grow text-body-sm text-muted transition-colors duration-200 hover:text-ink"
          >
            {link.label}
          </Link>
          {link.children && link.children.length > 0 && (
            <ul className="mt-3 space-y-3 pl-4">
              {link.children.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    className="link-grow text-body-sm text-muted transition-colors duration-200 hover:text-ink"
                  >
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

export function Footer({ site, footer, faqs }: Props) {
  const { address } = site.contact;
  const addressLine = [
    ...address.lines,
    address.city,
    `${address.region} ${address.postalCode}`,
    address.country,
  ].join(", ");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-greige text-ink">
      <Container className="pt-16 pb-10 lg:pt-24">
        <nav aria-label={site.ui.footerNavLabel}>
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
            {footer.columns.map((col) => (
              <div key={col.heading}>
                <h2 className={heading}>{col.heading}</h2>
                <LinkList links={col.links} />
              </div>
            ))}
            <div>
              <h2 className={heading}>{footer.socialsHeading}</h2>
              <SocialLinks links={site.socials} newTabHint={site.ui.opensInNewTab} />
              <ul className="mt-4 space-y-2 text-body-sm text-muted">
                {site.contact.phones.map((p) => (
                  <li key={p.number}>
                    <a
                      href={`https://wa.me/${site.contact.whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-grow transition-colors hover:text-ink"
                    >
                      {p.label}: {p.number}
                      <span className="sr-only"> ({site.ui.opensInNewTab})</span>
                    </a>
                  </li>
                ))}
                {site.socials
                  .filter((sl) => sl.platform === "instagram" && sl.handle)
                  .map((sl) => (
                    <li key={sl.url}>
                      <a
                        href={sl.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-grow transition-colors hover:text-ink"
                      >
                        @{sl.handle}
                        <span className="sr-only"> ({site.ui.opensInNewTab})</span>
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </nav>

        <section aria-labelledby="footer-faqs" className="mt-16 lg:mt-20">
          <div className="grid gap-6 lg:grid-cols-[1fr_3fr] lg:gap-8">
            <div className="space-y-4">
              <h2 id="footer-faqs" className={heading}>
                {footer.faqHeading}
              </h2>
              <LinkArrow href={footer.faqViewAll.href} className="text-muted">
                {footer.faqViewAll.label}
              </LinkArrow>
            </div>
            <FAQAccordion items={faqs} name="footer-faq" size="sm" />
          </div>
        </section>

        <div className="mt-16 flex flex-col gap-6 border-t border-hairline pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <ResponsiveImage
              image={{ ...site.logo, decorative: true }}
              sizes="56px"
              className="size-12 shrink-0 bg-transparent"
            />
            <div>
              <p className="font-display text-[15px] tracking-[0.22em] text-ink uppercase">
                {site.name}
              </p>
              <p className="mt-1 text-caption text-muted">{site.tagline}</p>
            </div>
          </div>
          <div className="space-y-1 text-caption text-muted md:text-right">
            <p>{fillTemplate(site.ui.copyright, { year })}</p>
            <address className="not-italic">{addressLine}</address>
          </div>
        </div>
      </Container>
    </footer>
  );
}
