# CF-DISP Privacy, Security + Consent Certification

**Status: PASS.**

## Consent separation

The displacement intake preserves independent states for:

- Snapshot/save state
- producer contact request
- SMS permission
- call permission
- email permission
- self-service continuation

The contact form explicitly requires the contact-request checkbox before creating a producer request. A second channel-permission checkbox controls only the selected channel. The existing server checkpoint continues to validate channel-specific requirements. A displacement deadline does not override consent.

## Semantic isolation

Every sanitized displacement context includes explicit boundaries:

- `operationalOnly: true`
- `protectionScoreInput: false`
- `recommendationInput: false`
- `eligibilityDecision: false`
- `pricingDecision: false`
- `bindabilityDecision: false`
- `actionReadinessInput: false`
- `contactPermission: false`

Operational urgency is used only as a tiebreaker among otherwise actionable producer queue states. The queue retains `numericLeadScore: null`.

## Input handling

Carrier/event/property/reason/timing fields are enum bounded. ZIP must be exactly five digits. Free text is trimmed, control characters and angle brackets are removed, and lengths are bounded. Campaign and Google click identifiers are likewise bounded through the existing attribution module.

## Analytics / conversion separation

General PVX/displacement analytics emit enumerated contextual fields and do not include name, phone, email, address, or notice text. Data Manager conversion-match data is produced only by the dedicated conversion adapter and is explicitly marked `generalAnalyticsContainsPii:false`.

## Existing security surfaces preserved

Protected hash comparison confirms unchanged secure resume, SMS consent, SMS API consent, outbound SMS gateway, Protection Score, recommendation engines and readiness core.
