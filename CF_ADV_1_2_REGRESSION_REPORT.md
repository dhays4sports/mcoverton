# CF-ADV-1.2 Regression Report

Release: CoverageFit 3.20.73  
Compared baseline: CoverageFit 3.20.72 / CF-ADV-1.1

## Aggregate comparison

| Build | QA files | Passing | Failing |
|---|---:|---:|---:|
| Incoming 3.20.72 | 175 | 111 | 64 |
| CF-ADV-1.2 3.20.73 | 176 | 112 | 64 |

Result: **zero new failing tests** and **zero previously failing tests masked as fixed**. The failure set is identical to the incoming package. The one additional passing suite is `CF_ADV_1_2_QA.js`.

## Focused advisory QA

- `CF_ADV_1_1_QA.js`: PASS — prior discovery data contract remains compatible.
- `CF_ADV_1_2_QA.js`: PASS — 48 deterministic signal-engine checks.

## Forward-compatibility QA maintenance

The 3.20.73 version bump initially caused 13 otherwise-green historical compatibility suites to reject the release solely because their explicit version allowlists ended at 3.20.72. Their production assertions were not failing.

The following QA allowlists were extended to include 3.20.73 and then rerun successfully:

- `AW_UI_2_6_QA.mjs`
- `RCSMS1_1_QA.mjs`
- `RCSMS1_2_QA.mjs`
- `RCSMS1_3_QA.mjs`
- `RCSMS1_4_QA.mjs`
- `RCSMS1_5_QA.mjs`
- `RCSMS1_6_QA.mjs`
- `RCSMS1_7_QA.mjs`
- `RCSMS1_8_QA.mjs`
- `RCSMS1_9_QA.mjs`
- `RCSMS1_9_1_QA.mjs`
- `RCSMS1_9_2_QA.mjs`
- `RCSMS1_9_4_QA.mjs`

`CF_ADV_1_1_QA.js` was similarly changed from an exact 3.20.72 pin to a 3.20.x >= 72 compatibility assertion so future CF-ADV releases can continue certifying the 1.1 contract instead of failing solely on release numbering.

## Protected implementation hashes

The following production files are unchanged from the incoming package:

- `assets/js/protection-score.js` — `0cf3190a5bb99aceb0e527f91268247481fd14e67acd81fb35db3accd8a5f2a8`
- `assets/js/recommendation-engine.js` — `0d5973be5455d416c8f2477ce08f327adff0fff91bdb987efe62c6e8e8e6fe18`
- `assets/js/workspace-data.js` — `8a11fd11fb3e027cfef746f4f9214b9d345c5db49862921dff27bbcfcc49eef2`

## Historical failures

The package continues to contain 64 pre-existing historical regression failures, largely from older suites that pin earlier release expectations or legacy contracts. CF-ADV-1.2 does not claim those are resolved.
