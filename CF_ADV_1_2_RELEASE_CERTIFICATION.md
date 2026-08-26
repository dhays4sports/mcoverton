# CF-ADV-1.2 Release Certification

Release: CoverageFit 3.20.73  
Sprint: CF-ADV-1.2 — Discovery Signal Engine

## Certification scope

This release certifies the deterministic advisory signal layer introduced between raw `discoveryProfile` facts and future recommendation-anchor work.

## Certified behaviors

- Raw discovery and derived signals remain structurally separate.
- The runtime exposes four bounded deterministic rule families from the CF-ADV roadmap.
- Active signals require evidence references.
- Unrecognized, incomplete, or untraceable inputs fail closed.
- Conflicting recognized evidence becomes a candidate needs-confirmation state rather than silent overwrite.
- Re-running derivation is idempotent for CF-ADV-1.2-owned signal IDs.
- Existing non-engine signal records are preserved.
- Recommendation anchors and recommendation responses are unchanged by signal application.
- The Home assessment loads and applies the signal engine without changing the existing CF-ADV-1.1 discovery seed boundary.

## Protected production contracts

The release does not change the contents of:

- `assets/js/protection-score.js`
- `assets/js/recommendation-engine.js`
- `assets/js/workspace-data.js`

Their SHA-256 values remain:

- protection-score.js: `0cf3190a5bb99aceb0e527f91268247481fd14e67acd81fb35db3accd8a5f2a8`
- recommendation-engine.js: `0d5973be5455d416c8f2477ce08f327adff0fff91bdb987efe62c6e8e8e6fe18`
- workspace-data.js: `8a11fd11fb3e027cfef746f4f9214b9d345c5db49862921dff27bbcfcc49eef2`

## Non-certifications / intentionally deferred

CF-ADV-1.2 does not certify:

- new customer discovery screens
- personalized recommendation rationale
- recommendation buy-in capture
- Workspace advisory presentation
- Client Snapshot changes
- multi-line advisory expansion

Those remain assigned to later roadmap sprints.

## Next

CF-ADV-1.3 — Recommendation Anchor Contract.

## Regression result

Incoming 3.20.72 baseline: 111 / 175 passing, 64 failing.  
CF-ADV-1.2 3.20.73: 112 / 176 passing, 64 failing.

The failing-test set is identical: zero new regressions. See `CF_ADV_1_2_REGRESSION_REPORT.md` for the comparison and version-allowlist maintenance details.
