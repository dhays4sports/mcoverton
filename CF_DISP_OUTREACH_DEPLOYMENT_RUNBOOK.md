# CF-DISP-OUTREACH-1.1 Automatic Discovery Deployment + Operator Runbook

## 1. Deploy CoverageFit Pages
Deploy this root package through the existing CoverageFit Cloudflare Pages process.

Existing required configuration remains:
- `COVERAGEFIT_DB` D1 binding
- `COVERAGEFIT_PRODUCER_ACCESS_TOKEN`

No D1 migration is required.

## 2. Add Brave Search API key to the Pages project
Automatic/manual discovery requires:

`BRAVE_SEARCH_API_KEY`

Add it as a server-side secret in the CoverageFit Pages project. It is never sent to the browser.

Optional cost variables:
- `COVERAGEFIT_DISCOVERY_MONTHLY_REQUEST_LIMIT=900`
- `COVERAGEFIT_DISCOVERY_RESULT_LIMIT=8`
- `COVERAGEFIT_DISCOVERY_QUERIES_PER_SWEEP=8`

The default application budget ceiling is 900 Brave requests/month.

## 3. Smoke-test manual discovery
1. Open `/agent/displacement-outreach.html`.
2. Connect with the existing producer access key.
3. Confirm **Search API: Ready**.
4. Confirm monthly usage is shown.
5. Press **Run discovery now**.
6. Confirm the sweep completes and reports added / duplicate / filtered counts.
7. Confirm any useful result appears with an `auto found` marker.
8. Confirm `Open original` opens the source and CoverageFit still does not post anything automatically.

If `Search API` says **Needs Brave key**, the Pages environment secret is missing or unavailable.

## 4. Deploy the automatic scheduler Worker
Cloudflare Pages Functions do not own the Cron Trigger in this architecture. A small companion Worker runs the same certified discovery core against the same D1 database.

Copy:

`wrangler.discovery.example.jsonc`

to:

`wrangler.discovery.jsonc`

Replace `REPLACE_WITH_PRODUCTION_D1_DATABASE_ID` with the same production D1 database ID used by CoverageFit.

Add `BRAVE_SEARCH_API_KEY` as a secret to the discovery Worker, then deploy the Worker using the repository script:

`npm run cloudflare:discovery:deploy`

The example config includes three UTC Cron Triggers:
- `15 15 * * *`
- `15 20 * * *`
- `15 1 * * *`

During Pacific Daylight Time these run at approximately 8:15 AM, 1:15 PM and 6:15 PM. During Pacific Standard Time they shift one hour earlier. Exact wall-clock alignment is not required for this use case.

## 5. Verify scheduled discovery
After the first Cron run:
1. Open the outreach dashboard.
2. Refresh.
3. Confirm **Last sweep** has advanced.
4. Confirm monthly search usage increased by no more than the configured queries-per-sweep.
5. Review new auto-found opportunities.

## 6. Optional OpenAI drafting
For selective contextual redrafting only:

`OPENAI_API_KEY`

Optional model override:

`COVERAGEFIT_OUTREACH_AI_MODEL=gpt-5.6-luna`

Discovery never auto-calls OpenAI, so search sweeps do not create AI-token cost.

## 7. Expected source behavior
Automatic discovery covers **public/indexed** content only.

Closed Facebook groups, private Nextdoor conversations, member-only HOA portals, private Realtor communities, and personal-network messages remain manual-assisted. Use **Add an opportunity** or CSV import for those sources.

## 8. Operating pattern
Recommended producer routine:
- open the inbox once in the morning and once later in the day
- prioritize `Respond`
- open the original source before posting
- use the no-link first reply when appropriate
- use the CoverageFit follow-up link only when context/group rules support it
- mark Responded / Follow-up / Converted / Skip so the queue stays actionable

## 9. Budget behavior
Default scheduled maximum:
- 8 queries/sweep
- 3 sweeps/day
- 720 requests in a 30-day month
- 744 requests in a 31-day month
- application hard cap: 900/month

The cap applies to both scheduled and manual discovery runs because usage is stored in the shared D1 database.

## 10. Rollback
To roll back automatic discovery while retaining the human-assisted queue:
- undeploy/disable the `coveragefit-displacement-discovery` Worker/Cron Triggers
- remove `functions/api/outreach/discovery.js`
- remove `server/displacement-discovery-core.mjs`
- remove `workers/displacement-discovery-worker.mjs`
- restore the prior outreach dashboard assets

No database migration rollback is required. Existing outreach opportunity records can remain safely isolated under their existing prefix.
