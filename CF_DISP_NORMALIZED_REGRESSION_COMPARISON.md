# CF-DISP Normalized Full Regression Comparison

## Result

**PASS — zero unexplained new product failures.**

| State | Version | Discovered | Passed | Failed |
|---|---|---:|---:|---:|
| Immutable baseline | 3.20.200 | 305 | 208 | 97 |
| CF-DISP-5.2 integrated candidate | 3.20.200 + overlay | 306 | 209 | 97 |

- New unexplained failures: **0**
- Resolved historical failures: **0**
- Historical baseline failures preserved: **97**
- Integrated CF-DISP root behavioral suite: **27/27 passed**
- Per-sprint focused QA: **141/141 passed across 22 sprints**
- Final 30-point acceptance E2E suite: **30/30 passed**

The extra discovered/passing root test is `CF_DISP_FOCUSED_QA.mjs`. Historical failures are primarily inherited old release/version assertions and legacy harness expectations. This program does not rewrite historical assertions merely to turn the suite green.

Machine-readable evidence:
- `cf-disp/baseline/BASELINE_REGRESSION.json`
- `cf-disp/baseline/FINAL_REGRESSION.json`
- `cf-disp/baseline/NORMALIZED_REGRESSION.json`
- `cf-disp/evidence/CF_DISP_FOCUSED_QA_RESULT.json`
- `cf-disp/evidence/CF_DISP_PER_SPRINT_QA_SUMMARY.json`
- `cf-disp/evidence/CF_DISP_E2E_QA_RESULT.json`
