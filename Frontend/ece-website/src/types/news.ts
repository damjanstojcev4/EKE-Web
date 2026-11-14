export type ArticleText = { text: string; strong?: boolean; href?: string; pendingLink?: boolean };
export type ArticleContentBlock =
  | { type: "paragraph"; text: ArticleText[] }
  | { type: "heading"; text: string }
  | { type: "list"; items: { title: string; text: string }[] };

export type NewsArticle = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  emphasis?: string;
  image: string;
  imageAlt: string;
  imagePlaceholder?: boolean;
  category?: string;
  publishedAt?: string;
  displayDate?: string;
  details?: {
    heroImage: string;
    introduction: ArticleText[];
    content: ArticleContentBlock[];
    sidebarIds: string[];
    otherItems: { kind: "article" | "media"; id: string; displayTitle: string }[];
  };
};

export type NewsMedia = {
  id: string;
  title: string;
  summary: string;
  image: string;
  imagePlaceholder?: boolean;
  kind: "audio" | "video";
  duration?: string;
  source?: string;
};
