# Privacy Policy — Phase 10 review

**Status: Pending client/legal approval.**

## Source and completeness

The wording is transcribed from `C:\Users\Damjan\Downloads\Privacy Policy.png`, the locally supplied 1920 × 7028 export of “Privacy Policy”, node 2702:497. A copy is retained at `design-reference/privacy-policy/reference.png`. No Figma access was used.

All 16 visible numbered sections, lists, contact details, and the displayed “Last updated: 9 October 2026” date are reproduced as HTML. No policy paragraphs were unreadable or omitted. No table of contents or tables appear in the reference. No replacement legal wording was generated. The date is a transcription, not confirmation of an actual legal revision.

Sections: Introduction; Who We Are; What Personal Data We Collect; How We Use Your Personal Data; Legal Basis for Processing; Applications, Projects and Youth Opportunities; Children and Young People; Sharing Your Personal Data; International Data Transfers; Data Retention; Cookies and Similar Technologies; Data Security; Your Data Protection Rights; Third-Party Websites and Services; Changes to This Privacy Policy; Contact Us.

No separate approved policy or approval record was located in the preview application. A comparison against an independently approved policy remains unavailable. Matching the screenshot is not legal approval or verification of operational claims.

## Client decisions before publication

- Approve the entire wording and displayed revision date against EKE's actual operations and applicable requirements.
- Confirm the policy's `info@ekebitola.org` mailbox. The existing Contact reference/page uses `contact@ekebitola.org`; both remain unchanged. Mailbox operation has not been tested.
- Confirm the organisation name/address and responsibility for handling privacy requests. No DPO, controller particulars, retention schedules, or supervisory-authority contact details have been invented.
- Section 11 refers to a separate Cookie Policy or cookie settings panel. Neither an approved destination nor a functioning panel was supplied. These words remain plain text; no fabricated link or consent behavior was added.
- Verify all statements about collection, processing grounds, minors, sharing, transfers, retention, cookies/analytics, security, consent, and rights handling. These are supplied design statements, not findings about the deployed system.
- The Contact form remains frontend-only; no submission, upload, new checkbox, or consent mechanism was introduced. It currently contains no Privacy Policy link to connect.
- The policy's references to applications and data handling must be reconciled with real functionality before public launch. See Phase 10 in `BACKEND_INTEGRATION_TODO.md`.

## Links and implementation

The shared footer now links to `/privacy-policy`, retaining its existing span styling. Policy website links use the exact supplied `https://ekebitola.org/`; email links use `mailto:info@ekebitola.org`. No message was sent and no external legal destination was invented. The “Who We Are” textual reference is retained without adding a table of contents.

Created `src/app/privacy-policy/page.tsx` and `page.module.css`. Original SVGs from `design-reference/privacy-policy/` are copied byte-for-byte to `public/assets/privacy-policy/`. The first SVG includes outlined date text: a scoped CSS clip excludes that small region, while the date is selectable HTML. The files themselves are unchanged. Shared Header/Footer, local Google Sans, colors, and responsive conventions are reused. Footer alignment overrides apply only inside the privacy page. No global CSS or Contact code changed.

Preview `noindex, nofollow` metadata and English language metadata are inherited. The page supplies its own title and description.

## Verification

- `npm run typecheck`: passed (`tsc --noEmit`).
- `npm run lint`: passed.
- `npm run build`: passed after retrying outside the Windows sandbox; the initial attempt failed with EPERM while creating a Next output directory. `/privacy-policy` is statically generated.
- Playwright: 1920, 1440, 1024, 768, 390, and 360 widths passed, with no horizontal document overflow, missing images, JavaScript exceptions, or failed HTTP resources. All 16 sections have identical text at every size. Fonts loaded. Mobile and tablet screenshots were inspected.
- Direct route and refresh passed. All nine existing pages' footer links, browser back/forward, skip link keyboard focus, and menu open/Escape passed.
- One H1, one main landmark, 16 H2s, semantic lists, selectable text, explicit decorative-image empty alt text, descriptive links, and visible focus are present. Body text uses dark blue on the pale background. This is focused accessibility QA, not a full assistive-technology audit; native browser zoom was not separately automated.
- Full desktop capture is 1920 × 7028, matching the reference dimensions. `overlay.png`, `difference.png`, and `comparison.json` record comparison evidence. Mean absolute channel difference: 1.7481/255. Text wrapping and final paragraph position match; residual font rasterization, shared typography, and small SVG-mask differences remain. This is not a pixel-perfect claim.
- Eight existing page screenshots are pixel-identical before/after at 1440px: About, Projects, Project Details (Disera), Opportunities, Training, News, News Details (Hungary), Contact. Homepage dimensions and layout are unchanged; its screenshot has pixel differences confined to the existing international-flags photograph/backdrop region (x=0–1439, y=3506–4057). The region was visually compared; no homepage implementation was edited by this phase. Therefore a pixel-identical claim for all nine pages is not made.

Evidence/scripts: `design-reference/privacy-policy/qa-results.json`, `regression-comparison.json`, `comparison.json`, `verify.mjs`, `regression.mjs`, `regression-compare.mjs`, `compare.mjs`, and the PNG captures.

The active app is `D:\eke-web-preview\eke-next-preview` per AGENTS.md. Existing unrelated uncommitted work was preserved. No Figma API, backend, production repository, infrastructure, image-format conversion, Git push, PR, merge, or deployment was performed.
