import React from "react";
import { useNavigate } from "react-router-dom";

export interface ProjectCardProps {
  uuid: string;
  title: string;
  quickSummary: string;
  durationDate: string;
  image: string;
  status: "ON_GOING" | "PAST";
  onEdit?: () => void;
  onDelete?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  uuid,
  title,
  quickSummary,
  durationDate,
  image,
  status,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/project/${uuid}`);
  };

  return (
    <div
      className="rounded-xl shadow-lg overflow-hidden bg-white cursor-pointer hover:shadow-xl transition"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleCardClick();
      }}
    >
      <div className="w-full h-48 bg-gray-200">
        {image ? (
          <img src={image} alt={title} className="w-full h-48 object-cover" />
        ) : (
          <div className="w-full h-48 flex items-center justify-center text-gray-500">
            No image
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="text-gray-700 mt-1 line-clamp-3">{quickSummary}</p>
        <p className="text-gray-500 text-sm mt-2">{durationDate}</p>

        <div className="mt-3 flex items-center justify-between">
          <span
            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
              status === "ON_GOING" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {status === "ON_GOING" ? "Ongoing" : "Past"}
          </span>

          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500 transition text-white text-sm"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="px-3 py-1 bg-red-600 rounded hover:bg-red-500 transition text-white text-sm"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
