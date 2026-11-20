"use client";
import Link from "next/link";
import ContentBlock from "@/components/ContentBlock";
import { siteContent } from "@/content/site-content";
import { Button, Divider } from "../ui";
import { useApi } from "@/lib/api/use-api";
import { mediaUrl } from "@/lib/api/client";
import {
  categoryLabel,
  displayDate,
  newsHref,
  type PublicNews,
} from "@/lib/api/news";
export default function NewsSection() {
  const { data: news, error } = useApi<PublicNews[]>("/news/homepage");
  return (
    <section className="news" id="news">
      <div className="news-heading">
        <ContentBlock block={siteContent.newsLabel} />
        <ContentBlock block={siteContent.newsHeading} as="h2" />
        <ContentBlock block={siteContent.newsIntro} />
      </div>
      <div className="news-list">
        {error ? (
          <p role="alert">{error}</p>
        ) : !news ? (
          <p role="status">Loading news…</p>
        ) : !news.length ? (
          <p>No published news yet.</p>
        ) : (
          news.map((n) => (
            <article className="news-item" key={n.id}>
              {mediaUrl(n.imageUrl) && (
                <div className="news-image">
                  <img
                    src={mediaUrl(n.imageUrl)}
                    alt={n.imageAlt || ""}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
              <div className="news-copy">
                <div className="news-meta">
                  <span aria-hidden="true" />
                  <div>
                    <strong>{categoryLabel(n.category)}</strong>
                    <time dateTime={n.publishedAt || undefined}>
                      {displayDate(n.publishedAt)}
                    </time>
                  </div>
                </div>
                <h3>
                  {newsHref(n.slug) ? (
                    <Link href={newsHref(n.slug)!}>{n.title}</Link>
                  ) : (
                    n.title
                  )}
                </h3>
                <p>{n.shortDescription}</p>
              </div>
              <Divider />
            </article>
          ))
        )}
        <div className="actions">
          <Button outline href="/news">
            View all news and resources
          </Button>
          <Button href="/opportunities">See upcoming opportunities</Button>
        </div>
      </div>
    </section>
  );
}
