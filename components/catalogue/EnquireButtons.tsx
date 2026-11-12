import { ExternalLink } from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { Button } from "@/components/ui/Button";
import { buildInstagramDmUrl, buildWhatsAppUrl } from "@/lib/enquiry";
import { fillTemplate } from "@/lib/format";
import type { Labels, Product, SiteConfig } from "@/lib/schemas";
import { CopyCodeButton } from "./CopyCodeButton";

type Props = {
  product: Pick<Product, "name" | "code" | "href">;
  site: SiteConfig;
  labels: Labels["enquire"];
};

/** WhatsApp (prefilled with name + code + link), Instagram DM, copy-code, enquiry form. */
export function EnquireButtons({ product, site, labels }: Props) {
  const whatsapp = buildWhatsAppUrl(site, product);
  const instagram = buildInstagramDmUrl(site);
  return (
    <div className="space-y-5 border border-hairline bg-white p-6 sm:p-7">
      <div className="space-y-2">
        <h2 className="eyebrow text-ink">{labels.heading}</h2>
        <p className="text-body-sm text-muted">{labels.intro}</p>
      </div>
      <div className="grid gap-3">
        <Button
          href={whatsapp}
          variant="accent"
          size="lg"
          icon={<FaWhatsapp className="size-4" />}
          newTabHint={site.ui.opensInNewTab}
        >
          {labels.whatsapp}
        </Button>
        {instagram && (
          <Button
            href={instagram}
            variant="secondary"
            size="lg"
            icon={<FaInstagram className="size-4" />}
            newTabHint={site.ui.opensInNewTab}
          >
            {labels.instagram}
          </Button>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
        <CopyCodeButton
          code={product.code}
          label={fillTemplate(labels.copyCode, { code: product.code })}
          copiedLabel={labels.copied}
        />
        <a
          href={site.googleFormUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 eyebrow text-muted transition-colors hover:text-ink"
        >
          {labels.form}
          <ExternalLink className="size-3.5" aria-hidden="true" />
          <span className="sr-only"> ({site.ui.opensInNewTab})</span>
        </a>
      </div>
    </div>
  );
}
