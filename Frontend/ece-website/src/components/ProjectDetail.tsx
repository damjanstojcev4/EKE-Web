import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SkeletonLoader from "./utils/SkeletonLoader";

interface ProjectDetail {
  uuid: string;
  title: string;
  budget: number;
  description: string;
  image: string;
  quickSummary: string;
  durationDate: string;
  partners: string[];
  status: "ON_GOING" | "PAST";
  pdfUrl: string;
}

const ProjectDetail = () => {
  const { uuid } = useParams();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/get/${uuid}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch project:", err);
        setLoading(false);
      });
  }, [uuid]);

  if (loading) return <SkeletonLoader type="detail" />;

  if (!project) return <p className="text-center text-gray-600">Project not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Project Image */}
      <img
        src={`http://localhost:8080${project.image}`}
        alt={project.title}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />

      {/* Project Info */}
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <p className="text-gray-700 mb-4">{project.description}</p>
      <p className="text-gray-600">Duration: {project.durationDate}</p>
      <p className="text-gray-600">Budget: ${project.budget}</p>

      {/* Partners */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Partners</h2>
      <ul className="list-disc pl-6 text-gray-700">
        {project.partners.map((partner, idx) => (
          <li key={idx}>{partner}</li>
        ))}
      </ul>

      {/* PDF Button */}
      {project.pdfUrl && (
        <a
          href={`http://localhost:8080${project.pdfUrl}`}
          download
          className="mt-6 inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Download PDF
        </a>
      )}
    </div>
  );
};

export default ProjectDetail;
