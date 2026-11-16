import Image from "next/image";
import ContentBlock from "@/components/ContentBlock";
import { siteContent } from "@/content/site-content";
import { Button, Divider } from "../ui";
const news = [
  {
    title: "chessNewsHeading",
    body: "chessNewsBody",
    img: "news-accessible-chess.png",
    alt: "Chess pieces on a board",
    date: "Oct 6, 2026",
    iso: "2026-10-06",
    kind: "Latest News",
  },
  {
    title: "spainNewsHeading",
    body: "spainNewsBody",
    img: "news-spain-opportunity.png",
    alt: "Architecture in Spain",
    date: "Sep 10, 2026",
    iso: "2026-09-10",
    kind: "Open Call",
  },
  {
    title: "aiNewsHeading",
    body: "aiNewsBody",
    img: "news-ai-educator-training.png",
    alt: "Educators taking part in AI training",
    date: "Aug 13, 2026",
    iso: "2026-08-13",
    kind: "Latest News",
  },
] as const;
export default function NewsSection() {
  return (
    <section className="news" id="news">
      <div className="news-heading">
        <ContentBlock block={siteContent.newsLabel} />
        <ContentBlock block={siteContent.newsHeading} as="h2" />
        <ContentBlock block={siteContent.newsIntro} />
      </div>
      <div className="news-list">
        {news.map((n, i) => (
          <article
            className="news-item"
            key={n.title}
            aria-label={
              i === 1
                ? "Historical design entry: September 2026 opportunity, availability unverified"
                : undefined
            }
          >
            <div className="news-image">
              <Image
                src={"/assets/" + n.img}
                alt={n.alt}
                fill
                sizes="(max-width:768px) 100vw,40vw"
              />
            </div>
            <div className="news-copy">
              <div className="news-meta">
                <span aria-hidden="true" />
                <div>
                  <strong>{n.kind}</strong>
                  <time dateTime={n.iso}>{n.date}</time>
                </div>
              </div>
              <ContentBlock block={siteContent[n.title]} as="h3" />
              <ContentBlock block={siteContent[n.body]} />
            </div>
            <Divider />
          </article>
        ))}
        <div className="actions">
          <Button outline href="/news">
            View all news and resources
          </Button>
          <Button href="/opportunities">
            See upcoming opportunities
          </Button>
        </div>
      </div>
    </section>
  );
}
