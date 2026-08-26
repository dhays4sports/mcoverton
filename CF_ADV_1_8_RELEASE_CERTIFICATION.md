# CF-ADV-1.8 Release Certification

Release: CoverageFit v3.20.79  
Sprint: CF-ADV-1.8 — Conversational Assessment Orchestration  
Status: **CERTIFIED / ROOT DEPLOYABLE**

## Certified behavior

- The Home advisory experience is represented as six conversational chapters.
- Existing CF-ADV-1.4 through 1.7 discovery remains Chapters 1–3 without becoming scored input.
- Existing validated Home scored questions are stably grouped into Chapters 4–6.
- Conditional property-aware questions remain governed by their existing conditions and stay adjacent to their parent topic inside the correct chapter.
- The assessment renders persistent chapter title, explanation, overall chapter position, and within-chapter question position.
- Progress text now explicitly says `Coverage question X of Y`, avoiding the false impression that scored Question 1 is the beginning of the full customer journey.
- Draft continuity retains the existing question key as restoration authority and adds chapter metadata only as presentation context.
- Final scored-review CTA now transitions conversationally to `Review What We Found`.
- Reduced-motion and mobile chapter presentation are supported.

## Explicitly not included

CF-ADV-1.8 does **not** implement CF-ADV-1.9 behavior. It does not:

- suppress known questions;
- ask conditional advisory follow-ups;
- infer new customer signals;
- create or rerank recommendations;
- change Protection Score inputs or math.

## Protected boundaries

The following incoming files are byte-identical:

- `assets/js/protection-score.js`
- `assets/js/home-recommendation-rules.js`
- `assets/js/recommendation-engine.js`
- `assets/js/workspace-data.js`

Question keys, answer catalogs, weights, score impacts, finding types, evidence-quality semantics, property conditions, and review-reason priority metadata are preserved.

## QA

- CF-ADV-1.8 focused suite: **87/87 passing**
- Aggregate incoming: **117/181 passing, 64 failing**
- Aggregate release: **118/182 passing, 64 failing**
- New failing suites: **0**
- Historical failure set: **identical**

## Next sprint

`CF-ADV-1.9 — Progressive Discovery Branching`
