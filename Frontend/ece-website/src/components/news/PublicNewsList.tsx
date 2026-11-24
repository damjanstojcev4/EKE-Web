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

// Inclusive legacy boundaries: News switches to its mobile layout at 768px.
const feature =
  "relative h-[calc(507*var(--u))] ml-[calc(77*var(--u))]! [@media(min-width:769px)_and_(max-width:1100px)]:h-auto [@media(min-width:769px)_and_(max-width:1100px)]:min-h-[calc(590*var(--u))] [@media(max-width:768px)]:mx-[24px]! [@media(max-width:768px)]:my-0! [@media(max-width:768px)]:h-auto";
const row =
  "relative grid grid-cols-[calc(766*var(--u))_1fr] gap-[calc(32*var(--u))] pt-[calc(52*var(--u))] pr-[calc(84*var(--u))] pb-[calc(60*var(--u))] pl-0 before:absolute before:top-0 before:left-[calc(379*var(--u))] before:right-0 before:h-px before:bg-[#ccc] before:content-[''] [@media(min-width:769px)_and_(max-width:1100px)]:pr-0 [@media(max-width:768px)]:grid-cols-1 [@media(max-width:768px)]:gap-0 [@media(max-width:768px)]:px-0 [@media(max-width:768px)]:py-[32px] [@media(max-width:768px)]:before:left-0";
const featureCopy =
  "absolute left-[calc(766*var(--u))] top-[calc(85*var(--u))] w-[calc(1077*var(--u))] min-h-[calc(395*var(--u))] pt-[calc(30*var(--u))] pr-[calc(160*var(--u))] pb-[calc(25*var(--u))] pl-[calc(34*var(--u))] border border-solid border-[#ffffff70] [border-right:0] rounded-l-[calc(25*var(--u))] bg-[#fafafa38] backdrop-blur-[calc(38*var(--u))] [@media(min-width:769px)_and_(max-width:1100px)]:pr-[30px] [@media(min-width:769px)_and_(max-width:1100px)]:min-h-[calc(450*var(--u))] [@media(max-width:768px)]:relative [@media(max-width:768px)]:top-auto [@media(max-width:768px)]:left-auto [@media(max-width:768px)]:w-full [@media(max-width:768px)]:min-h-0 [@media(max-width:768px)]:pt-[25px] [@media(max-width:768px)]:px-0 [@media(max-width:768px)]:pb-[30px] [@media(max-width:768px)]:border-0 [@media(max-width:768px)]:[border-style:none] [@media(max-width:768px)]:[border-color:currentColor] [@media(max-width:768px)]:rounded-none [@media(max-width:768px)]:bg-transparent [@media(max-width:768px)]:backdrop-filter-none";
const rowCopy =
  "pt-[calc(15*var(--u))] min-h-[calc(330*var(--u))] [@media(max-width:768px)]:pt-[24px] [@media(max-width:768px)]:min-h-0";
const copyText =
  "text-[length:calc(18*var(--u))] leading-[calc(26*var(--u))] [@media(min-width:769px)_and_(max-width:1100px)]:text-[14px] [@media(min-width:769px)_and_(max-width:1100px)]:leading-[1.45] [@media(max-width:768px)]:text-[16px] [@media(max-width:768px)]:leading-[1.5]";
const readMore =
  "flex items-center gap-[calc(30*var(--u))] uppercase text-[length:calc(20*var(--u))] font-bold mt-auto! self-end min-h-[44px] [@media(min-width:769px)_and_(max-width:1100px)]:text-[14px] [@media(max-width:768px)]:text-[16px] [@media(max-width:768px)]:gap-[20px] [@media(max-width:768px)]:pt-[20px]";
export default function PublicNewsList() {
  const [page, setPage] = useState(0);
  const [category, setCategory] = useState("");
  const { data, error } = useApi<Page<PublicNews>>(
    `/news/public?page=${page}&size=12${category ? `&category=${category}` : ""}`,
  );
  return (
    <section className="relative" aria-label="Latest news and open calls">
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
          <div className="mt-[calc(51*var(--u))]! mr-[calc(80*var(--u))]! mb-0! ml-[calc(77*var(--u))]! [@media(max-width:768px)]:mx-[24px]! [@media(max-width:768px)]:mt-0!">
            {data.content.map((article, index) => {
              const href = newsHref(article.slug);
              const image = mediaUrl(article.imageUrl);
              const isFeature =
                index === 0 ||
                ["FEATURED", "BIG_STORY"].includes(article.placement || "");
              return (
                <article className={isFeature ? feature : row} key={article.id}>
                  {image && (
                    <img
                      className={
                        index === 0
                          ? "w-[calc(1177*var(--u))] h-[calc(507*var(--u))] object-cover rounded-t-[calc(25*var(--u))] [@media(max-width:768px)]:w-full [@media(max-width:768px)]:h-auto [@media(max-width:768px)]:aspect-[1177/507] [@media(max-width:768px)]:rounded-t-[18px]"
                          : "w-full h-[calc(330*var(--u))] object-cover rounded-t-[calc(24*var(--u))] [@media(max-width:768px)]:h-auto [@media(max-width:768px)]:aspect-[766/330] [@media(max-width:768px)]:rounded-t-[18px]"
                      }
                      src={image}
                      alt={article.imageAlt || ""}
                    />
                  )}
                  <div
                    className={`flex flex-col items-start ${isFeature ? featureCopy : rowCopy}`}
                  >
                    <div className="flex gap-[calc(7*var(--u))] text-[length:calc(16*var(--u))] leading-[calc(20*var(--u))] [@media(min-width:769px)_and_(max-width:1100px)]:text-[12px] [@media(min-width:769px)_and_(max-width:1100px)]:leading-[1.3] [@media(max-width:768px)]:gap-[8px] [@media(max-width:768px)]:text-[14px] [@media(max-width:768px)]:leading-[19px]">
                      <span
                        className="w-[calc(18*var(--u))] h-[calc(18*var(--u))] bg-brand-blue [@media(max-width:768px)]:w-[16px] [@media(max-width:768px)]:h-[16px]"
                        aria-hidden="true"
                      />
                      <div>
                        <strong>{categoryLabel(article.category)}</strong>
                        <time
                          className="block"
                          dateTime={article.publishedAt || undefined}
                        >
                          {displayDate(article.publishedAt)}
                        </time>
                      </div>
                    </div>
                    {article.placement === "BIG_STORY" && (
                      <p className={`${copyText} font-bold uppercase`}>
                        The Big Story
                      </p>
                    )}
                    {article.placement === "MEDIA" && (
                      <p className={`${copyText} font-bold uppercase`}>
                        {article.mediaKind === "AUDIO" ? "Audio" : "Video"}
                      </p>
                    )}
                    <h2
                      className={`text-[length:calc(40*var(--u)-2px)] leading-[1.25] font-bold mb-[calc(26*var(--u))]! [@media(max-width:768px)]:text-[26px] [@media(max-width:768px)]:leading-[1.2] [@media(max-width:768px)]:my-[22px]! [@media(max-width:768px)]:max-w-none ${isFeature ? "mt-[calc(30*var(--u))]!" : "mt-[calc(25*var(--u))]!"} ${index === 0 ? "max-w-[calc(760*var(--u))]" : !isFeature && index === 1 ? "max-w-[calc(650*var(--u))]" : ""} ${!isFeature && index === data.content.length - 1 ? "[@media(min-width:1101px)]:max-w-[calc(800*var(--u))]" : ""}`}
                    >
                      {href ? (
                        <Link href={href}>{article.title}</Link>
                      ) : (
                        article.title
                      )}
                    </h2>
                    <p className={copyText}>
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
                      <Link
                        className={`${readMore} ${isFeature ? "pt-[calc(28*var(--u))]" : "pt-[calc(12*var(--u))]"}`}
                        href={href}
                      >
                        Read more
                      </Link>
                    ) : (
                      <p className={copyText}>
                        Article page awaiting the next site update.
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
          <nav
            className="flex justify-center gap-[calc(4*var(--u))] mt-[calc(62*var(--u))]! [@media(max-width:768px)]:mt-[28px]! [@media(max-width:768px)]:gap-0"
            aria-label="News pages"
          >
            <button
              className="grid place-items-center w-[calc(32*var(--u))] h-[calc(32*var(--u))] [@media(max-width:768px)]:w-[44px] [@media(max-width:768px)]:h-[44px]"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span>
              {data.totalElements ? page + 1 : 0} / {data.totalPages}
            </span>
            <button
              className="grid place-items-center w-[calc(32*var(--u))] h-[calc(32*var(--u))] [@media(max-width:768px)]:w-[44px] [@media(max-width:768px)]:h-[44px]"
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
