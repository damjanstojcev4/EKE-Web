import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Arrow } from "@/components/ui";
import ArticleContent, { ArticleTextRuns } from "@/components/news/ArticleContent";
import ArticleSidebar from "@/components/news/ArticleSidebar";
import ArticleShare from "@/components/news/ArticleShare";
import PendingControl from "@/components/news/PendingControl";
import { newsArticles, newsMedia, newsArticleHref, newsArticleLinkLabel } from "@/data/news.mock";
import styles from "./page.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return newsArticles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = newsArticles.find(record => record.slug === slug);
  return { title: article ? `${article.title} — EKE Bitola` : "News not found — EKE Bitola", description: article?.summary };
}

export default async function NewsDetailsPage({ params }: Props) {
  const { slug } = await params;
  const article = newsArticles.find(record => record.slug === slug);
  if (!article) notFound();
  const details = article.details;
  if (!details) return <div className={styles.page}>
    <Header /><main id="main" className={styles.pendingArticle}><h1>{article.title}</h1><p>The full article is awaiting verified content.</p><Link href="/news">Back to News</Link></main><Footer />
  </div>;

  const sidebar = details.sidebarIds.flatMap(id => newsArticles.filter(record => record.id === id));
  return <div className={styles.page}>
    <Header />
    <main id="main">
      <div className={styles.hero}><img src={details.heroImage} alt={article.imageAlt} width={1920} height={777} fetchPriority="high" /></div>
      <div className={styles.columns}>
        <article className={styles.article} aria-labelledby="article-title">
          <header className={styles.articleHeader}>
            <div className={styles.metadataRow}>
              <div className={styles.meta}><span aria-hidden="true" /><div><strong>{article.category}</strong><time dateTime={article.publishedAt}>{article.displayDate}</time></div></div>
              <ArticleShare title={article.title} image={details.heroImage} />
            </div>
            <h1 id="article-title">{article.title}</h1>
          </header>
          <p className={styles.introduction}><ArticleTextRuns runs={details.introduction} /></p>
          <div className={styles.body}><ArticleContent blocks={details.content} /></div>
        </article>
        <ArticleSidebar articles={sidebar} />
      </div>
      <section className={styles.otherNews} aria-labelledby="other-news-title">
        <h2 id="other-news-title">Other News</h2>
        <div className={styles.otherGrid}>{details.otherItems.map(item => {
          if (item.kind === "article") {
            const other = newsArticles.find(record => record.id === item.id);
            return other && <article key={item.id}><h3><Link href={newsArticleHref(other)} prefetch={false}>{item.displayTitle}</Link></h3><Link className={styles.otherArrow} href={newsArticleHref(other)} prefetch={false} aria-label={newsArticleLinkLabel(other)}><Arrow file="vector12.svg" /></Link></article>;
          }
          const media = newsMedia.find(record => record.id === item.id);
          return media && <article key={item.id}><h3>{item.displayTitle}</h3><PendingControl className={styles.otherArrow} label={`${media.title} (unavailable)`} message="The podcast destination has not been supplied."><Arrow file="vector12.svg" /></PendingControl></article>;
        })}</div>
        <div className={styles.pagination} aria-label="Other news pages">{[1,2,3].map(n => <PendingControl key={n} label={`Other news page ${n}${n === 1 ? " (current)" : " (unavailable)"}`} message={n === 1 ? "All supplied items are shown." : "Additional news items have not been supplied."}><span className={n === 1 ? styles.activeDot : styles.dot} /></PendingControl>)}</div>
        <div className={styles.blueLine} aria-hidden="true" />
      </section>
    </main>
    <Footer />
  </div>;
}
