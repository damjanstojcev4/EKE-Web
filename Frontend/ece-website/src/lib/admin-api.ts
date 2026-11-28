export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export type AdminIdentity = { username: string; role: string };

function failure(status: number): string {
  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 403) return "You do not have permission to perform this action. Sign in with an administrator account.";
  if (status === 413) return "The attachment is too large. Choose a smaller file.";
  if (status === 400) return "Some details could not be accepted. Check your fields and try again.";
  if (status === 404) return "This item is no longer available. Refresh the list and try again.";
  return "The server could not complete this request. Please try again.";
}

async function request(path: string, init: RequestInit): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, { ...init, credentials: "same-origin", cache: "no-store" });
  } catch {
    throw new ApiError(0, "Unable to connect to the server. Check your connection and try again.");
  }
  if (!response.ok) {
    let message = failure(response.status);
    if (response.status === 400) {
      const details = await response.json().catch(() => null);
      if (typeof details?.message === "string") message = details.message;
    }
    throw new ApiError(response.status, message);
  }
  return response;
}

/** The authentication cookie is HttpOnly. Never copy credentials into browser storage. */
export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!path.startsWith("/") || path.startsWith("//")) throw new Error("An API-relative path is required.");
  const method = (init.method || "GET").toUpperCase();
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    const csrfResponse = await request("/auth/csrf", { headers: { Accept: "application/json" } });
    let csrf: { token?: string; headerName?: string };
    try { csrf = await csrfResponse.json(); }
    catch { throw new ApiError(502, "The admin service is unavailable. Please try again later."); }
    if (typeof csrf.token !== "string" || csrf.headerName !== "X-XSRF-TOKEN") {
      throw new ApiError(502, "The admin service is unavailable. Please try again later.");
    }
    headers.set(csrf.headerName, csrf.token);
  }
  const response = await request(path, { ...init, method, headers });
  if (response.status === 204 || response.headers.get("content-length") === "0") return undefined as T;
  const body = await response.text();
  if (!body) return undefined as T;
  try { return JSON.parse(body) as T; }
  catch { throw new ApiError(502, "The admin service returned an unexpected response. Please try again later."); }
}

export async function getCurrentAdmin(): Promise<AdminIdentity> {
  const identity = await apiRequest<AdminIdentity>("/auth/me");
  if (!identity || identity.role !== "ADMIN" || typeof identity.username !== "string") {
    throw new ApiError(403, "An administrator account is required.");
  }
  return identity;
}

export async function login(username: string, password: string): Promise<AdminIdentity> {
  await apiRequest("/auth/authenticate", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return getCurrentAdmin();
}

export async function logout(): Promise<void> {
  await apiRequest<void>("/auth/logout", { method: "POST" });
}
