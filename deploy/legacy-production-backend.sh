#!/usr/bin/env bash
# Executed by the production SSH login. Standard input contains the new jar.
set -euo pipefail

unit=eke-production-backend.service
systemctl=/usr/bin/systemctl
expected_checksum=${1:-}
[[ "$expected_checksum" =~ ^[a-f0-9]{64}$ ]] || { echo 'Expected a SHA-256 checksum' >&2; exit 1; }
cd "$HOME/eke"
workdir=$(pwd -P)
exec 9> .backend-deploy.lock
flock -n 9 || { echo 'Another production backend deployment holds the lock' >&2; exit 1; }

# Refuse to replace the jar until the reviewed unit owns the legacy app directory.
if ! "$systemctl" is-active --quiet "$unit" ||
   [[ "$("$systemctl" show -p WorkingDirectory --value "$unit")" != "$workdir" ]] ||
   [[ "$("$systemctl" show -p KillMode --value "$unit")" != control-group ]] ||
   ! stop_hooks=$("$systemctl" show --value -p ExecStop -p ExecStopPost \
       -p ConsistsOf -p BoundBy -p PropagatesStopTo "$unit") ||
   [[ -n "$stop_hooks" ]] ||
   [[ ! -s app.jar || -L app.jar ]]; then
  echo 'Production systemd handoff required. See docs/PRODUCTION_BACKEND_ISOLATION.md.' >&2
  exit 1
fi

restart_production() {
  if (( EUID == 0 )); then
    "$systemctl" restart "$unit"
  else
    sudo -n "$systemctl" restart "$unit"
  fi
}

incoming=$(mktemp -d .backend-deploy.XXXXXXXXXX)
trap 'rm -f -- "$incoming/app.jar" "$incoming/previous.jar"; rmdir -- "$incoming"' EXIT
cat > "$incoming/app.jar"
[[ -s "$incoming/app.jar" ]] || { echo 'Received an empty jar' >&2; exit 1; }
printf '%s  %s\n' "$expected_checksum" "$incoming/app.jar" | sha256sum --check --status
chmod 0644 "$incoming/app.jar"
cp -p -- app.jar "$incoming/previous.jar"
mv -fT -- "$incoming/previous.jar" app.jar.previous
mv -fT -- "$incoming/app.jar" app.jar

if restart_production && "$systemctl" is-active --quiet "$unit"; then
  echo 'Production service restarted. Verify the live API before closing the deployment.'
  exit 0
fi

echo 'Production restart failed. Restoring the prior jar.' >&2
cp -p -- app.jar.previous "$incoming/app.jar"
mv -fT -- "$incoming/app.jar" app.jar
if ! restart_production || ! "$systemctl" is-active --quiet "$unit"; then
  echo 'Automatic rollback restart failed. Production operator action required.' >&2
fi
exit 1
