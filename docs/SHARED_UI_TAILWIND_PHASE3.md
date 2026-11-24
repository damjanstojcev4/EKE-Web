# Shared UI migration — Phase 3

## Pre-migration dependency analysis (24 November 2026)

Privacy Policy checkpoint: `a05431ad` on `codex/frontend-tailwind-phase1`. This commit includes the completed pilot, preparation, tests and evidence. No push/deployment.

Keep `src/components/ui.tsx` and its exports/APIs intact. Button is a Next Link, not a native button; `download` selects the downward arrow artwork and does not set a download attribute. Do not rename it or change that behavior. Stripe must remain a div with two spans. Divider must remain an aria-hidden image with configurable asset. Keep `button`, `button-light`, `button-outline`, `stripe`, `original-divider` hooks because parent selectors and captures depend on them. Arrow markup/artwork is out of scope.

| Component | Direct consumers / contexts | Style ownership and state dependencies |
|---|---|---|
| Divider | Home ImpactSection, PartnershipsSection intro/services, NewsSection records; Footer social rows on every public page | Globals base absolute/auto height/no max width/no pointer events; late transform/opacity calibration. Parents set exact width/top/left/bottom, mobile positioning, min-height. Files include line21 default and line13/14/20 plus per-row line assets. No interactive states. Keep parent geometry and Arrow untouched. |
| Stripe | Home Hero/Partnerships/PartnerSection; About network and shared PartnerSection; Projects hero/program/shared partner; Training hero; PublicProject facts when content available | Globals base flex/relative/height/z-index and colored spans, mobile first-span 25%. Global hero/partnership/partner rules and About/Projects/Training/detail CSS Modules override geometry/first-span widths. Preserve both spans and global class hooks. |
| Button | Home hero/expertise (light solid/light outline), partnerships (navy solid/outline download), news actions (navy solid/outline), team CTA (navy), shared PartnerSection (light) on home/about/projects/opportunities; Training light CTA | Globals base and light/outline combinations; mobile font/min-height/line-height/padding/gap and late max-width/wrap/left alignment; team parent positioning. Hover/active/focus-visible set blue background/border and navy text only when not disabled/aria-disabled. Arrow image hover filter remains custom. Global anchor color reset wins over layered utilities unless selectively overridden. Focus outlines remain global/page-owned. |

Indirect affected routes: `/`, `/homepage-preview/`, `/about/`, `/projects/`, `/projects/[slug]/`, `/news/`, `/news/[slug]/`, `/training/`, `/opportunities/`, `/contact/`, `/privacy-policy/` through shared Footer. Admin/login do not render these public shared components. Existing dynamic-route manifest exposes only `unavailable`; do not refresh it or invent CMS records for visual tests.

Actual Button visual contexts cover four light/outline combinations plus outline/download. Other flag combinations are supported by the unchanged API but have no current production consumer. Existing controls with custom button styling elsewhere are not instances of this component and must not be migrated here.

Additional consumer found by direct class-name search before Button conversion: About's four unavailable-document **native buttons** use the raw global `button` class instead of the shared Link component. They are `aria-disabled="true"`, keep a not-allowed cursor and expose page-owned tooltip states. Changing them to links or editing the About page is out of scope. Retain the original base/mobile declarations behind `button.button` compatibility selectors while migrating the Link component fully to utilities. These selectors are a real remaining dependency, not dead CSS. Capture native normal/hover/focus/active states separately before Button migration and compare afterward; preserve the existing generic native-button state rules and Arrow filter.

Migration strategy: move only each component's base/mobile/variant declarations into literal Tailwind utilities; preserve unlayered contextual overrides and the scoped Arrow hover filter. Use exact theme colors/calcs; do not override parent rules with broad important utilities. Validate one component at a time before proceeding.

Baseline capture will use the unchanged local staging-source export plus read-only responses from the actual staging public API, not mock CMS implementations. Record release ID and response hashes; comparisons must fail on backend content drift rather than update screenshots. Capture full affected routes and every rendered component context; button normal/hover/focus-visible/active states at 1440/820/390px. Existing approved privacy images remain unchanged.

## Completed implementation

Migrated in order: **Divider → Stripe → Button**, validating each before proceeding. Kept all exports in `ui.tsx`; no extraction, rename, wrapper component, prop changes or additional dependencies. Production changes after the checkpoint are limited to `src/components/ui.tsx` and component-owned rules in `src/app/globals.css`. Privacy Policy remains committed and untouched.

- Divider: position, auto height, max-width, pointer events, exact translated stroke alignment and opacity now use utilities. Asset API, empty alt, aria-hidden and class hook remain unchanged.
- Stripe: flex/relative positioning, exact scaled height, z-index, first-span width and <=700px 25% width, colors and second-span flex now use utilities. Child count/order and aria-hidden remain unchanged. Parent selectors still win for page geometry.
- Button: base layout, exact scaled padding/gap/border/radius/font/min-height, colors, four visual variants, <=700px behavior and guarded hover/active/focus-visible colors now use utilities. Theme colors are reused. Important text utilities address the existing unlayered anchor color reset; no global important setting was enabled. Arrow asset selection and filter CSS are unchanged. `download` continues to select artwork without adding an HTML download attribute.

### CSS reduction and remaining dependencies

| Owner | Declarations removed | Remaining dependency |
|---|---:|---|
| Divider | 6 | Unchanged parent widths/offsets/min-heights on home sections and Footer |
| Stripe | 9 | Unchanged global/page-module height, width, positioning and first-span overrides |
| Button variants/state colors | 9 | 22 base/mobile declarations narrowed to `button.button` solely for About's native document controls |
| **Net reduction** | **24** | Arrow filter, native-control compatibility and page-specific geometry intentionally retained |

Global authored CSS decreased from **1,298 to 1,274 declarations**, and from **440 to 430 rule blocks**. The migrated Link component no longer depends on the retained native-button base/mobile declarations. Generic native-button interaction rules and global/page focus outlines remain out of scope. Remove the 22 compatibility declarations only when About's native controls are independently migrated and validated; do not turn them into links merely to share styles.

## Visual baselines, controls and exact results

Reference source is the approved deployed staging commit `dd76db4434f103cf8b7b93c20ccaea7190abd2e2` plus the zero-pixel Privacy Policy checkpoint `a05431adee1560b133e951f57865014347ac9882`. The live release marker remained `dd76db4434f103cf8b7b93c20ccaea7190abd2e2-45292330641-1`. The real API response hashes remained identical across accepted comparisons; all live API calls were GET-only. No fixtures replaced public backend behavior in these captures, and no records or credentials were changed.

Pinned browser: Windows Edge **158.0.4370.33**, DPR 1, reduced motion, en-GB, Europe/Skopje. The full-context suite uses **`--disable-gpu`** and runs serially. Button/native galleries use the original Edge launch configuration and also pass exactly. The three original Privacy Policy snapshots still run separately in their unchanged configuration.

The initial default-rendering full-page suite exposed tiny rasterization differences, including 5,948 pixels with maximum channel difference 1 on desktop Opportunities **even when rebuilt from the unchanged checkpoint**. Repeated captures also varied without source changes. Those diagnostics are preserved under `before`, `divider`, `divider-recheck` and `control-recheck`; they were not accepted as passes. A separate `before-software` reference was captured while the unchanged checkpoint export was built. All four problematic unchanged-source controls then matched exactly in `control-software-recheck`. No approved Privacy Policy images were regenerated, no pixel threshold was relaxed and no regions were masked. A later one-pixel portrait difference during concurrent browser jobs was investigated and the Stripe matrix rerun serially; the accepted result is zero differences. Run the suites serially to keep the rendering environment isolated.

| Accepted comparison | Screenshots compared | Changed pixels / image hashes | Computed differences | API drift |
|---|---:|---|---:|---|
| Divider vs unchanged-source software reference | 324 | **0; all PNG bytes identical** | 0 | None |
| Stripe vs same reference | 324 | **0; all PNG bytes identical** | 0 | None |
| Final Button / all shared components vs same reference | 324 | **0; all PNG bytes identical** | 0 | None |
| All 8 Button flag combinations, 3 sizes × 4 states | 96 | **0; all PNG bytes identical** | 0 | Not applicable: actual component SSR, no API fixtures |
| About native buttons and tooltip states | 88 (48 button + 40 tooltip) | **0; all PNG bytes identical** | 0 | Not applicable: static About content |
| Original approved Privacy Policy suite | 3 | **0 changed pixels** | Existing hover/focus assertions pass | No API reads |

Final shared coverage is **508 exact before/after screenshot comparisons**, plus the three original Privacy Policy assertions. The 324-context matrix includes 11 route contexts × 3 viewports, persisted Past-project views, and every rendered shared Link's normal, hover, keyboard focus-visible and mouse-active states. Capture metadata confirms focus-visible/active were actually engaged. Full-page images also cover the changed shared primitives as rendered in Footer across routes; no Footer code was migrated.

Tested routes: `/`, `/homepage-preview/`, `/about/`, `/projects/` (Ongoing and Past), `/projects/unavailable/`, `/news/`, `/news/unavailable/`, `/training/`, `/opportunities/`, `/contact/`, `/privacy-policy/`. Sizes: **1440×1000**, **820×1180**, **390×844**. All currently rendered Divider asset contexts and Stripe parent overrides are included. The actual staging content state has no published news/training/opportunities, persisted projects, and unavailable detail placeholders; no synthetic CMS content was published. Populated news's default Divider context and project-detail facts Stripe require populated staging data before those feature pages are migrated; their unchanged APIs, assets and contextual selectors are preserved here.

Button gallery renders the actual exported component through React SSR for all `light`/`outline`/`download` combinations; it does not add an application route or substitute backend behavior. Link href/tag/download-attribute/arrow selection and states match. Enter activates the link to Contact. Native About buttons preserve `aria-disabled`, tooltip visibility and image states; Enter leaves the page unchanged.

Computed values were compared after obsolete base rules were removed, including size, position, colors, borders, spacing, typography, opacity, transform, flex and interaction/Arrow-filter values. A separate CDP check confirmed the actual matched generated utilities for Divider, Stripe, Stripe color and Button; see [utility rule evidence](shared-ui/utility-rules.json). This guards against passing comparisons merely because old component base declarations still win.

### Evidence and repeatable commands

- [Divider comparison](shared-ui/divider-software/comparison.json)
- [Stripe comparison](shared-ui/stripe-software/comparison.json)
- [Final comparison](shared-ui/button-software/comparison.json)
- [Button variants](shared-ui/gallery-after/comparison.json)
- [Native controls/tooltips](shared-ui/native-buttons-after/comparison.json)
- [Unchanged-source software control](shared-ui/control-software-recheck/comparison.json)

PNGs remain on disk under `docs/shared-ui/<phase>/`; for example [before desktop](shared-ui/before-software/desktop-home.png) / [final desktop](shared-ui/button-software/desktop-home.png). Generated PNGs are ignored by the local artifact directory's `.gitignore` to keep future source review manageable; manifests pin their exact hashes. Attach/archive the PNG evidence with review artifacts rather than regenerating it. Initial failed diagnostic images remain distinct from accepted comparisons. Do not overwrite `before-software` after migration.

From repository/worktree root, **run browser commands serially**:

```powershell
node docs/shared-ui-check.cjs button --software
node docs/shared-button-gallery.cjs after
node docs/shared-button-gallery.cjs after --native
node docs/shared-ui-rules.cjs
```

These use existing installed dependencies, loopback-only test servers and actual read-only staging API responses where needed. API/content/release drift fails acceptance rather than silently updating a reference. No deployment scripts were invoked. Existing integration tests continue using their established local test fixtures; those tests were not rewritten to fake production behavior.

## Verification and stop point

After each component: production build passed, 16 existing integration tests passed, 3 unchanged Privacy Policy visual tests passed, and the corresponding accepted 324-context comparison passed. Final build/export, ESLint, standalone TypeScript, 4 SEO unit tests and export SEO verification across 13 staging-mode pages all passed. Final gallery/native keyboard checks passed. All accepted captures report no browser JavaScript errors. `git diff --check` and helper syntax checks passed.

Initial rendering/readiness issues were test-harness diagnostics, not accepted app regressions. The harness now waits for relevant API responses and visible loading completion, loads lazy filtered images, and uses isolated software rendering for whole-page comparisons. Existing non-fatal module-type/terminal-color warnings remain; no existing failing tests were waived. Validation used the installed Node 24.20.0; the repository's Node 22 CI configuration and all dependencies remain unchanged.

**Stop after these three shared components.** No feature page, Header, Footer, navigation, Arrow artwork, backend, CMS/auth/data contract, SEO/routing, dependency or infrastructure migration was performed. No PR, merge, push or deployment. The original checkout and unrelated worktree changes were preserved. The next feature migration needs its own selected scope and content/state baselines.
