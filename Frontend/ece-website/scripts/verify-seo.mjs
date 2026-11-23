import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { seoPages, titleWithSite } from "../src/lib/seo.ts";
import { projects } from "../src/data/projects.mock.ts";
import { newsArticles } from "../src/data/news.mock.ts";
import { summarize } from "../src/lib/seo.ts";

const root = path.resolve("out");
const decode = (text) =>
  text
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
const attrs = (tag) =>
  Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [
      match[1],
      decode(match[2]),
    ]),
  );
const errors = [];
const publicRoutes = new Set(
  Object.values(seoPages).map((page) => `${page.path.replace(/\/$/, "")}/`),
);
const indexableRoutes = new Set();
let count = 0;
let production;
let base;

async function check(file) {
  const html = await readFile(file, "utf8");
  const route = `/${path
    .relative(root, file)
    .replaceAll(path.sep, "/")
    .replace(/index\.html$/, "")}`;
  if (route === "/404.html" || route === "/404/" || route === "/_not-found/")
    return;
  count++;
  const titleMatches = [...html.matchAll(/<title>([^<]*)<\/title>/g)];
  assert.equal(titleMatches.length, 1, `${route}: exactly one title`);
  const title = decode(titleMatches[0][1]);
  assert.equal(title, titleWithSite(title), `${route}: title suffix`);
  const tags = [...html.matchAll(/<meta\s[^>]*>/g)].map((match) =>
    attrs(match[0]),
  );
  const meta = (name) => {
    const matches = tags.filter(
      (tag) => tag.name === name || tag.property === name,
    );
    assert.equal(matches.length, 1, `${route}: exactly one ${name}`);
    return matches[0].content;
  };
  const description = meta("description");
  assert.ok(description, `${route}: description`);
  assert.equal(meta("og:title"), title);
  assert.equal(meta("twitter:title"), title);
  assert.equal(meta("og:description"), description);
  assert.equal(meta("twitter:description"), description);
  assert.equal(meta("og:site_name"), "EKE");
  assert.equal(meta("og:locale"), "en_US");
  assert.equal(meta("twitter:card"), "summary_large_image");
  const robots = meta("robots");
  const indexable = !robots.includes("noindex");
  if (route === "/") production = indexable;
  if (production === false)
    assert.equal(indexable, false, `${route}: staging cannot index`);
  if (route === "/homepage-preview/") assert.equal(indexable, false);
  if (indexable) indexableRoutes.add(route);
  const canonicals = [...html.matchAll(/<link\s[^>]*>/g)]
    .map((match) => attrs(match[0]))
    .filter((tag) => tag.rel === "canonical");
  if (indexable || base)
    assert.equal(canonicals.length, 1, `${route}: canonical count`);
  assert.ok(canonicals.length <= 1, `${route}: no duplicate canonical`);
  if (canonicals.length) {
    const canonical = new URL(canonicals[0].href);
    base ??= canonical.origin;
    assert.equal(canonical.origin, base);
    assert.equal(canonical.protocol, "https:");
    assert.ok(!/staging|preview|localhost/.test(canonical.hostname));
    assert.equal(
      canonical.pathname,
      route === "/homepage-preview/" ? "/" : route,
    );
    assert.equal(meta("og:url"), canonical.href);
  } else {
    assert.equal(
      indexable,
      false,
      `${route}: unconfigured builds cannot index`,
    );
    assert.equal(tags.filter((tag) => tag.property === "og:url").length, 0);
  }
  const staticPage = Object.values(seoPages).find(
    (page) => `${page.path.replace(/\/$/, "")}/` === route,
  );
  if (staticPage) {
    assert.equal(title, `${staticPage.title} | EKE`);
    assert.equal(description, staticPage.description);
  }
  const project = projects.find((item) => `/projects/${item.slug}/` === route);
  const article = newsArticles.find((item) => `/news/${item.slug}/` === route);
  if (project) {
    assert.equal(title, titleWithSite(project.details?.title ?? project.title));
    assert.equal(
      description,
      summarize(project.details?.summary || project.description),
    );
  }
  if (article) {
    assert.equal(title, titleWithSite(article.title));
    assert.equal(
      description,
      summarize(
        article.summary ||
          article.details?.introduction.map((run) => run.text).join("") ||
          "",
      ),
    );
    const published = tags.filter(
      (tag) => tag.property === "article:published_time",
    );
    if (article.publishedAt) {
      assert.equal(published.length, 1);
      assert.equal(published[0].content, article.publishedAt);
    }
  }
  for (const image of tags.filter(
    (tag) => tag.property === "og:image" || tag.name === "twitter:image",
  )) {
    const url = new URL(image.content);
    assert.equal(url.origin, base);
    const imageFile = path.join(root, decodeURIComponent(url.pathname));
    assert.ok((await stat(imageFile)).size > 0, `${route}: image exists`);
  }
  const schemas = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ].map((match) => JSON.parse(match[1]));
  const nodes = schemas.flatMap((schema) => schema["@graph"] ?? [schema]);
  assert.equal(
    nodes.filter((node) => node["@type"] === "Organization").length,
    base ? 1 : 0,
  );
  assert.equal(
    nodes.filter((node) => node["@type"] === "WebSite").length,
    base ? 1 : 0,
  );
  if (staticPage && route !== "/" && base)
    assert.equal(
      nodes.filter((node) => node["@type"] === "BreadcrumbList").length,
      1,
    );
  const dynamicRoute = /^\/(news|projects)\/.+\/$/.test(route);
  if (
    dynamicRoute &&
    nodes.some((node) => ["Article", "CreativeWork"].includes(node["@type"]))
  ) {
    publicRoutes.add(route);
    assert.equal(
      nodes.filter((node) => node["@type"] === "BreadcrumbList").length,
      1,
    );
    assert.ok(description.length <= 160);
    assert.equal(
      meta("og:type"),
      route.startsWith("/news/") ? "article" : "website",
    );
  } else if (dynamicRoute) {
    assert.equal(indexable, false, `${route}: unfinished details excluded`);
  }
}

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === "_next") continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (entry.name.endsWith(".html")) {
      try {
        await check(file);
      } catch (error) {
        errors.push(`${file}: ${error.message}`);
      }
    }
  }
}

// Establish the build's indexing mode before walking other pages.
await check(path.join(root, "index.html"));
count = 0;
await walk(root);
const robots = await readFile(path.join(root, "robots.txt"), "utf8");
const sitemap = await readFile(path.join(root, "sitemap.xml"), "utf8");
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => new URL(decode(match[1])),
);
assert.equal(
  locations.length,
  new Set(locations.map((url) => url.href)).size,
  "no duplicate sitemap entries",
);
assert.equal(
  locations.length,
  production ? publicRoutes.size : 0,
  "sitemap contains only complete public routes",
);
if (production) {
  assert.deepEqual(indexableRoutes, publicRoutes);
  assert.ok(robots.includes(`Sitemap: ${base}/sitemap.xml`));
  assert.ok(robots.includes("Disallow: /admin"));
  assert.deepEqual(new Set(locations.map((url) => url.pathname)), publicRoutes);
} else assert.ok(robots.includes("Disallow: /"));
for (const url of locations) {
  assert.equal(url.origin, base);
  assert.ok((await stat(path.join(root, url.pathname, "index.html"))).isFile());
}
assert.deepEqual(errors, []);
console.log(
  `Verified metadata, canonicals, social images, JSON-LD, robots and sitemap across ${count} exported pages (${production ? "production" : "staging"}).`,
);
