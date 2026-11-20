export { apiRequest, ApiError } from "../admin-api";

/** Only same-origin managed media; never render executable or arbitrary media URLs. */
export function mediaUrl(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const match = /^\/api\/uploads\/(news|images|pdf)\/([^/]+)$/.exec(value);
  if (!match) return undefined;
  let filename = match[2];
  try {
    // Accept both legacy database filenames and already encoded API paths.
    filename = decodeURIComponent(filename);
  } catch {
    // A literal percent sign is a valid filename character.
  }
  if (
    filename === "." ||
    filename === ".." ||
    /[/\\\u0000-\u001f\u007f]/u.test(filename) ||
    // Never allow a second decoder to introduce separators or dot segments.
    /%(?:25)*(?:2e|2f|5c|0[0-9a-f]|1[0-9a-f]|7f)/i.test(filename)
  )
    return undefined;
  try {
    const encoded = encodeURIComponent(filename).replace(
      /[!'()*]/g,
      (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
    );
    return `/api/uploads/${match[1]}/${encoded}`;
  } catch {
    return undefined;
  }
}
export function externalUrl(
  value: string | null | undefined,
): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? url.href
      : undefined;
  } catch {
    return undefined;
  }
}
export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
};
