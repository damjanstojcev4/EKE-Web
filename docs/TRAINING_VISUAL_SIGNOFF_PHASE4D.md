# Training — Phase 4D visual sign-off

Migration checkpoint: `cbb18e86`. Original Training source: `1c18dd26`. Worktree: `D:/eke-web/.worktrees/frontend-tailwind-phase1`, branch `codex/frontend-tailwind-phase1`. Evidence review: 26 November 2026, Europe/Skopje.

The four discrepancies are source-independent raster reference artifacts. The reviewed correction changes exactly four PNG hashes, generated from unchanged original source. Application styling, content, behavior, backend/CMS records, browser flags, screenshot settings and zero-tolerance comparisons remain unchanged. The other 74 Training references and every earlier feature reference are preserved.

## Root cause and per-case evidence

The initial baseline saved one ready PNG per state. It waited for fonts/images and reset scroll, but did not establish a repeated canonical raster before selecting the reference. Fresh pinned-renderer probes reproduced two discrete outcomes with identical geometry and standard styles within the same document. Waiting, another screenshot and scrolling did not reliably select an outcome. The evidence supports alternate GPU gradient/image quantization and rounded-edge coverage, rather than a content/layout change. The exact internal Intel/ANGLE/Skia mechanism is not claimed to be repaired or fully isolated.

| Case | Viewport / full PNG | Exact differences | Classification |
| --- | --- | --- | --- |
| `1440-long` | 1440×1000 / 1440×6874 | 2,931 pixels; 2,929 at one channel level, two at 12 | Approach and Non-Formal Education translucent gradients; two fractional rounded-border corner pixels |
| `701-populated` | 701×1000 / 701×9882 | 566 pixels, all one level | Approach gradient only |
| `1100-populated` | 1100×1000 / 1100×8218 | 2,557 pixels; 2,556 at one level, one at 12 | Two method-label gradients and one rounded-border corner pixel |
| `1101-error` | 1101×1000 / 1101×4536 | 5,186 pixels, all one level | Method-label gradients and scaled photographs, investigated separately from the narrower gradient cases |

The measurements classify every differing pixel against the actual DOMRects. No standalone text-region, font-usage or component-geometry difference was found. Label glyphs sit over the translucent gradients, so their composited edge colors are not claimed to be separable from background quantization. Fresh original-source renders match the reviewed candidates in **60/60 probe frames**; migrated renders match in **58/60 frames**, and the two remaining frames exactly reproduce the old references. No unknown third outcome appeared. All 12 original/migrated run pairs have identical DOMRects and actual platform font usage. Standard styles are stable before/after painting within each document.

The expanded cross-source audit also found one separate nonvisual serialization difference: the tailored grid reports `align-content: start` on original source and `flow-start` on migrated source. Its rectangles and pixels match exactly, and the raster variants reproduce on both sources. This is recorded separately and no application styling is changed to compensate. The original smaller style inventory did not include this property. An unused local fallback font face changes lifecycle status during capture; CDP reports identical actual font usage across sources, so this is not represented as font substitution.

[Pixel/component classification](training-baseline/signoff/classification.json), [expanded styles](training-baseline/signoff/expanded-style-differences.json), [repeated-frame comparison](training-baseline/signoff/probe-comparison.json) and [provenance/asset hashes](training-baseline/signoff/provenance.json) retain the measured details and limitations. Full probe metrics are compressed beside each probe summary. LayerTree emitted no events; no layer-cache mechanism is asserted from absent instrumentation.

## Visual review

Each atlas uses the same four panels: old reference, unchanged original/new candidate, 50% overlay, and magenta exact-pixel difference mask. The candidate equals the migrated rendering byte-for-byte; no blur, tolerance or image normalization is applied to the comparisons.

| Gradient/card review | Additional photo/edge review |
| --- | --- |
| [1440px long overlay](training-baseline/signoff/1440-long-overlay.png) | [Upper corner](training-baseline/signoff/1440-long-border-top-overlay.png), [lower corner](training-baseline/signoff/1440-long-border-bottom-overlay.png) |
| [701px populated overlay](training-baseline/signoff/701-populated-overlay.png) | Differences confined to the label gradient |
| [1100px populated overlay](training-baseline/signoff/1100-populated-overlay.png) | [Rounded-border pixel](training-baseline/signoff/1100-populated-border-overlay.png) |
| [1101px error overlay](training-baseline/signoff/1101-error-overlay.png) | [Scaled photograph overlay](training-baseline/signoff/1101-error-photograph-overlay.png) |

## Reference decision

The [manual agent review decision](training-baseline/signoff/reference-review.md) records authorization, rationale and all four full old/new hashes. This is an evidence-based review under the user's conditional reference-correction instruction, not a claim of independent human approval. A guarded script applied only those four reviewed original-source candidates. It verified that the original full matrix changed only these cases and that all established style/behavior/data/request comparisons passed. It refused any unexpected candidate or metadata change.

The [review receipt](training-baseline/signoff/reference-review.json) records old/new manifest hashes, each accepted PNG hash and its unchanged-source origin. The complete initial manifest and four old PNGs are archived under `signoff/initial-reference-archive`; the previous checkpoint also preserves the old manifest. The 74 other capture hashes and all reference metadata are unchanged. There remains exactly one accepted hash per case; neither alternate-hash sets nor noise allowances were introduced. Full screenshots remain local ignored artifacts as in the established workflow; the review atlases are committed.

## Final verification and Opportunities gate

**GO for Opportunities. Training visual sign-off is complete.** Application source remains byte-equivalent to the migration checkpoint after Git line-ending normalization. The migration was restored and rebuilt in `finally` after every original-source experiment.

| Verification | Result |
| --- | --- |
| Unchanged original Training against reviewed references | **78/78 exact** |
| Migrated Training against the same references | **78/78 exact** |
| Training computed styles, behavior, fixtures, requests and image geometry | **All established comparisons exact; zero errors** |
| Previous visual comparisons, including Project Details | **1,002/1,002 exact on accepted runs** |
| Fresh live Training CMS comparisons | **3/3 exact**, HTTP 200, zero published sessions, unchanged response |
| Existing integration tests | **18/18 passed** |
| Production builds / final restored migration build | **Passed** |
| ESLint / TypeScript / source audit | **Passed** |
| SEO tests / normal export verification | **4/4 passed; 13 staging-mode pages verified** |
| Application/backend/dependency changes from `cbb18e86` | **None** |

The first full legacy run and the first complete Contact NVIDIA recheck each retained `1440-download-focus`: exactly the previously documented pixel `(1273,637)`, `(135,162,193,255)` versus `(135,162,192,255)`, with identical full reference/actual PNG hashes to the earlier checkpoints. A second complete unchanged **59-case Contact NVIDIA recheck passed 59/59 exactly**. Its reference was not changed. The [initial pipeline](training-baseline/signoff/regression.json) remains nonzero; the [first recheck](training-baseline/signoff/prior-recheck-1.json), [second recheck](training-baseline/signoff/prior-recheck-2.json), [pixel evidence](training-baseline/signoff/contact-first-failure/pixels.json) and [accepted legacy aggregate](training-baseline/signoff/accepted-prior-regression.json) preserve that distinction. The raw pipeline is not relabeled as a successful first run.

[Machine verification](training-baseline/signoff/verification.json) independently checks actual PNG hashes, complete capture counts, reference equality, unchanged reference metadata and source scope. It returns **GO with no reasons outstanding**. The initial Training mismatches, both probe sets, original proposal, strict final original/migrated runs and all previous Phase 4D evidence remain preserved. No other feature reference changed. The renderer can still emit alternate raster frames; future misses must be investigated, not treated as a standing noise allowance. The existing exact paint-settling rule and one-hash acceptance remain unchanged.

For a fresh migrated verification against the accepted set, use a unique run name:

```powershell
node docs/project-detail-edge.cjs docs/training-signoff-matrix.cjs after --offline --run=migrated-recheck-1
node docs/project-detail-edge.cjs docs/training-live-check.cjs after
node docs/training-signoff-summary.cjs
```

The summary verifies the preserved final sign-off runs. `training-signoff-original.cjs <unique-label>` captures all 78 cases from the original checkpoint and restores/rebuilds the migration; existing run directories are never overwritten. `training-signoff-regression.cjs` records the complete final pipeline. The review-application script is guarded and refuses a second application. Full screenshots and uncompressed probe JSON remain local ignored artifacts; compressed metrics, reference manifests, decisions and review atlases are committed.

Stop after Training visual sign-off. Opportunities is recommended next but is not migrated here. No deployment, merge or PR is created.
