# CF-FLOW-2.4 — Producer Checkpoint Notification Orchestrator

## Purpose

Create deduplicated, ownership-aware notifications at meaningful checkpoints.

## Implementation

Adds the producer checkpoint notification outbox for eight journey events with deterministic deduplication, preserved producer ownership, channel routing, and retry-safe delivery state.

## Files

- `server/pvx-notification-orchestrator.mjs`
- `CF_FLOW_2_4_NOTIFICATION_CONTRACT.json`
- `tests/pvx-notification-orchestrator-qa.mjs`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- All eight notification checkpoints are modeled.
- Duplicate events for the same subject are suppressed deterministically.
- Producer ownership is required and preserved.
- Delivery retries use an outbox without exposing internal notes to customers.
