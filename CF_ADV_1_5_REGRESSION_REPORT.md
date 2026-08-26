# CF-ADV-1.5 Regression Report

Release: CoverageFit 3.20.76  
Incoming baseline: CoverageFit 3.20.75 / CF-ADV-1.4

## Aggregate comparison

| Build | QA files | Passing | Failing |
|---|---:|---:|---:|
| Incoming 3.20.75 | 178 | 114 | 64 |
| CF-ADV-1.5 3.20.76 | 179 | 115 | 64 |

## Result

- New failing tests: **0**
- Resolved historical failing tests: **0**
- Historical failure set retained exactly: **64**
- New passing suite: `CF_ADV_1_5_QA.js`
- Focused CF-ADV-1.5 checks: **131/131 passing**
- Prior CF-ADV-1.1, 1.2, 1.3, and 1.4 behavioral suites remain passing.

The incoming aggregate suite was already red because of 64 historical failures. Certification therefore compares exact failure-set identity instead of representing the incoming baseline as green.

## Protected production contracts

The following files remain byte-identical to the incoming 3.20.75 package:

- `assets/js/protection-score.js`
- `assets/js/recommendation-engine.js`
- `assets/js/home-recommendation-rules.js`
- `assets/js/workspace-data.js`

SHA-256:

- `protection-score.js`: `0cf3190a5bb99aceb0e527f91268247481fd14e67acd81fb35db3accd8a5f2a8`
- `recommendation-engine.js`: `0d5973be5455d416c8f2477ce08f327adff0fff91bdb987efe62c6e8e8e6fe18`
- `home-recommendation-rules.js`: `0c4fb83590a2d0f29803f593a6716ba961c49a651542b74d53e01b9e33df4629`
- `workspace-data.js`: `8a11fd11fb3e027cfef746f4f9214b9d345c5db49862921dff27bbcfcc49eef2`

## Intentional compatibility edits

Existing QA files that enumerated supported forward release versions through `3.20.75` were extended to recognize `3.20.76`. These are test-harness compatibility edits only; no corresponding SMS, Workspace, score, recommendation, or policy behavior changed.

The historical CF-ADV-1.4 QA now verifies its release contract remains correctly stamped `3.20.75` while allowing the installed package to advance to later CF-ADV releases.

CF-ADV-1.2 and CF-ADV-1.3 forward-version allowlists were similarly extended to `3.20.76`.

## New implementation surface

CF-ADV-1.5 adds:

- `assets/js/advisory-relationship-discovery.js`
- `assets/css/advisory-relationship.css`
- the relationship section in `assessment/index.html`
- additive flow integration in `advisory-opening.js`, `property-confirmation.js`, `assessment-engine.js`, and `assessment-continuity.js`
- `CF_ADV_1_5_RELATIONSHIP_CONTRACT.json`
- `SPRINT-CF-ADV-1.5.md`
- `CF_ADV_1_5_QA.js`

## Conclusion

CF-ADV-1.5 introduces no new regression failure relative to the supplied 3.20.75 baseline and is certified to proceed to **CF-ADV-1.6 — Lifestyle & Dependency Discovery**.
