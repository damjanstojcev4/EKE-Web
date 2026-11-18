# EKE branching and deployment runbook

## Branches and review

Feature branch → PR → staging → client approval → PR → main → production.

Keep feat/nextjs-migration and historical branches. staging starts from the reviewed
migration including updated WebP images and content cleanup. The CI/CD foundation
is developed on chore/eke-cicd-pipeline. Do not merge into main during setup.

Future work starts from an up-to-date staging branch in a clean worktree. Do not
switch the original checkout while it contains local work. After this foundation
is merged and CI is green:

```sh
git fetch origin
git worktree add -b feat/backend-improvements ../eke-backend-improvements origin/staging
```

Open backend PRs against staging. No backend feature branch is created by this setup.

## Workflows

| File | Trigger | Behavior |
| --- | --- | --- |
| ci.yml | PR targeting staging/main; reusable call | Node 22 lint/typecheck/static build; Java 17 Maven verify with in-memory H2 |
| nextjs-staging.yml | migration branch push | Checks only; no deployment |
| deploy-staging.yml | staging push or manual run on staging | Checks always; backend requires activation gates and an explicit manual input |
| deploy-production.yml | manual only | Literal-disabled checks make deployment unreachable until reviewed cutover |
| frontend.yaml | main frontend push/PR/manual | Existing Vite production deployment; unchanged |
| backend.yaml | main backend push/PR/manual | Existing backend production deployment; unchanged |

PR CI has read-only repository permission, no deployment environment/secrets and no
deployment jobs. Maven tests use an isolated in-memory database and unreachable mail
host. PR artifacts are not deployed. Deployment builds use the same checks, then
upload same-run artifacts. Each environment has its own concurrency group with
cancel-in-progress false; a remote flock also prevents overlapping activation.
GitHub may replace an older pending run with a newer one: only validated releases
activate, and backend comparison is against the last deployed source tree.

The legacy frontend copies dist/ to /usr/share/nginx/html and removes its old
contents. Next.js uses out/. On a shared VPS, confirm the effective backend workflow
on main is manual-only and scoped to eke-production-backend.service. Leave its
state alone and exclude older workflow reruns that used global Java termination.

## GitHub configuration (operator setup required)

Create environments named staging and production. Restrict staging deployments
to staging and production deployments to main. Require a production reviewer and
prevent self-approval where your GitHub plan supports it. Keep environment secrets
out of repository files. Enable branch protection/rulesets on staging and main:

- Require PRs and at least one review; main additionally requires recorded client approval.
- Require CI checks named Frontend checks, Backend checks and Deployment safety checks from the PR CI run
  (select the actual emitted check names in GitHub after the first run).
- Require current branch checks, resolved conversations, and block force pushes/deletion.
- Keep feature branches after merging when history must remain available.

Use the following repository variables (job gates/build inputs must be available
before the environment job starts):

| Variable | Initial value |
| --- | --- |
| STAGING_PIPELINE_ENABLED | false |
| PRODUCTION_PIPELINE_ENABLED | false |
| STAGING_EXISTING_SITE_URL | reviewed legacy-site URL, or empty if fallback links are intentionally omitted |
| PRODUCTION_EXISTING_SITE_URL | reviewed URL after cutover |

Environment-scoped secrets (prefix STAGING in staging, PRODUCTION in production):
PREFIX_HOST, PREFIX_USER, PREFIX_SSH_KEY, PREFIX_KNOWN_HOSTS.
Use a dedicated non-root account and a separate SSH key for each environment.
KNOWN_HOSTS must be verified out-of-band; never trust a blind ssh-keyscan.

Environment variables:
PREFIX_INFRA_READY=false until reviewed;
PREFIX_FRONTEND_URL=https://the-confirmed-host (origin only, no trailing slash);
PREFIX_BACKEND_ENABLED=false until the isolated service, database and application
security are ready. Existing STAGING_DEPLOY_ENABLED is ignored.

GitHub settings have not been configured by these files.
See [GitHub environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments)
and [reusable workflows](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows).

## Staging infrastructure

No server or DNS changes are performed by repository setup. Confirm host, domain,
TLS, access controls and resource capacity first. preview.eke.mk is only a proposal.

Provision /srv/eke-staging/{incoming,releases} and /srv/eke-staging-backend/{releases,data,uploads}
as real directories, not symlinks. The deploy user must have no production write
permissions. Nginx serves /srv/eke-staging/current with correct trailing-slash and
404 handling (see deploy/staging/nginx.conf.example). Add HTTPS and noindex; ensure
/release-id.txt is served without caching. Restrict staging access if needed while
allowing the GitHub runner's health request. Root and release-id URLs must respond
successfully with the same release marker.

### First staging backend deployment

1. Leave `STAGING_BACKEND_ENABLED=false` during preparation. Confirm the staging
   hostname and TLS, that `ss -ltnp 'sport = :18081'` shows a free port for a
   first install, and that `/usr/bin/java -version` reports Java 17 or 21.
   CI compiles for Java 17. Preserve the live frontend tree and its current
   pointer. Use a dedicated staging SSH account and an `eke-staging` service
   account without production access.
2. Provision the staging directories from the preceding section. The SSH
   account owns incoming and release directories and manages current pointers.
   Grant `eke-staging` read/traverse access to backend releases and ownership of
   `/srv/eke-staging-backend/data` and `/srv/eke-staging-backend/uploads`.
   Verify that the H2 file, upload directories and their contents resolve inside
   the staging tree and are independent of production, including symlinks and
   hard links. Verify that neither staging account can read or write production
   JARs, database files, uploads or environment files.
3. Install a root-owned `/etc/systemd/system/eke-staging-backend.service`
   from `deploy/eke-backend.service.example`, replacing `ENVIRONMENT` with
   `staging`. Create `/etc/eke-staging/backend.env` from
   `deploy/backend.env.example` with mode 0600 and staging-only credentials.
   Verify the exact working directory, JAR, env-file path, loopback port 18081,
   absolute H2 URL with `IFEXISTS=TRUE`, H2 console disabled and `ddl-auto=validate`.
   Use a staging mail sink compatible with the configured SMTP authentication and
   STARTTLS settings. Check the effective unit with `systemctl cat` and
   `systemd-analyze verify /etc/systemd/system/eke-staging-backend.service`.
   Confirm control-group kill mode, empty stop hooks and no dependencies
   that could start, stop or restart another application unit. With separately
   approved VPS preparation, run `systemctl daemon-reload` to register the unit.
   Permit the staging SSH account only these commands via a validated sudoers file.

   ```sudoers
   STAGING_SSH_USER ALL=(root) NOPASSWD: /usr/bin/systemctl restart eke-staging-backend.service, /usr/bin/systemctl stop eke-staging-backend.service
   ```

4. For an existing staging H2 database, stop only the staging unit during an
   approved maintenance window, back up its closed database and uploads, then
   rehearse and apply `001-news-publication.sql` with the application's H2
   version and staging credentials. For fresh staging, provision the schema from
   the reviewed staging JAR in a private bootstrap service as described in the
   [migration runbook](../deploy/staging/migrations/README.md). Use synthetic or
   existing staging data. Keep application startup on `ddl-auto=validate`.
5. Add the routes from `deploy/staging/nginx.conf.example` to the staging HTTPS
   vhost only. The proxy preserves `/api/`, points at loopback port 18081,
   and serves only the public project and homepage-news reads and uploads.
   Spring checks news image visibility. Keep auth, admin, messages and H2
   endpoints off the public proxy. The application still has a default admin
   bootstrap, hardcoded JWT signing material and anonymous message routes.
   If staging needs access controls, allow the VPS health requests to reach the
   allowed URLs. Run `nginx -t` before an approved reload and review the
   effective vhost routing and SELinux policy.
6. In GitHub, verify the staging environment and pinned SSH host key, set
   `STAGING_FRONTEND_URL` to the staging HTTPS origin, and confirm
   `STAGING_INFRA_READY=true` and `STAGING_PIPELINE_ENABLED=true` after review.
   Only with separate approval set `STAGING_BACKEND_ENABLED=true` and manually
   run **Deploy staging** on `staging` with **Activate the staging backend**
   selected. Staging pushes continue to deploy the frontend independently.
7. Verify `systemctl status eke-staging-backend.service` and `ss -ltnp 'sport = :18081'`.
   Require HTTP 200 at `http://127.0.0.1:18081/api/projects/` and from
   `/api/projects/` and `/api/news/homepage` on the staging HTTPS origin. In the
   staging browser, request the same-origin URLs and check a published image and
   an unpublished image. Confirm the published image is served and the
   unpublished image is inaccessible. The static Next.js frontend does not
   currently fetch the homepage news feed, so verify access with a direct
   browser request. Check the staging service journal and ensure the existing
   frontend still responds.

## Releases and rollback

Each frontend release is /srv/eke-ENV/releases/SHA-RUN-ATTEMPT; current is switched
atomically. Backend uses /srv/eke-ENV-backend/releases with an independent current
pointer. Source-tree IDs prevent restarting unchanged backend code; comparing to
the deployed ID retries backend changes after a failed deployment even if the next
push changes only frontend files. A runtime env-only change needs an operator-
approved restart of that exact unit, as it does not change the source tree.

Health failure restores previous pointers and restarts only the affected backend
unit. On a failed first backend deployment the service is stopped. On a failed first
frontend deployment current is removed. Files are retained; no old releases are
deleted. Inspect logs and verify restored health after failure. Backend schema/data
changes are NOT rolled back by symlink restoration. Take separate backups and
confirm compatibility before deploying database changes.

For a manual rollback, pause the environment gate, wait for active deployment to
finish, acquire /srv/eke-ENV/deploy.lock, select a known-good retained release,
create a temporary symlink to its absolute path, and atomically move it over current
with mv -Tf. For backend rollback use its corresponding directory and restart only
eke-ENV-backend.service. Verify the root/release marker and backend /api/projects/.
Record the selected SHA and restore gates only after review. Retention cleanup is
manual and must protect current, the previous release and database backups.

## Controlled production cutover (not authorized by setup)

1. Obtain client approval of staging and a reviewed main PR. Back up current
   frontend, backend, database and uploads; rehearse restoration.
2. With explicit production approval, retire legacy frontend.yaml/backend.yaml
   deployment triggers BEFORE merging Next.js into main. Do not let the legacy
   Vite deployment or killall workflow run during cutover.
3. Provision independent /srv/eke-production/{incoming,releases} and
   /srv/eke-production-backend/{releases,data,uploads}, dedicated service port 18082,
   production secrets/runtime configuration and exact-unit sudo permissions.
   Existing ~/eke data/uploads and database migration require a reviewed plan.
4. Review routing/TLS and first cutover separately. Existing production backend
   may stay in place while PRODUCTION_BACKEND_ENABLED=false; confirm API routing.
   New scripts never write /usr/share/nginx/html or ~/eke.
5. In the approved workflow change remove literal false on production checks,
   replace it with a main + PRODUCTION_PIPELINE_ENABLED guard and add push main.
   Keep environment reviewer approval, environment readiness and branch checks.
6. Activate gates and perform the controlled first release; verify public pages,
   APIs, auth, contact mail, uploads, database and rollback. Only then permit
   routine approved staging→main merges to deploy automatically.

Automatic production deployment is intentionally unavailable until this cutover.
No settings, server services, DNS, production data or running site were changed.
