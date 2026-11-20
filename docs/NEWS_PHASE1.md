# News administration — Phase 1 handoff

Date: November 20, 2026. Feature branch: `codex/news-administration`.
Baseline: refreshed `origin/staging`, commit `78f863d125cabe636fedbdb19ff97f99549edb2d`.
Worktree: `D:/eke-web/.worktrees/news-administration`. Existing navigation work in
the original checkout was left untouched. No production commands, deployments,
service restarts, database writes, migrations, or NGINX changes were performed.

## A. Audit before implementation

| Area | Already implemented | Gap addressed / files changed | Compatibility consideration |
| --- | --- | --- | --- |
| Entity and DTOs | `News` already has nullable title, category, imageAlt, published, Instant publishedAt; summary, Instagram URL, image and creation date retained. `NewsWriteRequest`, response and mapper support these fields. | No model or DTO changes. | Legacy nulls remain unchanged; no Phase 2 article model. |
| Repository/service | Homepage query selects eligible published rows, newest first, deterministic ID tie break, maximum three. Admin-aware listing/detail and image visibility already exist. | `NewsRepository`: exclude legacy rows from every public read and image check; public list orders by publication time. `NewsService` unchanged. | Anonymous general listing/detail/images no longer expose legacy records. Admin access remains. |
| Publishing controller | Multipart create/update/delete; pessimistic edit lock, partial updates, publication validation, omitted image preservation. | `NewsController`: all new rows default to draft; readable validation responses; restrict image extension/MIME and 5 MB maximum. | Old multipart fields still work; older clients create drafts. Missing timestamps on publish return 400. |
| Authentication/security | JWT cookie or bearer authentication; ADMIN-only News writes; registration already restricted at HTTP layer. | `SecurityConfig`, `JwtAuthFilter`, `AuthController`: admin identity endpoint, CSRF endpoint/protection for cookie-based News writes, Secure/HttpOnly/SameSite cookies, consistent 401 and error dispatch. | Cookie News clients need CSRF; bearer clients retain their contract. No proxy exposure added. |
| Signing/bootstrap | Staging baseline had a shared source-code signing key and automatic default admin creation. | Reuse `JwtService` and `DataInitializer` fixes from `feat/admin-preview`; add repository role lookup and configuration. | Private environment key is required; rotation signs out old sessions. No existing account is removed or modified. Review existing accounts separately. |
| Admin UI/API client | No admin/login routes or API client on staging. Existing reusable workspace and login found on `feat/admin-preview` (`2ca284f7`), with projects/news/messages management. Its News form used only summary, Instagram and image. | Selectively reuse workspace/login/styles/client; extend News inputs, status controls, validation, legacy warning and timezone handling. | No duplicate CMS; unrelated branch changes were not merged. News loads independently of other sections. Public pages and mock sources unchanged. |
| Frontend types/tests | Existing public News types describe mock articles. Playwright installed but no standard test command/config on staging. | Separate API record type and publication helpers; six Playwright tests, config and test command. | Public mock article type unchanged; static export retained. |
| Database | `001-news-publication.sql` adds nullable columns and publication index; migration test rehearses twice and validates Hibernate schema against an old table. | SQL unchanged. Update migration README to reflect Phase 1 visibility and CSRF. | No new migration, table recreation, data backfill or automatic publishing. |
| CI/release | CI checks frontend lint/build/types and Maven verify; release script gates environment and backend activation, checks health and restores release pointers on failure. | CI also installs Chromium and runs frontend tests. Release/activation/staging workflow unchanged. | Push to staging does not activate backend: manual backend selection is required. Linux activation fixtures remain CI-only. |

The POM and CI target Java 17, while local verification used JDK 21. The existing
target is preserved. Next.js remains a static export; no SSR or slug work was done.

## Verified staging baseline (read-only SSH)

- `eke-staging-backend.service`: active/running; working directory `/srv/eke-staging-backend`.
- Active release: `/srv/eke-staging-backend/releases/78f863d125cabe636fedbdb19ff97f99549edb2d-44521998880-1`.
- Backend source tree ID: `e91fcd62b721bc3fc2ef4a4205803c08c94f4f5f` (tree identity, not release commit).
- Loopback `http://127.0.0.1:18081/api/projects/`: HTTP 200.
- Loopback `/api/news/homepage`: `[]`.
- Loopback anonymous `/api/news`: three legacy records; all five editorial metadata fields null.
- `https://preview.ekebitola.org/`: HTTP 200; its `/api/news/homepage`: `[]`.
- Preview `/api/auth/me`: HTTP 404. The repository NGINX template exposes only selected public reads and strips authentication for those routes.

The API metadata and running release are consistent with publication columns being
present. The live H2 file was never opened; index existence and database contents
were not independently inspected. No environment files or credentials were printed.

## B. Implementation and modified files

Paths below are repository-relative.

| Files | Responsibility |
| --- | --- |
| `Backend/ece-website/src/main/java/com/ece/ece_website/repository/NewsRepository.java` | Unified public visibility and publication ordering. |
| `Backend/ece-website/src/main/java/com/ece/ece_website/controller/NewsController.java` | Safe draft default, upload validation and validation messages. |
| `Backend/ece-website/src/main/java/com/ece/ece_website/config/SecurityConfig.java`, `config/JwtAuthFilter.java`, `controller/AuthController.java` | Session verification, cookie News CSRF, secure cookies and correct HTTP errors. |
| `Backend/ece-website/src/main/java/com/ece/ece_website/service/JwtService.java`, `config/DataInitializer.java`, `repository/AdminRepository.java` | Private signing key and explicit optional first-admin bootstrap using established JWT authentication. |
| `Backend/ece-website/src/main/resources/application.properties`, `deploy/backend.env.example` | Signing/bootstrap/cookie settings; no live settings changed. |
| `Backend/ece-website/src/test/java/com/ece/ece_website/NewsApiTests.java`, `src/test/resources/application.properties` | API/security/lifecycle/boundary tests and isolated test configuration. |
| `Frontend/ece-website/src/app/admin/AdminDashboard.tsx`, `admin.module.css`, `page.tsx`, `README.md` | Reused workspace with complete News form and publishing controls. |
| `Frontend/ece-website/src/app/login/LoginForm.tsx`, `login.module.css`, `page.tsx` | Reused login with HttpOnly-cookie authentication. |
| `Frontend/ece-website/src/lib/admin-api.ts` | Same-origin API requests, CSRF header, session check and error handling. |
| `Frontend/ece-website/src/lib/news-publication.ts` | API record types, state classification, date conversion and publication input checks. |
| `Frontend/ece-website/next.config.ts`, `scripts/serve.mjs` | Local same-origin proxy; hosted export still relies on separately controlled NGINX. |
| `Frontend/ece-website/playwright.config.ts`, `tests/news-publication.spec.ts`, `package.json`, `.gitignore` | Six frontend tests, test command and generated-test-output exclusions. |
| `Frontend/ece-website/scripts/news-integration-qa.mjs` | Real browser/backend smoke scenario with random credentials/key, loopback services, in-memory H2 and disposable uploads. |
| `.github/workflows/ci.yml` | Run frontend tests after build; existing backend/release checks retained. |
| `deploy/staging/migrations/README.md`, `docs/NEWS_PHASE1.md` | Updated compatibility and release instructions. |

### State and time contract

- Draft: `published=false`; timestamp can be absent or retained. Unpublishing only changes the flag.
- Published: `published=true` and non-null `publishedAt <= now`.
- Scheduled: `published=true` and `publishedAt > now`; visibility changes when queries run after that instant. No scheduler process or automatic row mutation is needed.
- Legacy: nullable metadata remains preserved and hidden until explicitly prepared/published. Legacy edits cannot silently publish content.
- Publishing requires title, nonblank summary, category and an explicit timestamp; images require alternative text. Images remain optional, preserving the existing backend contract. Drafts may be incomplete at the API level; the UI requires a title and summary for a useful saved record. Instagram is preserved and may be empty.
- Publish now fills the editor's current local time and selects Published; Save changes performs the write. Published content keeps its timestamp on ordinary edits, including original subsecond precision.
- The editor uses its browser timezone (displayed beside the control), converts local input to an ISO UTC instant, and the API/database use `Instant`/timestamp with timezone. Offset timestamps are accepted; zone-less API timestamps are rejected. Scheduling UI rejects past times; the backend interprets any valid past instant as immediate/backdated publication because there is no separate scheduling status field.
- Missing publication timestamps never qualify for public visibility. Publishing with no timestamp returns 400; it does not silently assign a date.
- Spring DST gaps are rejected. Repeated autumn times use JavaScript's earlier occurrence, explicitly explained beside the input. Existing timestamps are preserved unless changed.

## C. Database and account compatibility

No SQL migration was added or changed. Existing nullable columns, fields and legacy
records are preserved. `001-news-publication.sql` remains additive and idempotent;
its test confirms row preservation and Hibernate validation. Do not rerun database
setup or enable automatic schema updates on staging merely to deploy this phase.

Before any staging migration, obtain and verify a staging-only backup. Rehearse on
an offline copy with matching H2 2.3.232. Never attach another JVM to the live file.
For an authorized maintenance window, stop only `eke-staging-backend.service`,
copy its closed database and uploads to a restricted backup location, verify
checksums and a restore/rehearsal copy, and retain that backup before changes.
Never use production files or paths for this process.

Before activating this backend, configure `APP_JWT_SECRET` as an environment-specific
Base64 key containing at least 32 random bytes. Keep HTTPS cookies secure. The
backend intentionally fails startup without a valid key. If an administrator
already exists, bootstrap settings do nothing. For a fresh database, explicitly
provide the optional bootstrap username/password (12–72 characters for password),
then remove them after provisioning. No default account is created.

Review existing administrator accounts through an authorized operator process:
removing default creation does not change an existing weak/default account, and
rotating the key invalidates tokens but does not establish trust in old accounts.

## D. Verification

Run from the indicated directories. Final local results:

| Directory | Exact command | Result |
| --- | --- | --- |
| `Backend/ece-website` | `mvn.cmd -B -ntp verify` | PASS: 11 tests, zero failures/errors/skips; packaged JAR. JDK 21, release target 17. |
| `Frontend/ece-website` | `npm ci --no-audit --no-fund` | PASS: locked dependencies installed. |
| `Frontend/ece-website` | `npm run lint` | PASS. |
| `Frontend/ece-website` | `npm run build` | PASS: 27 static pages generated and export normalized. Existing Next.js advisory noted below. |
| `Frontend/ece-website` | `npm run typecheck` | PASS. |
| `Frontend/ece-website` | `npm test` | PASS: six Playwright tests, including browser editorial/legacy/DST flows with a mocked API and helper tests. Windows Edge; CI uses Chromium. |
| `Frontend/ece-website` | `node scripts/news-integration-qa.mjs` | PASS: one real browser/Spring Boot smoke scenario; cookie login, actual CSRF, draft/image, schedule, publish, unpublish, image privacy and logout. Disposable in-memory H2. |
| Repository root | `& 'C:/Program Files/Git/bin/bash.exe' deploy/test-release.sh` | PASS: branch/readiness/user/URL guards and explicit backend activation guards. Linux activation fixtures skipped by the existing script on Windows; CI runs them on Linux. |
| Repository root | `git diff --check` | PASS. |

Backend coverage includes homepage filtering/limit/order/ties, exact publication
boundary, missing timestamps, offset conversion, drafts, schedule/reschedule,
immediate publication, published-content edits, unpublish, legacy edit/explicit
publication, untouched legacy rows, transaction rollback on invalid edits, malformed
times/category/length/image errors, anonymous and non-admin writes, session identity,
real CSRF handshake and private images. Existing migration/context tests also pass.

Initial sandbox attempts could not fetch npm dependencies, create a Next build
directory, start Git Bash, or complete Java agent attachment. Approved unrestricted
reruns succeeded; the stalled test process was stopped. Test failures during
implementation were corrected, including real-server error dispatch. Next.js
initially stopped to display an existing dependency security advisory; the unchanged
build succeeded on retry. The advisory remains and warrants a separate security
upgrade before broad exposure. No dependency upgrades were bundled here.

## E. Manual editorial checklist

Use an isolated local environment first. `node scripts/news-integration-qa.mjs`
provides a reproducible real-backend check after building both projects.

1. Sign in at `/login/` with a trusted administrator; an anonymous `/admin/` visit should redirect to login. A USER account must not manage News.
2. Open News and Add news. Enter title, category, summary and optional Instagram link/image/alt text. Leave Draft selected and save. Reload and edit: values and image must persist; anonymous homepage/list/detail/image reads must hide it.
3. Select Publish now, verify local timezone/time, and Save changes. Anonymous homepage and general News reads must now include it; an uploaded image must load. Homepage remains newest-first and capped at three.
4. Edit the summary while published. Save without changing the date: publication instant and image must remain unchanged.
5. Select Scheduled and choose a future local time. Save and verify the API UTC instant; anonymous reads must hide the article/image. Change the scheduled time and save again. After the scheduled instant, a new API request must include it without restarting the backend.
6. Select Draft and Save changes to unpublish. Anonymous reads and its image must disappear; the row remains available to the editor. Republish explicitly when desired.
7. Open a Legacy · hidden row. Confirm old summary/Instagram/image are retained. Supply title/category/alt text and explicitly publish; other legacy rows must remain intact and hidden. Saving as Draft must not publish it.
8. Try invalid publication inputs, missing alt text for an image, and a past scheduled time. Confirm clear messages and no unintended changes. Test an API write without authentication, with USER authority, and a cookie News write without CSRF: all must be rejected.
9. Sign out. Returning to `/admin/` should require login; no tokens should exist in browser storage.

The redesigned public pages still use their existing sources. Verify API responses
for publishing behavior; this phase does not replace `news.mock.ts`.

## F. Staging deployment plan — not executed

1. Review the PR targeting `staging`; require CI success. Do not merge to `main`.
2. Arrange a verified staging database/upload backup and record the current release
   and source IDs. Confirm the service remains isolated, the JDBC URL uses the
   staging database with `IFEXISTS=TRUE`, and `ddl-auto=validate` remains set.
3. Provision the private staging JWT key and review trusted administrator accounts
   through an authorized operator. Preserve production settings. Keep secure
   cookies enabled. Do not print environment files.
4. Confirm existing publication columns/index using the authorized offline backup
   rehearsal. No schema change is expected for the verified baseline. If migration
   is actually needed, stop deployment until its staging backup is verified and
   follow `deploy/staging/migrations/README.md` under separate maintenance authority.
5. Merge only through the reviewed staging PR. A push invokes the staging workflow
   but **does not activate the backend**. To activate this backend, manually run
   **Deploy staging** (`.github/workflows/deploy-staging.yml`) on branch `staging`
   and explicitly select `deploy_backend=true`. Existing `STAGING_PIPELINE_ENABLED`,
   `STAGING_INFRA_READY`, and `STAGING_BACKEND_ENABLED` gates must be true.
   Existing staging environment approval rules still apply. No flag was changed here.
6. The unchanged release scripts compare backend source IDs, activate isolated
   release pointers, restart only the selected staging unit, and verify loopback
   and public project/homepage API health plus frontend release identity. Do not
   substitute legacy deployment workflows or broad process-kill commands.
7. Verify `systemctl is-active eke-staging-backend.service`, resolved backend
   `current` release/source ID, loopback `/api/projects/` and `/api/news/homepage`,
   preview frontend `/`, `/release-id.txt`, `/api/projects/`, and `/api/news/homepage`.
   Require HTTP 200 on the health routes. With no explicit editorial publication,
   homepage and anonymous loopback general News listing should now both be `[]`;
   authenticated admin listing must still contain the three legacy rows.
8. Hosted admin verification needs access through an **explicitly approved**
   authenticated/admin proxy arrangement, or an authorized private operator access
   path. Current preview `/api/auth/me` is 404. Do not broaden NGINX automatically.
   Once access is approved, run the manual checklist above with staging-only test
   content. Preserve the original legacy rows unless an editor explicitly prepares
   and publishes them.

The release script restores pointers on activation/health failure. A JAR rollback
does not restore database state, schema, account trust or uploads. This phase needs
no new schema, but rolling back restores the old legacy-public visibility and old
authentication behavior; frontend/backend CSRF contracts must remain paired. Do
not roll back past publication-aware protection after new drafts exist without
reviewing exposure risk. Preserve current data before any operator-approved
restore; do not automatically overwrite post-backup editorial changes.

## G. Limitations and approval boundaries

- No staging deployment or hosted authenticated editorial verification was done.
  NGINX/admin route access still requires explicit separate approval.
- Staging schema/index state was inferred from successful current API behavior,
  not inspected by opening live H2. Production was neither queried nor changed.
- Existing Next.js dependency reports a security advisory. A separate security
  upgrade is recommended; no unrelated dependency/public-page redesign was added.
- Existing unrelated backend security policies (for example messages, projects and
  optional H2 console configuration) were not redesigned. The reused dashboard's
  other sections retain their established API contracts. Restrict hosted access;
  this PR does not authorize exposing general admin APIs or H2.
- Static public News integration, slugs, related articles, SSR and the full article
  content model remain Phase 2 work. A repeated DST hour uses its earlier occurrence.
- Local Windows deployment tests skip Linux-specific activation fixtures. The
  expanded GitHub CI must pass before merging; local success is not a claim that
  remote CI or a deployment has completed.
