"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { projects } from "@/data/projects.mock";
import { newsArticles } from "@/data/news.mock";
import s from "./admin.module.css";

type Section = "projects" | "news" | "messages";
type Entry = {
  id: string; kind: "projects" | "news"; title: string; description: string;
  summary: string; status: "ongoing" | "completed"; budget: string;
  startDate: string; endDate: string; partners: string; instagram: string;
  image: string; pdf: string; pdfName: string;
};
const blank: Entry = { id: "", kind: "projects", title: "", description: "", summary: "", status: "ongoing", budget: "", startDate: "", endDate: "", partners: "", instagram: "", image: "", pdf: "", pdfName: "" };
const seed: Entry[] = [
  ...projects.map(p => ({ ...blank, id: p.id, kind: "projects" as const, title: p.title.replace(/\n/g, " "), description: p.description, summary: p.emphasis, status: p.status, image: `/assets/projects-page/${p.image}` })),
  ...newsArticles.map(n => ({ ...blank, id: n.id, kind: "news" as const, title: n.title, summary: n.summary, image: n.image })),
];
const storageKey = "eke-admin-preview-v1";

function Icon({ name }: { name: string }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{name === "projects" ? <><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 5V3h8v2M3 10h18"/></> : name === "news" ? <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h4M8 18h8"/></> : name === "messages" ? <><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 7 9 6 9-6"/></> : <><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></>}</svg>;
}

export default function AdminDashboard() {
  const [entries, setEntries] = useState<Entry[]>(seed);
  const [ready, setReady] = useState(false);
  const [section, setSection] = useState<Section>("projects");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [editor, setEditor] = useState<Entry | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [reading, setReading] = useState(false);
  const [deleting, setDeleting] = useState<Entry | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleInput = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  // Restore browser-only storage after hydration so the static export and first client render match.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (!Array.isArray(parsed) || !parsed.every(item => item && Object.keys(blank).every(key => typeof item[key] === "string") && ["projects", "news"].includes(item.kind) && ["ongoing", "completed"].includes(item.status))) throw new Error("Invalid data");
        setEntries(parsed as Entry[]);
      }
    } catch { setNotice("Saved preview data could not be loaded. Showing the original examples."); }
    setReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  function persist(next: Entry[], message: string) {
    try { localStorage.setItem(storageKey, JSON.stringify(next)); }
    catch { setError("Your browser could not save this change. Free some browser storage or use smaller attachments, then try again."); return false; }
    setEntries(next); setNotice(message); setError(""); return true;
  }
  function navigate(next: Section) {
    if (editor && !window.confirm("Discard your unsaved changes?")) return;
    setSection(next); setEditor(null); setQuery(""); setFilter("all"); setError("");
  }
  function edit(entry?: Entry) {
    setEditor(entry ? { ...entry } : { ...blank, kind: section === "news" ? "news" : "projects" });
    setError(""); setNotice("");
    requestAnimationFrame(() => titleInput.current?.focus());
  }
  function cancel() {
    if (!window.confirm("Discard your unsaved changes?")) return;
    setEditor(null); setError(""); requestAnimationFrame(() => heading.current?.focus());
  }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor) return;
    if (!editor.title.trim() || !editor.summary.trim() || (editor.kind === "projects" && !editor.description.trim())) { setError("Please complete the required text fields."); return; }
    if (editor.endDate && editor.startDate && editor.endDate < editor.startDate) { setError("End date must be on or after the start date."); return; }
    if (editor.kind === "news" && !editor.image) { setError("Choose an image for this news item."); return; }
    const saved = { ...editor, title: editor.title.trim(), id: editor.id || crypto.randomUUID() };
    const next = editor.id ? entries.map(e => e.id === editor.id && e.kind === editor.kind ? saved : e) : [saved, ...entries];
    if (persist(next, `${editor.kind === "projects" ? "Project" : "News item"} saved in this browser. The public website is unchanged.`)) { setEditor(null); requestAnimationFrame(() => heading.current?.focus()); }
  }
  async function attach(file: File | undefined, kind: "image" | "pdf") {
    if (!file) return;
    if ((kind === "image" && !["image/png", "image/jpeg", "image/webp", "image/gif"].includes(file.type)) || (kind === "pdf" && file.type !== "application/pdf")) { setError("Choose a PNG, JPG, WebP or GIF image, or a PDF document."); return; }
    if (file.size > (kind === "image" ? 1024 * 1024 : 2 * 1024 * 1024)) { setError(`Choose a ${kind === "image" ? "1 MB or smaller image" : "2 MB or smaller PDF"} for this preview.`); return; }
    setReading(true); setError("");
    try {
      const data = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file); });
      setEditor(current => current ? { ...current, [kind]: data, ...(kind === "pdf" ? { pdfName: file.name } : {}) } : null);
    } catch { setError("This file could not be read. Please try another file."); }
    finally { setReading(false); }
  }
  function field(key: keyof Entry, value: string) { setEditor(current => current ? { ...current, [key]: value } : null); }
  const visible = entries.filter(e => e.kind === section && (filter === "all" || e.status === filter) && `${e.title} ${e.summary}`.toLowerCase().includes(query.toLowerCase()));
  const projectCount = entries.filter(e => e.kind === "projects").length;
  const newsCount = entries.filter(e => e.kind === "news").length;
  const sectionName = section === "projects" ? "Projects" : section === "news" ? "News" : "Messages";

  return <div className={s.shell} data-text-reveal="off">
    <a className={s.skip} href="#admin-content">Skip to content</a>
    <aside className={s.sidebar}>
      <Link href="/" className={s.brand} aria-label="EKE homepage"><img src="/assets/eke-logo-symbol.svg" alt=""/><img src="/assets/eke-logo-wordmark.svg" alt="EKE"/></Link>
      <div className={s.workspaceLabel}>CONTENT WORKSPACE</div>
      <nav aria-label="Admin navigation">{(["projects", "news", "messages"] as const).map(item => <button key={item} aria-current={section === item ? "page" : undefined} className={section === item ? s.active : ""} onClick={() => navigate(item)}><Icon name={item}/><span>{item[0].toUpperCase() + item.slice(1)}</span><small>{item === "projects" ? projectCount : item === "news" ? newsCount : 0}</small></button>)}</nav>
      <div className={s.sidebarBottom}><div className={s.previewCard}><span className={s.dot}/> Staging preview<p>A space to explore the new admin experience.</p></div><Link href="/">View website <span aria-hidden="true">↗</span></Link><div className={s.profile}><span>EK</span><div>EKE workspace<small>Preview administrator</small></div></div></div>
    </aside>
    <div className={s.workspace}>
      <header className={s.topbar}><span>Administration <span className={s.slash}>/</span> <strong>{sectionName}</strong></span><span className={s.previewBadge}>PREVIEW MODE</span></header>
      <main id="admin-content" className={s.main}>
        <div className={s.pageHeading}><div><div className={s.eyebrow}>EKE · CONTENT & COMMUNITY</div><h1 ref={heading} tabIndex={-1}>{editor ? `${editor.id ? "Edit" : "Add"} ${section === "news" ? "news" : "project"}` : "Make an impact."}</h1><p>{editor ? "Bring your story to life. Complete the details below." : "Your projects, stories and conversations. All in one place."}</p></div>{!editor && section !== "messages" && <button className={s.primary} disabled={!ready} onClick={() => edit()}><span aria-hidden="true">＋</span> Add {section === "news" ? "news" : "project"}</button>}</div>
        <div className={s.previewNotice}><span aria-hidden="true">ⓘ</span><p><strong>A preview of what’s next.</strong> Changes are saved only in this browser. Public content and live messages are not connected.</p></div>
        <div role="status" className={notice ? s.notice : undefined}>{notice}</div>
        {error && <div role="alert" className={s.error}>{error}</div>}
        {editor ? <form className={s.editor} onSubmit={save}>
          <div className={s.formHeader}><h2>{section === "news" ? "Story details" : "Project details"}</h2><span>* Required fields</span></div>
          <div className={s.formGrid}>
            <label className={s.full}>Title *<input ref={titleInput} required maxLength={200} value={editor.title} onChange={e => field("title", e.target.value)} placeholder={section === "news" ? "Give your story a title" : "Name your project"}/></label>
            <label className={s.full}>{section === "news" ? "Short description" : "Quick summary"} *<textarea required rows={3} maxLength={1200} value={editor.summary} onChange={e => field("summary", e.target.value)} placeholder="A short introduction that captures the essentials"/></label>
            {section === "projects" ? <>
              <label className={s.full}>Description *<textarea required rows={6} value={editor.description} onChange={e => field("description", e.target.value)}/></label>
              <label>Budget (€) *<input type="number" min="0" step="1" required value={editor.budget} onChange={e => field("budget", e.target.value)}/></label>
              <label>Status<select value={editor.status} onChange={e => field("status", e.target.value)}><option value="ongoing">Ongoing</option><option value="completed">Past</option></select></label>
              <label>Start date<input type="date" value={editor.startDate} onChange={e => field("startDate", e.target.value)}/></label>
              <label>End date<input type="date" min={editor.startDate || undefined} value={editor.endDate} onChange={e => field("endDate", e.target.value)}/></label>
              <label className={s.full}>Partners<input value={editor.partners} onChange={e => field("partners", e.target.value)} placeholder="Separate partner names with commas"/></label>
            </> : <label className={s.full}>Instagram URL *<input type="url" required value={editor.instagram} onChange={e => field("instagram", e.target.value)} placeholder="https://www.instagram.com/p/…"/></label>}
            <label className={s.upload}>Cover image {section === "news" && "*"}<span>PNG, JPG, WebP or GIF · up to 1 MB</span>{editor.image && <img src={editor.image} alt="Selected cover"/>}<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={reading} onChange={e => { void attach(e.target.files?.[0], "image"); e.target.value = ""; }}/></label>
            {section === "projects" && <label className={s.upload}>Project document<span>PDF · up to 2 MB</span>{editor.pdf && <a href={editor.pdf} download={editor.pdfName}>{editor.pdfName} ↓</a>}<input type="file" accept="application/pdf" disabled={reading} onChange={e => { void attach(e.target.files?.[0], "pdf"); e.target.value = ""; }}/></label>}
          </div><div className={s.formFooter}><p>Saved to your browser preview only.</p><button type="button" className={s.secondary} disabled={reading} onClick={cancel}>Cancel</button><button className={s.primary} disabled={reading}>{reading ? "Reading file…" : "Save changes"}<span aria-hidden="true">↗</span></button></div>
        </form> : <>
          <div className={s.stats}>{([['projects', 'Projects', projectCount, 'Ideas turned into action'], ['news', 'News stories', newsCount, 'Keep your community inspired'], ['messages', 'Messages', 0, 'Live inbox not connected']] as const).map(([key, label, count, caption]) => <button key={key} onClick={() => navigate(key)} className={section === key ? s.selectedStat : ""}><div><span>{label}</span><Icon name={key}/></div><strong>{String(count).padStart(2, "0")}</strong><small>{caption}</small></button>)}</div>
          <section className={s.content} aria-label={sectionName}>
            <div className={s.contentHeading}><h2>{sectionName} <span>{section === "projects" ? projectCount : section === "news" ? newsCount : 0}</span></h2><p>{section === "messages" ? "Your community’s conversations" : "Manage the content that tells your story"}</p></div>
            {section === "messages" ? <div className={s.empty}><Icon name="messages"/><h3>Your inbox will live here.</h3><p>Contact messages will appear once the backend is connected. No live messages are shown in this preview.</p><Link className={s.secondary} href="/contact">View contact page ↗</Link></div> : <>
              <div className={s.toolbar}><div className={s.filters} aria-label="Filter projects">{section === "projects" ? ["all", "ongoing", "completed"].map(value => <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{value === "all" ? "All projects" : value === "ongoing" ? "Ongoing" : "Past"}</button>) : <span>All news stories</span>}</div><label className={s.search}><Icon name="search"/><input type="search" aria-label={`Search ${section}`} placeholder={`Search ${section}…`} value={query} onChange={e => setQuery(e.target.value)}/></label></div>
              {!ready ? <div className={s.empty}>Loading your preview…</div> : visible.length ? <div className={s.rows}>{visible.map(entry => <article className={s.row} key={`${entry.kind}-${entry.id}`}><img className={s.thumbnail} src={entry.image || "/assets/eke-logo-symbol.svg"} alt=""/><div className={s.rowText}><h3>{entry.title}</h3><p>{entry.summary}</p></div><span className={entry.kind === "news" ? s.storyBadge : entry.status === "ongoing" ? s.ongoingBadge : s.pastBadge}>{entry.kind === "news" ? "News story" : entry.status === "ongoing" ? "Ongoing" : "Past"}</span><div className={s.rowActions}><button aria-label={`Edit ${entry.title}`} onClick={() => edit(entry)}>Edit <span aria-hidden="true">↗</span></button><button className={s.delete} aria-label={`Delete ${entry.title}`} onClick={() => { setDeleting(entry); dialog.current?.showModal(); }}>Delete</button></div></article>)}</div> : <div className={s.empty}><Icon name={section}/><h3>{query || filter !== "all" ? "No matching content." : `No ${section} yet.`}</h3><p>{query || filter !== "all" ? "Try another search or change your filters." : "Add your first item to get started."}</p>{(query || filter !== "all") && <button className={s.secondary} onClick={() => { setQuery(""); setFilter("all"); }}>Clear filters</button>}</div>}
              <div className={s.listFooter}>Showing {visible.length} {section === "projects" ? "projects" : "news stories"}<span>Browser preview data</span></div>
            </>}
          </section>
        </>}
        <footer className={s.footer}>Empowering communities. Creating opportunities.<span>EKE · Admin workspace</span></footer>
      </main>
    </div>
    <dialog ref={dialog} className={s.dialog} onClose={() => setDeleting(null)} aria-labelledby="delete-title"><h2 id="delete-title">Delete this {deleting?.kind === "news" ? "news item" : "project"}?</h2><p>“{deleting?.title}” will be removed from this browser’s preview. This cannot be undone.</p><div><button className={s.secondary} autoFocus onClick={() => dialog.current?.close()}>Keep it</button><button className={s.danger} onClick={() => { if (deleting) persist(entries.filter(e => !(e.id === deleting.id && e.kind === deleting.kind)), "Item deleted from this browser’s preview."); dialog.current?.close(); }}>Delete item</button></div></dialog>
  </div>;
}
