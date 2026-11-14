# EKE pre-demo QA — 31 October 2026

Scope: `apps/eke-next-preview`, branch `feat/eke-next-redesign`. Production-mode testing with Microsoft Edge/Playwright on `http://127.0.0.1:3102`. Existing uncommitted work was preserved. The supplied brief ends at section 11, after the word “Inspect”.

## Fixes

| Priority | Verified problem | Correction |
|---|---|---|
| P1 | Homepage “the people behind the vision” heading extends outside mobile viewports at 390px and 320px. | Allow the exported text spans to wrap inside the existing mobile layout. |
| P1 | DISERA title extends outside the 320px viewport. | Allow long words to wrap in the existing mobile heading. |
| P1 | Opportunities title extends outside the 320px viewport. | Allow long words to wrap in the existing mobile heading. |
| P1 | Fresh browser visit logs a missing `/favicon.ico` resource. | Declare the existing original EKE logo SVG as the favicon. |

Only four application files changed during this QA: `src/app/globals.css`, `src/app/layout.tsx`, `src/app/projects/[slug]/page.module.css`, and `src/app/opportunities/page.module.css`. The desktop design, copy, assets and navigation destinations were preserved.

## Routes and demo boundaries

| Route | Actual state |
|---|---|
| `/` | Implemented homepage. |
| `/about` | Implemented, including `/about#team`. Governance documents are explicitly unavailable. |
| `/projects` | Implemented five-project listing with status filters. All five mock records are completed; Ongoing correctly displays an empty state. |
| `/projects/disera` | Implemented detail layout. Partner artwork/note and PDF remain placeholders. |
| `/opportunities` | Implemented layout with eight mock calls. Two APPLY controls are explicitly unavailable; six calls are closed. |
| `/homepage-preview` | Publicly accessible development/preview alias exporting the homepage; no current navigation links target it. Preserved. |
| `/projects/cre-active`, `/projects/pathways-for-change`, `/projects/the-missing-peace`, `/projects/stay-human` | Pending-content pages, not full details. For the demo, all five listing Project Details buttons now intentionally open DISERA, as requested after the audit. Each pending page has Back to Projects. |
| Unknown project slug | Expected 404. |

**Do not demonstrate these as finished workflows:**

- Training and News standalone pages do not exist. Their current menu/footer items go to `/#expertise` and `/#news`, respectively. These section anchors work; they are not separate pages.
- Contact and all contact/partnership/enquiry CTAs lead to the legacy frontend at `http://localhost:5173/contact`. This is outside the isolated Next.js demo.
- “View all news and resources” leads to `http://localhost:5173/resources`, also outside the demo.
- Privacy Policy is text without a destination. LinkedIn, X and YouTube icons likewise have no supplied destination; Facebook and Instagram are links.
- Governance downloads (Statute, Financial Reports, Policies, Annual Reports), View more projects, APPLY and the DISERA PDF are unavailable by design. No destinations or resources were invented.
- DISERA partners include the visible source note “Ke ima 7-8 logoa max.” and repeated placeholder artwork. Confirmed partner content is still needed.
- Opportunity countdowns, deadlines and statuses are fixed reference data, not a live availability feed. In particular, “closes 10 Oct” is already past on the demo date. The “Closing soonest first” label does not indicate an implemented sorting control.

## Verification

- Final result: no P0 defects found; the four fixes above are verified. All 60 route/viewport combinations return HTTP 200 and pass text/control geometry checks. 59 passed every check on the first final run. One `/about`/1440px logo request failed with browser `net::ERR_NO_BUFFER_SPACE`; that exact case passed in a fresh-browser recheck with every image loaded and no errors. The initial failure remains in `design/demo-qa/results.json`; the clean recheck is in `design/demo-qa-recheck/results.json`. This was not silently discarded or counted as a clean first run.
- All 19 discovered local link/fragment/resource destinations passed; seven external destinations were inventoried. No hydration exceptions or unhandled page errors were observed. The final matrix had no console warnings. The separate three-width interaction run passed with an empty homepage error log.
- `npm run lint`, `npm run typecheck`, and `npm run build` pass after the fixes.
- Production route matrix: all ten routes above, at widths 1920, 1440, 1024, 768, 390 and 320, with a 900px viewport height. See `design/demo-qa/results.json` for the final measured outcomes.
- The audit records HTTP status, console errors/warnings, unhandled page errors, failed requests, image loading, font status, horizontal overflow, clipped controls and text bounds. Native lazy images are scrolled into view and awaited.
- Menu open, Escape close, close-button action, focus return and released body scroll lock are checked across the route matrix.
- Separate interaction tests at 1440, 390 and 320 cover All/Ongoing/Past filters, correct DISERA destination, detail refresh, browser back/forward, home logo, About CTA, team anchor, modal keyboard focus, mobile-menu route selection, Opportunities refresh and unavailable-control feedback. Unknown slugs return 404.
- Every discovered unique local link destination and fragment is checked; the existing PIF PDF is requested directly. External destinations are inventoried, not verified online. These tests do not contact Figma or use a backend.
- Full-page screenshots are saved for the principal routes and preview alias at 1440, 390 and 320. Visual review supplements the geometry checks; pixel-perfect design comparison, exhaustive overlap detection, CLS profiling and real-device/cross-browser testing are not claimed.
- Browser preload warnings may appear for prefetched destination assets. They are recorded separately from application errors and do not justify changing the approved design or navigation.

Reproduce after a production build:

```powershell
npm run start -- --port 3102
# In another terminal, from this application directory:
node design/demo-qa.mjs
node design/demo-interactions.mjs
```

Evidence: `design/demo-qa/results.json`, `links.json`, `interactions.json`, and route screenshots. QA automation is in `design/demo-qa.mjs` and `design/demo-interactions.mjs`.

## Recommended demo flow

Home → Discover Our Story → About/team → Projects → All/Past/Ongoing filters → DISERA → browser Back → Opportunities layout. Use the menu and footer to navigate among implemented routes. The homepage PIF download is available; the DISERA PDF is not.

P2 follow-up: retain the previously known Projects spacing discrepancy for later, review placeholder copy and stale reference dates with content owners, and review harmless prefetch warnings if performance work is commissioned. No redesign or new pages were added. No production Vite app, backend, database, CI, Docker or Nginx changes; no deployment, merge, commit or push.
