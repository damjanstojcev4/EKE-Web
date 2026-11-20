"use client";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Stripe } from "@/components/ui";
import ArticleContent from "@/components/news/ArticleContent";
import { articleBlocks } from "@/lib/api/news";
import { useApi } from "@/lib/api/use-api";
import { externalUrl, mediaUrl } from "@/lib/api/client";
import type { ProjectRecord } from "@/lib/api/projects";
import styles from "@/app/projects/[slug]/page.module.css";
export default function PublicProject({ slug }: { slug: string }) {
  const { data: p, error } = useApi<ProjectRecord>(
    `/projects/slug/${encodeURIComponent(slug)}`,
  );
  const logo =
    p?.logoFilePath &&
    mediaUrl(`/api/uploads/images/${encodeURIComponent(p.logoFilePath)}`);
  function references(
    value: string | null | undefined,
  ): {
    name?: string;
    title?: string;
    url: string;
    alt?: string;
    description?: string;
  }[] {
    try {
      const items = JSON.parse(value || "[]");
      return Array.isArray(items) ? items : [];
    } catch {
      return [];
    }
  }
  return (
    <div className={styles.page}>
      <Header />
      <main id="main">
        {error ? (
          <div className={styles.pending}>
            <h1>Project unavailable</h1>
            <p role="alert">{error}</p>
            <Link href="/projects/">Back to Projects</Link>
          </div>
        ) : !p ? (
          <p role="status">Loading project…</p>
        ) : (
          <>
            <section className={styles.hero}>
              <div className={styles.artwork} aria-hidden="true">
                <img src="/assets/project-details/Group.svg" alt="" />
              </div>
              <p className={styles.label}>Project details</p>
              <h1>{p.title}</h1>
              <div className={styles.facts}>
                <Stripe />
                <dl className={styles.firstRow}>
                  {[
                    ["Programme", p.programme],
                    [
                      "Project status",
                      p.status === "ON_GOING" ? "Ongoing" : "Past",
                    ],
                    ["Start date", p.startDate],
                    ["End date", p.endDate],
                    [
                      "Grant",
                      p.grantValue === null
                        ? null
                        : `${p.grantValue} ${p.currency || ""}`,
                    ],
                    ["Countries covered", p.countries],
                  ]
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                </dl>
                <dl className={styles.secondRow}>
                  {[
                    ["Key action", p.keyAction],
                    ["Action type", p.actionType],
                  ]
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  {externalUrl(p.website) && (
                    <div>
                      <dt>Website</dt>
                      <dd>
                        <a href={externalUrl(p.website)}>{p.website}</a>
                      </dd>
                    </div>
                  )}
                </dl>
                {p.topics && (
                  <div className={styles.topics}>
                    <p>Topics</p>
                    <ul>
                      {p.topics.split(",").map((t) => (
                        <li key={t}>{t.trim()}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
            <section className={styles.summary}>
              <div className={styles.summaryInner}>
                {logo && (
                  <div className={styles.logo}>
                    <img src={logo} alt={`${p.title} logo`} />
                  </div>
                )}
                <div>
                  <h2>Summary</h2>
                  <p>
                    {p.description ||
                      p.quickSummary ||
                      "Further project information has not been supplied."}
                  </p>
                </div>
              </div>
            </section>
            <div className={styles.narrative}>
              <ArticleContent blocks={articleBlocks(p.contentJson)} />
            </div>
            <div className={styles.resources}>
              {(!!p.partners?.length ||
                !!references(p.partnerMediaJson).length) && (
                <section className={styles.partners}>
                  <h2>Partners</h2>
                  <ul>
                    {p.partners.map((partner) => (
                      <li key={partner}>{partner}</li>
                    ))}
                  </ul>
                  <div className={styles.partnerGrid}>
                    {references(p.partnerMediaJson).map((partner, index) => (
                      <div key={index}>
                        {mediaUrl(partner.url) && (
                          <img
                            src={mediaUrl(partner.url)}
                            alt={partner.alt || ""}
                            width={129}
                            height={131}
                          />
                        )}
                        <p>{partner.name}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              <section className={styles.download}>
                <div>
                  <h2>Download</h2>
                  <p>{p.downloadDescription}</p>
                </div>
                {mediaUrl(p.pdfUrl) ? (
                  <a
                    className={styles.downloadButton}
                    href={mediaUrl(p.pdfUrl)}
                    download
                  >
                    Download PDF
                  </a>
                ) : (
                  <p>No project document has been supplied.</p>
                )}
                <div>
                  {references(p.resourcesJson).map((resource, index) => (
                    <article key={index}>
                      <h3>{resource.title}</h3>
                      <p>{resource.description}</p>
                      {mediaUrl(resource.url) && (
                        <a href={mediaUrl(resource.url)} download>
                          Download {resource.title}
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
