import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

// Keep production builds from replacing manifests/chunks used by a live dev server.
const config = (phase: string): NextConfig => ({
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
  output: 'export',
  trailingSlash: true,
  devIndicators: false,
  images: { unoptimized: true },
});
export default config;
