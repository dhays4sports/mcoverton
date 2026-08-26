# CF-FLOW-2.5 — Secure Customer Progress Center

## Purpose

Turn the living report into a secure, account-free progress and return surface.

## Implementation

Turns the living report into a secure no-account progress center showing completed value, what the customer shared with Dylan, optional remaining paths, latest report, simple next step, and exact continuation links.

## Files

- `server/pvx-progress-center-core.mjs`
- `functions/api/pvx/progress.js`
- `assets/js/pvx-progress-center.js`
- `assets/js/pvx-progress-view.js`
- `pvx/progress/index.html`
- `CF_FLOW_2_5_PROGRESS_CONTRACT.json`
- `tests/pvx-progress-center-core-qa.mjs`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- A bearer token opens the precise customer progress surface without an account.
- The latest and completed report checkpoints are visible.
- Remaining paths are clearly optional and directly resumable.
- Internal notes, underwriting notes, private object keys, and unnecessary contact details are never returned.
