# Admin workspace

Reused from `feat/admin-preview` and extended for Phase 1 News publishing. The
static `/admin/` route verifies the existing HttpOnly JWT session through
`/api/auth/me`; unauthenticated editors return to `/login/`. News loads first and
independently of projects/messages. Backend ADMIN authorization protects writes.

News forms preserve summary, Instagram link and existing image and expose title,
category, alt text, draft/published/scheduled state and local publication time.
Publish now prepares the state/time; Save changes submits it. Select Draft and save
to unpublish. Legacy rows are labeled hidden and must be explicitly published.
Images remain optional; publishing an image requires alt text. Uploads accept
PNG/JPG/WebP/GIF up to 5 MB.

Dates use the displayed browser timezone and convert to UTC. Existing publication
instants retain their subsecond precision on ordinary edits. Spring DST gaps are
rejected; repeated autumn hours use the earlier occurrence.

API requests stay same-origin, obtain a CSRF header before mutations and never
store tokens in browser storage. Local Next dev/static preview can proxy to the
loopback backend; hosted routes require separately approved proxy access. No NGINX
exposure is installed by this feature. Set `APP_AUTH_COOKIE_SECURE=false` only for
local HTTP testing, and configure a private backend signing key. Do not point local
development at production.

Checks: `npm run lint`, `npm run build`, `npm run typecheck`, `npm test`.
After packaging the backend: `node scripts/news-integration-qa.mjs` launches a
disposable real-backend browser check. See `docs/NEWS_PHASE1.md` at repository root
for the audit, compatibility notes and deployment/manual-verification plan.
