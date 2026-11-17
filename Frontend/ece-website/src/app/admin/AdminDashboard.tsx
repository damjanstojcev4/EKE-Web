"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError, apiRequest, getCurrentAdmin, logout } from "@/lib/admin-api";
import s from "./admin.module.css";

type Section = "projects" | "news" | "messages";
type Entry = {
  id: string; kind: "projects" | "news"; title: string; description: string;
  summary: string; status: "ongoing" | "completed"; budget: string;
  startDate: string; endDate: string; partners: string; instagram: string;
  image: string; pdf: string;
};
type ProjectRecord = {
  uuid: string; title: string; description: string; quickSummary: string; budget: number;
  status: "ON_GOING" | "PAST"; startDate: string | null; endDate: string | null;
  partners: string[] | null; image: string | null; pdfUrl: string | null;
};
type NewsRecord = { id: number; shortDescription: string; instagramUrl: string; imageUrl: string | null };
type MessageRecord = { id: number; fullName: string; email: string; subject: string; yourMessage: string };
type DeleteTarget = { id: string; kind: Section; label: string };
const blank: Entry = { id: "", kind: "projects", title: "", description: "", summary: "", status: "ongoing", budget: "", startDate: "", endDate: "", partners: "", instagram: "", image: "", pdf: "" };

function projectEntry(project: ProjectRecord): Entry {
  return { ...blank, id: project.uuid, kind: "projects", title: project.title, description: project.description,
    summary: project.quickSummary, budget: String(project.budget), status: project.status === "ON_GOING" ? "ongoing" : "completed",
    startDate: project.startDate || "", endDate: project.endDate || "", partners: (project.partners || []).join(", "),
    image: project.image || "", pdf: project.pdfUrl || "" };
}
function newsEntry(news: NewsRecord): Entry {
  return { ...blank, id: String(news.id), kind: "news", summary: news.shortDescription, instagram: news.instagramUrl, image: news.imageUrl || "" };
}
function entryLabel(entry: Entry) { return entry.kind === "projects" ? entry.title : entry.summary.slice(0, 90); }
function Icon({ name }: { name: string }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{name === "projects" ? <><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 5V3h8v2M3 10h18"/></> : name === "news" ? <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h4M8 18h8"/></> : name === "messages" ? <><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 7 9 6 9-6"/></> : <><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></>}</svg>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<{ username: string; role: string } | null>(null);
  const [access, setAccess] = useState<"loading" | "ready" | "error" | "denied">("loading");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [section, setSection] = useState<Section>("projects");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [editor, setEditor] = useState<Entry | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [deleting, setDeleting] = useState<DeleteTarget | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const titleInput = useRef<HTMLInputElement>(null);
  const summaryInput = useRef<HTMLTextAreaElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const imagePreview = useRef<string | null>(null);

  const handleError = useCallback((cause: unknown) => {
    if (cause instanceof ApiError && (cause.status === 401 || cause.status === 403)) {
      setEntries([]); setMessages([]); setEditor(null); setAdmin(null); setLoaded(false);
      dialog.current?.close();
      if (cause.status === 401) { setAccess("loading"); router.replace("/login/"); }
      else setAccess("denied");
      return;
    }
    setError(cause instanceof Error ? cause.message : "The request failed. Please try again.");
  }, [router]);

  const loadContent = useCallback(async () => {
    const [projects, news, inbox] = await Promise.all([
      apiRequest<ProjectRecord[]>("/projects/"), apiRequest<NewsRecord[]>("/news"), apiRequest<MessageRecord[]>("/messages/"),
    ]);
    setEntries([...projects.map(projectEntry), ...news.map(newsEntry)]);
    setMessages(inbox); setLoaded(true);
  }, []);

  const initialize = useCallback(async () => {
    try {
      const user = await getCurrentAdmin();
      setAdmin(user); setAccess("ready");
      await loadContent();
    } catch (cause) {
      if (!(cause instanceof ApiError && (cause.status === 401 || cause.status === 403))) setAccess("error");
      handleError(cause);
    } finally { setLoading(false); }
  }, [handleError, loadContent]);

  // Fetch and synchronize the authenticated server state on mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void initialize(); }, [initialize]);
  useEffect(() => () => { if (imagePreview.current) URL.revokeObjectURL(imagePreview.current); }, []);
  useEffect(() => {
    if (!editor) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [editor]);

  function clearUploads() {
    if (imagePreview.current) { URL.revokeObjectURL(imagePreview.current); imagePreview.current = null; }
    setImageFile(null); setPdfFile(null);
  }
  function navigate(next: Section) {
    if (busy || (editor && !window.confirm("Discard your unsaved changes?"))) return;
    clearUploads(); setSection(next); setEditor(null); setQuery(""); setFilter("all"); setError("");
  }
  function edit(entry?: Entry) {
    clearUploads(); setEditor(entry ? { ...entry } : { ...blank, kind: section === "news" ? "news" : "projects" });
    setError(""); setNotice("");
    requestAnimationFrame(() => section === "news" ? summaryInput.current?.focus() : titleInput.current?.focus());
  }
  function cancel() {
    if (busy || !window.confirm("Discard your unsaved changes?")) return;
    clearUploads(); setEditor(null); setError(""); requestAnimationFrame(() => heading.current?.focus());
  }
  async function signOut() {
    if (editor && !window.confirm("Discard your unsaved changes and sign out?")) return;
    setBusy(true); setError("");
    try { await logout(); clearUploads(); setEditor(null); setEntries([]); setMessages([]); setAdmin(null); setAccess("loading"); router.replace("/login/"); }
    catch (cause) { handleError(cause); }
    finally { setBusy(false); }
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor || busy) return;
    if (!editor.summary.trim() || (editor.kind === "projects" && (!editor.title.trim() || !editor.description.trim()))) { setError("Please complete the required text fields."); return; }
    if (editor.endDate && editor.startDate && editor.endDate < editor.startDate) { setError("End date must be on or after the start date."); return; }
    if (!editor.id && !imageFile) { setError("Choose a cover image for this item."); return; }
    const data = new FormData();
    if (editor.kind === "projects") {
      data.append("title", editor.title.trim()); data.append("quickSummary", editor.summary.trim());
      data.append("description", editor.description.trim()); data.append("budget", editor.budget);
      data.append("status", editor.status === "ongoing" ? "ON_GOING" : "PAST");
      data.append("startDate", editor.startDate); data.append("endDate", editor.endDate);
      editor.partners.split(",").map(p => p.trim()).filter(Boolean).forEach(p => data.append("partners", p));
      if (pdfFile) data.append("pdf", pdfFile);
    } else { data.append("shortDescription", editor.summary.trim()); data.append("instagramUrl", editor.instagram.trim()); }
    if (imageFile) data.append("image", imageFile);
    setBusy(true); setError("");
    try {
      const path = `/${editor.kind}${editor.id ? `/${encodeURIComponent(editor.id)}` : ""}`;
      const result = await apiRequest<ProjectRecord | NewsRecord>(path, { method: editor.id ? "PUT" : "POST", body: data });
      const saved = editor.kind === "projects" ? projectEntry(result as ProjectRecord) : newsEntry(result as NewsRecord);
      setEntries(current => editor.id ? current.map(e => e.id === saved.id && e.kind === saved.kind ? saved : e) : [saved, ...current]);
      clearUploads(); setEditor(null); setNotice(`${editor.kind === "projects" ? "Project" : "News item"} saved successfully.`);
      requestAnimationFrame(() => heading.current?.focus());
    } catch (cause) { handleError(cause); }
    finally { setBusy(false); }
  }
  function attach(file: File | undefined, kind: "image" | "pdf") {
    if (!file) return;
    if ((kind === "image" && !["image/png", "image/jpeg", "image/webp", "image/gif"].includes(file.type)) || (kind === "pdf" && file.type !== "application/pdf")) { setError("Choose a PNG, JPG, WebP or GIF image, or a PDF document."); return; }
    if (file.size > (kind === "image" ? 5 : 20) * 1024 * 1024) { setError(`Choose a ${kind === "image" ? "5 MB or smaller image" : "20 MB or smaller PDF"}.`); return; }
    setError("");
    if (kind === "image") {
      if (imagePreview.current) URL.revokeObjectURL(imagePreview.current);
      imagePreview.current = URL.createObjectURL(file); setImageFile(file);
      const preview = imagePreview.current;
      setEditor(current => current ? { ...current, image: preview } : null);
    } else setPdfFile(file);
  }
  function field(key: keyof Entry, value: string) { setEditor(current => current ? { ...current, [key]: value } : null); }
  function confirmDelete(target: DeleteTarget) { setDeleting(target); setDeleteError(""); dialog.current?.showModal(); }
  async function remove() {
    if (!deleting || busy) return;
    setBusy(true); setDeleteError("");
    try {
      await apiRequest<void>(`/${deleting.kind}/${encodeURIComponent(deleting.id)}`, { method: "DELETE" });
      if (deleting.kind === "messages") setMessages(current => current.filter(m => String(m.id) !== deleting.id));
      else setEntries(current => current.filter(e => !(e.id === deleting.id && e.kind === deleting.kind)));
      setNotice("Item deleted successfully."); dialog.current?.close();
    } catch (cause) {
      if (cause instanceof ApiError && (cause.status === 401 || cause.status === 403)) handleError(cause);
      else setDeleteError(cause instanceof Error ? cause.message : "Could not delete this item. Please try again.");
    } finally { setBusy(false); }
  }
  function retry() { setError(""); setLoading(true); void initialize(); }
  const visible = entries.filter(e => e.kind === section && (filter === "all" || e.status === filter) && `${e.title} ${e.summary}`.toLowerCase().includes(query.toLowerCase()));
  const visibleMessages = messages.filter(m => `${m.fullName} ${m.email} ${m.subject} ${m.yourMessage}`.toLowerCase().includes(query.toLowerCase()));
  const projectCount = entries.filter(e => e.kind === "projects").length;
  const newsCount = entries.filter(e => e.kind === "news").length;
  const sectionName = section === "projects" ? "Projects" : section === "news" ? "News" : "Messages";

  if (access !== "ready") return <main className={s.accessPage} data-text-reveal="off">
    <Link href="/" className={s.brand} aria-label="EKE homepage"><img src="/assets/eke-logo-symbol.svg" alt=""/><img src="/assets/eke-logo-wordmark.svg" alt="EKE"/></Link>
    <section className={s.accessCard}><h1>{access === "denied" ? "Administrator access required" : access === "error" ? "Unable to open your workspace" : "Opening your workspace…"}</h1>
      {access === "loading" ? <p role="status">Checking your session.</p> : <><p role="alert">{access === "denied" ? "This account does not have permission to manage EKE content." : error || "The server could not be reached. Please try again."}</p><div>{access === "error" && <button className={s.primary} disabled={loading} onClick={retry}>{loading ? "Retrying…" : "Try again"}</button>}<Link className={s.secondary} href="/login/">Back to sign in</Link></div></>}
    </section>
  </main>;

  return <div className={s.shell} data-text-reveal="off">
    <a className={s.skip} href="#admin-content">Skip to content</a>
    <aside className={s.sidebar}>
      <Link href="/" className={s.brand} aria-label="EKE homepage"><img src="/assets/eke-logo-symbol.svg" alt=""/><img src="/assets/eke-logo-wordmark.svg" alt="EKE"/></Link>
      <div className={s.workspaceLabel}>CONTENT WORKSPACE</div>
      <nav aria-label="Admin navigation">{(["projects", "news", "messages"] as const).map(item => <button key={item} disabled={busy} aria-current={section === item ? "page" : undefined} className={section === item ? s.active : ""} onClick={() => navigate(item)}><Icon name={item}/><span>{item[0].toUpperCase() + item.slice(1)}</span><small>{loaded ? item === "projects" ? projectCount : item === "news" ? newsCount : messages.length : "—"}</small></button>)}</nav>
      <div className={s.sidebarBottom}><div className={s.previewCard}><span className={s.dot}/> EKE administration<p>Manage your projects, stories and community messages.</p></div><Link href="/">View website <span aria-hidden="true">↗</span></Link><div className={s.profile}><span>EK</span><div>{admin?.username}<small>Administrator</small></div></div></div>
    </aside>
    <div className={s.workspace}>
      <header className={s.topbar}><span>Administration <span className={s.slash}>/</span> <strong>{sectionName}</strong></span><button className={s.secondary} disabled={busy} onClick={() => void signOut()}>Sign out</button></header>
      <main id="admin-content" className={s.main}>
        <div className={s.pageHeading}><div><div className={s.eyebrow}>EKE · CONTENT & COMMUNITY</div><h1 ref={heading} tabIndex={-1}>{editor ? `${editor.id ? "Edit" : "Add"} ${section === "news" ? "news" : "project"}` : "Make an impact."}</h1><p>{editor ? "Bring your story to life. Complete the details below." : "Your projects, stories and conversations. All in one place."}</p></div>{!editor && section !== "messages" && <button className={s.primary} disabled={!loaded || loading || busy} onClick={() => edit()}><span aria-hidden="true">＋</span> Add {section === "news" ? "news" : "project"}</button>}</div>
        <div role="status" className={notice ? s.notice : undefined}>{notice}</div>
        {error && <div role="alert" className={s.error}>{error}{!editor && <button className={s.secondary} disabled={loading} onClick={retry}>Retry</button>}</div>}
        {editor ? <form className={s.editor} onSubmit={save} aria-busy={busy}>
          <div className={s.formHeader}><h2>{section === "news" ? "Story details" : "Project details"}</h2><span>* Required fields</span></div>
          <fieldset disabled={busy} className={s.formGrid}>
            {section === "projects" && <label className={s.full}>Title *<input ref={titleInput} required maxLength={200} value={editor.title} onChange={e => field("title", e.target.value)} placeholder="Name your project"/></label>}
            <label className={s.full}>{section === "news" ? "Short description" : "Quick summary"} *<textarea ref={summaryInput} required rows={3} maxLength={1200} value={editor.summary} onChange={e => field("summary", e.target.value)} placeholder="A short introduction that captures the essentials"/></label>
            {section === "projects" ? <>
              <label className={s.full}>Description *<textarea required rows={6} value={editor.description} onChange={e => field("description", e.target.value)}/></label>
              <label>Budget (€) *<input type="number" min="0" step="1" required value={editor.budget} onChange={e => field("budget", e.target.value)}/></label>
              <label>Status<select value={editor.status} onChange={e => field("status", e.target.value)}><option value="ongoing">Ongoing</option><option value="completed">Past</option></select></label>
              <label>Start date<input type="date" value={editor.startDate} onChange={e => field("startDate", e.target.value)}/></label>
              <label>End date<input type="date" min={editor.startDate || undefined} value={editor.endDate} onChange={e => field("endDate", e.target.value)}/></label>
              <label className={s.full}>Partners<input value={editor.partners} onChange={e => field("partners", e.target.value)} placeholder="Separate partner names with commas"/></label>
            </> : <label className={s.full}>Instagram URL *<input type="url" required value={editor.instagram} onChange={e => field("instagram", e.target.value)} placeholder="https://www.instagram.com/p/…"/></label>}
            <label className={s.upload}>Cover image {!editor.id && "*"}<span>PNG, JPG, WebP or GIF · up to 5 MB</span>{editor.image && <img src={editor.image} alt="Selected cover"/>}{imageFile && <span>{imageFile.name}</span>}<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={e => { attach(e.target.files?.[0], "image"); e.target.value = ""; }}/></label>
            {section === "projects" && <label className={s.upload}>Project document<span>PDF · up to 20 MB</span>{pdfFile ? <span>{pdfFile.name}</span> : editor.pdf ? <a href={editor.pdf} target="_blank" rel="noopener noreferrer">View current document ↗</a> : null}<input type="file" accept="application/pdf" onChange={e => { attach(e.target.files?.[0], "pdf"); e.target.value = ""; }}/></label>}
          </fieldset><div className={s.formFooter}><p>Changes are saved to EKE’s content database.</p><button type="button" className={s.secondary} disabled={busy} onClick={cancel}>Cancel</button><button className={s.primary} disabled={busy}>{busy ? "Saving…" : "Save changes"}<span aria-hidden="true">↗</span></button></div>
        </form> : <>
          <div className={s.stats}>{([['projects', 'Projects', projectCount, 'Ideas turned into action'], ['news', 'News stories', newsCount, 'Keep your community inspired'], ['messages', 'Messages', messages.length, 'Your community’s conversations']] as const).map(([key, label, count, caption]) => <button key={key} onClick={() => navigate(key)} className={section === key ? s.selectedStat : ""}><div><span>{label}</span><Icon name={key}/></div><strong>{loaded ? String(count).padStart(2, "0") : "—"}</strong><small>{caption}</small></button>)}</div>
          <section className={s.content} aria-label={sectionName} aria-busy={loading}>
            <div className={s.contentHeading}><h2>{sectionName} <span>{loaded ? section === "projects" ? projectCount : section === "news" ? newsCount : messages.length : "—"}</span></h2><p>{section === "messages" ? "Your community’s conversations" : "Manage the content that tells your story"}</p></div>
            <div className={s.toolbar}><div className={s.filters} aria-label="Filter projects">{section === "projects" ? ["all", "ongoing", "completed"].map(value => <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{value === "all" ? "All projects" : value === "ongoing" ? "Ongoing" : "Past"}</button>) : <span>{section === "messages" ? "All messages" : "All news stories"}</span>}</div><label className={s.search}><Icon name="search"/><input type="search" aria-label={`Search ${section}`} placeholder={`Search ${section}…`} value={query} onChange={e => setQuery(e.target.value)}/></label></div>
            {loading ? <div className={s.empty} role="status">Loading your content…</div> : !loaded ? <div className={s.empty}><h3>Content is unavailable.</h3><p>Please retry to load your workspace.</p></div> : section === "messages" && visibleMessages.length ? <div className={s.messages}>{visibleMessages.map(message => <article className={s.message} key={message.id}><div><h3>{message.subject || "Contact message"}</h3><button className={s.textDelete} aria-label={`Delete message from ${message.fullName}`} onClick={() => confirmDelete({ id: String(message.id), kind: "messages", label: message.subject || `Message from ${message.fullName}` })}>Delete</button></div><p className={s.sender}>{message.fullName} · <a href={`mailto:${encodeURIComponent(message.email)}`}>{message.email}</a></p><p className={s.messageBody}>{message.yourMessage}</p></article>)}</div> : section !== "messages" && visible.length ? <div className={s.rows}>{visible.map(entry => <article className={s.row} key={`${entry.kind}-${entry.id}`}><img className={s.thumbnail} src={entry.image || "/assets/eke-logo-symbol.svg"} alt=""/><div className={s.rowText}><h3>{entryLabel(entry)}</h3>{entry.kind === "projects" && <p>{entry.summary}</p>}</div><span className={entry.kind === "news" ? s.storyBadge : entry.status === "ongoing" ? s.ongoingBadge : s.pastBadge}>{entry.kind === "news" ? "News story" : entry.status === "ongoing" ? "Ongoing" : "Past"}</span><div className={s.rowActions}><button aria-label={`Edit ${entryLabel(entry)}`} onClick={() => edit(entry)}>Edit <span aria-hidden="true">↗</span></button><button className={s.delete} aria-label={`Delete ${entryLabel(entry)}`} onClick={() => confirmDelete({ id: entry.id, kind: entry.kind, label: entryLabel(entry) })}>Delete</button></div></article>)}</div> : <div className={s.empty}><Icon name={section}/><h3>{query || filter !== "all" ? "No matching content." : `No ${section} yet.`}</h3><p>{query || filter !== "all" ? "Try another search or change your filters." : section === "messages" ? "Messages from the contact form will appear here." : "Add your first item to get started."}</p>{(query || filter !== "all") && <button className={s.secondary} onClick={() => { setQuery(""); setFilter("all"); }}>Clear filters</button>}</div>}
            <div className={s.listFooter}>Showing {loaded ? section === "messages" ? visibleMessages.length : visible.length : "—"} {section === "news" ? "news stories" : section}<span>EKE content workspace</span></div>
          </section>
        </>}
        <footer className={s.footer}>Empowering communities. Creating opportunities.<span>EKE · Admin workspace</span></footer>
      </main>
    </div>
    <dialog ref={dialog} className={s.dialog} onCancel={e => { if (busy) e.preventDefault(); }} onClose={() => { setDeleting(null); setDeleteError(""); }} aria-labelledby="delete-title"><h2 id="delete-title">Delete this {deleting?.kind === "news" ? "news item" : deleting?.kind === "messages" ? "message" : "project"}?</h2><p>“{deleting?.label}” will be permanently removed. This cannot be undone.</p>{deleteError && <p role="alert" className={s.error}>{deleteError}</p>}<div><button className={s.secondary} disabled={busy} autoFocus onClick={() => dialog.current?.close()}>Keep it</button><button className={s.danger} disabled={busy} onClick={() => void remove()}>{busy ? "Deleting…" : "Delete item"}</button></div></dialog>
  </div>;
}
