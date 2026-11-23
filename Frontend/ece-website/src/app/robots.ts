import type { MetadataRoute } from "next";
import { canonicalUrl, getSiteConfig } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (!getSiteConfig().indexable)
    return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/auth", "/login", "/api", "/homepage-preview/"],
    },
    sitemap: new URL("/sitemap.xml", canonicalUrl("/")).href,
  };
}
