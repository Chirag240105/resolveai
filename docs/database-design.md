# Database design

## Models and relationships

- **Business** is the tenant root and stores business identity and a default ISO-style three-character currency code.
- **User** belongs to exactly one business, has a globally unique normalized email, a password hash, and OWNER/ADMIN/MEMBER role.
- **Invoice** belongs to a business and stores server-calculated subtotal, tax, discount, and total as `DECIMAL(12,2)`. Invoice numbers are unique within a business.
- **InvoiceItem** belongs to an invoice and stores quantity (`DECIMAL(10,3)`), unit price, tax rate, and a line total calculated by the backend.
- **InvoiceDocument** belongs to a business and uploader and can be attached to one invoice after review. It stores a random storage path, original display name, MIME type, size, SHA-256, and validated extraction suggestion JSON.
- **Payment** belongs to an invoice and stores the PayPal order/capture IDs, expected amount/currency, refund amount, approval URL, status, and capture time. Provider identifiers are unique.
- **Invoice.reviewFlags** stores duplicate and document amount inconsistency flags for explicit human review before approval.
- **WebhookEvent** uniquely stores PayPal event IDs for deduplication and stores a minimized payload, processing state, and reconciliation errors.
- **AuditLog** belongs to a business and optionally references a user and invoice. Metadata is limited to operational identifiers and amounts; credentials are never written.

## Constraints, indexes, and isolation

Business deletion is restricted while dependent records exist; invoice items cascade with their invoice, while payment and audit history prevent accidental financial record deletion. Invoice numbers are unique per business. List paths are indexed by business, status, payment status, due date, or creation time. PayPal order, capture, and webhook event IDs have unique indexes.

Tenant ownership is enforced in service/repository queries, not inferred from client-supplied IDs. Authenticated business IDs come from a signed JWT. The PostgreSQL schema does not yet use row-level security; if direct SQL access by application roles is introduced, add database policies and test them separately. PayPal order and capture POST calls use deterministic provider request IDs, and active checkout orders are reused.

## Financial precision

Prisma Decimal maps to PostgreSQL numeric columns. Input is limited to explicit decimal precision and the supported `DECIMAL(12,2)` maximum. Calculations use integer cents, thousandths of a quantity, and basis points for tax; each line's base and tax are rounded to cents before aggregation. Invoice discount is applied after line tax. PayPal captures are compared to both stored amount and currency before a payment is marked paid.
