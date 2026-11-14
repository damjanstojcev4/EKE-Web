import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Arrow, Stripe } from "@/components/ui";
import { projects } from "@/data/projects.mock";
import ProjectImage from "@/components/project-details/ProjectImage";
import styles from "./page.module.css";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((record) => record.slug === slug);
  return {
    title: project
      ? `${project.details?.title ?? project.title.replaceAll("\n", " ")} — EKE Bitola`
      : "Project not found — EKE Bitola",
  };
}
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((record) => record.slug === slug);
  if (!project) notFound();
  const details = project.details;
  if (!details)
    return (
      <div className={styles.page}>
        <Header />
        <main id="main" className={styles.pending}>
          <h1>{project.title}</h1>
          <p>Project details are pending verified content.</p>
          <Link href="/projects">Back to Projects</Link>
        </main>
        <Footer />
      </div>
    );
  return (
    <div className={styles.page}>
      <Header />
      <main id="main">
        <section className={styles.hero} aria-labelledby="project-title">
          <div className={styles.artwork} aria-hidden="true">
            <img src="/assets/project-details/Group.svg" alt="" />
          </div>
          <p className={styles.label}>Project details</p>
          <h1 id="project-title">{details.title}</h1>
          <div className={styles.facts}>
            <Stripe />
            <dl className={styles.firstRow}>
              <div>
                <dt>Programme</dt>
                <dd>{details.programme}</dd>
              </div>
              <div>
                <dt>Project Status</dt>
                <dd className={styles.status}>{project.status}</dd>
              </div>
              <div className={styles.dates}>
                <div>
                  <dt>Start date</dt>
                  <dd>{details.startDate}</dd>
                </div>
                <div>
                  <dt>End date</dt>
                  <dd>{details.endDate}</dd>
                </div>
              </div>
              <div>
                <dt>EU Grant</dt>
                <dd>{details.grant}</dd>
              </div>
              <div>
                <dt>Countries covered</dt>
                <dd>{details.countries}</dd>
              </div>
            </dl>
            <dl className={styles.secondRow}>
              <div>
                <dt>Key Action</dt>
                <dd>{details.keyAction}</dd>
              </div>
              <div>
                <dt>Action Type</dt>
                <dd>{details.actionType}</dd>
              </div>
              <div>
                <dt>Website</dt>
                <dd>
                  <a href={`https://${details.website}`}>{details.website}</a>
                </dd>
              </div>
            </dl>
            <div className={styles.topics}>
              <p>Topics</p>
              <ul>
                {details.topics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <section className={styles.summary} aria-labelledby="summary-heading">
          <div className={styles.summaryInner}>
            <div className={styles.logo}>
              <ProjectImage
                src={details.logo}
                alt="DISERA — Disinformation of Seniors in Rural Areas"
                width={325}
                height={131}
              />
            </div>
            <div>
              <h2 id="summary-heading">Summary</h2>
              <p>{details.summary}</p>
            </div>
          </div>
        </section>
        <div className={styles.narrative}>
          {details.sections.map((section) => (
            <section
              className={styles.textSection}
              key={section.title}
              aria-labelledby={section.title.toLowerCase()}
            >
              <h2 id={section.title.toLowerCase()}>{section.title}</h2>
              <div>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
        <div className={styles.resources}>
          <section
            className={styles.partners}
            aria-labelledby="partners-heading"
          >
            <div>
              <h2 id="partners-heading">Partners</h2>
              <p>{details.partnerNote}</p>
            </div>
            <div
              className={styles.partnerGrid}
              aria-label="Partner logo placeholders from the design; confirmed partners pending"
            >
              {Array.from({ length: 8 }, (_, index) => (
                <div key={index}>
                  <ProjectImage
                    src={details.partnerArtwork}
                    alt="Partner logo placeholder"
                    width={129}
                    height={131}
                  />
                </div>
              ))}
            </div>
          </section>
          <section
            className={styles.download}
            aria-labelledby="download-heading"
          >
            <div>
              <h2 id="download-heading">Download</h2>
              <p>
                Project card · <strong>English (PDF)</strong>
              </p>
            </div>
            <div>
              <p>{details.downloadDescription}</p>
              {details.documentUrl ? (
                <a
                  className={styles.downloadButton}
                  href={details.documentUrl}
                  download
                >
                  Download PDF <Arrow file="vector4.svg" down />
                </a>
              ) : (
                <div className={styles.unavailable}>
                  <button
                    className={styles.downloadButton}
                    aria-disabled="true"
                    aria-describedby="pdf-unavailable"
                  >
                    Download PDF <Arrow file="vector4.svg" down />
                  </button>
                  <span id="pdf-unavailable" role="tooltip">
                    Project PDF has not been supplied.
                  </span>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
