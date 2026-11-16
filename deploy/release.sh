#!/usr/bin/env bash
# Disable tracing before accessing credentials, including when invoked with bash -x.
set +x
set -euo pipefail
fail() { printf '::error::%s\n' "$1" >&2; exit 1; }
phase='validating deployment inputs'
# Never print BASH_COMMAND or expanded arguments: they can contain secrets.
trap 'fail "Unexpected failure while $phase (line $LINENO). Values omitted for safety."' ERR
[[ "${INFRA_READY:-}" == true ]] || fail 'INFRA_READY must be true after infrastructure approval.'
case "${DEPLOY_ENV:-}" in
  staging) [[ "${GITHUB_REF:-}" == refs/heads/staging ]] || fail 'Staging deployment requires refs/heads/staging.';;
  production) [[ "${GITHUB_REF:-}" == refs/heads/main ]] || fail 'Production deployment requires refs/heads/main.';;
  *) fail 'DEPLOY_ENV must be staging or production.';;
esac
for name in DEPLOY_HOST DEPLOY_USER DEPLOY_SSH_KEY DEPLOY_KNOWN_HOSTS FRONTEND_URL; do
  [[ -n "${!name:-}" ]] || fail "Required setting $name is missing or empty; check deployment environment secrets/variables."
done
[[ "$DEPLOY_HOST" =~ ^[a-zA-Z0-9][a-zA-Z0-9.-]*$ ]] || fail 'DEPLOY_HOST must be a hostname or IPv4 address, without protocol, port or whitespace.'
[[ "$DEPLOY_USER" =~ ^[a-z_][a-z0-9_-]*$ && "$DEPLOY_USER" != root ]] || fail 'DEPLOY_USER must be a valid non-root Unix account.'
[[ "$FRONTEND_URL" =~ ^https://[a-zA-Z0-9][a-zA-Z0-9.-]*(:[0-9]+)?$ ]] || fail 'FRONTEND_URL must be an HTTPS origin with no path or trailing slash; check STAGING_FRONTEND_URL for staging.'
[[ "${GITHUB_SHA:-}" =~ ^[a-f0-9]{40}$ ]] || fail 'GITHUB_SHA must contain a full 40-character commit ID.'
[[ "${GITHUB_RUN_ID:-}" =~ ^[0-9]+$ && "${GITHUB_RUN_ATTEMPT:-}" =~ ^[0-9]+$ ]] || fail 'GITHUB_RUN_ID and GITHUB_RUN_ATTEMPT must be numeric.'
[[ "${BACKEND_ENABLED:-false}" == true || "${BACKEND_ENABLED:-false}" == false ]] || fail 'BACKEND_ENABLED must be true or false.'
[[ $# == 2 ]] || fail 'Expected frontend and backend artifact directory arguments.'
site="$1" backend="$2"
[[ -d "$site" && -s "$site/index.html" ]] || fail 'Frontend artifact is missing a nonempty index.html; check the frontend artifact download path.'
release="$GITHUB_SHA-$GITHUB_RUN_ID-$GITHUB_RUN_ATTEMPT"
base="/srv/eke-$DEPLOY_ENV"
backend_enabled="${BACKEND_ENABLED:-false}"
if [[ "$backend_enabled" == true ]]; then
  [[ -s "$backend/app.jar" ]] || fail 'Backend artifact is missing a nonempty app.jar.'
  [[ -f "$backend/source-id" ]] && grep -Eq '^[a-f0-9]{40}$' "$backend/source-id" || fail 'Backend artifact source-id is missing or invalid.'
fi
[[ -r deploy/activate-release.sh ]] || fail 'Missing deploy/activate-release.sh; run from the repository root.'
for name in ssh scp ssh-keygen tar; do
  command -v "$name" > /dev/null || fail "Required deployment tool $name is unavailable."
done
printf 'Deployment input and artifact validation passed.\n'
phase='preparing SSH credentials'
scratch=$(mktemp -d)
trap 'rm -rf -- "$scratch"' EXIT
printf '%s\n' "$DEPLOY_SSH_KEY" > "$scratch/key"
printf '%s\n' "$DEPLOY_KNOWN_HOSTS" > "$scratch/known_hosts"
chmod 600 "$scratch/key" "$scratch/known_hosts"
ssh-keygen -y -P '' -f "$scratch/key" > /dev/null 2>&1 || fail 'DEPLOY_SSH_KEY is not a readable, unencrypted private key; preserve its multiline format.'
ssh-keygen -F "$DEPLOY_HOST" -f "$scratch/known_hosts" > /dev/null 2>&1 || fail 'DEPLOY_KNOWN_HOSTS has no matching host entry; verify the pinned host key out of band.'
options=(-i "$scratch/key" -o BatchMode=yes -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes -o ConnectTimeout=15 -o ConnectionAttempts=1 -o ServerAliveInterval=15 -o ServerAliveCountMax=2 -o "UserKnownHostsFile=$scratch/known_hosts")
remote="$DEPLOY_USER@$DEPLOY_HOST"
phase='checking SSH connectivity'
if ! ssh "${options[@]}" "$remote" true 2>"$scratch/ssh-error"; then
  if grep -qi 'Host key verification failed\|REMOTE HOST IDENTIFICATION HAS CHANGED' "$scratch/ssh-error"; then
    fail 'SSH host-key verification failed. Verify DEPLOY_KNOWN_HOSTS out of band; strict checking remains enabled.'
  elif grep -qi 'Permission denied' "$scratch/ssh-error"; then
    fail 'SSH authentication failed. Check DEPLOY_USER, DEPLOY_SSH_KEY and the authorized key on the VPS.'
  elif grep -qi 'Could not resolve hostname' "$scratch/ssh-error"; then
    fail 'SSH hostname resolution failed. Check DEPLOY_HOST and runner DNS.'
  elif grep -qi 'timed out\|Connection refused\|No route to host' "$scratch/ssh-error"; then
    fail 'SSH connection unavailable. Check host reachability, port 22 and firewall rules.'
  fi
  fail 'SSH connectivity check failed. Credential values and raw SSH output are withheld.'
fi
printf 'SSH connectivity and authentication passed.\n'
phase='preparing remote incoming directory'
# Fixed paths; no current pointer or service is changed during this preflight.
ssh "${options[@]}" "$remote" "bash -s -- '$base' '$release'" 2>"$scratch/ssh-error" <<'REMOTE' || fail 'Remote directory preflight failed; see named checks above. No activation was attempted.'
set -eu
base="$1" release="$2"
check() { if ! "$@"; then echo "::error::Remote directory check failed: $label"; exit 1; fi; }
label='deployment base must exist'; check test -d "$base"
label='deployment base must not be a symlink'; check test ! -L "$base"
label='incoming directory must exist'; check test -d "$base/incoming"
label='incoming directory must not be a symlink'; check test ! -L "$base/incoming"
label='incoming directory must be writable'; check test -w "$base/incoming"
label='release incoming directory must be new and creatable'; check mkdir "$base/incoming/$release"
REMOTE
phase='packaging and uploading frontend artifact'
printf '%s\n' "$release" > "$site/release-id.txt"
tar -C "$site" -czf "$scratch/site.tar.gz" .
scp "${options[@]}" "$scratch/site.tar.gz" "$remote:$base/incoming/$release/site.tar.gz" 2>"$scratch/ssh-error" || fail 'Frontend upload failed; check SSH connectivity, remote disk space and incoming-directory permissions.'
if [[ "$backend_enabled" == true ]]; then
  scp "${options[@]}" "$backend/app.jar" "$backend/source-id" "$remote:$base/incoming/$release/" 2>"$scratch/ssh-error" || fail 'Backend upload failed; check SSH connectivity, remote disk space and incoming-directory permissions.'
fi
printf 'Artifact upload passed; starting release activation and health checks.\n'
phase='activating remote release'
ssh "${options[@]}" "$remote" "bash -s -- '$DEPLOY_ENV' '$release' '$FRONTEND_URL' '$backend_enabled'" < deploy/activate-release.sh 2>"$scratch/ssh-error" || fail 'Remote activation or health checks failed. Review activation output and rollback status; raw SSH diagnostics are withheld.'
