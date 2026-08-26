# CF-ADV-1.12 Regression Report

Release: CoverageFit v3.20.83  
Sprint: CF-ADV-1.12 — “Why This Fits You” Recommendation Cards

## Aggregate comparison

| Build | Passed | Total | Failed |
|---|---:|---:|---:|
| Incoming v3.20.82 | 121 | 185 | 64 |
| CF-ADV-1.12 v3.20.83 | 122 | 186 | 64 |

- New focused suite: `CF_ADV_1_12_QA.js`
- CF-ADV-1.12 focused QA: **98/98 passing**
- New failing suites: **0**
- Historical failing suites removed/masked: **0**
- Historical failure set: **exactly identical by failing test filename** to the incoming v3.20.82 baseline.

## Protected runtime boundaries

The following files remain byte-identical to incoming v3.20.82:

- `assets/js/protection-score.js`
- `assets/js/home-recommendation-rules.js`
- `assets/js/recommendation-engine.js`
- `assets/js/workspace-data.js`
- `assets/js/report-engine.js`
- `assets/js/prospect-report-access.js`
- `server/prospect-report-core.mjs`

CF-ADV-1.12 is an additive report-card presentation/model layer. It does not create recommendation topics, alter recommendation eligibility/ranking, change Protection Score behavior, or alter private-report access/security.
