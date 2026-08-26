# CF-DISP-5.2 — Cross-System Regression + Production Candidate

## Purpose
Runs focused/normalized regression, protected-hash comparison, final cross-system certification, packaging, cutover, and rollback evidence.

## Baseline
- CoverageFit: `3.20.200`
- Immutable source SHA-256: `cefd2d7b52bdc2a818941e981b9e867e08b1a14ccee17cd69d4a782eb2c7ba13`
- Program overlay: `CF-DISP-5.2`

## Implemented product surfaces
- `CF_DISP_FOCUSED_QA.mjs` — present — `bfc68c130a67d67885c28c2be7e5b7ae88fd0f75f0eb9defbec4d9426adc11f1`
- `CF_DISP_BUILD.json` — present — `d5bfa3af7245c69511f77284c0fff2c1faf2d40d4e3b333c94c5616c4905f6d2`
- `cf-disp/baseline/PROTECTED_HASHES_FINAL.sha256` — present — `c07922aede342a3bf0bf55b6f8fb74d985106f41bdb4a89d2421c953e7813fec`

## Governing boundaries
- Displacement urgency is operational, not an underwriting or consumer lead score.
- Carrier/search/campaign context does not create Protection Score, eligibility, pricing, bindability, recommendation buy-in, or action readiness.
- Contact and channel permissions remain explicit and independent.
- Existing PVX/Home/Policy/Workspace systems are extended rather than forked.

## Focused QA
Configuration: `qa/cf-disp/config/CF_DISP_5_2_QA.json`
Result: `qa/cf-disp/results/CF_DISP_5_2_QA_RESULT.json`
Global behavioral suite: `CF_DISP_FOCUSED_QA.mjs`

## Regression gate
Normalized comparison is against the frozen baseline of **305 discovered / 208 passing / 97 historical failures**. Final program state is **306 / 209 / 97**, so this sprint introduces no unexplained regression failure in the final integrated candidate.

## Rollback
See `cf-disp/releases/CF_DISP_5_2_ROLLBACK.md`. Rollback is additive-first: remove/revert the sprint-owned integration while preserving the immutable v3.20.200 baseline semantics.
