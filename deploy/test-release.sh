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
echo 'Branch, readiness, user and URL guards passed.'
# Real symlink/atomic rename tests require Linux (same platform as deployment).
[[ "$(uname -s)" == Linux ]] || { echo 'Activation fixtures require Linux; covered in CI.'; exit 0; }
cat > "$scratch/bin/curl" <<'MOCK'
#!/usr/bin/env bash
if [[ "${MOCK_HEALTH:-}" == fail ]]; then exit 22; fi
if [[ "$*" == *release-id.txt* ]]; then printf '%s\n' "$MOCK_RELEASE"; fi
MOCK
printf '#!/usr/bin/env bash\nexit 0\n' > "$scratch/bin/sleep"
cat > "$scratch/bin/sudo" <<'MOCK'
#!/usr/bin/env bash
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
  mkdir -p "$TEST_BASE/releases/old" "$TEST_BASE/incoming/$MOCK_RELEASE" "$TEST_BASE-backend/releases/old" "$scratch/payload"
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
MOCK_HEALTH=ok bash "$scratch/activate.sh" staging "$MOCK_RELEASE" https://example.invalid true
[[ "$(readlink "$TEST_BASE/current")" == "$TEST_BASE/releases/$MOCK_RELEASE" ]]
[[ "$(readlink "$TEST_BASE-backend/current")" == "$TEST_BASE-backend/releases/$MOCK_RELEASE" ]]
grep -q 'restart eke-staging-backend.service' "$MOCK_SERVICE_LOG"
fixture failure
if MOCK_HEALTH=fail bash "$scratch/activate.sh" staging "$MOCK_RELEASE" https://example.invalid true; then exit 1; fi
[[ "$(readlink "$TEST_BASE/current")" == "$TEST_BASE/releases/old" ]]
[[ "$(readlink "$TEST_BASE-backend/current")" == "$TEST_BASE-backend/releases/old" ]]
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
