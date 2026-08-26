# CF-ADV-1.18 — Progressive Advisory Guardrails

## Purpose

Apply truthful language guardrails across Snapshot, readiness, recommendations, and prompts.

## Implementation

Adds progressive advisory language and evidence guardrails across Snapshot, quote readiness, actual recommendations, and producer prompts, failing closed on deficiency, eligibility, rate, fear, evidence, or authority violations.

## Files

- `assets/js/pvx-progressive-guardrails.js`
- `CF_ADV_1_18_GUARDRAILS_CONTRACT.json`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- Snapshot copy cannot claim deficiency, score, or recommendation.
- Quote readiness cannot claim eligibility, approval, or rate.
- Recommendations require evidence, authorized source, and actual-recommendation status.
- Producer prompts reject fear language and use safe labels.
