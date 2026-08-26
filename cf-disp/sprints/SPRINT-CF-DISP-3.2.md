# CF-DISP-3.2 — Google Search Campaign Launch Kit

## Purpose
Produces two launch-ready Search campaign structures, query controls, ads, measurement mapping, operating rules, and trademark guardrails.

## Baseline
- CoverageFit: `3.20.200`
- Immutable source SHA-256: `cefd2d7b52bdc2a818941e981b9e867e08b1a14ccee17cd69d4a782eb2c7ba13`
- Program overlay: `CF-DISP-5.2`

## Implemented product surfaces
- `campaigns/google-ads/CAMPAIGN_STRUCTURE.csv` — present — `693a0eafa81983785693ce2e4e658954b661f79dea08e980b0f9e74d7c0321bb`
- `campaigns/google-ads/KEYWORDS.csv` — present — `6c2684d92d0f4d72f252eadd5f51bb33e455b8055cc098d389585db0a80d5b8f`
- `campaigns/google-ads/NEGATIVE_KEYWORDS.txt` — present — `05b7c573d7da4b474f388906764e33f2aa512ebf35327889575dcd406e16444e`
- `campaigns/google-ads/RSA_COPY.csv` — present — `d87961151bcd0fa23825a98ea38aa8ad9903ef35048992c0fa96a8135b76ee08`
- `campaigns/google-ads/GOOGLE_ADS_LAUNCH_RUNBOOK.md` — present — `91142657c7fe2eaa7fe953786f84bf2c0f1da6a87b7af455e3409b094560b49c`

## Governing boundaries
- Displacement urgency is operational, not an underwriting or consumer lead score.
- Carrier/search/campaign context does not create Protection Score, eligibility, pricing, bindability, recommendation buy-in, or action readiness.
- Contact and channel permissions remain explicit and independent.
- Existing PVX/Home/Policy/Workspace systems are extended rather than forked.

## Focused QA
Configuration: `qa/cf-disp/config/CF_DISP_3_2_QA.json`
Result: `qa/cf-disp/results/CF_DISP_3_2_QA_RESULT.json`
Global behavioral suite: `CF_DISP_FOCUSED_QA.mjs`

## Regression gate
Normalized comparison is against the frozen baseline of **305 discovered / 208 passing / 97 historical failures**. Final program state is **306 / 209 / 97**, so this sprint introduces no unexplained regression failure in the final integrated candidate.

## Rollback
See `cf-disp/releases/CF_DISP_3_2_ROLLBACK.md`. Rollback is additive-first: remove/revert the sprint-owned integration while preserving the immutable v3.20.200 baseline semantics.

## Expanded launch kit
- `campaigns/google-ads/CAMPAIGN_SETTINGS.csv` — `f8710e0967c15be0d295e6e916beb5868affc67fd8e0e76063dc4f03944378be`
- `campaigns/google-ads/SITELINKS_CALLOUTS.csv` — `eaae302875ac53cfb4c126488546b83c8f6e9e064203efb76026c6a6da37399f`
- `campaigns/google-ads/CONVERSION_MAP.csv` — `302f9516deb5469cb2b78cc9e4841dc59c5384c345671f6c363c4cbf327385a1`
- `campaigns/google-ads/UTM_CONVENTIONS.md` — `ccc900592e63fa8daab81c4fcb393d21f1a6258807aa30de0f22ba35a3ad17fb`
- `campaigns/google-ads/SEARCH_TERM_REVIEW_TEMPLATE.csv` — `e5867fc90fc102071fd9bd992eab8225229b4374f9ae27b627f3ef932847ff54`
- `campaigns/google-ads/LAUNCH_CHECKLIST.md` — `dccb01c7d722a0bb6a1591f1d19f02d3e4c50e6c394a615182f3424bcd630b76`
