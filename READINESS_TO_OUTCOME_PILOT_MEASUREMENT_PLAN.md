# Readiness-to-Outcome Pilot Measurement Plan

No conversion target is invented before the first meaningful approved cohort.

## Cohorts

Report entry type, prefill state and mobile/desktop separately. Suppress change-scope outcome groups below five. Never expose identity, exact words, answers, contact details, document facts, tokens or internal notes.

## Value and action sequence

- Entry → first answer → complete Snapshot.
- Snapshot → topic response, optional readiness and desired action.
- Relevant desired action → optional scope and precise contact plan.
- Contact plan → producer contact attempt → completed conversation.
- Conversation → quote started → quote delivered → bound, pending or lost.
- Home Profile and policy-review completion, bundle continuation, continue-later return and question abandonment.

Use bounded time buckets for time to Snapshot and contact-to-producer response. Evaluate fewer but more actionable requests as potentially successful; raw saves and contacts are not stand-alone success metrics.

## Guardrails

Review comprehension, producer quality, accessibility, privacy, semantic defects, STOP/suppression, ownership and continue-later visibility alongside conversion. Exploring, price-dependent, not-sure and every scope remain valid and cannot be optimized away.

## Governance

Every test stays in `CF_PVX_EXPERIMENT_REGISTRY.json` and requires a preregistered hypothesis, primary metric, guardrails, minimum sample, complete observation window, stopping rule and semantic/accessibility/privacy approval. Dylan reviews producer quality weekly; the agency owner approves activation and can pause immediately. No production experiment is active in v3.20.200.
