"use client";
import { useState } from "react";
import { useApi } from "@/lib/api/use-api";
import type { ProjectRecord } from "@/lib/api/projects";
import ProjectCard from "./ProjectCard";
import styles from "@/app/projects/page.module.css";

const filters = [
  { id: "ongoing", label: "Ongoing" },
  { id: "completed", label: "Past" },
] as const;
export default function ProjectsList() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("ongoing");
  const { data: projects, error } = useApi<ProjectRecord[]>("/projects/public");
  const visible = (projects || []).filter(
    (project) => (project.status === "ON_GOING" ? "ongoing" : "completed") === filter,
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
          <ProjectCard key={project.uuid} project={project} />
        ))}
        {error && <p role="alert">{error}</p>}
        {!projects && !error && <p role="status">Loading projects…</p>}
        {projects && !visible.length && (
          <p className={styles.empty}>No projects match this filter.</p>
        )}
      </div>
    </section>
  );
}
