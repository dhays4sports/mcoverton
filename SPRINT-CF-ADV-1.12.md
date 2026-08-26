# CF-ADV-1.12 — “Why This Fits You” Recommendation Cards

Release: CoverageFit 3.20.83  
Status: COMPLETE

## Goal

Make the rationale behind each already-eligible Home review topic visible without collapsing customer context, assessment evidence, and producer judgment into one claim.

## Customer-facing card anatomy

Each of the top three existing eligible Home recommendation topics now renders as a **Why This Fits Your Review** card with:

1. Topic
2. Fit/status label
3. **Because you told us** — only when evidence-backed personal advisory context exists
4. **What we found / need to verify** — the existing answer-based recommendation/finding record plus an explicit policy-verification boundary
5. **Why Dylan wants to review it** — an advisory explanation that stays pending licensed policy verification
6. Customer reaction controls prepared for the durable CF-ADV-1.13 capture layer

## Provenance rules

- Personalized “Because you told us” copy requires a CF-ADV-1.3 anchor with evidence references.
- Generic/evidence-light cards do not fabricate personalization; they visibly state that separate personal context has not yet been established for the topic.
- Customer preference and lifestyle facts remain separate from the scored assessment finding.
- A clear assessment answer is still **not** treated as verification of an issued policy, endorsement, exclusion, limit, or deductible.
- No card can state that the current issued policy is deficient.

## Reaction-control boundary

The four CF-ADV-1.13 reaction states are visible as card-level controls so the final interaction anatomy is established:

- Makes sense
- Explain this
- Prioritize cost
- Not sure yet

In 1.12, these controls are intentionally **page-local draft UI only**. They do not write `recommendationResponses`, do not persist to the report or `discoveryProfile`, do not affect score/recommendations, and do not bind coverage. Durable reaction capture, timestamping, revision, optional customer words, and Workspace transport belong to CF-ADV-1.13.

## Implementation

- Added `assets/js/advisory-recommendation-cards.js`.
- Added `assets/css/advisory-recommendation-cards.css`.
- Added `CF_ADV_1_12_RECOMMENDATION_CARD_CONTRACT.json`.
- Upgraded Home Snapshot page 2 from generic topic cards to evidence-separated advisory cards.
- Kept the existing recommendation engine as the sole source of eligible recommendation topics and ordering.
- Reused stored CF-ADV-1.3 recommendation anchors rather than deriving a second personalization system.

## Protected boundaries

- Protection Score formula and category math unchanged.
- Home recommendation rules unchanged.
- Recommendation engine unchanged.
- Recommendation eligibility and ranking unchanged.
- Existing CF-ADV-1.3 anchor generation unchanged.
- `recommendationResponses` remains untouched.
- Private report access/security unchanged.
- Frozen legacy Workspace adapter unchanged.

## Next

`CF-ADV-1.13 — Recommendation Buy-In Capture`
