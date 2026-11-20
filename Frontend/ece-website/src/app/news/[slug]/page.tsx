import manifest from "@/content/route-manifest.json";
import PublicArticle from "@/components/news/PublicArticle";
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
