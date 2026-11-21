# Deployment preparation

Use an appropriate commercial Vercel plan; do not use Hobby for commercial production. Import repository, use Node 22 and `npm run build` (Prisma generation then Next build). No startup migration. Configuration is described in `.env.example`; never commit populated env files.

- DATABASE_URL: Neon pooled connection, sslmode=require.
- DIRECT_URL: direct connection for explicit migration jobs.
- APP_URL: exact canonical HTTPS origin, also used for request-origin checks and emails.
- AUTH_SECRET: reserved for future authentication signing; current opaque sessions use hashed database tokens.
- MEDICAL_ENCRYPTION_KEY: 32 random bytes as 64 hex characters; MEDICAL_ENCRYPTION_KEY_VERSION: documented rotation generation. Current helper supports context binding; multi-key resolver still needed.
- PAYSTACK_PUBLIC_KEY, PAYSTACK_SECRET_KEY: sandbox credentials. Adapter rejects non-test secret keys.
- PAYSTACK_WEBHOOK_SECRET: signing secret; configure eventual webhook URL in merchant dashboard. Receiver/reconciliation orchestration remains to implement.
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, GOOGLE_CALENDAR_ID: dedicated authorized account. OAuth refresh/token storage and event update/cancel still needed. GOOGLE_MEET_ENABLED and GOOGLE_PRIVACY_REVIEW_APPROVED default false.
- RESEND_API_KEY, EMAIL_FROM: verified sender/domain. Verify actual delivery before account rollout.
- WHATSAPP_BUSINESS_NUMBER: official verified digits-only international number.
- CRON_SECRET: reserved for authenticated outbox/reminder worker, not implemented yet.
- REGISTRATION_APPROVED: default false. Only enable after clinical identity, approved privacy/consent policies and operational/security signoff.

## Release blockers
Provision Neon branch and execute migration/integration tests. Verify clinician identity and registration, support details and clinic before activation. Complete booking/payment state machine, transactional outbox worker, provider retry/idempotency, profile editor, MFA and operational dashboards. Review Nigerian privacy/health obligations with qualified professionals. Test Paystack sandbox, Google authorization and Resend delivery. Perform access-control and penetration tests, recovery drill, accessible mobile QA and policy approval. Configure monitoring without medical payloads.

Read provider guidance: [Paystack signed webhooks](https://paystack.com/docs/v2/developer-tools/integration/webhooks), [Prisma custom extension migrations](https://www.prisma.io/docs/orm/v7/prisma-schema/postgresql-extensions). Current schema uses Prisma 6 conventions.

## Client review deployment — 2026-11-21

- Repository: https://github.com/Slowburn75/Kemville (main).
- Public review site: https://kemville.vercel.app
- Doctor: https://kemville.vercel.app/demo/doctor
- Admin: https://kemville.vercel.app/demo/admin
- Booking walkthrough: https://kemville.vercel.app/demo/consultation
- Vercel project: mohammedolamide1-4163s-projects/kemville.

Deployed directly using the authenticated Vercel CLI. GitHub integration connection failed; pushes currently do not trigger automatic Vercel deployment. Until the Vercel GitHub App repository access is connected, publish updates with `vercel deploy --prod --scope mohammedolamide1-4163s-projects` from this linked project. `.vercel` metadata remains local and ignored.

This is a publicly accessible presentation demo with fictional data. No database or provider secrets were configured. No migration or seed was run remotely. Live services remain disabled; real clinical use still requires the production gates above.
