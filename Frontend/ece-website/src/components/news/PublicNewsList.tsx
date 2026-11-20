"use client";
import { useState } from "react";
import Link from "next/link";
import { useApi } from "@/lib/api/use-api";
import { externalUrl, mediaUrl, type Page } from "@/lib/api/client";
import {
  categoryLabel,
  displayDate,
  newsHref,
  type PublicNews,
} from "@/lib/api/news";
import styles from "@/app/news/page.module.css";
export default function PublicNewsList() {
  const [page, setPage] = useState(0);
  const [category, setCategory] = useState("");
  const { data, error } = useApi<Page<PublicNews>>(
    `/news/public?page=${page}&size=12${category ? `&category=${category}` : ""}`,
  );
  return (
    <section className={styles.latest} aria-label="Latest news and open calls">
      <label>
        Category{" "}
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(0);
          }}
        >
          <option value="">All news</option>
          <option value="LATEST_NEWS">Latest news</option>
          <option value="OPEN_CALL">Open calls</option>
        </select>
      </label>
      {error ? (
        <p role="alert">{error}</p>
      ) : !data ? (
        <p role="status">Loading news…</p>
      ) : (
        <>
          {!data.content.length && <p>No published news yet.</p>}
          <div className={styles.list}>
            {data.content.map((article, index) => {
              const href = newsHref(article.slug);
              const image = mediaUrl(article.imageUrl);
              return (
                <article
                  className={
                    index === 0 ||
                    ["FEATURED", "BIG_STORY"].includes(article.placement || "")
                      ? styles.feature
                      : styles.row
                  }
                  key={article.id}
                >
                  {image && (
                    <img
                      className={
                        index === 0 ? styles.featureImage : styles.rowImage
                      }
                      src={image}
                      alt={article.imageAlt || ""}
                    />
                  )}
                  <div className={styles.articleCopy}>
                    <div className={styles.meta}>
                      <span aria-hidden="true" />
                      <div>
                        <strong>{categoryLabel(article.category)}</strong>
                        <time dateTime={article.publishedAt || undefined}>
                          {displayDate(article.publishedAt)}
                        </time>
                      </div>
                    </div>
                    {article.placement === "BIG_STORY" && (
                      <p className={styles.label}>The Big Story</p>
                    )}
                    {article.placement === "MEDIA" && (
                      <p className={styles.label}>
                        {article.mediaKind === "AUDIO" ? "Audio" : "Video"}
                      </p>
                    )}
                    <h2>
                      {href ? (
                        <Link href={href}>{article.title}</Link>
                      ) : (
                        article.title
                      )}
                    </h2>
                    <p>
                      {article.shortDescription}{" "}
                      {article.emphasis && <strong>{article.emphasis}</strong>}
                    </p>
                    {externalUrl(article.mediaUrl) && (
                      <a href={externalUrl(article.mediaUrl)}>
                        {article.mediaKind === "AUDIO"
                          ? "Listen to audio"
                          : "Watch video"}
                      </a>
                    )}
                    {href ? (
                      <Link className={styles.readMore} href={href}>
                        Read more
                      </Link>
                    ) : (
                      <p>Article page awaiting the next site update.</p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
          <nav className={styles.pagination} aria-label="News pages">
            <button disabled={page === 0} onClick={() => setPage(page - 1)}>
              Previous
            </button>
            <span>
              {data.totalElements ? page + 1 : 0} / {data.totalPages}
            </span>
            <button
              disabled={page + 1 >= data.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </nav>
        </>
      )}
    </section>
  );
}
