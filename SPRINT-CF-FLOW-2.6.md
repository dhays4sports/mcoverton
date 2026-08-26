# CF-FLOW-2.6 — Producer Status Synchronization

## Purpose

Synchronize detailed producer workflow statuses to simple customer-facing progress.

## Implementation

Adds authenticated, ownership-preserving producer status synchronization with nine operational states, append-only history, and a deliberately simplified customer-facing projection that excludes internal and underwriting notes.

## Files

- `server/pvx-producer-status-core.mjs`
- `functions/api/pvx/producer-status.js`
- `CF_FLOW_2_6_STATUS_CONTRACT.json`
- `tests/pvx-producer-status-core-qa.mjs`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- Only an authenticated producer can change status.
- All nine producer states are append-only history.
- Existing journey ownership cannot be silently reassigned.
- Customer statuses stay simple and never reveal internal or underwriting notes.
