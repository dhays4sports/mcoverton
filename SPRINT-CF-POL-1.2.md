# CF-POL-1.2 — Secure Policy Document Intake

## Purpose

Add private validated multi-file policy intake with a manual fallback.

## Implementation

Adds private, validated multi-file policy document intake with token-bound storage, server-side file type/size enforcement, producer-review state, and fully functional manual and producer-assisted fallbacks.

## Files

- `server/pvx-policy-intake-core.mjs`
- `functions/api/pvx/policy-upload.js`
- `assets/js/pvx-policy-intake.js`
- `assets/js/pvx-policy-intake-view.js`
- `pvx/policy/index.html`
- `CF_POL_1_2_INTAKE_CONTRACT.json`
- `tests/pvx-policy-intake-core-qa.mjs`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- PDF and policy photos support multiple private files with validation.
- Files are bound to the secure journey and never exposed by public object key.
- Producer review state is explicit.
- Manual entry and review-with-Dylan paths work without extraction.
