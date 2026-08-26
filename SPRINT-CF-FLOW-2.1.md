# CF-FLOW-2.1 — Multi Path Journey Orchestrator

## Purpose

Support Snapshot, Home Profile, policy review, both orders, later return, and producer assistance.

## Implementation

Adds the durable multi-path orchestrator for Snapshot-only, either optional path, both paths in either order, successful pause/return, and producer-assisted completion.

## Files

- `assets/js/pvx-multipath-orchestrator.js`
- `CF_FLOW_2_1_ORCHESTRATOR_CONTRACT.json`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- Every approved path combination is representable.
- Home Profile and policy review remain independent and order-agnostic.
- Continue later preserves exact path and step.
- Producer-assisted completion uses the same journey rather than a parallel record.
