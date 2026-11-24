# EKE Tailwind migration audit and plan

> Phase 3 shared UI migration completed: [dependency analysis, results and retained CSS](SHARED_UI_TAILWIND_PHASE3.md). Divider, Stripe and Button retain their APIs and DOM semantics. Accepted results: 324 exact shared-route/state comparisons after each component; 96 Button variant and 88 native-button/tooltip comparisons; original Privacy Policy snapshots still pass. Net 24 legacy declarations removed; 22 native About-button declarations retained intentionally. No further feature-page migration has started.

> Phase 2 Privacy Policy pilot completed: [results and retained-CSS rationale](PRIVACY_POLICY_TAILWIND_PILOT.md). Three approved staging snapshots pass with zero changed pixels; four additional breakpoint-edge captures and all recorded computed/hover/focus values match. Page CSS reduced from 95 to 5 declarations. No other page migration has started.

> Phase 1 reconciliation completed on 24 November 2026: see [TAILWIND_SOURCE_RECONCILIATION.md](TAILWIND_SOURCE_RECONCILIATION.md). The verified baseline is `origin/staging` at `dd76db4434f103cf8b7b93c20ccaea7190abd2e2`; implementation worktree is `D:/eke-web/.worktrees/frontend-tailwind-phase1`, branch `codex/frontend-tailwind-phase1`. The inventory below remains historical for audited HEAD `4aaf5396`; it is not the active CMS inventory. Staging includes admin/login, API clients, behavioral Playwright tests and two additional CSS modules. Three Privacy Policy staging screenshots pass strict zero-pixel comparison against the reconciled source plus additive theme aliases. GO for that isolated pilot; populated CMS/admin visual coverage remains required before migrating those features. No page styling migration has begun.

Audit date: 24 November 2026 (Europe/Skopje). Scope: `Frontend/ece-website`.
Local HEAD: `4aaf539670c62da0405722ea7fd330b188d81ef7`.
Approved visual reference supplied by the user: https://preview.ekebitola.org.

## 1. Recommendation and scope

Keep the existing Next.js App Router and migrate styling incrementally within its current page boundaries. Use feature folders for page-specific components, a small shared UI folder, CSS-first Tailwind v4 theme tokens, and narrowly scoped CSS for artwork, animation and content that cannot sensibly carry utilities. Do not replace this with a generic design system or extract every section into a reusable component.

This deliverable changes documentation and adds audit screenshot helpers/artifacts only. No production application, backend, dependency, routing, CMS or authentication code was changed. No Figma tools or remote Figma resources were accessed. Existing unrelated working-tree changes were left intact.

**Migration gate:** staging is not the same application revision as this checkout. Its public release identifier is `dd76db4434f103cf8b7b93c20ccaea7190abd2e2-45292330641-1`. Staging has a news category selector and an empty published-news state; local `news/page.tsx` renders mock articles and pending media controls. Reconcile the actual deployed frontend source and CMS behavior before converting styles. Do not overwrite deployed integrations with this checkout's mock-data behavior. These screenshots establish the current staging appearance, not proof that local source matches staging.

## 2. Current architecture

- Next.js **16.4.6**, React 19, TypeScript. `next.config.ts` uses static export, trailing slashes and unoptimized images. Development uses `.next-dev`; production builds use `.next`, then `scripts/normalize-export.mjs` processes `out/`.
- `src/app/layout.tsx` loads two local variable fonts, global CSS, site structured data and the client-side `TextReveals` enhancement. Header/Footer are rendered separately by pages, not by a common site layout. Route-specific wrappers currently contain them and influence their styles.
- Public page routes: `/`, `/about`, `/projects`, `/projects/[slug]`, `/news`, `/news/[slug]`, `/training`, `/opportunities`, `/contact`, `/privacy-policy`. `/homepage-preview` re-exports the homepage with noindex metadata. `robots.ts` and `sitemap.ts` implement metadata routes. Dynamic detail routes use static parameters; preserve pending-content and unknown-slug behavior.
- Homepage sections already live under `components/home`. Projects, news, contact, about and project details have some extracted components, but large route files still compose page-specific sections directly. This is acceptable until an extraction has a clear maintenance benefit.
- `components/ui.tsx` exports `Button` (actually a Next Link), `Arrow`, `Stripe`, `Divider`. `ContentBlock` renders rich content plus styling from `content/site-content.tsx`. That content file already contains many literal Tailwind arbitrary-value utilities; content and presentation are coupled.
- `components/projects/ProjectsList` owns status filtering; `ProjectCard` owns card markup. Both import the projects route stylesheet. News sidebar/share import the detail route stylesheet; `PendingControl` imports the news listing stylesheet even when used inside article content. Contact components also import route stylesheets. These dependencies should eventually point to their feature, never back into `app`.
- `data/*.mock.ts`, `types/*`, `content/*` and `lib/seo*.ts` provide source-checkout data, copy and SEO. No fetch-based CMS client, admin route or authentication implementation was found in this frontend's `src`. Robots exclusions for `/admin`, `/auth`, `/login`, `/api` do not establish implemented routes. Backend/CMS/admin protection must be verified against deployed source and infrastructure separately; it cannot be certified by this checkout alone.
- ContactForm currently validates fields and file types/sizes, shows filenames and explicitly prevents submission. PartnerFormNotice and news pending controls report unavailable features. Preserve these local behaviors when testing local parity, while preserving actual integrated behavior in the reconciled staging revision. Do not add or remove integrations as part of styling.

## 3. CSS inventory and ownership

All paths below are relative to `Frontend/ece-website/src`. There are **10 authored CSS files**, all imported, totaling **4,650 declarations**, **1,613 rule blocks**, and **88 `!important` declarations**. Generated build CSS and dependencies are excluded.

| CSS file | Lines | Local class names | Rules | Declarations | Consumers |
|---|---:|---:|---:|---:|---|
| `app/globals.css` | 2,054 | 95 | 463 | 1,315 | Root layout; global base, Header/Footer, home sections, shared UI/ContentBlock, shared PartnerSection |
| `app/about/page.module.css` | 945 | 30 | 147 | 487 | About route; global descendant overrides reach PartnerSection/Footer |
| `app/projects/page.module.css` | 1,072 | 33 | 235 | 573 | Projects route, ProjectsList, ProjectCard |
| `app/projects/[slug]/page.module.css` | 542 | 22 | 109 | 302 | Project detail route, including pending content |
| `app/news/page.module.css` | 147 | 31 | 137 | 369 | News route, PendingControl; indirectly article content with pending links |
| `app/news/[slug]/page.module.css` | 104 | 23 | 97 | 273 | Article route, ArticleSidebar, ArticleShare; article body descendants |
| `app/training/page.module.css` | 897 | 36 | 172 | 524 | Training route |
| `app/opportunities/page.module.css` | 638 | 28 | 111 | 393 | Opportunities route; shared CTA/footer/arrow overrides |
| `app/contact/page.module.css` | 554 | 29 | 103 | 319 | Contact route, ContactForm, PartnerFormNotice |
| `app/privacy-policy/page.module.css` | 195 | 10 | 39 | 95 | Privacy route; footer override |

Counting method: parse authored CSS with the installed PostCSS parser, count each class spelling once per stylesheet after excluding `:global(...)` references from modules. This yields **337 stylesheet-scoped class identities** (95 global + 242 module-local). Including global references inside each stylesheet gives 358 per-file class references; deduplicating all spellings across stylesheets gives **284**. Repeated `.hero` names in different modules are distinct classes. Class counts are selector inventory, not rendered-element counts or proof of dead CSS. Rules inside media queries and keyframes are included in the rule-block total. Line counts split on newlines, including trailing empty lines; compact news stylesheets have many declarations per line.

There are **8 unique authored CSS custom properties**, all defined in globals:

| Variable | Role |
|---|---|
| `--u` | `calc(100vw / 1920)` desktop design unit; becomes `1px` at max-width 700px |
| `--s` | `calc(100vw / 1920px)` artwork scaling factor; becomes `1` on mobile |
| `--dark-blue` | `#212c5d` |
| `--light-blue` | `#4da6ff` |
| `--tirkiz` | `#00e2bc` |
| `--white` | `#fff` |
| `--hero-lift` | Local hero geometry offset |
| `--hero-heading-line` | Animated hero line height, responsive override |

Two additional application font properties (`--font-google-sans`, `--font-google-flex`) are configured through `next/font/local`, giving **10 application-level names** when generated font bindings are included. Tailwind-generated `--tw-*`/default theme variables are excluded. Nine unique variable names are referenced by authored CSS; `--white` is defined but not referenced there. Do not remove it without a broader usage check.

## 4. Tailwind configuration assessment

- `package.json` requests `tailwindcss` and `@tailwindcss/postcss` at `^4.1.0`; **installed and lockfile-resolved versions are both 4.3.3**. Report the resolved version rather than calling this v4.1.
- `postcss.config.mjs` correctly registers `@tailwindcss/postcss`. `app/globals.css` begins with `@import "tailwindcss"` and root layout imports that CSS.
- No Tailwind JS config or `@theme` exists. A JS config is not required for this v4 setup. Automatic source detection picks up literal utilities in TSX; existing exported CSS includes the Tailwind v4.3.3 banner, theme layer and generated `.font-bold` utility. The existing export is supporting historical evidence, not a freshly built validation of the current dirty checkout.
- Configuration is operational, but shared application design values are not exposed through Tailwind theme tokens. Repeated hex values and scaled `calc()` values appear in CSS and TSX.
- **Cascade risk:** existing custom CSS is unlayered, while Tailwind utilities are layered. Normal unlayered declarations can override new utilities regardless of markup class order. There are also mobile `!important` overrides (83 in globals, four in projects, one in news). Do not globally enable important utilities or move the entire stylesheet into a layer in one step.
- `Arrow` dynamically concatenates custom class names. When converting, replace utility-name concatenation with complete literal class strings in a typed map. Preserve currently consumed class hooks until consumers are migrated.
- Do not upgrade dependencies during migration. Read installed Next.js guides as required by `AGENTS.md` before any future implementation, especially before route/layout moves.

Reference: Tailwind's [v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide) explains native cascade layers; [functions and directives](https://tailwindcss.com/docs/functions-and-directives) documents CSS configuration and source directives.

## 5. Proposed practical structure

Keep URLs and server/client boundaries. The route group below is an eventual cleanup, in its own reviewed change after page styling parity; it is not necessary to begin utility conversion.

```text
src/
  app/
    layout.tsx                 # fonts, global CSS, site SEO, TextReveals
    globals.css                # Tailwind import, theme import, minimal base
    robots.ts
    sitemap.ts
    (site)/
      layout.tsx               # eventual Header/children/Footer shell
      page.tsx
      homepage-preview/page.tsx # preserve alias + noindex
      about/page.tsx
      projects/page.tsx
      projects/[slug]/page.tsx
      news/page.tsx
      news/[slug]/page.tsx
      training/page.tsx
      opportunities/page.tsx
      contact/page.tsx
      privacy-policy/page.tsx
  components/
    layout/                    # Header, Footer, menu; scoped artwork if needed
    ui/                        # ButtonLink, Arrow, Stripe, Divider, ContentBlock
    shared/PartnerSection.tsx  # already used across multiple pages
    SeoStructuredData.tsx
    TextReveals.tsx
  features/
    home/                      # existing home sections, hero animation/artwork
    about/                     # page-only sections/content when extracted
    projects/                  # ProjectsList, ProjectCard, EmphasizedText, content
      detail/ProjectImage.tsx
    news/                      # article content, sidebar, share, PendingControl
    training/                  # only extracted pieces with a practical benefit
    opportunities/
    contact/                   # ContactForm, PartnerFormNotice
  styles/theme.css             # centralized v4 @theme / @theme inline values
  content/                     # existing approved copy; preserve rich text
  data/                        # existing data contracts, no integration rewrite
  types/
  lib/                         # SEO and established helpers
tests/visual/                  # future Playwright assertions
```

Do not create empty feature folders or one-line wrapper components. Keep single-use markup in its page until extraction makes ownership clearer. During transition, route CSS modules remain in place. Relocate any retained module to the owning feature when its imports change in a separate mechanical commit.

Before adopting the shared shell, remove page-owned Header/Footer only in that dedicated change, preserve each page's existing wrapper ancestry, `main#main`, breadcrumbs and landmark structure, and test route-to-route navigation. Existing `.page :global(.footer)` and navbar rules require explicit page variants or another tested replacement before shell relocation. Keep root layout separate so future admin/auth routes need not inherit the public shell. Do not add admin/auth routes now.

## 6. Component migration map and reuse

| Current component/area | Intended owner / reuse | Migration approach | Risk |
|---|---|---|---|
| `ui.tsx` Button | `components/ui/ButtonLink` | Preserve link semantics and light/outline combinations; exact sizing and arrow artwork | Medium, sitewide |
| Arrow, Divider, Stripe | `components/ui` | Keep current asset files, dimensions, transform order; scope artwork CSS | High for arrows |
| Header/Footer | `components/layout` | Utilities for layout; retain dialog/backdrop and social-mask CSS initially; preserve active links, focus, Escape and scroll restoration | High |
| `home/PartnerSection` | `components/shared` | Reuse already established on home/about/projects/opportunities; expose explicit visual variants only where existing differences require them | Medium/high |
| ContentBlock + site-content | UI + existing content | Keep rich text and semantic `as`; migrate styles without rewriting approved content or line breaks | High typography |
| TextReveals | Existing shared enhancement | Keep JS behavior; preserve selector hooks or migrate to data attributes in a separate behavior-tested change | High if hooks removed |
| Home sections / HeroHeadline | `features/home` | One section per PR; hero masks, layering and word animation last | High |
| ProjectsList/ProjectCard | `features/projects` | Preserve Ongoing/Past state, aria-pressed, sticky filters, result announcements and pending tooltip | Medium/high |
| ProjectImage + detail route | `features/projects/detail` | Preserve images, fallback/pending state and static slugs; convert facts/layout independently | Medium |
| ArticleContent/Sidebar/Share | `features/news` | Keep rich body rendering, expansion, encoded share URLs and pending links; scoped body typography is reasonable | Medium/high |
| PendingControl | `features/news` initially | Share inside news only; generalize only when a second real feature needs the same behavior | Medium |
| ContactForm/PartnerFormNotice | `features/contact` | Style native controls and errors without changing event handling, IDs, validation, uploads or submission semantics | High functional |
| About/Training/Opportunities | Page-specific features as needed | Keep distinct hero/card structures; avoid forcing unlike cards into one component | Medium/high |
| Privacy policy | Route page | Low-coupling pilot for body spacing/type, retain text and all anchors | Low/medium |

Existing reusable primitives and PartnerSection are sufficient starting points. Similar news/card metadata may merit a small shared news component after parity; do not prematurely merge project, training, opportunity and news cards with different DOM, artwork or state models.

## 7. CSS-to-Tailwind conversion strategy

### Safe candidates after ownership and cascade checks

Simple display, position, flex/grid alignment, overflow, object-fit, white-space, borders, color, font weight and conventional spacing can move directly to utilities. Examples grounded in the source:

| Current declaration/pattern | Candidate utility approach |
|---|---|
| `.actions { display:flex; align-items:flex-start; gap:calc(26 * var(--u)) }` | `flex items-start gap-[calc(26*var(--u))]` |
| `.articleCopy { display:flex; flex-direction:column; align-items:flex-start }` | `flex flex-col items-start` |
| `.hero-photo img { object-fit:cover }` | Put `object-cover` on the actual image |
| PartnerSection inline `position:relative; zIndex:1` | `relative z-[1]` |
| Repeated `color:#212c5d` / background blue | `text-brand-navy` / `bg-brand-blue` after token registration |
| `grid-template-columns:minmax(0,1fr) ...` | Exact `grid-cols-[...]`, including scaled columns where required |
| Native active filter `[aria-pressed=true]` | `aria-pressed:*` variants on the button, exact existing colors |

Preserve full `calc()`/`clamp()` expressions, fractional dimensions, opacity, negative offsets, line heights, transform origins and image crops. Do not round values onto Tailwind's default spacing scale. Utility coverage is a maintainability goal, not a reason to alter the design.

For each component: inventory its base/media/state/ancestor rules; record computed values; migrate one coherent styling group; remove the corresponding legacy declarations only after side-by-side validation. Keep the original stylesheet available in Git and leave unrelated declarations intact. Merely adding utilities alongside winning legacy styles does not validate the replacement: verify the utility actually wins in computed styles, then test the removal patch before accepting it. Do not delete a whole file until all its consumers and global references are validated.

Use full literal variant strings, not runtime fragments. Do not use broad `@apply` recipes to recreate the current monolithic CSS. Do not use important flags as a permanent workaround. Audit unlayered selectors, `:global`, descendant selectors and source order whenever utilities appear ineffective.

### CSS that should remain, or remain initially

- Minimal base/document rules, font bindings, `--u`/`--s` breakpoint behavior, scroll-padding, focus defaults and accessibility helpers as needed. Keep Preflight behavior unchanged.
- Hero mask assets/coordinates, composite image masks, decorative vector placement and calibrated arrow filters/transforms: retain short scoped styles initially. Many can technically be arbitrary utilities, but opaque strings would reduce clarity without reducing regression risk.
- `hero-word-slide` and `menu-reveal` keyframes and reduced-motion behavior. Retain CSS animation definitions; their invocation can become utilities later. Keep Web Animations API logic in TextReveals unchanged.
- Native dialog `::backdrop` styling and complex state combinations until their exact behavior is covered. Simple dialog layout can still use utilities.
- Article rich-content descendants, where structured content produces headings/lists/paragraphs centrally: a small feature-scoped typography module is practical; no typography plugin is necessary.
- Temporary compatibility selectors for ContentBlock and TextReveals hooks, and cross-page footer/CTA variants, until all dependent consumers have migrated.

No selector is inherently required to remain custom forever. The durable exceptions are global browser behavior, animation definitions, complex artwork and rich-content styling; temporary exceptions must have an owner and removal condition.

## 8. Design token strategy

Use Tailwind v4 CSS theme configuration in one `styles/theme.css` imported through globals. Start with exact aliases, leaving current variable names available until migrated:

```css
@theme {
  --color-brand-navy: #212c5d;
  --color-brand-blue: #4da6ff;
  --color-brand-turquoise: #00e2bc;
  --color-surface: #fff;
  --color-surface-muted: #fafafa;
}
@theme inline {
  --font-sans: var(--font-google-sans), Arial, sans-serif;
  --font-flex: var(--font-google-flex), sans-serif;
}
```

This is a proposed snippet, not applied code. Keep `--u` and `--s` runtime geometry variables rather than redefining Tailwind's global spacing unit. Keep page-local hero variables local. Only promote radii, spacing, type scales or motion timing when repeated values have the same design meaning; fixed mobile and scaled desktop values must not be merged accidentally. Use arbitrary values for one-off artwork.

Preserve authored media boundaries exactly: 480/481, 700/701, 768/769, 1000/1001, 1100/1101 and 1500/1501 where applicable. Prefer explicit arbitrary media variants initially, e.g. `[@media(max-width:700px)]:hidden`; this retains inclusive `<=700px` semantics. Do not silently replace with `md:` (768px) or a strict `<700px` max variant. Named breakpoint tokens can follow after verifying generated queries and unit ordering. Preserve intervals such as 769–1100px explicitly.

## 9. Visual baseline and observed responsive behavior

Audit screenshots and machine-readable evidence are in [tailwind-baseline](tailwind-baseline/manifest.json). `capture.cjs` uses the already-installed Playwright package and installed Edge, without adding dependencies. Run from repository root: `node docs/tailwind-baseline/capture.cjs`. Supplementary inspection: `node docs/tailwind-baseline/inspect-staging.cjs`.

The capture matrix uses desktop **1440×1000**, tablet **820×1180**, mobile **390×844**, DPR 1, Edge **158.0.4370.33**, reduced motion enabled. Captures occurred on 24 November locally; JSON timestamps use UTC, which can fall on 23 November. **42 PNGs** were captured: 36 primary screenshots and six supplementary category-focus/selection screenshots. Full-page screenshots cover all eight top-level public pages; additional viewport/full-page captures cover the home CTA hover, expanded navigation, Past project filter and invalid contact submit at each size. Supplementary screenshots cover the staging news category control. The primary capture reported zero page JavaScript errors and no horizontal overflow at those three widths. Supplementary homepage boundary measurements confirm hidden desktop nav through 700px and visible nav from 701px, with no horizontal overflow at the 12 measured widths. These are scoped observations, not full functional certification. The release ID remained unchanged across supplementary inspection. No form was successfully submitted, no upload was made and no CMS data was changed.

Representative files:

- [Desktop home](tailwind-baseline/desktop-home.png), [tablet home](tailwind-baseline/tablet-home.png), [mobile home](tailwind-baseline/mobile-home.png).
- [Desktop menu](tailwind-baseline/desktop-menu.png), [tablet menu](tailwind-baseline/tablet-menu.png), [mobile menu](tailwind-baseline/mobile-menu.png).
- [Projects Past](tailwind-baseline/desktop-projects-past.png), [tablet news](tailwind-baseline/tablet-news.png), [mobile contact errors](tailwind-baseline/mobile-contact-errors.png).

Observed/source-backed behavior to preserve:

- Desktop and tablet retain the scaled header links; at <=700px the header switches to a fixed-pixel mobile composition and hides desktop navigation. `--u` changes from viewport scaling to `1px` and `--s` to `1` at that boundary.
- The expanded navigation is a full-viewport native dialog. Desktop has feature imagery and an aside; <=1500px tightens geometry, <=1000px stacks the aside, <=700px switches to the white mobile link list, social icons and tagline. Closing uses Escape/button and restores document scrolling.
- Home uses a scaled desktop artwork layout and a separate flowing mobile composition; masks disappear and typography wraps differently on mobile. Reduced motion selects a stable first hero word and suppresses reveal animation.
- Projects uses desktop sticky status filters, a single-column listing region at <=1100px and additional mobile changes at <=700px. Do not replace its Ongoing/Past semantics with new tabs or filters.
- News/contact use a 768px mobile boundary, distinct from the site's 700px header boundary. Training, opportunities and project details use 1100px tablet and 700px mobile adaptations; About primarily switches at 700px. Contact has extra <=480px adjustments. These mixed boundaries are existing behavior.
- Staging news currently exposes an empty published-content state with category/pagination controls. The tablet screenshot shows closely overlapping pagination text. Record this as a pre-existing baseline issue; do not silently repair it in a CSS-only migration.

Limitations: automatic detail-link captures are conditional because staging currently does not expose article/project detail links in the inspected empty listings. Direct probes of `/projects/cre-active/` and `/news/european-solidarity-corps-hungary/` both returned HTTP 404; outcomes are recorded in `staging-findings.json`. Populated CMS, article-sharing/sidebar, pending media tooltip, authenticated admin and upload-success baselines require suitable existing staging data/access and the matching deployed source. Do not invent content, publish records or substitute local mock screenshots as approved staging evidence. Native select popup rendering is OS-owned; focused/selected control captures are reproducible, while its open popup needs manual review on supported platforms. Baseline screenshot filenames alone are not visual acceptance; review the images and the manifest together.

## 10. Suggested migration order and review boundaries

1. **Reconcile source and baseline.** Locate the staging release source, document CMS/admin/API ownership and hosting boundaries, pin release/content revision, review these screenshots, and complete populated-detail/authenticated coverage when available. No styling conversion before this gate passes.
2. **Add visual assertions and tokens.** Use existing Playwright, pin the browser/OS, add deterministic fixtures and exact-value token aliases. Preserve Preflight, breakpoints and all old CSS. Separate tooling and token review from markup changes.
3. **Pilot privacy policy.** Convert a small content section, validate type/spacing at all viewports, then complete the page. Demonstrate that removing corresponding legacy declarations retains parity.
4. **Migrate shared small UI.** ButtonLink variants, Stripe, Divider, then Arrow after its artwork dimensions are understood. Verify all call sites, disabled/pending interactions and focus states. Keep public API stable or re-export during import-only moves.
5. **Migrate feature pages.** Contact layout/controls, news listing/detail, project listing/detail, training, opportunities, about; each page/major section is a separate review. Keep contact behavior unchanged and treat CMS rendering as protected. Prioritize isolated sections over whole-file rewrites.
6. **Migrate home section by section.** Team/news/partner sections first, then impact/expertise/partnerships; hero masks, variable typography and animations last. Move shared PartnerSection ownership independently of style changes where possible.
7. **Migrate Header/Footer and menu.** Run the complete route/state matrix because this affects every page. Preserve DOM hooks and page-specific footer/navbar overrides until replaced explicitly.
8. **Optional layout/folder cleanup.** Route group/common shell and component moves in mechanical PRs after parity; preserve URL exports, ancestor relationships, metadata and client boundaries.
9. **Remove validated legacy CSS.** Search imports, class hooks and dynamic mappings; remove only unused validated rules. Leave scoped exceptions documented. Run full visual/functional/SEO checks and obtain staging acceptance before production workflow.

Each PR should contain one styling owner or coherent section, relevant screenshots/diffs, a list of removed declarations and verification results. Avoid simultaneous copy, asset, dependency, integration or routing changes. Revert the affected PR on regression; no broad reset of unrelated work. Follow the repository's staging/review/cutover process; this audit performs no deployment.

## 11. Testing and visual regression

Use **Playwright Test**, already installed at **1.64.1** (manifest range `^1.56.0`), with `expect(page).toHaveScreenshot()`. No new UI library or hosted visual service is required. Existing `scripts/migration-qa.mjs` checks exported routes/assets, horizontal overflow and broken images at 390/1440px; it is useful smoke coverage, not pixel regression. No visual snapshot test configuration currently exists.

- Pin OS, browser revision, fonts, DPR, locale, timezone and viewport. Use a stable production export of the reconciled source for comparison, not a changing live deployment. Archive staging release ID, content revision, request failures and screenshot metadata. Check the public release ID before/after a batch to detect redeployment.
- Wait for fonts and images; scroll to load lazy assets; restore scroll before capture. Cover full pages and selected components to make diffs reviewable.
- Keep a deterministic reduced-motion screenshot suite plus separate normal-motion tests. Do not simply disable infinite animations and accept an invisible initial hero word: use reduced-motion first-word rendering or a controlled animation phase. Test all three word phases and reveal completion separately under normal motion.
- Run the three representative sizes and boundary checks on either side of 480, 700, 768, 1000, 1100 and 1500px. Add 1920px to validate original scaling and narrow 320/360px for overflow checks. Test longer CMS content and pending/empty/populated records without changing approved staging content.
- Cover navigation hover/current route, dialog open/close/Escape/focus trap/return focus/body scrolling, keyboard skip link and visible focus; native category selection and pagination; Ongoing/Past filters, sticky behavior and result announcements; pending tooltip hover/focus/click; article sidebar expanded/collapsed and share URLs; contact errors, file names/type/size errors, interest radio selection and existing submission result. Never send test submissions to real recipients.
- Preserve metadata, canonical URLs, robots/noindex, sitemap, JSON-LD, page heading hierarchy, static slug export, deep links/anchors and actual HTTP 404s. Test `/homepage-preview` separately for noindex. Check route-to-route navigation for persistent layout/state changes.
- On the reconciled implementation, verify CMS publishing/rendering and admin login/logout/authorization at the established integration boundary with authorized test fixtures; no credentials or personal content in committed artifacts. Do not run destructive CMS tests.
- Use strict screenshot comparison on the pinned environment. Start with zero permitted changed pixels; investigate reproducible rendering noise before agreeing a narrowly justified tolerance. Never approve wholesale snapshot updates to make failing tests pass. Review overlays/diffs manually, including full-page section positions and text wrapping. Existing staging defects stay recorded separately.
- Future implementation checks from frontend: `npm run lint`, `npm run build`, `npm run typecheck` (build first for route types), `npm run test:seo`, `npm run verify:seo` with the correct staging SEO environment, then `node scripts/migration-qa.mjs` and the new visual suite. Use the documented Node 22 runtime. This documentation-only audit did not run a fresh application build or claim these checks passed.

Playwright reference: [screenshot assertions](https://playwright.dev/docs/api/class-pageassertions#page-assertions-to-have-screenshot-1) and [screenshot animation behavior](https://playwright.dev/docs/api/class-page#page-screenshot).

## 12. Risk and effort estimate

| Risk | Level | Control |
|---|---|---|
| Staging/local release and integration mismatch | Critical prerequisite | Obtain deployed source/content parity before migration |
| Viewport unit geometry, unusual calc expressions, artwork | High | Exact values, image/transform parity, boundary screenshots |
| Unlayered CSS and 88 important declarations | High | Per-owner computed-style checks and validated declaration removal |
| Global descendants and module `:global` overrides | High | Inventory consumer graph; explicit variants before layout moves |
| ContentBlock utilities and text reveal class hooks | High | Preserve wrapping/DOM and selector contracts; motion tests |
| Shared header/dialog/footer | High blast radius | Full route/state matrix, keyboard and scroll checks |
| CMS/admin absent from audited source | Unknown until reconciled | No certification from mock-data tests; separate integration coverage |
| Contact interactions and file validation | Medium/high | Preserve handlers and native controls; targeted behavior assertions |
| SEO/static export | Medium | Preserve route wrappers/metadata and run export/SEO tests |
| Small layout/spacing conversions | Low/medium individually | Small PRs with direct before/after screenshots |

Overall complexity is **medium-high**, with **high visual regression risk** if attempted as a bulk rewrite. Functional risk can stay medium or lower when handlers/data/routing are left intact, but deployed CMS/admin risk remains unassessed until source reconciliation. The 10 stylesheets, 4,650 declarations, rich text styling, artwork and mixed breakpoint systems make this more than a utility-name replacement.

Planning estimate for one experienced frontend engineer: **15–25 engineering days**, plus **3–5 review/QA days** (some overlap), approximately **4–6 calendar weeks** with timely review. Suggested allocation: 2–3 days baseline/reconciliation/tooling; 1–2 tokens/pilot; 7–11 page/shared UI conversions; 3–5 home/header/artwork; 2–4 cleanup/regression fixes. These are ranges, not a measured implementation schedule. Waiting for deployed source, CMS test records, admin access or approval is excluded; a materially different staging source requires re-estimation. Do not promise exact UI preservation until the full acceptance matrix passes.

## 13. Acceptance criteria

- [ ] Matching staging source release and content revision identified; deployed CMS/admin/API/hosting boundaries documented.
- [ ] Baseline screenshots reviewed for desktop/tablet/mobile, interactions and relevant breakpoint boundaries; unavailable states explicitly completed or tracked as release blockers.
- [ ] No approved visual changes: identical text, assets, crop, typography, section geometry, wrapping, colors, focus/hover/active states and responsive behavior; strict pinned-environment diffs pass with any noise exceptions individually justified.
- [ ] Navigation, native dialog, anchors, filtering, category/pagination, sidebar/share, forms and file handling preserve established behavior and accessibility.
- [ ] CMS rendering, admin authentication/authorization and existing network contracts remain unchanged in the actual deployed-source implementation; backend code untouched.
- [ ] All public routes, static slugs, pending/empty states, unknown-slug 404s, metadata, JSON-LD, canonical/robots/sitemap and preview noindex behavior remain correct.
- [ ] Tailwind is the default for ordinary component layout/type/spacing/state styling; shared values come from centralized tokens. Remaining CSS is limited to documented global behavior, scoped artwork/animations/rich-content or time-bounded compatibility rules.
- [ ] Shared components are reused only where semantics and design already match; page features do not import styling from `app` after migration completion.
- [ ] Legacy declarations/files are removed only after replacement validation; no dead CSS removal based solely on a text search.
- [ ] Lint/build/typecheck/SEO/smoke/visual/targeted behavior checks pass; no new browser errors, missing assets, overflow or hydration regressions.
- [ ] Reviewable PR sequence and staging acceptance complete before any production deployment. No added UI libraries or dependency upgrades bundled into migration.
