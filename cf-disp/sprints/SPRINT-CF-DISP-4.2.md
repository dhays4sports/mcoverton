# CF-DISP-4.2 — Search Query → Content Learning Loop

## Purpose
Creates a privacy-safe candidate-topic registry driven by downstream quality while explicitly prohibiting automatic publication.

## Baseline
- CoverageFit: `3.20.200`
- Immutable source SHA-256: `cefd2d7b52bdc2a818941e981b9e867e08b1a14ccee17cd69d4a782eb2c7ba13`
- Program overlay: `CF-DISP-5.2`

## Implemented product surfaces
- `seo/DISPLACEMENT_CONTENT_REGISTRY.json` — present — `d92ee8b8fb37f30eaddc221f6a45cdd2fd7ce5a251655f6fb8db6cc775998279`
- `contracts/CF_DISP_MEASUREMENT_CONTRACT.json` — present — `04eee797603cdc766b9d70ad60bdbc610b49e8841d6ed1b8d677dd72f86df945`

## Governing boundaries
- Displacement urgency is operational, not an underwriting or consumer lead score.
- Carrier/search/campaign context does not create Protection Score, eligibility, pricing, bindability, recommendation buy-in, or action readiness.
- Contact and channel permissions remain explicit and independent.
- Existing PVX/Home/Policy/Workspace systems are extended rather than forked.

## Focused QA
Configuration: `qa/cf-disp/config/CF_DISP_4_2_QA.json`
Result: `qa/cf-disp/results/CF_DISP_4_2_QA_RESULT.json`
Global behavioral suite: `CF_DISP_FOCUSED_QA.mjs`

## Regression gate
Normalized comparison is against the frozen baseline of **305 discovered / 208 passing / 97 historical failures**. Final program state is **306 / 209 / 97**, so this sprint introduces no unexplained regression failure in the final integrated candidate.

## Rollback
See `cf-disp/releases/CF_DISP_4_2_ROLLBACK.md`. Rollback is additive-first: remove/revert the sprint-owned integration while preserving the immutable v3.20.200 baseline semantics.
