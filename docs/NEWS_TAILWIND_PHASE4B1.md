# News listing — Tailwind Phase 4B.1

Worktree: `D:\eke-web\.worktrees\frontend-tailwind-phase1`, branch `codex/frontend-tailwind-phase1`. Reference checkpoint: `120bd52dff3e298c56863d6c2d486d17ad342aaa`. Captured 24 November 2026 (Europe/Skopje). No deployment, dependency changes, backend changes or CMS writes.

## Scope and source analysis

`app/news/page.tsx` and `components/news/PublicNewsList.tsx` now use Tailwind v4 utilities. The route retains its metadata, structured data, Header/Footer, markup, text runs and section semantics. News-specific styling stays in the feature component, with a small set of named class strings for the two card layouts, copy typography and Read more link. There are no new production components or mock records.

The current CMS listing is not the obsolete static media/story gallery described by much of the original stylesheet. It renders a category select, API loading/error/empty state, a list of feature/row cards and Previous/Next pagination. The first card is always a feature. Later FEATURED/BIG_STORY cards use feature copy but retain the existing row-image selection. Only statically exported article slugs receive internal links; others retain the unavailable-page message. AUDIO/VIDEO records retain their existing external media links. These behaviors are preserved, including the existing narrow pagination controls and feature copy geometry; this phase does not redesign the populated UI.

The category select and empty/error/loading paragraphs inherit native/global styling: no feature-specific rules originally styled them. Their appearance, text, labels and state transitions remain unchanged. Global `--u`, the 700px global scaling boundary, native controls, font assets, inherited typography and focus/hover policies remain intact. Important margin utilities are necessary because the existing unlayered global heading/paragraph reset otherwise overrides Tailwind's utility layer. No global styles were modified.

Responsive queries retain the inclusive **max-width:768px**, **769–1100px** and **min-width:1101px** ranges. The base heading widths remain base rules with mobile overrides, preserving the gaps between those explicit legacy queries as well. Exact `calc(... * var(--u))`, fixed mobile sizes, fractional line heights, translucent colors and blur values replace the original declarations. Brand colors use existing theme tokens. Decorative hero/statement/divider pseudo-elements use utilities too.

## CSS dependencies and counts

PostCSS declaration-node counts include all responsive overrides and count a shorthand as one declaration:

| Original News route module | Rules | Declarations |
|---|---:|---:|
| Before | 137 | 369 |
| After | 4 | 21 |
| Removed | 133 | 348 |

The listing imports no route CSS. The remaining four rules are unchanged `.pending`, `.pending button`, `.notice` and hover/focus/open notice visibility. `ArticleContent` on News/project detail pages still uses `PendingControl`, which imports this module. Those 21 declarations are retained as compatibility CSS because migrating article content/tooltips is outside this phase. None of the remaining rules style the listing. Unused static-gallery, audio/video-control and story rules have no remaining consumers; article detail components use their own separate module. [Source audit](news-baseline/source-audit.json) records exact counts, unchanged retained rules and hashes of protected sources.

## Baseline provenance and reproduction

The populated reference is a **pre-migration capture of the approved Git staging implementation at `120bd52d`**, using its existing production export before modifying the News source. It is not an appearance invented from the deployed empty page. `docs/news-check.cjs before` refuses an existing reference, requires that checkpoint and requires unchanged News sources. Do not rerun before mode against migrated code.

Windows Edge **158.0.4370.33**, Intel UHD driver **27.20.100.9664**, ANGLE/D3D11, **GaneshGL**, `--force_low_power_gpu`, DPR 1, en-GB, Europe/Skopje, light color scheme and reduced motion are pinned. The harness asserts the full browser/renderer/backend profile before reading references. It fails on unavailable/drifted environments and never substitutes a software renderer. Existing suites keep their separately approved profiles unchanged.

The live `/api/news/public?page=0&size=12` response is read from `https://preview.ekebitola.org`, asserted successful and empty, and relayed unchanged to the local listing for its empty state. The complete response is retained in the manifest and compared after migration. All other News responses are isolated Playwright route fixtures. Six representative records cover both categories, ordinary rows, later FEATURED/BIG_STORY records, audio/video, a missing image, emphasis, a known exported slug and unavailable slugs. Fixture pagination supplies a deterministic second-page response; no real CMS records are created. API routes require GET and size 12. Selecting a category resets the page; Previous/Next disabled states, text, links and keyboard traversal are asserted/recorded.

The 42-state matrix comprises empty and populated captures at **1440, 820, 390, 700, 701, 768, 769, 1100 and 1101px**, plus eight interaction states at 1440/820/390: category focus, category selection, page two, category reset, link hover, keyboard link focus, error and loading. Capture heights are 1000px, tablet 1180px and mobile 844px. Fonts/images are ready before full-page capture. Each capture also records normal and `::before` computed properties for every main element, semantic text/links, disabled controls, category value and focused element. No masks, retries, tolerance increases or replacement references are used.

Compressed manifests retain original computed values, API response and PNG SHA-256 values; PNGs remain local ignored review artifacts beside the manifests. A SHA-256 match requires byte-identical PNGs and therefore zero changed pixels. Committed references allow strict reproduction without storing duplicate large PNGs.

## Verification

Final results are recorded in [News comparisons](news-baseline/after/comparison.json), [source audit](news-baseline/source-audit.json) and [prior-suite results](news-baseline/regression.json). The first migration comparison exposed the global margin-layer precedence and right-border reset; the next matched all 42 PNGs and exposed an invisible second/last-row max-width precedence difference. The final implementation uses nonconflicting base and responsive limits. Original references were never changed to resolve these findings.

The initial broader run reproduced the already documented NVIDIA Contact photo raster finding: one blue-channel level at `(1273,637)` in `1440-download-focus`, with identical computed styles and behavior. A later full run reproduced the already documented Shared UI tablet About portrait finding: one pixel differing by at most two channel levels. [Initial Contact evidence](news-baseline/initial-contact-finding.json), [measured intermediate pixels](news-baseline/intermediate-raster.json), [intermediate results](news-baseline/intermediate-regression.json) and [Shared UI intermediate comparison](news-baseline/intermediate-shared-routes.json) are retained. These are not accepted tolerances. The source audit also verifies unchanged Contact sources. The affected suites are rerun serially with their original profiles; successful final comparisons must still be exact. Their behavior matches the previously documented findings in `CONTACT_TAILWIND_PHASE4A.md` and `PRIVACY_VISUAL_REGRESSION_RESOLUTION.md`.

**Final accepted results:** the complete 59-capture Contact NVIDIA rerun and complete 324-capture Shared UI rerun subsequently match their original PNGs exactly. No additional source/configuration changes, snapshot replacements, masks or tolerance changes were made between these runs. There is no outstanding visual failure at this checkpoint; the earlier failures remain recorded as renderer reproducibility limitations.

| Required check | Final result |
|---|---|
| News empty/populated/responsive/interaction matrix | **42/42 byte-identical PNGs**, zero computed-style or behavior differences; live API response and request sequence unchanged |
| Approved Privacy screenshots | **3/3**, zero changed pixels; original renderer guard, hover and focus pass |
| Privacy breakpoint pilot | **7/7**, PNG/style/hover/focus records identical |
| Shared UI real-CMS route/state matrix | **324/324**, zero changed PNGs/style differences; API hashes and staging release unchanged |
| Shared gallery and native controls | **96/96 + 88/88**, zero PNG/style differences; keyboard activation passes |
| Contact software and NVIDIA profiles | **59/59 + 59/59**, zero PNG/style/behavior differences; no API/write attempts or browser errors |
| Existing integration tests | **18/18 passed** |
| Production build, ESLint, TypeScript | **Passed** |
| SEO unit and export verification | **4/4 passed**, metadata/robots/sitemap verified across **13 exported staging-mode pages** |
| Source audit / helper syntax / whitespace | **Passed** |

This is **671 primary visual comparisons** (42 News + the previous 629), plus the seven-width Privacy pilot. Existing non-fatal module-type/terminal-color warnings remain unchanged. Final source is frozen before the accepted browser runs; generated existing-suite outputs are restored after copying compact comparison evidence into `news-baseline/prior-comparisons`, keeping this checkpoint scoped. No original reference is modified. Stop after News listing; detail-page, Header/Footer, unrelated-page and CMS changes remain outside this checkpoint.

Run from the frontend directory:

```powershell
npm run build
npm run lint
npm run typecheck
npm run test:seo
npm run verify:seo
```

After the build, from the worktree root, run browser jobs serially:

```powershell
node docs/news-check.cjs after
node docs/news-audit.cjs
node docs/news-regression.cjs
```

The regression runner executes Privacy screenshots and breakpoint comparisons, the 324 Shared UI real-CMS route/state comparisons, 96 shared gallery comparisons, 88 native control comparisons, both 59-capture Contact profiles and the existing integration tests. It records each exit code and keeps detailed logs locally. It never invokes baseline-update modes. News fixtures remain test-only; API endpoints/request formats, mapping, publication logic, filtering and pagination state handlers, routing, SEO and accessibility semantics remain unchanged.
