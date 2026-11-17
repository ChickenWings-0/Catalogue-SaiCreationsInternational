import type { LabelsInput } from "@/lib/schemas";

/**
 * Interface labels for the catalogue, product pages and carousels.
 * {placeholders} are filled in by the components.
 */
export const labels: LabelsInput = {
  catalogue: {
    productCount: "{count} pieces",
    viewCategory: "Explore {name}",
    allProducts: "All pieces",
    browse: "Tap any piece to see it larger and enquire on WhatsApp.",
    comingSoon: "More pieces coming soon.",
  },
  product: {
    piece: "Piece {n}",
    more: "More {category}",
    back: "Back to {category}",
  },
  enquire: {
    heading: "Interested in this piece?",
    intro: "Send us a WhatsApp message. A link to this piece, with its photo, is added for you.",
    whatsapp: "Enquire on WhatsApp",
    quote: "Request a quotation",
  },
  lightbox: {
    open: "View larger: {label}",
    close: "Close",
    previous: "Previous piece",
    next: "Next piece",
    position: "{n} of {total}",
  },
  gallery: {
    previous: "Previous image",
    next: "Next image",
    viewImage: "View image {n} of {total}",
    imageOf: "{n} of {total}",
  },
  carousel: {
    region: "Photo gallery",
    previous: "Previous photo",
    next: "Next photo",
    goTo: "Go to slide {n} of {total}",
    slideOf: "{n} of {total}",
    pause: "Pause slideshow",
    play: "Play slideshow",
    dots: "Choose slide",
  },
  video: {
    pause: "Pause video",
    play: "Play video",
    scrollCue: "Scroll to explore",
  },
};
