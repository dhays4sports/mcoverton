# CF-DISP-4.1 — Nonrenewal Content Hub + Technical SEO

## Purpose
Adds indexable routes, canonical/meta/OG signals, sitemap inclusion, internal linking, meaningful server-readable content, and no doorway-page expansion.

## Baseline
- CoverageFit: `3.20.200`
- Immutable source SHA-256: `cefd2d7b52bdc2a818941e981b9e867e08b1a14ccee17cd69d4a782eb2c7ba13`
- Program overlay: `CF-DISP-5.2`

## Implemented product surfaces
- `nonrenewal/index.html` — present — `0e7ba75c83efc245b57d94b567a70350b031c59c45518ce3860ea84095d77240`
- `nonrenewal/safeco/index.html` — present — `6791a3a0e2f7bab2b1580e664ae0763b22199c8577229f7960a5832f6a037ece`
- `sitemap.xml` — present — `da53ed6a3f3bcf9432c18ce74c51a65905ad6b369cb9b8511714555735b03149`
- `seo/DISPLACEMENT_CONTENT_REGISTRY.json` — present — `d92ee8b8fb37f30eaddc221f6a45cdd2fd7ce5a251655f6fb8db6cc775998279`

## Governing boundaries
- Displacement urgency is operational, not an underwriting or consumer lead score.
- Carrier/search/campaign context does not create Protection Score, eligibility, pricing, bindability, recommendation buy-in, or action readiness.
- Contact and channel permissions remain explicit and independent.
- Existing PVX/Home/Policy/Workspace systems are extended rather than forked.

## Focused QA
Configuration: `qa/cf-disp/config/CF_DISP_4_1_QA.json`
Result: `qa/cf-disp/results/CF_DISP_4_1_QA_RESULT.json`
Global behavioral suite: `CF_DISP_FOCUSED_QA.mjs`

## Regression gate
Normalized comparison is against the frozen baseline of **305 discovered / 208 passing / 97 historical failures**. Final program state is **306 / 209 / 97**, so this sprint introduces no unexplained regression failure in the final integrated candidate.

## Rollback
See `cf-disp/releases/CF_DISP_4_1_ROLLBACK.md`. Rollback is additive-first: remove/revert the sprint-owned integration while preserving the immutable v3.20.200 baseline semantics.
