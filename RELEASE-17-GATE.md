# Release 17 — Learning Gate

Status: Passed at CoverageFit v3.20.171.

- The event schema covers every approved entry, value and return checkpoint using bounded enums and ordinal counts only.
- Name, phone, email, address, free text, exact words, policy or document facts, internal notes and resume credentials have no public event fields.
- Ordered delivery, idempotency, deduplication, retry and offline recovery are certified.
- Aggregate attribution distinguishes route, campaign, SMS, referral and direct cohorts and keeps anonymous participation, saving, contact and producer readiness separate.
- Conversion targets remain unset before pilot data; engagement is not evidence of insurance need.
- Experiments require semantic, accessibility and privacy approval plus protected metrics and rollback. Dark patterns and protected-engine changes are prohibited.
- CoverageFit regression: 276 tests, 188 passing, exact 88 historical/version failures, 0 new product failures.
- 408FARMERS regression: 182 tests, 41 passing, exact 141 normalized historical/environmental failures, 0 new product failures.
- Protected hashes match the post-Hook-1.3 authorized baseline. The two earlier copy-only changes and original baseline remain documented.
- The v3.20.171 package extracted and passed focused, regression, privacy-schema, protected-hash and root checks. No live configuration changed.
