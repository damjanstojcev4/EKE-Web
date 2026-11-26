# Training reference review — 26 November 2026

**Decision: accept four original-source raster reference corrections.**

Reviewer: Codex, performing the evidence review explicitly requested in the Training visual sign-off task. This is an agent review, not a claim of separate human approval. The decision was made after inspecting all four reference/original/overlay/diff atlases, examining pixel histograms and affected elements, comparing actual platform font usage and exact DOMRects, and running the unchanged checkpoint again. No bulk snapshot-update command or failure-count-based approval was used.

The original-source proposal is `signoff/original-proposal`; its three Training source files were restored byte-for-byte from `1c18dd26` and their Git/disk hashes recorded in `proposal-original-sources.json`. Its full 78-case run differs from the initial reference set in exactly the four cases below, with zero differences in the established computed-style, behavior, fixture or request comparisons. The other 74 PNG hashes match unchanged. The four proposal hashes also match every one of 60 fresh original-source probe frames and 58/60 migrated probe frames. The two other migrated frames are byte-identical to their old references, despite unchanged geometry and standard styles within that document. Waiting and scrolling do not reliably eliminate this renderer variation.

| Case / viewport | Changed pixels | Channel changes | Affected rendering |
| --- | ---: | --- | --- |
| `1440-long`, 1440×1000 | 2,931 | 2,929 at 1; 2 at 12 | Two translucent method-label gradients; two pixels at the first method-copy rounded border |
| `701-populated`, 701×1000 | 566 | All at 1 | Approach label gradient only |
| `1100-populated`, 1100×1000 | 2,557 | 2,556 at 1; 1 at 12 | Two method-label gradients; one rounded-border edge pixel |
| `1101-error`, 1101×1000 | 5,186 | All at 1 | Method-label gradients and scaled photo pixels; no font or text-layout change |

The root cause at the level demonstrated by the evidence is **alternate source-independent GPU raster outcomes encoded as initial golden PNGs**, principally gradient/color quantization and fractional rounded-edge coverage. The initial baseline capture saved one ready frame; it did not establish a repeated canonical frame before selecting the reference. Its renderer/version/DPR/fixture/environment otherwise match the pin. No content, artwork selection, photograph bytes, typography, layout or component geometry change explains these mismatches. The exact internal Intel/ANGLE/Skia driver mechanism is not asserted to be isolated or repaired. The broad 1101px result was investigated separately and includes scaled photographs, not just gradients.

Expanded CSS inspection found one separate serialization difference outside the affected method cards: the tailored grid has original `align-content: start` versus migrated `flow-start`. All corresponding DOMRects, actual font usage and captured pixels are identical across sources. This is not the cause of these discrepancies and application styling is preserved. The earlier smaller computed-style inventory did not include `align-content`; the expanded finding is retained rather than silently filtered out.

| Case | Old SHA-256 | Reviewed original-source SHA-256 |
| --- | --- | --- |
| `1440-long` | `1aba42c1e6c0dc1c0b874e43d2058593d5096081a47dc3db154594be21f4fa52` | `0a8b4a4b4fc8c6aefad2be4c8ff4fef4ab1a9ebb4e8f181071fd28d91e27959e` |
| `701-populated` | `eaabe76a4cc72b7b6408e64541c4df0566815e35ca34ef2e0f053e0150be6073` | `362f7aa2e701821b88a0fb7109480dbafbcc52c32c41b0520bad5a8186b3bcff` |
| `1100-populated` | `6355a3caba6a52190af16d18921abdab55d6e8cfe0079b136f3f7b56bbcfb577` | `ed10cc32c7aa870d57d2d05cc4d0d7bff156bfabf62743d98019b67975ad359d` |
| `1101-error` | `c4201207b1ffc402e07ceb60cef14d5b22b56078ca45bc10f55e772347b0fd85` | `ec1c9c8f9ad90d73f0382bfb255815623de71209e676175633722b45f5bf614c` |

Only these four `captures` values and their local reference PNGs may change. Preserve the original complete manifest and four old PNGs in the sign-off archive, and leave all fixture, computed-style, behavior, renderer, request and live metadata byte-for-byte equivalent. No browser flags, screenshot settings, masks, image processing, comparison threshold or five-second exact paint-settling rule changes are approved by this decision. Exactly one accepted hash remains for each case; alternate hashes are not added as an accepted set.

This review authorizes the narrow reference correction, not the Opportunities GO decision. GO still requires complete strict 78-case original/control and migrated passes, the previous 1,002 comparisons, three live CMS comparisons, all 18 integration tests and build/lint/TypeScript/SEO checks. Any remaining failure must stay visible and keep the gate closed until resolved.
