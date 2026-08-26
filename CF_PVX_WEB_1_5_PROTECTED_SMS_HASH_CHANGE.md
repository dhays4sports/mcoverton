# Authorized protected SMS hash change — 408-CF-PVX-WEB-1.5

`server/sms-conversation-core.mjs` is the sole protected SMS runtime changed in this sprint.

- Before: `3ff6f4e909c64416636b681d6ec6e096d69c50985d2d443fe74a57d05ab0c990`
- After: `5b15ad552b190b2c5b85938d182c51302d4a032669f5ab976a9122324060063e`
- Authorized purpose: evaluate explicit Home + Auto / Auto + Renters bundle phrases before the broader Home Review phrase rule.
- Behavioral scope: intent classification only; webhook, JWT, duplicate suppression, outbound registry, STOP/START/HELP, retry, consent, human takeover and producer ownership logic are unchanged.

Certification: CF-PVX-SMS-1.0 through 1.5 all pass, and all 23 real prefilled 408FARMERS SMS bodies resolve to the intended deterministic intent or the documented producer-safe fallback.
