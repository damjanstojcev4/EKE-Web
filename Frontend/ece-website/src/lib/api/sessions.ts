export type SessionRecord = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  opensAt: string | null;
  published: boolean;
  availability: "OPEN" | "CLOSED" | "UPCOMING";
  lifecycle: "OPEN" | "CLOSED" | "UPCOMING" | "UNPUBLISHED";
  applicationDeadline?: string | null;
  applicationUrl?: string | null;
  country?: string | null;
  minimumAge?: number | null;
  maximumAge?: number | null;
  relatedProjectUuid?: string | null;
  registrationDeadline?: string | null;
  registrationUrl?: string | null;
  audience?: string | null;
  format?: string | null;
  language?: string | null;
  cost?: string | null;
  learningObjectives?: string | null;
  trainingMethods?: string | null;
};
export function deadlineLabel(
  deadline: string | null | undefined,
  lifecycle: string,
  now = Date.now(),
) {
  if (lifecycle !== "OPEN") return lifecycle.toLowerCase();
  if (!deadline) return "Open";
  const remaining = new Date(deadline).getTime() - now;
  return remaining <= 0
    ? "Closed"
    : `${Math.ceil(remaining / 86400000)} days left`;
}

export function sessionLifecycle(session: SessionRecord, now: number): string {
  const deadline = session.applicationDeadline || session.registrationDeadline;
  if (session.published === false) return "UNPUBLISHED";
  const today = new Intl.DateTimeFormat("sv-SE", {timeZone: "Europe/Skopje"}).format(now);
  if (session.availability === "CLOSED" || (deadline && Date.parse(deadline) <= now) || (session.endDate && session.endDate < today)) return "CLOSED";
  if (session.availability === "UPCOMING" || (session.opensAt && Date.parse(session.opensAt) > now)) return "UPCOMING";
  return session.availability === "OPEN" ? "OPEN" : session.lifecycle;
}
