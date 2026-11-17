import type { FAQInput } from "@/lib/schemas";

/*
 * FAQs: ONE source, shown in the footer (items with showInFooter: true) and in full on /about#faqs.
 * TODO(client): replace all questions and answers below with real FAQs (6–12 items).
 */
export const faqs: FAQInput[] = [
  {
    id: "how-to-order",
    order: 1,
    showInFooter: true,
    question: "How do I place an order or enquiry?",
    answer:
      "Tap any piece in the catalogue and choose Enquire on WhatsApp: a link to that piece is added to your message. For larger or trade orders, use our quotation request form or email info@saicreationsintl.com. We'll reply with availability, options and next steps.",
  },
  {
    id: "custom-orders",
    order: 2,
    showInFooter: true,
    question: "Do you take custom or bulk orders?",
    answer:
      "Yes. Many of our pieces can be made in different sizes, colours or materials. Tell us what you have in mind and the quantity you need, and we'll advise on what's possible.",
  },
  {
    id: "shipping",
    order: 3,
    showInFooter: true,
    question: "Do you ship internationally?",
    answer:
      "We work with buyers in India and abroad. Shipping options and timelines depend on the destination and order size. We'll confirm them with your quote.",
  },
  {
    id: "handmade-variation",
    order: 4,
    showInFooter: true,
    question: "Will my piece look exactly like the photo?",
    answer:
      "Our products are made by hand, so small variations in colour, texture and finish are natural. They're part of what makes each piece unique.",
  },
  {
    id: "lead-times",
    order: 5,
    showInFooter: false,
    question: "How long does production take?",
    answer:
      "Lead times vary by product and quantity. Ready pieces can ship within days, while made-to-order pieces typically take a few weeks. We'll give you a timeline with your quote.",
  },
  {
    id: "samples",
    order: 6,
    showInFooter: false,
    question: "Can I request a sample?",
    answer:
      "Samples are available for many products, especially for trade and bulk enquiries. Send us the pieces you're interested in on WhatsApp, or list them in our quotation request form.",
  },
  {
    id: "care",
    order: 7,
    showInFooter: false,
    question: "How should I care for handcrafted pieces?",
    answer:
      "Keep natural materials, metal and glass away from prolonged direct sun and moisture, and clean gently with a soft dry cloth. Ask us on WhatsApp for care advice on a specific piece.",
  },
  {
    id: "visit",
    order: 8,
    showInFooter: false,
    question: "Can I visit your studio?",
    answer:
      "Visits to our workshop can be arranged by appointment. Get in touch and we'll find a time that suits you.",
  },
];
