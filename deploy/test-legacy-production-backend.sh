#!/usr/bin/env bash
# Offline fixtures. All service commands go through mocks.
set -euo pipefail
root=$(cd "$(dirname "$0")/.." && pwd)
scratch=$(mktemp -d)
trap 'rm -rf -- "$scratch"' EXIT
mkdir -p "$scratch/bin"
export PATH="$scratch/bin:$PATH"
export MOCK_LOG="$scratch/commands"

sed 's|^systemctl=/usr/bin/systemctl$|systemctl=systemctl|' \
  "$root/deploy/legacy-production-backend.sh" > "$scratch/deploy.sh"
printf -v remote_script '%q' "$(cat "$scratch/deploy.sh")"
if command -v systemd-analyze >/dev/null; then
  sed -e 's|@USER@|root|g' -e 's|@WORKDIR@|/tmp|g' -e 's|@JAVA@|/usr/bin/true|g' \
    "$root/deploy/legacy-production-backend.service.example" > "$scratch/eke-production-backend.service"
  systemd-analyze verify "$scratch/eke-production-backend.service"
fi

cat > "$scratch/bin/systemctl" <<'MOCK'
#!/usr/bin/env bash
set -eu
printf '%s\n' "$*" >> "$MOCK_LOG"
case "$*" in
  'is-active --quiet eke-production-backend.service')
    [[ "$MODE" != inactive ]];;
  'show -p WorkingDirectory --value eke-production-backend.service')
    if [[ "$MODE" == wrong-directory ]]; then echo "$HOME/staging"; else pwd -P; fi;;
  'show -p KillMode --value eke-production-backend.service')
    if [[ "$MODE" == wrong-kill-mode ]]; then echo process; else echo control-group; fi;;
  'show --value -p ExecStop -p ExecStopPost -p ConsistsOf -p BoundBy -p PropagatesStopTo eke-production-backend.service')
    if [[ "$MODE" == custom-stop ]]; then echo custom-stop-command; fi
    if [[ "$MODE" == linked-unit ]]; then echo eke-staging-backend.service; fi;;
  'restart eke-production-backend.service')
    count=$(grep -c '^restart ' "$MOCK_LOG")
    [[ "$MODE" != failed-restart || "$count" -gt 1 ]];;
  *) exit 99;;
esac
MOCK
cat > "$scratch/bin/sudo" <<'MOCK'
#!/usr/bin/env bash
set -eu
[[ "$*" == '-n systemctl restart eke-production-backend.service' ]]
shift
exec "$@"
MOCK
if ! command -v flock >/dev/null; then
  # Git Bash lacks flock. Linux CI uses the OS lock.
  printf '#!/usr/bin/env bash\n[[ "$*" == "-n 9" ]]\n' > "$scratch/bin/flock"
fi
chmod +x "$scratch/bin/"*

printf new > "$scratch/payload"
checksum=$(sha256sum "$scratch/payload")
checksum=${checksum%% *}
export HOME="$scratch/home"
mkdir -p "$HOME/eke/data" "$HOME/eke/uploads" "$HOME/staging"
printf untouched > "$HOME/eke/data/database"
printf untouched > "$HOME/eke/uploads/image"
printf untouched > "$HOME/staging/app.jar"

prepare() {
  printf old > "$HOME/eke/app.jar"
  rm -f -- "$HOME/eke/app.jar.previous"
  : > "$MOCK_LOG"
}

attempt() {
  MODE="$1" bash -c "bash -c $remote_script -- $2" < "$scratch/payload"
}

for blocked in inactive wrong-directory wrong-kill-mode custom-stop linked-unit; do
  prepare
  if attempt "$blocked" "$checksum"; then exit 1; fi
  [[ "$(cat "$HOME/eke/app.jar")" == old && ! -e "$HOME/eke/app.jar.previous" ]]
  if grep -q '^restart ' "$MOCK_LOG"; then exit 1; fi
done

prepare
if attempt success "$(printf '%064d' 0)"; then exit 1; fi
[[ "$(cat "$HOME/eke/app.jar")" == old && ! -e "$HOME/eke/app.jar.previous" ]]
if grep -q '^restart ' "$MOCK_LOG"; then exit 1; fi

prepare
attempt success "$checksum"
[[ "$(cat "$HOME/eke/app.jar")" == new && "$(cat "$HOME/eke/app.jar.previous")" == old ]]
[[ "$(grep '^restart ' "$MOCK_LOG")" == 'restart eke-production-backend.service' ]]

prepare
if attempt failed-restart "$checksum"; then exit 1; fi
[[ "$(cat "$HOME/eke/app.jar")" == old && "$(cat "$HOME/eke/app.jar.previous")" == old ]]
[[ "$(grep -xc 'restart eke-production-backend.service' "$MOCK_LOG")" == 2 ]]
[[ "$(grep -c '^restart ' "$MOCK_LOG")" == 2 ]]
for file in "$HOME/eke/data/database" "$HOME/eke/uploads/image" "$HOME/staging/app.jar"; do
  [[ "$(cat "$file")" == untouched ]]
done
echo 'Production unit guards, checksum, scoped restart and rollback passed.'
