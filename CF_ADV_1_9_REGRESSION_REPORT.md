# CF-ADV-1.9 Regression Report

Release: CoverageFit v3.20.80  
Sprint: CF-ADV-1.9 — Progressive Discovery Branching

## Aggregate comparison

| Build | Passed | Total | Failed |
|---|---:|---:|---:|
| Incoming v3.20.79 | 118 | 182 | 64 |
| CF-ADV-1.9 v3.20.80 | 119 | 183 | 64 |

- New focused suite: `CF_ADV_1_9_QA.js`
- New failing suites: **0**
- Historical failing suites removed/masked: **0**
- Historical failure set: **byte-for-byte test-name identical** to the incoming baseline set.

## Protected runtime boundaries

The following files remain byte-identical to the incoming build:

- `assets/js/protection-score.js`
- `assets/js/home-recommendation-rules.js`
- `assets/js/recommendation-engine.js`
- `assets/js/workspace-data.js`

CF-ADV-1.9 changes discovery presentation/branching only. It does not change score math, scored-question eligibility, recommendation eligibility/ranking, or CF-ADV-1.2 signal rules.
