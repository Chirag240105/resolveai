# Engineering decisions

## Monolith with modular boundaries

Use one Express API and Prisma client for the MVP. Separate modules and integration adapters provide clear ownership without introducing microservices, queues, or extra operational state before load requires them.

## Prisma 7 PostgreSQL adapter

Keep Prisma 7.10.1 and use the supported `@prisma/adapter-pg` driver adapter. Prisma config owns `DATABASE_URL`; schema describes provider/models. Migrations are committed and CI applies them to disposable PostgreSQL.

## Financial arithmetic

Accept explicit decimal precision and use BigInt minor units for calculation, then persist PostgreSQL Decimal. Avoid JavaScript floating-point totals and model-generated arithmetic. Line-level tax is rounded to cents before invoice aggregation. The invoice-level discount is applied after summed line tax; tax/legal rules vary by jurisdiction, so this is an explicit MVP rule rather than jurisdictional tax advice.

## Payments and webhooks

Use PayPal Orders v2 REST endpoints rather than adding a wrapper SDK. Keep OAuth tokens in memory with early refresh, use stable request IDs, and use PayPal's webhook verification API. Persist event deduplication and financial updates atomically. A queue is deferred until asynchronous processing is needed.

## AI scope

Use the official `@google/genai` SDK. Extraction is schema-validated and human-reviewed; the assistant receives read-only context with no financial tools. AI provider model names are configurable so stable model versions can be changed without source edits.

## Storage and deployment

Use local private disk in the single-instance MVP because no storage service was selected. Keep names random and files non-public. Production should move to private object storage and use a separate migration release job rather than API startup migration.
