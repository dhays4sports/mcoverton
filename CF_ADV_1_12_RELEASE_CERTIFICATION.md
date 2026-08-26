# CF-ADV-1.12 Release Certification

Release: CoverageFit v3.20.83  
Sprint: CF-ADV-1.12 — “Why This Fits You” Recommendation Cards  
Status: **CERTIFIED / ROOT DEPLOYABLE**

## Certified behavior

- Home Snapshot page 2 now explains the rationale behind each existing top eligible review topic.
- Each card visibly separates **Because you told us**, **What we found / need to verify**, and **Why Dylan wants to review it**.
- Personalized “Because you told us” language requires an existing CF-ADV-1.3 recommendation anchor with traceable evidence references.
- Evidence-light or generic topics fail closed instead of fabricating personalized rationale.
- Customer lifestyle/preferences remain separate from assessment findings.
- Clear assessment answers remain answer evidence only and do not verify issued-policy wording, limits, deductibles, endorsements, exclusions, or deficiencies.
- No card independently recommends a coverage change before licensed verification.
- Existing recommendation engine output remains the sole source of eligible card topics and ordering.
- Four reaction controls are present as page-local draft UI only; they do not write `recommendationResponses`, persist state, affect score, or bind coverage.
- Durable reaction state, timestamps, revision, optional customer words, and Workspace transport remain reserved for CF-ADV-1.13.

## Protected boundaries

Byte-identical to incoming v3.20.82:

- `assets/js/protection-score.js`
- `assets/js/home-recommendation-rules.js`
- `assets/js/recommendation-engine.js`
- `assets/js/workspace-data.js`
- `assets/js/report-engine.js`
- `assets/js/prospect-report-access.js`
- `server/prospect-report-core.mjs`

No Protection Score formula change, recommendation-topic creation, recommendation eligibility/ranking change, durable reaction capture, policy-binding behavior, or private-report security/TTL change.

## QA

- CF-ADV-1.12 focused suite: **98/98 passing**
- Entire CF-ADV advisory chain 1.1–1.12: **passing**
- Aggregate incoming: **121/185 passing, 64 failing**
- Aggregate release: **122/186 passing, 64 failing**
- New failing suites: **0**
- Historical failure set: **identical**

## Next sprint

`CF-ADV-1.13 — Recommendation Buy-In Capture`
