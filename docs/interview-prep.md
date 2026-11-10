# ResolveAI: Technical Architecture & Interview Prep

### 1. Why Express 5 over Fastify or NestJS?
*Answer:* Express 5 provides native Promise/async error handling without external wrapper overhead, has unmatched ecosystem stability, and eliminated unnecessary framework abstraction. For a 3-day hackathon sprint, developer velocity and battle-tested PayPal/Pino middleware compatibility outweigh micro-benchmark throughput.

### 2. Why is AI forbidden from auto-submitting dispute responses?
*Answer:* Financial dispute responses are legal representations made under merchant terms of service. An autonomous submission that hallucinates a delivery date or concedes liability would incur permanent financial forfeiture and fraud flags. The AI's role is strictly cognitive acceleration: indexing records, scoring strength, and drafting. Human sign-off is non-negotiable.

### 3. How do you prevent LLM hallucinations in dispute letters?
*Answer:* We implemented an explicit Citation Schema in Zod. The prompt instructs the model that every factual assertion in the response draft must contain a citations array referencing an existing database entity (`TransactionRecord`, `ShippingLabel`, `TrackingNumber`). If an element is missing from the database, the prompt explicitly demands flagging it as a weakness rather than inventing proof.

### 4. How is Webhook Security and Idempotency handled?
*Answer:* 
1. **Security**: We verify the incoming payload against PayPal's `/v1/notifications/verify-webhook-signature` API using the `PAYPAL-AUTH-ALGO`, `PAYPAL-CERT-URL`, and transmission signature headers.
2. **Idempotency**: Every PayPal event has a unique `id`. We store this in the `webhook_events` table with a unique DB index. Duplicate deliveries return an HTTP 200 acknowledgment immediately without re-triggering dispute state transitions.

### 5. How does the fallback "Demo Mode" work without compromising architecture?
*Answer:* If sandbox dispute creation permissions are restricted (which often requires PayPal partner/account-manager tier approval for buyer accounts), our system activates a seeded mode that still executes real OAuth 2.0 token caching and real sandbox order captures, while generating disputes matching exact PayPal REST schemas. Judges can verify live PayPal calls while enjoying a reliable end-to-end evaluation.

