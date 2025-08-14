import type { FC, } from "react";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  uuid: string;
  title: string;
  quickSummary: string;
  durationDate: string;
  image: string;
  status: "ON_GOING" | "PAST";
}

const ProjectCard: FC<ProjectCardProps> = ({
  uuid,
  title,
  quickSummary,
  durationDate,
  image,
  status
}) => {
  const ribbonColor =
    status === "ON_GOING"
      ? "bg-green-700"
      : status === "PAST"
      ? "bg-yellow-500"
      : "bg-gray-400";

  return (
    <Link
      to={`/projects/${uuid}`}
      className="relative block bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
    >
      {/* Status Ribbon */}
      <div
        className={`absolute top-0 right-0 ${ribbonColor} text-white text-base font-semibold px-3 py-1 rounded-br-lg`}
      >
        {status.replace("_", " ")}
      </div>

      {/* Image */}
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
      />

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{quickSummary}</p>
        <p className="text-xs text-gray-500">{durationDate}</p>
      </div>
    </Link>
  );
};

export default ProjectCard;
