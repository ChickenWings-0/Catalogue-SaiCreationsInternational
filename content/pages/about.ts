import type { AboutPageInput } from "@/lib/schemas";

export const aboutPage: AboutPageInput = {
  title: "About Us",
  intro:
    "A house of home furnishing and handicrafts, built on craft, fair work and the skill of the artisans we work with.",
  sections: [
    {
      id: "the-initiative",
      eyebrow: "Our purpose",
      heading: "The Initiative",
      body: [
        "Our company is built around a clear social commitment: empowering women artisans through sustainable global trade. Although our workforce includes both men and women working together across operations and production, our primary initiative is dedicated to creating meaningful livelihoods and growth opportunities for female makers.",
        "We invest in women who hold deep, generational craft expertise—ensuring fair compensation, safe working environments, and direct access to international buyers. When you partner with us, you are supporting an ethical supply chain that actively champions women’s economic independence and brings India’s finest handcrafted goods to the global stage.",
      ],
      images: [
        {
          src: "about/initiative-1.jpg",
          alt: "Women artisans at work on handcrafted pieces in the workshop",
        },
        {
          src: "about/initiative-2.jpg",
          alt: "Artisans assembling and packing handcrafted products",
        },
      ],
    },
    {
      id: "the-present",
      eyebrow: "Today",
      heading: "The Present",
      body: [
        "To give every art form the focus and environment it deserves, we operate across four specialized branches in Delhi and Uttar Pradesh:",
      ],
      points: [
        { title: "Noida, Uttar Pradesh", detail: "D-32, Sector 7" },
        { title: "Delhi", detail: "E-211, Ashok Nagar" },
        { title: "Firozabad, Uttar Pradesh" },
        { title: "Amethi, Uttar Pradesh" },
      ],
      closing: [
        "Each branch is dedicated to a distinct craft discipline, giving our artisans the specialized space and resources needed to execute large-scale orders smoothly. Across every location, we work closely alongside our artisans in safe, clean, and supportive environments—handling every stage of creation with meticulous care so our customers receive only the highest quality handcrafted goods.",
      ],
      images: [],
    },
  ],
  faqHeading: "Frequently asked questions",
  seo: {
    description:
      "SAI Creations International empowers women artisans through sustainable global trade, with four specialised branches in Delhi and Uttar Pradesh.",
  },
};
