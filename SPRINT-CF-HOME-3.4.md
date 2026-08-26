# CF-HOME-3.4 — Updates Reconstruction Detail Branching

## Purpose

Reuse Snapshot upgrade context and collect targeted reconstruction details without repetition.

## Implementation

Reuses the Snapshot upgrade answer, asks which areas changed once, and opens only one-level reconstruction-detail follow-ups for selected areas.

## Files

- `assets/js/pvx-home-updates.js`
- `CF_HOME_3_4_UPDATES_CONTRACT.json`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- The customer is never asked whether upgrades exist a second time.
- The Snapshot evidence reference is preserved.
- Only selected update areas reveal one-level detail prompts.
- Update facts remain customer reported until producer verification.
