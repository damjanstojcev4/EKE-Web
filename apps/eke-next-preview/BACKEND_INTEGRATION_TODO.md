# Public Projects: deferred integration

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
- Project Details is intentionally unavailable. Each record reserves a `/projects/<slug>` destination, exposed as `data-future-href`, without linking to an unimplemented route. Focus/hover notices explain the pending phase. Reconcile these provisional slugs with confirmed backend public identifiers later.
- No public API routes, fetches, mock servers, backend configuration, or Spring Boot modifications were introduced.

## Future phase checklist

1. Inspect and confirm the existing Spring Boot public listing and individual-project endpoints.
2. Confirm identifiers and field mappings; historical fields may include title, description, quick summary, budget, start/end dates, partners, status, image/PDF paths, and location.
3. Replace the mock dataset with database records only after visual approval.
4. Implement the separately approved Project Details design (Figma node `2498:465`) and enable its links.
5. Confirm ongoing/past/upcoming rules, ordering, and pagination against actual backend behavior.
6. Support original project images, attached PDFs, and appropriate image URL handling.
7. Verify that existing admin-created/edited projects appear publicly.
8. Add actual loading, empty, and error states.
9. Agree caching and revalidation behavior.
10. Enable View More only when real additional records and pagination behavior exist.

## Source and visual evidence

Reference: `design-reference/projects/reference.png` (copied from the supplied Downloads/Projects.png).
Original assets: `public/assets/projects-page/` (unchanged).
Browser screenshots, geometry, interaction checks, and the implementation report live in `design-reference/projects/`.
