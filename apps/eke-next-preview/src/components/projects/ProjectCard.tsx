import type { Project } from "@/types/project";
import { Arrow } from "@/components/ui";
import EmphasizedText from "./EmphasizedText";
import { projectAsset } from "./content";
import styles from "@/app/projects/page.module.css";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={styles.card} aria-labelledby={`${project.id}-title`}>
      <img
        className={styles.projectImage}
        src={projectAsset(project.image)}
        alt={project.imageAlt}
        width={420}
        height={287}
      />
      <div className={styles.projectInfo}>
        <h2 id={`${project.id}-title`}>{project.title}</h2>
        <div className={styles.projectMeta}>
          <p>{project.status}</p>
          <p>{project.dates}</p>
        </div>
      </div>
      <div className={styles.projectCopy}>
        <p>
          <EmphasizedText
            text={project.description}
            phrases={[project.emphasis]}
          />
        </p>
        <div className={styles.pending}>
          <button
            type="button"
            aria-disabled="true"
            data-future-href={project.detailHref}
            aria-describedby={`${project.id}-pending`}
          >
            Project Details <Arrow file="vector12.svg" />
          </button>
          <span id={`${project.id}-pending`} role="tooltip">
            Project details will be available in a future phase.
          </span>
        </div>
      </div>
    </article>
  );
}
