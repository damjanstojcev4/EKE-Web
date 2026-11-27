"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Arrow } from "@/components/ui";
import { newsArticleHref, newsArticleLinkLabel } from "@/data/news.mock";
import type { NewsArticle } from "@/types/news";
import {
  sidebar,
  sidebarCard,
  cardImage,
  cardPicture,
  sidebarSummary,
} from "./article-styles";

export default function ArticleSidebar({
  articles,
}: {
  articles: NewsArticle[];
}) {
  const list = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  return (
    <aside className={sidebar} aria-label="More news">
      <div
        id="sidebar-news"
        ref={list}
        className={`relative overflow-hidden ${expanded ? "max-h-none [mask-image:none]" : "max-h-[calc(1745*var(--u))] [mask-image:linear-gradient(#000_0_93%,transparent_100%)] [@media(min-width:769px)_and_(max-width:1100px)]:max-h-[1150px] [@media(max-width:768px)]:max-h-none [@media(max-width:768px)]:[mask-image:none]"}`}
      >
        {articles.map((article) => (
          <article className={sidebarCard} key={article.id}>
            <Link
              href={newsArticleHref(article)}
              prefetch={false}
              className={cardImage}
              aria-label={newsArticleLinkLabel(article)}
            >
              <img
                className={cardPicture}
                src={article.image}
                alt={article.imageAlt}
                width={427}
                height={188}
              />
              <span className="grid place-items-center absolute bottom-[calc(12*var(--u))] right-[calc(12*var(--u))] w-[calc(40*var(--u))] h-[calc(30*var(--u))] bg-surface rounded-[calc(3*var(--u))] [@media(max-width:768px)]:w-[44px] [@media(max-width:768px)]:h-[36px] [@media(max-width:768px)]:bottom-[12px] [@media(max-width:768px)]:right-[12px]">
                <Arrow file="vector12.svg" />
              </span>
            </Link>
            <h2 className="text-[length:calc(30*var(--u)-2px)] leading-[calc(38*var(--u))] font-bold mt-[calc(30*var(--u))]! [@media(min-width:769px)_and_(max-width:1100px)]:text-[19px] [@media(min-width:769px)_and_(max-width:1100px)]:leading-[1.2] [@media(max-width:768px)]:text-[24px] [@media(max-width:768px)]:leading-[1.2] [@media(max-width:768px)]:mt-[22px]!">
              <Link href={newsArticleHref(article)} prefetch={false}>
                {article.title}
              </Link>
            </h2>
            <p
              className={`${sidebarSummary} ${expanded ? "block" : "[display:-webkit-box]"}`}
            >
              {article.summary}
            </p>
          </article>
        ))}
      </div>
      <button
        className="flex my-0 mx-auto items-center justify-center w-[44px] h-[44px] [border:0] bg-transparent"
        type="button"
        aria-expanded={expanded}
        aria-controls="sidebar-news"
        aria-label={
          expanded ? "Collapse news summaries" : "Show full news summaries"
        }
        onClick={() => setExpanded(!expanded)}
      >
        <Arrow file="vector12.svg" down={!expanded} />
      </button>
    </aside>
  );
}
