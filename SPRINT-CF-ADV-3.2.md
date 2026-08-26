# CF-ADV-3.2 — Privacy Consent Access Certification

## Purpose

Certify anonymous use, consent, private files, access, tokens, history, retention, and deletion.

## Implementation

Certifies privacy, consent, and access boundaries and adds explicit secure journey deletion plus expired record/private-policy-file purging.

## Files

- `server/pvx-privacy-retention.mjs`
- `functions/api/pvx/delete.js`
- `tests/pvx-privacy-retention-qa.mjs`
- `tests/pvx-privacy-access-certification.mjs`
- `CF_ADV_3_2_PRIVACY_CERTIFICATION.md`
- `CF_ADV_3_2_PRIVACY_CERTIFICATION.json`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- All eleven privacy/access controls pass certification.
- Report, contact, SMS, and authorization states remain independent.
- Customer surfaces exclude internal notes and private object keys.
- Customers can explicitly delete a token-bound journey and expired records/files can be purged.
