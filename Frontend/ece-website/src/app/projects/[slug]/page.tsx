import { createMetadata, seoPages } from "@/lib/seo";
import manifest from "@/content/route-manifest.json";
import ProjectRoute from "@/components/project-details/ProjectRoute";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return createMetadata({ ...seoPages.projects, path: `/projects/${slug}`, noindex: true });
}
export const dynamicParams = false;
export function generateStaticParams() {
  return manifest.projects.map((slug) => ({ slug }));
}
export default function ProjectPage() {
  return <ProjectRoute />;
}
