# CoverageFit First-Value + Insight-to-Action Pilot Measurement Plan

This plan measures live behavior after an approved deployment. It does not invent conversion targets or backfill activity.

## Cohorts

Report direct CoverageFit, homepage, Home, Buyer, Home + Auto, professional, flyer/QR, neighbor referral, SMS and AI-caller entries separately. Within each entry, separate prefilled from non-prefilled journeys and mobile from desktop. Do not expose personal answers or small identifiable cohorts.

## First-value timing

- Start: `hook_viewed` for contextual entry or `first_answered` for direct entry.
- Payoff: `snapshot_viewed` after the complete customer-safe Snapshot renders.
- Report median, P75 and P90 time by cohort and prefill state.
- Report question count and abandonment location alongside time so speed is not optimized by removing necessary comprehension.
- Treat the under-three-minute goal as a pilot target, not as a pre-certified measurement.

## Insight-to-action behavior

Measure privacy-safe aggregate transitions:

- Snapshot viewed → topic response
- Snapshot viewed → explicit save
- Snapshot viewed → share
- Snapshot viewed → contact request
- Snapshot viewed → Home Profile started/ready
- Snapshot viewed → Current Policy Review started/ready
- first deeper checkpoint → second optional path
- life-event update → customer-safe delta viewed
- return link → resumed at exact stage

Attribution uses bounded event names, entry type, campaign identifier, stage and timing buckets. It excludes PII, exact words, discovery answers, document facts, credentials and internal notes.

## Experiment governance

Any experiment must be preregistered in `CF_PVX_EXPERIMENT_REGISTRY.json`, specify one hypothesis and primary outcome, retain the Snapshot-first/consent/evidence guardrails, and define stop conditions before exposure. Prohibited tests include fake activity, scarcity, urgency, fear language, hiding direct human contact, pre-Snapshot contact gates and treating campaign context as a discovery answer.

## Review cadence

Review instrument health after the first non-customer production smoke journey, then analyze the first meaningful pilot cohort. Set conversion targets only after inspecting that cohort. Use producer follow-through, customer comprehension and semantic defects as guardrails alongside conversion.
