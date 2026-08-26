# CF-DISP-3.1 — Google Ads Measurement + Enhanced Lead Conversion Bridge

## Purpose
Creates a current Data Manager-shaped outcome adapter with separate match data and no general-analytics PII.

## Baseline
- CoverageFit: `3.20.200`
- Immutable source SHA-256: `cefd2d7b52bdc2a818941e981b9e867e08b1a14ccee17cd69d4a782eb2c7ba13`
- Program overlay: `CF-DISP-5.2`

## Implemented product surfaces
- `server/displacement-conversion-core.mjs` — present — `5f24fd779be80782e1b2b3dfd7cdbbfee34339bc156cde159488de36a6b8c5b0`
- `campaigns/google-ads/GOOGLE_MEASUREMENT_IMPLEMENTATION.md` — present — `f4d4f1dfb4dd8964254cbb2d0c83701909e6a74cedbc0df12e18ce899227541d`
- `campaigns/google-ads/DATA_MANAGER_TEMPLATE.csv` — present — `6039d719ec7e43a621a8c8fecc71026bcf5146e7bd89b1e87d9764dfd380948f`

## Governing boundaries
- Displacement urgency is operational, not an underwriting or consumer lead score.
- Carrier/search/campaign context does not create Protection Score, eligibility, pricing, bindability, recommendation buy-in, or action readiness.
- Contact and channel permissions remain explicit and independent.
- Existing PVX/Home/Policy/Workspace systems are extended rather than forked.

## Focused QA
Configuration: `qa/cf-disp/config/CF_DISP_3_1_QA.json`
Result: `qa/cf-disp/results/CF_DISP_3_1_QA_RESULT.json`
Global behavioral suite: `CF_DISP_FOCUSED_QA.mjs`

## Regression gate
Normalized comparison is against the frozen baseline of **305 discovered / 208 passing / 97 historical failures**. Final program state is **306 / 209 / 97**, so this sprint introduces no unexplained regression failure in the final integrated candidate.

## Rollback
See `cf-disp/releases/CF_DISP_3_1_ROLLBACK.md`. Rollback is additive-first: remove/revert the sprint-owned integration while preserving the immutable v3.20.200 baseline semantics.
