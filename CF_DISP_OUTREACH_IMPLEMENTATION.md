# CF-DISP-OUTREACH-1.1 — Automatic Discovery + Human-Assisted Displacement Outreach

## Purpose
Turn the prior manual-capture outreach queue into a low-cost prospect radar. CoverageFit now discovers public/indexed displacement discussions and selected referral relationships automatically, filters them, drafts a response, and leaves every post/send action to the producer.

## Human boundary
This release deliberately does **not** auto-post, auto-comment, auto-message, impersonate the producer, log into social platforms, scrape closed communities, or bypass platform controls. Every response is human-approved and manually posted/sent.

## Automatic discovery
Core: `server/displacement-discovery-core.mjs`
Manual endpoint: `/api/outreach/discovery`
Scheduled worker: `workers/displacement-discovery-worker.mjs`
Worker config template: `wrangler.discovery.example.jsonc`

The engine uses the Brave Search API to query the public/indexed web. It does not require Reddit, Facebook, or Nextdoor account credentials.

Default sweep contains eight query families:
1. Reddit — Safeco / Liberty nonrenewal
2. Reddit — California home nonrenewal
3. Reddit — California condo nonrenewal
4. publicly indexed Nextdoor displacement
5. publicly indexed Facebook-group displacement
6. public-web Safeco / Liberty displacement
7. South Bay HOA / property-management relationships
8. South Bay condo Realtor relationships

Query definitions are retained in `CF_DISP_OUTREACH_QUERY_PACK.json` and the runtime constant `DISCOVERY_QUERY_PACK`.

## Cost governor
The runtime defaults to:
- 8 search API requests per sweep
- 3 scheduled sweeps/day
- 900 API requests/month hard application limit
- 8 results requested per search
- at most 5 new discussion records/query
- at most 3 new relationship records/query

At three sweeps/day, the theoretical scheduled maximum is 720 requests in a 30-day month and 744 in a 31-day month. The 900-request governor leaves room for manual sweeps while preventing accidental runaway search spend.

Every attempted Brave request counts against the application-side monthly budget before the call is made. Once the budget is exhausted, the discovery cycle stops before another external request.

## Discovery filtering
Search results are normalized and canonicalized before storage. Common tracking parameters are removed, and a SHA-256 digest of the canonical source URL creates a deterministic automatic-opportunity ID.

This provides cross-query and cross-sweep deduplication.

Discussion results must reach the deterministic prospecting relevance threshold before they enter the producer queue. Obvious customer-service/login/billing/job noise is filtered out. Relationship searches are separately capped and require relevant business/association language.

Paid AI is **not** called automatically by discovery. Automatic results receive the deterministic scoring/draft fallback already certified in CF-DISP-OUTREACH-1.0. The producer can selectively press **Regenerate draft** for a higher-context OpenAI draft.

## Outreach inbox
Internal surface: `/agent/displacement-outreach.html`

The dashboard now shows:
- search API configured/not configured
- monthly search usage and limit
- last discovery sweep
- **Run discovery now**
- auto-found marker on discovered records
- discovery query/source context
- relevance score and Respond/Review/Skip recommendation
- no-link first reply
- link-ready follow-up
- email/SMS drafts for relationships
- Copy / Open original / Responded / Follow-up / Converted / Skip controls

The producer token remains the same `COVERAGEFIT_PRODUCER_ACCESS_TOKEN` used by Agent Workspace.

## Storage
No D1 migration is required.

Existing `pvx_records` table namespaces:
- opportunities: `outreach/opportunities/`
- discovery runs: `outreach/discovery/runs/`
- monthly API usage: `outreach/discovery/usage/`

Outreach/discovery records remain separate from customer consultation/PVX records.

## Platform coverage
### Automatically discoverable
- indexed Reddit threads
- indexed public web discussions
- indexed public Nextdoor pages when search engines can see them
- indexed public Facebook/group pages when search engines can see them
- public HOA/property-management websites/results
- public Realtor websites/results

### Still manual-assisted
- closed/private Facebook groups
- non-indexed/private Nextdoor neighborhood content
- HOA member portals
- private Realtor groups
- personal conversations / existing-network messages

These can still be pasted/imported into the same queue and receive the same scoring/drafting workflow.

## Attribution
Every opportunity receives an opaque source-tagged CF-DISP URL. Automatic discovery does not put names, emails, phone numbers, or captured discussion text in the URL or general analytics.

## Semantic guardrails
Discovery relevance is prospecting relevance only. It does not alter or infer:
- Protection Score
- carrier/Farmers eligibility
- underwriting eligibility
- pricing
- bindability
- recommendation ranking
- action readiness
- contact/SMS/email consent

## Optional AI
The prior server-side OpenAI Responses API adapter remains optional. Discovery itself never requires it. If configured, individual records may be redrafted with `store:false` using the configured model.
