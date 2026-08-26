# 408-CF-PVX-HOOK-1.3 — Authorized SMS Copy-Only Hash Change

The v3.20.151–v3.20.167 protected baseline is preserved in the Release 16 artifact history. This sprint intentionally changes exactly two protected SMS runtime files:

- `server/sms-conversation-core.mjs`
- `server/ringcentral-sms-connection-core.mjs`

The only runtime differences are customer-facing continuation-message strings. The new invitation names the personal CoverageFit Snapshot, says compatible information is reused, and says the journey begins with the first unanswered question. No state transition, classifier, command, consent, suppression, ownership, retry, provider, webhook, or handoff-token logic changed.

All other protected CoverageFit and SMS hashes remain byte-identical. The complete SMS regression matrix and extracted-package checks are required before certification.
