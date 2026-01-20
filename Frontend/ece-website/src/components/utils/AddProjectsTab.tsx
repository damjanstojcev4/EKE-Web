import { useState, useEffect } from "react";
import type { FormEvent } from "react";

interface Project {
  uuid: string;
  title: string;
  budget: number;
  description: string;
  quickSummary: string;
  startDate?: string;
  endDate?: string;
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
  // Use strings for form inputs, convert budget to number on submit
  const [formData, setFormData] = useState({
    title: "",
    budget: "",
    description: "",
    quickSummary: "",
    startDate: "",
    endDate: "",
    partners: "",
    status: "ON_GOING",
  });

  const [image, setImage] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);

  // Fill form if editing
  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        title: projectToEdit.title,
        budget: String(projectToEdit.budget),
        description: projectToEdit.description,
        quickSummary: projectToEdit.quickSummary,
        startDate: projectToEdit.startDate ?? "",
        endDate: projectToEdit.endDate ?? "",
        partners: projectToEdit.partners,
        status: projectToEdit.status,
      });
    }
  }, [projectToEdit]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data = new FormData();

    // Convert budget to number for backend
    Object.entries({ ...formData, budget: Number(formData.budget) }).forEach(
      ([key, value]) => data.append(key, value as any)
    );

    if (image) data.append("image", image);
    if (pdf) data.append("pdf", pdf);

    try {
      const url = projectToEdit
        ? `/api/projects/${projectToEdit.uuid}`
        : "/api/projects";
      const method = projectToEdit ? "PUT" : "POST";

      await fetch(url, {
        method,
        body: data,
        credentials: "include",
      });

      alert(projectToEdit ? "Project updated!" : "Project added!");

      setFormData({
        title: "",
        budget: "",
        description: "",
        quickSummary: "",
        startDate: "",
        endDate: "",
        partners: "",
        status: "ON_GOING",
      });
      setImage(null);
      setPdf(null);
      onSaved?.();
    } catch (err) {
      console.error(err);
      alert("Failed to save project");
    }
  };

  const inputStyle =
    "w-full p-3 rounded bg-gray-200 text-black placeholder-gray-500 focus:outline-none";

  return (
    <div className="p-6 pb-24">
      <h2 className="text-2xl font-semibold mb-6 text-black">
        {projectToEdit ? "Update Project" : "Add New Project"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gray-400 p-6 rounded-xl shadow-lg mb-12"
      >
        <input
          type="text"
          placeholder="Project Title"
          className={inputStyle}
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          required
        />

        <input
          type="number"
          step="1"
          min="0"
          placeholder="Budget (€)"
          className={inputStyle}
          value={formData.budget}
          onChange={(e) =>
            setFormData({ ...formData, budget: e.target.value })
          }
          required
        />

        <textarea
          placeholder="Description"
          className={inputStyle}
          rows={4}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />

        <textarea
          placeholder="Quick Summary"
          className={inputStyle}
          rows={2}
          value={formData.quickSummary}
          onChange={(e) =>
            setFormData({ ...formData, quickSummary: e.target.value })
          }
          required
        />

        {/* Start & End Dates */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            className={inputStyle}
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
          />
          <input
            type="date"
            className={inputStyle}
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
          />
        </div>

        <input
          type="text"
          placeholder="Partners (comma separated)"
          className={inputStyle}
          value={formData.partners}
          onChange={(e) =>
            setFormData({ ...formData, partners: e.target.value })
          }
        />

        <select
          className={inputStyle}
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value })
          }
        >
          <option value="ON_GOING">Ongoing</option>
          <option value="PAST">Past</option>
        </select>

        {/* File uploads */}
        <div className="space-y-4">
          <label className="block font-medium text-gray-300">Project Image</label>
          <label className="flex justify-center items-center px-6 py-3 bg-gray-200 text-black rounded-lg cursor-pointer hover:bg-gray-600 transition">
            {image ? image.name : projectToEdit?.image || "Select Image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </label>

          <label className="block font-medium text-gray-300">Project PDF</label>
          <label className="flex justify-center items-center px-6 py-3 bg-gray-200 text-black rounded-lg cursor-pointer hover:bg-gray-600 transition">
            {pdf ? pdf.name : projectToEdit?.pdf || "Select PDF"}
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setPdf(e.target.files?.[0] || null)}
            />
          </label>
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
