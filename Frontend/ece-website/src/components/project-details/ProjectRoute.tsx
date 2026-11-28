"use client";

import { useSyncExternalStore } from "react";
import PublicProject from "./PublicProject";

const subscribe = () => () => {};
function currentSlug() {
  const url = new URL(window.location.href);
  const match = /^\/projects\/([^/]+)\/?$/.exec(url.pathname);
  try {
    return url.pathname.replace(/\/$/, "") === "/projects/details" && url.searchParams.has("slug")
      ? url.searchParams.get("slug") || ""
      : decodeURIComponent(match?.[1] || "");
  } catch {
    return "";
  }
}

// Read the browser URL after hydration: Nginx serves this same shell for any slug.
// Project cards use document navigation so Next never requests unexported RSC routes.
export default function ProjectRoute() {
  const slug = useSyncExternalStore(subscribe, currentSlug, () => null);
  return <PublicProject key={slug} slug={slug} />;
}
