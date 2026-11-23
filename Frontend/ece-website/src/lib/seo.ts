import type { Metadata } from "next";
import { existsSync, statSync } from "node:fs";
import path from "node:path";

export const seoPages = {
  home: {
    path: "/",
    title: "Learning That Moves People Forward",
    description:
      "Empowering people of all ages through lifelong learning, non-formal education, and cross-sector partnerships across Europe.",
    image: "/images/seo/home-og.webp",
    label: "Home",
  },
  about: {
    path: "/about",
    title: "Inspiring Locally, Impacting Globally",
    description:
      "Discover our story, mission, and dedicated team turning international inspiration into lifelong education in Bitola, N. Macedonia.",
    image: "/images/seo/about-og.webp",
    label: "About",
  },
  opportunities: {
    path: "/opportunities",
    title: "Opportunities Worth Saying Yes To",
    description:
      "Expand your horizons. Explore fully funded international volunteering projects and open calls through the European Solidarity Corps.",
    image: "/images/seo/opportunities-og.webp",
    label: "Opportunities",
  },
  projects: {
    path: "/projects",
    title: "Lifelong Learning in Action",
    description:
      "Explore our portfolio of community initiatives, grassroots campaigns, and regional frameworks designed for lasting social impact.",
    image: "/images/seo/projects-og.webp",
    label: "Projects",
  },
  training: {
    path: "/training",
    title: "Building Skills for Lasting Social Impact",
    description:
      "Capacity-building workshops and intensive seminars tailored for educators, youth workers, and field specialists. Learn by doing.",
    image: "/images/seo/training-og.webp",
    label: "Training",
  },
  news: {
    path: "/news",
    title: "Community Updates & Shared Insights",
    description:
      "Stay up to date with our recent cross-border field insights, open-source toolkits, and network briefs shaping civic development.",
    image: "/images/seo/news-og.webp",
    label: "News",
  },
  contact: {
    path: "/contact",
    title: "Set Change In Motion",
    description:
      "Ready to co-develop an Erasmus+ proposal or launch a joint initiative? Get in touch with our central hub team in Bitola.",
    image: "/images/seo/contact-og.webp",
    label: "Contact",
  },
  privacy: {
    path: "/privacy-policy",
    title: "EKE's Privacy Policy",
    description:
      "Learn how we safely process, collect, and protect your personal data in complete compliance with local transparency legislation.",
    image: "/images/seo/privacy-og.webp",
    label: "Privacy Policy",
  },
} as const;

export type SeoPage = keyof typeof seoPages;
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

// Enable after the supplied page images have been reviewed with the user.
export const pageImagesEnabled = false;

export function getSiteConfig(env: NodeJS.ProcessEnv = process.env) {
  const configured = env.PRODUCTION_SITE_URL?.trim();
  let base: URL | undefined;
  if (configured) {
    const candidate = new URL(configured);
    if (
      candidate.protocol !== "https:" ||
      candidate.username ||
      candidate.password ||
      candidate.port ||
      candidate.pathname !== "/" ||
      candidate.search ||
      candidate.hash ||
      /(^|[.-])(localhost|staging|preview|test|invalid)([.-]|$)/i.test(
        candidate.hostname,
      ) ||
      /^\d+\.\d+\.\d+\.\d+$/.test(candidate.hostname)
    ) {
      throw new Error(
        "PRODUCTION_SITE_URL must be the public HTTPS production origin, without a path or credentials.",
      );
    }
    base = candidate;
  }
  const production = env.SEO_ENVIRONMENT === "production";
  if (production && !base)
    throw new Error(
      "PRODUCTION_SITE_URL is required for a production SEO build.",
    );
  return {
    base,
    indexable: production && env.NODE_ENV === "production" && Boolean(base),
  };
}

export function canonicalUrl(route: string): string | undefined {
  const { base } = getSiteConfig();
  if (!base) return undefined;
  if (!route.startsWith("/") || route.startsWith("//") || /[?#\\]/.test(route))
    throw new Error(
      "Canonical routes must be local paths without queries or fragments.",
    );
  // Match next.config.ts: trailingSlash: true.
  return new URL(route === "/" ? "/" : `${route.replace(/\/+$/, "")}/`, base)
    .href;
}

export function plainText(value: string): string {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&#(x[\da-f]+|\d+);/gi, (_, code: string) => {
      const point = code.toLowerCase().startsWith("x")
        ? parseInt(code.slice(1), 16)
        : Number(code);
      return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : " ";
    })
    .replace(
      /&(nbsp|amp|quot|apos|lt|gt|ndash|mdash|hellip);/gi,
      (_, name: string) =>
        ({
          nbsp: " ",
          amp: "&",
          quot: '"',
          apos: "'",
          lt: "<",
          gt: ">",
          ndash: "–",
          mdash: "—",
          hellip: "…",
        })[name.toLowerCase()] ?? " ",
    )
    .replace(/\s+/g, " ")
    .trim();
}

export function summarize(value: string, limit = 160): string {
  const text = plainText(value);
  if (text.length <= limit) return text;
  const clipped = text.slice(0, limit - 1);
  const sentence = clipped.match(/^.*[.!?](?=\s)/)?.[0];
  if (sentence && sentence.length >= limit * 0.6) return sentence;
  const boundary = clipped.lastIndexOf(" ");
  return `${(boundary > 0 ? clipped.slice(0, boundary) : "").replace(/[\s,;:–—-]+$/, "")}…`;
}

export function titleWithSite(title: string): string {
  const clean = plainText(title)
    .replace(/(?:\s*[|—–-]\s*EKE(?: Bitola)?)+$/i, "")
    .trim();
  return `${clean} | EKE`;
}

/** Only reference local public assets verified at build time. Remote API images
 * must be validated by a future backend adapter before being passed here. */
export function socialImage(
  candidate?: string,
  fallback?: string,
): string | undefined {
  const { base } = getSiteConfig();
  if (!base) return undefined;
  for (const asset of [candidate, fallback]) {
    if (
      !asset ||
      !asset.startsWith("/") ||
      asset.startsWith("//") ||
      /[?#\\]/.test(asset)
    )
      continue;
    if (asset.startsWith("/images/seo/") && !pageImagesEnabled) continue;
    const root = path.resolve(process.cwd(), "public");
    const file = path.resolve(root, `.${decodeURIComponent(asset)}`);
    if (!file.startsWith(root + path.sep) || !/\.(webp|png|jpe?g)$/i.test(file))
      continue;
    if (existsSync(file) && statSync(file).isFile() && statSync(file).size > 0)
      return new URL(asset, base).href;
  }
  return undefined;
}

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  fallbackImage?: string;
  noindex?: boolean;
  article?: { publishedTime?: string; modifiedTime?: string };
};

export function createMetadata(input: MetadataInput): Metadata {
  const title = titleWithSite(input.title);
  const description = plainText(input.description);
  const url = canonicalUrl(input.path);
  const image = socialImage(input.image, input.fallbackImage);
  const index = getSiteConfig().indexable && !input.noindex;
  return {
    title: { absolute: title },
    description,
    alternates: url ? { canonical: url } : undefined,
    robots: { index, follow: index },
    openGraph: {
      title,
      description,
      type: input.article ? "article" : "website",
      url,
      siteName: "EKE",
      locale: "en_US",
      images: image ? [{ url: image, alt: plainText(input.title) }] : [],
      ...input.article,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export function pageMetadata(page: SeoPage): Metadata {
  return createMetadata(seoPages[page]);
}
