# CF-ADV-1.20 — Client Snapshot 2

## Purpose

Create the producer-finalized, customer-facing living report.

## Implementation

Creates Client Snapshot 2.0 as the producer-finalized customer-facing Final report revision with actual recommendations, separate decisions, next steps, and only customer-visible quote information while preserving all prior revisions.

## Files

- `assets/js/pvx-client-snapshot-final.js`
- `CF_ADV_1_20_CLIENT_REPORT_CONTRACT.json`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- Only a producer can finalize the living customer report.
- Only actual recommendations appear as recommendations.
- Internal and underwriting notes are excluded.
- Final revision preserves history and never implies binding authorization.
