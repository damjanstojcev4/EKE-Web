# Admin backend integration for staging

The `/login/` and `/admin/` routes use the existing Spring Boot API on the same origin under `/api/`. The frontend is still a static export. The reverse proxy, not Next.js server code, connects the API in hosted staging.

## Behavior and scope

- Login has a keyboard-accessible show/hide password control. There is no public registration form.
- The browser receives an HttpOnly authentication cookie. JavaScript does not store tokens in localStorage or sessionStorage.
- Before a mutation, the API client obtains `/api/auth/csrf` and supplies its `X-XSRF-TOKEN` value. Authentication, logout and account creation are CSRF-protected too.
- `/api/auth/me` verifies the current administrator before the dashboard loads. Expired sessions return to login. Backend or permissions errors do not fall back to demo data.
- The admin workspace reads and changes real projects and news and reads/deletes real contact messages. Uploads use multipart form data. News uses the existing short-description schema; it does not pretend to persist a separate title.
- The redesigned public pages remain on their existing content sources. This change does not yet make those static pages consume admin records, or enable the public contact form's deferred submission flow.

## Authorization fix

Account registration is restricted to an authenticated administrator, at both the HTTP endpoint and service layer. Creating an account does not replace the caller's session or return a token for the new account. Project/news writes and message reads/deletes explicitly require the administrator role. Anonymous public project/news reads and contact submission retain their public contracts.

The application no longer creates an `admin/admin` account or uses a checked-in JWT signing key. Configure a new environment-specific signing key before starting this version. Review existing accounts before enabling a migrated database: accounts created through the old public registration endpoint are not distinguishable as trusted simply because they have the ADMIN role. Remove unauthorized accounts and rotate the signing key to invalidate previously issued or forged tokens. Changing code alone cannot establish which pre-existing accounts are legitimate.

## Local verification

1. Build/test the backend from `Backend/ece-website` with Java 17+ and `mvnw.cmd -B -ntp verify` (or `bash ./mvnw -B -ntp verify`). Tests use an isolated H2 database and test-only configuration.
2. From `Frontend/ece-website`, run `npm run lint`, `npm run build`, then `npm run typecheck`.
3. On Windows with Edge installed, run `pwsh -File design/run-admin-e2e.ps1`. This starts the packaged backend with an isolated in-memory database, random test credentials and a random signing key, serves the static export through a local API proxy, runs the browser tests, then stops its own processes. It does not contact a staging or production database or send email.

For normal local development, run the backend on `127.0.0.1:18081` with explicit development credentials and `APP_AUTH_COOKIE_SECURE=false`, and run `npm run dev`. The development server proxies `/api/` to that loopback backend. For `npm start`, set the server-only `API_PROXY_TARGET=http://127.0.0.1:18081` environment variable. Never point local testing at a production API. Use Secure cookies on deployed HTTPS sites.

## Hosted staging activation

Follow `docs/CI_CD.md`: feature branch → PR → staging. This implementation does not enable deployment flags, install server services, provision a database or change production.

Before enabling the backend:

1. Provision the isolated staging service/database/uploads and mail sink, and resolve the legacy shared-server `killall java` conflict described in the runbook.
2. Configure `deploy/backend.env.example` with a private random JWT key, secure cookies and explicit initial administrator credentials if the database has no administrator. Remove bootstrap credentials after first initialization. Do not reuse production credentials or data.
3. Prepare/review the schema for the existing `ddl-auto=validate` deployment setting. Do not enable automatic schema changes on an existing database without review.
4. Add `deploy/staging/admin-api.nginx.conf.example` inside the staging HTTPS server block, keeping `/api` in the forwarded URI. Verify login, CSRF, logout, forbidden non-admin access, CRUD and uploads against staging.
5. Activate staging only through the established environment gates and PR/release process. Production remains a separate, explicitly approved cutover.

The existing Next.js dependency reports a security advisory. That upgrade is separate from this backend/auth change and should be resolved before public exposure.
