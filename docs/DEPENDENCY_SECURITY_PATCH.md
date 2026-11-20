# Next.js patch assessment — 2026-11-20

The inherited lockfile installed Next.js 16.4.3. Both its build-time advisory and
`npm audit --json` reported affected versions through 16.4.4. Pin Next.js and
eslint-config-next to **16.4.5**, the minimal patch resolving these advisories.
No major framework upgrade or runtime architecture change is included.

Registry findings: GHSA-mfr8-8qww-v76h, GHSA-vc7v-qv4w-wrv8,
GHSA-7qx7-33qx-rqx2, GHSA-f3mh-rxg3-f5g2, GHSA-pc58-hwjq-p385,
GHSA-rhh4-g77r-r9qj, GHSA-vvgp-ww4w-46vf. Primary advisory index:
https://github.com/vercel/next.js/security/advisories

Static export has no hosted Next.js server, Edge runtime or image optimizer.
That reduces exposure to these server-specific advisories but is not a reason
to leave the build/development dependency unpatched.

Validation: patched static export builds successfully; all 10 Playwright tests,
lint and typecheck pass. The patch is committed separately from integration code.
The remaining seven moderate npm findings are a development-only minimatch /
typescript-eslint dependency chain; no unrelated lint-tool upgrade is bundled.
