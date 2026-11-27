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
import styles from "./article.module.css";
import {
  sidebar,
  sidebarCard,
  cardImage,
  cardPicture,
  sidebarSummary,
} from "./article-styles";
function RelatedArticle({ id }: { id: string }) {
  const { data } = useApi<PublicNews>(`/news/public/${encodeURIComponent(id)}`);
  const href = data && newsHref(data.slug);
  return data && href ? (
    <article className={sidebarCard}>
      {mediaUrl(data.imageUrl) && (
        <Link className={cardImage} href={href}>
          <img
            className={cardPicture}
            src={mediaUrl(data.imageUrl)}
            alt={data.imageAlt || ""}
          />
        </Link>
      )}
      <h3>
        <Link href={href}>{data.title}</Link>
      </h3>
      <p className={`block ${sidebarSummary}`}>{data.shortDescription}</p>
    </article>
  ) : null;
}
export default function PublicArticle({ slug }: { slug: string }) {
  const { data: article, error } = useApi<PublicNews>(
    `/news/slug/${encodeURIComponent(slug)}`,
  );
  const hero = mediaUrl(article?.heroUrl || article?.imageUrl);
  return (
    <div className={`${styles.page} bg-surface-muted overflow-clip`}>
      <Header />
      <main id="main">
        {error ? (
          <div className="pt-[190px] px-[6vw] pb-[80px] min-h-[60vh]">
            <h1 className="text-[length:calc(clamp(32px,4vw,64px)-2px)] max-w-[1100px] leading-[1.1]">
              Article unavailable
            </h1>
            <p className="my-[30px]! mx-0! text-[20px]" role="alert">
              {error}
            </p>
            <Link className="underline!" href="/news/">
              Back to News
            </Link>
          </div>
        ) : !article ? (
          <p role="status">Loading article…</p>
        ) : (
          <>
            {hero && (
              <div className="pt-[calc(77*var(--u))] [@media(max-width:768px)]:pt-[95px]">
                <img
                  className="w-full h-[calc(777*var(--u))] object-cover [@media(max-width:768px)]:h-[clamp(220px,45vw,350px)]"
                  src={hero}
                  alt={article.heroAlt || article.imageAlt || ""}
                />
              </div>
            )}
            <div className="relative grid grid-cols-[calc(1195*var(--u))_calc(428*var(--u))] gap-[calc(85*var(--u))] mt-[calc(-202*var(--u))] mr-[calc(80*var(--u))] mb-0 ml-[calc(132*var(--u))] [align-items:start] [@media(max-width:768px)]:flex [@media(max-width:768px)]:flex-col [@media(max-width:768px)]:gap-[45px] [@media(max-width:768px)]:mt-[-38px] [@media(max-width:768px)]:mx-[24px]">
              <article className="[@media(max-width:768px)]:w-full">
                <header className="pt-[calc(44*var(--u))] px-[calc(46*var(--u))] pb-[calc(26*var(--u))] border border-solid border-[#ffffff60] rounded-t-[calc(25*var(--u))] [background:linear-gradient(#fafafa40,#fafafa_90%)] backdrop-blur-[calc(40*var(--u))] [@media(max-width:768px)]:py-[25px] [@media(max-width:768px)]:px-[20px] [@media(max-width:768px)]:rounded-t-[18px] [@media(max-width:768px)]:backdrop-blur-[20px]">
                  <div className="flex items-start gap-[calc(68*var(--u))] [@media(max-width:768px)]:flex-wrap [@media(max-width:768px)]:gap-x-[24px] [@media(max-width:768px)]:gap-y-[16px]">
                    <div className="flex gap-[calc(6*var(--u))] text-[length:calc(16*var(--u))] leading-[calc(20*var(--u))] ml-[calc(8*var(--u))] [@media(min-width:769px)_and_(max-width:1100px)]:text-[12px] [@media(min-width:769px)_and_(max-width:1100px)]:leading-[1.3] [@media(max-width:768px)]:text-[14px] [@media(max-width:768px)]:leading-[19px] [@media(max-width:768px)]:gap-[7px] [@media(max-width:768px)]:ml-0">
                      <span className="w-[calc(18*var(--u))] h-[calc(18*var(--u))] bg-brand-blue [@media(max-width:768px)]:w-[16px] [@media(max-width:768px)]:h-[16px]" />
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
                    <ArticleShare
                      title={article.title || ""}
                      image={hero || ""}
                    />
                  </div>
                  <h1 className="text-[length:calc(100*var(--u)-2px)] leading-none font-bold mt-[calc(36*var(--u))]! max-w-[calc(1010*var(--u))] [@media(max-width:768px)]:text-[length:calc(clamp(34px,6.5vw,54px)-2px)] [@media(max-width:768px)]:leading-[1.05] [@media(max-width:768px)]:mt-[24px]! [@media(max-width:768px)]:max-w-none">
                    {article.title}
                  </h1>
                </header>
                <p className="text-[length:calc(28*var(--u))] leading-[calc(36*var(--u))] mt-[calc(50*var(--u))]! mr-[calc(222*var(--u))]! ml-[calc(54*var(--u))]! [@media(min-width:769px)_and_(max-width:1100px)]:text-[20px] [@media(min-width:769px)_and_(max-width:1100px)]:leading-[1.4] [@media(min-width:769px)_and_(max-width:1100px)]:mr-[45px]! [@media(max-width:768px)]:mt-[22px]! [@media(max-width:768px)]:mx-0! [@media(max-width:768px)]:text-[21px] [@media(max-width:768px)]:leading-[1.4]">
                  {article.introduction || article.shortDescription}
                </p>
                <div
                  className={`${styles.body} mt-[calc(58*var(--u))] mr-[calc(222*var(--u))] ml-[calc(54*var(--u))] pt-[calc(66*var(--u))] border-t border-solid border-t-[#ddd] text-[length:calc(20*var(--u))] leading-[calc(28*var(--u))] [@media(min-width:769px)_and_(max-width:1100px)]:text-[16px] [@media(min-width:769px)_and_(max-width:1100px)]:leading-[1.5] [@media(min-width:769px)_and_(max-width:1100px)]:mr-[45px] [@media(max-width:768px)]:mt-[30px] [@media(max-width:768px)]:mx-0 [@media(max-width:768px)]:pt-[30px] [@media(max-width:768px)]:text-[17px] [@media(max-width:768px)]:leading-[1.55]`}
                >
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
              <aside className={sidebar} aria-label="Related articles">
                <div className="relative max-h-none overflow-hidden [mask-image:none]">
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
