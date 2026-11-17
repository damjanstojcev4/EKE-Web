import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

// API requests stay same-origin; the hosted static site uses the staging reverse proxy.
const config = (phase: string): NextConfig => {
  const development = phase === PHASE_DEVELOPMENT_SERVER;
  return {
    distDir: development ? ".next-dev" : ".next",
    output: development ? undefined : "export",
    trailingSlash: true,
    devIndicators: false,
    images: { unoptimized: true },
    ...(development ? {
      async rewrites() {
        const backend = process.env.API_PROXY_TARGET || "http://127.0.0.1:18081";
        return [{ source: "/api/:path*", destination: `${backend.replace(/\/$/, "")}/api/:path*` }];
      },
    } : {}),
  };
};
export default config;
