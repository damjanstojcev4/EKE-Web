# Next.js migration and staging

The permanent branching, CI/CD, environment setup and rollback runbook is now
[docs/CI_CD.md](docs/CI_CD.md). This document records migration-specific facts.

- The Next.js application lives in Frontend/ece-website; its static artifact is out/.
- Backend/ece-website remains the Spring Boot application.
- main still contains the live Vite application. Do not merge the migration into main
  until the controlled cutover procedure in the runbook is approved.
- feat/nextjs-migration is retained. Website images and content cleanup were preserved
  in 6b5ea09a before staging was created.
- ae98001f disabled the old feature-branch deployment before any preservation push.
- Existing stash f3392fc77dd4a0493f01524e0f50370982585fec is preserved.
- Local generated AGENTS.md and test-results were excluded from the website commit.
- apps/ was absent at the time of the CI/CD setup; no files there were modified.
- The old STAGING_DEPLOY_ENABLED flag and deploy/staging/deploy.sh are retired.
  Permanent staging uses a new activation gate and deploy/release.sh.

For local verification with Node 22: npm ci, npm run lint, npm run build,
then npm run typecheck from Frontend/ece-website. The build must precede
typecheck on a clean checkout to generate Next.js route types. npm start serves
out/ locally; Node is not required on the static hosting server.

Static export uses trailing slashes, local fonts and unoptimized images. Known
project/news slugs are generated; unknown slugs return 404. A future requirement
for request-time server rendering needs a separate deployment design.
