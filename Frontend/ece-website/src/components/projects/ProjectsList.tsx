"use client";
import { useState } from "react";
import { projects } from "@/data/projects.mock";
import ProjectCard from "./ProjectCard";
import styles from "@/app/projects/page.module.css";

const filters = [
  { id: "all", label: "All Projects" },
  { id: "ongoing", label: "Ongoing" },
  { id: "completed", label: "Past" },
] as const;
export default function ProjectsList() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const visible = projects.filter(
    (project) => filter === "all" || project.status === filter,
  );
  return (
    <section className={styles.listing} aria-label="Projects">
      <div
        className={styles.filters}
        role="group"
        aria-label="Filter projects by status"
      >
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={filter === item.id}
            aria-controls="project-results"
            onClick={() => setFilter(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div id="project-results" className={styles.results}>
        <p className={styles.srOnly} role="status">
          {visible.length} projects shown.
        </p>
        {visible.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        {!visible.length && (
          <p className={styles.empty}>No ongoing projects in this preview.</p>
        )}
        {!!visible.length && (
          <div className={`${styles.pending} ${styles.more}`}>
            <button
              type="button"
              aria-disabled="true"
              aria-describedby="more-projects-status"
            >
              View more projects
            </button>
            <span id="more-projects-status" role="tooltip">
              All five reference projects are shown. More projects will be
              available after backend integration.
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
