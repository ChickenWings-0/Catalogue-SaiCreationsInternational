import type { NextConfig } from "next";
import { IMAGE_DEVICE_SIZES, IMAGE_SIZES } from "./lib/image-widths.mjs";

/**
 * Fully static export. The output in /out runs on any static host (Vercel, Cloudflare Pages…).
 * Do NOT add: redirects/rewrites/headers, middleware/proxy, API routes, ISR, or the default
 * image optimiser. Host-level concerns (www → apex) are configured at the host/DNS.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    // Images are pre-sized at build time by scripts/build-images.mjs.
    // The loader maps each srcset width to its pre-built WebP file.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    deviceSizes: [...IMAGE_DEVICE_SIZES],
    imageSizes: [...IMAGE_SIZES],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
