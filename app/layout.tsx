import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { RevealObserver } from "@/components/layout/RevealObserver";
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
  colorScheme: "light",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [site, navigation, footerFaqs] = await Promise.all([
    getSiteConfig(),
    getNavigation(),
    getFaqs({ footerOnly: true }),
  ]);

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable}`}
      // The inline script below sets the "js" class before hydration.
      suppressHydrationWarning
    >
      <head>
        {/* Marks JS as available so scroll-reveal styles apply only when they can be undone. */}
        <script
          dangerouslySetInnerHTML={{ __html: 'document.documentElement.classList.add("js")' }}
        />
      </head>
      <body className="flex min-h-svh flex-col">
        <SkipLink label={site.ui.skipToContent} />
        <Header site={site} navigation={navigation} shrinkOnScroll={site.features.headerShrink} />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer site={site} footer={navigation.footer} faqs={footerFaqs} />
        <RevealObserver />
      </body>
    </html>
  );
}
