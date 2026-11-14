import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Arrow } from "@/components/ui";
import PendingControl from "@/components/news/PendingControl";
import { featuredNews, latestNews, newsMedia, bigStory, communityNews, newsArticleHref, newsArticleLinkLabel } from "@/data/news.mock";
import type { NewsArticle } from "@/types/news";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "News — EKE Bitola",
  description: "Community updates, open calls, shared insights, and stories from EKE.",
};

function ArticleCopy({ article }: { article: NewsArticle }) {
  return <div className={styles.articleCopy}>
    <div className={styles.meta}><span aria-hidden="true" /><div><strong>{article.category}</strong><time dateTime={article.publishedAt}>{article.displayDate}</time></div></div>
    <h2><Link href={newsArticleHref(article)} prefetch={false} aria-label={newsArticleLinkLabel(article)}>{article.title}</Link></h2>
    <p>{article.summary} {article.emphasis && <strong>{article.emphasis}</strong>}</p>
    <Link className={styles.readMore} href={newsArticleHref(article)} prefetch={false} aria-label={`Read more: ${newsArticleLinkLabel(article)}`} title={article.details ? article.title : "Full article awaiting verified content"}>Read more <Arrow file="vector12.svg" /></Link>
  </div>;
}

function Feature({ article }: { article: NewsArticle }) {
  return <article className={styles.feature}>
    <Link href={newsArticleHref(article)} prefetch={false} aria-label={newsArticleLinkLabel(article)}><img className={styles.featureImage} src={article.image} alt={article.imageAlt} width={1177} height={507} /></Link>
    <ArticleCopy article={article} />
  </article>;
}

function Pagination({ label }: { label: string }) {
  return <div className={styles.pagination} aria-label={label}>
    {[1, 2, 3].map(n => <PendingControl key={n} label={`${label}: page ${n}${n === 1 ? " (current)" : " unavailable"}`} message={n === 1 ? "All supplied items are shown." : "Additional items have not been supplied."}>
      <span className={n === 1 ? styles.activeDot : styles.dot} aria-hidden="true" />
    </PendingControl>)}
  </div>;
}

export default function NewsPage() {
  return <div className={styles.page}>
    <Header />
    <main id="main">
      <section className={styles.hero} aria-labelledby="news-title">
        <p className={styles.label}>Latest from EKE</p>
        <h1 id="news-title">Community Updates &amp; Shared<br /> Insights</h1>
        <p className={styles.intro}>Discover how EKE nurtures sustainable change from the ground up. Dig into our <strong>open calls, network briefs, first-hand stories, and open-source resources</strong> created to help fresh ideas take root and blossom into real-world solutions.</p>
      </section>
      <section className={styles.latest} aria-label="Latest news and open calls">
        <Feature article={featuredNews} />
        <div className={styles.list}>{latestNews.map(article => <article className={styles.row} key={article.id}>
          <Link href={newsArticleHref(article)} prefetch={false} aria-label={newsArticleLinkLabel(article)}><img className={styles.rowImage} src={article.image} alt={article.imageAlt} width={766} height={330} /></Link>
          <ArticleCopy article={article} />
        </article>)}</div>
      </section>
      <section className={styles.media} aria-labelledby="media-heading">
        <h2 className={styles.label} id="media-heading">Audio · Video</h2>
        <div className={styles.mediaGrid}>{newsMedia.map(item => <article key={item.id}>
          <div className={`${styles.mediaImage} ${item.kind === "audio" ? styles.audioImage : ""}`}>
            <img src={item.image} alt={item.imagePlaceholder ? "Placeholder: chess pieces on a board" : "Audience attending a conference"} width={872} height={189} />
            <PendingControl className={item.kind === "audio" ? styles.audioControl : styles.videoControl} label={`${item.kind === "audio" ? "Listen to" : "Play"} ${item.title} (unavailable)`} message={`${item.kind === "audio" ? "Audio" : "Video"} source has not been supplied.`}>
              {item.kind === "audio" ? <><span>Audio</span><span>{item.duration}</span></> : <img src="/assets/vector1.svg" alt="" />}
            </PendingControl>
          </div>
          <div className={styles.mediaCopy}><h3>{item.title}</h3><p>{item.summary}</p></div>
        </article>)}</div>
        <Pagination label="Audio and video pages" />
      </section>
      <section className={styles.stories} aria-labelledby="stories-heading">
        <h2 className={styles.label} id="stories-heading">The Big Story</h2>
        <Feature article={bigStory} />
        <div className={styles.storyGrid}>{communityNews.map(article => <article key={article.id}>
          <Link href={newsArticleHref(article)} prefetch={false} className={styles.storyImage} aria-label={newsArticleLinkLabel(article)} title={article.details ? article.title : "Full article awaiting verified content"}>
            <img src={article.image} alt={article.imageAlt} width={427} height={188} /><span className={styles.storyArrow}><Arrow file="vector12.svg" /></span>
          </Link>
          <h3><Link href={newsArticleHref(article)} prefetch={false} aria-label={newsArticleLinkLabel(article)}>{article.title}</Link></h3><p>{article.summary}</p>
        </article>)}</div>
        <Pagination label="Community story pages" />
      </section>
      <section className={styles.statement} aria-label="Our shared purpose"><p>People, ideas and communities move forward when non-formal learning and international perspectives cross paths to turn <strong>shared knowledge into collective power.</strong></p></section>
    </main>
    <Footer />
  </div>;
}
