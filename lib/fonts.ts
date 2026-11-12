import { Cormorant_Garamond, Jost } from "next/font/google";

/** Display serif: wordmark and editorial headings (see DESIGN_SYSTEM §1). */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

/** UI / body sans. Variable font, so all weights are available. */
export const jost = Jost({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jost",
});
