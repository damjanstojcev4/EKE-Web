import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface ProjectDetailData {
  uuid: string;
  title: string;
  budget: number | string;
  description: string;
  image: string;
  quickSummary: string;

  // support both
  durationDate?: string;      // legacy / single date
  startDate?: string;         // YYYY-MM-DD
  endDate?: string;           // YYYY-MM-DD

  partners: string[] | string;
  status: "ON_GOING" | "PAST";
  pdfUrl?: string;
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
};

const ProjectDetail: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [project, setProject] = useState<ProjectDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!uuid) {
      setError("Project ID is missing");
      setLoading(false);
      return;
    }

    const loadProject = async () => {
      try {
        const res = await fetch(`/api/projects/get/${uuid}`);
        if (!res.ok) throw new Error(`Failed to load project ${uuid}`);
        const data = await res.json();
        setProject(data);
      } catch (e: any) {
        console.error(e);
        setError(e.message || "Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    window.scrollTo(0, 0);
    loadProject();
  }, [uuid]);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="h-5 w-96 bg-gray-200 rounded animate-pulse mb-8" />
          <div className="h-80 bg-gray-200 rounded-lg animate-pulse mb-6" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen pt-40 px-6">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/projects"
            className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>
          <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error || "Project not found"}
          </div>
        </div>
      </div>
    );
  }

  const partners = Array.isArray(project.partners)
    ? project.partners
    : project.partners
    ? project.partners.split(",").map((p) => p.trim())
    : [];

  const durationLabel =
    project.startDate && project.endDate
      ? `${formatDate(project.startDate)} – ${formatDate(project.endDate)}`
      : project.durationDate
      ? formatDate(project.durationDate)
      : "—";

  return (
    <div className="bg-gradient-to-b from-teal-50 to-white min-h-screen pt-40 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/projects"
          className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Link>

        <h1 className="text-4xl font-bold mb-3 text-gray-900">
          {project.title}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {project.quickSummary}
        </p>

        {/* Image */}
        <div className="w-full flex justify-center mb-8">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full max-w-3xl rounded-lg shadow-md bg-white"
            />
          ) : (
            <div className="w-full max-w-3xl h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              No image available
            </div>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-sm font-semibold mb-2">Budget</h3>
            <p className="text-xl font-bold">
              {typeof project.budget === "number"
                ? `€${project.budget.toLocaleString()}`
                : project.budget}
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-sm font-semibold mb-2">Duration</h3>
            <p className="text-xl font-bold">{durationLabel}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-sm font-semibold mb-2">Status</h3>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                project.status === "ON_GOING"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {project.status === "ON_GOING" ? "Ongoing" : "Completed"}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg p-8 shadow mb-12">
          <h2 className="text-2xl font-bold mb-4">Project Description</h2>
          <p className="text-gray-700 whitespace-pre-line">
            {project.description}
          </p>
        </div>

        {/* Partners */}
        {partners.length > 0 && (
          <div className="bg-white rounded-lg p-8 shadow mb-12">
            <h2 className="text-2xl font-bold mb-4">Partners</h2>
            <ul className="list-disc pl-5 space-y-2">
              {partners.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        )}

        {/* PDF */}
        {project.pdfUrl && (
          <div className="text-center">
            <a
              href={project.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              View Project PDF
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
