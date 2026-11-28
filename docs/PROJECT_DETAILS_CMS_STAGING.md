# Project Details CMS integration — staging

## Audit (28 November 2026)

Feature branch `codex/project-details-cms` starts at remote staging revision
`4e7559453b29d7312cc5f40595f67fc7787c5d54`, verified through GitHub's API.
The original dirty checkout is untouched. No Opportunities refactor commits,
production configuration, existing workflows, shared styles, or visual baselines
are included.

The staging code already provided `/api/projects/public`,
`/api/projects/slug/{slug}`, multipart project CRUD, supporting media uploads,
all design detail fields, and a Tailwind-based CMS renderer. The actual backend
is Spring Boot **3.5.4**, targeting Java **17** (also tested on Java 21), rather
than the versions in the brief. No dependency upgrade was needed.

The missing pieces were a manifest allowlist containing only `unavailable`,
disabled links for other slugs, generic static detail metadata, static HTTP 200
responses for API misses, and no Project publication field or admin control.
The hosted frontend is a static export. It cannot render arbitrary new slugs or
fresh metadata at request time. The user authorized preparing a staging-only
serving change; deployment and merging remain unauthorized.

## Implementation

- Reuse the existing slug endpoint, DTO, media validation, API client, detail
  renderer, SEO helpers, Header/Footer and Tailwind classes. No replacement CMS
  or API client was introduced.
- Add `published` through entity, request binding, response mapping, and admin
  form. New admin entries start as drafts; legacy API clients retain their prior
  default visibility. Anonymous listing, recent, slug, UUID and title aliases
  all exclude drafts. Authenticated administrators can still list drafts.
  The title alias now returns the DTO instead of the persistence entity.
- Migration `005-project-publication.sql` adds one boolean with default TRUE,
  retaining existing records, UUIDs, slugs, associations and files. Apply it
  before starting the new backend; Hibernate remains in `validate` mode.
- Listing links accept valid CMS slugs and use document navigation across the
  static/runtime boundary. Detail pages receive their initial CMS record from
  the server, with dynamic title, description, canonical and Open Graph tags.
  API 404 becomes page HTTP 404; service outages remain errors with retry UI.
- Keep the main export's configuration unchanged. A small, separate Next app
  under `Frontend/ece-website/project-details-runtime` reuses the same layout
  and detail page, with an explicitly dynamic route. Its own asset prefix
  prevents runtime JS/CSS from colliding with the static site's build.
- Preserve current detail styling. Add a Back to Projects link and a cover-image
  fallback when no dedicated logo is supplied; guard missing partner arrays and
  invalid reference entries. No new custom CSS.

## APIs and media

No new backend endpoints. Public reads use GET `/api/projects/public` and
GET `/api/projects/slug/{slug}`. Existing POST `/api/projects`, PUT/DELETE
`/api/projects/{uuid}`, POST `/api/projects/media` and managed
`/api/uploads/images/...` / `/api/uploads/pdf/...` remain in use.
ADMIN writes and cookie CSRF protection remain enforced.
Supporting project media retains its established public-upload behavior; this
change does not turn uploads into private draft attachments.

## Validation

Use the existing commands from `Frontend/ece-website`:

```sh
npm ci
npm run lint
npm run test:seo
npm run build
npm run build:project-details
npm run typecheck
npm run verify:seo
npm test
PROJECT_DETAILS_QA=true node scripts/full-stack-qa.mjs
```

Backend: from `Backend/ece-website`, run `./mvnw -B -ntp verify`.
The full-stack command uses random local credentials and a temporary file H2
database; it never targets staging. The opt-in flag starts the dynamic runtime
and a local proxy matching the proposed Nginx split. The regular full-stack
command retains its previous static-only behavior.

Checks performed during implementation:

- Both Next production builds; ESLint; TypeScript; SEO unit/export checks.
- 18 backend tests, including draft visibility across all public aliases,
  publish/edit/unpublish/delete, optional content and repeated additive migration
  with legacy data and schema validation.
- Existing browser integration suite (21 cases), plus a focused admin
  draft/publish/unpublish test.
- Real Spring/H2/browser lifecycle with a slug created after the build, rendered
  HTML metadata, invalid/missing/unpublished/deleted page HTTP 404, updated content
  after refresh, managed image/PDF reads and persistent H2 restart.
- Responsive overflow checks at 390, 768 and 1440 pixels. Local screenshots:
  `Frontend/ece-website/test-results/full-stack/project-details-{width}.png`.

The historical Project Details raster runner requires access to the staging API;
that endpoint was unreachable from this environment. Its old visual baselines
and thresholds were not changed. Local screenshots are evidence of responsive
rendering, not a claim of exact parity with that historical fixture matrix.

## Staging activation — requires separate approval

**Backend deployment is required**, together with migration 005. A static-only
frontend deployment is insufficient for arbitrary new CMS slugs. The existing
workflow intentionally does not activate this new runtime automatically.

1. Back up staging H2 and uploads using the existing maintenance procedure.
   Stop the staging backend before opening its file H2 database with a migration
   tool. Apply migrations through 005 in order if any earlier ones are missing;
   never reset the database or enable create/create-drop on staging.
2. Deploy the verified backend release through the existing staging process and
   confirm `/api/projects/public` and the existing health checks. Existing rows
   should remain visible. Verify a known project without editing live content.
3. Prepare a separate, versioned runtime release from a clean Linux checkout.
   Use Node 22 and `npm ci`, then build the static site normally and run
   `npm run build:project-details`. Keep installed runtime dependencies and
   `project-details-runtime/.next-details` together in the release. Run the
   full-stack check before activation. Do not ship the Windows dependency
   junction or local generated build directories.
4. Start the Next production server as a dedicated unprivileged staging service,
   with working directory `Frontend/ece-website` in that runtime release:

   ```sh
   NODE_ENV=production SEO_ENVIRONMENT=staging \
   PRODUCTION_SITE_URL=https://ekebitola.org \
   API_PROXY_TARGET=http://127.0.0.1:18081 \
   node node_modules/next/dist/bin/next start project-details-runtime \
     --hostname 127.0.0.1 --port 3101
   ```

   Preserve the existing configured production canonical origin if it differs
   from the example. Do not give this public-read service admin credentials.
   Ensure only loopback can access port 3101. Use the normal supervised service,
   versioned-release and health-check conventions of the staging host.
5. Install `deploy/staging/eke-staging-project-details.conf` as an optional
   include **only in the preview.ekebitola.org HTTPS server**, backing up its
   configuration first. Keep existing static/API rules. Run `nginx -t` and
   reload only on success. The include proxies one project path segment to 3101
   and maps the isolated asset prefix to that runtime. It preserves backend
   404/500 responses and adds no-store and noindex headers.
6. Activate the matching static frontend release through the existing staging
   workflow. Verify an existing project, its image/PDF, direct refresh, return
   navigation, metadata and noindex. Perform any live create/publish/unpublish
   smoke test only with explicit approval; no staging test data was created here.

The existing production/staging workflows and secrets are unchanged. Staging
remains noindex, including dynamic details. The existing production canonical
configuration is reused rather than changed globally.

## Rollback

Keep the previous static release, runtime release and Nginx backup. Restore the
previous frontend/runtime or remove the optional staging include and reload only
after `nginx -t`. Leave the additive column in place; do not drop tables or
restore a stale H2 backup over newer CMS edits.

Prefer retaining the new backend visibility guard during a frontend rollback.
Rolling back to the old backend while drafts exist would expose those drafts,
because the old code has no publication rule. A backend rollback therefore
requires an explicit content-visibility plan before proceeding. Removing the
runtime restores the old static host's manifest limitation for new slugs.

## Limits

No deployment, merge, live CMS write, production change or secret update has
been performed. Local lifecycle verification is complete; actual staging
activation, Nginx validation on its host, and live verification remain required.
