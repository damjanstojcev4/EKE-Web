# Privacy Policy Tailwind pilot — complete

24 November 2026. Worktree `D:/eke-web/.worktrees/frontend-tailwind-phase1`, branch `codex/frontend-tailwind-phase1`, base `dd76db4434f103cf8b7b93c20ccaea7190abd2e2`.

## Scope and implementation

Only Privacy Policy production files changed in this phase: `src/app/privacy-policy/page.tsx` and its CSS Module. Phase 1's additive theme import/tokens and test configuration remain as prepared. No other feature page, Header/Footer implementation, route/layout, backend/CMS, dependency or workflow was changed. No commit, PR, merge, push or deployment was made.

The page now expresses ordinary styling directly in JSX: wrapper isolation/background/overflow, decorative image positions and sizes, main/header spacing and typography, two-color divider, article width/spacing/type/wrapping, section spacing, heading sizes, lists, square pseudo-element markers and link hover underlines. It reuses `bg-surface-muted`, `before:bg-brand-navy` and the existing turquoise/blue theme values for the divider. No font utility was added because the approved font already inherits from the root layout/body.

All original values remain exact, including viewport-scaled `calc()` dimensions, negative offsets, line heights, indents, the 1100px/700px inclusive max-width media rules, and the >=1101px footer rule. No new wrapper/component was introduced; existing OrganisationDetails, Header, Footer and structured data remain. An AST comparison confirmed identical normalized JSX text, element sequence and non-class attributes against baseline; metadata export and imports remain unchanged.

## Selector inventory and retained CSS

Original module: 10 local class names, **39 rule blocks / 95 declarations**. Final module: two local hooks, **3 rule blocks / 5 declarations**. **90 declarations removed**, with no ordinary layout/typography rules left in the module.

| Original selector family | Replacement |
|---|---|
| `.page` | JSX utilities for relative positioning, isolation, surface background and clipping; class retained solely to scope shared overrides |
| `.decorations`, descendant `img`, `.second`, `.third` | JSX position, overflow, pointer events, z-index and exact image geometry |
| `.first` | JSX geometry; custom polygon mask retained |
| `.main`, `.main h1` | JSX padding, margins, exact type, weight and line height |
| `.divider` | JSX exact height/margins and arbitrary gradient referencing centralized tokens |
| `.document` | JSX width, margins, typography, line height and overflow wrapping |
| `.updated`, `.updated::before`, `.details li::before` | JSX position, indent, responsive square dimensions, color and transform |
| `.document section + section` | Explicit margin utilities on sections after the first |
| `.document h2` | Direct heading utilities |
| `.document p + p`, `ul`, `ul + p` | Direct margin/list/padding utilities on the affected elements |
| `.document .details`, `.details li` | Explicit list-none/zero padding, positioning and pseudo-element utilities |
| `.document a:hover` | Direct `hover:underline!` |

Remaining custom CSS is intentional:

1. `.first` polygon clip-path hides the date outlined inside the SVG while keeping the accessible HTML date. Retaining this artwork definition is clearer than a long JSX polygon string.
2. `.page :global(.footer)` at >=1101px preserves the page-specific shared-footer height and negative top margin. Shared Footer and its unlayered global sizing remain out of scope.
3. Page-scoped anchor/button `:focus-visible` preserves the existing 2px navy outline/4px offset across Header/Footer as well as the document, without editing shared component code or global layers.

Inherited dependencies reviewed: Tailwind Preflight; root local-font variables and body font/color/weight; unlayered heading/paragraph margin reset; link color/text-decoration reset; global focus defaults; `main` overflow; `--u`/`--s` mobile changes; Header/Footer styles; TextReveals element selectors. There are no page animations or new client handlers. Existing pseudo-elements and hover/focus behavior remain intact.

Unlayered global resets win over layered Tailwind utilities. Targeted important utilities preserve heading/paragraph margins and hover underlining; no global important mode was enabled. These compatibility flags should be revisited only when the corresponding global resets are migrated, not removed while those rules still win. No unlayered replacement rules were added for ordinary page styling.

## Exact visual and computed-style results

Approved snapshots were **not modified**. Byte comparisons confirm all three snapshot files remain identical to their archived staging captures. Final Playwright comparison uses Windows Edge **158.0.4370.33**, DPR 1, reduced motion, en-GB and Europe/Skopje.

| Viewport | Approved staging snapshot | Local before/after PNG | Recorded computed styles / hover / focus |
|---|---|---|---|
| 1440×1000 | Pass, **0 changed pixels** | Byte-identical | Identical |
| 820×1180 | Pass, **0 changed pixels** | Byte-identical | Identical |
| 390×844 | Pass, **0 changed pixels** | Byte-identical | Identical |
| 700×1000 | Additional pre-migration edge capture | Byte-identical | Identical |
| 701×1000 | Additional pre-migration edge capture | Byte-identical | Identical |
| 1100×1000 | Additional pre-migration edge capture | Byte-identical | Identical |
| 1101×1000 | Additional pre-migration edge capture | Byte-identical | Identical |

Before captures came from the unchanged Phase 1 local export; the three approved snapshots remain the staging authority. Boundary captures are additional local pre-migration references, not replacements for approved staging screenshots.

Recorded 28 computed properties plus `::before` values across 134 main/footer/wrapper elements at each width. All recorded values match after obsolete declarations were removed, including font metrics, spacing, dimensions, list style, pseudo content/geometry, gradient and wrapping. With those declarations absent from the module and only three documented custom rules remaining, matching values confirm utilities actually supply the migrated styles. Hover underlining and focus outline/offset also match, and permanent visual tests now assert those link states.

Artifacts: [machine-readable comparison](privacy-pilot/comparison.json), [before measurements](privacy-pilot/before/measurements.json), [after measurements](privacy-pilot/after/measurements.json). Screenshots are named by width in those two directories, e.g. [desktop before](privacy-pilot/before/1440.png) / [desktop after](privacy-pilot/after/1440.png), [tablet after](privacy-pilot/after/820.png), [mobile after](privacy-pilot/after/390.png). The seven-width capture helper is `docs/privacy-pilot-check.cjs`; its `after` mode compares against saved `before` measurements. Do not rerun `before` against migrated output and overwrite the reference.

## Verification and failures

- ESLint: passed.
- TypeScript: passed after final build.
- Next production build and export normalization: passed; public/admin/login/static detail routes preserved.
- Existing integration suite: **16/16 passed**, covering local CMS/admin/API fixtures and responsive content. No live CMS mutations or Java/backend edits.
- SEO unit tests: **4/4 passed**. Export SEO verification: passed across 13 staging-mode pages.
- Privacy visual suite: **3/3 passed**, zero pixel tolerance; hover/focus assertions also passed.
- Seven-width manual capture/computed comparison: all seven PNG hashes, recorded style values and link states identical.
- Approved snapshot files unchanged; `git diff --check` passed. Generated next-env.d.ts was restored to its pre-task contents.

No existing failing checks were found. Existing Node module-type and Playwright terminal color warnings remain non-fatal. Commands ran with the available Node 24.20.0; CI remains configured for Node 22 and was not changed or triggered.

During implementation, strict checks caught missed utilities on self-closing divider/artwork elements and a hover cascade conflict; both were corrected before final acceptance. One intermediate typecheck overlapped a production build regenerating `.next/types`, causing transient missing-generated-file errors; the final check ran after build and passed. An invocation from repository root instead of the frontend directory was corrected. These were execution/intermediate issues, not unresolved baseline failures. No baselines were updated to resolve them.

## Lessons and next step

- Utility conversion must include self-closing artwork/dividers and pseudo-elements, not just text containers.
- Normal-state screenshots alone miss hover regressions. Keep interaction assertions and computed-style comparisons alongside pixel tests.
- Preserve inclusive media boundaries explicitly; 700/701 and 1100/1101 checks caught the exact transition contracts without adopting Tailwind defaults.
- Narrow shared-component compatibility CSS is preferable to expanding scope into the navbar/footer. Avoid speculative component extraction.
- Exact-value arbitrary utilities are verbose but preserve the approved geometry; token reuse helps colors without rounding dimensions or redesigning typography.
- Run build before standalone typecheck, sequentially, because generated route types are build outputs.

**Pilot complete. Stop here.** No other page migration is authorized by this phase; the next page should be selected and its necessary CMS/interactive baselines approved separately.
