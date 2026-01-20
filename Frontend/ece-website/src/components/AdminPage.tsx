import React, { useEffect, useState } from "react";
import AddProjectsTab from "./utils/AddProjectsTab";
import ProjectCard from "./ProjectCard";
import { useNavigate } from "react-router-dom";

// Updated Project type with startDate/endDate
interface Project {
  uuid: string;
  title: string;
  budget: number;
  description: string;
  quickSummary: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  durationDate?: string;
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

const AdminPage: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"projects" | "add" | "messages">(
    "projects"
  );
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    const res = await fetch("/api/projects/", { credentials: "include" });
    if (res.status === 401) {
      localStorage.removeItem("jwt");
      navigate("/login");
      throw new Error("Unauthorized");
    }
    if (!res.ok) throw new Error("Failed to fetch projects");
    const data = await res.json();
    setProjects(data);
  };

  const fetchMessages = async () => {
    const res = await fetch("/api/messages/", { credentials: "include" });
    if (res.status === 401) {
      localStorage.removeItem("jwt");
      navigate("/login");
      throw new Error("Unauthorized");
    }
    if (!res.ok) throw new Error("Failed to fetch messages");
    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => {
    const load = async () => {
      try {
        await Promise.all([fetchProjects(), fetchMessages()]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDeleteProject = async (uuid: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const res = await fetch(`/api/projects/${uuid}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.status === 401) {
      localStorage.removeItem("jwt");
      navigate("/login");
      return;
    }
    if (!res.ok) {
      alert("Failed to delete project");
      return;
    }
    setProjects((prev) => prev.filter((p) => p.uuid !== uuid));
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.warn("Logout request failed, proceeding anyway");
    }
    localStorage.removeItem("jwt");
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading admin...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 text-black pt-30 px-6 pb-24">
      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <h1 className="text-4xl font-bold text-center mb-10 pt-10 text-stone-950">
        Admin Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-10">
        <button
          onClick={() => setActiveTab("projects")}
          className={`px-6 py-2 rounded-lg ${
            activeTab === "projects"
              ? "bg-blue-400"
              : "bg-gray-400 hover:bg-gray-500"
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
              ? "bg-blue-400"
              : "bg-gray-400 hover:bg-gray-500"
          }`}
        >
          Add Project
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`px-6 py-2 rounded-lg ${
            activeTab === "messages"
              ? "bg-blue-400"
              : "bg-gray-400 hover:bg-gray-500"
          }`}
        >
          Messages
        </button>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {activeTab === "projects" && (
          <div className="grid gap-6">
            {projects.length === 0 && <p>No projects found</p>}
            {projects.map((project) => (
              <ProjectCard
                key={project.uuid}
                uuid={project.uuid}
                title={project.title}
                quickSummary={project.quickSummary}
                startDate={project.startDate}
                endDate={project.endDate}
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
                className="p-4 rounded-lg bg-white flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{msg.name}</h3>
                  <span className="text-gray-600 text-sm">{msg.email}</span>
                </div>
                <p className="text-gray-700">{msg.yourMessage}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
