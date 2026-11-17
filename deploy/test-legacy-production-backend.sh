#!/usr/bin/env bash
# Offline fixtures. The service, process metadata and API are mocked.
set -euo pipefail
root=$(cd "$(dirname "$0")/.." && pwd)
scratch=$(mktemp -d)
trap 'rm -rf -- "$scratch"' EXIT
mkdir -p "$scratch/bin" "$scratch/production/data" "$scratch/production/uploads" "$scratch/proc/42" "$scratch/other"

export PATH="$scratch/bin:$PATH"
export MOCK_LOG="$scratch/commands"
export WORKDIR="$scratch/production"
export MOCK_PROC="$scratch/proc"
sed -e "s|^workdir=/root/eke$|workdir=\"$WORKDIR\"|" \
    -e 's|^systemctl=/usr/bin/systemctl$|systemctl=systemctl|' \
    -e "s|^proc=/proc$|proc=\"$MOCK_PROC\"|" \
    -e 's/SECONDS + 60/SECONDS/' \
    "$root/deploy/legacy-production-backend.sh" > "$scratch/deploy.sh"
printf -v remote_script '%q' "$(cat "$scratch/deploy.sh")"

cat > "$scratch/bin/systemctl" <<'MOCK'
#!/usr/bin/env bash
set -eu
printf '%s\n' "$*" >> "$MOCK_LOG"
case "$*" in
  'is-active --quiet eke-production-backend.service') [[ "$MODE" != inactive ]];;
  'show -p Id --value eke-production-backend.service') echo eke-production-backend.service;;
  'show -p NeedDaemonReload --value eke-production-backend.service')
    if [[ "$MODE" == pending-reload ]]; then echo yes; else echo no; fi;;
  'show -p WorkingDirectory --value eke-production-backend.service')
    if [[ "$MODE" == wrong-directory ]]; then echo /tmp; else echo "$WORKDIR"; fi;;
  'show -p KillMode --value eke-production-backend.service')
    if [[ "$MODE" == wrong-kill-mode ]]; then echo process; else echo control-group; fi;;
  'show --value -p ExecStop -p ExecStopPost -p ConsistsOf -p BoundBy -p PropagatesStopTo -p ConflictedBy -p OnFailure -p OnSuccess eke-production-backend.service')
    case "$MODE" in
      custom-stop) echo custom-stop-command;;
      linked-unit) echo other.service;;
    esac;;
  'show -p Conflicts --value eke-production-backend.service')
    if [[ "$MODE" == conflict ]]; then echo 'shutdown.target other.service'; else echo shutdown.target; fi;;
  'show -p MainPID --value eke-production-backend.service') echo 42;;
  'restart eke-production-backend.service')
    count=$(grep -c '^restart ' "$MOCK_LOG")
    [[ "$MODE" != failed-restart || "$count" -gt 1 ]];;
  *) exit 99;;
esac
MOCK

cat > "$scratch/bin/readlink" <<'MOCK'
#!/usr/bin/env bash
set -eu
case "$*" in
  "-f $MOCK_PROC/42/cwd") echo "$WORKDIR";;
  "-f $MOCK_PROC/42/exe") echo /usr/bin/java;;
  *) exit 99;;
esac
MOCK

cat > "$scratch/bin/curl" <<'MOCK'
#!/usr/bin/env bash
set -eu
[[ "$*" == "-q --noproxy * --silent --max-time 3 --output /dev/null --write-out %{http_code} http://127.0.0.1:8080/projects/" ]]
if [[ "$MODE" == preflight-api-failure || ( "$MODE" == failed-readiness && "$(cat app.jar)" == new ) ]]; then
  echo 503
else
  echo 200
fi
MOCK

cat > "$scratch/bin/sudo" <<'MOCK'
#!/usr/bin/env bash
set -eu
[[ "$*" == '-n systemctl restart eke-production-backend.service' ]]
shift
exec "$@"
MOCK

export REAL_FLOCK
REAL_FLOCK=$(command -v flock || true)
cat > "$scratch/bin/flock" <<'MOCK'
#!/usr/bin/env bash
set -eu
[[ "$*" == '-n 9' && "$MODE" != locked ]] || exit 1
# Git Bash lacks flock. Linux CI also takes the real lock.
if [[ -n "$REAL_FLOCK" ]]; then exec "$REAL_FLOCK" "$@"; fi
MOCK

chmod +x "$scratch/bin/"*
printf new > "$scratch/payload"
checksum=$(sha256sum "$scratch/payload")
checksum=${checksum%% *}
printf untouched > "$WORKDIR/data/database"
printf untouched > "$WORKDIR/uploads/image"
printf untouched > "$scratch/other/app.jar"

prepare() {
  printf old > "$WORKDIR/app.jar"
  rm -f -- "$WORKDIR/app.jar.previous"
  printf '%s\0' java -jar "${1:-app.jar}" > "$MOCK_PROC/42/cmdline"
  : > "$MOCK_LOG"
}

attempt() {
  MODE="$1" bash -c "bash -c $remote_script -- $2" < "$scratch/payload"
}

expect_blocked() {
  if attempt "$1" "$2"; then exit 1; fi
  [[ "$(cat "$WORKDIR/app.jar")" == old && ! -e "$WORKDIR/app.jar.previous" ]]
  if grep -q '^restart ' "$MOCK_LOG"; then exit 1; fi
}

for blocked in inactive pending-reload wrong-directory wrong-kill-mode custom-stop linked-unit conflict locked preflight-api-failure; do
  prepare
  expect_blocked "$blocked" "$checksum"
done

prepare "$scratch/other/app.jar"
expect_blocked success "$checksum"

prepare
expect_blocked success "$(printf '%064d' 0)"

prepare "$WORKDIR/app.jar"
attempt success "$checksum"
[[ "$(cat "$WORKDIR/app.jar")" == new && "$(cat "$WORKDIR/app.jar.previous")" == old ]]
[[ "$(grep '^restart ' "$MOCK_LOG")" == 'restart eke-production-backend.service' ]]

for failure in failed-restart failed-readiness; do
  prepare
  if attempt "$failure" "$checksum"; then exit 1; fi
  [[ "$(cat "$WORKDIR/app.jar")" == old && "$(cat "$WORKDIR/app.jar.previous")" == old ]]
  [[ "$(grep -xc 'restart eke-production-backend.service' "$MOCK_LOG")" == 2 ]]
  [[ "$(grep -c '^restart ' "$MOCK_LOG")" == 2 ]]
done
for file in "$WORKDIR/data/database" "$WORKDIR/uploads/image" "$scratch/other/app.jar"; do
  [[ "$(cat "$file")" == untouched ]]
done
echo 'Production preflight, checksum, scoped restart, readiness and rollback tests passed.'
