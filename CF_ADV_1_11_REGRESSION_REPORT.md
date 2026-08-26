# CF-ADV-1.11 Regression Report

Release: CoverageFit v3.20.82  
Sprint: CF-ADV-1.11 — “Your CoverageFit” Results Model

## Aggregate comparison

| Build | Passed | Total | Failed |
|---|---:|---:|---:|
| Incoming v3.20.81 | 120 | 184 | 64 |
| CF-ADV-1.11 v3.20.82 | 121 | 185 | 64 |

- New focused suite: `CF_ADV_1_11_QA.js`
- CF-ADV-1.11 focused QA: **94/94 passing**
- New failing suites: **0**
- Historical failing suites removed/masked: **0**
- Historical failure set: **exactly identical by failing test filename** to the incoming baseline.

## Protected runtime boundaries

The following files remain byte-identical to incoming v3.20.81:

- `assets/js/protection-score.js`
- `assets/js/home-recommendation-rules.js`
- `assets/js/recommendation-engine.js`
- `assets/js/workspace-data.js`
- `assets/js/prospect-report-access.js`
- `server/prospect-report-core.mjs`

CF-ADV-1.11 changes the Home report model/presentation hierarchy only. It does not change score math, score methodology, recommendation eligibility/ranking, or private-report access/security.
