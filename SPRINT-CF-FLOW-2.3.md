# CF-FLOW-2.3 — Zero Repeat Conflict Reconciliation

## Purpose

Reuse agreeing facts, preserve history, surface conflicts once, and keep unknowns explicit.

## Implementation

Adds zero-repeat reconciliation across all nine inbound sources: agreement reuses, newer trusted confirmation updates with history, unresolved conflicts ask once, and unknown remains unknown without silent winner selection.

## Files

- `assets/js/pvx-zero-repeat-reconciliation.js`
- `CF_FLOW_2_3_RECONCILIATION_CONTRACT.json`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- All nine roadmap sources are normalized.
- Agreement is reused without another question.
- Trusted confirmation updates value while preserving full history.
- Unresolved conflicts are asked once and never silently resolved; unknown remains unknown.
