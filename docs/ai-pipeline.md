# AI pipeline

## Invoice document extraction

The upload route accepts one PDF or image up to 10 MB, checks MIME and file signatures, computes SHA-256, stores under a random server-generated name, and deduplicates within the business. Gemini receives file bytes as inline content plus a prompt that treats document content as untrusted instructions. The SDK requests JSON output, then Zod validates the returned shape before it is saved.

Extraction output is candidate data only. The API does not trust extracted quantities, prices, tax, or totals. A user must review and submit confirmed invoice fields; the invoice module validates decimal precision and calculates all totals using deterministic integer arithmetic. Duplicate detection and anomaly warnings are server-side rules, not model decisions.

## Financial assistant

The assistant retrieves only the caller's business aggregates and up to 100 latest invoice summaries. It sends that bounded JSON context to Gemini and asks for explanations without action tools. The response is not used to mutate the database, create PayPal orders, approve invoices, or capture payments. Missing information should be called out rather than invented.

## Reliability and limits

Provider failures are logged without file contents, credentials, or raw prompt payloads. Extracted output is retained as JSON for human review. There is no OCR confidence score, alternate-provider fallback, background retry, or human feedback model yet. Do not treat AI extraction as accounting advice or as the source of truth for a recorded invoice.
