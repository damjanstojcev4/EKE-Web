# Staging H2 news migration

`001-news-publication.sql` adds five nullable columns and an index to the existing
`news` table. It preserves all current values. A null `published` identifies a
legacy item. Legacy items stay visible through `GET /api/news` and
`GET /api/news/{id}` and are absent from `GET /api/news/homepage`.

1. Confirm that staging uses an isolated service, writable uploads directory, and
   H2 file database. Confirm the unit and JDBC URL against the staging
   environment. Resolve the shared-host `killall java` conflict and keep backend
   activation disabled until all staging prerequisites in `docs/CI_CD.md` are met.
2. Rehearse on a copy of the staging database using the same H2 version. When
   staging maintenance is authorized, stop only `eke-staging-backend.service`
   before copying the database. Back up the closed staging database (typically
   `mydb.mv.db`) and uploads to a restricted location and verify the backup.
3. Run the SQL file with H2's `org.h2.tools.RunScript` using the isolated staging
   JDBC URL and the staging service account, so ownership stays correct. Use
   H2's `IFEXISTS=TRUE` JDBC option to fail on a wrong database path. Use the
   configured staging credentials. Keep secrets out of logs and shell history.
   If the `news` table is missing, provision the existing schema before running
   this migration.
4. Keep `ddl-auto=validate`. Start only the staging service through the approved
   release process. Check that schema validation passes, legacy rows and images
   still load, and the homepage feed admits only complete, published records
   whose publication time has arrived. Proxy `/api/uploads/news/` through Spring
   so it can enforce visibility.
5. If validation fails, keep staging offline while investigating. The additive
   columns are compatible with the prior backend, but that version can expose
   drafts created by the new version. If rolling back after new writes, restore
   the pre-migration database snapshot before using the prior backend. Preserve
   a separate copy of the current data before restoration.

## Admin contract

The existing multipart routes still accept `shortDescription`, `instagramUrl`
and `image`. Admin requests continue to authenticate with the existing JWT
cookie or bearer token. Existing admins can manage every record through the
same list, detail, and write routes. Anonymous account registration is disabled
because registration creates an administrator.

The new multipart fields are `title`, `category` (`LATEST_NEWS` or `OPEN_CALL`),
`imageAlt`, `publishedAt` (an ISO 8601 instant such as
`2026-11-17T09:00:00Z`), and `published`. New-format writes default to draft when
no state has been set. Older clients may omit all five fields. An update preserves
omitted fields and the current image. Publishing needs a title, summary, category,
publication timestamp, and alt text when an image exists. Future publication times
are excluded from public reads until reached. The legacy Instagram URL field is
still accepted and stored on all writes. The existing admin UI needs these inputs
before editors can publish to the homepage through that UI.
