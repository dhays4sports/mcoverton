# CF-HOME-3.7 — Quote Readiness Engine

## Purpose

Classify producer preparation state without claiming carrier eligibility or approval.

## Implementation

Adds a deterministic quote-readiness engine with six preparation states and explicit guardrails against eligibility, underwriting, rate, or binding conclusions.

## Files

- `assets/js/pvx-quote-readiness.js`
- `CF_HOME_3_7_READINESS_CONTRACT.json`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- Readiness identifies confirmed, missing, conflicting, document, and producer-review items.
- Missing and conflict states fail closed.
- A complete profile becomes ready for producer review only.
- Readiness never means eligibility, underwriting approval, a rate promise, or authorization.
