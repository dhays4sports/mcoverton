# CF-ADV-1.8 Regression Report

Release: CoverageFit v3.20.79  
Baseline: CoverageFit v3.20.78 / CF-ADV-1.7

## Aggregate comparison

| Build | Total suites | Passing | Failing |
|---|---:|---:|---:|
| Incoming v3.20.78 | 181 | 117 | 64 |
| CF-ADV-1.8 v3.20.79 | 182 | 118 | 64 |

Failure-set comparison:

- New failing suites: **0**
- Historical failing suites removed/masked: **0**
- Historical failure set unchanged: **yes**
- New passing suite: `CF_ADV_1_8_QA.js`

The repository continues to contain 64 pre-existing failures. CF-ADV-1.8 is certified by exact failing-suite comparison with the incoming deployable rather than by presenting the historical baseline as green.

## Focused advisory QA

- CF-ADV-1.1: 30/30 passing
- CF-ADV-1.2: 48/48 passing
- CF-ADV-1.3: 68/68 passing
- CF-ADV-1.4: 104/104 passing
- CF-ADV-1.5: 131/131 passing
- CF-ADV-1.6: 58/58 passing
- CF-ADV-1.7: 53/53 passing
- CF-ADV-1.8: **87/87 passing**

## Protected files

Byte compatibility with the incoming v3.20.78 deployable is verified for:

- `assets/js/protection-score.js`
- `assets/js/home-recommendation-rules.js`
- `assets/js/recommendation-engine.js`
- `assets/js/workspace-data.js`

## Scoring parity

The focused suite evaluates the same scored answer set against:

1. the incoming validated question order; and
2. the CF-ADV-1.8 chapter-orchestrated order.

The numeric Protection Score, score status/band, per-category results, finding count, and per-key weighted penalties remain equivalent. Category presentation order may follow the conversational question order; category values do not change.

## Result

**PASS — no new aggregate regression failures relative to v3.20.78.**
