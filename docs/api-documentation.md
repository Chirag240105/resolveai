# API reference (MVP)

Base path: `/api/v1`. JSON endpoints accept and return `application/json`. Authenticated routes require `Authorization: Bearer <JWT>`. User-owned resources are always scoped to the business in the token.

## Authentication and business

- `POST /auth/register` — `{name,email,password,business:{name,email?,phone?,address?,currency?}}`; creates the business and OWNER atomically; returns token, user, business.
- `POST /auth/login` — `{email,password}`; returns token, user, business.
- `GET /businesses/me` — authenticated business profile.

## Invoices

- `POST /invoices` — OWNER/ADMIN. Provide `invoiceNumber`, `customerName`, optional customer fields/dates/currency/discount/notes, and `items[]` with `description`, `quantity`, `unitPrice`, and optional `taxRate`. Numeric values accept decimal strings or JSON numbers within defined precision. Client totals are ignored/rejected. Optional `sourceDocumentId` associates a reviewed upload. Returns invoice and `potentialDuplicates`.
- The create/update response includes stored `reviewFlags`: duplicate candidates and extracted subtotal/tax/total inconsistencies. Anomaly rules are explainable comparisons; they do not auto-correct or block a human decision.
- `GET /invoices?take=25&cursor=<uuid>` — list business invoices.
- `GET /invoices/:id` — invoice details and payments; cross-business IDs return 404.
- `PUT /invoices/:id` — OWNER/ADMIN. Replace all draft invoice fields/items; only unpaid DRAFT records can be edited.
- `POST /invoices/:id/approve` — OWNER/ADMIN. Approves a non-empty positive-total draft. If the invoice has duplicate or document inconsistency flags, send `{ "acknowledgeWarnings": true }` after review.
- `POST /invoices/:id/void` — OWNER/ADMIN. Paid invoices cannot be voided.

## Documents and AI

- `POST /documents` — authenticated multipart form with one `file` field (PDF, PNG, JPEG, WebP; maximum 10 MB). Persists the file and returns `extractionStatus` plus candidate `extractionData` when Gemini is configured. An extraction failure leaves the upload recorded and returns HTTP 202 so it can be reviewed or retried manually.
- `GET /documents` — list business-owned uploads and extraction suggestions.
- `POST /assistant/ask` — `{question}`. Returns a read-only answer based on aggregates and up to 100 latest invoices. Gemini has no action tools.

Extraction is never accepted as a financial calculation. The client must let a person review the candidate, then submit confirmed values to `POST /invoices`; the backend validates and calculates totals again.

## PayPal and audit

- `POST /payments/invoices/:invoiceId/paypal-order` — OWNER/ADMIN; only approved positive invoices are payable. Returns the stored payment and PayPal approval URL.
- `POST /payments/checkout/:orderId/capture` — buyer return endpoint; the server captures only a previously stored order. PayPal must accept the buyer's approval before capture.
- `POST /webhooks/paypal` — public provider route; requires PayPal transmission headers, uses PayPal's verification endpoint, stores a unique event, and reconciles matching capture IDs, amount, and currency.
- `GET /audit?take=50&cursor=<uuid>` — authenticated, business-scoped audit events.

`GET /health` is a liveness check; `GET /ready` checks PostgreSQL connectivity. A frontend redirect is never evidence of successful payment; use the API response and verified webhook state.

## Example invoice

```json
{
  "invoiceNumber": "INV-2026-001",
  "customerName": "Example Customer",
  "customerEmail": "billing@example.test",
  "dueDate": "2026-12-01",
  "items": [
    { "description": "Design work", "quantity": "2", "unitPrice": "125.00", "taxRate": "0" }
  ]
}
```

Validation errors return `{ "error": { "code", "message", "details?" } }`. Unexpected errors do not expose stack traces or provider payloads.
