import React from "react";

interface ProjectCardProps {
  uuid: string;
  title: string;
  quickSummary: string;
  durationDate: string;
  image: string;
  status: "ON_GOING" | "PAST";
  onEdit?: () => void;
  onDelete?: () => void;
}

const ProjectCard = ({
  title,
  quickSummary,
  durationDate,
  image,
  status,
  onEdit,
  onDelete,
}: ProjectCardProps) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-gray-400">{quickSummary}</p>
        <p className="text-gray-500 text-sm mb-2">{durationDate}</p>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500 transition text-white"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-3 py-1 bg-red-600 rounded hover:bg-red-500 transition text-white"
            >
              Delete
            </button>
          )}
        </div>
        <span
          className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
            status === "ON_GOING" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {status === "ON_GOING" ? "Ongoing" : "Past"}
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;
