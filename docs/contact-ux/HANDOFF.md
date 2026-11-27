# Contact form UX and validation handoff

Branch: `codex/contact-form-ux`, based on staging `4e755945`.

## Scope and behavior

The form keeps EKE's existing Tailwind layout, brand colors, typography and page
structure. No backend, database, nginx or workflow file is changed. The existing
`POST /api/enquiries` → nginx → production n8n flow is preserved.

| Before | After |
| --- | --- |
| Partner preselected; no explicit choice needed | Required Partner/Opportunities choice, with no default |
| Input errors cleared on any typing | Errors clear when the field becomes valid; whitespace-only required values fail |
| First invalid input focused | First invalid input focused and smoothly revealed, respecting reduced motion |
| Plain status text; any HTTP 2xx meant success | Styled success/error notifications; success requires the confirmed n8n JSON contract |
| Sending label and disabled submit | Explicit idle/submitting/success/error states, stable button width, spinner, live announcement, disabled controls, rapid-submit guard |
| Selected filename only | Filename, accessible removal button, validation feedback and restored upload focus |
| Generic request failure | Distinct validation, network, timeout and service feedback; retained values and attachment for manual retry |

Required fields are First Name, Last Name, Email, Subject and enquiry type.
Phone, Country, Message and Documentation remain optional. Required fields have
asterisks and explanatory text. Errors appear on blur or attempted submission,
with inline messages, red underlines/borders, `aria-invalid`, descriptions and
keyboard-visible focus. Invalid forms make no submission request.

## n8n compatibility

The workflow owner supplied these sanitized response examples in this chat:

```json
{ "success": true, "message": "Contact submitted successfully" }
```

```json
{ "success": false, "message": "Unable to send email" }
```

Only an HTTP-success response with boolean `success: true` resets the form and
shows success. Explicit failures, malformed JSON, missing success, and nonboolean
success values preserve the form and display safe local copy. Raw upstream
messages and internal details are never shown.

The multipart fields remain `first_name`, `last_name`, `email`, `phone`, `country`,
`subject`, `partner_opportunity`, `message`, and optional binary `documentation`.
The browser sets Content-Type and its boundary. `opportunities` remains the
outgoing value; n8n retains responsibility for normalizing it to `opportunity`.
Without an attachment, `documentation` is omitted entirely.

Existing file support is preserved: one PDF, DOC or DOCX up to 5 × 1024 × 1024
bytes. Client checks are filename/size checks, not a replacement for workflow
validation. The response contract was confirmed by the owner; workflow-side
attachment enforcement was not independently inspected or probed.

Requests time out after 30 seconds. Timeout messaging explicitly warns that
delivery may already have happened and recommends contacting EKE before retrying.
There are no automatic POST retries. Form values, selection and attachment are
retained after every failure. Confirmation is focused after React has committed
the notification, avoiding a render/focus race.

## Files changed

- `Frontend/ece-website/src/components/contact/ContactForm.tsx`: form UX, states,
  validation, attachment removal, notifications and safe response handling.
- `Frontend/ece-website/tests/contact.spec.ts`: existing test expectations aligned
  with the required choice and confirmed response contract.
- `Frontend/ece-website/tests/contact-ux.spec.ts`: expanded mocked failure,
  accessibility, multipart, attachment, responsive and screenshot coverage.
- This handoff and the eight state images below.

## Review images

These are new implementation review captures, not replacement regression
baselines. Existing reference PNGs are unchanged. Captures isolate the form at
1440px and 390px page widths, with enough viewport height to avoid fixed-header
stitching artifacts. Layout checks also run at 320px, 768px and 820px.

| State | Desktop | Mobile |
| --- | --- | --- |
| Invalid | [Desktop invalid](screenshots/desktop-invalid.png) | [Mobile invalid](screenshots/mobile-invalid.png) |
| Loading | [Desktop loading](screenshots/desktop-loading.png) | [Mobile loading](screenshots/mobile-loading.png) |
| Success | [Desktop success](screenshots/desktop-success.png) | [Mobile success](screenshots/mobile-success.png) |
| Failed | [Desktop error](screenshots/desktop-error.png) | [Mobile error](screenshots/mobile-error.png) |

Intentional changes are the required-field note, enquiry-type legend and required
choice, inline invalid styling, fixed-width sending button/spinner, file removal,
and success/error notification panels. Original page sections and references are
preserved. Notification panels include icons, text and appropriate live-region
roles, so meaning does not depend on color. Spinner and scrolling respect reduced
motion.

## Separate configuration drift report

A read-only SSH inspection on 27 November 2026 confirmed that the deployed staging
`/api/enquiries` location has `proxy_ssl_verify_depth 4`. The repository copy in
`deploy/staging/eke-staging-api-routes.conf` does not. Infrastructure was not
changed in this UX branch.

Do not reinstall the repository's older routing snippet over the working staging
configuration as part of deploying these frontend changes. Reconcile the TLS
depth in a separate infrastructure change, validating nginx before reload. The
existing installer also pins an older routing checksum; it must be reviewed
separately before reuse against the manually updated staging snippet.

## Verification

- Lint: passed, no warnings.
- TypeScript: passed.
- Next.js static build: passed; 17 generated pages.
- SEO unit checks: 4 passed; exported metadata, canonicals, social images, JSON-LD,
  robots and sitemap verified across 13 content pages.
- Complete existing/expanded browser integration suite: 46 passed, including
  30 contact/admin checks. Contact responses were intercepted throughout.
- Backend Maven verification: passed, 16 tests, no failures or errors.
- Real Spring Boot/H2 browser integration: passed (editor/API workflows, four
  modules, CSRF, publication/media privacy, generated deep links, responsive widths
  and file-H2 restart persistence).
- Existing Privacy Policy visual regression: 3 passed, zero changed pixels,
  against unchanged approved desktop/tablet/mobile PNGs.
- All eight new contact review images were visually inspected. Responsive checks
  include 320, 390, 768, 820 and 1440px widths; loading button width stays stable,
  reduced-motion spinner animation is disabled, and no horizontal overflow occurs.

The default Edge executable auto-updated to `158.0.4370.45`, causing the existing
visual suite's strict version guard to fail before image comparison. The retained
`C:/Program Files (x86)/Microsoft/Edge/Application/158.0.4370.33/msedge.exe` was
verified to match the pinned browser, Intel UHD renderer and GaneshGL backend.
The unchanged suite then passed with a temporary local launcher configuration
that inherited `playwright.visual.config.ts`, set `channel: undefined`, and set
`launchOptions.executablePath` to that retained executable. The temporary config
was removed; no baseline, test guard, or shared visual configuration was changed.

An initial rerun caught a notification-focus race. Focus was moved to a React
effect after the notification is rendered; the complete 46-test rerun passed.
Final contact-only verification also covers the upload's actual error outline
and captures the final mobile email wrapping.

## Recommended deployment

Review this branch and its screenshots, then use a PR targeting staging. Preserve
the current staging nginx relay and deploy only the approved frontend change
through the established pipeline. After staging deployment, verify the visible
states with intercepted responses before any separately authorized live enquiry.
Do not merge to main or deploy production as part of this task.

No live n8n submission was sent during implementation or automated testing. The
only n8n connectivity check was ICMP ping (2 replies, 0% loss, about 46 ms).
