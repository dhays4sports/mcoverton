# CF-DISP-5.0 — Multi-Carrier Displacement Framework

## Purpose
Makes Safeco the first configuration in a reusable carrier framework and documents the factual/editorial gate for future carriers.

## Baseline
- CoverageFit: `3.20.200`
- Immutable source SHA-256: `cefd2d7b52bdc2a818941e981b9e867e08b1a14ccee17cd69d4a782eb2c7ba13`
- Program overlay: `CF-DISP-5.2`

## Implemented product surfaces
- `assets/js/displacement-carriers.js` — present — `204a027537a694d09bbe841442a0c732ca27fe7e8f33b313f2f2df359cc8e910`
- `cf-disp/CARRIER_FACT_REGISTRY.json` — present — `73db78f58e64dddeb943d4ad01b62ce6f3b641024bfb1a22ecd803f8021f5fad`
- `seo/CARRIER_EXTENSION_GUIDE.md` — present — `4228391c5fbc459e7e02e7819f2b188700e6d3dc18693e3a39c419225b57ee14`

## Governing boundaries
- Displacement urgency is operational, not an underwriting or consumer lead score.
- Carrier/search/campaign context does not create Protection Score, eligibility, pricing, bindability, recommendation buy-in, or action readiness.
- Contact and channel permissions remain explicit and independent.
- Existing PVX/Home/Policy/Workspace systems are extended rather than forked.

## Focused QA
Configuration: `qa/cf-disp/config/CF_DISP_5_0_QA.json`
Result: `qa/cf-disp/results/CF_DISP_5_0_QA_RESULT.json`
Global behavioral suite: `CF_DISP_FOCUSED_QA.mjs`

## Regression gate
Normalized comparison is against the frozen baseline of **305 discovered / 208 passing / 97 historical failures**. Final program state is **306 / 209 / 97**, so this sprint introduces no unexplained regression failure in the final integrated candidate.

## Rollback
See `cf-disp/releases/CF_DISP_5_0_ROLLBACK.md`. Rollback is additive-first: remove/revert the sprint-owned integration while preserving the immutable v3.20.200 baseline semantics.
