# EKE SEO configuration and handoff

## Build configuration

Set these at build time (static export embeds metadata in HTML):

```dotenv
PRODUCTION_SITE_URL=https://ekebitola.org
SEO_ENVIRONMENT=production
```

For local/preview/staging use `SEO_ENVIRONMENT=staging` or leave it unset.
Keep `PRODUCTION_SITE_URL` pointing to the production origin in every
environment. It is independent of `NEXT_PUBLIC_EXISTING_SITE_URL`, which
continues to control legacy links.

The domain was confirmed by the site owner. It is configured through the
environment rather than hardcoded into the metadata implementation.
Production indexing requires both the explicit production SEO setting and
a production Next.js build. Production builds with no production domain
fail rather than publish incorrect canonicals. Unconfigured local/CI builds
remain noindex and omit absolute URL metadata and structured data.

GitHub Actions reads repository variable `PRODUCTION_FRONTEND_URL` for the
canonical origin. Set it to `https://ekebitola.org` before a production build.
The reusable CI workflow defaults to staging. The existing production
workflow explicitly opts into production SEO but remains disabled until
the existing deployment cutover. The legacy frontend workflow opts into
production SEO only on `main`; its existing deployment behavior is unchanged.
Do not reuse a production HTML artifact for staging: these are build-time
directives, not runtime host detection.

## Implemented metadata

`src/lib/seo.ts` is the central source for the eight requested exact titles,
descriptions, paths, image placeholders, title formatting, canonical URLs,
Open Graph, Twitter cards, and robots directives. Titles use `Title | EKE`
without a second suffix. Canonicals follow the site's existing trailing
slash convention.

| Route | Title before the EKE suffix |
| --- | --- |
| `/` | Learning That Moves People Forward |
| `/about/` | Inspiring Locally, Impacting Globally |
| `/opportunities/` | Opportunities Worth Saying Yes To |
| `/projects/` | Lifelong Learning in Action |
| `/training/` | Building Skills for Lasting Social Impact |
| `/news/` | Community Updates & Shared Insights |
| `/contact/` | Set Change In Motion |
| `/privacy-policy/` | EKE's Privacy Policy |

Detail-route `generateMetadata()` uses the same memoized record as page
rendering. It normalizes descriptions, removes HTML and script/style content,
decodes common entities, and shortens long summaries at word/sentence
boundaries. Existing local raster images are checked for existence before
use in social tags. Unknown routes retain the existing not-found behavior.
Incomplete detail pages preserve their visible UI but are noindex and
excluded from the sitemap. `/homepage-preview/` is noindex and canonicalizes
to `/` to avoid indexing the duplicate homepage.

The root layout emits Organization and WebSite JSON-LD. Internal pages emit
BreadcrumbList; complete news details emit Article; complete project details
emit CreativeWork. Values use real displayed content and known social links.
No authors, reviews, ratings, or modification dates are invented. JSON-LD
escapes HTML-sensitive characters before serialization into script elements.

`src/app/robots.ts` and `src/app/sitemap.ts` generate static files during
build. Staging disallows crawling and uses noindex metadata on every page;
its sitemap is empty. Production allows public routes, blocks admin/auth/login/API
and the preview route, and lists the eight public pages plus complete detail
routes. Published article dates are used as the earliest known last-modified
timestamp; other pages omit lastmod because no reliable timestamps exist.
There are no admin/auth page routes in this frontend checkout. Any future
restricted routes must retain authentication and explicit noindex metadata;
robots rules are not authentication.

## Images: waiting for the user's signal

The directory is `public/images/seo/`. All placeholder paths are centralized:

- `/images/seo/home-og.webp`
- `/images/seo/about-og.webp`
- `/images/seo/opportunities-og.webp`
- `/images/seo/projects-og.webp`
- `/images/seo/training-og.webp`
- `/images/seo/news-og.webp`
- `/images/seo/contact-og.webp`
- `/images/seo/privacy-og.webp`

Use WebP, ideally 1200 x 630 pixels. No placeholder image files were created,
generated, or downloaded. `pageImagesEnabled` is deliberately false until
the owner supplies the images and confirms they can be used. Enable it after
that signal and rebuild. File-existence checks still omit any missing image;
there is no existing dedicated default social image, so static pages omit
image tags in the meantime. Detail pages can use their existing public
content images, with the configured section image as a future fallback.

## Backend integration limitation

The supplied brief describes an API-connected frontend; this checkout is
different. Pages import `src/data/projects.mock.ts` and `src/data/news.mock.ts`.
There are no frontend project/news fetching utilities or API environment
configuration. The existing Java controllers/DTOs were inspected:

- Projects expose UUID, title, quickSummary, description, image, dates,
  and ongoing/completed status. There is no slug or publication/draft state.
- News exposes id, shortDescription, instagramUrl, imageUrl, and createdAt.
  There is no article title, slug, full article content, publication state,
  or modification timestamp.

SEO therefore uses the actual rendered local record rather than fetching an
unrelated API record. Local complete details are treated as the currently
approved public content; `details` is content readiness, not a backend
publication flag. Project summaries use `details.summary`, falling back to
the displayed project description. News uses the displayed summary, falling
back to the introduction. No backend data or production content was modified.

The requested API-based dynamic SEO and draft filtering cannot be completed
accurately until the backend supplies a stable route identity and explicit
publication contract, and the frontend actually renders those records.
Required follow-up: agree slug-to-UUID/id mapping, news title/body fields,
public-only list/detail endpoints or a publication field, and backend API
origin/media URLs. Replace the shared loaders and sitemap source together
with the page data integration so metadata and visible content always match.
Use build-time fetch memoization for static export; validate remote featured
images in that adapter before advertising them. No remote image URLs are
assumed valid by the present implementation.

Static export is preserved. New or changed backend content will require
rebuilding/redeploying; runtime metadata is not supported by the current
NGINX static hosting. No server-rendered architecture, backend, NGINX,
authentication, or deployment activation changes were made.

## Validation and changed files

Run from `Frontend/ece-website`:

```text
npm run lint
npm run typecheck
npm run test:seo
npm run build
npm run verify:seo
```

Run build and export verification separately for production and staging.
The export verifier checks the actual HTML for all routes: exact static
titles/descriptions, one canonical, matching social tags, existing image
files, valid nonduplicated JSON-LD, production/staging directives, exclusion
of incomplete details, and sitemap routes that exist in the export.
The focused unit tests cover configuration, unsafe/preview URLs, description
normalization, title suffixes, missing images, and production/staging indexing.

Validation performed on 2026-11-22:

- Frontend ESLint and TypeScript checks passed.
- Four focused SEO unit tests passed, including safe JSON-LD serialization.
- Staging and production static-export builds passed.
- Export verification passed for all 23 rendered pages in both environments.
- The production sitemap contains the eight main pages and the two complete
  detail pages. Incomplete detail routes are noindex and excluded.
- No placeholder social-image URLs are emitted while page images are disabled.
- Live API response tests could not be performed: this checkout has no
  frontend API adapter, API endpoint configuration, or compatible news
  article/publication contract. Current-content detail metadata was verified
  against the actual local records and exported HTML instead.

Files created:

- `src/lib/seo.ts`, `src/lib/seo-content.ts`
- `src/components/SeoStructuredData.tsx`
- `src/app/robots.ts`, `src/app/sitemap.ts`
- `tests/seo.test.mjs`, `scripts/verify-seo.mjs`
- `public/images/seo/README.txt`, `SEO.md`

Files modified for SEO:

- `src/app/layout.tsx`, `src/app/homepage-preview/page.tsx`
- `src/app/{about,projects,opportunities,training,news,contact,privacy-policy}/page.tsx`
- `src/app/projects/[slug]/page.tsx`, `src/app/news/[slug]/page.tsx`
- `.env.example`, `package.json`
- `.github/workflows/ci.yml`, `.github/workflows/deploy-production.yml`,
  `.github/workflows/frontend.yaml` (SEO build inputs and validation only)

Other existing workspace changes are unrelated to this SEO task.
No commit, merge, or deployment has been performed.
