#!/usr/bin/env bash
# Runs on the VPS as the environment's non-root deployment user.
set -euo pipefail
environment="${1:?}" release="${2:?}" url="${3:?}" backend="${4:?}"
case "$environment" in
  staging) port=18081;;
  production) port=18082;;
  *) exit 1;;
esac
[[ "$release" =~ ^[a-f0-9]{40}-[0-9]+-[0-9]+$ ]]
[[ "$url" =~ ^https://[a-zA-Z0-9][a-zA-Z0-9.-]*(:[0-9]+)?$ ]]
[[ "$backend" == true || "$backend" == false ]]
base="/srv/eke-$environment"
api="$base-backend"
unit="eke-$environment-backend.service"
for directory in "$base" "$base/releases" "$base/incoming"; do
  test -d "$directory" && test ! -L "$directory"
done
exec 9>"$base/deploy.lock"
flock -n 9 || { echo 'Another deployment holds the lock'; exit 1; }
incoming="$base/incoming/$release"
test -d "$incoming" && test ! -L "$incoming"
# Validate old pointers before changing anything. Existing directories are never overwritten.
previous_site=$(readlink "$base/current" || true)
previous_api=''
validate_previous() {
  local previous="$1" parent="$2"
  [[ -z "$previous" ]] || {
    [[ "$previous" == "$parent/releases/"* ]] && test -d "$previous" &&
      [[ "$environment" != staging || "$(realpath -e -- "$previous")" == "$previous" ]]
  }
}
[[ ! -e "$base/current" || -L "$base/current" ]]
validate_previous "$previous_site" "$base"
if [[ "$backend" == true ]]; then
  for directory in "$api" "$api/releases"; do test -d "$directory" && test ! -L "$directory"; done
  [[ ! -e "$api/current" || -L "$api/current" ]]
  previous_api=$(readlink "$api/current" || true)
  validate_previous "$previous_api" "$api"
  test -s "$incoming/app.jar"
  grep -Eq '^[a-f0-9]{40}$' "$incoming/source-id"
  if [[ "$environment" == staging ]]; then
    for directory in "$api/data" "$api/uploads"; do
      test -d "$directory" && test ! -L "$directory"
    done
    [[ "$(systemctl show --value -p WorkingDirectory "$unit")" == "$api" ]]
    [[ "$(systemctl show --value -p User "$unit")" == eke-staging-backend ]]
    [[ "$(systemctl show --value -p Group "$unit")" == eke-staging-backend ]]
    [[ "$(systemctl show --value -p KillMode "$unit")" == control-group ]]
    [[ "$(systemctl show --value -p NeedDaemonReload "$unit")" == no ]]
    stop_hooks=$(systemctl show --value -p ExecStop -p ExecStopPost -p ConsistsOf \
      -p BoundBy -p PropagatesStopTo -p ConflictedBy -p OnFailure -p OnSuccess "$unit")
    [[ -z "$stop_hooks" ]]
    conflicts=$(systemctl show --value -p Conflicts "$unit")
    [[ -z "$conflicts" || "$conflicts" == shutdown.target ]]
  fi
fi
api_ok() {
  local status
  status=$(curl -q --fail --silent --show-error --max-time 5 -o /dev/null -w '%{http_code}' "$1") &&
    [[ "$status" == 200 ]]
}
activate() {
  local parent="$1" target="$2"
  ln -s "$target" "$parent/current-$release"
  mv -Tf "$parent/current-$release" "$parent/current"
}
site_changed=false
api_changed=false
rollback() {
  local status=$?
  trap - EXIT
  if (( status != 0 )); then
    echo 'Deployment failed; restoring previous release pointers.'
    if [[ "$site_changed" == true ]]; then
      if [[ -n "$previous_site" ]]; then activate "$base" "$previous_site"; else unlink "$base/current"; fi
    fi
    if [[ "$api_changed" == true ]]; then
      if [[ -n "$previous_api" ]]; then
        activate "$api" "$previous_api"
        sudo -n systemctl restart "$unit"
      else
        sudo -n systemctl stop "$unit"
        unlink "$api/current"
      fi
    fi
    echo 'Release files retained. Check restored service health; database changes are not rolled back.'
  fi
  exit "$status"
}
trap rollback EXIT
mkdir "$base/releases/$release"
tar -xzf "$incoming/site.tar.gz" -C "$base/releases/$release"
test -s "$base/releases/$release/index.html"
if [[ "$backend" == true ]]; then
  # Compare to the last DEPLOYED source, so a failed run is retried even on a frontend-only push.
  if [[ -z "$previous_api" ]] || ! cmp -s "$incoming/source-id" "$previous_api/source-id"; then
    api_release="$api/releases/$release"
    if [[ "$environment" == staging ]]; then
      # Keep the inherited runtime ACL effective even with a restrictive SSH umask or upload mode.
      mkdir -m 0750 "$api_release"
      cp "$incoming/app.jar" "$incoming/source-id" "$api_release/"
      chmod 0640 "$api_release/app.jar" "$api_release/source-id"
    else
      mkdir "$api_release"
      cp "$incoming/app.jar" "$incoming/source-id" "$api_release/"
    fi
    api_changed=true
    activate "$api" "$api_release"
    sudo -n systemctl restart "$unit"
  fi
  healthy=false
  for attempt in {1..12}; do
    if [[ "$environment" == staging ]]; then
      if systemctl is-active --quiet "$unit" &&
         api_ok "http://127.0.0.1:$port/api/projects/" &&
         api_ok "$url/api/projects/" &&
         api_ok "$url/api/news/homepage"; then
        healthy=true
        break
      fi
    elif curl --fail --silent --show-error --max-time 5 "http://127.0.0.1:$port/api/projects/" > /dev/null; then
      healthy=true
      break
    fi
    sleep 5
  done
  [[ "$healthy" == true ]]
fi
site_changed=true
activate "$base" "$base/releases/$release"
healthy=false
for attempt in {1..6}; do
  if [[ "$(curl --fail --silent --show-error --max-time 10 "$url/release-id.txt?release=$release" || true)" == "$release" ]] &&
     curl --fail --silent --show-error --max-time 10 "$url/" > /dev/null; then
    healthy=true
    break
  fi
  sleep 5
done
[[ "$healthy" == true ]]
echo "Activated $environment release $release"
# Keep all releases and incoming artifacts for operator-reviewed retention/rollback.
