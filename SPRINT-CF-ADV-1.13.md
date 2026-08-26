# CF-ADV-1.13 — Recommendation Buy In Capture

## Purpose

Capture recommendation buy-in separately from relevance, preference, decision, and authorization.

## Implementation

Resumes recommendation buy-in only at the evidence-backed point, capturing four logic reactions as recommendationResponse records distinct from topic relevance, coverage preference, final decision, and binding authorization.

## Files

- `assets/js/pvx-recommendation-buy-in.js`
- `CF_ADV_1_13_BUY_IN_CONTRACT.json`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- Buy-in cannot be captured for an early review topic.
- An evidence-backed actual recommendation and authorized source are required.
- Four recommendation reaction states are preserved.
- Buy-in remains separate from preference, decision, and binding authorization.
