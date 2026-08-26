# CF-ADV-1.17 — Live Notes Customer Wording Reactions

## Purpose

Preserve customer wording, pre-call topic reactions, and live producer notes.

## Implementation

Adds a three-stream live-notes journal that preserves exact customer wording and pre-call topic reactions immutably while keeping producer live notes separate, anchored, sanitized, and internal.

## Files

- `assets/js/pvx-live-notes.js`
- `CF_ADV_1_17_NOTES_CONTRACT.json`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- Exact customer words remain verbatim records.
- Pre-call topic reactions remain distinct and immutable.
- Producer notes are append-only and cannot overwrite customer records.
- Internal notes do not change evidence or appear on customer surfaces.
