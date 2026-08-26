# CF-ADV-1.11 — “Your CoverageFit” Results Model

Release: CoverageFit 3.20.82  
Status: COMPLETE

## Goal

Make the customer’s situation the hero of the Home Snapshot and move Protection Score into a supporting diagnostic role without changing score math, evidence semantics, recommendation eligibility/ranking, or private-report security.

## Customer-facing hierarchy

1. Why you’re reviewing
2. What matters most
3. Your home & household context
4. What would be hardest
5. Strong starting points
6. Worth discussing
7. Review Readiness / Protection Score

## Implementation

- Added `assets/js/advisory-results-model.js`.
- Added `assets/css/advisory-results-model.css`.
- Added persisted `report.advisoryResults` generation at Home assessment completion.
- Added report-view re-derivation so legacy reports without the persisted model still render the new hierarchy.
- Reordered Home report page 1 so advisory context and existing strengths appear before Review Readiness.
- Added a compact worth-discussing preview from the already-valid scored priority set.
- Updated Review Readiness copy so the score is explicitly a supporting diagnostic, not a policy adequacy judgment.

## Evidence rules

Discovery claims shown as personalized report context require stored evidence references. `unsure`, `prefer_not_to_answer`, unknown, or evidence-less discovery records fail closed to neutral copy. Scored strengths and worth-discussing topics continue to come from the established assessment output.

## Guardrails

- No Protection Score formula change.
- No score number or category-value change.
- No recommendation creation or reranking.
- No price-first penalty or negative fit label.
- No change to private report creation/read access, TTL, or security.
- No change to the frozen legacy Workspace adapter.
- No “because you told us” recommendation-card anatomy yet; that belongs to CF-ADV-1.12.

## Regression strategy

Compare the v3.20.82 aggregate failure set against the incoming v3.20.81 baseline. The incoming baseline is 120/184 passing with 64 historical failures. CF-ADV-1.11 adds one focused QA suite and must introduce zero new failures.

## Next

`CF-ADV-1.12 — “Why This Fits You” Recommendation Cards`
