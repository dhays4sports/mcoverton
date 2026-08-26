# CF-ADV-1.10 Regression Report

Release: CoverageFit v3.20.81  
Sprint: CF-ADV-1.10 — Customer Language & Reaction Layer

## Aggregate comparison

| Build | Passed | Total | Failed |
|---|---:|---:|---:|
| Incoming v3.20.80 | 119 | 183 | 64 |
| CF-ADV-1.10 v3.20.81 | 120 | 184 | 64 |

- New focused suite: `CF_ADV_1_10_QA.js`
- New failing suites: **0**
- Historical failing suites removed/masked: **0**
- Historical failure set: **exactly identical by failing test filename** to the incoming baseline.

## Protected runtime boundaries

The following files remain byte-identical to the incoming v3.20.80 build:

- `assets/js/protection-score.js`
- `assets/js/home-recommendation-rules.js`
- `assets/js/recommendation-engine.js`
- `assets/js/workspace-data.js`

CF-ADV-1.10 adds customer-facing acknowledgment presentation only. It does not change score math, scored-question eligibility, recommendation eligibility/ranking, recommendation response state, or CF-ADV-1.2 signal rules.
