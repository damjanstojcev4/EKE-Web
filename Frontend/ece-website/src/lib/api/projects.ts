export type ProjectRecord = {
  resourcesJson: string | null;
  partnerMediaJson: string | null;
  uuid: string;
  slug: string;
  title: string;
  description: string | null;
  quickSummary: string | null;
  budget: number;
  status: "ON_GOING" | "PAST";
  startDate: string | null;
  endDate: string | null;
  image: string | null;
  imageAlt: string | null;
  pdfUrl: string | null;
  partners: string[];
  programme: string | null;
  grantValue: number | null;
  currency: string | null;
  countries: string | null;
  keyAction: string | null;
  actionType: string | null;
  website: string | null;
  topics: string | null;
  contentJson: string | null;
  logoFilePath: string | null;
  downloadDescription: string | null;
};
export function projectHref(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
    ? `/projects/${encodeURIComponent(slug)}/`
    : undefined;
}
