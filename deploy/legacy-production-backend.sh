#!/usr/bin/env bash
# Executed by the production SSH login. Standard input contains the new JAR.
set -euo pipefail

unit=eke-production-backend.service
workdir=/root/eke
systemctl=/usr/bin/systemctl
proc=/proc
health_url=http://127.0.0.1:8080/projects/
expected_checksum=${1:-}
[[ "$expected_checksum" =~ ^[a-f0-9]{64}$ ]] || { echo 'Expected a SHA-256 checksum' >&2; exit 1; }
cd -- "$workdir"
[[ "$(pwd -P)" == "$workdir" ]] || { echo 'Unexpected physical production directory' >&2; exit 1; }
exec 9> .backend-deploy.lock
flock -n 9 || { echo 'Another production backend deployment holds the lock' >&2; exit 1; }

runs_expected_jar() {
  local pid index
  local -a command_line=()
  pid=$("$systemctl" show -p MainPID --value "$unit") || return 1
  [[ "$pid" =~ ^[1-9][0-9]+$ ]] || return 1
  [[ "$(readlink -f "$proc/$pid/cwd")" == "$workdir" &&
     "$(basename "$(readlink -f "$proc/$pid/exe")")" == java ]] || return 1
  mapfile -d '' -t command_line < "$proc/$pid/cmdline" || return 1
  for ((index = 1; index + 1 < ${#command_line[@]}; index++)); do
    if [[ "${command_line[index]}" == -jar ]]; then
      case "${command_line[index + 1]}" in
        app.jar|./app.jar|"$workdir/app.jar") return 0 ;;
        *) return 1 ;;
      esac
    fi
  done
  return 1
}

api_ready() {
  local status
  status=$(curl -q --noproxy '*' --silent --max-time 3 --output /dev/null --write-out '%{http_code}' "$health_url") &&
    [[ "$status" == 200 ]]
}

# Check the loaded unit, including stop hooks and relationships that could stop other units.
if ! "$systemctl" is-active --quiet "$unit" ||
   [[ "$("$systemctl" show -p Id --value "$unit")" != "$unit" ]] ||
   [[ "$("$systemctl" show -p NeedDaemonReload --value "$unit")" != no ]] ||
   [[ "$("$systemctl" show -p WorkingDirectory --value "$unit")" != "$workdir" ]] ||
   [[ "$("$systemctl" show -p KillMode --value "$unit")" != control-group ]] ||
   ! stop_hooks=$("$systemctl" show --value -p ExecStop -p ExecStopPost \
       -p ConsistsOf -p BoundBy -p PropagatesStopTo -p ConflictedBy -p OnFailure -p OnSuccess "$unit") ||
   [[ -n "$stop_hooks" ]] ||
   ! conflicts=$("$systemctl" show -p Conflicts --value "$unit") ||
   [[ -n "$conflicts" && "$conflicts" != shutdown.target ]] ||
   [[ ! -f app.jar || ! -s app.jar || -L app.jar ]] ||
   ! runs_expected_jar || ! api_ready; then
  echo 'Production unit, JAR, or API preflight failed. See docs/PRODUCTION_BACKEND_ISOLATION.md.' >&2
  exit 1
fi

restart_production() {
  if (( EUID == 0 )); then
    "$systemctl" restart "$unit" || return 1
  else
    sudo -n "$systemctl" restart "$unit" || return 1
  fi

  local deadline=$((SECONDS + 60))
  until "$systemctl" is-active --quiet "$unit" && runs_expected_jar && api_ready; do
    (( SECONDS < deadline )) || return 1
    sleep 2
  done
}

incoming=$(mktemp -d .backend-deploy.XXXXXXXXXX)
trap 'rm -f -- "$incoming/app.jar" "$incoming/previous.jar"; rmdir -- "$incoming"' EXIT
cat > "$incoming/app.jar"
[[ -s "$incoming/app.jar" ]] || { echo 'Received an empty JAR' >&2; exit 1; }
printf '%s  %s\n' "$expected_checksum" "$incoming/app.jar" | sha256sum --check --status
chmod 0644 "$incoming/app.jar"
cp -p -- app.jar "$incoming/previous.jar"
mv -fT -- "$incoming/previous.jar" app.jar.previous
mv -fT -- "$incoming/app.jar" app.jar

if restart_production; then
  echo 'Production service restarted and the local API returned HTTP 200.'
  exit 0
fi

echo 'Production restart or API check failed. Restoring the prior JAR.' >&2
cp -p -- app.jar.previous "$incoming/app.jar"
mv -fT -- "$incoming/app.jar" app.jar
if ! restart_production; then
  echo 'Automatic rollback restart or API check failed. Production operator action required.' >&2
fi
exit 1
