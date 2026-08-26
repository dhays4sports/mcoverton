# CF-ADV-1.8 — Conversational Assessment Orchestration

Release: CoverageFit v3.20.79  
Status: COMPLETE

## Goal

Re-sequence the validated Home CoverageFit review into a human conversation without changing the Protection Score or rewriting the scored question set.

## Customer flow

1. **Why you’re reviewing** — CF-ADV-1.4 opening plus the current-relationship context from CF-ADV-1.5.
2. **Your home and household** — CF-ADV-1.6 lifestyle/dependency facts.
3. **What you depend on / what matters** — CF-ADV-1.7 outcome priorities and the tradeoff context already captured by CF-ADV-1.4.
4. **How your current protection works** — rebuilding, water, deductible, belongings, and related property-aware verification questions.
5. **Outcomes worth planning for** — recovery and liability questions.
6. **Things worth reviewing** — life changes and separately handled hazards before the Snapshot is built.

The customer does not receive extra interstitial clicks. The scored review uses a persistent chapter card that changes when the conversation changes topic.

## Runtime contract

`assets/js/advisory-assessment-orchestration.js` installs after the Home assessment config and before the assessment engine. It wraps `config.resolveQuestions()` and:

- annotates each active question with chapter metadata;
- performs a stable chapter sort;
- preserves original order within each chapter;
- keeps conditional property-aware questions in the same chapter as the topic they extend;
- exposes truthful coverage-question and within-chapter progress metadata;
- does not suppress, create, or conditionally branch questions.

## Scored chapter map

### Chapter 4 — How your current protection works

- `dwelling`
- `extendedReplacement`
- `ordinanceLaw`
- `water`
- `roofTermsReview` when already applicable
- `deductible`
- `personalProperty`
- `detachedStructuresReview` when already applicable

### Chapter 5 — Outcomes worth planning for

- `liability`
- `poolLiabilityReview` when already applicable
- `lossOfUse`
- `umbrella`

### Chapter 6 — Things worth reviewing

- `lifeEvents`
- `separatePerils`

## Progress truthfulness

The scored section now says **“Coverage question X of Y”** and **“About N minutes left in the coverage review”**. The chapter card separately states **“Chapter 4/5/6 of 6”** and the question’s position inside that chapter.

This avoids implying that the customer has just begun the entire assessment after already completing the advisory discovery sequence.

## Continuity

The existing question key remains the restoration authority. Drafts additionally record `advisoryChapterId` and `advisoryChapterNumber` as presentation metadata only. Reordering therefore does not invalidate saved scored answers.

## Scoring boundary

CF-ADV-1.8 does not change:

- question keys;
- question weights;
- answer points or score impact;
- impact/finding types;
- evidence-quality semantics;
- the Protection Score formula;
- recommendation eligibility or ranking;
- discovery signal logic;
- recommendation anchors.

The orchestration contract explicitly sets `progressiveBranching: false`. Conditional suppression and bounded follow-ups belong to CF-ADV-1.9.

## Accessibility and mobile

- Chapter state is exposed in the progress bar’s `aria-valuetext`.
- The chapter card uses normal semantic headings and description text.
- Chapter-enter animation is disabled under `prefers-reduced-motion`.
- Mobile chapter metadata stacks rather than compressing into small tap/text areas.

## Definition of done

The Home review reads as a continuous advisory conversation, identical scored answers produce the same Protection Score, and no progressive-branching behavior is introduced.
