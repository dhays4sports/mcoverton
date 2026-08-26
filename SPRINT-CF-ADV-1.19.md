# CF-ADV-1.19 — Agent Guide 2

## Purpose

Combine discovery, property facts, evidence, missing information, and conversation anchors.

## Implementation

Creates Agent Guide 2.0 by combining the customer opening, exact words, normalized property facts and sources, policy evidence, missing/conflict queues, discussion topics, recommendation anchors, and next action.

## Files

- `assets/js/pvx-agent-guide.js`
- `CF_ADV_1_19_GUIDE_CONTRACT.json`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- Producer guide combines all required progressive inputs.
- Property facts retain source labels and unresolved queues.
- Discussion topics and recommendation anchors are distinct sections.
- Guide is copy/print ready and follows Listen, Connect, Recommend, Ask.
