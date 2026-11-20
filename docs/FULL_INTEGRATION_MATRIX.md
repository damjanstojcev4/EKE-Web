# Full integration audit and implementation plan

Baseline verified 2026-11-20: PR #14 is open/draft, head `16018a3c`, base
`78f863d1`. Integration branch `codex/full-stack-integration` starts at its head.
The root checkout's navigation edits are unrelated and remain untouched.

| Module | Existing backend | Missing fields/APIs | Frontend integration | Admin requirements | Tests |
| --- | --- | --- | --- | --- | --- |
| News | Long IDs, multipart CRUD, publication timestamps, private images, top-three feed | Unique slug, validated blocks, emphasis/introduction, hero, related references, paginated public lookup | Replace homepage/list/detail mocks; retain CSS and article renderer | Extend Phase 1 editor; retain scheduling and legacy protection | Lifecycle, uniqueness, pagination, malformed blocks, media privacy, migration |
| Projects | UUID CRUD, partners, status, image/PDF | Slug, programme/grant/countries/topics/sections/logo/resources, typed validation | Replace list/detail mocks; map ON_GOING/PAST | Extend current multipart editor; ADMIN authorization | CRUD, file types, UUID compatibility, migration |
| Opportunities | None | New persisted model, publication and deadline lifecycle, public/admin API | Replace calls only; retain explanatory paths | Add section in existing dashboard | CRUD, expiry, authorization, persistence |
| Training | None | Session model, registration/publication/availability API | Replace sessions only; retain themes and methods | Add section in existing dashboard | CRUD, expiry, authorization, persistence |

## Architecture and risks

- Existing manual additive H2 SQL migration process is retained. Rehearse against
  isolated legacy tables, run twice, and validate Hibernate; never migrate live data here.
- Static export uses a checked, content-free slug manifest. Build generates client
  shells; public data is fetched at runtime with no-store. Unpublication therefore
  removes article content even from existing exported routes. New slugs require an
  explicit manifest refresh, reviewed commit and rebuild; no arbitrary dynamic routes.
  CI never fetches staging to discover routes. Listings must explain unavailable routes.
- Preserve static About, Privacy, headers, decorative content, training themes and
  opportunity paths. Contact stays disabled and email behavior is untouched.
- Security gaps found: project writes accept any authenticated role; message GET and
  DELETE are public; CSRF currently protects only News. Correct narrowly and test.
- Uploads live below backend working-directory `uploads`, outside release directories
  under existing service configuration. News media remains visibility-checked.
- Deployment remains separately gated by backup, signing-key/account review, migration
  rehearsal, approved admin routing and passing CI. No production operations.

## Execution order

1. News model/API/editor/public slice and tests.
2. Projects model/API/editor/public slice and tests.
3. Opportunities, then training, using shared validated deadline conventions.
4. Cross-module real H2/browser/restart checks and dependency advisory review.
5. Documentation, feature-branch commit, staging PR/CI and activation checklist.
