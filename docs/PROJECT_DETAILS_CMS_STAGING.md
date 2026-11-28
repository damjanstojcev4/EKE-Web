# Projects CMS: static staging integration

## Scope and audit (28 November 2026)

Compared f118e52a9b064f949960a7e03cf2726363464657 with staging
4e7559453b29d7312cc5f40595f67fc7787c5d54 in the existing clean
codex/project-details-cms worktree. The unrelated main checkout was untouched.
Next 16.4.6, React 19, Tailwind 4, Spring Boot 3.5.4, Java target 17
(local checks use Java 21), and H2 remain unchanged.

Staging already has the listing filter, public client renderer, all detail fields,
DTO mapping, multipart CRUD, supporting-media uploader, JWT/cookie-CSRF protection,
and admin editors. News demonstrates the existing client-fetch/static-export pattern.
The missing arbitrary-slug routing was caused by the projectHref manifest allowlist.
No new API client, CMS, server, service, port or deployment pipeline is needed.

## Cleanup of PR #17

Removed the tracked project-details-runtime application (layout, dynamic page,
error boundary, Next/PostCSS/TypeScript configuration and generated type entry),
scripts/build-project-details.mjs, build:project-details command, runtime ignore
and TypeScript entries, runtime asset prefix/environment variables/proxy code,
and runtime startup in full-stack QA. Removed the SSR detail page/error boundary
and server-only API-client origin logic. Restored the shared useApi utility.

Removed migration 005-project-publication.sql, Project.published and its DTO/request
mapping, project visibility filters, project publication tests and admin draft/publish
controls. Restored the original project visibility and authentication filter.
Removed runtime/service activation proposals and publication-only documentation.
No systemd definition was added in the prior commit; its proposed service instructions
have been removed. The prior runtime Nginx proxy is replaced with a static-only snippet.

Migrations 001-004 and every pre-existing staging service, field, config and workflow
are retained byte-for-byte. No production or unrelated page source changes.
PR #17 was still draft, unmerged and based on staging at inspection; the old commit's
PR CI succeeded. Repository evidence shows deployment workflows require staging/main,
not this feature branch. This supports the prior no-deployment report, but cannot
prove VPS state. No VPS connection or live data write was made.

## Final implementation

- Listing retains its design, data from GET /api/projects/public, filters and pagination.
  Every valid backend slug gets a document link; no source allowlist applies.
- /projects/details/ is one exported client shell. It reads the browser pathname
  after hydration and fetches GET /api/projects/slug/{slug} with the existing client.
  Existing manifest-generated project routes remain for compatibility, using the same shell.
- Cards use ordinary anchors so arbitrary slugs never require unexported Next RSC files.
  The optional staging Nginx location serves that shell for /projects/{slug}/,
  preserving the URL, direct access and refresh. Dotted files such as
  /projects/index.txt bypass the fallback, preserving listing navigation/RSC assets.
  The local static preview implements the same narrow fallback against out/.
  /projects/details/?slug={slug} also works without the clean-URL Nginx adjustment.
- Existing Tailwind renderer displays persisted summary, facts, content blocks,
  partners/logos, links, cover/logo, PDF and resources. Optional/malformed references
  are guarded. Loading, timed-out/unavailable API, retry, missing/invalid/deleted
  project and return-navigation states are explicit.
  The fact hero and content/resources sections grow for populated fields so
  wrapped facts/topics and longer CMS content do not overlap subsequent sections.
- Existing admin fields/uploads/relationships remain. Logo reference is loaded for
  review. Optional dates/grant can now be cleared. Checkboxes detach cover/logo/PDF
  references on PUT without deleting shared/legacy files; replacement uploads win.
  Existing resources/partner JSON can be added, edited or cleared.
- Only demonstrated backend gaps change: optional PUT flags removeImage, removeLogo,
  removePdf, clearGrantValue; explicit empty dates clear persisted dates. Missing
  flags/parameters retain prior client behavior. No entity/schema changes remain.

Reused endpoints: GET /api/projects/public, GET /api/projects/slug/{slug},
POST /api/projects, PUT/DELETE /api/projects/{uuid}, POST /api/projects/media,
and existing /api/uploads/images|pdf/... handlers. JWT, ADMIN authorization,
validation and cookie-CSRF mechanisms are unchanged.

## Validation

Commands from Frontend/ece-website:

    npm run lint
    npm run typecheck
    npm run test:seo
    npm run build
    npm run verify:seo
    npm test
    node scripts/full-stack-qa.mjs

Backend: from Backend/ece-website, ./mvnw -B -ntp clean verify.

Local results: 16 backend/API/migration tests; 23 browser integration tests;
4 SEO unit tests; static production build and SEO export validation passed.
The build retains two existing unrelated escaped-media-query CSS warnings.
The sandbox blocked Java test-agent attachment and the first build's generated
folder write; approved local runs completed. A fresh build cleared one incremental
webpack-cache failure. No dependency or baseline changes were used to pass checks.

Real Spring Boot + temporary file H2 + generated static out/ lifecycle passed:
admin login/create with a random slug generated AFTER the build, every detail field,
cover/logo/PDF/supporting media, listing click, direct URL, refresh, query fallback,
optional/missing/invalid states, edit, clear media/dates/grant, delete, and database
restart in validate mode. Unauthenticated writes return 401; cookie writes without
CSRF return 403. News and the other existing module integration checks still pass.
The preview server only hosts the static export/API relay for tests; it is not
staging infrastructure. Temporary DB/files and local processes are cleaned up.

Responsive checks at 390/768/1440 have no horizontal overflow. Screenshots are in
Frontend/ece-website/test-results/full-stack/: projects-list-{width}.png,
project-details-{width}.png, project-admin.png. Captures scroll through existing
reveal animations first. Baselines/thresholds are unchanged. The historical pinned
pixel runner was attempted but refused to run because approved Edge 158.0.4370.33
is absent; exact historical raster parity is therefore unverified. Subsequent
isolated native-Nginx validation is recorded in the focused 404 diagnosis below;
it does not activate a live release.

## Staging activation (requires approval)

The first activation was rolled back after a smoke check hit an old Nginx worker
immediately after reload. See [the focused diagnosis and native-Nginx regression
evidence](PROJECT_DETAILS_NGINX_404.md). A successful reload command is not route
readiness. Use the bounded, content-verified check below; do not roll back on the
first transient response or replace it with a fixed sleep.

PR #17's backend deployment IS required for clearing fields/removing media; this
readiness correction changes no application code. No database migration is required
on the verified host. Preserve existing H2/uploads and stop on schema validation
failure; do not migrate, reset or change Hibernate to create/create-drop.

After separate release authorization:

1. Record current frontend/backend release targets and back up staging H2/uploads
   using the established maintenance procedure. Retain the existing Nginx backup.
2. Before the approved workflow activation, validate the candidate static export
   using `python3 deploy/test-project-details-nginx.py --export-root /path/to/out`.
   This uses a disposable Unix socket, not a TCP port or system service. On the
   staging host, `--api-origin http://127.0.0.1:18081` checks existing public records
   through the real API; no CMS writes occur. Do not replace current release pointers.
3. Install the unchanged deploy/staging/eke-staging-project-details.conf at
   /etc/nginx/snippets/eke-staging-project-details.conf. Add this include ONLY
   inside the existing preview.ekebitola.org HTTPS server, alongside current
   API/static rules (do not replace them):

       include /etc/nginx/snippets/eke-staging-project-details.conf;

   Install this routing BEFORE the workflow, since the workflow now requires an
   existing project's clean details URL to pass before declaring activation complete.
   The old static release need not contain the shell during this preparation;
   successful content readiness is required once the new release is selected.
   Inspect existing exact/^~ project locations for precedence conflicts. Run
   sudo nginx -t, then sudo systemctl reload nginx only on success. Keep the
   existing server root, backend port, TLS, noindex and API proxy unchanged.
4. Release through the existing Deploy staging workflow after approved merge into
   staging: select staging and deploy_backend=true. Keep the existing infrastructure,
   backend-enabled and pipeline gates. No new workflow/service configuration is needed.
   The staging activation script now runs `check-project-details.py` inside its
   existing rollback trap. It selects an existing public slug and requires two
   complete successful checks, up to 15 attempts one second apart. It compares
   shell/listing/RSC/JS/CSS bytes with the selected export and verifies both APIs.
   Permanent failure still restores the old frontend/backend pointers. The operator
   must also restore the backed-up staging Nginx configuration on failed activation.
5. After any approved Nginx reload with the candidate release already active, run:

       python3 deploy/staging/check-project-details.py \
         --export-root /srv/eke-staging/current \
         --base-url https://preview.ekebitola.org

   Do not use a single immediate curl as the final activation result.
6. Read-only smoke-check an existing record via listing, clean detail URL, direct
   refresh, return link, images/documents and News. Verify /projects/index.txt is
   still an RSC/static payload. Live temporary-data CRUD requires its own approval.

Rollback: restore the recorded frontend/backend releases with the existing release
rollback procedure; no schema rollback is needed. Restore the previous staging
Nginx config/remove only the new include, nginx -t, then reload. Do not delete H2,
uploads or restore a stale database over newer edits. Removing the static fallback
restores the old clean-URL limitation; the query shell works while its frontend
release remains active. No additional running services are required.

## Limits

HTML metadata stays generic/project-list based and noindex for these detail shells;
server-rendered per-project SEO is unavailable with this static architecture.
Client not-found states normally have HTTP 200 at clean detail URLs; API misses
still return 404. Query URLs need no Nginx change. PR #17 was merged, its first
activation failed and was rolled back. This readiness fix performs only read-only
live diagnostics and isolated tests: no new merge, deployment, production change
or live staging CRUD. GitHub CI status is recorded in its review handoff.
