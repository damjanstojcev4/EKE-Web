"use client";
import { useState } from "react";
import { useApi } from "@/lib/api/use-api";
import type { ProjectRecord } from "@/lib/api/projects";
import ProjectCard from "./ProjectCard";

const filters = [
  { id: "ongoing", label: "Ongoing" },
  { id: "completed", label: "Past" },
] as const;
export default function ProjectsList() {
  const [filter, setFilter] =
    useState<(typeof filters)[number]["id"]>("ongoing");
  const { data: projects, error } = useApi<ProjectRecord[]>("/projects/public");
  const visible = (projects || []).filter(
    (project) =>
      (project.status === "ON_GOING" ? "ongoing" : "completed") === filter,
  );
  return (
    <section
      className={[
        "grid [grid-template-columns:calc(326*var(--u))_minmax(0,_1fr)] [margin:0_calc(80*var(--u))] pt-[calc(50*var(--u))] pb-[calc(118*var(--u))]",
        "[@media(min-width:1101px)]:[grid-template-columns:calc(327*var(--u))_minmax(0,_1fr)] [@media(min-width:1101px)]:pb-[calc(122*var(--u))]",
        "[@media(max-width:1100px)]:[grid-template-columns:1fr] [@media(max-width:1100px)]:gap-[25px]",
        "[@media(max-width:700px)]:[margin:0_24px] [@media(max-width:700px)]:[padding:30px_0_60px]",
      ].join(" ")}
      aria-label="Projects"
    >
      <div
        className={[
          "sticky top-[calc(145*var(--u))] [align-self:start] z-[5] flex flex-col items-start gap-[calc(12*var(--u))]",
          "[@media(max-width:1100px)]:top-[104px] [@media(max-width:1100px)]:[padding-block:12px] [@media(max-width:1100px)]:bg-surface-muted [@media(max-width:1100px)]:flex-row [@media(max-width:1100px)]:gap-[25px]",
          "[@media(max-width:700px)]:flex-wrap [@media(max-width:700px)]:gap-[12px_20px]",
        ].join(" ")}
        role="group"
        aria-label="Filter projects by status"
      >
        {filters.map((item) => (
          <button
            className={[
              "[padding:0_0_0_calc(29*var(--u))] [border:0] bg-transparent text-brand-navy text-[length:calc(28*var(--u))]! leading-[calc(37*var(--u))]! font-bold! uppercase relative [&::before]:[content:''] [&::before]:absolute [&::before]:left-0 [&::before]:top-[calc(8*var(--u))] [&::before]:w-[calc(13*var(--u))] [&::before]:h-[calc(13*var(--u))] [&::before]:[background:currentColor] [&[aria-pressed=true]]:text-brand-blue! [&:hover]:text-brand-blue!",
              "[@media(max-width:1100px)]:text-[16px]! [@media(max-width:1100px)]:leading-[24px]! [@media(max-width:1100px)]:pl-[18px] [@media(max-width:1100px)]:[&::before]:w-[8px] [@media(max-width:1100px)]:[&::before]:h-[8px] [@media(max-width:1100px)]:[&::before]:top-[7px]",
              "[@media(max-width:700px)]:text-[14px]!",
            ].join(" ")}
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
      <div id="project-results" className="min-w-0">
        <p
          className="absolute w-[1px] h-[1px] overflow-hidden [clip-path:inset(50%)]"
          role="status"
        >
          {visible.length} projects shown.
        </p>
        {visible.map((project) => (
          <ProjectCard key={project.uuid} project={project} />
        ))}
        {error && <p role="alert">{error}</p>}
        {!projects && !error && <p role="status">Loading projects…</p>}
        {projects && !visible.length && (
          <p className="[padding:calc(45*var(--u))_0] text-[length:clamp(18px,_2vw,_32px)] min-h-[280px]">
            No projects match this filter.
          </p>
        )}
      </div>
    </section>
  );
}
