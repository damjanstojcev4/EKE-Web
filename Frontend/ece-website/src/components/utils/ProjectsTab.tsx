import { useEffect, useState } from "react";
import ProjectCard from "../ProjectCard";

interface Project {
  uuid: string;
  title: string;
  description: string;
  quickSummary: string;
  budget: number;
  durationDate: string;
  partners: string;
  status: "ON_GOING" | "PAST";
  image: string;
}

const ProjectsTab = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/projects/", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  const handleDelete = async (uuid: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    await fetch(`/api/projects/${uuid}`, {
      method: "DELETE",
      credentials: "include",
    });
    setProjects((prev) => prev.filter((p) => p.uuid !== uuid));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Projects</h2>
      {projects.length === 0 ? (
        <p className="text-gray-600">No projects available.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.uuid} className="relative">
              <ProjectCard 
              key={project.uuid}
              uuid={project.uuid}
              title={project.title}
              quickSummary={project.quickSummary}
              durationDate={project.durationDate}
              image={project.image}
              status={project.status} />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleDelete(project.uuid)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                >
                  Delete
                </button>
                {/* 🔹 You can add Update button here */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsTab;
