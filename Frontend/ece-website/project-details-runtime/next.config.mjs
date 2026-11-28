import path from "node:path";
const config = {
  distDir: ".next-details", trailingSlash: true,
  assetPrefix: "/_next-details", images: { unoptimized: true },
  outputFileTracingRoot: path.resolve(import.meta.dirname, ".."),
  env: { PROJECT_DETAILS_SERVER: "true" },
};
export default config;
