import type { NewsRecord } from "../news-publication";
import type { ArticleContentBlock } from "@/types/news";
import manifest from "@/content/route-manifest.json";
export type PublicNews = NewsRecord & {
  slug: string;
  emphasis: string | null;
  introduction: string | null;
  contentJson: string | null;
  heroUrl: string | null;
  heroAlt: string | null;
  relatedIds: string | null;
};
export function articleBlocks(value: string | null): ArticleContentBlock[] {
  try {
    const blocks = JSON.parse(value || "[]");
    return Array.isArray(blocks) ? blocks : [];
  } catch {
    return [];
  }
}
export function newsHref(slug: string) {
  return manifest.news.includes(slug)
    ? `/news/${encodeURIComponent(slug)}/`
    : undefined;
}
export function categoryLabel(category: string | null) {
  return category === "OPEN_CALL" ? "Open call" : "Latest news";
}
export function displayDate(value: string | null) {
  return value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Europe/Skopje",
      })
    : "";
}
