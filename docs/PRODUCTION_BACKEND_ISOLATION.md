# Production backend isolation on Rocky Linux

The old production workflow copied a jar to the deployment account's home
directory, replaced the jars under `~/eke`, stopped Java globally, and launched
`java -jar` from `~/eke` with output redirected to `application.log`. The
repository contains a service template for the future `/srv` layout. The service
and Java process on the VPS require operator verification.

The replacement streams the jar over SSH to `DEPLOY_USERNAME`, verifies its
checksum, and atomically installs `~/eke/app.jar` under a deployment lock. It
requires an active `eke-production-backend.service` with the same working
directory, `KillMode=control-group`, and no custom stop commands or dependent
units that would stop with production. It restarts that exact unit and retains
`app.jar.previous`. The unit keeps the current home directory, relative database
and uploads paths, and application log. Its working directory and Java binary
are set from the live installation. Staging must use its own unit and cgroup,
with no stop or restart dependency on production.
[systemd process termination documentation](https://www.freedesktop.org/software/systemd/man/latest/systemd.kill.html)

## Inspect the live state

Run on the VPS with the production operator. Select the PID by matching the
production reverse-proxy upstream port to its listener and the process's jar.
Keep the server output and any environment values private.

```bash
systemctl list-unit-files 'eke*'
systemctl show eke-production-backend.service \
  -p LoadState -p ActiveState -p MainPID -p WorkingDirectory -p ExecStart -p KillMode \
  -p ExecStop -p ExecStopPost -p ConsistsOf -p BoundBy -p PropagatesStopTo
systemctl cat eke-production-backend.service
sudo ss -ltnp
read -r -p 'Verified production listener PID: ' prod_pid
[[ "$prod_pid" =~ ^[1-9][0-9]*$ ]] && (( prod_pid > 1 )) || exit 1
ps -p "$prod_pid" -o user=,lstart=,args=
systemctl status "$prod_pid" --no-pager
sudo readlink -f "/proc/$prod_pid/cwd"
sudo readlink -f "/proc/$prod_pid/exe"
```

If the active unit already matches the workflow and runs `app.jar`, verify its
PID, environment, and API and keep it in place. If a different unit already
owns production, review its configuration and plan an exact-unit handoff
before proceeding. The direct-PID handoff below is for the legacy unmanaged
process. Pause if any path, account, port, or process is ambiguous.

## First handoff, after separate production approval

1. Reserve a maintenance window. Disable the old **Build Backend** workflow
   and wait for or cancel queued and running legacy deploys. Keep staging backend
   deployment disabled. Preserve the current jar and identify the Java executable
   and account. Confirm the process's actual working directory matches the
   configured SSH deployment account's `~/eke`. Confirm the existing API
   upstream and port.
2. On the VPS, from a reviewed checkout, install the template and substitute
   `@USER@`, `@WORKDIR@`, and `@JAVA@` with the verified account, absolute
   working directory, and Java executable. Compare the launch arguments and
   effective runtime configuration to the live process. Preserve the existing
   environment values exactly. If the old SSH login supplied app settings,
   carry the same values into the template's root-only environment file
   using `sudoedit` before startup. Keep the verified database URL and port.

   ```bash
   sudo install -m 0644 deploy/legacy-production-backend.service.example \
     /etc/systemd/system/eke-production-backend.service
   sudoedit /etc/systemd/system/eke-production-backend.service
   # If needed, initialize the environment file without truncating an existing one.
   sudo touch /etc/eke-production-backend.env
   sudo chown root:root /etc/eke-production-backend.env
   sudo chmod 0600 /etc/eke-production-backend.env
   sudoedit /etc/eke-production-backend.env
   sudo systemd-analyze verify /etc/systemd/system/eke-production-backend.service
   sudo systemctl daemon-reload
   ```

   For a non-root deploy account, use `sudo visudo -f /etc/sudoers.d/eke-production-backend`
   to grant just the following rule, substituting the actual login name. Confirm
   the server's `systemctl` binary path matches the workflow.

   ```sudoers
   DEPLOY_USERNAME ALL=(root) NOPASSWD: /usr/bin/systemctl restart eke-production-backend.service
   ```

3. In the legacy production account's shell, retain the verified `prod_pid`
   and stage the current jar. Use the jar identified in step 1 and recheck the
   same PID immediately before signaling it. If an existing service owns the process,
   stop that verified unit during the reviewed handoff instead of sending a PID
   signal. Wait for the old listener to disappear and its H2 database to close
   before starting the new unit.

   ```bash
   [[ "$prod_pid" =~ ^[1-9][0-9]*$ ]] && (( prod_pid > 1 )) || exit 1
   cd "$HOME/eke" || exit 1
   workdir=$(pwd -P)
   read -r -p 'Verified absolute path to the running production jar: ' legacy_jar
   test -s "$legacy_jar" && test "$(dirname "$legacy_jar")" = "$workdir" || exit 1
   test "$(readlink -f "/proc/$prod_pid/cwd")" = "$workdir" || exit 1
   old_start=$(ps -p "$prod_pid" -o lstart=)
   java_bin=$(readlink -f "/proc/$prod_pid/exe")
   test -x "$java_bin" || exit 1
   handoff_dir=$(mktemp -d .backend-handoff.XXXXXXXXXX)
   cp -p -- "$legacy_jar" "$handoff_dir/app.jar" &&
     cp -p -- "$legacy_jar" "$handoff_dir/legacy.jar" || exit 1
   ps -p "$prod_pid" -o user=,lstart=,args=
   test -n "$old_start" && test "$(ps -p "$prod_pid" -o lstart=)" = "$old_start" &&
     test "$(readlink -f "/proc/$prod_pid/cwd")" = "$workdir" &&
     test "$(readlink -f "/proc/$prod_pid/exe")" = "$java_bin" || exit 1
   kill -TERM -- "$prod_pid" || exit 1
   for attempt in {1..60}; do
     if ! kill -0 "$prod_pid" 2>/dev/null; then break; fi
     sleep 1
   done
   if kill -0 "$prod_pid" 2>/dev/null; then echo 'Old process still active' >&2; exit 1; fi
   mv -fT -- "$handoff_dir/app.jar" app.jar || exit 1
   sudo systemctl start eke-production-backend.service || exit 1
   sudo systemctl status eke-production-backend.service --no-pager
   ```

   Verify the existing production API through Nginx, such as
   `curl -fsS 'https://<production-host>/api/projects/'`, and inspect
   `~/eke/application.log`. Systemd activity alone does not establish HTTP
   readiness. After verification, use `sudo systemctl enable eke-production-backend.service`.
4. Promote only the reviewed isolation change to `main` with explicit approval.
   Verify that the **Build Backend** workflow on `main` uses the dedicated unit
   before re-enabling it. Do not rerun old workflow revisions. Verify the first
   approved deployment and confirm the old global-stop path is retired before
   considering staging activation.

## Rollback

For an unsuccessful automated restart, the workflow restores the previous jar
and attempts one restart of the same production unit. If the workflow reports
success but the API fails, an operator can restore the last known-good jar from
the deployment account. Pause other deployments before rollback.

```bash
cd "$HOME/eke" || exit 1
(
  set -e
  flock -x 9
  test -s app.jar.previous
  restore=$(mktemp .backend-restore.XXXXXXXXXX)
  cp -p -- app.jar.previous "$restore"
  mv -fT -- "$restore" app.jar
  sudo /usr/bin/systemctl restart eke-production-backend.service
) 9>.backend-deploy.lock
```

For first-handoff failure, stop the new unit and confirm that it released the
old listener and database. If the original process was unmanaged, restart the
saved jar from the same working directory, original account and verified
runtime environment. Keep the old GitHub workflow disabled during recovery.
If the original process was managed by another unit, restore that verified unit
instead of launching Java by hand.

```bash
cd "$HOME/eke" || exit 1
read -r -p 'Verified original Java executable: ' java_bin
read -r -p 'Verified handoff backup path: ' legacy_backup
test -x "$java_bin" && test -s "$legacy_backup" || exit 1
sudo systemctl stop eke-production-backend.service || exit 1
sudo systemctl disable eke-production-backend.service
# Check the production port is free before running the next line.
sudo ss -ltnp
nohup "$java_bin" -jar "$legacy_backup" >>application.log 2>&1 &
```

Verify the production API and logs after either rollback. Startup still uses
the existing database and uploads paths. Application data/schema rollback, if
needed for another release, requires a separate reviewed backup and recovery.
