# Tailwind staging integration — 27 November 2026

Integrates the 12 existing migration commits from `a05431ad` through `c4487b53` into staging's `b6645c5a` baseline, preserving their history. Opportunities migration `f569ab67` and investigation `ae4aff77` are excluded. Existing backend, API, authentication, SMTP removal and n8n commits are preserved without replaying them. No production workflow or backend change is included.

Contact merge resolution retains Tailwind classes while preserving the same-origin `/api/enquiries` multipart contract, `partner_opportunity` and `documentation` field names, single-file validation, success/reset behavior, error/retry behavior, busy/disabled state and duplicate-submit guard. Browser coverage retains the three staging contact tests and adds validation/file-size boundary and duplicate-submit/Opportunities-radio coverage. The radio value is an existing contact field, not the excluded Opportunities migration.

Validation on the combined candidate:

- Clean lockfile install, ESLint, TypeScript and optimized Next.js static export passed.
- Four SEO unit tests and exported metadata/robots/sitemap verification across 13 staging pages passed.
- All 21 browser integration tests passed, including five Contact tests. n8n requests are intercepted; no live submission was sent.
- Maven verify passed: 16 tests, zero failures/errors/skips. Local Java 21 compiled the Java 17 target; CI also exercises its configured runtime.
- Real local editor/API/browser full-stack checks passed, including CSRF, publication/media privacy, generated routes, responsive layouts and temporary H2 restart persistence.
- Deployment syntax/guard tests passed. Linux activation fixtures remain a GitHub Actions check because the local host is Windows.
- Privacy screenshots passed 3/3 at zero tolerance using the retained approved Edge `158.0.4370.33`, Intel UHD/GaneshGL profile. Original assertions, renderer guard, references and thresholds are unchanged; only a temporary local config selected the retained executable and was removed afterward.
- Existing Training visual matrix captured 78 cases using the same approved renderer: 77/78 exact, zero computed-style/behavior differences, unchanged fixtures/requests/media and zero application errors. The command exits nonzero and that result is retained. `1440-populated` produces SHA-256 `9effb9f9a07253adf28347387faa280a98ab3411b997293d296ed75f04e401ec` instead of accepted `74d688792b1cec0c935e2cef742e3a1a7b181896933ce151adea8c987706d424`. This is exactly the previously recorded unchanged-source alternate in the excluded branch's visual investigation, not a newly introduced application regression. Training source, shared session renderer, globals and theme match `c4487b53`. No alternate reference was accepted, no assertion was weakened and no screenshot was replaced.

The Training command used `docs/project-detail-edge.cjs docs/training-signoff-matrix.cjs after --offline --run=staging-integration-20261127`, writing fresh evidence to a unique ignored directory. The prior Opportunities NO-GO remains unchanged; it does not constitute approval or inclusion of Opportunities work. Historical broad visual results remain historical evidence rather than being relabeled as fresh full-suite passes.

Old backend drafts, root-worktree modifications, experimental untracked visual replay/network tooling, scratch files and generated build/test output are excluded.
