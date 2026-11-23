import { createMetadata, seoPages } from "@/lib/seo";
import manifest from "@/content/route-manifest.json";
import PublicArticle from "@/components/news/PublicArticle";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return createMetadata({ ...seoPages.news, path: `/news/${slug}`, noindex: true });
}
export const dynamicParams = false;
export function generateStaticParams() {
  return manifest.news.map((slug) => ({ slug }));
}
export default async function NewsDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PublicArticle slug={slug} />;
}
