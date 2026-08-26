# CF-ADV-1.22 — Progressive Value Learning Loop

## Purpose

Record which value checkpoints move prospects toward contact, quote, and sale.

## Implementation

Adds the progressive-value learning loop, recording privacy-minimized forward movements from Snapshot through Home Profile, contact, policy review, quote, and sale with association-only influence tags.

## Files

- `assets/js/pvx-value-learning-loop.js`
- `CF_ADV_1_22_LEARNING_CONTRACT.json`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- Every commercial value transition can be recorded independently.
- Only approved influence categories are retained.
- The learning loop reports associations and never asserts causation.
- Free text, customer words, contact details, and sensitive content are excluded.
