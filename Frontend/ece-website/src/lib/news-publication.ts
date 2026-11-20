export type Publication = "draft" | "published" | "scheduled" | "legacy";
export type NewsRecord = {
  id: number; title: string | null; shortDescription: string; instagramUrl: string;
  category: "LATEST_NEWS" | "OPEN_CALL" | null; imageUrl: string | null;
  imageAlt: string | null; published: boolean | null; publishedAt: string | null;
};

export function publicationState(news: Pick<NewsRecord, "published" | "publishedAt">, now = Date.now()): Publication {
  if (news.published === null) return "legacy";
  if (!news.published || !news.publishedAt) return "draft";
  return new Date(news.publishedAt).getTime() > now ? "scheduled" : "published";
}

/** datetime-local displays the editor's browser timezone; APIs persist UTC instants. */
export function localPublicationTime(instant: string | null): string {
  if (!instant) return "";
  const date = new Date(instant);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function publicationInstant(local: string): string {
  if (!local || !Number.isFinite(new Date(local).getTime())) throw new Error("Choose a valid publication date and time.");
  // Reject nonexistent wall times during the spring daylight-saving transition.
  const normalized = local.length === 16 ? `${local}:00` : local;
  const instant = new Date(local).toISOString();
  if (localPublicationTime(instant) !== normalized) throw new Error("This time does not exist in your timezone. Choose another time.");
  return instant;
}

export function publicationFields(state: Exclude<Publication, "legacy">, local: string, original: string | null = null, now = Date.now()) {
  if (state === "draft") return { published: "false" };
  const instant = original && localPublicationTime(original) === local ? original : publicationInstant(local);
  const future = new Date(instant).getTime() > now;
  if (state === "scheduled" && !future) throw new Error("Scheduled publication must be in the future.");
  if (state === "published" && future) throw new Error("Choose Schedule for a future publication time, or Publish now.");
  return { published: "true", publishedAt: instant };
}
