import React, { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import SkeletonLoader from "./utils/SkeletonLoader";

interface Project {
  uuid: string;
  title: string;
  budget: string;
  description: string;
  quickSummary: string;
  durationDate: string;
  partners: string;
  status: "ON_GOING" | "PAST";
  image: string;
  pdf: string;
  date: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
  try {
    const res = await fetch("/api/projects/");
    if (!res.ok) throw new Error("Failed to load projects");
    const data = await res.json();

    data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setProjects(data);
  } catch (e) {
    console.error(e);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) {
    return <SkeletonLoader/>
  }

  return (
    <div className="min-h-screen pt-40 px-6 pb-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-blue-900 text-center">Projects</h1>
        {projects.length === 0 ? (
          <p className="text-gray-600">No projects found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard
                key={p.uuid}
                uuid={p.uuid}
                title={p.title}
                quickSummary={p.quickSummary}
                durationDate={p.durationDate}
                image={p.image}
                status={p.status}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
