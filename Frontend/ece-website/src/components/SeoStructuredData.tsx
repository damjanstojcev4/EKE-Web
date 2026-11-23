import {
  canonicalUrl,
  plainText,
  seoPages,
  serializeJsonLd,
  socialImage,
  summarize,
  type SeoPage,
} from "@/lib/seo";
import type { Project } from "@/types/project";
import type { NewsArticle } from "@/types/news";

function JsonLd({ value }: { value: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(value) }}
    />
  );
}

export function SiteStructuredData() {
  const url = canonicalUrl("/");
  if (!url) return null;
  return (
    <JsonLd
      value={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": `${url}#organization`,
            name: "EKE",
            url,
            logo: new URL("/assets/eke-logo-symbol.svg", url).href,
            sameAs: [
              "https://www.facebook.com/EKEBitola",
              "https://www.instagram.com/eke.bitola/",
            ],
          },
          {
            "@type": "WebSite",
            "@id": `${url}#website`,
            name: "EKE",
            url,
            inLanguage: "en",
            publisher: { "@id": `${url}#organization` },
          },
        ],
      }}
    />
  );
}

export function BreadcrumbStructuredData({
  page,
  detail,
}: {
  page: Exclude<SeoPage, "home">;
  detail?: { title: string; path: string };
}) {
  const home = canonicalUrl("/");
  if (!home) return null;
  const section = seoPages[page];
  const items: { title: string; url: string | undefined }[] = [
    { title: "Home", url: home },
    { title: section.label, url: canonicalUrl(section.path) },
  ];
  if (detail)
    items.push({
      title: plainText(detail.title),
      url: canonicalUrl(detail.path),
    });
  return (
    <JsonLd
      value={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.title,
          item: item.url,
        })),
      }}
    />
  );
}

export function ProjectStructuredData({ project }: { project: Project }) {
  const url = canonicalUrl(`/projects/${project.slug}`);
  if (!url || !project.details) return null;
  return (
    <>
      <BreadcrumbStructuredData
        page="projects"
        detail={{
          title: project.details.title,
          path: `/projects/${project.slug}`,
        }}
      />
      <JsonLd
        value={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          "@id": `${url}#project`,
          url,
          name: plainText(project.details.title),
          description: summarize(project.details.summary),
          image: socialImage(
            `/assets/projects-page/${project.image}`,
            seoPages.projects.image,
          ),
          publisher: { "@id": `${canonicalUrl("/")}#organization` },
        }}
      />
    </>
  );
}

export function NewsStructuredData({ article }: { article: NewsArticle }) {
  const url = canonicalUrl(`/news/${article.slug}`);
  if (!url || !article.details) return null;
  return (
    <>
      <BreadcrumbStructuredData
        page="news"
        detail={{ title: article.title, path: `/news/${article.slug}` }}
      />
      <JsonLd
        value={{
          "@context": "https://schema.org",
          "@type": "Article",
          "@id": `${url}#article`,
          url,
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          headline: plainText(article.title),
          description: summarize(article.summary),
          datePublished: article.publishedAt,
          image: socialImage(
            article.imagePlaceholder ? undefined : article.details.heroImage,
            seoPages.news.image,
          ),
          publisher: { "@id": `${canonicalUrl("/")}#organization` },
        }}
      />
    </>
  );
}
