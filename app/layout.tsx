import type { Metadata, Viewport } from "next";
import { cormorant, jost } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAI Creations International",
  description: "A House of Home Furnishing & Handicrafts",
};

export const viewport: Viewport = {
  themeColor: "#faf8f4",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  );
}
