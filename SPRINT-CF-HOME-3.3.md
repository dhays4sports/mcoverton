# CF-HOME-3.3 — Core Property Characteristics

## Purpose

Collect only unknown or conflicting core property characteristics.

## Implementation

Defines the core property characteristic sequence and asks only facts that remain unknown or conflicting after prefill confirmation.

## Files

- `assets/js/pvx-home-core-characteristics.js`
- `CF_HOME_3_3_CORE_CHARACTERISTICS_CONTRACT.json`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- All required core home characteristics are normalized.
- Confirmed values are not repeated.
- Unknown and conflicting values alone enter the question queue.
- Not sure remains valid and is stored as unknown provenance.
