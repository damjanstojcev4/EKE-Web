# EKE Next.js frontend

The redesigned frontend lives in Frontend/ece-website on feat/nextjs-migration. It replaces Vite on this branch only. Spring Boot is unchanged.

Use Node.js 22:

```powershell
cd D:\eke-web\Frontend\ece-website
npm ci
npm run dev
```

Development serves http://127.0.0.1:3100. For the static production preview, stop the dev server and run:

```powershell
npm run lint
npm run build
npm run typecheck
npm start
```

The static deployment artifact is out/. npm start is a loopback-only preview server, not a production service. Local fonts and application assets are in public/. All project/news slugs, including content-pending pages, are exported; unknown slugs return 404.

For route, asset and responsive smoke checks, run `node scripts/migration-qa.mjs` after building (requires installed Edge or Chrome). This checks 390px and 1440px viewports; it is not visual acceptance testing.

See ../../MIGRATION_STAGING.md for staging configuration, secrets, DNS, Nginx, TLS, production cutover and rollback. Deployment is disabled until explicitly configured. The old production workflow must be updated before merging.

The app retains its existing preview behavior: local datasets, pending content, and a contact form that does not submit. Read BACKEND_INTEGRATION_TODO.md and PRIVACY_POLICY_REVIEW.md before production approval. DEMO_QA_REPORT.md is historical source-app evidence, not current migration validation.

NEXT_PUBLIC_EXISTING_SITE_URL is an optional build-time value for the currently unused legacy-link helper; it defaults to localhost:5173. Never put secrets in public variables. No API integration or live backend configuration is added by this migration.
