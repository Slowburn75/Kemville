# Security and health data

This implementation does not assert regulatory compliance. Obtain Nigerian clinical/legal/privacy review before real patient data is processed.

## Implemented controls
Scrypt with random salt, opaque random sessions stored hashed, HttpOnly cookies, Secure cookies in production and SameSite=Lax. Exact APP_URL Origin check on account mutations. Verification/reset tokens stored hashed, short-lived and atomically consumed. Reset revokes sessions. Database account/action throttles, Zod validation and bounded JSON bodies. Adult-only validation. Privileged login denied until MFA implementation. GCM encryption with authenticated context. Raw-body timestamped Paystack signature helper with constant-time digest comparison and 300-second replay window. No detailed intake content in email/Calendar adapters.

## Known gaps and required review
Registration consent persists a policy version transactionally; approved policy text remains required. Rate limiting needs network/global abuse controls and expired-row cleanup. Account enumeration and timing need adversarial review, including registration email delivery errors. Email retries/resend and durable outbox dispatch are incomplete. Registration optional occupation, preference and emergency-contact form controls remain to implement. MFA, privileged provisioning, profile access/update audit, clinical access audit, session management UI, retention/deletion and key rotation resolver remain incomplete.

The lightweight patient dashboard shows appointment metadata only. It does not expose medical records. Medical helpers must be called exclusively from authenticated owner/assigned-clinician server paths. Non-clinical administrators must not receive intake data. Never log passwords, tokens, intake answers, decrypted profiles or provider secrets. Review Prisma/provider error handling before live rollout.

Add a production CSP appropriate to bundled Next scripts and approved asset hosts; current policy prevents framing/objects but does not restrict all script sources. Replace external font/stock-image requests with reviewed local assets. Audit dependencies and review overrides before release. Do not enable live payment keys, recording or transcription.

## Incident/recovery procedure
Disable account/booking gates, revoke affected sessions and provider credentials, preserve redacted audit evidence, notify designated security/privacy leads, assess notification obligations, restore to an isolated branch and verify integrity before reopening. Separate encryption-key access from database access; document rotation and restore tests.
