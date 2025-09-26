import React, { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import SkeletonLoader from "./utils/SkeletonLoader";
import { motion } from "framer-motion";

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

      data.sort(
        (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

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

  if (loading) return <SkeletonLoader />;

  return (
    <div className="min-h-screen bg-gray-50 pt-36 px-6 pb-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-12 text-center text-blue-900">
          Our Projects
        </h1>

        {projects.length === 0 ? (
          <p className="text-gray-600 text-center">No projects found.</p>
        ) : (
          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
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
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Projects;
