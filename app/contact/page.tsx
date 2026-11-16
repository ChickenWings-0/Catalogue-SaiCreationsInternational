import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getContactPage, getSiteConfig } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage();
  return { title: page.seo?.title ?? page.title, description: page.seo?.description };
}

function Card({
  icon,
  heading,
  children,
}: {
  icon: ReactNode;
  heading: string;
  children: ReactNode;
}) {
  return (
    <div data-reveal className="flex flex-col border border-hairline bg-white p-7 sm:p-9">
      <div className="flex items-center gap-3 text-accent">
        {icon}
        <h2 className="eyebrow text-ink">{heading}</h2>
      </div>
      <div className="mt-6 flex flex-1 flex-col gap-6">{children}</div>
    </div>
  );
}

export default async function ContactPage() {
  const [page, site] = await Promise.all([getContactPage(), getSiteConfig()]);
  const { contact } = site;
  const instagram = site.socials.find((s) => s.platform === "instagram");
  const whatsappUrl = `https://wa.me/${contact.whatsappNumber}`;
  const phone = contact.phones[0];

  return (
    <>
      <Container className="pt-16 pb-12 text-center lg:pt-24 lg:pb-16">
        <h1 className="font-display text-display-xl font-light text-ink">{page.title}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-body-lg font-light text-ink-soft">{page.intro}</p>
      </Container>

      <Container className="pb-[clamp(4rem,10vw,8rem)]">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          <Card
            icon={<FaWhatsapp className="size-5" aria-hidden="true" />}
            heading={page.whatsappHeading}
          >
            {phone && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-display-sm text-ink lining-nums transition-colors hover:text-accent"
              >
                {phone.number}
                <span className="sr-only"> ({site.ui.opensInNewTab})</span>
              </a>
            )}
            <Button
              href={whatsappUrl}
              variant="accent"
              icon={<FaWhatsapp className="size-4" />}
              newTabHint={site.ui.opensInNewTab}
              className="mt-auto"
            >
              {page.whatsappCta}
            </Button>
          </Card>

          {instagram && (
            <Card
              icon={<FaInstagram className="size-5" aria-hidden="true" />}
              heading={page.instagramHeading}
            >
              {instagram.handle && (
                <a
                  href={instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-display-sm text-ink transition-colors hover:text-accent"
                >
                  @{instagram.handle}
                  <span className="sr-only"> ({site.ui.opensInNewTab})</span>
                </a>
              )}
              <Button
                href={instagram.url}
                variant="secondary"
                icon={<FaInstagram className="size-4" />}
                newTabHint={site.ui.opensInNewTab}
                className="mt-auto"
              >
                {page.instagramCta}
              </Button>
            </Card>
          )}

          <Card
            icon={<MapPin className="size-5" strokeWidth={1.5} aria-hidden="true" />}
            heading={page.visitHeading}
          >
            <address className="text-body-lg font-light text-ink-soft not-italic">
              {contact.address.lines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
              <span className="block">
                {contact.address.city}, {contact.address.region} {contact.address.postalCode}
              </span>
              <span className="block">{contact.address.country}</span>
            </address>
            {contact.hours && <p className="text-body-sm text-muted">{contact.hours}</p>}
            <Button
              href={contact.mapUrl}
              variant="secondary"
              icon={<MapPin className="size-4" strokeWidth={1.5} />}
              newTabHint={site.ui.opensInNewTab}
              className="mt-auto"
            >
              {page.mapLinkLabel}
            </Button>
          </Card>
        </div>

        {(contact.email || site.googleFormUrl) && (
          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:mt-6 lg:gap-6">
            {contact.email && (
              <Card
                icon={<Mail className="size-5" strokeWidth={1.5} aria-hidden="true" />}
                heading={page.emailHeading}
              >
                <a
                  href={`mailto:${contact.email}`}
                  className="font-display text-display-sm break-all text-ink transition-colors hover:text-accent"
                >
                  {contact.email}
                </a>
              </Card>
            )}
            {site.googleFormUrl && (
              <Card
                icon={<Mail className="size-5" strokeWidth={1.5} aria-hidden="true" />}
                heading={page.formCtaLabel}
              >
                {page.formNote && <p className="text-body-sm text-muted">{page.formNote}</p>}
                <Button
                  href={site.googleFormUrl}
                  variant="secondary"
                  newTabHint={site.ui.opensInNewTab}
                >
                  {page.formCtaLabel}
                </Button>
              </Card>
            )}
          </div>
        )}
      </Container>
    </>
  );
}
