#!/usr/bin/env bash
set -euo pipefail
# Called only by a trusted branch deployment job, never by PR CI.
[[ "${INFRA_READY:-}" == true ]] || { echo 'Infrastructure has not been approved'; exit 1; }
case "${DEPLOY_ENV:-}" in
  staging) [[ "${GITHUB_REF:-}" == refs/heads/staging ]];;
  production) [[ "${GITHUB_REF:-}" == refs/heads/main ]];;
  *) exit 1;;
esac
: "${DEPLOY_HOST:?}" "${DEPLOY_USER:?}" "${DEPLOY_SSH_KEY:?}" "${DEPLOY_KNOWN_HOSTS:?}" "${FRONTEND_URL:?}"
[[ "$DEPLOY_HOST" =~ ^[a-zA-Z0-9][a-zA-Z0-9.-]*$ ]]
[[ "$DEPLOY_USER" =~ ^[a-z_][a-z0-9_-]*$ && "$DEPLOY_USER" != root ]]
[[ "$FRONTEND_URL" =~ ^https://[a-zA-Z0-9][a-zA-Z0-9.-]*(:[0-9]+)?$ ]]
[[ "${GITHUB_SHA:-}" =~ ^[a-f0-9]{40}$ ]]
[[ "${GITHUB_RUN_ID:-}" =~ ^[0-9]+$ && "${GITHUB_RUN_ATTEMPT:-}" =~ ^[0-9]+$ ]]
site="${1:?}" backend="${2:?}"
test -s "$site/index.html"
release="$GITHUB_SHA-$GITHUB_RUN_ID-$GITHUB_RUN_ATTEMPT"
base="/srv/eke-$DEPLOY_ENV"
backend_enabled=false
[[ "${BACKEND_ENABLED:-}" != true ]] || backend_enabled=true
if [[ "$backend_enabled" == true ]]; then
  test -s "$backend/app.jar"
  grep -Eq '^[a-f0-9]{40}$' "$backend/source-id"
fi
scratch=$(mktemp -d)
trap 'rm -rf -- "$scratch"' EXIT
printf '%s\n' "$DEPLOY_SSH_KEY" > "$scratch/key"
printf '%s\n' "$DEPLOY_KNOWN_HOSTS" > "$scratch/known_hosts"
chmod 600 "$scratch/key" "$scratch/known_hosts"
options=(-i "$scratch/key" -o BatchMode=yes -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes -o "UserKnownHostsFile=$scratch/known_hosts")
remote="$DEPLOY_USER@$DEPLOY_HOST"
# Fixed paths; environment-specific Unix users must have no access to the other environment.
ssh "${options[@]}" "$remote" "test -d '$base/incoming' && test ! -L '$base' && test ! -L '$base/incoming' && mkdir '$base/incoming/$release'"
printf '%s\n' "$release" > "$site/release-id.txt"
tar -C "$site" -czf "$scratch/site.tar.gz" .
scp "${options[@]}" "$scratch/site.tar.gz" "$remote:$base/incoming/$release/site.tar.gz"
if [[ "$backend_enabled" == true ]]; then
  scp "${options[@]}" "$backend/app.jar" "$backend/source-id" "$remote:$base/incoming/$release/"
fi
ssh "${options[@]}" "$remote" "bash -s -- '$DEPLOY_ENV' '$release' '$FRONTEND_URL' '$backend_enabled'" < deploy/activate-release.sh
