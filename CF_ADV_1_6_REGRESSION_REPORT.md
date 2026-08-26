# CF-ADV-1.6 Regression Report

Release: CoverageFit v3.20.77  
Baseline: CoverageFit v3.20.76 / CF-ADV-1.5

## Aggregate comparison

| Build | Total suites | Passing | Failing |
|---|---:|---:|---:|
| Incoming v3.20.76 | 179 | 115 | 64 |
| CF-ADV-1.6 v3.20.77 | 180 | 116 | 64 |

Failure-set comparison:

- New failing suites: **0**
- Historical failing suites removed/masked: **0**
- Historical failure set unchanged: **yes**
- New passing suite: `CF_ADV_1_6_QA.js`

The aggregate suite in this repository contains 64 pre-existing failures, largely old exact-version assertions and frozen historical assumptions. CF-ADV-1.6 was certified by comparing the exact failing-suite set to the incoming deployable rather than presenting that baseline as green.

## Focused advisory QA

- CF-ADV-1.1: passing
- CF-ADV-1.2: passing
- CF-ADV-1.3: passing
- CF-ADV-1.4: passing
- CF-ADV-1.5: passing after forward-flow compatibility assertions
- CF-ADV-1.6: **62/62 passing**

## Protected files

The focused CF-ADV-1.6 suite verifies byte compatibility for:

- `assets/js/protection-score.js`
- `assets/js/home-recommendation-rules.js`
- `assets/js/recommendation-engine.js`
- `assets/js/workspace-data.js`

## Result

**PASS — no new aggregate regression failures relative to v3.20.76.**
