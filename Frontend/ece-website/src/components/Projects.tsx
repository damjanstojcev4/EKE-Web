import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";

interface Project {
  uuid: string;
  title: string;
  quickSummary: string;
  durationDate: string;
  image: string;
  status: "ON_GOING" | "PAST";
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-200">
        <p className="text-gray-600 text-lg animate-pulse">
          Loading projects...
        </p>
      </div>
    );
  }

  return (
    <section className="bg-gray-200 py-16 px-4 pt-40">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Our Projects
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Explore all our recent and past projects. Each one reflects our
            dedication and the partnerships that make them possible.
          </p>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <p className="text-center text-gray-600">No projects found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project) => (
              <div
                key={project.uuid}
                className="transform transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <ProjectCard
                  uuid={project.uuid}
                  title={project.title}
                  quickSummary={project.quickSummary}
                  durationDate={project.durationDate}
                  image={`http://localhost:8080${project.image}`}
                  status={project.status}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
