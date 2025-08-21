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

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "ON_GOING" | "PAST">("ALL");

  useEffect(() => {
    fetch("/api/projects/")
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

  const filteredProjects = projects.filter((project) => {
    if (filter === "ALL") {
      return true;
    }
    return project.status === filter;
  });

  return (
    <section className="bg-gray-100 py-16 px-4 pt-40">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Our Projects
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Explore our recent and past projects, showcasing our dedication and
            the partnerships that make them possible.
          </p>
        </div>

        <div className="flex justify-center space-x-4 mb-10">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${
              filter === "ALL" ? "bg-cyan-800 text-white shadow-lg" : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setFilter("ON_GOING")}
            className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${
              filter === "ON_GOING" ? "bg-cyan-800 text-white shadow-lg" : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            On-Going
          </button>
          <button
            onClick={() => setFilter("PAST")}
            className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${
              filter === "PAST" ? "bg-cyan-800 text-white shadow-lg" : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            Past Projects
          </button>
        </div>

        {loading ? (
          <SkeletonLoader count={6} type="card" />
        ) : filteredProjects.length === 0 ? (
          <p className="text-center text-gray-600">
            No projects found for this selection.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProjects.map((project) => (
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
        )}
      </div>
    </section>
  );
};

export default Projects;