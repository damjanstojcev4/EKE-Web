# Public Projects: deferred integration

## Training: deferred integration

- `/training` uses six typed, deterministic reference records in
  `src/data/training.mock.ts` and models in `src/types/training.ts`.
- Decide whether training themes, program descriptions, and sessions should be
  managed by the admin panel and whether programs and sessions need separate
  database records. Replace mock content with confirmed real records when required.
- Confirm schedules, dates, locations, capacity, and status rules. Current day
  counts, historical dates, zero spots, and the OPEN label reproduce the design
  snapshot; they must not be interpreted as live availability.
- Confirm whether registration is required, its eligibility/capacity rules, and
  the real registration destination. The OPEN control currently explains that
  registration is unavailable. Implement real registration only after business
  requirements are approved; no endpoint or fake success flow exists.
- LOAD MORE explains that all six supplied records are shown. Enable pagination
  only when additional content and the retrieval contract are available.
- Provide loading, empty, error, and missing-content states; define caching and
  content revalidation when integrating real data.
- Replace approved repeated photo/illustration placeholders with complete
  original exports when supplied. Missing original illustrations: AI & New
  Technologies, Environmental & Outdoor Education, Correctional Education,
  Specialized Learning, and Tailor-Made Training. These currently reuse the
  supplied inclusion illustration with user approval.
- CONTACT US reuses the existing contact URL convention. Finalize the public
  legacy-site origin in the deployment phase; no new contact route was invented.
- No backend, admin panel, authentication, database, or production infrastructure
  changes were made in this phase.

## Opportunities: deferred integration

- `/opportunities` uses typed reference records in `src/data/opportunities.mock.ts`; no backend calls or endpoints.
- Determine how EKE will manage opportunities and whether admin CRUD is required.
- Replace local opportunity records with real data, with public listing and detail retrieval where needed.
- Map application links, deadlines, categories, images, and statuses. Apply buttons will point to the corresponding Project Details after integration; no destinations are invented in the preview.
- Handle expired opportunities appropriately; current counts and statuses intentionally reproduce the screenshot snapshot.
- Implement loading, empty, and error states; establish caching/revalidation rules.
- Approved asset substitution: Volunteering reuses the Internships photograph and illustration.

**Projects currently use mock data intentionally. Spring Boot integration is postponed until the public Projects and Project Details designs are approved.**

## Current presentation

- Route: `/projects`, `src/app/projects/page.tsx`.
- Typed project model: `src/types/project.ts`.
- Deterministic reference records: `src/data/projects.mock.ts`.
- Consumers: `src/components/projects/ProjectsList.tsx` and `ProjectCard.tsx`.
- Programme and output copy: `src/components/projects/content.ts`.
- Scoped layout: `src/app/projects/page.module.css`.
- Five records, in screenshot order: CRE-ACTIVE; Pathways for Change; The Missing Peace; DISERA; Stay Human!. All are completed in the reference.
- All Projects and Past show those five records. Ongoing shows an empty state. Status is explicitly stored, never inferred from today's date.
- View More Projects is intentionally unavailable: all supplied records are visible. Its focus/hover notice explains this limitation.
- Project Details uses `/projects/[slug]` and the same typed mock dataset. DISERA's card links to `/projects/disera`, with verified reference content. Other cards keep their pending notice; direct entry to their reserved routes shows an explicit content-pending state. Unknown slugs return 404. Reconcile local slugs with confirmed backend public identifiers later.
- No public API routes, fetches, mock servers, backend configuration, or Spring Boot modifications were introduced.

## Future phase checklist

1. Inspect and confirm the existing Spring Boot public listing and individual-project endpoints.
2. Confirm identifiers and field mappings; historical fields may include title, description, quick summary, budget, start/end dates, partners, status, image/PDF paths, and location.
3. Replace the mock dataset with database records only after visual approval.
4. Fetch individual project records from the existing Spring Boot backend using their actual public identifiers, mapping backend fields into the detail components. Replace temporary mock slugs or map them to stable backend identifiers.
5. Confirm ongoing/past/upcoming rules, ordering, and pagination against actual backend behavior.
6. Support original project images, attached PDFs, and appropriate image URL handling.
7. Verify that existing admin-created/edited projects appear publicly.
8. Add backend loading, error, and missing-project states (local unknown slugs already return 404).
9. Agree caching and revalidation behavior.
10. Enable View More only when real additional records and pagination behavior exist.

## Source and visual evidence

Reference: `design-reference/projects/reference.png` (copied from the supplied Downloads/Projects.png).
Original assets: `public/assets/projects-page/` (unchanged).
Browser screenshots, geometry, interaction checks, and the implementation report live in `design-reference/projects/`.

## Project Details reference and missing content

- Figma node `2498:465`, local screenshot `design-reference/project-details/reference.png`.
- Original details exports copied unchanged into `public/assets/project-details/`.
- The reference contains eight repetitions of a placeholder partner logo and the note “Ke ima 7-8 logoa max.” These are design placeholders, not verified partner identities.
- No project-card PDF was supplied. The Download PDF control is explicitly unavailable and explains why on focus/hover. Populate `details.documentUrl` only with a verified document.
- Other projects need verified detail copy and assets before enabling their listing links.
- Map project images and PDFs from backend records, ensure admin-created projects appear publicly, and define caching/revalidation before replacing mock data. No backend integration was implemented in this phase.
# News — Phase 7 (frontend only)

- `/news` renders nine deterministic article records and two media records from `src/data/news.mock.ts`, typed in `src/types/news.ts`. Preserve the listing's reference order and displayed dates; Homepage dates belong to a different design snapshot.
- Decide how News will be managed in the EKE admin panel; implement CRUD only once requirements are agreed.
- Define a News entity and public listing/individual-article endpoints, supporting stable slugs, titles, full content, publication dates, categories, images, and optional authors.
- Connect the listing and `/news/[slug]` to actual backend records. Phase 8 statically generates the verified Hungary article; the other eight known slugs show explicit content-pending pages. Unknown slugs return 404.
- Define publication/draft behavior, loading/empty/error states, caching and revalidation.
- Supply the remaining eight article bodies and confirm slugs before enabling their full details. Do not infer additional factual content from the summaries.
- Supply the chess podcast audio and conference recap video URLs. Playback is intentionally unavailable; controls disclose the missing sources.
- Supply additional media/story records before enabling the second and third carousel pages. No fabricated items, duplicate pages, or fake loading states exist.
- Replace approved temporary images for the podcast, Summer Youth Mobility, and APV with the original exports. Supply the original microphone, waveform and exact video-control artwork. The current video button reuses the existing original YouTube SVG as a temporary visual.
- Asset mapping, reserved slugs, verification evidence, and remaining visual differences: `design-reference/news/IMPLEMENTATION.md`.
- No Spring Boot, database, admin, API endpoint, authentication, or deployment changes were made.

## News Details — Phase 8 integration follow-up

1. Create or inspect the News backend data model and decide whether admin-managed publishing/CRUD is required.
2. Support titles, summaries, structured body content, images, dates, categories, and stable public identifiers/slugs.
3. Implement public listing and individual-article retrieval, then connect both pages to the same backend records.
4. Define draft/published behavior and missing, deleted, and unpublished-article responses.
5. Support image uploads and rich article content as needed; preserve safe typed rendering rather than arbitrary HTML.
6. Define caching/revalidation and loading, empty, and error behavior.
7. Supply verified full content for the eight pending articles. Hungary is the only article with verified details and is the only slug emitted by generateStaticParams. Pending pages currently use the existing Next server; pre-generate them or replace their links with pending controls if a pure static export is later configured.
8. Supply the original sharing icons and Summer Youth Mobility photograph. Sharing is omitted and the existing summer image is reused by explicit user approval. No share behavior is simulated.
9. Supply the Hungary project-details destination, the chess podcast destination, and additional Other News pages. The visible unavailable actions disclose these missing destinations/content.
10. The application email is transcribed from the local reference; no message is sent. Dates and deadlines preserve the historical design snapshot.

No backend, database, authentication, admin, API, deployment or production configuration changes were made. Evidence and route behavior are documented in design-reference/news-details/IMPLEMENTATION.md.

## Contact — Phase 9 integration deferred

The `/contact` form is frontend-only. It validates locally, preserves entered values, and explicitly states that nothing was sent. File selection stays in the browser; no upload occurs.

1. Inspect the existing Spring Boot contact controller.
2. Verify the actual request DTO, HTTP method, endpoint, and attachment support before mapping the preview fields.
3. Connect the Next.js form to the existing contact API; avoid a duplicate contact API.
4. Configure production-safe API access using the established environment configuration, without exposing secrets.
5. Verify CORS or same-origin proxy requirements.
6. Implement real submission loading states and prevent duplicate submissions.
7. Handle backend validation errors and associate them with the appropriate fields.
8. Handle network failures and timeouts gracefully.
9. Display a success message only after a confirmed successful API response.
10. Preserve user-entered form data on failure; reset only after confirmed success.
11. Add spam protection and request throttling as appropriate, including server-side attachment validation.
12. Confirm email delivery and notification behavior.
13. Test the form against a safe development environment.
14. Verify that submitted messages reach their intended destination.
15. Supply the verified destination for “Fill in partner information form”; the preview currently explains its unavailability.

Do not implement these integration items during Phase 9. No Spring Boot, PostgreSQL, SMTP, admin panel, API, or deployment changes are included.

## Privacy Policy — Phase 10 verification deferred

Status: Pending client/legal approval. See `PRIVACY_POLICY_REVIEW.md`. The policy reproduces the supplied design, not a verified inventory of live processing.

1. Inventory actual personal data collected by every deployed form, application flow, server log, and third-party integration.
2. Confirm Contact form recipients, email delivery, attachment handling/storage, access, and deletion before connecting the currently disabled submission.
3. Inspect actual analytics configuration, identifiers, consent dependencies, and whether any analytics are enabled.
4. Inventory cookies, embedded content, and third-party services; obtain approved cookie information and determine the actual settings/policy destination referred to in section 11.
5. Verify retention periods and deletion practices for messages, applications, files, logs, and backups.
6. Verify security measures, access controls, authorization, and operational responsibility for privacy requests.
7. Confirm processor/subprocessor arrangements, project-partner sharing, hosting locations, and any international transfers.
8. Reconcile the privacy-policy wording with real deployed functionality, minors' participation, consent practices, and rights-request processes.
9. Confirm the privacy mailbox (`info@ekebitola.org`) versus Contact's `contact@ekebitola.org`, organisational details, revision date, and final client/legal approval before public launch.

These are future verification tasks, not compliance claims. No backend, cookie tracking, analytics integration, data deletion workflow, authentication, database, or admin functionality was implemented in Phase 10.

### News sharing update — 2026-11-08

The six supplied sharing icons are implemented using the current article URL: Facebook, LinkedIn, X, WhatsApp, Pinterest and email. The earlier sharing-omission TODO is superseded for those controls. The original copy-link icon remains unavailable. No backend is required for these share links; no social post or email was sent during verification.
