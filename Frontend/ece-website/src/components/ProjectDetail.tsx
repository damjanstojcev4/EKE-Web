import { useEffect, useState } from "react";
import { useParams} from "react-router-dom";

interface ProjectDetailData {
  uuid: string;
  title: string;
  budget: number;
  description: string;
  image: string;
  quickSummary: string;
  durationDate: string;
  partners: string[];
  status: "ON_GOING" | "PAST";
  pdfUrl?: string;
}

const ProjectDetail: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [project, setProject] = useState<ProjectDetailData | null>(null);

  useEffect(() => {
    if (!uuid) return;
    fetch(`http://localhost:8080/get/${uuid}`)
      .then((res) => res.json())
      .then((data) => setProject(data))
      .catch((err) => console.error(err));
    window.scrollTo(0, 0);
  }, [uuid]);

  if (!project) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-lg text-gray-500">
        Loading project details...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Title */}
        <h1 className="text-4xl font-bold mb-3 text-gray-900">{project.title}</h1>
        <p className="text-lg text-gray-600 mb-8">{project.quickSummary}</p>

        {/* Image */}
        <div className="w-full flex justify-center mb-5">
            <img
                src={`http://localhost:8080${project.image}`}
                alt={project.title}
                className="w-full max-w-3xl h-auto rounded-lg shadow-md object-contain"
            />
            </div>
        {/* Project Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-stone-200 rounded-lg p-6 shadow">
            <h3 className="text-sm font-semibold text-gray-950">Budget</h3>
            <p className="text-xl font-bold text-gray-950">€{project.budget}</p>
          </div>
          <div className="bg-stone-200 rounded-lg p-6 shadow">
            <h3 className="text-sm font-semibold text-gray-950">Duration</h3>
            <p className="text-xl font-bold text-gray-950">{project.durationDate}</p>
          </div>
          <div className="bg-stone-200 rounded-lg p-6 shadow">
            <h3 className="text-sm font-semibold text-gray-950 mb-4">Status</h3>
            <span
              className={`px-7 py-2 rounded-full text-base font-semibold ${
                project.status === "ON_GOING"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-500 text-white"
              }`}
            >
              {project.status === "ON_GOING" ? "Ongoing" : "Past"}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg p-8 shadow mb-12">
          <h2 className="text-2xl font-bold mb-4">Project Description</h2>
          <p className="text-gray-700 leading-relaxed">{project.description}</p>
        </div>

        {/* Partners */}
        {project.partners.length > 0 && (
          <div className="bg-white rounded-lg p-8 shadow mb-12">
            <h2 className="text-2xl font-bold mb-4">Partners</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {project.partners.map((partner, index) => (
                <li key={index}>{partner}</li>
              ))}
            </ul>
          </div>
        )}

        {/* PDF Link */}
        {project.pdfUrl && (
            <div className="text-center">
                <a
                href={`http://localhost:8080${project.pdfUrl}`}
                download // ← this makes it download instead of just open
                className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
                >
                Download Project PDF
                </a>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
