# CF-HOME-3.6 — Insurance History Claims Mitigation

## Purpose

Collect insurance history, claims, and mitigation facts for producer review.

## Implementation

Collects insurance continuity, renewal, loss/open-claim, and mitigation facts while reusing the discovery claim answer and routing sensitive situations to producer review only.

## Files

- `assets/js/pvx-home-history-mitigation.js`
- `CF_HOME_3_6_HISTORY_MITIGATION_CONTRACT.json`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- Insurance and mitigation facts retain customer-reported or unknown provenance.
- The prior claim discovery answer is reused rather than repeated.
- Nonrenewal and open-claim states create a producer review item.
- CoverageFit never automatically declares eligibility or ineligibility.
