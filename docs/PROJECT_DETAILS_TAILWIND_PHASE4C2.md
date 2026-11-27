# Project Details — Phase 4C.2

**Phase 4C.2 complete.** All **96 Detail cases** match the unchanged-source baseline exactly. All **899 prior visual cases plus the seven-width pilot** have exact accepted results, with preserved raster-transient findings and unchanged complete reruns documented below. Worktree `D:/eke-web/.worktrees/frontend-tailwind-phase1`, branch `codex/frontend-tailwind-phase1`; source baseline/checkpoint `81ae68bd`. Baselines were established on 24 November 2026; final verification completed on 26 November 2026 (Europe/Skopje).

## Audit and scope

The active route `src/app/projects/[slug]/page.tsx` supplies metadata, `dynamicParams=false`, manifest-backed static parameters and the slug prop to the client `PublicProject`. **PublicProject was the only consumer** of the route stylesheet. Its active UI includes metadata rows, topics, summary/logo, shared rich content, partner names/media, PDF/resources, loading and error states, Header and Footer. The [complete selector inventory and source audit](project-detail-baseline/source-audit.json) record all 109 original rule selectors and their media conditions.

Project Details does not share the retained Listing feature stylesheet. `ProjectImage` has no importer in the current source; its existing error/event fallback remains byte-identical. PublicProject uses ordinary `<img>` elements for logos/partner media, so its broken-media behavior is the existing native image/alt rendering. It does not render the record's cover-image fields. No dormant component, cover view or fallback was introduced into production. `ArticleContent`, its text runs/PendingControl, API clients, Header/Footer, shared UI, theme/global CSS and every Listing source file are unchanged.

The old `.status`, `.dates`, `.textSection` and `.unavailable` selectors have no current class consumer. In particular, the legacy text-section layout does not wrap the active `ArticleContent`; adding that wrapper or assigning new rich-content typography would change the existing UI. The inactive `partners > div:first-child` rule cannot match the current first-child `<h2>`, and the old download `aria-disabled` cursor branch has no active element. These unused patterns were removed rather than reproduced as new markup. The shared rich-content PendingControl owns its own existing tooltip and is unrelated to the removed `.unavailable` selector.

## Conversion and CSS ownership

Only the PublicProject styling, its feature-owned stylesheet and the obsolete detail route stylesheet are changed in application source. Layout, typography, metadata cells/markers, summary, topics, resources, partner boxes, downloads, pending/error styles and responsive rules now use exact-value Tailwind v4 utilities. One static `factCellClasses` list is shared by the two metadata maps and website cell; breakpoint groups remain adjacent to the relevant JSX. No components were extracted and no data/behavior helper was changed.

| Authored Detail CSS | Rules | Declarations |
|---|---:|---:|
| Before: route module at `81ae68bd` | 109 | 302 |
| After: `components/project-details/project-detail.module.css` | 10 | 25 |
| Removed | 99 | 277 |

Counts use PostCSS rule/declaration nodes, including media overrides, with each shorthand counted once. The **25 retained declarations** are **17 artwork/logo composition declarations**, **2 measured desktop optical transforms**, and **6 contextual Stripe/Footer compatibility declarations**. No ordinary page/grid/typography rules remain in custom CSS. The old route module was unimported throughout the first converted comparisons, then deleted after the full 96-case parity pass. The final build/tests run with that file absent.

The existing `--u`/`--s` arithmetic and exact colors are preserved. Existing brand/surface tokens are used where values match; other values such as `#1554a0`, `#37416d`, `#e24b59` and translucent borders remain exact. Queries retain max-width **700px**, max-width **1100px** and min-width **1101px**. Disjoint `width>1100px` cell overrides preserve the original desktop base rules between 1100 and 1101 without leaking their specificity into tablet rules. Grid definitions retain literal `1fr` behavior rather than substituting `minmax(0,1fr)`.

Important utility modifiers are limited to margin/underline/link-color properties that must beat existing unlayered global resets. There is no blanket importance on layout/responsive classes. SVG scaling, logo sizing, fixed heights, optical shifts and the existing dense-content/image overflow visible in stress fixtures are preserved exactly.

## Behavior, CMS and routing

The AST audit verifies the original PublicProject tree after excluding CSS imports and `className` attributes. The one new style constant is excluded only after checking that its initializer is an array of static strings joined by a single space. All remaining JSX, attributes, conditions, handlers, data mapping and content are identical.

Protected behavior includes the GET `/projects/slug/${encodeURIComponent(slug)}` request; ON_GOING/Past mapping; truthy metadata filtering; null grant handling and currency suffix; topic splitting/trimming; description → quick summary → supplied-information fallback; managed logo/PDF/partner/resource URLs; external website validation; reference JSON parsing; native downloads; accessibility roles/labels; and all missing/loading/error states. No API endpoint, record, backend, route manifest or publication rule was modified.

The committed export manifest still contains only `projects: ["unavailable"]`. Existing real CMS slugs are not newly exported by this styling task; their ungenerated detail URLs remain 404. The valid backend detail response is read and relayed to the existing exported `/projects/unavailable/` route in Playwright to exercise the active CMS renderer without adding production slugs. This is a test-only route interception, not a deployed content or routing change. The existing integrated routing tests verify listing-to-detail behavior; separate real-server unknown-slug checks assert HTTP 404 at desktop/tablet/mobile widths.

The captured public dataset has **17 records**, identical to the signed-off Listing dataset; the initial commentary count of 18 was a counting mistake. The fixture harness separately fetches one real detail response and records the live list/detail payloads. These values must match before/after. No frozen replay was needed for older visual suites and no CMS records were published or changed.

Metadata, static parameters, noindex behavior, URLs, breadcrumbs/navigation and the absence of additional route structured-data code are preserved by unchanged route/SEO sources. The final normal export retains the existing 13-page SEO verification scope.

## Baseline establishment and capture infrastructure

New Detail references were captured from unchanged checkpoint `81ae68bd`, before styling conversion, with the approved Git/staging implementation as the design authority. No Figma data was retrieved. Staging provides no exported populated-detail URL for the real CMS slugs, so invented fixture records are compared to the unchanged Git renderer, not represented as independently approved new designs.

The **96-case matrix** covers full, long, missing and malformed data/media, broken images, and API errors at **1920, 1440, 820, 390, 699, 700, 701, 768, 769, 1099, 1100 and 1101px**. At 1440/820/390 it additionally covers website/PDF/pending-control hover and focus, pending-control Enter activation, real native PDF download by keyboard, resource focus, live CMS data, loading and unknown-slug 404s. Fixtures use the real `ProjectRecord` and rich-content contracts, valid wide/square/tall image bytes, managed-media routes, rejected external URLs and malformed JSON. Fixture data stays in `docs/`, never production source.

Renderer assertions retain Edge **158.0.4370.33**, Intel UHD/D3D11 **27.20.100.9664**, **GaneshGL**, `--force_low_power_gpu`, DPR **1**, en-GB, Europe/Skopje, reduced motion and light scheme. Fonts/images are ready before capture. All full PNGs are compared by SHA-256; computed normal/pseudo styles, image readiness/rectangles, text, links/download attributes, focus, scroll, requests and live/fixture/media data are compared exactly. The normal five-second exact paint-settling loop never accepts a different PNG. The diagnostic `--quick`/`--width=` flags select a smaller strict matrix and skip retry waiting only; they were not used for final acceptance.

Preflight found a **test-only history-scroll restoration race** before styling conversion. Three newly captured normal states (`820-live`, `390-live`, `390-loading`) began at scrollY 1146, 2285 and 88 instead of document top. Normal-state captures now set manual history restoration, scroll to zero after readiness, wait two animation frames and assert zero after the screenshot. Hover/focus/keyboard captures keep their real scroll position. Initial captures and reproduction findings are preserved under [initial-capture](project-detail-baseline/initial-capture/scroll-review.json).

Only those three new, not-yet-established Detail references were corrected from unchanged-source captures, with exact computed styles/dimensions/transforms and document positions verified. Old viewport-space DOMRects can lose floating-point precision after subtracting large scroll offsets; the one-time review records both sets of rectangles and uses unchanged computed geometry for that diagnostic. Final comparisons retain exact equality of every corrected DOMRect field; no coordinate rounding or tolerance was introduced. No earlier approved reference changed. The final established before/control comparison matches **all 96 PNGs, styles, behaviors and metadata exactly**, recorded in [the independent comparison](project-detail-baseline/control/established-comparison.json). The cached pre-establishment comparison is retained separately as historical evidence rather than relabeled as a successful old-reference run.

## Verification

The first 51-case converted desktop/tablet/mobile diagnostic passed exactly, followed by the full 96-case comparison with zero pixel/style/behavior/request/fixture/live/media differences. Final verification below uses the normal complete matrix after removing the obsolete CSS file.

The first complete prior-suite run reported Contact NVIDIA `1440-download-focus` differing at **one pixel** `(1273,637)`: RGBA `(135,162,193,255)` versus `(135,162,192,255)`. This is a composited pixel where the fixed translucent header overlaps the photograph; no computed-style or behavior difference was recorded. [The first failure](project-detail-baseline/prior-first-failure/pixels.json) and its actual screenshot are preserved locally. An unchanged-Detail source control passed all 59 Contact NVIDIA captures, with original source hashes verified and the migrated source automatically restored/rebuilt.

A focused diagnostic subsequently reproduced the failing PNG on **both original and migrated source** under identical Edge/GPU conditions. The [full-style and exact-geometry comparison](project-detail-baseline/contact-raster-probe/source-parity.json) compares 21 header/image/control elements and finds **zero differences**, with viewport 1440×1000, DPR 1 and scrollY 562 in both. Both full PNG hashes are `1500040d42605f43e8f9c4cb1f4f83b6bb1fd2550e632a2285f9c02495d2ebf1`; the approved hash is `12891f9a6b1cb171b9c9cfee89ced8c2749700f19e4bf7997c2beb73ba9597d5`. Waiting, animation suppression, foreground activation, scroll reset and full-page width/height repaint experiments did not recover that reference. An isolated local versioned-root browser-layout experiment also retained the same failing hash. These are diagnostic experiments, not shipped screenshot workarounds. No Contact/Header styling or old reference was changed. The exact internal compositing/capture-state mechanism is not asserted as solved.

On resumption, system Edge had auto-updated to **158.0.4370.45**, which added another Contact mismatch. The approved **158.0.4370.33** files remain installed in their versioned directory. `project-detail-edge.cjs` now selects that exact executable through a process-scoped Playwright launch wrapper and verifies `browser.version()`. Existing GPU arguments, screenshot settings, comparison algorithms and thresholds are unchanged. It refuses a missing/incorrect approved version, instead of falling back to the updated system browser. No browser installation, rollback, dependency upgrade or system configuration was performed. The final complete pipeline is rerun through this wrapper; the explicit executable can be relocated with `EKE_DETAIL_EDGE_EXECUTABLE` while the version assertion remains fixed.

| Verification | Result |
|---|---|
| Project Detail matrix, final source with old CSS removed | **96/96 exact**, zero computed-style, behavior, data/media or request differences |
| Independent before/control/after record comparison | **96/96 exact**, all actual PNG hashes verified |
| Signed-off Projects Listing | **81/81 exact**, approved references unchanged |
| News components / production / listing | **84/84 + 63/63 + 42/42 exact** on accepted runs |
| Privacy approved / breakpoint pilot | **3/3 + 7/7 exact** |
| Shared UI routes / gallery / native controls | **324/324 + 96/96 + 88/88 exact** |
| Contact software / NVIDIA | **59/59 + 59/59 exact** in the final pinned pipeline |
| Existing integration tests | **18/18 passed** |
| Production builds, ESLint, TypeScript, source/AST audit | **Passed** |
| SEO tests / final normal-export verification | **4/4 passed; 13 staging-mode pages verified** |

This totals **1,002 distinct accepted exact visual comparisons**: 96 new Detail cases, 899 prior cases, and the 7-width pilot. [Machine verification](project-detail-baseline/verification.json), [accepted prior-suite results](project-detail-baseline/prior-regression.json), [Detail comparison](project-detail-baseline/after/comparison.json) and [raw pipeline results](project-detail-baseline/regression.json) preserve their different roles.

The first complete pinned rerun exited nonzero because News Listing `1100-populated` had **11 pixels at one channel level** of difference, with no style/behavior difference. Its unchanged full 42-case recheck passed that case but found **10 one-level pixels** in `820-category-focus`. A final unchanged full 42-case run passed **42/42** exactly. [First pinned finding](project-detail-baseline/pinned-news-finding/pixels.json), [second finding](project-detail-baseline/pinned-news-recheck/pixels.json), the [raw full-run prior result](project-detail-baseline/pinned-full-run-prior-regression.json) and [rerun provenance](project-detail-baseline/prior-rerun.json) remain visible. No application change, reference replacement, tolerance or mask was used to clear either result. The accepted aggregate records the exact rerun; it does not relabel the raw full-run exit code as successful.

The Contact discrepancy described above likewise remains preserved; the final complete pinned pipeline passed all 59 NVIDIA cases without a Contact/Header source or reference change. These findings demonstrate why a failed raster capture must be investigated rather than repaired through application styling. They do not grant a future pixel-noise allowance or certify that every capture history is reproducible.

From the worktree root, `node docs/project-detail-regression.cjs` runs all older suites/integration tests and their normal production rebuilds, then Detail comparisons, source audit, lint, TypeScript and SEO, through the explicit version pin. For a standalone Detail rerun use `node docs/project-detail-edge.cjs docs/project-detail-check.cjs after`; `node docs/project-detail-compare.cjs after` independently checks all captured records. `project-detail-summary.cjs` verifies all captured hashes, source scope, accepted results and explicit rerun provenance while retaining raw failures. The normal baseline command refuses to replace an existing reference manifest; the one-time preflight scroll review is guarded and documented. Compressed manifests and compact comparisons are committed; full matrix PNGs remain local ignored review artifacts. Unrelated older generated outputs are restored after their current compact results are copied into this phase directory.

Stop after Phase 4C.2. No unrelated page, Header/Footer/navigation, backend, dependency, CMS data, deployment, PR or merge change is included.
