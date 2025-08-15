import { Link } from "react-router-dom";

interface ProjectCardProps {
  uuid: string;
  title: string;
  quickSummary: string;
  durationDate: string;
  image: string;
  status: "ON_GOING" | "PAST";
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  uuid,
  title,
  quickSummary,
  durationDate,
  image,
  status,
}) => {
  return (
    <Link to={`/project/${uuid}`} className="block">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-600 mb-2">{quickSummary}</p>
          <p className="text-sm text-gray-500">Duration: {durationDate}</p>
          <span
            className={`inline-block mt-2 px-5 py-2 text-sm rounded ${
              status === "ON_GOING" ? "bg-green-100 text-green-700" : "bg-red-600/80 text-white"
            }`}
          >
            {status === "ON_GOING" ? "Ongoing" : "Past"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
