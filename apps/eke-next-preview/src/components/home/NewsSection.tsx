import Image from "next/image";
import FigmaText from "../FigmaText";
import { Button, Divider } from "../ui";
import { existing } from "@/data/navigation";
const news = [
  {
    title: "2180:374",
    body: "2180:354",
    img: "news-accessible-chess.png",
    alt: "Chess pieces on a board",
    date: "Oct 6, 2026",
    iso: "2026-10-06",
    kind: "Latest News",
  },
  {
    title: "2196:48",
    body: "2196:46",
    img: "news-spain-opportunity.png",
    alt: "Architecture in Spain",
    date: "Sep 10, 2026",
    iso: "2026-09-10",
    kind: "Open Call",
  },
  {
    title: "2196:53",
    body: "2196:51",
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
        <FigmaText id="2196:41" />
        <FigmaText id="2196:42" as="h2" />
        <FigmaText id="2196:40" />
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
              <FigmaText id={n.title} as="h3" />
              <FigmaText id={n.body} />
            </div>
            <Divider />
          </article>
        ))}
        <div className="actions">
          <Button outline href={existing("/resources")}>
            View all news and resources
          </Button>
          <Button href={existing("/contact")}>
            See upcoming opportunities
          </Button>
        </div>
      </div>
    </section>
  );
}
