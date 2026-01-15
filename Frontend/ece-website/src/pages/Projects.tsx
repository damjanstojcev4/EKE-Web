import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Calendar, Users, ArrowLeft } from "lucide-react";

interface Project {
  uuid: string;
  title: string;
  quickSummary: string;
  durationDate: string;
  image: string;
  status: "ON_GOING" | "PAST";
  partners: string | string[];
  location?: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [coloredProject, setColoredProject] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects/");
      if (!res.ok) throw new Error("Failed to load projects");
      const data = await res.json();

      // ✅ BACKEND ALREADY SORTS BY START DATE
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

  const handleProjectClick = (uuid: string) => {
    navigate(`/project/${uuid}`);
  };

  const handleImageClick = (e: React.MouseEvent, uuid: string) => {
    e.stopPropagation();
    setColoredProject(coloredProject === uuid ? null : uuid);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-teal-50 to-white min-h-screen pt-40 pb-16 px-6">
      <div className="max-w-6xl mx-auto space-y-14">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-teal-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Our Projects</h1>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Discover the initiatives creating lasting positive change in
            communities worldwide.
          </p>
        </div>

        {/* Project List */}
        <div className="space-y-10">
          {projects.map((project) => (
            <div
              key={project.uuid}
              onClick={() => handleProjectClick(project.uuid)}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col md:flex-row transition hover:shadow-lg cursor-pointer"
            >
              {/* Image */}
              <div
                className="md:w-1/2"
                onClick={(e) => handleImageClick(e, project.uuid)}
              >
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className={`w-full h-64 object-cover transition-all duration-700 ${
                      coloredProject === project.uuid
                        ? "grayscale-0"
                        : "grayscale md:grayscale md:hover:grayscale-0"
                    }`}
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center text-gray-400 bg-gray-100">
                    No image available
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="p-6 flex flex-col justify-between md:w-1/2">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    {project.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {project.quickSummary}
                  </p>

                  <div className="flex flex-wrap gap-4 text-gray-500 text-sm">
                    {project.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-teal-600" />
                        {project.location}
                      </div>
                    )}

                    {project.durationDate && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-teal-600" />
                        {project.durationDate}
                      </div>
                    )}

                    {project.partners && (
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-teal-600" />
                        {Array.isArray(project.partners)
                          ? project.partners.join(", ")
                          : project.partners}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      project.status === "ON_GOING"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {project.status === "ON_GOING" ? "Ongoing" : "Completed"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-teal-50 border border-teal-100 rounded-xl text-center py-10 px-6 shadow-sm mt-16">
          <h3 className="text-gray-800 font-semibold text-lg mb-3">
            Partner With Us
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Interested in supporting our projects or collaborating on new
            initiatives? We welcome partnerships with individuals,
            organizations, and institutions dedicated to sustainable impact.
          </p>
          <Link
            to="/contact"
            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-500 transition"
          >
            Get Involved
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Projects;
