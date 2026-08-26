# Release 25 Accessibility + Performance Certification

Status: PASS for the offline production candidate.

- 320-pixel through desktop layouts, 400-percent reflow and iPhone safe-area rules remain present.
- Controls meet or exceed 44 pixels and inputs retain 16-pixel text.
- Skip links, labels, headings, pressed states, live status regions, focus-visible treatment and keyboard Back behavior remain intact.
- Reduced-motion rules remove motion as a requirement.
- Snapshot precedes readiness; scope is hidden until relevant; every optional choice has a skip or nonparticipation path.
- No account, contact detail, readiness expression or artificial delay is required for first value.
- Same-device and secure cross-device return preserve the exact stage.
- First-value and response times are measured in privacy-safe buckets after deployment; an observed production result was not fabricated offline.

The earlier physical-device/browser limitation remains: production-pilot device timing and real VoiceOver session evidence must be recorded during the controlled cutover smoke/pilot, not claimed from source inspection.
