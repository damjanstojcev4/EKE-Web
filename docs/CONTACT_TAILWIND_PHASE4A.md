# Contact migration Phase 4A

## Before styling changes

The current reconciled Contact source, not an older mock branch, was inspected. Route composition lives in `app/contact/page.tsx`; `components/contact/ContactForm.tsx` and `PartnerFormNotice.tsx` are already grouped logically. Both currently import the route CSS Module. Keep this component grouping; move any necessary residual styles into that group, rather than restructuring other features.

Current behavior is explicitly preview-only: submit prevents navigation, validates required trimmed fields and email validity, checks attachment extension (PDF/DOC/DOCX, case-insensitive) and each file's size <=5 MiB, focuses the first invalid field, clears individual errors on input, displays selected filenames, and shows the existing unavailable-submission notice on valid input. No fetch/API call exists in these components. PartnerFormNotice displays its existing local status. No endpoints, payloads, handlers, state or semantics may be changed. Test runs block API and non-GET network requests and never submit to a real service.

CSS ownership: the 319-declaration Contact module controls layout, type, spacing, borders, imagery, pseudo square markers, native/custom form controls, placeholders, focus/hover/active, invalid borders, notices and errors. It has <=1100px, <=768px, <=480px and >=769px rules. Global `--u` changes at <=700px independently. Global unlayered heading/paragraph margins, anchor color/decoration, native-button font shorthand and native-button hover color can override layered utilities; preserve these relationships explicitly. Shared Arrow artwork, Header/Footer and global styles are out of scope. Retain only a Contact-scoped bridge for focus across shared components and the page-specific Footer geometry if necessary.

Baseline matrix: desktop 1440×1000, tablet 820×1180, mobile 390×844, plus widths 480/481, 768/769, 700/701 and 1100/1101. Deterministic Edge software rendering uses Phase 3's `--disable-gpu`, DPR 1, reduced motion, en-GB and Europe/Skopje. A separate default-Edge run verifies real-browser form interactions. Capture pristine layout, input/textarea/upload focus, action hover/focus/active, partner notice, blank/email errors, radio change, filenames, valid preview status and invalid/oversized/exact-limit files. Preserve references and compare computed styles in addition to pixels. Existing unavailable submission/partner form are baseline limitations, not newly broken integrations.

## Checkpoints and implementation

Phase 3 was committed first as **`492c8864`**, parent of this Contact checkpoint. Work continued in the existing `codex/frontend-tailwind-phase1` worktree. No new worktree, dependency upgrade, PR, merge, push or deployment was performed.

Production changes are limited to the Contact route, its existing ContactForm/PartnerFormNotice components, deletion of the obsolete Contact route CSS Module, and addition of `components/contact/contact.module.css`. Header, Footer, navigation, shared UI, other feature pages, backend/CMS/auth and routing/SEO implementations were not edited.

Ordinary styling now lives in JSX utilities: grids, responsive columns, spacing, typography, exact alpha borders, backgrounds, image radii, square pseudo markers, native controls, radio checked gradient, placeholders, invalid borders, errors/notices and hover/focus states. Existing theme colors are reused; one-off placeholder/error/alpha values remain exact arbitrary values rather than approximate theme defaults. Font inheritance is explicit on inputs/textarea; narrowly important margin/font/color utilities preserve existing unlayered global reset behavior.

Contact components were already grouped usefully under `components/contact`, so no component moves or trivial wrappers were introduced. The route imports the residual feature-owned stylesheet; neither client component imports route CSS. The only shared class constant is the genuinely repeated square-marker styling used by both service and contact-detail lists. Existing Arrow, native buttons, native download anchor and form semantics remain intact; forcing them into a Link-based shared Button would change behavior.

## CSS counts and retained rules

| Contact-specific authored CSS | Rule blocks | Declarations |
|---|---:|---:|
| Before: `app/contact/page.module.css` | 103 | 319 |
| After: `components/contact/contact.module.css` | 2 | 4 |
| Removed | 101 | **315** |

The old module was first left on disk but unimported, so it could not conceal missing utilities. It was deleted only after the Contact replacement passed deterministic comparisons and real-browser behavior checks.

Remaining CSS is deliberately scoped:

1. Two declarations for Contact-wide focus outline/offset on inputs, textarea, anchors and buttons, including unchanged shared Header/Footer controls. This preserves the page's existing accessibility policy without modifying shared components or global layers. The focused status paragraph and upload-label focus-within styling use utilities.
2. Two declarations for the existing shared Footer padding/height at **min-width:769px**. Shared Footer migration is out of scope.

No custom artwork, control-state or form-layout rules remain. The unused `styles.field` lookup (no corresponding CSS definition in the old module) was removed while preserving its wrapper elements.

## Exact baselines and results

Browser: **Windows Edge 158.0.4370.33**, DPR 1, reduced motion, en-GB, Europe/Skopje. Software profile adds `--disable-gpu`; default profile does not. Both are actual Edge browser runs, not DOM emulation. Browser suites ran serially.

| Final comparison | Captures | Pixel differences | Computed-style differences | Behavior differences | API/write requests |
|---|---:|---:|---:|---:|---:|
| Deterministic software profile | **59** | **0** | **0** | **0** | **0** |
| Default Edge real-browser profile | **59** | **0** | **0** | **0** | **0** |

Eleven pristine viewport captures cover 1440, 820, 390, 480, 481, 768, 769, 700, 701, 1100 and 1101px. Sixteen additional interaction/file states at each of 1440/820/390px provide 48 captures: input focus; download hover/focus/active; partner notice; required-field errors; email error; radio selection; upload focus; selected filenames; textarea focus; submit hover; valid preview notice; invalid extension; oversized file; exact-size-limit acceptance. Total: **118 exact before/after captures**, with PNG byte equality, plus full recorded computed properties, pseudo/placeholder styles, control values, checked/invalid states, messages and focused elements. Carets are hidden only during screenshot capture.

No approved references were regenerated. The before-mode helper refuses to overwrite existing references. Full metadata is stored losslessly in `manifest.json.gz`, with readable `summary.json` image/style hashes; the ~22 MB uncompressed files and PNGs remain local ignored review artifacts. Compression did not change any reference values. Initial BODY focus is asserted independently; serialized Next script text in BODY.textContent is excluded from the focus identity comparison because class strings necessarily change.

Final evidence:

- [Software comparison](contact-baseline/after-software/comparison.json)
- [Default-browser comparison](contact-baseline/after-real/comparison.json)
- [Before software hashes](contact-baseline/before-software/summary.json) / [after hashes](contact-baseline/after-software/summary.json)
- [Source invariants](contact-baseline/source-invariants.json): normalized text, element order, non-class attributes, field definitions and validation function unchanged
- [Desktop before](contact-baseline/before-software/1440-normal.png) / [desktop after](contact-baseline/after-software/1440-normal.png)
- [Mobile validation errors](contact-baseline/after-software/390-required-errors.png)

The required 768/480 boundaries are exact. Two overlapping enquiry-padding rules were expressed as non-overlapping range queries, preserving fractional widths as well as integer edges. Global `--u` behavior remains unchanged at 700/701. The desktop partner border is still absent on the right and restored on mobile; shorthand utility ordering was corrected during validation. Formatting had split a text run around a mobile-hidden `<br>`, producing 64 differing pixels at five intermediate widths despite identical computed styles. Restoring the original text nodes, with a narrowly scoped prettier-ignore comment, removed those differences without altering content or references.

## Behavior and safety

All existing IDs, names, types, labels, required/autocomplete attributes, ARIA relationships, error/status messages, handlers, state hooks and validation rules remain unchanged. Both real-browser profiles confirmed first-error focus, error clearing, email validation, radio changes, multiple filenames, case-insensitive allowed extensions, rejection of >5 MiB files, acceptance of exactly 5 MiB, and valid-preview status focus. File contents were generated local test buffers; no real files or recipients were used.

The test harness blocks `/api/` and all non-read HTTP methods. GET/HEAD static prefetch reads are allowed; the initial harness's harmless HEAD blocking was corrected. Final runs report no blocked API/write attempts and no browser JavaScript errors. Submit remains prevented and never contacts a server. Existing integration tests retain their established fixtures; no production CMS behavior was replaced with mock application code.

## Verification and separately recorded existing issues

- Final Next production build/static export: **passed**.
- ESLint and TypeScript: **passed**.
- SEO unit tests: **4/4 passed**; export SEO verification passed across 13 staging-mode pages.
- Browser integration: **18/18 passed** — all 16 existing tests plus two new Contact behavior/file-validation tests in `tests/contact.spec.ts`.
- Contact visual/computed/behavior matrices: **59/59 software + 59/59 default Edge passed**.
- Helpers and whitespace validation: syntax checks and `git diff --check` passed.

Existing product limitations remain unchanged: valid submit reports preview-only unavailability; partner-form request reports unavailable; no Contact API submission is implemented in this reconciled source. These were not treated as new regressions or silently integrated during styling.

An initial default-browser download-focus capture showed one photo pixel differing by one channel level, with no style/behavior difference. It is preserved in [the initial finding](contact-baseline/real-browser-finding.json); the final serial default-browser matrix subsequently matched all 59 original references exactly. No tolerance was changed.

**Outstanding prior-suite failure:** the existing three approved Privacy Policy screenshot tests currently fail in this environment. The default-profile desktop assertion reports 916,802 differing pixels; the failure reproduces with the Contact route, both client components and original CSS restored byte-for-byte from Phase 3 checkpoint `492c8864`. [Control evidence](contact-baseline/privacy-control/control.json) records identical source files and preserved actual screenshots. The same assertion failure appeared on migrated and control builds. A software-rendering control also failed, so changing the renderer did not resolve it. The cause remains unresolved; it is not claimed as an accepted rendering tolerance. Privacy source, existing tests and approved snapshots were not edited. No reference updates or relaxed assertions were used to hide it.

Thus **Contact's scoped acceptance checks pass**, but **the broader frontend visual suite is not fully green**. This is an implementation/review checkpoint, not approval for another migration, merge or deployment. Resolve the prior Privacy visual-suite baseline/environment issue separately before declaring global visual acceptance.

## Repeatable checks

From frontend directory, build before typechecking and run browser jobs serially:

```powershell
npm run build
npm run lint
npm run typecheck
npm run test:seo
npm run verify:seo
npm test
npx playwright test --config playwright.visual.config.ts
```

From worktree root:

```powershell
node docs/contact-check.cjs after
node docs/contact-check.cjs after --real
```

The helper reads compressed references when raw local manifests are absent. Do not rerun before-mode against migrated code. Existing non-fatal Node module-type and terminal-color warnings remain. Tests used installed Node 24.20.0; Node 22 CI configuration and all dependency versions remain untouched.

Stop after this Contact checkpoint. No other feature migration was started.
