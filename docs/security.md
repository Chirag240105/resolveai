# Security controls and remaining work

- Passwords are bcrypt-hashed; login returns a generic credential error. JWTs require a 32-character secret and use bearer authorization.
- OWNER/ADMIN middleware controls mutations. Every invoice, payment, document, assistant, business, and audit query derives business scope from verified JWT claims.
- Helmet, configured CORS, bounded JSON bodies, a global rate limit, and stricter auth rate limiting protect HTTP entry points.
- Uploads are limited to 10 MB, one file at a time, PDF/PNG/JPEG/WebP, and signature-checked. Storage names are random and private; uploaded bytes are not served by a public static route.
- PayPal credentials are optional at startup but required by the adapter; webhook messages are signature-verified before persistence. Amount and currency are reconciled with backend values.
- AI responses are untrusted; the assistant has no write tools. Audit metadata excludes credentials and raw webhook headers/payload PII; persisted webhook payloads are minimized.
- Logger redaction covers authorization/cookie headers and common credential fields. Clients receive stable errors without stack traces.

Before production, use HTTPS, rotate and store keys in a secret manager, configure proxy trust deliberately, scan uploaded files, move uploads to private durable object storage, define retention/deletion policies, set database backups and least-privilege roles, add webhook reconciliation/alerting, and conduct an authorization/security review. Local filesystem storage is single-instance only.
