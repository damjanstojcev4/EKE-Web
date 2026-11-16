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
| deploy-staging.yml | staging push or manual run on staging | Checks always; deployment only with activation gates |
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
contents. Next.js uses out/. The legacy backend copies jars under ~/eke and runs
killall java. Both use DEPLOY_HOST, DEPLOY_USERNAME, DEPLOY_SSH_KEY.
These workflows do not run deployments for staging pushes, but a legacy main
backend deployment can kill a staging Java service on a shared VPS. Resolve that
conflict under explicit production approval before enabling a staging backend.
Do not change them automatically as part of this foundation.

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

For a backend, install a dedicated Java 17 service using
deploy/eke-backend.service.example, staging port 18081, loopback only.
Use a service account separate from the SSH deployment account; give it read access
to releases and write access only to its data/uploads directories.
Store secrets in /etc/eke-staging/backend.env (root-owned, restricted permissions).
The example env file is a template, not a usable credential file. Create a separate
H2 database (the current application uses H2, not an assumed external DB). Never
copy production data without a separate approved anonymization process.
Provision schema before using ddl-auto=validate; schema changes require reviewed
migrations and backups. Use a mail sink so staging cannot email real recipients.

Allow the deploy account passwordless sudo ONLY for restart/stop of
eke-staging-backend.service, not wildcard systemctl and never killall.
Route /api/ to 127.0.0.1:18081 preserving /api/. Route uploads consistently.
The backend health check GET /api/projects/ also checks database access.
The frontend still has existing/demo integration behavior; deploying a backend
does not itself wire forms/admin/pages to it.

Backend exposure blockers found in existing code: default admin/admin creation,
hardcoded JWT signing material, public message read/delete routes, localhost-only
CORS, and H2 console enabled by default. H2 is disabled by the environment template;
the other issues need a reviewed backend PR before exposing staging. Backend source
is deliberately preserved in this CI/CD change. Resolve legacy killall conflict too.

Only after provisioning and review set STAGING_INFRA_READY=true and repository
STAGING_PIPELINE_ENABLED=true. Keep STAGING_BACKEND_ENABLED=false for frontend-only
staging. Enable backend only after all above prerequisites. Merge a feature PR or
manually run Deploy staging on staging to deploy.

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
