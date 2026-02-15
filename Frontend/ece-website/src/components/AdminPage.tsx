import React, { useEffect, useState } from "react";
import AddProjectsTab from "./utils/AddProjectsTab.tsx";
import AddNewsTab from "./utils/AddNewsTab.tsx";
import ProjectCard from "./ProjectCard.tsx";
import NewsCard from "./NewsCard.tsx";
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

  const [activeTab, setActiveTab] = useState<"projects" | "add" | "messages" | "news" | "add-news">(
    "projects"
  );
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [news, setNews] = useState<any[]>([]);
  const [editingNews, setEditingNews] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    const token = localStorage.getItem("jwt");
    const res = await fetch("/api/projects/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
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
    const token = localStorage.getItem("jwt");
    const res = await fetch("/api/messages/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
    if (res.status === 401) {
      localStorage.removeItem("jwt");
      navigate("/login");
      throw new Error("Unauthorized");
    }
    if (!res.ok) throw new Error("Failed to fetch messages");
    const data = await res.json();
    setMessages(data);
  };

  const fetchNews = async () => {
    const token = localStorage.getItem("jwt");
    const res = await fetch("/api/news", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
    if (res.status === 401) {
      localStorage.removeItem("jwt");
      navigate("/login");
      throw new Error("Unauthorized");
    }
    if (!res.ok) throw new Error("Failed to fetch news");
    const data = await res.json();
    setNews(data);
  };

  useEffect(() => {
    const load = async () => {
      try {
        await Promise.all([fetchProjects(), fetchMessages(), fetchNews()]);
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
    const token = localStorage.getItem("jwt");
    const res = await fetch(`/api/projects/${uuid}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

  const handleDeleteNews = async (id: number) => {
    if (!confirm("Are you sure you want to delete this news item?")) return;
    const token = localStorage.getItem("jwt");
    const res = await fetch(`/api/news/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
    if (res.status === 401) {
      localStorage.removeItem("jwt");
      navigate("/login");
      return;
    }
    if (!res.ok) {
      alert("Failed to delete news");
      return;
    }
    setNews((prev) => prev.filter((n) => n.id !== id));
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
          className={`px-6 py-2 rounded-lg ${activeTab === "projects"
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
          className={`px-6 py-2 rounded-lg ${activeTab === "add"
            ? "bg-blue-400"
            : "bg-gray-400 hover:bg-gray-500"
            }`}
        >
          Add Project
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`px-6 py-2 rounded-lg ${activeTab === "messages"
            ? "bg-blue-400"
            : "bg-gray-400 hover:bg-gray-500"
            }`}
        >
          Messages
        </button>
        <button
          onClick={() => setActiveTab("news")}
          className={`px-6 py-2 rounded-lg ${activeTab === "news"
            ? "bg-blue-400"
            : "bg-gray-400 hover:bg-gray-500"
            }`}
        >
          News
        </button>
        <button
          onClick={() => {
            setEditingNews(null);
            setActiveTab("add-news");
          }}
          className={`px-6 py-2 rounded-lg ${activeTab === "add-news"
            ? "bg-blue-400"
            : "bg-gray-400 hover:bg-gray-500"
            }`}
        >
          Add News
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

        {activeTab === "news" && (
          <div className="grid gap-6">
            {news.length === 0 && <p>No news found</p>}
            {news.map((item) => (
              <NewsCard
                key={item.id}
                shortDescription={item.shortDescription}
                instagramUrl={item.instagramUrl}
                imageUrl={item.imageUrl}
                onEdit={() => {
                  setEditingNews(item);
                  setActiveTab("add-news");
                }}
                onDelete={() => handleDeleteNews(item.id)}
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

        {activeTab === "add-news" && (
          <AddNewsTab
            newsToEdit={editingNews || undefined}
            onSaved={() => {
              setEditingNews(null);
              setActiveTab("news");
              fetchNews();
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
