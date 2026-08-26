# Consumer Information-Surface Certification

Sprint: CF-PVX-INSIGHT-3.0  
Version: 3.20.172  
Status: Passed with one explicitly deferred production measure.

## Certified

- Three-second comprehension structure: product name, truthful topic count, first topic/evidence and primary action precede secondary content.
- Result-first hierarchy and deterministic zero, one, two and three-topic layouts.
- First mobile viewport prioritizes the personal payoff; topic numbers are announced as review order.
- Responsive behavior from 320 CSS pixels through desktop, short-landscape rules and 400% reflow-compatible single-column layout.
- Touch targets of at least 44 pixels and 16-pixel form controls.
- Semantic headings, skip link, live status, native details/summary expansion, buttons, fieldsets and keyboard-operable back navigation.
- Reduced-motion behavior and no artificial analysis delay.
- Refresh/retry, anonymous same-device continuation, continuation without saving and secure exact-stage resume.
- Snapshot viewing requires neither contact details nor an account.

## Timing target

The target of a first personalized result in under three minutes is not claimed from static source inspection. A supported real-browser runtime was not available in this certification environment. The target is therefore deferred to controlled production pilot telemetry using `hook_viewed` or `first_answered` → `snapshot_viewed`, with median and 75th/90th percentile reported separately by entry cohort and prefill state.

This deferral is not a product failure: the flow remains eight questions maximum, uses auto-advance for single choices, has no artificial delay and never gates the initial Snapshot behind contact information.
