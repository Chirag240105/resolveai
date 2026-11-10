# Engineering and learning notes

## Foundation

- ESM TypeScript uses NodeNext imports with `.js` suffixes in source imports so compiled output resolves correctly.
- Express middleware order matters: raw PayPal webhook parsing comes before JSON parsing; request logging, security headers, CORS, and rate limiting run before feature routers.
- Zod validates environment values and API inputs at runtime. TypeScript types alone do not validate network data.
- Prisma 7 reads its database URL from `apps/api/prisma.config.ts` and the runtime Prisma client receives the PostgreSQL `pg` adapter.

## Auth and tenant boundaries

- Registration creates the tenant business and its owner in one database transaction so partial accounts cannot exist.
- Passwords are bcrypt hashes; bearer JWT claims carry user ID, business ID, and role. Mutating routes require OWNER/ADMIN.
- Repositories query with the authenticated business ID. An unguessable UUID is not an authorization check.

## Invoice accounting

- Invoice totals are calculated from line items on the server. Quantity is represented in thousandths, tax in basis points, and money in cents as BigInt integers; this avoids binary floating-point drift.
- PostgreSQL Decimal columns preserve monetary amounts. PayPal amount and currency are compared to the stored invoice/payment before setting PAID.
- Duplicate and extraction inconsistency signals are review flags. Approval requires explicit acknowledgement when flags exist. The operator remains responsible for the decision.

## Documents and AI

- Multer buffers one bounded file in memory. The API checks magic bytes, hashes it, and writes it under a random private name; user filenames are metadata only.
- Gemini receives the document as untrusted content. JSON output is schema-validated, and document values remain suggestions. The invoice endpoint recalculates every amount.
- The assistant gets only business-scoped aggregates and recent invoice summaries and has no database write or payment tools.

## PayPal and webhooks

- OAuth tokens are cached in memory until shortly before expiry. REST calls have timeouts, generic external errors, and deterministic PayPal request IDs.
- The API creates orders only for backend-approved invoices. The buyer return endpoint can capture only a previously stored PayPal order; PayPal must accept the capture.
- Webhook signatures are checked through PayPal before an event is persisted. A unique provider event ID and one database transaction make redelivery safe.
- Webhook amount mismatches, unknown payments, and refund mismatches remain flagged for reconciliation. Partial refunds are tracked rather than marking the full invoice refunded.

## Limits to remember

- The MVP handles verified webhook processing synchronously. It has no reconciliation worker, public document download route, malware scanner, object storage, password recovery, or deployment secret manager.
- CI integration tests use a disposable PostgreSQL service. Local integration tests require Docker/PostgreSQL and `RUN_DB_INTEGRATION=true`.
