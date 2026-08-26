# CF-ADV-1.10 — Customer Language & Reaction Layer

Release: CoverageFit v3.20.81  
Status: **COMPLETE**

## Goal

Show the customer that CoverageFit heard the context they explicitly shared before detailed recommendations appear. The reaction layer is acknowledgment only: it does not diagnose a coverage problem, change Protection Score, create recommendation eligibility, or represent customer consent.

## Shipped behavior

- Adds a compact **What we heard** panel immediately before the scored coverage questions.
- No additional questionnaire and no additional required click.
- Uses at most two deterministic acknowledgements.
- Personalized acknowledgement is allowed only from explicit evidence or an active CF-ADV-1.2 signal with confidence >= 0.90 and evidence references.
- Highest-priority explicit outcome concern is eligible for acknowledgment first.
- `homeCommitment.high`, `incumbentRelationship.strong`, and explicit tradeoff-preference signals provide additional neutral acknowledgements when supported.
- Explicit custom `Something else` outcome wording may be reflected back in sanitized/truncated customer language.
- `unsure` and `prefer_not_to_answer` do not generate personalized claims.
- If no reliable evidence exists, CoverageFit uses a neutral fallback instead of inventing personalization.
- Reaction copy contains no fear escalation and does not imply a coverage deficiency.
- Retaking the review hides stale acknowledgement state; messages are regenerated from current evidence.

## Protected boundaries

CF-ADV-1.10 does not change:

- Protection Score formula, weights, or penalties
- Home scored-question catalog
- Home recommendation eligibility or ranking
- CF-ADV-1.2 signal rules
- Recommendation-anchor eligibility
- Recommendation response / buy-in state
- Legacy Workspace data contract

## Flow after this sprint

`Why reviewing → current relationship → lifestyle/dependency → outcome concerns → What we heard → conversational scored review`

## Next

`CF-ADV-1.11 — “Your CoverageFit” Results Model`
