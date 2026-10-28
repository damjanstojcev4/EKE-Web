# EKE homepage preview

Independent Next.js + TypeScript + Tailwind CSS application implementing Figma file `VwYdaQwMjjyExUaDsb3BjM`, Homepage `2180:6`. Branch: `feat/figma-homepage-preview`.

## Run locally

```powershell
cd D:\eke-web\apps\eke-next-preview
npm ci
npm run dev
```

Open http://127.0.0.1:3100/homepage-preview (the preview also renders at `/` on this independent server). Port 3100 is bound to the local machine. The existing Vite homepage has not been replaced.

For the optimized preview:

```powershell
npm run build
npm start
```

Stop the development server before starting the optimized server, since both use port 3100. The scripts use Next.js's supported webpack mode because Turbopack's PostCSS worker repeatedly crashed on this Windows environment.

## Existing application links

Verified routes for About, Projects, Our Team, Resources and Contact point to the existing application, defaulting to `http://localhost:5173`. Run that application separately if you want to follow those links:

```powershell
cd D:\eke-web\Frontend\ece-website
npm ci
npm run dev
```

To use a different existing-site origin, copy `.env.example` to `.env.local`, set `NEXT_PUBLIC_EXISTING_SITE_URL`, and restart/rebuild the preview. The preview does not need the Spring Boot backend. Existing API contracts were inspected (`/api/projects/`, `/api/projects/recent`, `/api/news`); the visual preview uses isolated Figma copy in `src/data/copy.json`, avoiding runtime dependence on production data.

## Implemented content

- Glass header, original EKE logo, desktop navigation and accessible modal menu with Escape dismissal and focus return.
- Photographic hero and introduction with both CTAs.
- Six Growth & Impact rows and original decorative artwork.
- Four expertise panels with the named projects and original imagery.
- International Partnerships image, frosted heading, editorial text, PIF download and five service rows.
- Three News & Opportunities entries with original copy, images and dates.
- Inside EKE heading, team photograph and team CTA.
- Partner With Us CTA and original decorative figures.
- Footer navigation, address, registration identifiers, verified social links and design credit.

The actual Homepage frame has no separate project-card listing. Its projects and initiatives appear within the expertise panels, partnership services and news. A fifth Sport for Inclusion panel and two designer notes sit outside the visible frame; they have not been added as visible homepage content.

## Files and assets

All created files are under this directory. No tracked production frontend, backend, admin, authentication, API, database, deployment or CI files were modified. No deployment was performed.

- `src/app/`: assembled page, preview alias, local fonts, metadata and responsive design tokens/styles.
- `src/components/layout/`: header/menu and footer.
- `src/components/home/`: seven composed homepage sections.
- `src/components/ui.tsx`, `FigmaText.tsx`: original SVG arrows/dividers, shared CTAs and exact Figma text runs.
- `src/data/`: isolated design copy and navigation configuration.
- `public/assets/`: downloaded Figma images/SVGs plus the existing 2025 PIF PDF.
- `public/fonts/`: Google Sans and Google Sans Flex, each with its OFL license.
- `design/`: source metadata, reference code, full-resolution Figma screenshot, asset provenance, browser verification script and screenshots. Reference code is not imported by the application.

Original photographs incorporated: bulb hero; Youth Development; Digital & Media Literacy; Women's Empowerment; Prison Education; international flags; accessible chess; Spain; AI educators; EKE team; and the News/Training menu photographs. Original vector assets include the logo parts, hero masks, impact and services decorations, CTA arrows, final partnership figures and social icons. `design/assets.json` records the initial 49 homepage asset downloads; the menu adds four files. Temporary Figma URLs appear only in provenance/reference files, never in runtime source.

Both font families are locally bundled rather than substituted. Upstream sources: https://github.com/googlefonts/googlesans and https://github.com/googlefonts/googlesans-flex. Licensing is recorded in the included OFL files.

## Intentional differences and unresolved design details

- No mobile frame was identified on the EKE design page. Tablet/mobile layouts are derived from the desktop composition: a proportionally scaled desktop layout above 700 px, and stacked editorial rows/cards at mobile widths.
- The 1920 px implementation has the exact 12131 px frame height and source section coordinates. Original images, local fonts, SVGs, text runs, masks and effects were restored. Residual rasterization/effect and small alignment differences are measured in `design/comparison/metrics.json`; pixel-perfect equivalence is not claimed.
- The Figma menu frame was inspected. A separate prototype-reaction inspection was declined, so no unverified carousel or accordion behavior was invented. Expertise panels remain visible.
- Opportunities, News and Training navigation goes to relevant homepage sections because those redesigned routes are out of scope. Related-project, story, team and contact CTAs use verified existing-site routes. Upcoming-opportunities and training-enquiry CTAs lead to existing Contact. No placeholder pages were created.
- The September 2026 Spain opportunity has an accessible historical-preview label; current availability has not been verified.
- Only Facebook and Instagram destinations could be verified in the repository. Other footer social icons are displayed without invented destinations. Privacy Policy is displayed as text because its route is not verified. Link mapping is documented here.
- The PIF comes from the existing repository and is dated 2025; it is not a newly supplied Figma document.
- Menu social links use readable text. The responsive menu uses a compact link list on smaller screens.

## Verification

```powershell
npm run lint
npm run typecheck
npm run build
# With the preview running and Microsoft Edge installed:
node design/verify.mjs
```

The browser script captures full pages and menus at 1920, 1440, 1024, 768 and 390 pixels. It records page overflow, asset loads, HTTP failures, runtime errors, menu open/Escape-close behavior and focus restoration in `design/verification.json`. It exits with failure if any of those checks fail. Desktop visual references are `design/screenshots/desktop-overview.png` and `design/screenshots/figma-overview.png`.

## Strict fidelity correction

The correction updates Header, Footer, HeroSection, ImpactSection, ExpertiseSection, PartnershipsSection, NewsSection, TeamSection, PartnerSection, shared SVG controls and FigmaText. Local Google Sans (400–700) and Google Sans Flex (100–1000) are loaded with next/font/local; optical sizing is disabled to reproduce Figma small-text widths. Original raster files are served without Next.js recompression.

Run `node design/compare.cjs` after browser verification to regenerate full-resolution reference/current/50% overlay/4× difference images for all eight sections. See `design/VALIDATION.md` and `design/comparison/REPORT.md`.

`hero-figure-mask-transformed.svg` wraps the untouched exported path in its Figma composition transform; the unmodified export is retained alongside it. No illustration paths were redrawn. The menu close icon is the original Figma SVG.
