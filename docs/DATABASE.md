# Database operations

Prisma 6 uses pooled DATABASE_URL at runtime and DIRECT_URL for migration operations. The initial migration was generated from the schema, with reviewed SQL additions for btree_gist and a reservation exclusion constraint. Schema validation does not prove that the migration executes successfully on Neon.

## Apply safely
1. Create a development Neon branch and direct/pooled URLs.
2. Back up/branch production before changes. Review SQL and privileges for extensions.
3. Run `npm run db:generate`, `npm run db:migrate` on development.
4. Run PostgreSQL integration/race tests (still to implement). Check overlapping holds fail and adjacent intervals succeed. Confirm concurrent successful-payment handling is idempotent.
5. Promote reviewed migrations through staging, then a deliberate release job. Never run reset or db push on production.

Prices are integer kobo. Seed is development-only and refuses production. Seed does not reactivate an administrator-disabled promotion or service on repeat runs.

## Reservation contract
Exclusion constraint uses doctor UUID and half-open timestamptz range, WHERE NOT released. Expiry cannot appear in a stable index predicate. Expire unconverted holds explicitly inside reservation transactions. Confirmed appointments must keep the original hold protected. Current schema does not yet enforce every cross-row appointment/hold invariant: orchestration, trigger hardening and real concurrency tests remain release blockers.

## Recovery
Enable Neon point-in-time restore suitable for the selected plan. Agree RPO/RTO; restrict backup access. Exercise recovery into an isolated branch, validate counts, referential integrity and encrypted sample decryption using a secured matching key version. Record results. Never export real patient records into developer environments. Key loss makes encrypted health information unrecoverable; key backup and database backup need separate access controls.
