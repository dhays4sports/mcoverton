# CF-ADV-3.1 — Semantic Truthfulness Audit

## Purpose

Audit all semantic boundaries and prohibit implied early policy deficiencies.

## Implementation

Executes and documents the semantic truthfulness audit across all six required boundaries, with a hard runtime assertion that the early Snapshot cannot imply a policy deficiency.

## Files

- `tests/pvx-semantic-truthfulness-audit.mjs`
- `CF_ADV_3_1_SEMANTIC_AUDIT.md`
- `CF_ADV_3_1_SEMANTIC_AUDIT.json`

## Protected boundaries

- Existing Protection Score methodology and math remain unchanged.
- Personal discovery does not create policy findings or recommendations.
- Customer-reported facts remain distinct from verified facts.
- Quote readiness remains distinct from carrier eligibility.
- Consent, decision, and authorization states remain separate.

## Acceptance

- All six semantic boundaries pass runtime assertions.
- Missing and conflicting evidence fail closed.
- Early discovery creates no score, finding, recommendation, or deficiency claim.
- Only authorized evidence-backed conversion creates an actual recommendation.
