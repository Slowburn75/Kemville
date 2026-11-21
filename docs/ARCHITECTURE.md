# Architecture

## Implemented
- Next.js App Router public pages, responsive editorial design, tailored Radix Slot button primitive (shadcn pattern), Lucide icons, consultation exploration and honest disabled booking state.
- PostgreSQL Prisma schema with UUIDs, timestamptz, normalized identity/profile, prices/promotions, appointment/intake, payments, delivery, outbox and audit entities.
- Node account endpoints: adult registration, scrypt password hashing, email verification, login, reset and logout. Single-use token consumption occurs transactionally, reset revokes sessions. Database-backed per-action/account throttling.
- Patient overview queries only the authenticated patient's appointments; no sample records.
- Health-data AES-256-GCM helpers bind encrypted content to record context.
- Paystack test initialization, Resend send, Calendar Meet creation and WhatsApp link adapters. Google requires feature and privacy flags. No orchestration routes claim completion.

## Intended flow, not yet wired
Availability rules + exceptions -> reservation transaction -> versioned intake -> server-price snapshot -> Paystack initialization -> signed webhook -> idempotent confirmation or late-payment exception -> durable outbox -> delivery/notification. Browser redirects never prove payment.

The reservation ledger is booking_holds. Converted holds retain exclusion protection for the entire appointment. Future writes must reserve appointment duration plus buffer, expire only unconverted holds and preserve confirmed reservations. Cancellation and rescheduling must mutate ledger and appointment atomically with audit events. PostgreSQL race tests are mandatory before release.

## Boundaries
UI modules never decide authorization, payable amount or payment success. Patient access is ownership-scoped. Clinical access must require assigned doctor and MFA. Non-clinical admin never receives intake. Privileged authentication currently fails closed because MFA is unfinished.

## Assets
Homepage uses an Unsplash stock consultation photograph as illustration, not an identified Kemville clinician. Google Fonts supplies Instrument Serif and Manrope; self-host and review third-party requests before production.
