import { useState, useEffect } from "react";
import AddProjectsTab from "./utils/AddProjectsTab";
import ProjectCard from "./ProjectCard";

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

interface Message {
  id: number;
  name: string;
  email: string;
  yourMessage: string;
}

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<"projects" | "add" | "messages">(
    "projects"
  );
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects/", { credentials: "include" });
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages/", { credentials: "include" });
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchMessages();
  }, []);

  const handleDeleteProject = async (uuid: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await fetch(`/api/projects/${uuid}`, {
        method: "DELETE",
        credentials: "include",
      });
      setProjects((prev) => prev.filter((p) => p.uuid !== uuid));
    } catch (err) {
      console.error(err);
      alert("Failed to delete project");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 px-6 pb-24">
      <h1 className="text-4xl font-bold text-center mb-10 pt-20">
        Admin Dashboard
      </h1>

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
          onClick={() => {
            setEditingProject(null);
            setActiveTab("add");
          }}
          className={`px-6 py-2 rounded-lg ${
            activeTab === "add"
              ? "bg-blue-600"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Add Project
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
      </div>

      <div className="max-w-6xl mx-auto">
        {activeTab === "projects" && (
          <div className="grid gap-6">
            {projects.length === 0 && <p>No projects found.</p>}
            {projects.map((project) => (
              <ProjectCard
                key={project.uuid}
                uuid={project.uuid}
                title={project.title}
                quickSummary={project.quickSummary}
                durationDate={project.durationDate}
                image={project.image}
                status={project.status}
                onEdit={() => {
                  setEditingProject(project);
                  setActiveTab("add");
                }}
                onDelete={() => handleDeleteProject(project.uuid)}
              />
            ))}
          </div>
        )}

        {activeTab === "add" && (
          <AddProjectsTab
            projectToEdit={editingProject || undefined}
            onSaved={() => {
              setEditingProject(null);
              setActiveTab("projects");
              fetchProjects();
            }}
          />
        )}

        {activeTab === "messages" && (
          <div className="space-y-4">
            {messages.length === 0 && <p>No messages found.</p>}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 rounded-lg bg-gray-700 flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{msg.name}</h3>
                  <span className="text-gray-400 text-sm">{msg.email}</span>
                </div>
                <p className="text-gray-300">{msg.yourMessage}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
