# Training — Phase 4D

**Visual sign-off completed after this implementation checkpoint.** See [Training visual sign-off](TRAINING_VISUAL_SIGNOFF_PHASE4D.md) for the four reviewed original-source reference corrections, strict 78/78 original and migrated passes, complete verification and **GO for Opportunities**. The initial NO-GO results below remain historical evidence from `cbb18e86`; the current decision is recorded by `training-signoff-summary.cjs`.

Worktree `D:/eke-web/.worktrees/frontend-tailwind-phase1`, branch `codex/frontend-tailwind-phase1`; unchanged-source checkpoint `1c18dd26`. Verification date: 26 November 2026 (Europe/Skopje).

## Audit and styling ownership

The current route owns the static hero, introduction, two methods, six training themes, tailored training, sessions heading and closing contact section. `ThemeBanner` remains a small page-local component. `SessionListings` supplies the shared Training/Opportunities API state and lifecycle rendering. No unrelated folders are reorganized.

The route module had **174 rules / 537 declarations**, including responsive overrides, shared Stripe/Footer context, and inactive legacy controls. Counts use PostCSS rule/declaration nodes; shorthands count once. Both original consumers were inspected before removing declarations. The unused `showing`, `loadMore`, `unavailable`, `button.status` and `.status button` patterns do not render in the current component. Active registration controls are anchors and closed states are spans; no new button or tooltip was introduced.

| Authored Training CSS | Rules | Declarations |
| --- | ---: | ---: |
| Original route module | 174 | 537 |
| Feature compatibility module | 5 | 7 |
| Removed | 169 | 530 |

Ordinary layout, typography, spacing, borders, image dimensions, gradients, markers and responsive behavior use exact-value Tailwind v4 utilities. Existing `--u` arithmetic, unitless line heights, literal grid tracks, 700px/1100px maximum queries and 1101px minimum queries are preserved. Matching colors use centralized brand/surface tokens. Other colors and translucent borders retain their original values. Important margins preserve the existing unlayered heading/paragraph resets; the registration-link color must beat the unlayered global anchor reset.

The seven retained declarations live in `src/components/training/training.module.css`: desktop Stripe margin, first Stripe segment width, desktop Footer height, tablet Stripe height/margin, and tablet Footer height/bottom padding. They remain scoped by the Training page/image wrapper and preserve the existing shared components without editing them. The page imports this feature module. `SessionListings` no longer imports Training route CSS. Its pre-existing Opportunities route stylesheet remains for the unchanged Opportunities branch; moving that owner belongs to the Opportunities migration.

Other dependencies remain unchanged: global resets and `--u`/`--s`/font variables, centralized theme tokens, Header/Footer CSS, shared Button/Stripe utilities, Training data/assets, API clients and SEO helpers. The [source audit](training-baseline/source-audit.json) inventories all original selectors and checks these protected files and the two renderers' non-styling ASTs.

## Content, behavior and integrations

The static copy, theme data, image URLs/attributes, decorative `aria-hidden` semantics, section labels, main landmark, contact routing, metadata and breadcrumb structured data are preserved. The session GET remains `/training/sessions`; the shared Opportunities endpoint remains `/opportunities/public`. Loading/error/empty output, truthy fact filtering, deadline fallback, external URL validation, one-second timer, date formatting in Europe/Skopje, state labels and optional content rendering remain unchanged. No backend, authentication, CMS records, publication rules, deployment, merge or PR is changed.

The test-only Training fixtures cover six lifecycle/action combinations, long content, minimal content with a rejected executable URL, empty responses and API errors. They are never imported by production code. The clock is fixed to 26 November 2026 at 12:00 UTC in browser tests so countdowns are deterministic.

## Capture protocol and external availability

The new matrix uses the Git checkpoint renderer at **1920, 1440, 820, 390, 699, 700, 701, 768, 769, 1099, 1100 and 1101px**. All widths capture populated/long/short/empty/error states. Desktop/tablet/mobile additionally capture registration/contact hover and focus, keyboard traversal and loading: **78 fixture cases**. Shared Button active states remain covered by the prior gallery. Full-page captures include every section and Footer. Exact hashes, normal/pseudo computed styles, image geometry/readiness, main text, links, focus, scroll position, requests and fixture bytes are compared. No tolerance, mask or approved reference replacement is allowed.

The existing process-scoped `project-detail-edge.cjs` pin is reused unchanged: Edge **158.0.4370.33**, Intel UHD/D3D11 **27.20.100.9664**, GaneshGL, `--force_low_power_gpu`, DPR 1, en-GB, Europe/Skopje, reduced motion and light scheme. Browser capture requires execution outside the desktop sandbox. Normal comparisons retain the established five-second exact paint-settling loop. Diagnostic width selections/`--quick` do not count as full acceptance.

Initial live CMS requests failed: `preview.ekebitola.org` returned `ENOTFOUND` outside the sandbox. At the user's suggestion, read-only probes of both `https://ekebitola.org/api/training/sessions` and `https://www.ekebitola.org/api/training/sessions` returned HTTP 403. Staging recovered during the full regression pipeline. A fresh public Training GET then returned **HTTP 200 / zero published sessions**, recorded in [the public probe](training-baseline/live-probe.json). The fixture suite's explicit `--offline` option omits live cases; it does not substitute fixtures for real CMS evidence. A separate live supplement captures the real response at 1440/820/390 on original source, independent original control and migrated source. Existing old suites retain their real fetches. Prior accepted results remain historical evidence, not newly passed results.

## Verification and next-feature gate

Two complete original-source controls were run after production rebuilds. Each compared **78 cases**, with **zero computed-style, behavior, request or fixture differences**, but three PNG failures in each run. The first control differed at `1440-populated`, `701-populated`, `1100-populated`; the second differed at `1440-populated`, `1440-long`, `1101-error`. Both raw manifests/comparisons remain preserved; the second control's [pixel analysis](training-baseline/control/differences.json) and [first-control region analysis](training-baseline/preflight.json) record the findings. Differences include one-level raster changes and image-region differences up to 12 channel levels. These are unresolved renderer/reference findings on unchanged source, not accepted tolerances. No reference was replaced, no difference was masked, and no application styling was changed to compensate for these control failures.

The class migration also preserves the original JSX text gaps around hidden `<br>` elements. Formatting had split literal text/space nodes and changed text rasterization despite matching computed styles; the final markup keeps the original text-node structure. The source audit verifies the original non-styling AST, and complete comparisons remain the acceptance authority.

The final fixture run has **74/78 exact initial-reference PNGs**, **78/78 exact computed-style/behavior/request/data comparisons**, and no browser errors. The four PNG differences are `1440-long`, `701-populated`, `1100-populated`, `1101-error`. Every one is **byte-identical to an unchanged-source control PNG for the same case**, with identical computed styles and behavior. The [independent source-parity record](training-baseline/source-parity.json) therefore records **78/78 exact source-parity matches**, with zero unreproduced cases. This diagnoses the differences as source-independent capture variability; it does not turn the raw 74/78 initial-reference result into 78/78 or approve alternate references.

| Verification | Current result |
| --- | --- |
| Training fixture initial-reference matrix | **74/78 PNGs exact**; four unresolved source-independent raster findings |
| Training computed styles, behavior, requests and fixture data | **78/78 exact**, zero errors |
| Training exact source parity across initial/control evidence | **78/78 exact**, every differing PNG reproduced byte-for-byte on unchanged source |
| Independent original-source fixture controls | **75/78 PNGs exact in each run**; all 78 style/behavior/data comparisons exact |
| Real CMS supplement / independent original control | **3/3 + 3/3 exact**, HTTP 200, zero published sessions, unchanged response |
| Previous accepted visual comparisons | **1,002/1,002 exact** on recorded accepted runs |
| Existing integration tests | **18/18 passed** |
| Production build, ESLint, TypeScript, source audit | **Passed**, including final restored-source production build |
| SEO tests / normal export | **4/4 passed; 13 staging-mode pages verified** |

The initial full pipeline exited nonzero for Training's four PNGs and Contact NVIDIA `1440-download-focus`. The Contact finding is exactly the previously investigated Phase 4C.2 pixel: `(1273,637)`, RGBA `(135,162,193,255)` → `(135,162,192,255)`, with the same reference/actual full PNG hashes. [Current pixel evidence](training-baseline/contact-first-failure/pixels.json) preserves that result. A subsequent unchanged **full 59-case Contact NVIDIA rerun passed 59/59 exactly**. The [raw prior results](training-baseline/prior-regression.json), [strict recheck](training-baseline/prior-recheck.json), [accepted prior aggregate](training-baseline/accepted-prior-regression.json) and [raw full pipeline](training-baseline/regression.json) remain separate. No Contact/Header code, screenshot mask, threshold or approved reference was changed. The full pipeline's exit code remains nonzero; the accepted aggregate explicitly identifies the successful recheck.

**Recommendation: NO-GO for the next feature.** The Training implementation is migrated and no source-dependent visual or functional difference was found. Phase 4D visual sign-off remains incomplete because the initial-reference fixture matrix and independent original controls are not fully repeatable. Resolve the renderer/reference repeatability and obtain complete exact baseline/control/after acceptance before advancing. No new baseline variant has been accepted automatically. The [machine verification](training-baseline/verification.json) intentionally exits nonzero for this gate.

From the worktree root:

```powershell
node docs/training-regression.cjs
node docs/project-detail-edge.cjs docs/training-check.cjs after --offline
node docs/project-detail-edge.cjs docs/training-live-check.cjs after
node docs/training-source-parity.cjs
node docs/training-summary.cjs
```

`training-control.cjs` temporarily restores the three original Training sources from `1c18dd26`, rebuilds and compares them, then restores/rebuilds the migration in `finally`. Baseline commands refuse to replace existing reference manifests. `training-live-control.cjs` established the supplementary original/control/after live matrix and also restores sources in `finally`; its baseline is now immutable. Full PNGs remain local ignored review artifacts; compressed manifests, comparisons, pixel findings and provenance are committed. Older generated outputs are restored after copying this phase's evidence, preserving earlier checkpoints and approved baselines.

Stop after Phase 4D. No deployment, merge, PR, backend/CMS/authentication change, dependency upgrade, Figma access, Header/Footer/navigation modification or unrelated page migration is included.
