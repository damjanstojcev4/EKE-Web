import { cache } from "react";
import { projects } from "@/data/projects.mock";
import { newsArticles } from "@/data/news.mock";
import { createMetadata, seoPages, summarize } from "./seo";

// Share the exact content used by the page, metadata, and sitemap. This checkout
// has no frontend API adapter or backend slug/publication contract yet.
export const getProject = cache((slug: string) =>
  projects.find((item) => item.slug === slug),
);
export const getNewsArticle = cache((slug: string) =>
  newsArticles.find((item) => item.slug === slug),
);

export function projectMetadata(project: (typeof projects)[number]) {
  return createMetadata({
    path: `/projects/${project.slug}`,
    title: project.details?.title ?? project.title,
    description: summarize(project.details?.summary || project.description),
    image: `/assets/projects-page/${project.image}`,
    fallbackImage: seoPages.projects.image,
    noindex: !project.details,
  });
}

export function newsMetadata(article: (typeof newsArticles)[number]) {
  const content =
    article.details?.introduction.map((run) => run.text).join("") || "";
  return createMetadata({
    path: `/news/${article.slug}`,
    title: article.title,
    description: summarize(article.summary || content),
    image: article.imagePlaceholder
      ? undefined
      : article.details?.heroImage || article.image,
    fallbackImage: seoPages.news.image,
    noindex: !article.details,
    article: { publishedTime: article.publishedAt },
  });
}
