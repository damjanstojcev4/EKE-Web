export type Project = {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  status: "completed" | "ongoing";
  dates: string;
  description: string;
  emphasis: string;
  /** Reserved destination; Project Details is deliberately not implemented yet. */
  detailHref: `/projects/${string}`;
};
