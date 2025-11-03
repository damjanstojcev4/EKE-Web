import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import SkeletonLoader from "./utils/SkeletonLoader";

interface Project {
  uuid: string;
  title: string;
  quickSummary: string;
  durationDate: string;
  image: string;
  status: "ON_GOING" | "PAST";
}

const RecentProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects/recent");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <SkeletonLoader/>
  }

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto">
      <h2 className="text-[clamp(2rem,6vw,3.5rem)] font-bold pb-8 mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-blue-600">
        Recent Projects
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ProjectCard
            key={project.uuid}
            uuid={project.uuid}
            title={project.title}
            quickSummary={project.quickSummary}
            durationDate={project.durationDate}
            image={project.image}
            status={project.status}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentProjects;
