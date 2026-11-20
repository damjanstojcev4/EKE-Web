# Staging integration activation — NOT EXECUTED

Target demonstration: November 21, 2026. Production is excluded.

## Required evidence before activation

- Reviewed staging PR preserving PR #14; all CI jobs, including real H2/browser,
  green for the exact proposed commit.
- Operator-verified staging database **and uploads** backup, with checksums and a
  successful restore rehearsal on an isolated copy using H2 2.3.232.
- Staging-only private `APP_JWT_SECRET`, secure cookies, trusted administrator-account
  review, H2 console disabled, and `ddl-auto=validate`.
- Separately approved authenticated admin routing or private operator access path.
  Public-read NGINX routing intentionally strips cookies and Authorization.
- Approved maintenance window and tested rollback plan. No second JVM may open the
  running staging database. No production files, credentials or units are involved.

These prerequisites have not been evidenced in this task. No live migration,
NGINX installation, service restart, merge or deployment has been performed.

## Migration sequence

Retain the existing manual, additive migration process. On the **offline backup
rehearsal** first, run in order:

1. `001-news-publication.sql` (idempotent existing migration).
2. `002-news-details.sql`: nullable details/media/placement fields, deterministic
   `news-<id>` slug backfill and unique index. Publication state is untouched.
3. `003-project-details.sql`: nullable metadata and media-reference JSON, deterministic
   `project-<uuid>` slugs and unique index. IDs/UUIDs/partners/files remain unchanged.
4. `004-opportunities-training.sql`: new tables, unique slugs, public-list indexes
   and optional Opportunity → Project UUID foreign key. **No seed data**.

Repeat scripts on the rehearsal copy, validate with the new entities, and compare
row IDs/counts, publication flags, partner associations and file checksums. Automated
legacy-schema rehearsals do this on isolated H2; they do not replace rehearsal on
the actual staging backup. If staging has conflicting/partial schema changes,
stop the migration and investigate rather than enabling Hibernate update.

Only after authorization: stop **eke-staging-backend.service**, copy the closed
`/srv/eke-staging-backend/data/mydb.mv.db` and staging uploads to restricted backup
storage, verify them, apply the rehearsed scripts under the staging runtime account.
Use the interactive H2 Shell procedure in `deploy/staging/migrations/README.md`;
do not place passwords in shell arguments. Never use `/root/eke/data`.

## Rollout ordering and route generation

The new frontend requires new APIs. **Activate the migrated backend before exposing
the integrated frontend**. The existing workflow activates backend and frontend
in its guarded release operation when `deploy_backend=true`; do not merge this
frontend into staging and let an automatic frontend-only deployment race ahead of
backend readiness. An operator must arrange the existing staging gates/approval
window before the merge. If those gates cannot safely provide this order, leave
the PR unmerged and prepare a reviewed backend-first release through the same workflow.

1. Record current frontend/backend release IDs and backend source ID read-only at
   execution time; Phase 1 recorded `78f863d1…-44521998880-1`, but that is not a fresh
   observation in this task.
2. Confirm backups, accounts/key, migration rehearsal and admin-access arrangement.
3. Review/install only the public-read allowlist changes in
   `deploy/staging/nginx.conf.example`. It allows News public/homepage/slug/related
   reads, project list/recent/UUID/slug, opportunities public/slug, training
   sessions/slug and single-file media. No blanket `/api/` proxy. Keep News media
   behind Spring, never a filesystem alias. Run `nginx -t` before authorized reload.
4. Merge only through the staging PR after the rollout ordering is arranged.
5. Run **Deploy staging** on `staging`, explicitly `deploy_backend=true`, with
   existing `STAGING_PIPELINE_ENABLED`, `STAGING_INFRA_READY`, and
   `STAGING_BACKEND_ENABLED` gates and environment approvals satisfied. No ad hoc JAR.
6. After the APIs are available and verified content is explicitly published, refresh
   the slug manifest from `https://preview.ekebitola.org/api`, review its slug-only
   diff, and rebuild via a subsequent staging PR/workflow. Until then, live listings
   work but new detail links state that they await the next site update. Scheduled
   content needs this explicit refresh after it becomes public.

## Post-activation checks

Record actual results and identities. Check frontend `/release-id.txt`, backend
service/current/source-id, loopback port 18081, public homepage/list/detail routes,
private draft detail/media rejection, each published module and uploaded PDFs.
Use the approved private admin path to verify login, CSRF, ADMIN-only writes,
create/edit/publish/unpublish and persistence after an authorized staging restart.
Check generated deep links and refresh at desktop/mobile widths. Do not touch the
legacy articles' publication state without editorial instruction.

## Rollback

Release scripts restore release pointers on activation/health failure. A JAR rollback
does **not** undo schema migrations or restore data/uploads. Extra nullable columns
are additive, but old binaries may expose drafts or have weaker authorization.
Do not roll back across the Phase 1 security boundary. Preserve a separate copy of
the failed current state; if data restoration is required, stop only staging,
restore the verified closed database and matching uploads as a consistent pair,
restore staging ownership/permissions, validate against the selected compatible
JAR, then activate through the established approved process. Record lost writes
since the backup before approving restoration. Production remains untouched.
