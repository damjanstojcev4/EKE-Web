# Next.js migration and staging runbook

## Branch and preservation

Repository: D:\eke-web. Branch: feat/nextjs-migration, created from fetched origin/main.
Prior work on feat/eke-next-redesign is preserved in stash f3392fc77dd4a0493f01524e0f50370982585fec (tracked and untracked files). Do not pop it onto the migration branch. Restore with `git stash apply --index <hash>` only after switching back to its original branch with a clean working tree. Ignored build/dependency files left under apps/ were not moved or deleted.

## Structure

- Frontend/ece-website/: complete Next.js app (src, public, local fonts, package lock and configuration), replacing the tracked Vite app.
- Backend/: unchanged Spring Boot application.
- .github/workflows/backend.yaml: unchanged.
- .github/workflows/frontend.yaml: unchanged legacy production workflow; MUST be adapted before merge.
- .github/workflows/nextjs-staging.yml: feature-branch-only checks and optional staging deployment.
- deploy/staging/: deployment script and Nginx example; no live configuration was changed.

The original design-reference and design folders contain authoring/QA materials rather than application dependencies and were not copied. All src and public assets were copied. Historical QA and integration notes were retained for context, not as evidence of migration validation.

## Build and preview

Use Node.js 22, then from Frontend/ece-website run `npm ci`, `npm run lint`, `npm run build`, `npm run typecheck`. Build precedes typecheck so generated route types exist on a clean checkout. `npm start` serves the exported out directory locally at 127.0.0.1:3100 (PORT overrides this). `npm run dev` remains available.

Static export uses output: export, trailingSlash: true, and existing unoptimized images. All known project and news slugs are generated, including explicit content-pending pages. Unknown slugs return 404. The production artifact is out/, not dist/ or .next/. Node is needed only to build; Nginx serves the result without a runtime process or new port. Rebuild for content changes. Future request-time server features require reassessing this deployment strategy.

Reference: https://nextjs.org/docs/app/guides/static-exports

## Workflow safety and activation

The staging workflow runs only on pushes to feat/nextjs-migration, with an additional job branch guard. It uses Node 22, npm ci, lint, production export, typecheck and an uploaded artifact. Deployment additionally requires repository variable STAGING_DEPLOY_ENABLED=true and GitHub environment staging. Without the variable, validation and artifact upload still run.

Existing production workflows trigger pushes only on main and deploy only when github.ref is refs/heads/main. Their pull_request build triggers do not deploy PR refs. Neither existing workflow was edited. No backend paths should change in the migration commit. No production workflow was dispatched.

Before activation:

1. Confirm the staging host and actual subdomain (preview.eke.mk is the proposed name).
2. Create a dedicated unprivileged staging SSH user with no sudo or write access to production directories, backend files, or production configuration. Use a staging-specific key; never reuse production credentials.
3. Manually create /srv/eke-staging/releases as real directories (not symlinks), owned by that user and readable by Nginx. Ensure /srv/eke-staging/current, when present, belongs to this release tree. Do not point any production server block at this tree.
4. Create GitHub environment staging, restrict deployments to feat/nextjs-migration, and configure optional reviewers.
5. Set environment secrets STAGING_HOST, STAGING_USER, STAGING_SSH_KEY and STAGING_KNOWN_HOSTS. The latter must contain the host key verified out of band. SSH uses port 22; adapt the script explicitly if the confirmed staging host uses another port.
6. Optional repository variable STAGING_EXISTING_SITE_URL supplies NEXT_PUBLIC_EXISTING_SITE_URL at build time. The source's legacy-link helper currently has no callers; confirm its destination before using it. Public variables are not secrets. There are no backend credentials in the frontend.
7. Review/install the Nginx example as a separate server block; do not replace the production server block. Configure A (and AAAA only if available) for preview.eke.mk to the confirmed staging IP. No IP is assumed here.
8. Obtain a certificate covering only the staging hostname using the server's existing ACME approach, add a dedicated HTTPS block and HTTP redirect, test nginx configuration, and reload only after operator review. Add access control if the preview must be private; noindex is not authentication.
9. Set repository variable STAGING_DEPLOY_ENABLED=true only after the preceding checks, then push a reviewed migration commit to the feature branch.

Deployment uploads to /srv/eke-staging/releases/<commit>-<run>-<attempt> and atomically switches current after checking index.html. It never restarts a service or deletes old releases. Nginx must already be installed/configured. Roll back staging by atomically switching current to an existing validated release. Review disk usage and retain/reclaim staging releases manually. Repeated releases can invalidate requests for old chunk hashes in already-open browser tabs; reload after deployment.

Missing/unknown: actual staging host, IP, credentials, existing live Nginx/TLS setup, and GitHub environment/variable configuration. No remote infrastructure was inspected or modified. The workflow is prepared, not an activated deployment.

## API and functional limits

The migrated application is a design/client preview with local mock records. Contact validates locally and explicitly does not send; backend integration is pending. Preserve these honest states during staging. See Frontend/ece-website/BACKEND_INTEGRATION_TODO.md and PRIVACY_POLICY_REVIEW.md.

Do not connect staging forms to production writes or email without an explicit integration decision. Prefer an isolated staging API/database; if sharing a backend, establish safe read-only endpoints first. For browser API requests, use a confirmed HTTPS endpoint with narrowly scoped CORS, or a reviewed /api/ proxy in only the staging server block. No endpoint, port, CORS change, or backend credentials have been invented. The original backend and its deployment remain unchanged, but the redesigned frontend is not yet functionally integrated with it.

## Production cutover (NOT performed)

Do not merge this branch until these steps are complete:

1. Obtain client approval; finish backend/form integration, privacy review and real content verification. Remove preview metadata/noindex only for the approved production build, preserving staging noindex via Nginx.
2. Prepare a separate reviewed change to frontend.yaml: use the validated Next.js commands, package out/ instead of dist/, and replace destructive in-place production extraction with separately staged releases and a controlled atomic switch. Keep main-only deployment guards. Do not use the staging directory, account, key or secrets for production.
3. Disable/gate automatic production deployment while reviewing the cutover. The current legacy workflow expects dist/ and will not correctly deploy this app on a clean runner. Documentation alone does not make it merge-ready. Avoid merging before this is fixed.
4. Back up the currently deployed Vite artifact and capture the current production commit and Nginx configuration. Verify deep links, assets, API routes and admin access in the proposed production configuration. The redesigned app does not replace the existing admin/API integration automatically.
5. Run a fresh Node 22 CI build and staging acceptance checks; confirm the diff has no Backend/ or backend workflow changes. Merge and deploy only with explicit production approval.
6. Verify production routes, contact/API behavior and monitoring after the approved switch. Roll back by switching to the saved Vite release/configuration; a Git revert alone does not restore server files. Keep the old release until acceptance is complete.

## Migration validation

- npm ci completed; lint, production build/export and typecheck passed using Node 22.23.5.
- Windows-only postbuild normalization corrects Next 16.4 segment payload filenames to the slash-to-dot format used by the client. Linux exports are unchanged.
- 189 unchanged src/public files were hash-compared with the source; the news detail route was intentionally changed to export all known slugs.
- Backend/ and both existing production workflow files match origin/main exactly.
- Workflow YAML parses, deployment Bash syntax passes, and git diff --check passes.
- No secret-pattern matches were found in migrated application source/assets or new deployment files; only .env.example is included. No node_modules, .next, out, dist or secret environment files are staged.
- Browser smoke validation uses Edge/Chrome at 390px and 1440px, checks every exported HTML index, loaded images, local references, runtime errors, horizontal overflow and unknown-route 404 behavior. See final report for result. This does not replace manual visual/client acceptance or live Nginx/TLS/API validation.

Final browser result: PASS — 25 exported index pages (including the generated 404 index), 50 viewport checks, 172 local references, zero reported errors. Unknown project slug returned 404. Source-preserving whitespace cleanup was applied after the initial hash comparison. The final build includes automatic Windows payload normalization.
