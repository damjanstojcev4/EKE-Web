"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError, apiRequest, getCurrentAdmin, logout } from "@/lib/admin-api";
import SupportingMedia from "./SupportingMedia";
import SessionAdmin from "./SessionAdmin";
import s from "./admin.module.css";
import {
  publicationState,
  localPublicationTime,
  publicationFields,
  type NewsRecord,
  type Publication,
} from "@/lib/news-publication";

type Section = "projects" | "news" | "opportunities" | "training";
type Entry = {
  placement: string;
  mediaKind: string;
  mediaUrl: string;
  resourcesJson: string;
  partnerMediaJson: string;
  programme: string;
  grantValue: string;
  currency: string;
  countries: string;
  keyAction: string;
  actionType: string;
  website: string;
  topics: string;
  downloadDescription: string;
  slug: string;
  emphasis: string;
  introduction: string;
  contentJson: string;
  heroAlt: string;
  relatedIds: string;
  id: string;
  kind: "projects" | "news";
  title: string;
  description: string;
  summary: string;
  status: "ongoing" | "completed";
  budget: string;
  startDate: string;
  endDate: string;
  partners: string;
  instagram: string;
  image: string;
  pdf: string;
  category: string;
  imageAlt: string;
  publication: Exclude<Publication, "legacy">;
  publishedAt: string;
  originalPublishedAt: string | null;
  legacy: boolean;
};
type ProjectRecord = import("@/lib/api/projects").ProjectRecord;
type DeleteTarget = { id: string; kind: Section; label: string };
const blank: Entry = {
  placement: "LATEST",
  mediaKind: "",
  mediaUrl: "",
  resourcesJson: "[]",
  partnerMediaJson: "[]",
  programme: "",
  grantValue: "",
  currency: "",
  countries: "",
  keyAction: "",
  actionType: "",
  website: "",
  topics: "",
  downloadDescription: "",
  slug: "",
  emphasis: "",
  introduction: "",
  contentJson: "[]",
  heroAlt: "",
  relatedIds: "",
  id: "",
  kind: "projects",
  title: "",
  description: "",
  summary: "",
  status: "ongoing",
  budget: "",
  startDate: "",
  endDate: "",
  partners: "",
  instagram: "",
  image: "",
  pdf: "",
  category: "LATEST_NEWS",
  imageAlt: "",
  publication: "draft",
  publishedAt: "",
  originalPublishedAt: null,
  legacy: false,
};

function projectEntry(project: ProjectRecord): Entry {
  return {
    ...blank,
    resourcesJson: project.resourcesJson || "[]",
    partnerMediaJson: project.partnerMediaJson || "[]",
    slug: project.slug || "",
    contentJson: project.contentJson || "[]",
    imageAlt: project.imageAlt || "",
    programme: project.programme == null ? "" : String(project.programme),
    grantValue: project.grantValue == null ? "" : String(project.grantValue),
    currency: project.currency == null ? "" : String(project.currency),
    countries: project.countries == null ? "" : String(project.countries),
    keyAction: project.keyAction == null ? "" : String(project.keyAction),
    actionType: project.actionType == null ? "" : String(project.actionType),
    website: project.website == null ? "" : String(project.website),
    topics: project.topics == null ? "" : String(project.topics),
    downloadDescription:
      project.downloadDescription == null
        ? ""
        : String(project.downloadDescription),
    id: project.uuid,
    kind: "projects",
    title: project.title,
    description: project.description || "",
    summary: project.quickSummary || "",
    budget: String(project.budget),
    status: project.status === "ON_GOING" ? "ongoing" : "completed",
    startDate: project.startDate || "",
    endDate: project.endDate || "",
    partners: (project.partners || []).join(", "),
    image: project.image || "",
    pdf: project.pdfUrl || "",
  };
}
function newsEntry(news: NewsRecord): Entry {
  const state = publicationState(news);
  return {
    ...blank,
    placement: news.placement || "LATEST",
    mediaKind: news.mediaKind || "",
    mediaUrl: news.mediaUrl || "",
    slug: news.slug || "",
    emphasis: news.emphasis || "",
    introduction: news.introduction || "",
    contentJson: news.contentJson || "[]",
    heroAlt: news.heroAlt || "",
    relatedIds: news.relatedIds || "",
    id: String(news.id),
    kind: "news",
    title: news.title || "",
    summary: news.shortDescription,
    instagram: news.instagramUrl,
    image: news.imageUrl || "",
    category: news.category || "LATEST_NEWS",
    imageAlt: news.imageAlt || "",
    publication: state === "legacy" ? "draft" : state,
    publishedAt: localPublicationTime(news.publishedAt),
    originalPublishedAt: news.publishedAt,
    legacy: state === "legacy",
  };
}
function entryLabel(entry: Entry) {
  return entry.title || entry.summary.slice(0, 90);
}
function Icon({ name }: { name: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "projects" ? (
        <>
          <rect x="3" y="5" width="18" height="16" rx="3" />
          <path d="M8 5V3h8v2M3 10h18" />
        </>
      ) : name === "news" ? (
        <>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 7h8M8 11h8M8 15h4M8 18h8" />
        </>
      ) : (
        <>
          <circle cx="10" cy="10" r="6" />
          <path d="m15 15 5 5" />
        </>
      )}
    </svg>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<{ username: string; role: string } | null>(
    null,
  );
  const [access, setAccess] = useState<
    "loading" | "ready" | "error" | "denied"
  >("loading");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [section, setSection] = useState<Section>("news");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [editor, setEditor] = useState<Entry | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [deleting, setDeleting] = useState<DeleteTarget | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const titleInput = useRef<HTMLInputElement>(null);
  const summaryInput = useRef<HTMLTextAreaElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const imagePreview = useRef<string | null>(null);

  const handleError = useCallback(
    (cause: unknown) => {
      if (
        cause instanceof ApiError &&
        (cause.status === 401 || cause.status === 403)
      ) {
        setEntries([]);
        setEditor(null);
        setAdmin(null);
        setLoaded(false);
        dialog.current?.close();
        if (cause.status === 401) {
          setAccess("loading");
          router.replace("/login/");
        } else setAccess("denied");
        return;
      }
      setError(
        cause instanceof Error
          ? cause.message
          : "The request failed. Please try again.",
      );
    },
    [router],
  );

  const loadContent = useCallback(async () => {
    const news = await apiRequest<NewsRecord[]>("/news");
    setEntries((current) => [
      ...current.filter((e) => e.kind !== "news"),
      ...news.map(newsEntry),
    ]);
    setLoaded(true);
  }, []);

  const initialize = useCallback(async () => {
    try {
      const user = await getCurrentAdmin();
      setAdmin(user);
      setAccess("ready");
      await loadContent();
    } catch (cause) {
      if (!(
        cause instanceof ApiError &&
        (cause.status === 401 || cause.status === 403)
      ))
        setAccess("error");
      handleError(cause);
    } finally {
      setLoading(false);
    }
  }, [handleError, loadContent]);

  // Fetch and synchronize the authenticated server state on mount.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void initialize();
  }, [initialize]);
  useEffect(
    () => () => {
      if (imagePreview.current) URL.revokeObjectURL(imagePreview.current);
    },
    [],
  );
  useEffect(() => {
    if (!editor) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [editor]);

  function clearUploads() {
    if (imagePreview.current) {
      URL.revokeObjectURL(imagePreview.current);
      imagePreview.current = null;
    }
    setImageFile(null);
    setPdfFile(null);
    setHeroFile(null);
    setLogoFile(null);
  }
  async function navigate(next: Section) {
    if (busy || (editor && !window.confirm("Discard your unsaved changes?")))
      return;
    clearUploads();
    setSection(next);
    setEditor(null);
    setQuery("");
    setFilter("all");
    setError("");
    setLoading(true);
    try {
      if (next === "opportunities" || next === "training") return;
      if (next === "news") await loadContent();
      else if (next === "projects") {
        const projects = await apiRequest<ProjectRecord[]>("/projects/");
        setEntries((current) => [
          ...current.filter((e) => e.kind !== "projects"),
          ...projects.map(projectEntry),
        ]);
      }
    } catch (cause) {
      handleError(cause);
    } finally {
      setLoading(false);
    }
  }
  function edit(entry?: Entry) {
    clearUploads();
    setEditor(
      entry
        ? { ...entry }
        : { ...blank, kind: section === "news" ? "news" : "projects" },
    );
    setError("");
    setNotice("");
    requestAnimationFrame(() =>
      section === "news"
        ? summaryInput.current?.focus()
        : titleInput.current?.focus(),
    );
  }
  function cancel() {
    if (busy || !window.confirm("Discard your unsaved changes?")) return;
    clearUploads();
    setEditor(null);
    setError("");
    requestAnimationFrame(() => heading.current?.focus());
  }
  async function signOut() {
    if (editor && !window.confirm("Discard your unsaved changes and sign out?"))
      return;
    setBusy(true);
    setError("");
    try {
      await logout();
      clearUploads();
      setEditor(null);
      setEntries([]);
      setAdmin(null);
      setAccess("loading");
      router.replace("/login/");
    } catch (cause) {
      handleError(cause);
    } finally {
      setBusy(false);
    }
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor || busy) return;
    if (
      !editor.summary.trim() ||
      (editor.kind === "projects" &&
        (!editor.title.trim() || !editor.description.trim()))
    ) {
      setError("Please complete the required text fields.");
      return;
    }
    if (
      editor.endDate &&
      editor.startDate &&
      editor.endDate < editor.startDate
    ) {
      setError("End date must be on or after the start date.");
      return;
    }

    const data = new FormData();
    if (editor.kind === "projects") {
      for (const key of [
        "resourcesJson",
        "partnerMediaJson",
        "programme",
        "grantValue",
        "currency",
        "countries",
        "keyAction",
        "actionType",
        "website",
        "topics",
        "downloadDescription",
        "contentJson",
        "imageAlt",
      ] as const)
        if (editor[key] !== "" || key !== "grantValue")
          data.append(key, editor[key]);
      if (logoFile) data.append("logo", logoFile);
      data.append("title", editor.title.trim());
      data.append("quickSummary", editor.summary.trim());
      data.append("description", editor.description.trim());
      data.append("budget", editor.budget);
      data.append("status", editor.status === "ongoing" ? "ON_GOING" : "PAST");
      data.append("startDate", editor.startDate);
      data.append("endDate", editor.endDate);
      editor.partners
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean)
        .forEach((p) => data.append("partners", p));
      if (pdfFile) data.append("pdf", pdfFile);
    } else {
      if (!editor.title.trim()) {
        setError("Enter a title.");
        return;
      }
      if (
        (imageFile || editor.image) &&
        !editor.imageAlt.trim() &&
        editor.publication !== "draft"
      ) {
        setError("Describe the image before publishing.");
        return;
      }
      try {
        Object.entries(
          publicationFields(
            editor.publication,
            editor.publishedAt,
            editor.originalPublishedAt,
          ),
        ).forEach(([key, value]) => data.append(key, value));
      } catch (cause) {
        setError((cause as Error).message);
        return;
      }
      data.append("shortDescription", editor.summary.trim());
      data.append("instagramUrl", editor.instagram.trim());
      data.append("title", editor.title.trim());
      data.append("category", editor.category);
      data.append("imageAlt", editor.imageAlt.trim());
    }
    if (editor.slug) data.append("slug", editor.slug);
    if (editor.kind === "news") {
      for (const key of [
        "placement",
        "mediaKind",
        "mediaUrl",
        "emphasis",
        "introduction",
        "contentJson",
        "heroAlt",
        "relatedIds",
      ] as const)
        data.append(key, editor[key]);
      if (heroFile) data.append("hero", heroFile);
    }
    if (imageFile) data.append("image", imageFile);
    setBusy(true);
    setError("");
    try {
      const path = `/${editor.kind}${editor.id ? `/${encodeURIComponent(editor.id)}` : ""}`;
      const result = await apiRequest<ProjectRecord | NewsRecord>(path, {
        method: editor.id ? "PUT" : "POST",
        body: data,
      });
      const saved =
        editor.kind === "projects"
          ? projectEntry(result as ProjectRecord)
          : newsEntry(result as NewsRecord);
      setEntries((current) =>
        editor.id
          ? current.map((e) =>
              e.id === saved.id && e.kind === saved.kind ? saved : e,
            )
          : [saved, ...current],
      );
      clearUploads();
      setEditor(null);
      setNotice(
        `${editor.kind === "projects" ? "Project" : "News item"} saved successfully.`,
      );
      requestAnimationFrame(() => heading.current?.focus());
    } catch (cause) {
      handleError(cause);
    } finally {
      setBusy(false);
    }
  }
  function attach(file: File | undefined, kind: "image" | "pdf") {
    if (!file) return;
    if (
      (kind === "image" &&
        !["image/png", "image/jpeg", "image/webp", "image/gif"].includes(
          file.type,
        )) ||
      (kind === "pdf" && file.type !== "application/pdf")
    ) {
      setError("Choose a PNG, JPG, WebP or GIF image, or a PDF document.");
      return;
    }
    if (file.size > (kind === "image" ? 5 : 20) * 1024 * 1024) {
      setError(
        `Choose a ${kind === "image" ? "5 MB or smaller image" : "20 MB or smaller PDF"}.`,
      );
      return;
    }
    setError("");
    if (kind === "image") {
      if (imagePreview.current) URL.revokeObjectURL(imagePreview.current);
      imagePreview.current = URL.createObjectURL(file);
      setImageFile(file);
      const preview = imagePreview.current;
      setEditor((current) => (current ? { ...current, image: preview } : null));
    } else setPdfFile(file);
  }
  function field(key: keyof Entry, value: string) {
    setEditor((current) => (current ? { ...current, [key]: value } : null));
  }
  function confirmDelete(target: DeleteTarget) {
    setDeleting(target);
    setDeleteError("");
    dialog.current?.showModal();
  }
  async function remove() {
    if (!deleting || busy) return;
    setBusy(true);
    setDeleteError("");
    try {
      await apiRequest<void>(
        `/${deleting.kind}/${encodeURIComponent(deleting.id)}`,
        { method: "DELETE" },
      );
      setEntries((current) =>
        current.filter(
          (e) => !(e.id === deleting.id && e.kind === deleting.kind),
        ),
      );
      setNotice("Item deleted successfully.");
      dialog.current?.close();
    } catch (cause) {
      if (
        cause instanceof ApiError &&
        (cause.status === 401 || cause.status === 403)
      )
        handleError(cause);
      else
        setDeleteError(
          cause instanceof Error
            ? cause.message
            : "Could not delete this item. Please try again.",
        );
    } finally {
      setBusy(false);
    }
  }
  function retry() {
    setError("");
    setLoading(true);
    void initialize();
  }
  const visible = entries.filter(
    (e) =>
      e.kind === section &&
      (filter === "all" || e.status === filter) &&
      `${e.title} ${e.summary}`.toLowerCase().includes(query.toLowerCase()),
  );
  const projectCount = entries.filter((e) => e.kind === "projects").length;
  const newsCount = entries.filter((e) => e.kind === "news").length;
  const sectionName =
    section === "projects"
      ? "Projects"
      : section === "news"
        ? "News"
        : section === "opportunities"
          ? "Opportunities"
          : "Training";

  if (access !== "ready")
    return (
      <main className={s.accessPage} data-text-reveal="off">
        <Link href="/" className={s.brand} aria-label="EKE homepage">
          <img src="/assets/eke-logo-symbol.svg" alt="" />
          <img src="/assets/eke-logo-wordmark.svg" alt="EKE" />
        </Link>
        <section className={s.accessCard}>
          <h1>
            {access === "denied"
              ? "Administrator access required"
              : access === "error"
                ? "Unable to open your workspace"
                : "Opening your workspace…"}
          </h1>
          {access === "loading" ? (
            <p role="status">Checking your session.</p>
          ) : (
            <>
              <p role="alert">
                {access === "denied"
                  ? "This account does not have permission to manage EKE content."
                  : error ||
                    "The server could not be reached. Please try again."}
              </p>
              <div>
                {access === "error" && (
                  <button
                    className={s.primary}
                    disabled={loading}
                    onClick={retry}
                  >
                    {loading ? "Retrying…" : "Try again"}
                  </button>
                )}
                <Link className={s.secondary} href="/login/">
                  Back to sign in
                </Link>
              </div>
            </>
          )}
        </section>
      </main>
    );

  return (
    <div className={s.shell} data-text-reveal="off">
      <a className={s.skip} href="#admin-content">
        Skip to content
      </a>
      <aside className={s.sidebar}>
        <Link href="/" className={s.brand} aria-label="EKE homepage">
          <img src="/assets/eke-logo-symbol.svg" alt="" />
          <img src="/assets/eke-logo-wordmark.svg" alt="EKE" />
        </Link>
        <div className={s.workspaceLabel}>CONTENT WORKSPACE</div>
        <nav aria-label="Admin navigation">
          {(["projects", "news", "opportunities", "training"] as const).map(
            (item) => (
              <button
                key={item}
                disabled={busy}
                aria-current={section === item ? "page" : undefined}
                className={section === item ? s.active : ""}
                onClick={() => navigate(item)}
              >
                <Icon name={item} />
                <span>{item[0].toUpperCase() + item.slice(1)}</span>
                <small>
                  {loaded
                    ? item === "projects"
                      ? projectCount
                      : item === "news"
                        ? newsCount
                        : ""
                    : "—"}
                </small>
              </button>
            ),
          )}
        </nav>
        <div className={s.sidebarBottom}>
          <div className={s.previewCard}>
            <span className={s.dot} /> EKE administration
            <p>Manage your projects, stories and programmes.</p>
          </div>
          <Link href="/">
            View website <span aria-hidden="true">↗</span>
          </Link>
          <div className={s.profile}>
            <span>EK</span>
            <div>
              {admin?.username}
              <small>Administrator</small>
            </div>
          </div>
        </div>
      </aside>
      <div className={s.workspace}>
        <header className={s.topbar}>
          <span>
            Administration <span className={s.slash}>/</span>{" "}
            <strong>{sectionName}</strong>
          </span>
          <button
            className={s.secondary}
            disabled={busy}
            onClick={() => void signOut()}
          >
            Sign out
          </button>
        </header>
        <main id="admin-content" className={s.main}>
          {section === "opportunities" || section === "training" ? (
            <SessionAdmin
              key={section}
              module={section}
              onError={handleError}
            />
          ) : (
            <>
              <div className={s.pageHeading}>
                <div>
                  <div className={s.eyebrow}>EKE · CONTENT & COMMUNITY</div>
                  <h1 ref={heading} tabIndex={-1}>
                    {editor
                      ? `${editor.id ? "Edit" : "Add"} ${section === "news" ? "news" : "project"}`
                      : "Make an impact."}
                  </h1>
                  <p>
                    {editor
                      ? "Bring your story to life. Complete the details below."
                      : "Your projects, stories and programmes. All in one place."}
                  </p>
                </div>
                {!editor && (
                  <button
                    className={s.primary}
                    disabled={!loaded || loading || busy}
                    onClick={() => edit()}
                  >
                    <span aria-hidden="true">＋</span> Add{" "}
                    {section === "news" ? "news" : "project"}
                  </button>
                )}
              </div>
              <div role="status" className={notice ? s.notice : undefined}>
                {notice}
              </div>
              {error && (
                <div role="alert" className={s.error}>
                  {error}
                  {!editor && (
                    <button
                      className={s.secondary}
                      disabled={loading}
                      onClick={retry}
                    >
                      Retry
                    </button>
                  )}
                </div>
              )}
              {editor ? (
                <form className={s.editor} onSubmit={save} aria-busy={busy}>
                  <div className={s.formHeader}>
                    <h2>
                      {section === "news" ? "Story details" : "Project details"}
                    </h2>
                    <span>* Required fields</span>
                  </div>
                  <fieldset disabled={busy} className={s.formGrid}>
                    <label className={s.full}>
                      Title *
                      <input
                        ref={titleInput}
                        required
                        maxLength={section === "news" ? 255 : 200}
                        value={editor.title}
                        onChange={(e) => field("title", e.target.value)}
                        placeholder={
                          section === "news"
                            ? "Article title"
                            : "Name your project"
                        }
                      />
                    </label>
                    <label className={s.full}>
                      {section === "news"
                        ? "Summary / excerpt"
                        : "Quick summary"}{" "}
                      *
                      <textarea
                        ref={summaryInput}
                        required
                        rows={3}
                        maxLength={1200}
                        value={editor.summary}
                        onChange={(e) => field("summary", e.target.value)}
                        placeholder="A short introduction that captures the essentials"
                      />
                    </label>
                    <label className={s.full}>
                      Slug
                      <input
                        maxLength={160}
                        pattern="[a-z0-9]+(-[a-z0-9]+)*"
                        value={editor.slug}
                        onChange={(e) => field("slug", e.target.value)}
                      />
                      <span>
                        Leave blank for an automatic slug. New URLs require a
                        route-manifest refresh and site rebuild.
                      </span>
                    </label>
                    {section === "news" && (
                      <>
                        <label>
                          Placement
                          <select
                            value={editor.placement}
                            onChange={(e) => field("placement", e.target.value)}
                          >
                            {[
                              "LATEST",
                              "FEATURED",
                              "BIG_STORY",
                              "COMMUNITY",
                              "MEDIA",
                            ].map((p) => (
                              <option key={p}>{p}</option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Media kind
                          <select
                            value={editor.mediaKind}
                            onChange={(e) => field("mediaKind", e.target.value)}
                          >
                            <option value="">None</option>
                            <option>AUDIO</option>
                            <option>VIDEO</option>
                          </select>
                        </label>
                        <label className={s.full}>
                          Media URL
                          <input
                            type="url"
                            value={editor.mediaUrl}
                            onChange={(e) => field("mediaUrl", e.target.value)}
                          />
                        </label>
                        <label className={s.full}>
                          Emphasized summary
                          <textarea
                            maxLength={1200}
                            value={editor.emphasis}
                            onChange={(e) => field("emphasis", e.target.value)}
                          />
                        </label>
                        <label className={s.full}>
                          Introduction
                          <textarea
                            maxLength={4000}
                            value={editor.introduction}
                            onChange={(e) =>
                              field("introduction", e.target.value)
                            }
                          />
                        </label>
                        <label className={s.full}>
                          Article content (JSON blocks)
                          <textarea
                            rows={10}
                            value={editor.contentJson}
                            onChange={(e) =>
                              field("contentJson", e.target.value)
                            }
                          />
                          <span>
                            Example:{" "}
                            {JSON.stringify([
                              {
                                type: "paragraph",
                                text: [
                                  {
                                    text: "Verified article text",
                                    strong: true,
                                  },
                                ],
                              },
                            ])}
                            . Supported types: paragraph, heading, list. No
                            HTML.
                          </span>
                        </label>
                        <label>
                          Related article IDs
                          <input
                            value={editor.relatedIds}
                            onChange={(e) =>
                              field("relatedIds", e.target.value)
                            }
                            placeholder="Comma-separated IDs"
                          />
                        </label>
                        <label>
                          Hero alternative text
                          <input
                            maxLength={255}
                            value={editor.heroAlt}
                            onChange={(e) => field("heroAlt", e.target.value)}
                          />
                        </label>
                        <label>
                          Hero image
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/gif"
                            onChange={(e) =>
                              setHeroFile(e.target.files?.[0] || null)
                            }
                          />
                        </label>
                      </>
                    )}
                    {section === "projects" ? (
                      <>
                        <label>
                          programme
                          <input
                            value={editor.programme}
                            onChange={(e) => field("programme", e.target.value)}
                          />
                        </label>
                        <label>
                          grant Value
                          <input
                            value={editor.grantValue}
                            onChange={(e) =>
                              field("grantValue", e.target.value)
                            }
                          />
                        </label>
                        <label>
                          currency
                          <input
                            value={editor.currency}
                            onChange={(e) => field("currency", e.target.value)}
                          />
                        </label>
                        <label>
                          countries
                          <input
                            value={editor.countries}
                            onChange={(e) => field("countries", e.target.value)}
                          />
                        </label>
                        <label>
                          key Action
                          <input
                            value={editor.keyAction}
                            onChange={(e) => field("keyAction", e.target.value)}
                          />
                        </label>
                        <label>
                          action Type
                          <input
                            value={editor.actionType}
                            onChange={(e) =>
                              field("actionType", e.target.value)
                            }
                          />
                        </label>
                        <label>
                          website
                          <input
                            value={editor.website}
                            onChange={(e) => field("website", e.target.value)}
                          />
                        </label>
                        <label>
                          topics
                          <input
                            value={editor.topics}
                            onChange={(e) => field("topics", e.target.value)}
                          />
                        </label>
                        <label>
                          download Description
                          <input
                            value={editor.downloadDescription}
                            onChange={(e) =>
                              field("downloadDescription", e.target.value)
                            }
                          />
                        </label>
                        <SupportingMedia onError={handleError} />
                        <label className={s.full}>
                          Additional resources (JSON)
                          <textarea
                            rows={5}
                            value={editor.resourcesJson}
                            onChange={(e) =>
                              field("resourcesJson", e.target.value)
                            }
                          />
                          <span>
                            Array of objects with title, url and optional
                            description. Use URLs from supporting-media uploads.
                          </span>
                        </label>
                        <label className={s.full}>
                          Partner media (JSON)
                          <textarea
                            rows={5}
                            value={editor.partnerMediaJson}
                            onChange={(e) =>
                              field("partnerMediaJson", e.target.value)
                            }
                          />
                          <span>
                            Array of objects with name, url and alt. Existing
                            partner names are preserved separately.
                          </span>
                        </label>
                        <label className={s.full}>
                          Project content (JSON blocks)
                          <textarea
                            rows={8}
                            value={editor.contentJson}
                            onChange={(e) =>
                              field("contentJson", e.target.value)
                            }
                          />
                        </label>
                        <label>
                          Image alternative text
                          <input
                            value={editor.imageAlt}
                            onChange={(e) => field("imageAlt", e.target.value)}
                          />
                        </label>
                        <label>
                          Project logo
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/gif"
                            onChange={(e) =>
                              setLogoFile(e.target.files?.[0] || null)
                            }
                          />
                        </label>
                        <label className={s.full}>
                          Description *
                          <textarea
                            required
                            rows={6}
                            value={editor.description}
                            onChange={(e) =>
                              field("description", e.target.value)
                            }
                          />
                        </label>
                        <label>
                          Budget (€) *
                          <input
                            type="number"
                            min="0"
                            step="1"
                            required
                            value={editor.budget}
                            onChange={(e) => field("budget", e.target.value)}
                          />
                        </label>
                        <label>
                          Status
                          <select
                            value={editor.status}
                            onChange={(e) => field("status", e.target.value)}
                          >
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Past</option>
                          </select>
                        </label>
                        <label>
                          Start date
                          <input
                            type="date"
                            value={editor.startDate}
                            onChange={(e) => field("startDate", e.target.value)}
                          />
                        </label>
                        <label>
                          End date
                          <input
                            type="date"
                            min={editor.startDate || undefined}
                            value={editor.endDate}
                            onChange={(e) => field("endDate", e.target.value)}
                          />
                        </label>
                        <label className={s.full}>
                          Partners
                          <input
                            value={editor.partners}
                            onChange={(e) => field("partners", e.target.value)}
                            placeholder="Separate partner names with commas"
                          />
                        </label>
                      </>
                    ) : (
                      <>
                        {editor.legacy && (
                          <p className={s.full}>
                            Legacy article: hidden from public feeds. Complete
                            the fields and explicitly publish when ready.
                          </p>
                        )}
                        <label>
                          Category *
                          <select
                            value={editor.category}
                            onChange={(e) => field("category", e.target.value)}
                          >
                            <option value="LATEST_NEWS">Latest news</option>
                            <option value="OPEN_CALL">Open call</option>
                          </select>
                        </label>
                        <label>
                          Publication status
                          <select
                            value={editor.publication}
                            onChange={(e) =>
                              field("publication", e.target.value)
                            }
                          >
                            <option value="draft">Draft (unpublished)</option>
                            <option value="published">Published</option>
                            <option value="scheduled">Scheduled</option>
                          </select>
                        </label>
                        <label>
                          Publication date and time
                          <input
                            type="datetime-local"
                            step="1"
                            required={editor.publication !== "draft"}
                            value={editor.publishedAt}
                            onChange={(e) =>
                              field("publishedAt", e.target.value)
                            }
                          />
                          <span>
                            Browser timezone:{" "}
                            {Intl.DateTimeFormat().resolvedOptions().timeZone}.
                            Saved as UTC. For a repeated autumn hour, the
                            earlier occurrence is used.
                          </span>
                        </label>
                        <div>
                          <button
                            type="button"
                            className={s.secondary}
                            onClick={() =>
                              setEditor((current) =>
                                current
                                  ? {
                                      ...current,
                                      publication: "published",
                                      originalPublishedAt: null,
                                      publishedAt: localPublicationTime(
                                        new Date().toISOString(),
                                      ),
                                    }
                                  : null,
                              )
                            }
                          >
                            Publish now
                          </button>
                          <p>
                            Sets the time to now; Save changes applies it.
                            Choose Draft to unpublish without deleting.
                          </p>
                        </div>
                        <label className={s.full}>
                          Image alternative text
                          <input
                            maxLength={255}
                            required={
                              !!editor.image && editor.publication !== "draft"
                            }
                            value={editor.imageAlt}
                            onChange={(e) => field("imageAlt", e.target.value)}
                          />
                        </label>
                        <label className={s.full}>
                          Instagram URL
                          <input
                            type="url"
                            maxLength={2000}
                            value={editor.instagram}
                            onChange={(e) => field("instagram", e.target.value)}
                            placeholder="https://www.instagram.com/p/…"
                          />
                        </label>
                      </>
                    )}
                    <label className={s.upload}>
                      Cover image
                      <span>PNG, JPG, WebP or GIF · up to 5 MB</span>
                      {editor.image && (
                        <img src={editor.image} alt="Selected cover" />
                      )}
                      {imageFile && <span>{imageFile.name}</span>}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        onChange={(e) => {
                          attach(e.target.files?.[0], "image");
                          e.target.value = "";
                        }}
                      />
                    </label>
                    {section === "projects" && (
                      <label className={s.upload}>
                        Project document<span>PDF · up to 20 MB</span>
                        {pdfFile ? (
                          <span>{pdfFile.name}</span>
                        ) : editor.pdf ? (
                          <a
                            href={editor.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View current document ↗
                          </a>
                        ) : null}
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => {
                            attach(e.target.files?.[0], "pdf");
                            e.target.value = "";
                          }}
                        />
                      </label>
                    )}
                  </fieldset>
                  <div className={s.formFooter}>
                    <p>Changes are saved to EKE’s content database.</p>
                    <button
                      type="button"
                      className={s.secondary}
                      disabled={busy}
                      onClick={cancel}
                    >
                      Cancel
                    </button>
                    <button className={s.primary} disabled={busy}>
                      {busy ? "Saving…" : "Save changes"}
                      <span aria-hidden="true">↗</span>
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className={s.stats}>
                    {(
                      [
                        [
                          "projects",
                          "Projects",
                          projectCount,
                          "Ideas turned into action",
                        ],
                        [
                          "news",
                          "News stories",
                          newsCount,
                          "Keep your community inspired",
                        ],
                      ] as const
                    ).map(([key, label, count, caption]) => (
                      <button
                        key={key}
                        onClick={() => navigate(key)}
                        className={section === key ? s.selectedStat : ""}
                      >
                        <div>
                          <span>{label}</span>
                          <Icon name={key} />
                        </div>
                        <strong>
                          {loaded ? String(count).padStart(2, "0") : "—"}
                        </strong>
                        <small>{caption}</small>
                      </button>
                    ))}
                  </div>
                  <section
                    className={s.content}
                    aria-label={sectionName}
                    aria-busy={loading}
                  >
                    <div className={s.contentHeading}>
                      <h2>
                        {sectionName}{" "}
                        <span>
                          {loaded
                            ? section === "projects"
                              ? projectCount
                              : newsCount
                            : "—"}
                        </span>
                      </h2>
                      <p>Manage the content that tells your story</p>
                    </div>
                    <div className={s.toolbar}>
                      <div className={s.filters} aria-label="Filter projects">
                        {section === "projects" ? (
                          ["all", "ongoing", "completed"].map((value) => (
                            <button
                              key={value}
                              aria-pressed={filter === value}
                              onClick={() => setFilter(value)}
                            >
                              {value === "all"
                                ? "All projects"
                                : value === "ongoing"
                                  ? "Ongoing"
                                  : "Past"}
                            </button>
                          ))
                        ) : (
                          <span>All news stories</span>
                        )}
                      </div>
                      <label className={s.search}>
                        <Icon name="search" />
                        <input
                          type="search"
                          aria-label={`Search ${section}`}
                          placeholder={`Search ${section}…`}
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                        />
                      </label>
                    </div>
                    {loading ? (
                      <div className={s.empty} role="status">
                        Loading your content…
                      </div>
                    ) : !loaded ? (
                      <div className={s.empty}>
                        <h3>Content is unavailable.</h3>
                        <p>Please retry to load your workspace.</p>
                      </div>
                    ) : visible.length ? (
                      <div className={s.rows}>
                        {visible.map((entry) => (
                          <article
                            className={s.row}
                            key={`${entry.kind}-${entry.id}`}
                          >
                            <img
                              className={s.thumbnail}
                              src={entry.image || "/assets/eke-logo-symbol.svg"}
                              alt=""
                            />
                            <div className={s.rowText}>
                              <h3>{entryLabel(entry)}</h3>
                              {entry.kind === "projects" && (
                                <p>{entry.summary}</p>
                              )}
                            </div>
                            <span
                              className={
                                entry.kind === "news"
                                  ? s.storyBadge
                                  : entry.status === "ongoing"
                                    ? s.ongoingBadge
                                    : s.pastBadge
                              }
                            >
                              {entry.kind === "news"
                                ? entry.legacy
                                  ? "Legacy · hidden"
                                  : entry.publication
                                : entry.status === "ongoing"
                                  ? "Ongoing"
                                  : "Past"}
                            </span>
                            <div className={s.rowActions}>
                              <button
                                aria-label={`Edit ${entryLabel(entry)}`}
                                onClick={() => edit(entry)}
                              >
                                Edit <span aria-hidden="true">↗</span>
                              </button>
                              <button
                                className={s.delete}
                                aria-label={`Delete ${entryLabel(entry)}`}
                                onClick={() =>
                                  confirmDelete({
                                    id: entry.id,
                                    kind: entry.kind,
                                    label: entryLabel(entry),
                                  })
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <div className={s.empty}>
                        <Icon name={section} />
                        <h3>
                          {query || filter !== "all"
                            ? "No matching content."
                            : `No ${section} yet.`}
                        </h3>
                        <p>
                          {query || filter !== "all"
                            ? "Try another search or change your filters."
                            : "Add your first item to get started."}
                        </p>
                        {(query || filter !== "all") && (
                          <button
                            className={s.secondary}
                            onClick={() => {
                              setQuery("");
                              setFilter("all");
                            }}
                          >
                            Clear filters
                          </button>
                        )}
                      </div>
                    )}
                    <div className={s.listFooter}>
                      Showing {loaded ? visible.length : "—"}{" "}
                      {section === "news" ? "news stories" : section}
                      <span>EKE content workspace</span>
                    </div>
                  </section>
                </>
              )}
            </>
          )}
          <footer className={s.footer}>
            Empowering communities. Creating opportunities.
            <span>EKE · Admin workspace</span>
          </footer>
        </main>
      </div>
      <dialog
        ref={dialog}
        className={s.dialog}
        onCancel={(e) => {
          if (busy) e.preventDefault();
        }}
        onClose={() => {
          setDeleting(null);
          setDeleteError("");
        }}
        aria-labelledby="delete-title"
      >
        <h2 id="delete-title">
          Delete this {deleting?.kind === "news" ? "news item" : "project"}?
        </h2>
        <p>
          “{deleting?.label}” will be permanently removed. This cannot be
          undone.
        </p>
        {deleteError && (
          <p role="alert" className={s.error}>
            {deleteError}
          </p>
        )}
        <div>
          <button
            className={s.secondary}
            disabled={busy}
            autoFocus
            onClick={() => dialog.current?.close()}
          >
            Keep it
          </button>
          <button
            className={s.danger}
            disabled={busy}
            onClick={() => void remove()}
          >
            {busy ? "Deleting…" : "Delete item"}
          </button>
        </div>
      </dialog>
    </div>
  );
}
