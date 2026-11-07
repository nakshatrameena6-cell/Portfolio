import type { NextConfig } from "next";

/**
 * Fully static export: every route is pre-rendered, so the site can be hosted
 * on any static host (Vercel, Netlify, GitHub Pages at a domain root).
 * Raster evidence images are pre-optimised by scripts/optimise-images.mjs.
 */
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
