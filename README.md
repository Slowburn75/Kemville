# Kemville

Next.js App Router healthcare platform foundation. This is **not a production-ready clinical service**. No actual patient data is seeded or required for development.

## Run

Requires Node 20.19+ and npm.

```sh
npm ci
cp .env.example .env
npm run dev
```

Public pages and consultation exploration work without credentials. Account requests return unavailable until configured. Registration additionally requires explicit policy/operational approval. Never enable this flag on a public deployment before review.

```sh
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

## Database

Configure Neon pooled `DATABASE_URL` and direct `DIRECT_URL`. Review migration SQL, then run `npm run db:migrate` as a separate release action. Development-only seed: `ALLOW_DEV_SEED=true npm run db:seed`. Services seed disabled; promotion seeds active. No clinician or patient records are fabricated.

See [progress](docs/PROGRESS.md), [architecture](docs/ARCHITECTURE.md), [database](docs/DATABASE.md), [deployment](docs/DEPLOYMENT.md) and [security](docs/SECURITY.md). Booking/payment/delivery orchestration and privileged dashboards remain unfinished. Provider adapters are real HTTP clients, not evidence of successful live integration.

## Client presentation demo

Open `/demo/consultation` (also linked from `/book`). No database or provider configuration is required. Use the prefilled fictional patient, acknowledge demo mode, select a service/time, review the sample 12-question intake, then preview payment. Show the failure/retry path or simulate success. Confirmation opens a sample patient dashboard; switch to Doctor view for intake review and outcome controls. Patient view supports sample rescheduling/cancellation. Reset demo returns to the beginning; reloading clears state.

This is an isolated browser-only demonstration, not production booking/authentication/payment functionality. No card, meeting, WhatsApp message, email, patient record or real appointment is created. Use fictional information only. In-person selection stays disabled while clinic details are unverified.

### Doctor and admin presentation workspaces

- `/demo/doctor`: fictional appointment search/status filtering, weekly schedule, assigned sample intake, per-patient note drafts, video/chat/telephone handoff previews, completion/no-show controls, and working-day/time/duration editing with time-order validation.
- `/demo/admin`: non-clinical overview, sample service activation/pricing, launch promotion toggle, late-payment review/refund-queue simulation, notification retry simulation, and an in-memory audit trail. Physical activation is disabled until a verified clinic exists.

Switch workspaces using the role links above each demo. Every workspace is an independent presentation fixture, not shared production state: admin price changes do not change public prices or the booking demo. No MFA is simulated as production authentication, and these routes do not grant access to real staff accounts. Refresh or Reset demo restores defaults. Use fictional notes only.
