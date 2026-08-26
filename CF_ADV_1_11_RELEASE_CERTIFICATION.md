# CF-ADV-1.11 Release Certification

Release: CoverageFit v3.20.82  
Sprint: CF-ADV-1.11 — “Your CoverageFit” Results Model  
Status: **CERTIFIED / ROOT DEPLOYABLE**

## Certified behavior

- The first Home report page now explains the customer’s advisory context before showing Review Readiness.
- **Why you’re reviewing** uses explicit discovery evidence when available and falls back safely for legacy reports.
- **What matters most** preserves explicit price/balance/protection preferences without judging price-first customers.
- **Your home & household context** is limited to evidence-backed facts and suppresses unknown/privacy answers.
- **What would be hardest** preserves up to two explicitly ranked outcome concerns.
- Existing assessment strengths are shown as **Strong starting points**.
- Existing scored priority topics are previewed as **Worth discussing** before the detailed page-two topic cards.
- Review Readiness / Protection Score is visibly secondary and retains the exact numeric score, status, methodology, and category values.
- Completed Home reports persist `advisoryResults`; legacy reports can derive the model at view time.
- Detailed topic cards remain educational discussion topics; explicit “Why This Fits You” recommendation-card anatomy is reserved for CF-ADV-1.12.

## Protected boundaries

Byte-identical to incoming v3.20.81:

- `assets/js/protection-score.js`
- `assets/js/home-recommendation-rules.js`
- `assets/js/recommendation-engine.js`
- `assets/js/workspace-data.js`
- `assets/js/prospect-report-access.js`
- `server/prospect-report-core.mjs`

No Protection Score formula change, score-number change, recommendation eligibility/ranking change, or private-report security/TTL change.

## QA

- CF-ADV-1.11 focused suite: **94/94 passing**
- Entire CF-ADV advisory chain 1.1–1.11: **passing**
- Aggregate incoming: **120/184 passing, 64 failing**
- Aggregate release: **121/185 passing, 64 failing**
- New failing suites: **0**
- Historical failure set: **identical**

## Next sprint

`CF-ADV-1.12 — “Why This Fits You” Recommendation Cards`
