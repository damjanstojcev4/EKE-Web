#!/usr/bin/env bash
# Offline regression tests. Never connect to a host or use /srv.
set -euo pipefail
root=$(cd "$(dirname "$0")/.." && pwd)
scratch=$(mktemp -d)
trap 'rm -rf -- "$scratch"' EXIT
mkdir "$scratch/bin"
printf '#!/usr/bin/env bash\necho unexpected-network-call >&2\nexit 99\n' > "$scratch/bin/ssh"
cp "$scratch/bin/ssh" "$scratch/bin/scp"
chmod +x "$scratch/bin/"*
export PATH="$scratch/bin:$PATH"
export INFRA_READY=true DEPLOY_ENV=staging GITHUB_REF=refs/heads/main
export DEPLOY_HOST=example.invalid DEPLOY_USER=eke
export DEPLOY_SSH_KEY=dummy DEPLOY_KNOWN_HOSTS=dummy FRONTEND_URL=https://example.invalid
export GITHUB_SHA=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa GITHUB_RUN_ID=1 GITHUB_RUN_ATTEMPT=1
expect_rejected() {
  local status=0
  bash "$root/deploy/release.sh" "$scratch" "$scratch" > "$scratch/output" 2>&1 || status=$?
  [[ "$status" != 0 && "$status" != 99 ]]
  ! grep -q unexpected-network-call "$scratch/output"
}
expect_rejected
GITHUB_REF=refs/heads/staging INFRA_READY=false expect_rejected
GITHUB_REF=refs/heads/staging DEPLOY_USER=root expect_rejected
GITHUB_REF=refs/heads/staging FRONTEND_URL='https://example.invalid/;bad' expect_rejected
GITHUB_REF=refs/heads/staging DEPLOY_ENV=production expect_rejected
printf site > "$scratch/index.html"
GITHUB_REF=refs/heads/staging BACKEND_REQUESTED=true BACKEND_ENABLED=false expect_rejected
echo 'Branch, readiness, user and URL guards passed.'

export MOCK_TRANSFER_LOG="$scratch/transfer.log"
for command in ssh scp; do
  cat > "$scratch/bin/$command" <<'MOCK'
#!/usr/bin/env bash
printf '%s %s\n' "${0##*/}" "$*" >> "$MOCK_TRANSFER_LOG"
MOCK
done
printf jar > "$scratch/app.jar"
printf '%s\n' "$GITHUB_SHA" > "$scratch/source-id"
GITHUB_REF=refs/heads/staging BACKEND_ENABLED=true BACKEND_REQUESTED=false \
  bash "$root/deploy/release.sh" "$scratch" "$scratch"
if grep -q 'app.jar' "$MOCK_TRANSFER_LOG"; then exit 1; fi
grep -q "'false'$" "$MOCK_TRANSFER_LOG"
: > "$MOCK_TRANSFER_LOG"
GITHUB_REF=refs/heads/staging BACKEND_ENABLED=true BACKEND_REQUESTED=true \
  bash "$root/deploy/release.sh" "$scratch" "$scratch"
grep -q 'app.jar' "$MOCK_TRANSFER_LOG"
grep -q "'true'$" "$MOCK_TRANSFER_LOG"
echo 'Staging backend artifacts require an explicit activation request.'

# Real symlink/atomic rename tests require Linux (same platform as deployment).
[[ "$(uname -s)" == Linux ]] || { echo 'Activation fixtures require Linux; covered in CI.'; exit 0; }
cat > "$scratch/bin/curl" <<'MOCK'
#!/usr/bin/env bash
if [[ "${MOCK_HEALTH:-}" == fail ]]; then exit 22; fi
case "${*: -1}" in
  'http://127.0.0.1:18081/api/projects/'|'https://example.invalid/api/projects/') printf 200; exit 0;;
  'https://example.invalid/api/news/homepage')
    if [[ "${MOCK_HEALTH:-}" == redirect ]]; then printf 302; else printf 200; fi
    exit 0;;
esac
if [[ "$*" == *release-id.txt* ]]; then printf '%s\n' "$MOCK_RELEASE"; fi
MOCK
cat > "$scratch/bin/systemctl" <<'MOCK'
#!/usr/bin/env bash
set -eu
[[ "${*: -1}" == eke-staging-backend.service ]]
case "${1:-}" in
  is-active) [[ "$*" == 'is-active --quiet eke-staging-backend.service' ]];;
  show)
    [[ "$2" == --value && "$3" == -p ]]
    case "$4" in
      WorkingDirectory) echo "$TEST_BASE-backend";;
      User) echo "${MOCK_UNIT_USER:-eke-staging-backend}";;
      Group) echo "${MOCK_UNIT_GROUP:-eke-staging-backend}";;
      KillMode) echo control-group;;
      NeedDaemonReload) echo no;;
      ExecStop) ;;
      Conflicts) echo shutdown.target;;
      *) exit 99;;
    esac;;
  *) exit 99;;
esac
MOCK
printf '#!/usr/bin/env bash\nexit 0\n' > "$scratch/bin/sleep"
cat > "$scratch/bin/sudo" <<'MOCK'
#!/usr/bin/env bash
[[ "$*" == '-n systemctl restart eke-staging-backend.service' ||
   "$*" == '-n systemctl stop eke-staging-backend.service' ]] || exit 99
printf '%s\n' "$*" >> "$MOCK_SERVICE_LOG"
MOCK
chmod +x "$scratch/bin/"*
export MOCK_RELEASE=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-1-1
export MOCK_SERVICE_LOG="$scratch/service.log"
# Substitute ONLY the fixed base in a temporary script, keeping live paths unreachable.
export TEST_BASE="$scratch/site"
sed 's|base="/srv/eke-$environment"|base="$TEST_BASE"|' "$root/deploy/activate-release.sh" > "$scratch/activate.sh"
fixture() {
  TEST_BASE="$scratch/$1"
  export TEST_BASE
  mkdir -p "$TEST_BASE/releases/old" "$TEST_BASE/incoming/$MOCK_RELEASE" \
    "$TEST_BASE-backend/"{releases/old,data,uploads} "$scratch/payload"
  printf old > "$TEST_BASE/releases/old/index.html"
  ln -s "$TEST_BASE/releases/old" "$TEST_BASE/current"
  ln -s "$TEST_BASE-backend/releases/old" "$TEST_BASE-backend/current"
  printf '%s\n' bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb > "$TEST_BASE-backend/releases/old/source-id"
  printf new > "$scratch/payload/index.html"
  tar -czf "$TEST_BASE/incoming/$MOCK_RELEASE/site.tar.gz" -C "$scratch/payload" .
  printf jar > "$TEST_BASE/incoming/$MOCK_RELEASE/app.jar"
  printf '%s\n' cccccccccccccccccccccccccccccccccccccccc > "$TEST_BASE/incoming/$MOCK_RELEASE/source-id"
}
fixture success
chmod 0600 "$TEST_BASE/incoming/$MOCK_RELEASE/"{app.jar,source-id}
(umask 077; MOCK_HEALTH=ok bash "$scratch/activate.sh" staging "$MOCK_RELEASE" https://example.invalid true)
[[ "$(readlink "$TEST_BASE/current")" == "$TEST_BASE/releases/$MOCK_RELEASE" ]]
[[ "$(readlink "$TEST_BASE-backend/current")" == "$TEST_BASE-backend/releases/$MOCK_RELEASE" ]]
[[ "$(stat -c %a "$TEST_BASE-backend/current/")" == 750 ]]
[[ "$(stat -c %a "$TEST_BASE-backend/current/app.jar")" == 640 ]]
[[ "$(stat -c %a "$TEST_BASE-backend/current/source-id")" == 640 ]]
grep -q 'restart eke-staging-backend.service' "$MOCK_SERVICE_LOG"
fixture failure
if MOCK_HEALTH=fail bash "$scratch/activate.sh" staging "$MOCK_RELEASE" https://example.invalid true; then exit 1; fi
[[ "$(readlink "$TEST_BASE/current")" == "$TEST_BASE/releases/old" ]]
[[ "$(readlink "$TEST_BASE-backend/current")" == "$TEST_BASE-backend/releases/old" ]]
fixture first_backend_redirect
unlink "$TEST_BASE-backend/current"
if MOCK_HEALTH=redirect bash "$scratch/activate.sh" staging "$MOCK_RELEASE" https://example.invalid true; then exit 1; fi
[[ "$(readlink "$TEST_BASE/current")" == "$TEST_BASE/releases/old" ]]
[[ ! -L "$TEST_BASE-backend/current" ]]
[[ "$(tail -n 1 "$MOCK_SERVICE_LOG")" == '-n systemctl stop eke-staging-backend.service' ]]
fixture wrong_unit
before=$(wc -l < "$MOCK_SERVICE_LOG")
for identity in MOCK_UNIT_USER=root MOCK_UNIT_USER=eke-staging MOCK_UNIT_GROUP=eke-staging; do
  if env "$identity" bash "$scratch/activate.sh" staging "$MOCK_RELEASE" https://example.invalid true; then exit 1; fi
done
[[ "$(readlink "$TEST_BASE/current")" == "$TEST_BASE/releases/old" ]]
[[ "$(readlink "$TEST_BASE-backend/current")" == "$TEST_BASE-backend/releases/old" ]]
[[ ! -e "$TEST_BASE-backend/releases/$MOCK_RELEASE" ]]
[[ "$(wc -l < "$MOCK_SERVICE_LOG")" == "$before" ]]
fixture frontend_failure
if MOCK_HEALTH=fail bash "$scratch/activate.sh" staging "$MOCK_RELEASE" https://example.invalid false; then exit 1; fi
[[ "$(readlink "$TEST_BASE/current")" == "$TEST_BASE/releases/old" ]]
fixture unchanged
cp "$TEST_BASE-backend/releases/old/source-id" "$TEST_BASE/incoming/$MOCK_RELEASE/source-id"
before=$(wc -l < "$MOCK_SERVICE_LOG")
MOCK_HEALTH=ok bash "$scratch/activate.sh" staging "$MOCK_RELEASE" https://example.invalid true
[[ "$(readlink "$TEST_BASE-backend/current")" == "$TEST_BASE-backend/releases/old" ]]
[[ "$(wc -l < "$MOCK_SERVICE_LOG")" == "$before" ]]
echo 'Activation, backend rollback, frontend rollback and unchanged-backend tests passed.'
