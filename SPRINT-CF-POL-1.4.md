# CF-POL-1.4 — Review Topic Actual Recommendation Conversion

## Purpose

Convert early topics to findings and recommendations only through evidence-backed authority.

## Implementation

Adds the explicit bridge from early review topic to evidence-backed finding and actual recommendation, gated to the existing recommendation engine or licensed producer verification.

## Files

- `assets/js/pvx-topic-recommendation-bridge.js`
- `CF_POL_1_4_RECOMMENDATION_BRIDGE_CONTRACT.json`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- An early topic remains a worth-reviewing record.
- Confirmed policy or quote evidence is required before conversion.
- Only the protected recommendation engine or licensed producer may authorize a recommendation.
- Topic relevance is never promoted into recommendation buy-in.
