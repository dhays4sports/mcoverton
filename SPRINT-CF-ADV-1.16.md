# CF-ADV-1.16 — Path Aware Focus Mode 2

## Purpose

Guide Understand, Verify, Discuss, Recommend, Decide, and Next Step by journey path.

## Implementation

Creates path-aware Focus Mode 2 with Understand, Verify, Discuss, Recommend, Decide, and Next Step stages; recommendation stays locked until evidence-backed authority exists.

## Files

- `assets/js/pvx-focus-mode.js`
- `CF_ADV_1_16_FOCUS_CONTRACT.json`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- All six conversation stages are explicit.
- Prompts change for Snapshot, Home, policy, and combined paths.
- Recommend remains locked without actual evidence-backed recommendations.
- Decide captures buy-in separately from authorization and Next Step.
