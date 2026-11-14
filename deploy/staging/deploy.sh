#!/usr/bin/env bash
set -euo pipefail
: "${STAGING_HOST:?Missing STAGING_HOST}"
: "${STAGING_USER:?Missing STAGING_USER}"
: "${STAGING_SSH_KEY:?Missing STAGING_SSH_KEY}"
: "${STAGING_KNOWN_HOSTS:?Missing STAGING_KNOWN_HOSTS}"
[[ "$STAGING_HOST" =~ ^[a-zA-Z0-9][a-zA-Z0-9.-]*$ ]]
[[ "$STAGING_USER" =~ ^[a-z_][a-z0-9_-]*$ && "$STAGING_USER" != root ]]
[[ "${GITHUB_REF:-}" == refs/heads/feat/nextjs-migration ]]
[[ "${GITHUB_SHA:-}" =~ ^[a-f0-9]{40}$ ]]
[[ "${GITHUB_RUN_ID:-}" =~ ^[0-9]+$ && "${GITHUB_RUN_ATTEMPT:-}" =~ ^[0-9]+$ ]]
artifact="${1:?Artifact directory required}"
test -f "$artifact/index.html"
release="${GITHUB_SHA}-${GITHUB_RUN_ID}-${GITHUB_RUN_ATTEMPT}"
# Fixed, staging-only destination. Never share this path/user with production.
base=/srv/eke-staging
ssh_dir=$(mktemp -d)
trap 'rm -rf -- "$ssh_dir"' EXIT
printf '%s\n' "$STAGING_SSH_KEY" > "$ssh_dir/key"
printf '%s\n' "$STAGING_KNOWN_HOSTS" > "$ssh_dir/known_hosts"
chmod 600 "$ssh_dir/key" "$ssh_dir/known_hosts"
ssh_options=(-i "$ssh_dir/key" -o BatchMode=yes -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes -o "UserKnownHostsFile=$ssh_dir/known_hosts")
remote="$STAGING_USER@$STAGING_HOST"
ssh "${ssh_options[@]}" "$remote" "test -d '$base/releases' && test ! -L '$base' && test ! -L '$base/releases' && mkdir '$base/releases/$release'"
tar -C "$artifact" -czf "$ssh_dir/release.tar.gz" .
scp "${ssh_options[@]}" "$ssh_dir/release.tar.gz" "$remote:$base/releases/$release/site.tar.gz"
ssh "${ssh_options[@]}" "$remote" "set -eu; cd '$base/releases/$release'; tar -xzf site.tar.gz; rm site.tar.gz; test -s index.html; ln -s '$base/releases/$release' '$base/current-$release'; mv -Tf '$base/current-$release' '$base/current'"
# No service restart, backend access, production path, or release deletion.
