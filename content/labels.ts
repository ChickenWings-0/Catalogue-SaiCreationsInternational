import type { LabelsInput } from "@/lib/schemas";

/**
 * Interface labels for the catalogue, product pages and carousels.
 * {placeholders} are filled in by the components.
 */
export const labels: LabelsInput = {
  catalogue: {
    productCount: "{count} pieces",
    viewCategory: "Explore {name}",
    viewProduct: "View {name}",
  },
  filters: {
    toggle: "Filter",
    hide: "Hide filters",
    material: "Material",
    colour: "Colour",
    size: "Size",
    sizes: { small: "Small", medium: "Medium", large: "Large" },
    sort: "Sort by",
    sortOptions: {
      featured: "Featured",
      newest: "Newest",
      "name-asc": "Name A–Z",
      "name-desc": "Name Z–A",
    },
    clearAll: "Clear all",
    remove: "Remove filter: {value}",
    results: "Showing {shown} of {total} pieces",
    empty: "No pieces match these filters.",
  },
  product: {
    code: "Product code",
    dimensions: "Dimensions",
    materials: "Materials",
    colours: "Colours",
    technique: "Technique",
    finish: "Finish",
    care: "Care",
    weight: "Weight",
    moq: "Minimum order",
    leadTime: "Lead time",
    details: "Details",
    description: "About this piece",
    related: "More from {category}",
  },
  enquire: {
    heading: "Enquire about this piece",
    intro:
      "Message us with the product code and we'll reply with availability, options and pricing.",
    whatsapp: "Enquire on WhatsApp",
    instagram: "Message on Instagram",
    form: "Use the enquiry form",
    copyCode: "Copy code {code}",
    copied: "Code copied",
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
