# CF-FLOW-2.2 — Living Report Revision Ledger

## Purpose

Preserve immutable report revisions from Snapshot through final producer review.

## Implementation

Adds the immutable living-report revision ledger for Snapshot 1, Home 2H, Policy 2P, Combined 3, and Final producer-reviewed output; prior revisions are always retrievable and never silently overwritten.

## Files

- `assets/js/pvx-report-revision-ledger.js`
- `CF_FLOW_2_2_LEDGER_CONTRACT.json`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- Five approved revision types have deterministic order.
- Appending identical content is idempotent.
- Conflicting content cannot overwrite an existing revision.
- Combined and Final reports require their prerequisite evidence and all prior revisions remain retrievable.
