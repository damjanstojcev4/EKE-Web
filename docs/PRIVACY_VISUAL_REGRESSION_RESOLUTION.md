# Privacy visual regression resolution

24 November 2026. Worktree `D:/eke-web/.worktrees/frontend-tailwind-phase1`, branch `codex/frontend-tailwind-phase1`. Application source checkpoint: `ef6cca67`; Phase 3 control: `492c88645cc4b68c60fac456ea786a30e5055b41`.

## Root cause

**The visual infrastructure left the graphics adapter implicit on a hybrid-GPU Windows host.** The installed Edge version stayed `158.0.4370.33`, but automatic selection now uses NVIDIA GeForce GTX 1650, driver `32.0.16.1088`, with `GraphiteDawnD3D11`. The approved Privacy captures match Intel UHD Graphics, driver `27.20.100.9664`, with `GaneshGL` exactly. Explicitly selecting Intel fixes all three comparisons without any application or reference-image changes.

The dominant desktop difference is SVG alpha compositing: 847,617 pixels changed from RGB `(240,241,243)` to `(240,240,242)` under the NVIDIA profile. Glyph edges also differ. These are actual raster differences, not a different font download, viewport, document height or Contact CSS regression. Software rendering is a third rendering profile and does not reproduce these original hardware-rendered Privacy references.

The measured cause is adapter/backend selection. Original manifests recorded browser version but not GPU, so the historical adapter is inferred from exact reproduction; the current adapter/backend and their pixel effects were measured directly through CDP and controlled launches. No historical log establishes which host power policy or process caused automatic selection to change; this report does not attribute it to an OS or driver update.

## Reproduction and controls

The original three-test configuration failed again on the current Contact checkpoint. Earlier unchanged-Phase-3 assertion counts were desktop **916,802**, tablet **311,721**, mobile **276,015**; the same failure pattern reproduced here. Playwright's screenshot comparator excludes antialiased pixels; the exhaustive RGBA counter below counts **every** differing pixel, so its totals are larger.

All five application-source paths changed between Phase 3 and Contact were temporarily restored to their Phase 3 existence/content, including restoring the old route CSS and removing the new feature CSS. The control was rebuilt, tested, and the original working files restored in `finally`; the current Contact export was rebuilt afterward. No Git reset, checkout, branch change, new worktree or deployment was used. [Source-control evidence](privacy-regression/phase3-source-control.json) records all five checks and exit codes.

| Source / capture profile | Desktop 1440×1000 | Tablet 820×1180 | Mobile 390×844 |
|---|---:|---:|---:|
| Unchanged Phase 3, NVIDIA / Graphite, exhaustive differing pixels | 1,031,396 | 460,919 | 407,123 |
| Unchanged Phase 3, Intel / GaneshGL | **0** | **0** | **0** |
| Contact checkpoint, Intel / GaneshGL | **0** | **0** | **0** |

Every zero above also has identical PNG SHA-256, not just equal decoded pixels. The corrected Playwright tests passed all three sizes on both the Phase 3 control and restored Contact source.

Evidence: [Phase 3 NVIDIA](privacy-regression/phase3-local-nvidia.json), [Phase 3 Intel](privacy-regression/phase3-local-intel.json), [current Intel](privacy-regression/current-local-intel.json). The [renderer matrix](privacy-regression/rendering-matrix.json) also records the unchanged staging desktop failing with NVIDIA and the unsuccessful alternative backend controls. Disabling Graphite alone on NVIDIA still differs; changing only the explicit adapter to Intel produces zero. This isolates the rendering profile rather than blaming a particular backend in isolation.

The final [live staging Intel control](privacy-regression/current-staging-intel.json) also matches all three approved PNG hashes exactly. Release marker remains `dd76db4434f103cf8b7b93c20ccaea7190abd2e2-45292330641-1`.

Font response SHA-256 values, loaded font-family/weight/status, body font, viewport, DPR, article geometry and scroll behavior match across the Phase 3 NVIDIA and current Intel controls. Reduced motion already changes global smooth scrolling to `auto`; explicit instant scrolling in the diagnostic confirms capture readiness. The original production styles, font assets, SVGs and page content were not changed. Fresh browser processes/contexts, one worker and serial browser jobs avoid test interference. The unchanged staging control independently rules out the migration source as the cause.

## Minimal infrastructure changes

- Privacy Playwright configuration explicitly passes `--force_low_power_gpu`. A setup assertion checks Edge version, full Intel renderer/driver string and GaneshGL, and attaches the measured profile. Environment drift now fails clearly before screenshot comparison. Zero-pixel/zero-threshold assertions remain unchanged.
- The seven-width Privacy pilot helper and Shared UI gallery/native-control helper select the same Intel profile as their original references.
- Contact's real-browser helper explicitly passes `--force_high_performance_gpu`, preserving its existing NVIDIA references. Contact and Shared UI software comparisons retain `--disable-gpu` and their separate, existing references.
- `docs/privacy-regression-check.cjs` provides repeatable read-only Intel/NVIDIA controls, font hashes, layout metadata, raw RGBA counts and approved/archive hash checks. Its `--staging` option only reads the deployed page and release ID. It never writes reference images. Generated captures are ignored; compact JSON evidence is versioned.

The approved datasets require different rendering profiles for exact reproduction on this host. Keep those matching profiles separate; do not replace the references with newly generated images to force a common backend. These references require the documented Windows hardware/driver/browser environment. Other hosts should fail the environment check rather than silently accept new baselines.

## Final verification

| Check | Final result |
|---|---|
| Privacy Playwright, current source, after the other browser suites | **3/3 passed**, zero changed pixels; renderer/version guard and hover/focus assertions pass |
| Privacy seven-width pilot helper | **7/7 PNGs byte-identical**, all 134-element computed-style / hover / focus records identical |
| Shared UI real-CMS route/state matrix | **324/324 PNGs byte-identical**, no computed-style differences, API hashes unchanged, release unchanged, no browser errors |
| Shared Button gallery | **96/96 byte-identical**, computed values and keyboard activation pass |
| Native About buttons/tooltips | **88/88 byte-identical**, computed values and keyboard behavior pass |
| Contact software matrix | **59/59 byte-identical**, no computed-style/behavior differences, blocked requests or browser errors |
| Contact real-browser NVIDIA matrix | **59/59 byte-identical**, no computed-style/behavior differences, blocked requests or browser errors |
| Browser integration | **18/18 passed**, including the original 16 and both Contact tests |
| Production build / static export normalization | Passed after restoring the Contact source |
| ESLint / standalone TypeScript | Passed |
| SEO | **4/4 unit tests passed**; verification across **13 exported staging-mode pages passed** |

The primary visual suite totals **629 accepted comparisons** (3 Privacy + 508 Shared UI + 118 Contact), plus the seven-width pilot check and the independent source/staging diagnostic captures. [Machine-readable verification](privacy-regression/verification.json) links the final comparison data. No approved snapshots, baseline manifests, comparison thresholds or application-source files changed. Final application-source diff against `ef6cca67` is empty; the previous migrations remain intact.

One initial Shared UI run had a single tablet About portrait pixel differ by at most two channel levels at `(261,445)`; all other 323 images, computed values and API hashes matched. This is preserved in [the initial comparison](privacy-regression/shared-initial-comparison.json) and [pixel finding](privacy-regression/shared-initial-finding.json). A complete, unchanged serial rerun matched **all 324** original PNGs exactly. No new retries, masks, comparator settings or baseline updates were added to accept it. This is separate from the three persistent Privacy GPU-profile failures; the previously documented software-image raster transient remains a reason to keep browser jobs serial and retain diagnostic artifacts, not to permit nonzero diffs.

Build first caught an optional-CDP-metadata TypeScript access in the new test assertion; it was corrected before the accepted control/current builds and standalone typecheck. Existing Node module-type and terminal-color warnings remain non-fatal. Node `24.20.0`, installed dependencies, and Node 22 CI configuration remain unchanged. No production application, backend/CMS, routing, SEO, authentication, infrastructure or deployment changes were made.

**Privacy visual blocker resolved. Stop here.** No further page migration, PR, merge, push or deployment is part of this checkpoint.

## Repeatable commands

From `Frontend/ece-website`, after building the current export:

```powershell
npx playwright test --config playwright.visual.config.ts
```

From the worktree root, run browser jobs **serially**:

```powershell
node docs/privacy-regression-check.cjs --intel
node docs/privacy-regression-check.cjs --intel --staging
node docs/privacy-pilot-check.cjs after
node docs/shared-ui-check.cjs button --software
node docs/shared-button-gallery.cjs after
node docs/shared-button-gallery.cjs after --native
node docs/contact-check.cjs after
node docs/contact-check.cjs after --real
```

For an intentional failing control, run `node docs/privacy-regression-check.cjs` (NVIDIA); a nonzero exit is expected against the Intel Privacy references. Optional `PRIVACY_CONTROL_LABEL` changes only the diagnostic output name. Never rerun any baseline helper's `before` mode against migrated code.
