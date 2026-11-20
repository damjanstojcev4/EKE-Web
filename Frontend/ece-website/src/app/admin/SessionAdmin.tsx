"use client";
import { useEffect, useState, type FormEvent } from "react";
import { apiRequest } from "@/lib/admin-api";
import type { SessionRecord } from "@/lib/api/sessions";
import {
  localPublicationTime,
  publicationInstant,
} from "@/lib/news-publication";
import s from "./admin.module.css";
type Draft = Record<string, string>;
const common = [
  "title",
  "slug",
  "description",
  "category",
  "location",
  "startDate",
  "endDate",
  "opensAt",
];
const opportunity = [
  "country",
  "minimumAge",
  "maximumAge",
  "applicationDeadline",
  "applicationUrl",
  "relatedProjectUuid",
];
const training = [
  "audience",
  "format",
  "language",
  "cost",
  "learningObjectives",
  "trainingMethods",
  "registrationDeadline",
  "registrationUrl",
];
const label = (key: string) =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
const timed = (key: string) => key.endsWith("Deadline") || key === "opensAt";
export default function SessionAdmin({
  module,
  onError,
}: {
  module: "opportunities" | "training";
  onError: (e: unknown) => void;
}) {
  const [records, setRecords] = useState<SessionRecord[]>();
  const [editor, setEditor] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const fields = [
    ...common,
    ...(module === "training" ? training : opportunity),
  ];
  const path = `/${module}/admin`;
  useEffect(() => {
    let active = true;
    apiRequest<SessionRecord[]>(path)
      .then((r) => {
        if (active) setRecords(r);
      })
      .catch((e) => {
        if (active) {
          setError(e.message);
          onError(e);
        }
      });
    return () => {
      active = false;
    };
  }, [path, onError]);
  function edit(record?: SessionRecord) {
    const draft: Draft = { published: "false", availability: "OPEN" };
    if (record)
      Object.entries(record).forEach(([key, value]) => {
        draft[key] =
          value == null
            ? ""
            : timed(key)
              ? localPublicationTime(String(value))
              : String(value);
      });
    setEditor(draft);
    setError("");
    setNotice("");
  }
  async function save(e: FormEvent) {
    e.preventDefault();
    if (!editor) return;
    setBusy(true);
    setError("");
    try {
      const body: Record<string, unknown> = {
        published: editor.published === "true",
        availability: editor.availability,
      };
      for (const key of fields)
        body[key] = !editor[key]
          ? null
          : timed(key)
            ? publicationInstant(editor[key])
            : key.endsWith("Age")
              ? Number(editor[key])
              : editor[key];
      const saved = await apiRequest<SessionRecord>(
        path + (editor.id ? `/${editor.id}` : ""),
        {
          method: editor.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      setRecords((current) => [
        saved,
        ...(current || []).filter((r) => r.id !== saved.id),
      ]);
      setEditor(null);
      setNotice("Saved to the content database.");
    } catch (cause) {
      setError((cause as Error).message);
      onError(cause);
    } finally {
      setBusy(false);
    }
  }
  async function remove(record: SessionRecord) {
    if (!window.confirm(`Delete “${record.title}”? This cannot be undone.`))
      return;
    setBusy(true);
    try {
      await apiRequest(`${path}/${record.id}`, { method: "DELETE" });
      setRecords((current) => current?.filter((r) => r.id !== record.id));
      setNotice("Deleted.");
    } catch (cause) {
      setError((cause as Error).message);
      onError(cause);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section aria-label={`${module} management`}>
      <div className={s.pageHeading}>
        <h1>{module === "training" ? "Training sessions" : "Opportunities"}</h1>
        {!editor && (
          <button
            className={s.primary}
            disabled={busy || !records}
            onClick={() => edit()}
          >
            Add {module === "training" ? "session" : "opportunity"}
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className={s.error}>
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className={s.notice}>
          {notice}
        </p>
      )}
      {editor ? (
        <form className={s.editor} onSubmit={save}>
          <fieldset className={s.formGrid} disabled={busy}>
            {fields.map((key) => (
              <label key={key} className={s.full}>
                {label(key)}
                {["title", "slug"].includes(key) && " *"}
                {[
                  "description",
                  "learningObjectives",
                  "trainingMethods",
                ].includes(key) ? (
                  <textarea
                    rows={4}
                    maxLength={10000}
                    value={editor[key] || ""}
                    onChange={(e) =>
                      setEditor({ ...editor, [key]: e.target.value })
                    }
                  />
                ) : (
                  <input
                    required={["title", "slug"].includes(key)}
                    type={
                      timed(key)
                        ? "datetime-local"
                        : key.endsWith("Date")
                          ? "date"
                          : key.endsWith("Url")
                            ? "url"
                            : key.endsWith("Age")
                              ? "number"
                              : "text"
                    }
                    step={timed(key) ? "1" : undefined}
                    value={editor[key] || ""}
                    onChange={(e) =>
                      setEditor({ ...editor, [key]: e.target.value })
                    }
                  />
                )}
              </label>
            ))}
            <label>
              Publication
              <select
                value={editor.published}
                onChange={(e) =>
                  setEditor({ ...editor, published: e.target.value })
                }
              >
                <option value="false">Unpublished</option>
                <option value="true">Published</option>
              </select>
            </label>
            <label>
              Availability
              <select
                value={editor.availability}
                onChange={(e) =>
                  setEditor({ ...editor, availability: e.target.value })
                }
              >
                <option>OPEN</option>
                <option>UPCOMING</option>
                <option>CLOSED</option>
              </select>
            </label>
            <p>
              Times use your browser timezone. Expired deadlines always close
              registration, even when availability is OPEN.
            </p>
          </fieldset>
          <div className={s.formFooter}>
            <button
              type="button"
              className={s.secondary}
              disabled={busy}
              onClick={() => {
                if (window.confirm("Discard unsaved changes?")) setEditor(null);
              }}
            >
              Cancel
            </button>
            <button className={s.primary} disabled={busy}>
              {busy ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      ) : !records ? (
        <p role="status">Loading…</p>
      ) : !records.length ? (
        <p>No records yet.</p>
      ) : (
        <div className={s.rows}>
          {records.map((r) => (
            <article className={s.row} key={r.id}>
              <div className={s.rowText}>
                <h2>{r.title}</h2>
                <p>{r.lifecycle}</p>
              </div>
              <div className={s.rowActions}>
                <button disabled={busy} onClick={() => edit(r)}>
                  Edit {r.title}
                </button>
                <button disabled={busy} onClick={() => void remove(r)}>
                  Delete {r.title}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
