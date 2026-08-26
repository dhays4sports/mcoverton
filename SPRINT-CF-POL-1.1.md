# CF-POL-1.1 — Current Policy Profile Contract

## Purpose

Create evidence-aware current-policy data and completion-path contracts.

## Implementation

Creates the optional current-policy profile with upload, manual, producer-assisted, and skip paths plus distinct reported, document-identified, customer-confirmed, producer-verified, and unknown evidence states.

## Files

- `assets/js/pvx-policy-profile-contract.js`
- `CF_POL_1_1_PROFILE_CONTRACT.json`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- Policy review remains optional and supports four completion paths.
- Each current-policy fact has explicit evidence provenance.
- Document identification is not customer confirmation.
- Customer confirmation is not producer verification, and the path works without automated extraction.
