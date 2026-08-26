# CF-DISP Protected Hash Comparison

**Result: PASS — protected semantic core remains intact.**

## Unchanged protected files

- `assets/js/protection-score.js` — `0cf3190a5bb99aceb0e527f91268247481fd14e67acd81fb35db3accd8a5f2a8`
- `assets/js/executive-report-engine.js` — `a2af691118b45aed1adcbfb51b1029dbd9a2679d1a405f94c40bf2bd8e7550f5`
- `assets/js/home-recommendation-rules.js` — `0c4fb83590a2d0f29803f593a6716ba961c49a651542b74d53e01b9e33df4629`
- `assets/js/pvx-readiness-contract.js` — `b7fcf763d7b3fdf0fda1082284410070df00f487bdccaa52ce00426aaf58db4e`
- `assets/js/recommendation-builder.js` — `0cef67b4249773526c5f69dbdb6cd2c40c954129e15efa4ffbd7ad2f58c6591a`
- `assets/js/recommendation-engine.js` — `0d5973be5455d416c8f2477ce08f327adff0fff91bdb987efe62c6e8e8e6fe18`
- `assets/js/report-engine.js` — `da603a0aace35e59c35fbc4d8e75395c6f2328fe7fb0df6991e0110ae7e2068b`
- `server/pvx-readiness-core.mjs` — `1c6b4976dc9dea23968d28502467a92ded633f41774f632806082532f458f328`
- `server/pvx-resume-core.mjs` — `d2e7891c807ee3db8db231c19ab55838199aa8385bb32758e0240732ebde30f2`
- `server/sms-consent-api-core.mjs` — `d21e714d278618a025bc32ee43cdc34e7b43c45cefd162dd1e98617aef1d72eb`
- `server/sms-consent-core.mjs` — `9d5efa769df8b8aa670c659787a1756cb07bd8435bb87ec0682eadf19515e586`
- `server/sms-outbound-gateway.mjs` — `57872a74b983dec98a21b91b82dd6896e6cbecfdaa8a5e5bbc6e18ad26f2efe3`

These unchanged surfaces include Protection Score, recommendation rules/engines, action-readiness core, report engine, secure resume core, SMS consent, and SMS outbound ownership/gateway behavior.

## Intentional protected-surface changes

### `assets/js/attribution.js`
- baseline: `7e8d7514a1eedd57392a17fad6a10425dc7859c3937767126ecaf56dbad0027b`
- final: `fed970b9f81f608519aae23a89627487bfe3fa5a1991ee0ab303a2920740313c`
- reason: Adds bounded Google click identifiers (gclid/gbraid/wbraid/gclsrc) to the existing attribution envelope; no scoring or PII analytics logic added.

### `assets/js/pvx-checkpoint-view.js`
- baseline: `d5e6f08f08fd684f730787b6013ca357142e72fea815ff2146aeffc65bdca939`
- final: `96e75d9d47406decae683a487b3c62cb65c7f87eb7b2ff7ae687e9c6e9bdf289`
- reason: Carries the already-confirmed displacement context into existing secure checkpoint operations; does not create consent.

### `assets/js/pvx-checkpoint.js`
- baseline: `2646bc57fbee31963ac58118efe7ff5462b91091dc240781f7be9e2937ad0ffb`
- final: `bdce10c49e0c3351281f8e6a44f025467b75e02ba6afe36753d05c0d973e4d67`
- reason: Allows the existing checkpoint payload to accept displacementContext; no consent semantics changed.

### `server/pvx-checkpoint-core.mjs`
- baseline: `25f09c5264835bf939dd595cfe64a31fc96f4dd619976fb19d88fafcb87c734c`
- final: `e3868d0a4e4946d8f0d92ffd9def4f5a5c9d1b666e0bcf2349300f243a34d016`
- reason: Sanitizes and persists displacementContext beside the existing checkpoint record; contact/channel validation remains intact.

### `server/pvx-producer-brief-core.mjs`
- baseline: `1dba74cb7f323334733bdb46607d6ee66de10fd557c6967031cc97aea23a83d5`
- final: `792a34640f924b2a4ea4b99e5d7d6b5b2dd463d0cebeca705b9624ff60f008b8`
- reason: Adds an operational displacement section to the producer brief with explicit eligibilityDecision:false.

### `server/pvx-unified-producer-record-core.mjs`
- baseline: `f91af46e3a14dbe441cf9b620596d62abf8afe412f49d222cb2185fb4850c6ae`
- final: `24300ec02b4a0ae5f9d7168daaa25eebc8cd843afe9b49f622b9e51b9e853a67`
- reason: Carries sanitized displacement/attribution context into the unified producer record without changing underwriting or readiness decisions.

## Additional modified workflow surfaces

- `server/pvx-producer-action-queue-core.mjs` — same-state operational urgency tiebreaker; `numericLeadScore:null` remains explicit.
- `server/pvx-event-core.mjs` and `assets/js/pvx-consumer-events.js` — add bounded displacement/outcome event names and enums.
- `assets/js/assessment-engine.js` and `assets/js/consultation-records.js` — carry displacement context as integration/report metadata; scoring functions remain untouched.
- `agent/workspace/index.html` and `assets/js/agent-workspace.js` — render the producer-facing displacement context.

Machine-readable comparison: `cf-disp/baseline/PROTECTED_HASH_COMPARISON.json`.
