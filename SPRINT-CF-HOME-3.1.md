# CF-HOME-3.1 — Home Profile Data Contract

## Purpose

Create provenance-aware Home Profile and quote-readiness data contracts.

## Implementation

Creates the normalized Home Profile contract with field-level provenance, evidence references, unknown/conflict states, and quote-readiness semantics that cannot imply carrier eligibility.

## Files

- `assets/js/pvx-home-profile-contract.js`
- `CF_HOME_3_1_DATA_CONTRACT.json`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- Every property fact carries a source and evidence reference.
- Public/property-source facts remain unverified until confirmed.
- Unknown and conflict are durable first-class states.
- Quote readiness remains distinct from eligibility, approval, and pricing.
