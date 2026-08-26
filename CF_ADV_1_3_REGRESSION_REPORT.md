# CF-ADV-1.3 Regression Report

Release: CoverageFit 3.20.74  
Incoming baseline: CoverageFit 3.20.73 / CF-ADV-1.2

## Aggregate comparison

| Build | QA files | Passing | Failing |
|---|---:|---:|---:|
| Incoming 3.20.73 | 176 | 112 | 64 |
| CF-ADV-1.3 3.20.74 | 177 | 113 | 64 |

## Result

- New failing tests: **0**
- Resolved historical failing tests: **0**
- Historical failure set retained exactly: **64**
- New passing suite: `CF_ADV_1_3_QA.js`
- Focused CF-ADV-1.3 checks: **68/68 passing**
- Prior CF-ADV-1.1 and CF-ADV-1.2 behavioral suites remain passing after forward-version compatibility adjustment.

The aggregate suite in the incoming package was already red because of 64 historical failures. Certification therefore compares the exact failure-set identity rather than presenting the incoming baseline as green.

## Protected production contracts

The following files remain byte-identical to the incoming 3.20.73 package:

- `assets/js/protection-score.js`
- `assets/js/recommendation-engine.js`
- `assets/js/home-recommendation-rules.js`
- `assets/js/workspace-data.js`

## Intentional QA-only compatibility edits

Existing QA files that explicitly enumerated supported forward release versions through `3.20.73` were extended to include `3.20.74`. No behavioral assertion in those files was weakened or removed.

## Conclusion

CF-ADV-1.3 introduces no new regression failure relative to the supplied 3.20.73 baseline and is certified to proceed to CF-ADV-1.4.
