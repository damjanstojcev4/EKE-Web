import { useState, useEffect } from "react";
import type { FormEvent } from "react";

interface Project {
  uuid: string;
  title: string;
  budget: string;
  description: string;
  quickSummary: string;
  durationDate: string;
  partners: string;
  status: "ON_GOING" | "PAST";
  image: string;
  pdf: string;
}

interface AddProjectsTabProps {
  projectToEdit?: Project;
  onSaved?: () => void;
}

const AddProjectsTab = ({ projectToEdit, onSaved }: AddProjectsTabProps) => {
  const [formData, setFormData] = useState({
    title: "",
    budget: "",
    description: "",
    quickSummary: "",
    durationDate: "",
    partners: "",
    status: "ON_GOING",
  });
  const [image, setImage] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);

  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        title: projectToEdit.title,
        budget: projectToEdit.budget,
        description: projectToEdit.description,
        quickSummary: projectToEdit.quickSummary,
        durationDate: projectToEdit.durationDate,
        partners: projectToEdit.partners,
        status: projectToEdit.status,
      });
    }
  }, [projectToEdit]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      data.append(key, value as string)
    );
    if (image) data.append("image", image);
    if (pdf) data.append("pdf", pdf);

    try {
      if (projectToEdit) {
        await fetch(`/api/projects/${projectToEdit.uuid}`, {
          method: "PUT",
          body: data,
          credentials: "include",
        });
        alert("Project updated!");
      } else {
        await fetch("/api/projects", {
          method: "POST",
          body: data,
          credentials: "include",
        });
        alert("Project added!");
      }

      setFormData({
        title: "",
        budget: "",
        description: "",
        quickSummary: "",
        durationDate: "",
        partners: "",
        status: "ON_GOING",
      });
      setImage(null);
      setPdf(null);

      if (onSaved) onSaved();
    } catch (err) {
      console.error(err);
      alert("Failed to save project");
    }
  };

  return (
    <div className="p-6 pb-24">
      <h2 className="text-2xl font-semibold mb-6 text-white">
        {projectToEdit ? "Update Project" : "Add New Project"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gray-800 p-6 rounded-xl shadow-lg mb-12"
      >
        <input
          type="text"
          placeholder="Project Title"
          className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Budget (€)"
          className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={4}
          required
        />
        <textarea
          placeholder="Quick Summary"
          className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
          value={formData.quickSummary}
          onChange={(e) =>
            setFormData({ ...formData, quickSummary: e.target.value })
          }
          rows={2}
          required
        />
        <input
          type="text"
          placeholder="Duration Date"
          className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
          value={formData.durationDate}
          onChange={(e) =>
            setFormData({ ...formData, durationDate: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Partners (comma separated)"
          className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
          value={formData.partners}
          onChange={(e) =>
            setFormData({ ...formData, partners: e.target.value })
          }
        />
        <select
          className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value })
          }
        >
          <option value="ON_GOING">Ongoing</option>
          <option value="PAST">Past</option>
        </select>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Project Image
            </label>
            <label className="w-full flex justify-center items-center px-6 py-3 bg-gray-700 text-white rounded-lg cursor-pointer hover:bg-gray-600 transition">
              {image ? image.name : projectToEdit?.image || "Select Image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-1">Project PDF</label>
            <label className="w-full flex justify-center items-center px-6 py-3 bg-gray-700 text-white rounded-lg cursor-pointer hover:bg-gray-600 transition">
              {pdf ? pdf.name : projectToEdit?.pdf || "Select PDF"}
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => setPdf(e.target.files?.[0] || null)}
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition text-white font-semibold"
        >
          {projectToEdit ? "Update Project" : "Add Project"}
        </button>
      </form>
    </div>
  );
};

export default AddProjectsTab;
