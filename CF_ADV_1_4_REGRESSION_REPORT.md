# CF-ADV-1.4 Regression Report

Release: CoverageFit 3.20.75  
Incoming baseline: CoverageFit 3.20.74 / CF-ADV-1.3

## Aggregate comparison

| Build | QA files | Passing | Failing |
|---|---:|---:|---:|
| Incoming 3.20.74 | 177 | 113 | 64 |
| CF-ADV-1.4 3.20.75 | 178 | 114 | 64 |

## Result

- New failing tests: **0**
- Resolved historical failing tests: **0**
- Historical failure set retained exactly: **64**
- New passing suite: `CF_ADV_1_4_QA.js`
- Focused CF-ADV-1.4 checks: **104/104 passing**
- Prior CF-ADV-1.1, 1.2, and 1.3 behavioral suites remain passing.

The incoming aggregate suite was already red because of 64 historical failures. Certification therefore compares exact failure-set identity instead of representing the incoming baseline as green.

## Protected production contracts

The following files remain byte-identical to the incoming 3.20.74 package:

- `assets/js/protection-score.js`
- `assets/js/recommendation-engine.js`
- `assets/js/home-recommendation-rules.js`
- `assets/js/workspace-data.js`

## Intentional compatibility edits

Existing QA files that explicitly enumerated supported forward release versions through `3.20.74` were extended to include `3.20.75`.

`CF_INT_1D_QA.js` was updated to recognize `reviewContext: activeReviewReason()` as the new additive path. The resolver still falls back to the existing personalization/prefill review reason and therefore preserves the original intent-continuity assertion while allowing a customer-confirmed CF-ADV-1.4 reason to take precedence.

CF-ADV-1.1 and 1.2 string-level QA assertions were widened from `const discoveryProfile` to `const` or `let discoveryProfile`, because CF-ADV-1.4 must merge opening discovery into the existing seeded profile before signal derivation. No behavioral boundary was weakened.

## Conclusion

CF-ADV-1.4 introduces no new regression failure relative to the supplied 3.20.74 baseline and is certified to proceed to CF-ADV-1.5.
