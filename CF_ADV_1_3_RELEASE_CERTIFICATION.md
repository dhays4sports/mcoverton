# CF-ADV-1.3 Release Certification

Release: CoverageFit 3.20.74  
Sprint: CF-ADV-1.3 — Recommendation Anchor Contract  
Status: Certified for continuation to CF-ADV-1.4

## Certified behavior

CoverageFit now stores a durable `recommendationAnchors` layer that can connect an existing eligible recommendation topic to customer context without changing the underlying recommendation semantics.

A personalized anchor is allowed only when:

1. the topic is in the supplied established recommendation/priority set;
2. the supporting customer signal is `active`;
3. the signal carries one or more evidence references; and
4. the signal-to-topic mapping is explicitly supported or the customer explicitly supplied a price/protection tradeoff preference.

If those conditions are not met, the anchor falls back to the existing recommendation explanation/question and does not claim `Because you told us...` personalization.

## Traceability

Personalized anchors retain:

- recommendation key and source identity
- supporting signal keys
- evidence references
- customer-facing copy
- producer-facing copy
- explicit tradeoff framing when supported

## Recommendation boundary

The anchor engine consumes an eligible recommendation set. It has no dependency on the recommendation-generation engine and cannot create a topic when the supplied eligible set is empty.

The following protected files remain byte-compatible with the incoming 3.20.73 build:

- `assets/js/protection-score.js`
- `assets/js/recommendation-engine.js`
- `assets/js/home-recommendation-rules.js`
- `assets/js/workspace-data.js`

## Customer-decision boundary

`buyInPrompt` is conversation assistance only. CF-ADV-1.3 does not populate `recommendationResponses`, make a final recommendation decision, authorize a quote change, or bind coverage.

## QA

Focused deterministic QA: **68/68 checks passing** in `CF_ADV_1_3_QA.js`.

Aggregate regression comparison: **113/177 passing, 64 failing**, versus the incoming 3.20.73 baseline at **112/176 passing, 64 failing**. The exact 64-test historical failure set is unchanged, with **zero new failures**.

The full regression comparison is documented in `CF_ADV_1_3_REGRESSION_REPORT.md`.

## Next

Proceed to `CF-ADV-1.4 — “Why Are We Here?” Opening` using `CF-ADV-ROADMAP.md` as the authoritative sequence.
