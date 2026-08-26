# CF-ADV-1.23 — Checkpoint Analytics

## Purpose

Measure every journey checkpoint independently without leaking sensitive content.

## Implementation

Adds independent analytics for every progressive-value checkpoint and question abandonment using a strict property allowlist that excludes answer content, exact words, addresses, contact details, policy values, and documents.

## Files

- `assets/js/pvx-checkpoint-analytics.js`
- `CF_ADV_1_23_ANALYTICS_CONTRACT.json`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- Every approved funnel and abandonment checkpoint is independently measurable.
- Only allowlisted operational properties are emitted.
- No sensitive answer, contact, property, policy, or document content enters analytics.
- No conversion target is invented before a meaningful pilot cohort.
