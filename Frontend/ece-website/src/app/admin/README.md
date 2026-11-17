# Admin workspace

The static `/admin/` route checks `/api/auth/me` before displaying content. Anonymous or expired sessions go to `/login/`; non-admin accounts receive an access-denied screen. Server authorization protects the underlying APIs.

Project and news forms use the existing multipart API contracts. News has a short description and Instagram URL, with no separate title field. Project and news images are required when creating records; editing preserves existing uploads unless replaced. Images may be up to 5 MB and PDF documents up to 20 MB. Temporary image previews use object URLs and are released when the editor closes. No content or credentials are saved in localStorage.

Projects, news and contact messages load from the backend after the session check. Failed reads provide a retry state. Failed writes preserve the editor or delete confirmation. Sign out uses the shared API helper and returns to `/login/`. Requests use the HttpOnly authentication cookie and CSRF header provided by `src/lib/admin-api.ts`.

The frontend stays a static export; staging must route `/api/` to its isolated backend. Backend activation and production promotion follow `docs/CI_CD.md` and are not implied by deploying the frontend. Public redesigned pages still use their separately deferred content integration.

Validation: `npm run lint`, `npm run build`, `npm run typecheck`, then the live backend checks in `design/admin-qa.mjs`.
