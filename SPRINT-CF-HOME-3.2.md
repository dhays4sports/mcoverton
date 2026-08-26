# CF-HOME-3.2 — Property Intelligence Prefill Confirmation

## Purpose

Confirm property-source facts one at a time without silently treating them as verified.

## Implementation

Adds one-fact-at-a-time property intelligence confirmation with Yes, Change, and Not sure states; no external record is silently promoted to verified.

## Files

- `pvx/home-profile/index.html`
- `assets/js/pvx-property-prefill.js`
- `assets/js/pvx-home-profile-view.js`
- `assets/css/pvx-home-profile.css`
- `CF_HOME_3_2_PREFILL_CONTRACT.json`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- Property-source facts are presented individually in plain language.
- Yes explicitly creates customer-confirmed provenance.
- Change captures customer-reported provenance and Not sure remains valid.
- No public/property-source value is silently verified.
