// Run with: npm test   (Node's built-in test runner; TypeScript is type-stripped by Node)
import assert from "node:assert/strict";
import { test } from "node:test";
import { buildWhatsAppUrl } from "./enquiry.ts";

const site = {
  url: "https://example.com",
  contact: { whatsappNumber: "910000000000" },
  enquiry: { whatsappTemplate: "Hello, I'm interested in this piece: {url}" },
} as Parameters<typeof buildWhatsAppUrl>[0];

test("WhatsApp link ends with the product URL (for the photo preview)", () => {
  const url = new URL(
    buildWhatsAppUrl(site, { code: "SCI-HD-001", href: "/catalogue/home-decor/sci-hd-001/" }),
  );
  assert.equal(url.origin + url.pathname, "https://wa.me/910000000000");
  const text = url.searchParams.get("text") ?? "";
  assert.ok(text.endsWith("https://example.com/catalogue/home-decor/sci-hd-001/"));
});
