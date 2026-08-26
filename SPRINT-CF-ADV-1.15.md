# CF-ADV-1.15 — Evidence Aware Producer Copilot

## Purpose

Separate early discussion topics from actual recommendations in producer guidance.

## Implementation

Creates an evidence-aware producer Copilot with visibly separate discussion-topic and actual-recommendation lanes, failing closed to discussion whenever evidence or authority is absent.

## Files

- `assets/js/pvx-evidence-aware-copilot.js`
- `CF_ADV_1_15_COPILOT_CONTRACT.json`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- Early topics are always labeled as discussion only.
- Actual recommendations require recommendation status and authority.
- Missing evidence keeps the producer in verification mode.
- Copilot follows Listen, Connect, Recommend, Ask without fear language.
