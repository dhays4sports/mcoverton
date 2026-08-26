# CF-ADV-1.21 — Progressive Decision Ledger

## Purpose

Separate relevance, buy-in, preference, final choice, and authorization records.

## Implementation

Adds the progressive decision ledger with immutable, non-inferred records for topic relevance, recommendation buy-in, coverage preference, final choice, and explicit scoped authorization.

## Files

- `assets/js/pvx-decision-ledger.js`
- `CF_ADV_1_21_DECISION_CONTRACT.json`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- Five decision semantics have separate record types.
- Relevance can only originate from topicResponse and buy-in from recommendationResponse.
- Final choice is not authorization.
- Authorization requires explicit customer action and a recorded scope and can never be inferred.
