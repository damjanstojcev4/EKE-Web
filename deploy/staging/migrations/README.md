# Staging H2 news migration

`001-news-publication.sql` adds five nullable columns and an index to the existing
`news` table. It preserves all current values. A null `published` identifies a
legacy item. Phase 1 hides legacy items from every anonymous News read and
News image request until an editor explicitly prepares and publishes them.
Authenticated administrators retain access to all rows. See
`docs/NEWS_PHASE1.md` for the feature audit and release checklist.

1. Confirm that staging uses an isolated service, writable uploads directory, and
   H2 file database. Confirm the unit and JDBC URL against the staging
   environment. Verify that production restarts are scoped to the production
   unit and keep staging backend activation disabled during preparation.
2. Rehearse on a copy of the staging database using the same H2 version. When
   staging maintenance is authorized, stop only `eke-staging-backend.service`
   before copying the database. Back up the closed staging database (typically
   `mydb.mv.db`) and uploads to a restricted location and verify the backup.
3. Run the SQL with H2 2.3.232, the version bundled in this staging build. Open
   H2 Shell as `eke-staging-backend`, using the configured database user and entering the
   password interactively. Make the reviewed migration and matching H2 JAR
   readable to that account before running these commands.

   ```bash
   sudo -u eke-staging-backend /usr/bin/java -cp /path/to/h2-2.3.232.jar org.h2.tools.Shell
   ```

   At the prompts, enter
   `jdbc:h2:file:/srv/eke-staging-backend/data/mydb;IFEXISTS=TRUE` as the URL,
   accept the detected H2 driver, and enter the staging username and password.
   Record the legacy row count, apply the migration, and verify the count.

   ```sql
   SELECT COUNT(*) FROM news;
   RUNSCRIPT FROM '/path/to/001-news-publication.sql';
   SELECT COUNT(*) FROM news;
   ```

   A missing `news` table or unreadable database requires investigation before
   proceeding. Confirm the database's H2 version on the backup before migrating.
4. Keep `ddl-auto=validate`. Start only the staging service through the approved
   release process. Check that schema validation passes, legacy rows and images
   remain available to authenticated administrators, and the homepage feed admits only complete, published records
   whose publication time has arrived. Proxy `/api/uploads/news/` through Spring
   so it can enforce visibility.
5. If validation fails, keep staging offline while investigating. The additive
   columns are compatible with the prior backend, but that version can expose
   drafts created by the new version. If rolling back after new writes, restore
   the pre-migration database snapshot before using the prior backend. Preserve
   a separate copy of the current data before restoration.

## Fresh staging database

For a first install with no staging database, initialize the schema from the
reviewed staging JAR instead of applying the legacy-table migration. With
separate VPS preparation approval, put that JAR at a staging-only bootstrap
path readable by `eke-staging-backend`. Keep the bootstrap JAR and its parent
directory writable only by the operator. Confirm the staging unit is stopped, check that
both the H2 file and its symlink path are absent, and confirm the staging env
file contains the intended credentials. Run the bootstrap as an isolated
transient service. The explicit JDBC override allows file creation only at the
staging path and the private network keeps the temporary web listener isolated.

```bash
sudo test ! -e /srv/eke-staging-backend/data/mydb.mv.db &&
sudo test ! -L /srv/eke-staging-backend/data/mydb.mv.db &&
sudo systemd-run --unit=eke-staging-schema-bootstrap \
  -p User=eke-staging-backend -p Group=eke-staging-backend \
  -p WorkingDirectory=/srv/eke-staging-backend \
  -p EnvironmentFile=/etc/eke-staging/backend.env \
  -p PrivateNetwork=yes -p ProtectHome=yes -p ProtectSystem=strict \
  -p ReadWritePaths=/srv/eke-staging-backend/data \
  /usr/bin/java -jar /srv/eke-staging-backend/bootstrap/app.jar \
  --server.port=0 --spring.jpa.hibernate.ddl-auto=create \
  --spring.datasource.url=jdbc:h2:file:/srv/eke-staging-backend/data/mydb
```

Check `journalctl -u eke-staging-schema-bootstrap` for successful startup and
schema creation. Stop only `eke-staging-schema-bootstrap.service` and confirm
the database file is closed, staging-owned and readable. The regular service
continues to use `IFEXISTS=TRUE` and `ddl-auto=validate`.

## Admin contract

The existing multipart routes still accept `shortDescription`, `instagramUrl`
and `image`. Admin requests continue to authenticate with the existing JWT
cookie or bearer token. Cookie-authenticated News mutations also require the
CSRF cookie and header returned by `GET /api/auth/csrf`. Existing admins can manage every record through the
same list, detail, and write routes. Anonymous account registration is disabled
because registration creates an administrator.

The new multipart fields are `title`, `category` (`LATEST_NEWS` or `OPEN_CALL`),
`imageAlt`, `publishedAt` (an ISO 8601 instant such as
`2026-11-17T09:00:00Z`), and `published`. New-format writes default to draft when
no state has been set. Every newly created row defaults to draft, including
older multipart clients that omit all five fields. An update preserves
omitted fields and the current image. Publishing needs a title, summary, category,
publication timestamp, and alt text when an image exists. Future publication times
are excluded from public reads until reached. The legacy Instagram URL field is
still accepted and stored on all writes. The reused admin workspace now exposes
the publication fields and controls; hosting its protected API routes requires
separate operator approval without widening the public read-only proxy rules.
