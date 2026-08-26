# CF-DISP Rollback Runbook

## Fast traffic rollback

If the issue is isolated to acquisition pages, pause paid campaigns and remove links to `/nonrenewal/` and `/nonrenewal/safeco/` while leaving the historical CoverageFit application online.

## Code rollback

The immutable rollback source is the verified v3.20.200 baseline with SHA-256:

`cefd2d7b52bdc2a818941e981b9e867e08b1a14ccee17cd69d4a782eb2c7ba13`

1. Restore shared modified files from that baseline where the incident touches certified existing behavior.
2. Remove additive CF-DISP files/routes/configuration where appropriate.
3. Restore the baseline `sitemap.xml` if the routes are removed.
4. Re-run the focused and full normalized regression gates.
5. Never “rollback” by weakening consent, secure-token, readiness, recommendation, Protection Score, SMS or report contracts.

## Incremental rollback

Per-sprint rollback notes live under `cf-disp/releases/CF_DISP_*_ROLLBACK.md`. Prefer the smallest safe rollback when the affected ownership boundary is clear.

## Measurement rollback

If Google conversion import is faulty, stop the Data Manager import/schedule independently; do not remove customer consent controls or general analytics protections.

## Recovery gate

A corrected candidate must again pass:

- 27/27 integrated focused QA
- 141/141 sprint QA
- 30/30 final acceptance E2E
- zero new unexplained normalized regression failures
- protected-hash review
- dependency-backed Cloudflare Functions build
