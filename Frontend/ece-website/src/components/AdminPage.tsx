import { useState } from "react";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<"projects" | "messages" | "add">(
    "projects"
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 px-6">
      <h1 className="text-4xl font-bold text-center mb-10 pt-20">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-10">
        <button
          onClick={() => setActiveTab("projects")}
          className={`px-6 py-2 rounded-lg ${
            activeTab === "projects"
              ? "bg-blue-600"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Projects
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`px-6 py-2 rounded-lg ${
            activeTab === "messages"
              ? "bg-blue-600"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Messages
        </button>
        <button
          onClick={() => setActiveTab("add")}
          className={`px-6 py-2 rounded-lg ${
            activeTab === "add"
              ? "bg-blue-600"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Add Project
        </button>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">
        {activeTab === "projects" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Manage Projects</h2>
            <p className="text-gray-400">
              Here you can update or delete existing projects (API integration
              later).
            </p>
          </div>
        )}

        {activeTab === "messages" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Messages</h2>
            <p className="text-gray-400">
              Here you will see contact form submissions.
            </p>
          </div>
        )}

        {activeTab === "add" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Add New Project</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Project Title"
                className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none"
              />
              <textarea
                placeholder="Quick Summary"
                className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none"
                rows={4}
              ></textarea>
              <input
                type="text"
                placeholder="Duration Date"
                className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none"
              />

              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-500 p-6 rounded-lg text-center">
                <p className="text-gray-400">Drag & drop files here</p>
                <input type="file" className="hidden" />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition"
              >
                Save Project
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
