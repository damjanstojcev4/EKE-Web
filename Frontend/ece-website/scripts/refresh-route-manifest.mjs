import { writeFile } from "node:fs/promises";
// Explicit operator action, never part of build. Only public endpoints, no credentials.
const base = process.env.ROUTE_MANIFEST_API;
if (!base || !/^https?:\/\//.test(base))
  throw new Error(
    "Set ROUTE_MANIFEST_API to the intended API origin (including /api)",
  );
async function get(path) {
  const r = await fetch(`${base.replace(/\/$/, "")}${path}`);
  if (!r.ok) throw new Error(`${path}: HTTP ${r.status}`);
  return r.json();
}
const news = [];
for (let page = 0; ; page++) {
  const result = await get(`/news/public?page=${page}&size=100`);
  news.push(...result.content.map((n) => n.slug));
  if (page + 1 >= result.totalPages) break;
}
const projects = (await get("/projects/public")).map((p) => p.slug);
const clean = (values) =>
  [...new Set(["unavailable", ...values])]
    .filter(
      (s) => typeof s === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s),
    )
    .sort();
await writeFile(
  new URL("../src/content/route-manifest.json", import.meta.url),
  JSON.stringify({ news: clean(news), projects: clean(projects) }, null, 2) +
    "\n",
);
console.log(
  "Route manifest refreshed. Review, commit and rebuild to make new detail URLs available.",
);
