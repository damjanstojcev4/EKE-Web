# Projects listing — Phase 4C.1 implementation checkpoint

**Current status: Phase 4C.1 signed off; GO for Phase 4C.2.** See the [reviewed reference decision and complete final verification](PROJECTS_LISTING_VISUAL_SIGNOFF.md). This implementation checkpoint's original acceptance status and evidence below are historical.

The [visual sign-off investigation](PROJECTS_LISTING_VISUAL_SIGNOFF_INVESTIGATION.md) at `5cb647c7` preserves the source-independent raster-state evidence, rejected repaint experiments and original two-reference proposal. The final review supersedes its initial NO-GO decision, with thresholds unchanged.

**Strict initial-reference visual sign-off remains blocked by two capture-reproducibility failures.** The migrated page matches all 81 unchanged-checkpoint control PNGs exactly, but `769-ongoing` and `1099-empty` do not match the first capture set; the unchanged checkpoint reproduces those same failures. No initial reference has been replaced and no pixel tolerance has been granted. This is an implementation/review checkpoint, not an all-green acceptance claim or authorization for another page migration.

Worktree: `D:\eke-web\.worktrees\frontend-tailwind-phase1`; branch `codex/frontend-tailwind-phase1`; original source checkpoint `53f718e7308ddb3e4bc59f45a6ec7ce12e7e02fd`. Audit/capture date: 24 November 2026, Europe/Skopje.

## Audit, implementation and preserved behavior

The current Projects route includes Hero, Introduction, the CMS project list, Programs, Outputs and the shared PartnerSection. Its stylesheet had exactly three importers: the route, `ProjectsList`, and `ProjectCard`. Project Details imports its own separate module and has no dependency on the removed listing stylesheet. The older planning inventory is historical; current counts were measured from the requested checkpoint.

Ordinary layout, heading/body typography, card/media sizing, metadata, filters, spacing, borders, pseudo markers, empty-state and responsive rules now use Tailwind v4 utilities in the existing JSX. Longer class lists are grouped by breakpoint. No components, production records, mock-data imports, endpoints or data transformations were added. The feature-owned `components/projects/projects.module.css` contains only documented artwork, measured optical adjustments and shared-component contextual overrides. Neither migrated feature component imports CSS from a route directory.

The original client still fetches `/projects/public` once per mount and filters locally: `ON_GOING` maps to Ongoing, all other status values follow the existing Past branch. Input order is retained; no sorting was added. Filter IDs, aria-pressed, aria-controls, group labeling and the exact live announcement remain unchanged. The custom clipped status element is expressed with equivalent utilities rather than Tailwind's broader sr-only reset, preserving its existing computed properties.

Image URLs still pass through `mediaUrl`; missing/unmanaged URLs preserve the tinted empty visual box, and valid images retain the existing crop and aspect ratio. Card summaries still use `quickSummary || description`. Dates keep the same null filtering and join operation. Only manifest-backed slugs receive Project Details links; other records keep the existing unavailable-detail paragraph. The old `.pending` tooltip and `.more` button styles had no current JSX consumer and were removed, not resurrected as new UI.

Metadata, breadcrumb structured data, static slug generation, API clients, content arrays, Project Detail source/styles, Header, Footer, PartnerSection, shared UI, global CSS, theme tokens and News are unchanged. The [source audit](projects-baseline/source-audit.json) records hashes and semantic AST equality for all three migrated JSX files after excluding styling imports/className attributes and formatting-only parentheses/trivia. Handlers, rendering conditions, all other attributes, content and component APIs match the checkpoint.

## Exact values and CSS ownership

The existing `--u`/`--s` scaling system remains intact. Queries retain **max-width:700px**, **max-width:1100px** and **min-width:1101px**, including the original fractional-width fallback between 1100 and 1101. Program minimum heights use a disjoint **width>1100px** condition so the original small-screen zero-height reset no longer needs !important. ProjectInfo padding likewise uses normal responsive utilities rather than either of its old !important declarations.

Important modifiers are limited to properties that must beat existing unlayered resets: paragraph/heading margins, native-button font shorthand and selected/hover text, and explicit link color. Container layout, card sizing and ordinary spacing have no blanket importance. Grid alignment keeps literal `start`, and Google Flex metadata keeps its original font variable without adding a fallback family. Brand/surface colors use the existing exact theme tokens; no default spacing was substituted for precise calc values.

PostCSS rule/declaration-node counts include responsive overrides and count a shorthand once:

| Authored Projects CSS | Rules | Declarations |
|---|---:|---:|
| Before: current route module at 53f718e7 | 202 | 533 |
| After: feature-owned module | 47 | 104 |
| Removed | 155 | 429 |

The retained **104 declarations** comprise:

- **79** artwork/gradient/logo composition declarations: clipped/scaled SVG layers, overlapping output images, hero background stops and optically sized program logos. Existing CSS logo dimensions intentionally differ from some HTML width/height attributes; they were preserved rather than inferred from those attributes.
- **13** measured desktop optical adjustments: headline/copy offsets, per-program copy widths/transforms and output-row alignment.
- **12** contextual compatibility declarations for the existing shared Stripe, PartnerSection and Footer. Their component/global source is unchanged.

The old route module was left on disk but unimported during replacement verification, so it could not hide missing utilities. It was removed after every recorded computed property, behavior record and data/media invariant matched; the remaining screenshot discrepancies also reproduced with the original source. No legacy card/filter/empty-state CSS remains.

## Baselines and coverage

The actual public Projects API is populated. The harness reads it without mutation, relays that response into the local application and forwards only GET image reads to staging. Live data and each image's SHA-256 are compared across runs. Six live captures cover Ongoing/Past at desktop/tablet/mobile. This verifies current CMS content as well as controlled fixtures; it does not certify a new independent design for invented CMS records.

Test-only contract-shaped fixtures cover both statuses, short/long/multiline/unbroken titles, short/long summaries, description fallback, null dates, valid images, missing images, unmanaged-image rejection, known static slugs and unavailable slugs. Empty, status-specific empty, loading and server-error responses are isolated to Playwright routes. There is no Projects fixture route or mock content in production source.

The **81-case matrix** comprises empty/Ongoing/Past captures at **1920, 1440, 820, 390, 699, 700, 701, 768, 769, 1099, 1100 and 1101px**, plus fifteen states at 1440/820/390: live Ongoing/Past; filter hover/focus; Enter activation; held-pointer active state; Past selected; image hover; details hover/focus; middle/end sticky-filter viewports; empty Ongoing when only Past records exist; error; loading. Filter state/order, announcement text, focused element, scroll offset and sticky top position are recorded alongside all main/Footer normal and pseudo-element computed styles. Active/sticky captures use the actual viewport; hover/focus captures retain their scroll position.

Windows Edge **158.0.4370.33**, Intel UHD/D3D11 driver **27.20.100.9664**, **GaneshGL**, `--force_low_power_gpu`, DPR 1, en-GB, Europe/Skopje, reduced motion and light scheme are pinned and asserted. Fonts/images are ready before capture. A bounded five-second exact paint-settling period follows the existing Shared UI helper's method; it never accepts a differing PNG. Before mode refuses existing references and requires unchanged source at the checkpoint. PNGs are local ignored review artifacts; compressed manifests preserve hashes, computed values, behavior, public API data and media hashes.

## Reproducibility investigation and remaining gate

The first migration comparison had **zero style, behavior, request, live-data or media differences**. Four PNGs differed; [initial pixel evidence](projects-baseline/initial-raster.json) preserves the measured counts/channel deltas and actual hashes. Subsequent paint settling removed the transient hover/edge cases, but two initial-reference mismatches remained.

`projects-control.cjs` temporarily restored the original checkpoint JSX, rebuilt its original route stylesheet and captured the same matrix, then restored the migrated source automatically. [Control source verification](projects-baseline/control-summary.json), [unsettled control findings](projects-baseline/unsettled-control.json) and the [settled original-source comparison](projects-baseline/control/comparison.json) show the original implementation also failing `769-ongoing` and `1099-empty`. The latter involves the hero photograph; the former contains a small edge-pixel difference. Root cause beyond source-independent capture reproducibility is not asserted as resolved.

An independent [migration-versus-original-control comparison](projects-baseline/control-parity.json) matches **all 81 PNGs, computed-style records, behavior records and request sequences exactly**. This is diagnostic evidence of unchanged rendering against the checkpoint control, **not a replacement reference or waiver**. The [initial-reference gate](projects-baseline/after/comparison.json) remains a strict failure with **79/81** byte-identical PNGs, zero style/behavior differences across all 81, and unchanged live data/media/request hashes. Its nonzero exit code remains visible in [the regression result](projects-baseline/regression.json).

No masks, image tolerances, alternative renderers, accepted pixel noise, new approved appearances or overwritten initial snapshots were used. These two initial captures need a separate rendering/baseline decision before claiming an entirely green Phase 4C.1 acceptance. Do not treat the checkpoint as approval to continue to Project Details.

## Final verification results

| Check | Result |
|---|---|
| Projects against initial PNG set | **79/81 exact; FAIL** for `769-ongoing`, `1099-empty`; zero style/behavior differences in all 81 |
| Projects against unchanged-source control | **81/81 exact**, zero style/behavior/request differences; diagnostic only |
| Live CMS and image reads | **Unchanged response and media SHA-256 values**, GET only; no records modified |
| Full News component matrix | **84/84 exact** |
| News final production rechecks | **63/63 exact** |
| News listing | **42/42 exact** |
| Approved Privacy / breakpoint pilot | **3/3 + 7/7 exact**, hover/focus and renderer guards pass |
| Shared UI route/state matrix | **324/324 exact**, API hashes/release marker unchanged |
| Shared gallery / native controls | **96/96 + 88/88 exact**, keyboard activation passes |
| Contact software / NVIDIA | **59/59 + 59/59 exact**, no style/behavior differences, errors or write attempts |
| Existing integration suite | **18/18 passed** |
| Production build / ESLint / TypeScript | **Passed** |
| SEO | **4/4 passed**; export metadata/robots/sitemap verified across **13 staging-mode pages** |
| Source/AST audit / temporary-route removal | **Passed** |

The prior suites total **818 accepted visual comparisons**, plus the seven-width Privacy pilot. One initial native About-controls focus capture differed at two edge pixels by one channel level, with no style/keyboard difference. [Pixel evidence](projects-baseline/native-initial.json) and [initial comparison](projects-baseline/native-initial-comparison.json) are retained; its unchanged complete 88-case rerun passed exactly. This resolved transient does not waive the separate two-case Projects failure. Existing non-fatal Node module-type/terminal-color warnings remain. Final source was frozen before the accepted regression runs; the old generated result files are restored after this phase's evidence is copied.

## Repeatable verification

After a production build, from the worktree root:

```powershell
node docs/projects-audit.cjs
node docs/projects-regression.cjs
node docs/projects-control-compare.cjs
```

The regression runner first revalidates the full 84-case News component matrix with its existing temporary route, removes it, rebuilds the normal export, then runs Projects, 63 News production rechecks, 42 News listing captures, Privacy/Shared UI/Contact and all integration tests serially. It copies compact evidence into this phase's directory. Older generated outputs are restored before committing. `projects-control.cjs` is an opt-in reversible diagnostic and never writes the initial references; its expected nonzero comparison is recorded separately.

From the frontend directory run `npm run build`, `npm run lint`, `npm run typecheck`, `npm run test:seo` and `npm run verify:seo`. The Projects command deliberately stays nonzero while the two initial-reference failures remain. Do not rerun before mode against migrated source or update references merely to clear this gate.

Stop at this Projects listing checkpoint. No Project Detail migration, backend/CMS/authentication change, Figma retrieval, dependency upgrade, deployment, PR or merge is included.
