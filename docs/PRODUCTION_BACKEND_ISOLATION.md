# Production backend deployment

Production runs under `eke-production-backend.service` on Java 21, with
`WorkingDirectory=/root/eke`, JAR `/root/eke/app.jar`, and port 8080. GitHub's
**Build Backend** workflow builds on pull requests. Deployment requires a manual
run from `main`. The SSH helper replaces only the production JAR, restarts the
dedicated unit, and waits for HTTP 200 from the local API. If the restart or API
check fails, it restores `app.jar.previous` and retries the same unit once.

## Re-enable after merging

1. With **Build Backend** disabled, verify that the reviewed workflow and deploy
   helper are present on `main`. Check Actions for any queued or running legacy
   backend jobs and cancel those before enabling. Use a fresh workflow run for
   the first approved deployment because reruns can use an earlier revision.
2. From a trusted VPS console, inspect the effective production unit (including
   drop-ins), current Java command, listener, local API and recent backups.
   Review the start commands and dependency chain for actions affecting other
   units. Confirm the PID runs Java 21 with `-jar /root/eke/app.jar` (or a relative
   `app.jar` from `/root/eke`) and owns the port 8080 listener. The deploy login
   needs access to that directory and permission to restart the exact unit.
   Run the following read-only checks with sufficient privileges.

   ```bash
   unit=eke-production-backend.service
   systemctl is-enabled "$unit"
   systemctl is-active "$unit"
   systemctl cat "$unit"
   systemctl show "$unit" -p NeedDaemonReload -p WorkingDirectory -p KillMode \
     -p ExecStop -p ExecStopPost -p ConsistsOf -p BoundBy -p PropagatesStopTo \
     -p Conflicts -p ConflictedBy -p OnFailure -p OnSuccess
   pid=$(systemctl show -p MainPID --value "$unit")
   ps -p "$pid" -o args=
   readlink -f "/proc/$pid/cwd"
   "/proc/$pid/exe" -version
   ss -ltnp 'sport = :8080'
   test -f /root/eke/app.jar && test -s /root/eke/app.jar && test ! -L /root/eke/app.jar
   curl --noproxy '*' -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8080/projects/
   ```

   Expect `NeedDaemonReload=no`, `KillMode=control-group`, HTTP 200, and
   empty stop hooks and stop propagation fields. The default conflict with
   `shutdown.target` is allowed. Verify the public production API returns HTTP
   200 as well.
3. In **Settings → Secrets and variables → Actions**, confirm
   `DEPLOY_HOST`, `DEPLOY_USERNAME`, and `DEPLOY_SSH_KEY` target the production VPS.
   Add `DEPLOY_KNOWN_HOSTS` with the verified OpenSSH known-hosts line for
   `DEPLOY_HOST`. For example, if sshd serves its ED25519 key, read
   `/etc/ssh/ssh_host_ed25519_key.pub` from the trusted VPS console and use
   `<DEPLOY_HOST> ssh-ed25519 <public-key>`. Use the actual value of
   `DEPLOY_HOST` for the first field.
4. After separate approval to enable, open **Actions → Build Backend → Enable
   workflow**. If enablement is the only approved action, stop there.
5. After separate deployment approval, open **Actions → Build Backend → Run
   workflow**, select `main`, and start a new run. Watch **Build** and **Deploy**,
   then verify the public production API returns HTTP 200 and inspect the service
   journal with `journalctl -u eke-production-backend.service -n 100 --no-pager`.
   If deployment fails, check the rollback result and recheck the public API
   before running it again.
