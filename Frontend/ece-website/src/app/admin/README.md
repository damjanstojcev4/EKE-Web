# Admin staging preview

Open `/admin`. The reference is the original production branch's `AdminPage.tsx`, `AddProjectsTab.tsx`, and `AddNewsTab.tsx` in `D:/eke-web`. Projects, news and messages retain the legacy workflow, styled with the preview's existing fonts, logo and navy/turquoise palette.

This is an isolated UI preview, with no authentication or API calls. Browser-local changes use `eke-admin-preview-v1` in localStorage and do not change the public pages. Project and news examples come from the existing preview datasets. Missing legacy values (budget, dates, partners, Instagram URL) remain blank rather than being invented. Messages have an explicit disconnected empty state. There is no simulated login or logout.

Image attachments are limited to 1 MB and PDF attachments to 2 MB. Files remain browser-local, and storage failures keep the form open. Deleting a record requires confirmation. Unsaved forms prompt before in-app navigation or cancellation.

Before live integration: connect existing authenticated project/news CRUD and messages endpoints, enforce authorization on the server, restore session expiry/logout behavior, map the legacy field names and multipart uploads, and replace browser storage with the backend. Do not use this preview as a protected admin system.

Validation: `npm run lint`, `npm run build`, `npm run typecheck`, then `node design/admin-qa.mjs` against the static export served by `npm start`. Set `ADMIN_QA_BASE_URL` to test another port. Edge is required for browser checks. Follow the repository feature branch → PR → staging workflow in `docs/CI_CD.md`.
