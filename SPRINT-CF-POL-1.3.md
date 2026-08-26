# CF-POL-1.3 — Policy Confirmation Scored Review Migration

## Purpose

Move scored review behind meaningful policy evidence and preserve score methodology.

## Implementation

Relocates the scored Home review behind meaningful current-policy evidence, adds fact-by-fact confirmation, presents the unchanged Protection Score methodology as Review Readiness, and keeps personal discovery out of score inputs.

## Files

- `assets/js/pvx-policy-scored-review.js`
- `CF_POL_1_3_SCORED_REVIEW_CONTRACT.json`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- No score is available without meaningful policy/document evidence.
- Identified facts require customer confirmation or Not sure.
- The protected score engine and its math remain unchanged.
- Personal discovery never enters score calculation.
