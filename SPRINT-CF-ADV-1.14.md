# CF-ADV-1.14 — What I Learned 2

## Purpose

Combine discovery, reactions, Home Profile, policy status, and next action for the producer.

## Implementation

Creates What I Learned 2.0 for the producer, combining discovery and exact words, early reactions, Home Profile/readiness, policy evidence/recommendations/buy-in, latest revision, and a path-aware next action without collapsing semantics.

## Files

- `assets/js/pvx-what-i-learned.js`
- `CF_ADV_1_14_LEARNED_CONTRACT.json`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- Producer sees the full progressive context in one model.
- Exact customer wording and pre-call reactions remain intact.
- Home and policy path status drive the next action.
- Early topic, recommendation, readiness, and buy-in semantics remain separate.
