import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { getFaqs, getNavigation, getSiteConfig } from "@/lib/content";
import { cormorant, jost } from "@/lib/fonts";
import "./globals.css";

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
  themeColor: "#faf8f4",
  colorScheme: "light",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [site, navigation, footerFaqs] = await Promise.all([
    getSiteConfig(),
    getNavigation(),
    getFaqs({ footerOnly: true }),
  ]);

  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="flex min-h-svh flex-col">
        <SkipLink label={site.ui.skipToContent} />
        <Header site={site} navigation={navigation} shrinkOnScroll={site.features.headerShrink} />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer site={site} footer={navigation.footer} faqs={footerFaqs} />
      </body>
    </html>
  );
}
