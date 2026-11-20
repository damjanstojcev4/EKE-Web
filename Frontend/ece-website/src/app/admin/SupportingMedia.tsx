"use client";
import { useState } from "react";
import { apiRequest } from "@/lib/admin-api";
import s from "./admin.module.css";
export default function SupportingMedia({
  onError,
}: {
  onError: (error: unknown) => void;
}) {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function upload(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const result = await apiRequest<{ url: string }>("/projects/media", {
        method: "POST",
        body,
      });
      setUrl(result.url);
    } catch (e) {
      setError((e as Error).message);
      onError(e);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={s.full}>
      <label>
        Upload supporting media
        <input
          type="file"
          disabled={busy}
          accept="image/png,image/jpeg,image/webp,image/gif,application/pdf"
          onChange={(e) => void upload(e.target.files?.[0])}
        />
      </label>
      <p>
        Images up to 5 MB or PDFs up to 20 MB. Copy the resulting URL into a
        resource or partner-media entry. Uploaded project media is public.
      </p>
      {busy && <p role="status">Uploading…</p>}
      {error && <p role="alert">{error}</p>}
      {url && (
        <label>
          Uploaded media URL
          <input readOnly value={url} onFocus={(e) => e.target.select()} />
        </label>
      )}
    </div>
  );
}
