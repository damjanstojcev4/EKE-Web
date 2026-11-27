# Tailwind Phase 1: source reconciliation

24 November 2026, Europe/Skopje. No deployments, backend edits, CMS writes or dependency upgrades performed.

## Verified baseline and root cause

Use **`dd76db4434f103cf8b7b93c20ccaea7190abd2e2`**, the fetched `origin/staging` tip. Do not start from local branch `staging` (still `ce555400`, 15 commits behind), `main`, or `fix/responsive-navigation-menu`.

The original checkout is `fix/responsive-navigation-menu` at `4aaf539670c62da0405722ea7fd330b188d81ef7`. Its merge base with staging is `ce555400c3411bd0265c101561b2a8503f6d1562`, before the CMS work. Both sides subsequently received frontend presentation changes; matching commit subjects do not imply matching trees. `git cherry origin/staging HEAD` finds only the navbar patch equivalent; the other two local patches are not patch-equivalent. Do not cherry-pick them over staging indiscriminately. Header, Footer and Privacy Policy source have no diff between audited HEAD and deployed HEAD, but globals and CMS-consuming pages do.

`git fetch origin` completed successfully and did not change the remote staging tip. `git worktree list --porcelain` showed an existing `codex/frontend-staging-update` worktree at deployed HEAD (with a generated next-env modification), alongside full-integration/news/admin/backend worktrees. Two old visualization-directory worktree registrations are prunable; none were pruned. The original dirty checkout was left unchanged: three workflow edits, next-env.d.ts, test-heading.html, test-results and untracked audit documents/artifacts. No stash/reset/checkout over existing work was used.

The missing implementation is merged, not lost:

| Evidence | Contribution |
|---|---|
| `cba8f9f3`, merge `49bb7d94` (#8) | Published homepage news backend |
| `16018a3c` | News administration/publishing |
| `6d9a41ef`, [PR #15](https://github.com/damjanstojcev4/EKE-Web/pull/15), merge `8c2715c12306762d1fc7b3951a1a324ebc390d4c` | Persisted news/projects/opportunities/training public integration and admin |
| `adef0b97`, [PR #16](https://github.com/damjanstojcev4/EKE-Web/pull/16), merge `7253afa1770e2afa7f000fb0b190c465e4e5feff` | Managed media encoding, content-driven layout and staging admin proxy fixes |
| `07dec02e`, `2aaf5fce`, `dd76db44` | Subsequent staging presentation/SEO/navigation updates |

GitHub API confirms #15 and #16 merged into staging. [Actions run 45292330641](https://github.com/damjanstojcev4/EKE-Web/actions/runs/45292330641) reports push on staging, head SHA `dd76db4434f103cf8b7b93c20ccaea7190abd2e2`, attempt 1, success; deployment safety, frontend, backend, real Spring/H2 browser checks and deploy jobs all succeeded.

The public release marker is `dd76db4434f103cf8b7b93c20ccaea7190abd2e2-45292330641-1`. This was **not assumed to be a SHA**: `deploy/release.sh` constructs `$GITHUB_SHA-$GITHUB_RUN_ID-$GITHUB_RUN_ATTEMPT`, writes `release-id.txt` into the frontend artifact, then activates it. The live marker and matching Actions metadata establish the mapping. This identifies the frontend release, not necessarily the running backend JAR: staging backend deployment is separately gated by `BACKEND_REQUESTED`/manual `deploy_backend` and can be skipped.

## Ownership and protected contracts

All active frontend modules are in **`Frontend/ece-website`**; no separate admin application directory exists in this baseline.

| Owner | Implementation / protected behavior |
|---|---|
| Public news | `src/app/news/page.tsx` → `components/news/PublicNewsList.tsx`: category selection resets page, `/api/news/public?page=N&size=12&category=...`, Previous/Next disabled boundaries; PublicArticle for detail |
| Homepage news | `components/home/NewsSection.tsx`, `/api/news/homepage` |
| Projects | `components/projects/ProjectsList.tsx`, ProjectCard, `project-details/PublicProject.tsx`; `/api/projects/public`, `/api/projects/slug/...`, status filtering and managed images |
| Opportunities/training | `components/SessionListings.tsx`; `/api/opportunities/public`, `/api/training/sessions`; lifecycle/deadline/application link rules |
| Public clients | `src/lib/api/{client,news,projects,sessions,use-api}.ts`, media path validation and route availability |
| Admin UI | `src/app/admin/{page,AdminDashboard,SessionAdmin,SupportingMedia}`, `admin.module.css`; news/projects/opportunities/training management |
| Login/session | `src/app/login`, `src/lib/admin-api.ts`: same-origin cookies, HttpOnly auth, `/auth/me` ADMIN check, authenticate/logout, CSRF token/header on mutations; no browser-storage credentials |
| SEO/static routes | `src/lib/seo*`, app metadata/robots/sitemap, `content/route-manifest.json`, `scripts/refresh-route-manifest.mjs`, normalize-export; do not refresh manifest during styling |
| Backend (read-only inspection) | `Backend/ece-website`: News/Project/Opportunity/TrainingSession controllers, services, repositories/entities; AuthController, JwtAuthFilter/SecurityConfig/JwtService own authentication/authorization |
| API hosting boundary (read-only) | Backend servlet `/api`; staging Nginx API routes/proxy/media configs in `deploy/staging`; local dev rewrites/static-preview loopback proxy. No infrastructure modifications authorized or made |

Production build still uses `output: export`, trailing slashes and unoptimized images. Development permits API rewrites; static preview uses `API_PROXY_TARGET` only for an explicitly configured loopback backend. Build does not automatically fetch slugs: committed route manifest currently contains only `unavailable` for news/projects. Publishing a new slug requires the existing explicit manifest refresh/review/rebuild workflow. This explains 404s for the audit's mock-data slug probes; do not add fallback routes during refactoring.

The old audit is historical inventory of an earlier tree. Staging adds admin/login CSS modules, existing Playwright config/specs, API components and different globals/project/opportunity/training styles. In particular, the earlier claim that no visual-test configuration exists must be narrowed: staging already has **behavioral** Playwright tests, but no approved screenshot assertion suite. Keep those tests. Backend/API integration belongs to the staging implementation even though the old checkout uses mock arrays.

## Screenshots and content-state reconciliation

The original 42 captures were made against the same release marker above, as recorded in `docs/tailwind-baseline/staging-findings.json`; source and capture release now match. They show actual staging, not local mock rendering. Privacy Policy route/CSS/Header/Footer match between source trees, making this the appropriate isolated pilot.

Fresh read-only public API checks: release marker unchanged; news list, homepage news, opportunities and training return HTTP 200 with zero published records; projects returns HTTP 200 with **17 records**. An empty Ongoing project view does not imply the project database is empty. Existing Past screenshots show populated cards. Historical screenshots did not archive API payloads, so exact historical record equality cannot be certified retrospectively. Freeze/version future public fixtures and associate their hashes with screenshots; do not treat a Git SHA as a CMS database snapshot.

Response SHA-256 at reconciliation time (raw response bytes):

- News page 0: `0e8536bdbdc87b44e72390fb1d47468559a572fe3eaa2fcdc8dc81e06855a906`
- Projects: `184b4af08095313e60158b237b4737fbd9ab6ab384e8e1bed55db8a6b5dae7d7`
- Empty arrays: `4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945`

Outstanding coverage for later feature migrations: populated news/categories/pagination/details, article sidebar/share, opportunities/training lifecycle/deadline states, CMS loading/errors/media failure, authenticated admin/login/logout/CSRF/permissions, file handling, and native select open popups. Use authorized local fixtures/existing tests; never create staging content merely for screenshots. Existing captures are representative, not a full integration acceptance suite.

## Isolated implementation preparation

Created **`codex/frontend-tailwind-phase1`** at the verified SHA in **`D:/eke-web/.worktrees/frontend-tailwind-phase1`**, with no push, merge or deployment. This includes the latest fetched staging CMS functionality. Preserve original checkout as historical audit context; use the new worktree for implementation.

Changes are limited to an additive theme import/unused exact-value aliases and opt-in visual tests. Tokens deliberately use `font-brand-*` rather than replacing Tailwind's default `font-sans`, avoiding implicit Preflight font changes. Existing `--u`, `--s`, hex variables, declarations, breakpoints and handlers are untouched. No Privacy Policy classes have been migrated.

The opt-in `playwright.visual.config.ts` uses separate port 3199, explicit desktop/tablet/mobile viewports, DPR 1, en-GB, Skopje timezone, reduced motion, light scheme and zero pixel tolerance. The Privacy Policy test blocks unexpected APIs, waits for fonts/images, checks overflow/broken images/browser errors, then compares full-page screenshots. Initial snapshots are exact copies of the actual staging privacy captures; do not use `--update-snapshots` to accept a mismatch without review. Windows Edge is the recorded 158.0.4370.33 baseline; for repeatability use that browser revision or a separately approved baseline per browser/OS. Linux Chromium requires its own approved snapshots.

Commands from the new frontend directory:

```powershell
npm ci --ignore-scripts
npm run build
npm run typecheck
npm run lint
npm run test:seo
npm run verify:seo
npx playwright test --config playwright.visual.config.ts
npm test
```

No network API or backend is required for the privacy screenshot test. Keep the existing full-stack QA for integration regression; the visual suite does not replace it. Do not update route manifests, dependency lockfiles, admin routes, public shell ancestry or deployment workflows in the pilot.

Pilot plan: first convert Privacy Policy ordinary text/spacing/layout utilities in a small PR; leave decorative SVG clipping/coordinates scoped; compare all three approved snapshots plus 700/701 and 1100/1101 responsive boundaries before removing any replaced declaration. Keep header/footer/global migration out of that PR.

## Validation and decision

- Exact-lock dependency installation completed; package.json/package-lock.json unchanged.
- Static production build and postbuild normalization passed, exporting admin/login/public pages plus the two manifest-controlled `unavailable` detail routes.
- Typecheck and lint passed; four SEO unit tests passed; export SEO verification passed across 13 pages in staging mode.
- **Three visual tests passed with zero changed pixels against the original staging screenshots.** No snapshot regeneration or tolerance relaxation was used. This verifies that the additive tokens do not change Privacy Policy presentation at the three representative viewports.
- **All 16 existing Playwright integration tests passed**, including editor publication flows, pagination, project mapping, session lifecycle, API failure handling, media URL validation and long-content layouts. These use local fixtures, not authenticated staging mutations. No fresh Java/full-stack backend test run was needed for this frontend-only preparation; earlier CI success is recorded separately above.
- `git diff --check` passed. Generated next-env.d.ts changes in the new worktree were restored to its initial content. Original worktree modifications remain untouched. No push, PR, commit or automatic deployment occurred.

**GO for the isolated Privacy Policy migration pilot** on `codex/frontend-tailwind-phase1` at the verified baseline. Source reconciliation is complete and screenshot testing uses the correct deployed-source revision. Actual class conversion remains future work, including boundary checks before CSS removal. **NO-GO for broad page/admin/CMS visual migration** until the outstanding states above have approved baselines. Historical exact CMS payload equality is not retrospectively provable, but does not block this static, API-free privacy pilot, whose three staging screenshots match exactly.
