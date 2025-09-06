import React, { useEffect, useState } from "react";
import ProjectCard from "../ProjectCard";

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
  date: string
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
    return (
      <div className="min-h-screen pt-28 px-6">
        <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 px-6 pb-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Projects</h1>
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
