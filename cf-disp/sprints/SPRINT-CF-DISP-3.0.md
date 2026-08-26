# CF-DISP-3.0 — Acquisition Event Taxonomy

## Purpose
Extends the meaningful-signal event model from landing through bound/lost outcomes with enumerated, PII-free displacement details.

## Baseline
- CoverageFit: `3.20.200`
- Immutable source SHA-256: `cefd2d7b52bdc2a818941e981b9e867e08b1a14ccee17cd69d4a782eb2c7ba13`
- Program overlay: `CF-DISP-5.2`

## Implemented product surfaces
- `assets/js/displacement-analytics.js` — present — `10175e920234da9f811cae4ab9f798c6bfed4596a71ad38652b2e5e88738378e`
- `assets/js/pvx-consumer-events.js` — present — `ac7fadf077828d38a9bc7f1fc9b2a658f66a9d615d50b4177e42ddb8c4c9fdc8`
- `server/pvx-event-core.mjs` — present — `e9aebf923f224c259591df691cebe49feb699d013ba72d6d02d7b7b42b21c990`
- `contracts/CF_DISP_MEASUREMENT_CONTRACT.json` — present — `04eee797603cdc766b9d70ad60bdbc610b49e8841d6ed1b8d677dd72f86df945`

## Governing boundaries
- Displacement urgency is operational, not an underwriting or consumer lead score.
- Carrier/search/campaign context does not create Protection Score, eligibility, pricing, bindability, recommendation buy-in, or action readiness.
- Contact and channel permissions remain explicit and independent.
- Existing PVX/Home/Policy/Workspace systems are extended rather than forked.

## Focused QA
Configuration: `qa/cf-disp/config/CF_DISP_3_0_QA.json`
Result: `qa/cf-disp/results/CF_DISP_3_0_QA_RESULT.json`
Global behavioral suite: `CF_DISP_FOCUSED_QA.mjs`

## Regression gate
Normalized comparison is against the frozen baseline of **305 discovered / 208 passing / 97 historical failures**. Final program state is **306 / 209 / 97**, so this sprint introduces no unexplained regression failure in the final integrated candidate.

## Rollback
See `cf-disp/releases/CF_DISP_3_0_ROLLBACK.md`. Rollback is additive-first: remove/revert the sprint-owned integration while preserving the immutable v3.20.200 baseline semantics.
