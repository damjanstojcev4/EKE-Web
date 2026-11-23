import type { MetadataRoute } from "next";
import { projects } from "@/data/projects.mock";
import { newsArticles } from "@/data/news.mock";
import { canonicalUrl, getSiteConfig, seoPages } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!getSiteConfig().indexable) return [];
  return [
    ...Object.values(seoPages).map((page) => ({
      url: canonicalUrl(page.path)!,
    })),
    ...projects
      .filter((project) => project.details)
      .map((project) => ({ url: canonicalUrl(`/projects/${project.slug}`)! })),
    ...newsArticles
      .filter((article) => article.details)
      .map((article) => ({
        url: canonicalUrl(`/news/${article.slug}`)!,
        // Publication date is reliable; no modification timestamp is supplied.
        ...(article.publishedAt ? { lastModified: article.publishedAt } : {}),
      })),
  ];
}
