# ResolveAI Technical Architecture Specification

## 1. Executive Summary
ResolveAI is an enterprise-grade dispute intelligence and evidence automation platform designed specifically for merchants using PayPal. It bridges real-time PayPal Dispute & Order APIs with Google Gemini's structured inference models, enforcing a strict human-in-the-loop review barrier before any submission to PayPal.

## 2. System Architecture

```mermaid
flowchart TD
    subgraph Client["Client Layer (Next.js 15)"]
        Dashboard["Merchant Dashboard (KPIs & Metrics)"]
        Grid["AG Grid High-Density Disputes Table"]
        Workspace["Case Workspace & Citation Editor"]
        AuditUI["Immutable Audit Trail View"]
    end

    subgraph Gateway["API Gateway / Security (Express 5)"]
        AuthMiddleware["JWT Verification & RBAC"]
        RateLimit["Rate Limiting (Strict Auth + General)"]
        SecurityHeaders["Helmet Security Middleware"]
        Validator["Zod Request Validation"]
    end

    subgraph CoreServices["Domain Services Layer"]
        DisputeService["Dispute Lifecycle Service"]
        WebhookService["HMAC Verification & Deduplication"]
        AuditService["Audit Ledger Service"]
        PayPalClient["PayPal REST SDK Client"]
    end

    subgraph AIEngine["AI Intelligence Layer"]
        GeminiClient["Google GenAI (Gemini 2.5 Flash)"]
        PromptEngine["System Prompts & Seller Protection Rules"]
        ToolRegistry["DB Lookup Function Tools"]
        ZodValidator["Strict Output Validation"]
    end

    subgraph Storage["Data Tier (PostgreSQL 16)"]
        PrismaORM["Prisma Client with Transaction Support"]
        Tables[("Disputes, Transactions, Evidences, WebhookEvents, Audits")]
    end

    Client --> Gateway
    Gateway --> CoreServices
    CoreServices --> Storage
    DisputeService --> AIEngine
    AIEngine --> ToolRegistry --> Storage
    CoreServices --> PayPalClient --> ExternalPP[PayPal Sandbox]
```

## 3. Dispute Lifecycle State Machine

1. **DISPUTE_RECEIVED / SYNCED**:
   - Webhook arrives from PayPal (`CUSTOMER.DISPUTE.CREATED`).
   - Signature verified via PayPal REST endpoint.
   - Deduped via unique constraint on `paypalEventId`.
   - Linked to existing captured transaction in DB.

2. **INVESTIGATION & ANALYSIS**:
   - Merchant or worker triggers Gemini pipeline.
   - AI classifies reason, extracts evidence items, calculates completeness score (0-100), and flags weaknesses.
   - AI drafts response citing real transaction and tracking records.
   - Status: `PENDING_REVIEW`.

3. **MERCHANT REVIEW & APPROVAL (Hard Gate)**:
   - Merchant inspects completeness meter, verifies citations, and edits draft.
   - Merchant clicks **Approve**.
   - Status updates to `APPROVED`.
   - AI cannot proceed to submission without this step.

4. **SUBMISSION & OUTCOME**:
   - Backend calls PayPal Disputes API (`/provide-evidence`).
   - Status updates to `SUBMITTED` then `UNDER_REVIEW`.
   - Subsequent `CUSTOMER.DISPUTE.RESOLVED` webhook records outcome.
