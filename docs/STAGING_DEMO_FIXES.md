# Staging demo fixes — 20 November 2026

## Findings

- The API returns all 17 projects. `mediaUrl()` rejected raw spaces, parentheses and Unicode in legacy database filenames. It now accepts one managed filename segment, encodes it, and rejects traversal, encoded separators, controls and external URLs. Backend URL prefixes stay unchanged.
- Every project image also returned 404 directly from Spring, independently of the frontend helper. The running JVM reported `user.dir=/tmp/hsperfdata_eke-staging-backend`, despite systemd declaring `WorkingDirectory=/srv/eke-staging-backend`. Existing files were present and readable in `/srv/eke-staging-backend/uploads`. The staging-only ExecStart override pins `-Duser.dir=/srv/eke-staging-backend`, covering existing media reads and all upload writers. No files were moved, modified or deleted. The underlying reason for the JVM directory discrepancy was not established.
- Project CSS fixed desktop rows to roughly 400 scaled pixels and metadata/copy to 287, with offsets for the first five records. Content now determines row height. Image slots stay in the first column even when an image is absent; images use 420:287 and cover.
- Partnerships and services used fixed heights and absolute divider/ending-stripe positions. They now flow with their text. The flags photo and decorative artwork no longer cause horizontal overflow. Homepage News had the same fixed-row assumptions and lacked typography for API summaries; its rows now grow too.
- Hosted auth was a proxy problem: CSRF and identity returned 404 while direct Spring identity returned 401. The old NGINX allowlist omitted auth/write routes and discarded Cookie/Authorization. New staging-only locations preserve cookies, CSRF and authorization headers and disable caching. Spring's existing ADMIN/CSRF and News publication checks remain in control. No backend Java changes.

## Files

- `Frontend/ece-website/src/lib/api/client.ts`: safe legacy filename encoding.
- `Frontend/ece-website/src/components/projects/ProjectCard.tsx`: stable image slot.
- `Frontend/ece-website/src/app/projects/page.module.css`: content-driven responsive rows.
- `Frontend/ece-website/src/app/globals.css`: Partnerships/services/News flow.
- `Frontend/ece-website/tests/staging-demo.spec.ts`: media security and four-viewport regressions with 17 representative records, long text and missing media.
- `deploy/staging/nginx.conf.example`: include narrowly scoped API routes.
- `deploy/staging/eke-staging-api-routes.conf`: endpoint/method allowlist.
- `deploy/staging/eke-staging-api-proxy.conf`: loopback proxy headers/no-store.
- `deploy/staging/media-directory.conf`: staging-only JVM upload directory.
- `deploy/staging/apply-demo-routing.sh`: backed-up, validated operator install.
- This runbook.

`ProjectsList.tsx` already renders the complete API array without a five-record cap. `WebConfig.java` already delegates media to Spring's path resolver and checks News image publication; neither needed changing. No production, Contact/email, registration or database changes.

## Applied staging infrastructure

Applied only to the supplied staging service and preview vhost:

- `/etc/nginx/conf.d/eke-staging.conf`: replaced the public-only API regex with the routes include; TLS/static handling retained.
- Installed the two staging snippets under `/etc/nginx/snippets/`.
- Installed `/etc/systemd/system/eke-staging-backend.service.d/media-directory.conf`.
- Ran `nginx -t`, `systemctl daemon-reload`, restarted only `eke-staging-backend.service`, verified loopback health, then reloaded NGINX. Production config, service and data were not edited.
- Original vhost backup: `/var/backups/eke-staging-demo-20261120T220411Z/eke-staging.conf`.

No additional NGINX command is needed on this VPS. To reproduce on the same staging layout, copy the four files and script from `deploy/staging/` into a private operator directory, then:

```sh
cd /path/to/reviewed-checkout/deploy/staging
sudo bash -n apply-demo-routing.sh
sudo bash apply-demo-routing.sh
sudo nginx -t
curl -f https://preview.ekebitola.org/api/auth/csrf -o /dev/null
```

Do not replace the complete HTTPS vhost with the HTTP example. Never alias uploads directly in NGINX: doing so would bypass draft News media restrictions. The fallback `/api/` remains 404. Registration, Contact/messages/email and H2 are excluded. Each permitted write still requires ADMIN in Spring; cookie-authenticated writes require CSRF. Multipart request limit matches Spring's existing 50 MB ceiling.

Rollback the runtime/proxy change if necessary (this restores the original, broken auth/media behavior):

```sh
sudo cp -a /var/backups/eke-staging-demo-20261120T220411Z/eke-staging.conf /etc/nginx/conf.d/eke-staging.conf
sudo nginx -t && sudo systemctl reload nginx
sudo mv /etc/systemd/system/eke-staging-backend.service.d/media-directory.conf /var/backups/eke-staging-demo-20261120T220411Z/media-directory.conf.disabled
sudo systemctl daemon-reload
sudo systemctl restart eke-staging-backend.service
```

## Verification

- Frontend lint, TypeScript check and Next.js static build pass.
- Existing 11 Playwright tests plus 5 new checks pass. Browser geometry at 390, 768, 1440 and 1920 pixels confirms rows contain their content and do not overlap; Partnerships ends before News. Services are also tested with triple-length copy. Reduced motion makes screenshot text deterministic.
- Additional browser verification used the actual 17 staging project records and real HTTPS image responses against the rebuilt local frontend: 17 cards and 17 decoded images at all four widths, with no overlapping rows or overflowing text. Screenshots and read-only API snapshots are local in ignored `Frontend/ece-website/test-results/`.
- Backend `mvn test -q`: 16 tests, zero failures/errors/skips. Existing tests cover role/CSRF restrictions, News draft/scheduled media visibility, content CRUD and preservation of uploaded paths. No backend source changes or schema migration.
- Hosted staging: all 17 encoded project images return 200. Public Projects, News, Opportunities and Training reads return 200. CSRF returns 200; anonymous identity returns 401.
- Anonymous POST to News, Projects, project media, Opportunities admin and Training admin returns 401. Registration, messages and H2 return 404. Existing hidden News media remains unavailable anonymously.
- User confirmed existing `admin` sign-in succeeds over staging HTTPS. In the signed-in browser, created test News #33, edited it, published it, verified public homepage API visibility, then unpublished it. Public detail now returns 404 and homepage excludes it. It remains a draft titled `STAGING QA — routing verified 2026-11-20`. No existing records were edited/deleted.
- Hosted writes for the other modules were not exercised against existing records; local backend integration tests cover their CRUD. No credentials were changed or exposed. No reset mechanism is required because existing authentication works.

## Frontend deployment

1. Review and merge this fix PR into **staging**. Do not merge into main.
2. The staging push runs `.github/workflows/deploy-staging.yml`, including lint/typecheck/build and backend checks, then activates the frontend if the existing staging gates are enabled.
3. **`deploy_backend=true` is NOT needed.** Backend source and JAR are unchanged. For a manual Deploy staging run, choose branch `staging` and leave `deploy_backend=false`. The already-applied staging unit override persists independently of frontend releases.
4. Wait for green checks and deployment. Compare `https://preview.ekebitola.org/release-id.txt` with the merged staging SHA/run marker, then hard-refresh Projects and homepage at the four widths.
5. Confirm all 17 projects/images, filters, content spacing and existing admin login. Verify #33 remains a draft. No production workflow, credential reset or database operation is part of this deployment.

The frontend layout/helper changes are only local/PR changes until the merge/deployment above. The staging infrastructure changes described above are already live.
