export { apiRequest, ApiError } from "../admin-api";

/** Only same-origin managed media; never render executable or arbitrary media URLs. */
export function mediaUrl(value: string | null | undefined): string | undefined {
  return value &&
    /^\/api\/uploads\/(news|images|pdf)\/[a-zA-Z0-9_.%~-]+$/.test(value)
    ? value
    : undefined;
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
