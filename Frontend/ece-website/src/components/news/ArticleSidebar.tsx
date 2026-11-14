"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Arrow } from "@/components/ui";
import { newsArticleHref, newsArticleLinkLabel } from "@/data/news.mock";
import type { NewsArticle } from "@/types/news";
import styles from "@/app/news/[slug]/page.module.css";

export default function ArticleSidebar({ articles }: { articles: NewsArticle[] }) {
  const list = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  return <aside className={styles.sidebar} aria-label="More news">
    <div id="sidebar-news" ref={list} className={`${styles.sidebarList} ${expanded ? styles.expanded : ""}`}>
      {articles.map(article => <article key={article.id}>
        <Link href={newsArticleHref(article)} prefetch={false} className={styles.cardImage} aria-label={newsArticleLinkLabel(article)}>
          <img src={article.image} alt={article.imageAlt} width={427} height={188} />
          <span><Arrow file="vector12.svg" /></span>
        </Link>
        <h2><Link href={newsArticleHref(article)} prefetch={false}>{article.title}</Link></h2>
        <p>{article.summary}</p>
      </article>)}
    </div>
    <button className={styles.moreSidebar} type="button" aria-expanded={expanded} aria-controls="sidebar-news" aria-label={expanded ? "Collapse news summaries" : "Show full news summaries"} onClick={() => setExpanded(!expanded)}>
      <Arrow file="vector12.svg" down={!expanded} />
    </button>
  </aside>;
}
