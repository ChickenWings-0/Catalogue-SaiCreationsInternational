import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { PaletteSwitcher } from "@/components/palette/PaletteSwitcher";
import { getFaqs, getNavigation, getSiteConfig } from "@/lib/content";
import { cormorant, jost } from "@/lib/fonts";
import { paletteBootScript } from "@/lib/palettes";
import "./globals.css";
import "./palettes.css"; // TEMPORARY: palette switcher

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return {
    metadataBase: new URL(site.url),
    title: { default: site.seo.defaultTitle, template: site.seo.titleTemplate },
    description: site.seo.description,
    applicationName: site.legalName,
  };
}

export const viewport: Viewport = {
  colorScheme: "light",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [site, navigation, footerFaqs] = await Promise.all([
    getSiteConfig(),
    getNavigation(),
    getFaqs({ footerOnly: true }),
  ]);
  const paletteSwitcher = site.features.showPaletteSwitcher; // TEMPORARY

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable}`}
      // The palette boot script may set data-palette before hydration.
      suppressHydrationWarning={paletteSwitcher}
    >
      <head>
        {paletteSwitcher && <script dangerouslySetInnerHTML={{ __html: paletteBootScript() }} />}
      </head>
      <body className="flex min-h-svh flex-col">
        <SkipLink label={site.ui.skipToContent} />
        <Header site={site} navigation={navigation} shrinkOnScroll={site.features.headerShrink} />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer
          site={site}
          footer={navigation.footer}
          faqs={footerFaqs}
          reserveFloatingSpace={paletteSwitcher}
        />
        {paletteSwitcher && <PaletteSwitcher />}
      </body>
    </html>
  );
}
