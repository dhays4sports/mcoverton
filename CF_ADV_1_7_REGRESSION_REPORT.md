# CF-ADV-1.7 Regression Report

Release: CoverageFit v3.20.78  
Baseline: CoverageFit v3.20.77 / CF-ADV-1.6

## Aggregate comparison

| Build | Total suites | Passing | Failing |
|---|---:|---:|---:|
| Incoming v3.20.77 | 180 | 116 | 64 |
| CF-ADV-1.7 v3.20.78 | 181 | 117 | 64 |

Failure-set comparison:

- New failing suites: **0**
- Historical failing suites removed/masked: **0**
- Historical failure set unchanged: **yes**
- New passing suite: `CF_ADV_1_7_QA.js`

The aggregate repository suite contains 64 pre-existing failures. CF-ADV-1.7 is certified by exact failing-suite comparison with the incoming deployable rather than by presenting the historical baseline as green.

## Focused advisory QA

- CF-ADV-1.1: 30/30 passing
- CF-ADV-1.2: 48/48 passing
- CF-ADV-1.3: 68/68 passing
- CF-ADV-1.4: 104/104 passing
- CF-ADV-1.5: 131/131 passing
- CF-ADV-1.6: 58/58 passing after forward-flow compatibility assertions
- CF-ADV-1.7: **53/53 passing**

## Protected files

The CF-ADV-1.7 focused suite verifies byte compatibility against v3.20.77 for:

- `assets/js/protection-score.js`
- `assets/js/home-recommendation-rules.js`
- `assets/js/recommendation-engine.js`
- `assets/js/workspace-data.js`

## Result

**PASS — no new aggregate regression failures relative to v3.20.77.**
