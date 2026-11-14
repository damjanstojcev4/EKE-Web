export type Project = {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  status: "completed" | "ongoing";
  dates: string;
  description: string;
  emphasis: string;
  /** Stable local slug; reconcile with public backend identifiers later. */
  slug: string;
  detailHref: `/projects/${string}`;
  details?: {
    title: string;
    programme: string;
    startDate: string;
    endDate: string;
    grant: string;
    countries: number;
    keyAction: string;
    actionType: string;
    website: string;
    topics: string[];
    logo: string;
    summary: string;
    sections: { title: string; paragraphs: [string, string] }[];
    partnerArtwork: string;
    partnerNote: string;
    downloadDescription: string;
    documentUrl?: string;
  };
};
