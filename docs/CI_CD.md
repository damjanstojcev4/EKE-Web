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
   pointer. Confirm `STAGING_USER=eke-staging` in the GitHub staging environment.
2. Follow [the staging account and ACL setup](#staging-account-and-acl-setup).
   `eke-staging` owns releases and manages current pointers. `eke-staging-backend`
   can read backend releases and owns the staging database and uploads. Verify
   both accounts' isolation from production JARs, databases, uploads and secrets
   by reviewing the existing ownership, groups and ACLs.
3. Follow [the staging unit and sudo setup](#staging-unit-and-sudo-setup).
   Verify the exact working directory, JAR, env-file path, loopback port 18081,
   absolute H2 URL with `IFEXISTS=TRUE`, H2 console disabled and `ddl-auto=validate`.
   Use a staging mail sink compatible with the configured SMTP authentication and
   STARTTLS settings.

4. For an existing staging H2 database, stop only the staging unit during an
   approved maintenance window, back up its closed database and uploads, then
   rehearse and apply `001-news-publication.sql` with the application's H2
   version and staging credentials. For fresh staging, provision the schema from
   the reviewed staging JAR in a private bootstrap service as described in the
   [migration runbook](../deploy/staging/migrations/README.md). Use synthetic or
   existing staging data. Keep application startup on `ddl-auto=validate`.
5. Follow [the staging public proxy checks](#staging-public-proxy-checks).
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

### Staging account and ACL setup

Run from the reviewed staging checkout in a root Bash shell during approved
staging preparation. Keep backend activation disabled, and ensure the deploy
account has no concurrent backend file operations. Confirm the staging
database is closed and the existing backups are verified. Confirm `/srv` is a
real directory and use `findmnt` to review the backend tree for nested mounts
and bind mounts. Proceed only with dedicated staging storage and no nested mounts.
The commands require the Linux `acl` tools (`setfacl` and `getfacl`) and a
filesystem supporting POSIX ACLs. The setup replaces ACLs on the named staging
storage paths. Incoming artifacts and the frontend remain under the existing
deployment account setup.

```bash
(
  set -euo pipefail
  ssh_user=eke-staging
  runtime=eke-staging-backend
  backend=/srv/eke-staging-backend
  command -v setfacl getfacl >/dev/null
  getent passwd "$ssh_user" >/dev/null
  test -d /srv && test ! -L /srv
  for dir in "$backend" "$backend/releases" "$backend/data" "$backend/uploads"; do
    test -d "$dir" && test ! -L "$dir" || exit 1
  done
  if [ -L "$backend/current" ]; then
    test "$(stat -c %U -- "$backend/current")" = "$ssh_user"
  else
    test ! -e "$backend/current"
  fi
  unsafe=$(find "$backend/releases" "$backend/data" "$backend/uploads" -xdev \
    \( ! -type d ! -type f -o -type f -links +1 \) -print -quit)
  test -z "$unsafe"
  wrong_owner=$(find "$backend/releases" -xdev ! -user "$ssh_user" -print -quit)
  test -z "$wrong_owner"

  # Run once. If the identity already exists, inspect it before reusing it.
  useradd --system --user-group --no-create-home --home-dir /nonexistent \
    --shell /usr/sbin/nologin "$runtime"
  passwd -l "$runtime"
  id "$runtime"

  chown root:root "$backend"
  setfacl -k -- "$backend"
  setfacl --set "u::rwx,u:$ssh_user:rwx,u:$runtime:--x,g::---,m::rwx,o::---" -- "$backend"
  chmod +t -- "$backend"
  find "$backend/releases" -xdev -type d -exec setfacl -k -- {} +
  find "$backend/releases" -xdev -type d -exec setfacl --set \
    "u::rwx,u:$runtime:r-x,g::---,m::r-x,o::---,d:u::rwx,d:u:$runtime:r-x,d:g::---,d:m::r-x,d:o::---" -- {} +
  find "$backend/releases" -xdev -type f -exec setfacl --set \
    "u::rw-,u:$runtime:r--,g::---,m::r--,o::---" -- {} +

  setfacl -R -P -b -k -- "$backend/data" "$backend/uploads"
  chown -R -P --no-dereference "$runtime:$runtime" -- "$backend/data" "$backend/uploads"
  chmod -R u-s,g-s,o-t,u=rwX,go= -- "$backend/data" "$backend/uploads"

  # Exercise the modes used by activation with a new release directory and a 0600 source.
  probe="$backend/releases/.runtime-acl-check-$$"
  runuser -u "$ssh_user" -- bash -eu -c '
    umask 077
    mkdir -m 0750 "$1"
    printf probe > "$1/source"
    chmod 0600 "$1/source"
    cp "$1/source" "$1/app.jar"
    chmod 0640 "$1/app.jar"
  ' bash "$probe"
  getfacl -p -- "$backend" "$backend/releases" "$probe/app.jar"
  runuser -u "$runtime" -- bash -eu -c '
    test -r "$1/app.jar"
    for path in "$1" "$1/app.jar" "$2" "$2/releases"; do
      test ! -w "$path" || exit 1
    done
    for dir in "$2/data" "$2/uploads"; do
      file=$(mktemp "$dir/.runtime-acl-check.XXXXXX")
      rm -- "$file"
    done
  ' bash "$probe" "$backend"
  runuser -u "$ssh_user" -- test ! -x "$backend/data"
  runuser -u "$ssh_user" -- test ! -x "$backend/uploads"
  runuser -u "$ssh_user" -- rm -- "$probe/source" "$probe/app.jar"
  runuser -u "$ssh_user" -- rmdir -- "$probe"
)
```

If the runtime identity already exists, confirm it has a locked password,
`/usr/sbin/nologin`, no home or SSH keys, and only its own group. Then skip
`useradd`. Review SSH configuration for any policy that grants keys or SSH
access to service identities. The root-owned sticky backend directory lets the
deploy account replace its own `current` symlink and protects the runtime-owned
`data` and `uploads` entries from deployment-account renames. The release
directory's default ACL grants the runtime account read/traverse access to
future releases. Activation sets the
staging directory to `0750` and JAR and source marker to `0640` to keep the
inherited ACL mask effective with restrictive upload modes and umasks.

### Staging unit and sudo setup

Run from the reviewed checkout as root. Review any existing staging env file
before replacing it. Supply the staging-only credentials with a root editor.

```bash
(
  set -euo pipefail
  test ! -L /etc/eke-staging
  install -d -o root -g root -m 0700 /etc/eke-staging
  test ! -L /etc/eke-staging/backend.env
  if [ ! -e /etc/eke-staging/backend.env ]; then
    install -o root -g root -m 0600 deploy/backend.env.example /etc/eke-staging/backend.env
  fi
  test -f /etc/eke-staging/backend.env
  test "$(stat -c %h /etc/eke-staging/backend.env)" = 1
  chown root:root /etc/eke-staging/backend.env
  chmod 0600 /etc/eke-staging/backend.env
  "${EDITOR:-vi}" /etc/eke-staging/backend.env

  unit_tmp=$(mktemp)
  trap 'rm -f -- "$unit_tmp"' EXIT
  sed -e 's/ENVIRONMENT/staging/g' -e 's/RUNTIME_ACCOUNT/eke-staging-backend/g' \
    deploy/eke-backend.service.example > "$unit_tmp"
  install -o root -g root -m 0644 "$unit_tmp" /etc/systemd/system/eke-staging-backend.service
  systemd-analyze verify /etc/systemd/system/eke-staging-backend.service
  systemctl daemon-reload
  systemctl cat eke-staging-backend.service
  systemctl show -p User -p Group -p WorkingDirectory -p ProtectSystem -p ReadWritePaths \
    -p KillMode -p ExecStop -p ExecStopPost -p NeedDaemonReload eke-staging-backend.service

  visudo -f /etc/sudoers.d/eke-staging-backend
  chown root:root /etc/sudoers.d/eke-staging-backend
  chmod 0440 /etc/sudoers.d/eke-staging-backend
  visudo -c
)
```

Enter this exact line in `visudo`. Check the effective unit and drop-ins for
`User` and `Group` both set to `eke-staging-backend`, `KillMode=control-group`,
empty stop hooks, and dependencies scoped to this service. The deploy account
can select the JAR this unprivileged unit runs, so keep unit files and drop-ins
root-controlled and free of privileged hooks.

```sudoers
eke-staging ALL=(root) NOPASSWD: /usr/bin/systemctl restart eke-staging-backend.service, /usr/bin/systemctl stop eke-staging-backend.service
```

Query sudo policy without executing a service action. The first two command
queries must succeed and the remaining queries must be denied. Review the full
list for grants inherited from groups or other sudoers files. The runtime
account must have no sudo grants.

```bash
sudo -l -U eke-staging
sudo -l -U eke-staging-backend
sudo -n -l -U eke-staging -- systemctl restart eke-staging-backend.service
sudo -n -l -U eke-staging -- systemctl stop eke-staging-backend.service
sudo -n -l -U eke-staging -- /usr/bin/systemctl start eke-staging-backend.service
sudo -n -l -U eke-staging -- /usr/bin/systemctl restart eke-staging-backend.service ssh.service
sudo -n -l -U eke-staging -- /usr/bin/systemctl stop ssh.service
sudo -n -l -U eke-staging -- /usr/bin/systemctl daemon-reload
```

### Staging public proxy checks

Use the route allowlist from `deploy/staging/nginx.conf.example` in the staging
HTTPS vhost. Preserve `/api/` and forward to loopback port 18081. Allow GET/HEAD
at Nginx for the project list, title, recent and UUID lookups, the homepage news
feed, and single-file reads from `uploads/news`, `uploads/images` and `uploads/pdf`.
Spring decides whether to serve a HEAD request and checks news image visibility.
Keep uploads behind Spring and keep `/api/auth`, `/api/admin`, `/api/messages`,
other news routes, and the H2 console out of the proxy. The app still has a default
admin bootstrap, hardcoded JWT signing material and anonymous message routes.
Check the effective staging vhost for broader API proxy rules and run `nginx -t`
before an approved reload. Any staging access control must allow the VPS health
requests to the explicitly allowed paths.

After separately approved activation, verify HTTP 200 on `GET /api/projects/`
and `GET /api/news/homepage` and test a known public upload and an unpublished
news image. Verify the vhost returns 404 on `/api/auth/authenticate`, `/api/admin`,
`/api/messages`, `/api/news` and `/api/h2-console/`. Read-method access logs and
the effective `limit_except GET` configuration can verify the write boundary
without submitting a mutation to the staging application.

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
