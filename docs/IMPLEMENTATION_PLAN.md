# Kemville implementation plan

## Architecture
Next.js App Router modular monolith, strict TypeScript, Tailwind, Prisma/PostgreSQL (Neon pooled runtime and direct migrations). Node route handlers own authentication, authorization, booking and payment decisions. Sensitive intake encrypted using AES-256-GCM. No patient data in third-party delivery metadata.

## Phases and acceptance
1. Foundation: reproducible build, tokens, schema, migration, configuration. Check types, lint and build.
2. Public website: responsive editorial homepage and information routes; honest business placeholders.
3. Authentication: verified adult accounts, hashed passwords, revocable sessions, one-use verification/reset tokens, privileged MFA. Integration tests before release.
4. Booking: database-derived availability and shared exclusion-constrained reservations for holds and appointments. Test races on PostgreSQL, expiration, rescheduling and authorization.
5. Payments: server-priced checkout, signed idempotent webhooks, reconciliation and refund exceptions; never confirm from redirects.
6. Delivery: credential-gated Calendar/Meet, WhatsApp consent and telephone instructions; durable retries.
7. Dashboards: owner-scoped patient records, assigned doctor intake, non-clinical admin operations.
8. Release: PostgreSQL integration and mobile E2E, threat review, restore exercise, merchant sandbox and privacy review.

## Dependencies and risks
No business credentials, verified doctor identity, approved policy text, clinic schedule or database supplied. These block production activation. Never simulate successful external operations. No minor registration until guardian workflow exists. Health data requires professional Nigerian legal/privacy and clinical review. Database exclusion constraints require btree_gist. Provider retries must use durable outbox jobs.

## Delivery policy
Ship verified foundations first and explicitly track remaining phases. Do not call unfinished adapters or interface scaffolds operational. Production migrations are explicit operator actions; no startup migrations. No live payment activation by default.

## Scope expansion — user authorized
Include medical imaging, pharmaceutical purchasing, equipment/consumables procurement and medical tourism. Public directory and procurement-draft experience implemented. Next commerce phase requires verified product/SKU and supplier data, inventory/quotation/order models, server-priced payment flow, prescription-review access controls and fulfillment/refund policy. Tourism phase requires verified destinations/partners, assigned clinical case review, consent-based record sharing and follow-up plans. Do not describe unverified condition enquiry topics as available treatments.
