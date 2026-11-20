# Local full-stack setup

Use the integration worktree `D:/eke-web/.worktrees/full-integration`. Do not run
against an existing shared H2 file. Java 21, Maven, Node 22+ and npm are required.
The retained Maven release target is Java 17; the real browser suite runs Java 21.

## Reproducible disposable check

From `Backend/ece-website`: `mvn.cmd -B -ntp verify` (Linux: `bash ./mvnw -B -ntp verify`).
From `Frontend/ece-website`:

```powershell
npm ci
npm run lint
npm run typecheck
npm run build
npm test
node scripts/full-stack-qa.mjs
```

On Linux first run `npx playwright install --with-deps chromium`. Windows uses
installed Microsoft Edge. The full-stack script creates random local credentials
and a signing key in memory, uses loopback ports and a fresh temporary **file** H2
database, and starts the built JAR and exported frontend. It creates explicitly
labeled local test records, restarts with `ddl-auto=validate`, verifies persistence,
and removes its temporary database/uploads. It does not accept remote targets or
read staging/production credentials. Example.org application URLs are test fixtures;
the test checks their hrefs without submitting applications or visiting them.
No email is sent. Screenshots are under `Frontend/ece-website/test-results/full-stack`.

## Persistent local editing session

Build first. Create a new empty, ignored local runtime directory, e.g.
`Backend/ece-website/target/local-runtime`, then start the JAR with that directory
as the working directory. Configure these **process-local** variables:

| Variable | Local value / requirement |
| --- | --- |
| SERVER_ADDRESS / SERVER_PORT | `127.0.0.1` / `18081` |
| SPRING_DATASOURCE_URL | `jdbc:h2:file:./data/local` (fresh local directory only) |
| SPRING_DATASOURCE_USERNAME / PASSWORD | Your local-only database credentials |
| SPRING_JPA_HIBERNATE_DDL_AUTO | `create` for the first empty local database only; **validate on every subsequent start** |
| SPRING_H2_CONSOLE_ENABLED | `false` |
| APP_JWT_SECRET | Base64 of at least 32 cryptographically random bytes; keep stable across local restarts |
| APP_AUTH_COOKIE_SECURE | `false` for loopback HTTP only |
| APP_BOOTSTRAP_ADMIN_USERNAME | Your chosen trusted local administrator |
| APP_BOOTSTRAP_ADMIN_PASSWORD | Unique local password, 12–72 characters |
| MAIL_PASSWORD | Local placeholder required by existing configuration; do not invoke messages POST |

Generate the signing key directly into a process environment variable, never into
a tracked file. For example in PowerShell:

```powershell
$keyBytes = [byte[]]::new(48)
[System.Security.Cryptography.RandomNumberGenerator]::Fill($keyBytes)
$env:APP_JWT_SECRET = [Convert]::ToBase64String($keyBytes)
```

Bootstrap runs only when no ADMIN exists. Remove bootstrap credentials from the
process environment after provisioning. It never replaces or repairs an existing
account. Keep the JWT key private; do not document or print it.

From the frontend directory, set `API_PROXY_TARGET=http://127.0.0.1:18081` and run
`npm run dev`, or `npm start` after a build. Open `http://127.0.0.1:3100/login/`.
All browser API calls remain same-origin under `/api`; no localStorage JWTs.

Create News as Draft, save, reload the editor, then explicitly Publish now or
Schedule and Save changes. Projects retain UUIDs and existing files when file
inputs are omitted. Opportunities and Training default to Unpublished; publication
and availability are separate. Deadlines use browser-local editor time converted
to UTC. Expired registration always closes. Do not populate unknown grant, partner,
application or registration data with guesses.

## Detail routes and publishing

The checked `src/content/route-manifest.json` contains **slugs only**, never article
content. Initially only the `unavailable` test/missing-state shell is included.
After creating public local records:

```powershell
$env:ROUTE_MANIFEST_API = 'http://127.0.0.1:18081/api'
node scripts/refresh-route-manifest.mjs
npm run build
```

Inspect the manifest diff before committing it. CI builds offline from this file.
New or renamed slugs and newly eligible scheduled articles require manifest refresh
and rebuild. Listings show live data immediately but do not link to unexported
routes. Existing shells fetch current API data on load; unpublishing returns an
unavailable state and media becomes inaccessible. Unknown arbitrary URLs remain
static-server 404s. No SSR, catch-all proxy or silent fixture fallback is used.

To verify persistence manually, stop only your local backend process, restart from
the same runtime directory with `ddl-auto=validate`, sign in and reload all four
modules. Never attach a second JVM to the open H2 file.

Contact submission and email integration remain deferred and unchanged.
