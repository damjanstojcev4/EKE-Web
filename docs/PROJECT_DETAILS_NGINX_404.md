# Project Details 404: graceful reload readiness

## Diagnosis (28 November 2026)

This fix branch starts at remote staging `da1d47ceca69bc5669a482e4e2b61686cd42bbe2`.
No frontend/backend/schema or Nginx routing change is necessary. PR #17 is retained.

The failed activation treated the return of `systemctl reload nginx` as proof that
new routing was serving requests, then made one immediate clean-detail request.
Nginx reload is asynchronous: old and new worker generations overlap. An old worker
still uses `location / { try_files $uri $uri/ =404; }`, with no arbitrary-slug
fallback. It returns HTTP 404 and serves the exported `/404.html`. This is an Nginx
routing decision with a static Next-generated error body, not a Spring Boot 404.
See [Nginx's documented graceful reload sequence](https://nginx.org/en/docs/control.html#reconfiguration).

### Historical evidence

- Access log: at **12:16:16 UTC / 13:16:16 Europe/Skopje**, GET
  `/projects/project-7a6f2db4-08ca-40ce-95ac-d8a7685c5f25/` returned **404, 9,344 bytes**.
- Error log: reload started at 12:16:16; old workers **358776/358777** did not begin
  graceful shutdown until 12:16:17. Immediate rollback started another reload then.
- No permissions, rewrite-cycle, missing-file or configuration-application error
  was recorded. SELinux is permissive.
- `nginx -T`: staging root is `/srv/eke-staging/current`; no alias, exact slug route,
  `^~ /projects/` prefix or conflicting regex shadows the proposed fallback.
- Retained export:
  `/srv/eke-staging/releases/da1d47ceca69bc5669a482e4e2b61686cd42bbe2-46143173537-1`.
  Its shell exists (17,831 bytes); every parent is traversable and user `nginx`
  can read it. The exported 404 page is exactly 9,344 bytes.
- News uses exported `/news/unavailable/index.html` through the ordinary static
  location; no separate News runtime or conflicting clean-URL rule exists.

The original response body and request worker PID were not captured. They cannot
be reconstructed from that access log. The controlled reproduction below identifies
the serving generation and body, rather than claiming a historical body hash.

### Native reproduction

Used the host's **Nginx 1.26.3**, the retained export, and a copy of the effective
staging HTTPS server's locations/root/index/error-page/API routing. Only the listener
was replaced with a private Unix socket and the root pointed directly at the retained
release. Live Nginx, its configuration, services, TCP ports and release pointers were
not changed. The disposable process was stopped after testing.

Before installing the fallback in this isolated configuration, the query route
returned **200** and the clean route **404**. Across five ordinary, unpaused reloads,
**55 of 60 immediate clean-route requests** still reached the instrumented old
generation and returned 404 after the reload command had already succeeded.
Those responses were the retained static 404 page:
`22996d57a3b50a81c4d8c5bfaf7cbe67168ee2ea389d85de4701fca2b41db436`.
Once new workers served requests, the original fallback passed unchanged.
Host evidence remains at `/tmp/eke-native-nginx-bb0dd1j7/{results.json,access.log,error.log}`.

All of these passed with the fallback fully active in isolation:

| Request | Result |
| --- | --- |
| `/projects/` | 200, exact listing export |
| `/projects/details/?slug=project-7a6f2db4-08ca-40ce-95ac-d8a7685c5f25` | 200, exact shell |
| `/projects/project-7a6f2db4-08ca-40ce-95ac-d8a7685c5f25/` | 200, exact shell |
| Same clean URL without trailing slash | 200, exact shell |
| `/projects/index.txt` | 200, exact RSC payload, not shell HTML |
| All 11 JS and 3 CSS files referenced by the shell | 200 |
| `/api/projects/public` | 200, real existing staging API |
| `/api/projects/slug/project-7a6f2db4-08ca-40ce-95ac-d8a7685c5f25` | 200, correct existing project |
| `/news/unavailable/` | 200, existing static News route |

The JavaScript preview passed because it has no asynchronous Nginx worker-generation
transition. Its static fallback simulation was correct, but it could not cover reload
readiness. Query URLs are valid without the fallback; switching listing URLs to queries
would avoid the symptom but unnecessarily discard the now-verified clean URL support.

## Minimal correction

- Keep `eke-staging-project-details.conf`, application code and database unchanged.
- Add the read-only `deploy/staging/check-project-details.py`: choose a real existing
  public slug; verify listing, clean URLs with/without slash, query URL, RSC payload,
  referenced JS/CSS and slug/list APIs. Require exact generated file bytes and two
  consecutive full successful checks; retry within a finite readiness window.
- Transfer this operator helper only with staging exports containing the shell,
  outside the public export. Invoke it inside the existing activation rollback trap.
  Production activation is unchanged. Persistent routing/content/API failure still
  fails activation and rolls back release pointers.
- Add `deploy/test-project-details-nginx.py` to the existing frontend CI job. It uses
  the actual build output and native Nginx on a Unix socket. It demonstrates query-200 /
  clean-404 without the fallback, then holds only its disposable master briefly to
  deterministically reproduce the old-worker window. The real readiness command must
  observe 404, wait, and pass the complete matrix after reload. Nothing is seeded in H2.
  CI extracts the Ubuntu Nginx binary without installing/starting a system service.
- Existing deployment regression tests verify that the helper is transferred and
  that a persistent readiness failure restores both frontend/backend pointers.

Final host checks passed in both modes: the real existing API completed readiness
on attempt 4; CI-style public fixtures completed on attempt 5. Both covered all 22
requests, including the generated shell's 11 JS / 3 CSS files and the existing
News export. Offline deployment/rollback tests passed, including no helper transfer
on the production path. Live staging pointers/configuration, production hashes,
`nginx -t`, and all three live services were checked unchanged after the tests.

## Run and activation instructions

Native regression (Linux; generated export and installed/extracted Nginx binary):

```sh
python3 deploy/test-project-details-nginx.py --export-root /path/to/out --nginx /usr/sbin/nginx
# Optional, read-only existing staging API while keeping the test listener isolated:
python3 deploy/test-project-details-nginx.py --export-root /path/to/retained/release \
  --api-origin http://127.0.0.1:18081 --evidence-dir /tmp/eke-nginx-evidence
bash deploy/test-release.sh
```

No activation, merge or deployment is authorized for this fix task. After separate
approval, follow the updated order in [the staging runbook](PROJECT_DETAILS_CMS_STAGING.md):
fresh backup/release recording, isolated candidate test, staging-only original Nginx
include + `nginx -t` + reload, then the existing workflow with `deploy_backend=true`.
The workflow's bounded detail readiness check replaces the immediate one-shot curl.
After any later reload, the same checker can be invoked manually against the active
export. It performs GET requests only; authenticated admin/CRUD remains with the user.

This correction changes deployment checks only, so no application rebuild or database
migration is needed for it. PR #17's previously rolled-back frontend and backend still
need to be reactivated together through the approved existing workflow. There are no
new running services, application servers, ports or deployment pipelines.

Rollback: the existing activation trap restores old release symlinks on failed readiness.
Also restore only the backed-up staging vhost/prior snippet, `nginx -t`, then reload.
Validate the restored release with bounded health probes. Retain H2/uploads in place;
do not restore a stale database or delete releases. The earlier backup and rollback
script remain at `/var/backups/eke-project-details-20261128T120438Z/`.
