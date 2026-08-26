# CoverageFit Advisory 1 — Personalized Advisory Conversation Roadmap

Program: `CF-ADV-1 — Personalized Advisory Conversation`

Status: Active

Current completed sprint: `CF-ADV-1.12 — “Why This Fits You” Recommendation Cards`

Migration note: the approved Progressive Value Exchange program is authoritative for customer-journey sequencing. See `CF-PVX-ROADMAP.md`. CF-ADV-1.13 is paused until `CF-POL-1.4` establishes evidence-backed recommendation conversion; CF-ADV-1.14 through 1.23 resume after multi-path convergence.

## North star

CoverageFit should help a licensed producer move through this advisory sequence:

**What you told me → what that means → what I recommend → why it fits you → what you think → what you decide**

CoverageFit is not becoming a quote engine, underwriting engine, binding engine, or automated coverage decision maker. It remains a structured advisory and documentation system that helps a producer understand the customer, verify facts, explain tradeoffs, make professional recommendations, capture customer reactions, and document decisions.

## Program invariants

1. **Discovery is not scoring.** Customer priorities, lifestyle facts, price sensitivity, relationship preferences, or recommendation reactions do not lower or raise the Protection Score unless an independently valid scored assessment question already does so under the existing methodology.
2. **Every personalized claim is traceable.** Any `Because you told me…`, customer signal, or personalized recommendation rationale must cite stored source evidence.
3. **Protection Score remains a review-readiness/clarity diagnostic.** CF-ADV does not repurpose it as a willingness-to-buy, wealth, risk-tolerance, or sales-likelihood score.
4. **Recommendation is not customer decision.** Producer recommendation, customer buy-in/reaction, and final coverage decision remain distinct data concepts.
5. **Buy-in is not consent or binding authorization.** `Makes sense`, `accepted_logic`, or similar states only indicate that the rationale resonated; they do not authorize policy changes or bind coverage.
6. **Zero-repeat survives.** Information already supplied through 408FARMERS, SMS, property confirmation, prior assessment context, or a consultation should not be asked again unless confirmation is professionally necessary.
7. **Producer judgment stays explicit.** CoverageFit can organize and explain evidence; the licensed producer verifies policy facts, applies professional judgment, confirms carrier requirements, and makes the recommendation.
8. **No fear-default persuasion.** Recommendation rationale should begin with customer context, fit, continuity, tradeoffs, and what the customer said matters—not catastrophe scripting.
9. **No unsupported inference.** Derived signals must be deterministic and evidence-backed. If the evidence is incomplete, the system should label the signal uncertain or ask a targeted follow-up rather than inventing meaning.
10. **Preserve existing production contracts unless a sprint explicitly migrates them.** Assessment, evidence, report, consultation, Workspace, D1, Cloudflare Functions, 408FARMERS handoff, attribution, SMS, recommendation, print, and access controls remain compatible throughout migration.

---

# RELEASE A — ADVISORY FOUNDATION

Goal: make CoverageFit understand why the customer is here, what matters, how they live, what they depend on, what they have built, and which outcomes concern them—without changing scoring or recommendation semantics.

## CF-ADV-1.1 — Advisory Discovery Data Contract — COMPLETE

### Goal
Create a durable advisory data layer parallel to assessment scoring and consultation state.

### Contract
`discoveryProfile` includes:

- `reasonForReview`
- `currentRelationship`
- `primaryPriority`
- `secondaryPriorities`
- `lifestyleDependencies`
- `householdContext`
- `protectionProfile`
- `outcomeConcerns`
- `currentCoveragePreferences`
- `customerStatements`
- `customerSignals`
- `recommendationAnchors`
- `recommendationResponses`

### Delivered
- Versioned runtime contract and JSON release contract.
- Evidence/source references for customer-linked statements and future derived signals.
- Deterministic normalize/create/merge/validate helpers.
- Trusted seeding from existing review reason/current-carrier context only.
- Saved report integration.
- Consultation durability through the existing full-report record copy.
- Workspace adapter exposure.
- Explicit guardrails preserving Protection Score and decision semantics.

### Acceptance boundary
No new discovery UI, signal derivation, recommendation personalization, reaction capture, or Workspace advisory UI yet.

---

## CF-ADV-1.2 — Discovery Signal Engine — COMPLETE

### Goal
Turn explicit customer facts into deterministic advisory signals without making recommendations.

### Examples
- `onlyVehicle=yes + dailyUse=yes` → `vehicleDependency=high`
- `homeOwnership=primaryResidence + stayIntent=longTerm` → `homeCommitment=high`
- `currentCarrierTenure=12 years + likesService=yes` → `incumbentRelationship=strong`
- `primaryPriority=balance` → `tradeoffPreference=balanced`

### Requirements
- Rule-based first; no required LLM inference.
- Every signal includes `id`, `key`, `label`, `status`, `confidence`, and `evidenceRefs`.
- Signals distinguish direct fact from derived interpretation.
- Conflicting evidence yields `candidate`/needs-confirmation rather than silent overwriting.
- No signal changes Protection Score, evidence quality, or recommendation ranking.
- No recommendation language is generated in this sprint.

### Definition of done
- Home discovery inputs can produce normalized signals.
- Every active signal is evidence-backed.
- Unsupported signals fail closed.
- Signal derivation is covered by deterministic QA fixtures.

### Delivered
- Added `assets/js/advisory-signal-engine.js` with four bounded rule families from this roadmap.
- Kept direct discovery facts in raw `discoveryProfile` fields and derived interpretations in `customerSignals` only.
- Required real `evidenceRefs` for active/candidate signal generation; unsupported and incomplete inputs fail closed.
- Added conflict-safe `.needsConfirmation` candidate signals instead of silent winner selection.
- Added idempotent engine ownership so repeated derivation replaces only CF-ADV-1.2-owned signals and preserves external advisory data.
- Integrated the engine into the Home assessment report path without changing score/evidence/recommendation semantics.
- Added deterministic QA fixtures and release certification. Next: `CF-ADV-1.3 — Recommendation Anchor Contract`.

---

## CF-ADV-1.3 — Recommendation Anchor Contract — COMPLETE

### Goal
Create the bridge from an eligible recommendation + customer signal to a personalized rationale.

### Each anchor can contain
- `recommendationKey`
- `becauseYouToldUs`
- `personalMeaning`
- `whyThisFits`
- `discussionPrompt`
- `buyInPrompt`
- `priceTradeoff`
- `evidenceRefs`

### Example
**Customer fact:** drives 28,000 miles annually.

**Signal:** high road use.

**Recommendation topic:** stronger liability review.

**Anchor:** “Because you told me you drive about 28,000 miles a year, I’d be more comfortable reviewing stronger liability limits rather than building around the minimum.”

### Requirements
- Recommendation anchors can only be built for recommendation topics already generated/eligible under established recommendation logic.
- Personal rationale may influence explanation/order inside the advisory UI only where explicitly approved later; it does not silently create a coverage finding.
- Evidence refs are mandatory for `becauseYouToldUs` output.
- Provide customer-facing and producer-facing copy variants without fear escalation.

### Definition of done
- Anchor generation is deterministic and traceable.
- Existing recommendation semantics remain unchanged.
- Missing evidence produces a generic non-personalized explanation, never fabricated personalization.

### Delivered
- Added the versioned `CoverageFitAdvisoryRecommendationAnchorContract` runtime and JSON contract.
- Anchors consume only explicitly supplied established recommendation topics; signals alone cannot create coverage findings.
- Personalized `becauseYouToldUs` language requires an active evidence-backed signal; candidate/conflicted signals are ignored for personalization.
- Added topic-specific Home commitment and vehicle-dependency mappings plus explicit balanced/price/protection tradeoff framing.
- Added customer-facing and producer-facing copy variants, bounded buy-in prompts, and fear-default copy guardrails.
- Missing/irrelevant evidence falls back to the existing recommendation explanation/question with no fabricated customer-linked rationale.
- Home assessment persistence now applies anchors after existing priority rows are calculated, without changing Protection Score, evidence quality, recommendation generation, or ranking.
- CF-ADV-1.1 anchor normalization now retains optional advisory metadata while generic anchors remain valid without evidence warnings.
- Added deterministic QA, release certification, and regression comparison. Next: `CF-ADV-1.4 — “Why Are We Here?” Opening`.

---

## CF-ADV-1.4 — “Why Are We Here?” Opening — COMPLETE

### Goal
Start the CoverageFit experience with customer motivation instead of insurance terminology.

### Core questions
**What’s bringing you here today?**
- My insurance is getting expensive
- I’m comparing options
- I’m buying a home
- My renewal is coming up
- I’m unhappy with my current company
- I want to make sure I’m properly covered
- I recently had a life change
- Something else

**What matters most in this review?**
- Keep my cost down
- Find the right balance
- Protect myself as strongly as practical
- I’m not sure yet

### Requirements
- Receive values from 408FARMERS when already known.
- Skip/reframe rather than re-ask trusted handoff facts.
- Preserve raw customer wording where possible.
- These answers populate discovery only, not score.

### Definition of done
A customer reaches the substantive review with a stored reason and primary priority or an explicit unknown state.

### Delivered
- Added a dedicated two-question advisory opening between property confirmation and the substantive coverage review.
- Captures `reasonForReview` and `primaryPriority` directly into the existing `discoveryProfile` contract with source/evidence references and preserved customer wording.
- Carries forward trusted 408FARMERS review reason/goal and any recognized future priority without re-asking; connected values are visible and editable.
- Supports all roadmap reason choices plus `price`, `balance`, `protection`, and explicit `unsure` priority states.
- The selected review reason feeds the already-certified review-reason contextual ordering layer; it does not change question weights, answer impacts, or Protection Score math.
- The selected primary priority feeds CF-ADV-1.2 tradeoff signal derivation and CF-ADV-1.3 recommendation anchors without creating coverage findings.
- Advisory opening state survives assessment continuity/resume and is reset deliberately on retake.
- Added mobile/accessibility presentation, analytics events, deterministic QA, release certification, and regression comparison. Next: `CF-ADV-1.5 — Current Relationship Discovery`.

---

## CF-ADV-1.5 — Current Relationship Discovery — COMPLETE

### Goal
Understand what the customer values about the incumbent relationship and what creates switching resistance.

### Core questions
- How long have you been with your current company?
- What have you liked about them?
- If you could change one thing about your current insurance, what would it be?
- Are there any parts of your current coverage or service you definitely want to keep?

### Data outcomes
- carrier
- tenure
- likes
- would-change
- must-keep
- relationship notes

### Requirements
- Never position incumbent loyalty as a defect.
- Preserve unknown/prefer-not-to-answer states.
- Use responses later as “don’t break” context.

### Definition of done
Workspace/report can distinguish a price problem from a service/relationship problem without guessing.

### Delivered
- Added a dedicated current-relationship discovery step after CF-ADV-1.4 and before the substantive scored Home review.
- Captures current carrier, relationship tenure, what the customer likes, the one thing they would change, and what they definitely want preserved.
- Trusted connected carrier/tenure values are carried forward visibly and remain editable rather than being silently re-asked.
- Explicit `unsure`, `prefer_not_to_answer`, and `nothing/none` states are stored as customer answers rather than treated as missing values.
- Direct answers populate the existing `discoveryProfile.currentRelationship` contract with evidence/source references; no parallel customer store is created.
- Stored service preference + qualifying tenure can activate the already-certified CF-ADV-1.2 `incumbentRelationship.strong` signal; the relationship step itself never manufactures a signal.
- Save/resume and retake behavior now include the relationship step, and report creation merges relationship discovery before signal derivation and recommendation anchoring.
- Added dedicated mobile/accessibility presentation, deterministic QA, release certification, and regression comparison.
- Protection Score math, scored-question weights/impacts, recommendation generation/ranking, and the frozen Workspace adapter remain protected.

Next: `CF-ADV-1.6 — Lifestyle & Dependency Discovery`.

---

## CF-ADV-1.6 — Lifestyle & Dependency Discovery — COMPLETE

### Goal
Discover how the insured property/vehicle actually supports the customer’s daily life.

### Home examples
- How long have you lived here?
- Do you expect to stay here for a while?
- Have you made significant improvements?
- Who depends on the home day-to-day?
- Would being displaced create a major disruption?

### Auto examples for later multi-line expansion
- How much do you drive?
- What is most of that driving for?
- Is this your only vehicle?
- If it were unavailable for two weeks, what would you do?

### Requirements
- Ask only product-relevant questions.
- Avoid collecting sensitive personal detail that is not needed for advisory purpose.
- Convert answers into raw facts; signal interpretation remains in the signal engine.

### Delivered
- Added a dedicated Home lifestyle/dependency step after Current Relationship and before scored questions.
- Captures primary-home status, residence tenure, stay horizon, meaningful improvements, broad household reliance, and temporary-displacement disruption.
- Stores only direct evidence in `householdContext`, `lifestyleDependencies`, and bounded customer statements.
- Explicit unknown and prefer-not-to-answer states remain first-class answers.
- Household context deliberately avoids names, ages, medical information, income, and other unnecessary sensitive detail.
- Existing `homeCommitment.high` can now activate from direct primary-residence + 5+ year stay evidence through the CF-ADV-1.2 signal engine.
- Save/resume and retake flows include the new advisory stage.
- Protection Score and recommendation-generation boundaries remain protected.

### Definition of done
The Home profile captures enough context to support at least three evidence-backed personal recommendation anchors without policy-jargon discovery.

Next: `CF-ADV-1.7 — Outcome Concern Discovery`.

---

## CF-ADV-1.7 — Outcome Concern Discovery

### Goal
Let customers express which real-world outcomes matter before CoverageFit presents a solution.

### Home example
**If something went wrong with your home, what would be hardest for your household? Choose up to two.**
- A major unexpected out-of-pocket expense
- Having to live somewhere else temporarily
- Rebuilding the home properly
- Replacing belongings
- A serious water loss
- Liability affecting our finances
- Keeping the premium as low as possible

### Requirements
- Concern choices remain preferences, not scored findings.
- Do not frame choices with exaggerated catastrophe language.
- Allow “not sure” and “something else.”
- Preserve selected order if useful as preference priority.

### Definition of done
CoverageFit can later explain a recommendation using an outcome the customer explicitly selected.

### CF-ADV-1.7 implementation status — COMPLETE in v3.20.78
- Home customers choose up to two outcome concerns before scored questions begin.
- Selection order is preserved as stated priority order.
- `unsure` and `prefer_not_to_answer` remain explicit non-inferred states.
- `other` requires customer-authored wording before the step can complete.
- Concerns persist only as `discoveryProfile.outcomeConcerns` / customer statements and do not alter Protection Score, signal derivation, recommendation eligibility, ranking, or buy-in state.

Next: `CF-ADV-1.8 — Conversational Assessment Orchestration`.

---

## CF-ADV-1.8 — Conversational Assessment Orchestration

### Goal
Re-sequence the existing validated Home review into human chapters while preserving question validity and scoring.

### Proposed chapters
1. Why you’re reviewing
2. Your home and household
3. What you depend on / what matters
4. How your current protection works
5. Outcomes worth planning for
6. Things worth reviewing

### Requirements
- Existing scored questions retain their keys, answer impact, weight, evidence semantics, and score formula.
- Discovery questions are explicitly non-scoring.
- Existing property/review-reason personalization continues to work.
- Progress estimation remains truthful after the new sequence.

### Definition of done
The experience feels conversational while score output for identical scored answers remains unchanged.

### CF-ADV-1.8 implementation status — COMPLETE in v3.20.79
- The advisory discovery sequence is represented as Chapters 1–3 and the validated scored Home review is reorganized into Chapters 4–6.
- Active scored questions are stably grouped as current protection → recovery/liability outcomes → life changes/separate hazards.
- Conditional property-aware questions remain governed by their existing conditions and stay with their parent conversational topic.
- The scored section now reports “Coverage question X of Y” plus chapter position, so progress language remains truthful after the discovery sequence.
- Question keys, weights, answer impacts, evidence semantics, Protection Score math, recommendation eligibility/ranking, and advisory signal logic remain unchanged.
- No progressive branching or question suppression is introduced in 1.8.

Next: `CF-ADV-1.9 — Progressive Discovery Branching`.

---

## CF-ADV-1.9 — Progressive Discovery Branching

### Goal
Ask fewer, better follow-ups based on what is already known.

### Examples
- Only vehicle → ask alternate-transport question.
- Long-term homeowner → optionally ask meaningful improvement/commitment follow-up.
- Strong incumbent relationship → ask what must be preserved.
- Customer already supplied review reason in 408FARMERS → do not repeat it.

### Requirements
- One useful follow-up at a time.
- Branching must not alter score unless it activates an already-valid existing scored question under established rules.
- Branch state is durable across save/resume.

### Definition of done
Known facts suppress redundant questions and high-value answers can trigger bounded advisory follow-ups.

### CF-ADV-1.9 implementation status — COMPLETE in v3.20.80
- Existing trusted review-reason/current-carrier/current-tenure zero-repeat behavior remains authoritative.
- `currentRelationship.mustKeep` is now a bounded follow-up triggered by explicit 10+ year tenure plus explicit service value; it is suppressed otherwise.
- `homeImprovements` is now a bounded follow-up triggered by explicit primary-residence plus 5+ year stay intent; it is suppressed otherwise.
- Previously answered saved/legacy branch answers remain visible to prevent context loss.
- Branch eligibility/state is persisted in the discovery draft and re-derived deterministically on resume.
- Hidden branch answers do not create new-session evidence, signals, recommendations, or score impact.
- Protection Score, scored-question catalog, recommendation eligibility/ranking, and CF-ADV-1.2 signal rules remain unchanged.

## CF-ADV-1.10 — Customer Language & Reaction Layer

### Goal
Show customers that CoverageFit heard them before recommendations appear.

### Examples
- “It sounds like this is a home you’re planning around long-term. We’ll keep that in mind during the review.”
- “Keeping unexpected out-of-pocket costs manageable is one of your priorities. We’ll use that context when we compare tradeoffs.”

### Requirements
- Statements must be generated only from explicit discovery facts/signals.
- No recommendation or coverage deficiency implied.
- No fear language.
- Provide neutral fallback when signal confidence is insufficient.

### Definition of done
At least one evidence-backed acknowledgement can appear naturally during the assessment without altering policy recommendations.

### CF-ADV-1.10 implementation status — COMPLETE in v3.20.81

- Added transient `CoverageFitAdvisoryCustomerReaction` runtime.
- Added a no-extra-click **What we heard** panel before the scored coverage questions.
- Personalized copy requires explicit evidence or an active signal with confidence >= 0.90.
- Up to two acknowledgements are selected deterministically; explicit outcome priority is considered first.
- `unsure` / privacy answers cannot be converted into personalized claims.
- A neutral fallback appears when evidence is insufficient.
- Acknowledgements are not persisted as customer decisions and do not alter Protection Score, recommendation eligibility/ranking, or signal rules.

Next: `CF-ADV-1.11 — “Your CoverageFit” Results Model`.

---

# RELEASE B — PERSONALIZED RECOMMENDATIONS + SALES COPILOT

Goal: make CoverageFit explain why recommendations fit this particular customer and help the producer obtain genuine customer reaction.

## CF-ADV-1.11 — “Your CoverageFit” Results Model

### Goal
Make the customer’s situation the hero and move Protection Score into a supporting diagnostic role.

### Proposed results hierarchy
- Why you’re reviewing
- What matters most
- Your home/household context
- What would be hardest
- Strong starting points
- Worth discussing
- Review readiness / Protection Score

### Requirements
- Score number and methodology remain unchanged.
- Results cannot imply the customer is “bad” for choosing price.
- Existing report access/security remains unchanged.

### Definition of done
The first screen can explain the customer’s advisory context before showing detailed coverage topics.

### CF-ADV-1.11 implementation status — COMPLETE in v3.20.82

- Added `CoverageFitAdvisoryResultsModel` as a deterministic report model that can be persisted at completion and re-derived for legacy reports.
- Results hierarchy now leads with **Why you’re reviewing**, **What matters most**, **Your home & household context**, and **What would be hardest**.
- Existing assessment strengths are presented as **Strong starting points** before a compact **Worth discussing** agenda.
- Review Readiness / Protection Score now appears after the advisory context as a supporting diagnostic; the numeric score, methodology, category values, and score formula are unchanged.
- `unsure`, privacy, and missing-evidence discovery records do not become personalized report claims.
- Price-first customer preferences are shown neutrally and never reduce the score or create a negative fit label.
- Private report creation/read security and TTL behavior are unchanged.
- Detailed topic cards remain educational discussion topics until CF-ADV-1.12 adds explicit evidence-backed “Why This Fits You” anatomy.

Next: `CF-ADV-1.12 — “Why This Fits You” Recommendation Cards`.

---

## CF-ADV-1.12 — “Why This Fits You” Recommendation Cards

### Goal
Add explicit customer-linked rationale to each eligible recommendation.

### Card anatomy
- Topic
- Fit/status label
- Because you told us
- What we found/need to verify
- Why Dylan wants to review it
- Customer reaction controls

### Requirements
- Separate discovered preference from policy finding.
- Separate customer fact from producer recommendation.
- Recommendations remain educational until producer verification where required.
- No recommendation card can claim issued policy deficiency without verified policy evidence.

### Definition of done
Recommendation cards visibly show the provenance of the personal rationale.

### CF-ADV-1.12 implementation status — COMPLETE in v3.20.83

- Added `CoverageFitAdvisoryRecommendationCards` as a deterministic presentation model for the existing top-three eligible Home recommendation topics.
- Each card separates **Because you told us**, **What we found / need to verify**, and **Why Dylan wants to review it** instead of collapsing customer context and policy evidence.
- Personalized rationale is shown only when an existing CF-ADV-1.3 anchor has traceable evidence; evidence-light topics fail closed to neutral context.
- Clear assessment responses remain answer evidence only and never become claims that the issued policy is deficient, verified, or should be changed.
- Existing recommendation eligibility and ranking remain owned by the shared recommendation engine.
- Four customer reaction controls are present as page-local draft UI only; they do not write `recommendationResponses` or durable state until CF-ADV-1.13.
- Protection Score, Home recommendation rules, recommendation engine, report engine, private-report access, and frozen Workspace adapter remain unchanged.

Next customer-journey sprint: `CF-PVX-UX-1.0 — Consumer Fintech Experience Foundation + Migration Boundary`.

`CF-ADV-1.13` is intentionally paused. Resume it only after `CF-POL-1.4` establishes an actual recommendation supported by current-policy evidence, proposed quote evidence, the existing recommendation engine, or licensed producer verification.

---

## CF-ADV-1.13 — Recommendation Buy-In Capture

### Goal
Capture whether the recommendation rationale landed before the consultation.

### States
- `accepted_logic` — Makes sense to me
- `needs_explanation` — I’d like to understand it better
- `prefers_savings` — I’d rather prioritize cost here
- `undecided` — Not sure yet

### Requirements
- Reaction state does not change Protection Score.
- Reaction state does not bind coverage or alter policy.
- Customer can revise a reaction.
- Store timestamp and optional customer words.

### Definition of done
Workspace can begin a consultation knowing which topics already resonate and which need discussion.

---

## CF-ADV-1.14 — “What I Learned” Customer Snapshot

### Goal
Give the producer a 15-second advisory briefing before speaking.

### Example fields
- Shopping because
- What matters most
- Current relationship / tenure
- What they depend on
- What they have built / protection context
- Biggest concern
- Don’t break

### Requirements
- Derived exclusively from `discoveryProfile` and verified existing record data.
- Unknowns remain visibly unknown.
- No duplicate customer store.
- Mobile-safe and compatible with existing sticky snapshot architecture.

### Definition of done
Producer can understand the customer context without rereading the full assessment.

---

## CF-ADV-1.15 — Recommendation Anchor Copilot

### Goal
Turn discovery into natural producer language.

### Per topic
- They told you
- Connect it
- Recommendation
- Suggested natural phrasing
- Buy-in question
- Optional price-tradeoff question

### Example
**They told you:** This is their only vehicle.

**Try:** “Since you said you’d pretty much be stuck without the car, I’d keep rental on this one.”

**Buy-in:** “Does that fit how you use the car?”

### Requirements
- Prompts are suggestions, not mandatory scripts.
- Prefer concise natural language.
- Avoid “scare stuff,” absolutist claims, and legal outcome guarantees.
- Producer can ignore/edit the prompt.

### Definition of done
Every personalized prompt points back to explicit evidence and an eligible recommendation topic.

---

## CF-ADV-1.16 — Live Consultation Focus Mode 2

### Goal
Refill the existing six-stage Focus Mode with advisory context rather than create a parallel workflow.

### Stage mapping
**Understand**
- why here
- priorities
- lifestyle/dependency
- incumbent relationship

**Verify**
- policy facts
- evidence gaps
- current limits/deductibles

**Discuss**
- outcome concerns
- tradeoffs
- explanation-needed topics

**Recommend**
- personalized recommendation anchors

**Decide**
- customer preference
- final proposed structure

**Next Step**
- quote/bind/follow-up/information needed

### Requirements
- Existing consultation state remains authoritative.
- View navigation does not mark work complete.
- Existing verification/recommendation/completion guardrails remain.

### Definition of done
A producer can conduct the entire advisory conversation in the existing Focus Mode with no duplicated stage system.

---

## CF-ADV-1.17 — Live Buy-In + Conversation Notes

### Goal
Capture customer reaction during the call with minimal friction.

### Producer controls
- Makes sense
- Needs explanation
- Wants cheaper option
- Not relevant
- Customer words (short note)

### Requirements
- Reuse recommendation response contract.
- Do not overwrite pre-consultation customer reaction without history/updated timestamp.
- Customer words are bounded, escaped, and retained as advisory notes—not converted into facts unless explicitly promoted through a later verified workflow.

### Definition of done
A producer can record reaction in seconds without leaving Focus Mode.

---

## CF-ADV-1.18 — Advisor Guardrails & Phrase Quality

### Goal
Institutionalize customer-centered, evidence-backed language and prevent fear-default or overclaiming scripts.

### Preferred patterns
- “Because you told me…”
- “Based on what you shared…”
- “I’d be more comfortable…”
- “This is worth comparing…”
- “Does that fit how you use it?”

### Disfavored patterns
- “You need this.”
- “This will protect you from lawsuits.”
- “These limits are enough.”
- unsupported wealth/asset assumptions
- manufactured catastrophe scenarios as the default rationale

### Requirements
- Phrase quality checks apply to generated/suggested copy, not police normal producer notes.
- Coverage claims remain policy-qualified.
- Legal/claims outcomes are not guaranteed.

### Definition of done
Generated advisory language passes static phrase-quality and evidence-traceability tests.

---

# RELEASE C — ADVISORY RECORD + LEARNING

Goal: make the customer deliverables and producer records reflect the advisory conversation and create a learning loop from real outcomes.

## CF-ADV-1.19 — Agent Guide 2.0

### Goal
Upgrade the printable/consultation guide into the physical counterpart to the advisory engine.

### Sections
- Why they’re here
- What matters
- Customer signals
- Three recommendation anchors
- Questions to get buy-in
- Price tradeoffs
- Verification gaps
- Notes

### Requirements
- Preserve current `What we know → Ask → Explore → Check → Notes` strengths.
- Only print supported facts.
- Never print sensitive internal confidence diagnostics unless intentionally producer-only.

### Definition of done
The guide can support a live call without requiring the producer to invent the discovery-to-recommendation bridge.

---

## CF-ADV-1.20 — Client Snapshot 2.0

### Goal
Make the customer report a record of why choices fit—not just a list of topics/score.

### Sections
- What you told us
- What matters to you
- What we reviewed
- Dylan’s recommendations
- Why they fit your situation
- What you decided
- What still needs verification
- Next steps
- Review readiness / Protection Score methodology

### Requirements
- Clearly distinguish recommendation from selected/bound coverage.
- Policy facts remain subject to issued-policy verification.
- Customer preference for savings is documented neutrally.

### Definition of done
A customer can revisit the report months later and understand the rationale behind the conversation.

---

## CF-ADV-1.21 — Decision Rationale Ledger

### Goal
Store a durable distinction between customer fact, verified fact, producer recommendation, customer preference, and decision.

### Record shape
- topic
- what customer reported
- what was verified
- producer recommendation
- customer preference
- decision
- reason
- timestamp
- producer/record reference

### Requirements
- Append/history semantics for meaningful changes.
- No “declined coverage” shorthand where the actual state is only “preferred savings” or “not yet decided.”
- Compatible with consultation completion/disposition.

### Definition of done
Each final advisory decision has a traceable rationale without conflating reaction and authorization.

---

## CF-ADV-1.22 — Post-Call Learning Loop

### Goal
Collect lightweight producer feedback after real conversations.

### Suggested prompts
- Which recommendation required the most discussion?
- Which rationale resonated most?
- Main objection: price / loyalty / timing / value / other
- Outcome: quoted / follow-up / sold / lost / no decision

### Requirements
- Producer-only.
- No automatic performance judgment from a single interaction.
- No customer-risk or protected-class profiling.

### Definition of done
Completed consultations can produce structured learning data without burdening the producer.

---

## CF-ADV-1.23 — Advisory Analytics

### Goal
Measure whether the advisory system improves conversation quality and conversion without creating manipulative scoring.

### Metrics
- discovery completion
- recommendation anchors with evidence
- buy-in rate
- needs-explanation rate
- prefers-savings rate
- quote rate
- bind rate
- bind rate by reaction state
- objection distribution
- lost-to-price
- lost-to-incumbent
- follow-up rate

### Requirements
- No “manipulation score.”
- No inference of personal wealth/protected traits for sales ranking.
- Separate funnel metrics from Protection Score.

### Definition of done
The producer can learn which advisory approaches work while customer protection diagnostics remain conceptually separate.

---

# RELEASE D — MULTI-LINE ADVISORY EXPANSION

Goal: reuse the same discovery → signal → anchor → reaction → decision architecture across lines rather than creating separate sales systems.

## CF-ADV-2.1 — Auto Advisory Profile

### Discovery areas
- annual mileage
- commute/use
- business driving
- vehicle dependency
- alternate transportation
- vehicle value/ownership context
- household drivers
- young drivers
- current service/price priorities

### Recommendation domains
- liability
- UM/UIM
- comprehensive/collision
- rental
- roadside/towing
- deductibles

### Requirements
Auto signals and anchors use the same core contract and evidence semantics as Home.

---

## CF-ADV-2.2 — Home + Auto Relationship Graph

### Goal
Stop treating household liability as isolated policy conversations.

### Example
Homeowner + multiple vehicles + young driver + established household obligations → household liability context → coordinated auto/home liability + umbrella discussion.

### Requirements
- Relationship graph does not create underwriting eligibility conclusions.
- Every cross-line recommendation still depends on valid product rules and verified policy facts.

---

## CF-ADV-2.3 — Umbrella Advisory Engine

### Goal
Position umbrella through what the customer has built and wants to protect rather than lawsuit fear.

### Inputs
- properties
- vehicles
- drivers
- household liability context
- existing underlying limits
- customer protection/cost preference

### Requirements
- No unsupported asset-value assumptions.
- Underlying limit requirements remain carrier-specific and producer-verified.

---

## CF-ADV-2.4 — Life Continuity Discovery

### Goal
Frame life insurance around continuity and the customer’s stated priorities.

### Discovery
- who depends on income
- mortgage/housing continuity
- household income continuity
- children/education goals
- debts/obligations
- spouse/partner flexibility
- business continuity where relevant

### Core question
“What would you most want to remain financially intact for your family if your income were no longer available?”

### Requirements
- Avoid fear-driven death scripting.
- Preserve suitability, licensing, carrier, and application boundaries.

---

## CF-ADV-2.5 — Commercial Advisory Profile

### Goal
Apply the same architecture to business owners.

### Discovery
- what the owner has built
- what keeps the business operating
- what would interrupt operations
- who depends on the business
- contractual requirements
- property/equipment/income dependencies
- growth plans

### Core bridge
Business fact → business consequence → verified insurance topic → producer recommendation.

### Requirements
- Certificate requirements are not treated as the full coverage need.
- Industry-specific rules remain modular.

---

# RELEASE E — CERTIFICATION

## CF-ADV-3.1 — Advisory Truthfulness + Compliance Audit

### Goal
Audit every discovery question, derived signal, recommendation rationale, buy-in prompt, and report sentence against stored evidence and policy/compliance guardrails.

### Hard rule
No `Because you told us…` output may exist without a resolvable evidence source.

### Audit areas
- evidence traceability
- unsupported inference
- recommendation/decision separation
- buy-in/authorization separation
- score isolation
- fear/overclaim language
- issued-policy verification language
- data minimization/privacy

---

## CF-ADV-3.2 — Mobile + Accessibility Certification

### Goal
Certify the redesigned conversational assessment and advisory controls across narrow screens and accessible interaction modes.

### Matrix
- 320px through desktop
- 400% zoom/reflow
- keyboard
- VoiceOver/source semantics
- reduced motion
- forced colors/high contrast
- 44px touch targets
- 16px mobile form inputs
- short landscape
- safe areas
- save/resume
- branch restoration

### Requirement
Do not claim unperformed physical-device/assistive-technology validation as completed.

---

## CF-ADV-3.3 — End-to-End Regression + Production Certification

### Full path
408FARMERS → handoff → discovery → assessment → signal engine → recommendation anchor → customer reaction → report → consultation record → Workspace → Focus Mode → decision → Agent Guide → Client Snapshot.

### Preserve/regress
- RC-SMS
- attribution
- D1
- private report access
- producer notifications
- legacy consultations/reports
- Protection Score
- evidence contracts
- property personalization
- zero-repeat
- recommendation rules
- print/document engine
- Cloudflare deployment

### Definition of done
No unresolved blocker remains for controlled production release, and all known historical regression-suite limitations are explicitly dispositioned rather than hidden.

---

# Release sequencing

## Release A — Advisory Foundation
`CF-ADV-1.1 → 1.10`

Outcome: CoverageFit understands why the customer came, what matters, how they live, and what outcomes concern them.

## Release B — Personalized Recommendations + Sales Copilot
`CF-ADV-1.11 → 1.18`

Outcome: CoverageFit can show why an eligible recommendation fits this customer, capture reaction, and coach the producer with evidence-backed language.

## Release C — Advisory Record + Learning
`CF-ADV-1.19 → 1.23`

Outcome: reports, printed guides, decisions, notes, and analytics reflect the advisory conversation.

## Release D — Multi-Line Expansion
`CF-ADV-2.1 → 2.5`

Outcome: the same advisory architecture spans Auto, Home + Auto, Umbrella, Life, and Commercial.

## Release E — Certification
`CF-ADV-3.1 → 3.3`

Outcome: truthfulness, accessibility, mobile behavior, regression, and production deployment are certified.

---

# Dependency map

```text
                    ┌─ 1.4 Why Here
                    ├─ 1.5 Relationship
1.1 DATA CONTRACT ──┼─ 1.6 Lifestyle
        │           └─ 1.7 Outcomes
        │                  │
        ▼                  ▼
1.2 SIGNAL ENGINE ─────> 1.8 ORCHESTRATION
        │                  │
        ▼                  ▼
1.3 ANCHOR CONTRACT ───> 1.9 BRANCHING
        │                  │
        └──────────┬───────┘
                   ▼
              1.10 REACTIONS
                   │
                   ▼
        1.11 YOUR COVERAGEFIT
                   │
                   ▼
        1.12 WHY THIS FITS YOU
                   │
                   ▼
           1.13 BUY-IN STATE
                   │
              ┌────┴────┐
              ▼         ▼
       1.14 SNAPSHOT   1.15 COPILOT
              │         │
              └────┬────┘
                   ▼
           1.16 FOCUS MODE 2
                   │
                   ▼
            1.17 LIVE REACTIONS
                   │
                   ▼
            1.18 GUARDRAILS
                   │
         ┌─────────┼─────────┐
         ▼         ▼         ▼
      1.19      1.20       1.21
  Agent Guide  Snapshot   Decision Ledger
         └─────────┬─────────┘
                   ▼
              1.22 LEARNING
                   │
                   ▼
              1.23 ANALYTICS
                   │
                   ▼
            2.x MULTI-LINE
                   │
                   ▼
            3.x CERTIFICATION
```

# Protection Score transition policy

Do not remove Protection Score during CF-ADV-1.

**Current:** Protection Score → recommendations.

**Target:** Customer Profile + verified assessment → recommendations + personalized rationale, with Protection Score retained as a supporting review-readiness diagnostic.

The score tells us what needs review under the established assessment methodology.

Discovery tells us why the customer may personally care about a topic.

Producer judgment connects verified facts to the recommendation.

Customer reaction tells us whether the recommendation rationale landed.

The final decision records what the customer and producer actually chose to do.

These concepts must remain separate throughout the program.

# Resumption instructions

For every subsequent CF-ADV sprint:

1. Read this roadmap first.
2. Read `CF_ADV_1_1_CONTRACT.json` and `SPRINT-CF-ADV-1.1.md` before changing the advisory data model.
3. Read `CF_ADV_1_2_SIGNAL_ENGINE_CONTRACT.json` / `SPRINT-CF-ADV-1.2.md` before changing derived signals, `CF_ADV_1_3_RECOMMENDATION_ANCHOR_CONTRACT.json` / `SPRINT-CF-ADV-1.3.md` before changing personalized recommendation rationale, `CF_ADV_1_4_OPENING_CONTRACT.json` / `SPRINT-CF-ADV-1.4.md` before changing opening discovery or zero-repeat motivation/priority behavior, and `CF_ADV_1_5_RELATIONSHIP_CONTRACT.json` / `SPRINT-CF-ADV-1.5.md` before changing incumbent relationship discovery or “don’t break what works” semantics.
4. Preserve the five program data layers: raw discovery, derived signals, recommendation anchors, recommendation reactions, final decisions.
5. Never make discovery/reaction fields inputs to Protection Score unless a future explicitly approved methodology revision is independently designed and certified.
6. Reuse `discoveryProfile`; do not introduce a parallel advisory customer store.
7. Preserve evidence/source references whenever data is transformed.
8. Keep unknowns explicit rather than filling them with inferred values.
9. Continue using the existing consultation record as the durable producer workflow record.
10. Run the focused sprint QA plus relevant assessment, Workspace, recommendation, report, zero-repeat, and deployment checks.
11. Treat aggregate legacy regression results carefully: several historical QA files pin exact former release versions; compare against the prior package baseline and distinguish pre-existing failures from regressions introduced by the sprint.
