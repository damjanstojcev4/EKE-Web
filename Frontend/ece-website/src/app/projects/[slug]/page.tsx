import { cache } from "react";
import { notFound } from "next/navigation";
import { createMetadata, seoPages } from "@/lib/seo";
import { apiRequest, ApiError } from "@/lib/api/client";
import type { ProjectRecord } from "@/lib/api/projects";
import manifest from "@/content/route-manifest.json";
import PublicProject from "@/components/project-details/PublicProject";
const server = process.env.PROJECT_DETAILS_SERVER === "true";
const getProject = cache(async (slug: string) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) notFound();
  try { return await apiRequest<ProjectRecord>(`/projects/slug/${slug}`); }
  catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
});
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = server ? await getProject(slug) : undefined;
  return createMetadata({ ...seoPages.projects,
    title: project?.title || seoPages.projects.title,
    description: project?.quickSummary || project?.description || seoPages.projects.description,
    path: `/projects/${slug}`, noindex: true });
}
export const dynamicParams = false;
// Runtime resolves every slug on request; the original export still builds offline.
export function generateStaticParams() {
  return server ? [] : manifest.projects.map((slug) => ({ slug }));
}
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = server ? await getProject(slug) : undefined;
  return <PublicProject key={slug} slug={slug} initialProject={project} />;
}
