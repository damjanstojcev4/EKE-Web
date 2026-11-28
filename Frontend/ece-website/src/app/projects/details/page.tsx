import { createMetadata, seoPages } from "@/lib/seo";
import ProjectRoute from "@/components/project-details/ProjectRoute";

export const metadata = createMetadata({
  ...seoPages.projects,
  path: "/projects/details",
  noindex: true,
});

export default function ProjectDetailsPage() {
  return <ProjectRoute />;
}
