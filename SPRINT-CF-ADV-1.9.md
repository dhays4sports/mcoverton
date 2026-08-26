# CF-ADV-1.9 — Progressive Discovery Branching

Release: CoverageFit v3.20.80

## Goal
Ask fewer, better advisory follow-ups based on explicit facts already captured by CoverageFit or inherited through a trusted handoff.

## Implemented branches

### Preserve what works
The `What do you definitely want to keep?` follow-up is no longer shown to every customer. It appears only when the customer has explicitly reported both:
- 10+ years with the current carrier; and
- customer service / responsiveness as something they value.

A previously answered saved/legacy review keeps the answer visible rather than discarding it.

### Meaningful improvements
The home-improvements follow-up is no longer universal. It appears only when the customer has explicitly reported:
- the property is their primary residence; and
- they expect to stay 5+ years / long term.

A previously answered saved/legacy review keeps the answer visible.

## Existing zero-repeat behavior retained
Trusted review reason, current carrier, and current-carrier tenure continue to suppress redundant entry where prior CF-ADV sprints already established zero-repeat handling.

## Safety boundaries
- Branches are advisory and non-scoring.
- Branches do not create coverage eligibility, recommendations, or buy-in.
- Branches do not change the Home scored question catalog.
- Branches do not modify the CF-ADV-1.2 signal rules.
- Hidden follow-ups do not leave stale new-session evidence behind.
- Branch eligibility is deterministic and persisted in the discovery draft.

## Next
`CF-ADV-1.10 — Customer Language & Reaction Layer`
