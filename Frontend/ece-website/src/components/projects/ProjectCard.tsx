import Link from "next/link";
import { mediaUrl } from "@/lib/api/client";
import { projectHref, type ProjectRecord } from "@/lib/api/projects";
import styles from "@/app/projects/page.module.css";
export default function ProjectCard({
  project: p,
}: {
  project: ProjectRecord;
}) {
  const href = projectHref(p.slug);
  return (
    <article className={styles.card}>
      {mediaUrl(p.image) && (
        <img
          className={styles.projectImage}
          src={mediaUrl(p.image)}
          alt={p.imageAlt || ""}
          width={420}
          height={287}
        />
      )}
      <div className={styles.projectInfo}>
        <h2>{p.title}</h2>
        <div className={styles.projectMeta}>
          <p>{p.status === "ON_GOING" ? "Ongoing" : "Past"}</p>
          <p>{[p.startDate, p.endDate].filter(Boolean).join(" – ")}</p>
        </div>
      </div>
      <div className={styles.projectCopy}>
        <p>{p.quickSummary || p.description}</p>
        {href ? (
          <Link className={styles.detailsLink} href={href}>
            Project Details
          </Link>
        ) : (
          <p>Detail page awaiting the next site update.</p>
        )}
      </div>
    </article>
  );
}
