"use client";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ArticleContent from "./ArticleContent";
import ArticleShare from "./ArticleShare";
import { useApi } from "@/lib/api/use-api";
import { externalUrl, mediaUrl } from "@/lib/api/client";
import {
  articleBlocks,
  categoryLabel,
  displayDate,
  newsHref,
  type PublicNews,
} from "@/lib/api/news";
import styles from "@/app/news/[slug]/page.module.css";
function RelatedArticle({ id }: { id: string }) {
  const { data } = useApi<PublicNews>(`/news/public/${encodeURIComponent(id)}`);
  const href = data && newsHref(data.slug);
  return data && href ? (
    <article>
      {mediaUrl(data.imageUrl) && (
        <Link className={styles.cardImage} href={href}>
          <img src={mediaUrl(data.imageUrl)} alt={data.imageAlt || ""} />
        </Link>
      )}
      <h3>
        <Link href={href}>{data.title}</Link>
      </h3>
      <p>{data.shortDescription}</p>
    </article>
  ) : null;
}
export default function PublicArticle({ slug }: { slug: string }) {
  const { data: article, error } = useApi<PublicNews>(
    `/news/slug/${encodeURIComponent(slug)}`,
  );
  const hero = mediaUrl(article?.heroUrl || article?.imageUrl);
  return (
    <div className={styles.page}>
      <Header />
      <main id="main">
        {error ? (
          <div className={styles.pendingArticle}>
            <h1>Article unavailable</h1>
            <p role="alert">{error}</p>
            <Link href="/news/">Back to News</Link>
          </div>
        ) : !article ? (
          <p role="status">Loading article…</p>
        ) : (
          <>
            {hero && (
              <div className={styles.hero}>
                <img
                  src={hero}
                  alt={article.heroAlt || article.imageAlt || ""}
                />
              </div>
            )}
            <div className={styles.columns}>
              <article className={styles.article}>
                <header className={styles.articleHeader}>
                  <div className={styles.metadataRow}>
                    <div className={styles.meta}>
                      <span />
                      <div>
                        <strong>{categoryLabel(article.category)}</strong>
                        <time dateTime={article.publishedAt || undefined}>
                          {displayDate(article.publishedAt)}
                        </time>
                      </div>
                    </div>
                    <ArticleShare
                      title={article.title || ""}
                      image={hero || ""}
                    />
                  </div>
                  <h1>{article.title}</h1>
                </header>
                <p className={styles.introduction}>
                  {article.introduction || article.shortDescription}
                </p>
                <div className={styles.body}>
                  <ArticleContent blocks={articleBlocks(article.contentJson)} />
                  {externalUrl(article.mediaUrl) && (
                    <p>
                      <a href={externalUrl(article.mediaUrl)}>
                        {article.mediaKind === "AUDIO"
                          ? "Listen to audio"
                          : "Watch video"}
                      </a>
                    </p>
                  )}
                  {!articleBlocks(article.contentJson).length && (
                    <p>Further article content has not been supplied.</p>
                  )}
                </div>
              </article>
              <aside className={styles.sidebar} aria-label="Related articles">
                <div className={`${styles.sidebarList} ${styles.expanded}`}>
                  {(article.relatedIds || "")
                    .split(",")
                    .filter(Boolean)
                    .map((id) => (
                      <RelatedArticle key={id} id={id} />
                    ))}
                </div>
              </aside>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
