# PayPal payment flow

1. A business owner approves a draft invoice. Approval is stored and audited.
2. The owner asks the backend to create checkout. The backend reloads the invoice by both invoice ID and business ID, verifies APPROVED/unpaid state, and takes amount/currency only from stored records.
3. The PayPal adapter obtains/caches a sandbox OAuth token and creates a CAPTURE order with the invoice ID as provider reference. The backend stores the provider order ID and approval URL. An active local order is reused; PayPal request IDs make retries stable.
4. The buyer follows the approval URL. The configured frontend return page receives PayPal's order token and calls the stored-order capture endpoint. A local redirect alone never changes payment state.
5. The server captures the order. It compares PayPal's completed capture amount and currency to the stored payment before changing invoice status to PAID. Provider failures leave the invoice unpaid/pending.
6. PayPal posts events to `/api/v1/webhooks/paypal`. The route preserves the raw payload, asks PayPal's verification API to validate transmission headers and the registered webhook ID, then writes the event and updates payment/invoice/audit rows in one transaction.
7. The unique provider event ID makes redelivery a no-op. Completed capture events require amount/currency match. Refund events are matched to the capture/order and accumulated, with partial refunds tracked separately. Mismatches and unmatched payments remain in the webhook ledger for manual reconciliation; they never mark an invoice paid.

Configure a sandbox REST app and subscribe to `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.DENIED`, and `PAYMENT.CAPTURE.REFUNDED`. Put its client ID/secret and registered webhook ID in environment variables. For local delivery, use an HTTPS tunnel; PayPal cannot call localhost.

The MVP does not automatically retry reconciliation errors or query PayPal on a schedule. An operator must inspect stored event errors and reconcile with PayPal before any manual repair. Never patch an invoice to PAID based solely on a browser callback.
