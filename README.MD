# 🛡️ ResolveAI

**AI-Powered Dispute Investigation & Evidence Intelligence Platform for Online Merchants**

> **Turning Payment Disputes into Evidence-Driven Decisions.**  
> Built for the **PayPal AI Hackathon 2026** on Devpost.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.3-000000?logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.10-2D3748?logo=prisma)](https://www.prisma.io/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?logo=google-gemini)](https://ai.google.dev/)
[![PayPal Sandbox](https://img.shields.io/badge/PayPal-Sandbox_API-003087?logo=paypal)](https://developer.paypal.com/)
[![AG Grid](https://img.shields.io/badge/AG_Grid-v33_Quartz-008080?logo=ag-grid)](https://www.ag-grid.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)
[![Vitest](https://img.shields.io/badge/Tests-Vitest_Passing-6E9F18?logo=vitest)](https://vitest.dev/)

---

## 📑 Table of Contents

1. [Executive Summary](#-executive-summary)
2. [The Real-World Problem](#-the-real-world-problem)
3. [The ResolveAI Solution](#-the-resolveai-solution)
4. [How ResolveAI Works](#-how-resolveai-works)
5. [Product Walkthrough: Your First Dispute](#-product-walkthrough-your-first-dispute)
6. [Complete Feature Deep Dive](#-complete-feature-deep-dive)
   - [6.1 Dispute Management & Console](#61-dispute-management--interactive-console)
   - [6.2 Cryptographic Webhook Ingestion](#62-cryptographic-webhook-ingestion)
   - [6.3 AI-Powered Investigation & Grounded Extraction](#63-ai-powered-investigation--grounded-extraction)
   - [6.4 Deterministic Evidence Completeness Scoring](#64-deterministic-evidence-completeness-scoring)
   - [6.5 Citation-Backed Contestation Drafts](#65-citation-backed-contestation-drafts)
   - [6.6 Strict Human-in-the-Loop Approval Gate](#66-strict-human-in-the-loop-approval-gate)
   - [6.7 PayPal Integration & Verification](#67-paypal-sandbox-integration)
   - [6.8 Immutable Compliance Audit Trail](#68-immutable-compliance-audit-trail)
   - [6.9 Authentication & Role-Based Access Control](#69-authentication--role-based-access-control-rbac)
7. [System Architecture](#-system-architecture)
8. [Data Flow & Core Workflows](#-data-flow--core-workflows)
9. [Technology Stack](#-technology-stack)
10. [Project Directory Structure](#-project-directory-structure)
11. [Getting Started (Local Development)](#-getting-started-local-development)
12. [Production Deployment Guide](#-production-deployment-guide)
13. [Complete API Specification](#-complete-api-specification)
14. [Security, Reliability & Trust](#-security-reliability--trust)
15. [Why ResolveAI Matters Beyond Technology (Social Impact)](#-why-resolveai-matters-beyond-technology)
16. [Limitations & Future Roadmap](#-limitations--future-roadmap)
17. [Automated Testing Suite](#-automated-testing-suite)
18. [Contributing Guide](#-contributing-guide)
19. [Project Governance & License](#-project-governance--license)
20. [Frequently Asked Questions (FAQ)](#-frequently-asked-questions-faq)

---

## ⚡ Executive Summary

**ResolveAI** is an intelligent dispute investigation and evidence marshaling platform engineered for online merchants. When a buyer challenges an order via PayPal (claiming Item Not Received, Unauthorized Transaction, or Item Not as Described), merchants enter a race against the clock. They must retrieve transaction records, extract proof of fulfillment, evaluate compliance against PayPal's **Seller Protection** criteria, compose formal legal rebuttals, and submit them before strict deadlines expire.

ResolveAI bridges the gap between chaotic back-office records and payment network standards. Powered by **Google Gemini 2.5 Flash** with **Zod-enforced structured outputs**, ResolveAI analyzes dispute contexts, extracts factual delivery and transaction metadata, computes an objective **Evidence Completeness Score (0–100%)**, and prepares a citation-backed contestation draft.

### Core Architectural Axiom: Human-in-the-Loop Governance
> **Hard Rule:** AI never submits a dispute rebuttal autonomously. ResolveAI equips merchants with intelligence, completeness scores, and grounded drafts. The human operator retains total authority to review, modify, approve, or reject. The backend API strictly rejects submission attempts unless preceded by an explicit, authenticated human approval signature.

---

## 🔍 The Real-World Problem

Every year, digital commerce merchants lose tens of billions of dollars to payment disputes, chargebacks, and friendly fraud. While buyer protection programs are vital for consumer trust, the administrative burden of resolving disputes falls disproportionately on merchants.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             THE MERCHANT DISPUTE CRISIS                          │
├───────────────────────────────┬──────────────────────────────┬───────────────────┤
│ Fragmented Systems            │ Strict Deadlines             │ Asymmetric Rules  │
│ Order data in Shopify/Woo,    │ Merchants have 7–10 days to  │ Missing carrier   │
│ payments in PayPal, tracking  │ respond. Late or incomplete  │ delivery scan or  │
│ in ShipStation, support in    │ submissions mean automatic   │ address mismatch  │
│ Zendesk.                      │ loss of funds & dispute fee. │ voids protection. │
└───────────────────────────────┴──────────────────────────────┴───────────────────┘
```

### Perspectives Across the Commerce Ecosystem

1. **Small & Independent Business Owners**: Often operate without legal, finance, or compliance departments. A sudden wave of disputed transactions can freeze cash flow, damage seller reputation, and impose \$15–\$30 dispute penalties per case.
2. **Growing E-Commerce Operations**: Face manual operational gridlock. As sales volume scales, support teams spend hundreds of hours copying tracking numbers, checking postal delivery scans, and writing repetitious response emails.
3. **Dispute Operations Teams**: Lack standardized rubrics. Different agents draft inconsistent responses with varying evidence quality, leading to unpredictable dispute win rates.
4. **Legitimate Customers**: When disputes are handled poorly or with hostility, customers experience friction, prolonged waiting times, and eroded brand trust.
5. **Payment Platforms & Networks**: Need objective, verified, structured evidence (carrier tracking, GPS delivery scans, item descriptions) rather than emotional rhetoric, in order to adjudicate claims fairly under network rules.

---

## 💡 The ResolveAI Solution

ResolveAI transforms dispute resolution from a reactive administrative scramble into a structured, evidence-grounded workflow.

```
Traditional Manual Process:
Dispute Email arrives ──> Hunt across 4 portals ──> Guess what PayPal needs ──> Free-text email ──> Forfeit on technicality

ResolveAI Intelligent Workflow:
Webhook Ingestion ──> Factual Evidence Retrieval ──> Completeness Scoring (0-100) ──> Source-Cited Draft ──> Merchant Review & One-Click Submit
```

### Direct Comparison: Traditional vs. ResolveAI

| Workflow Stage | Traditional Merchant Process | ResolveAI Platform |
|---|---|---|
| **Dispute Discovery** | Periodic manual dashboard checks or delayed email alerts | Real-time webhook ingestion with signature verification |
| **Data Collection** | Manually logging into carrier portals, store backends, and CRM | Automated retrieval of transaction, capture, and tracking data |
| **Evidence Readiness** | Guesswork; uncertain if evidence satisfies Seller Protection | Deterministic 0–100% completeness score with missing gap alerts |
| **Contestation Drafting** | Handwritten, emotionally charged, inconsistent emails | Structured, professional rebuttals with strict source citations |
| **Hallucination Risk** | High if using generic AI chatbots without grounding | Zero: every argument must bind to verified transaction/carrier IDs |
| **Decision Authority** | Prone to human forgetfulness or erratic automation | Enforced Human-in-the-Loop gate with immutable audit records |
| **Submission** | Manual file upload across external PayPal dispute pages | Integrated PayPal API submission executed upon human sign-off |
| **Compliance History** | Scattered screenshots and untracked emails | Immutable ledger recording every event, timestamp, and IP |

> **Disclaimer:** ResolveAI does not guarantee dispute win rates or claim to prevent chargebacks. It provides tools to organize evidence, analyze policy alignment, and ensure structured contestations are submitted accurately before deadlines.

---

## 🔄 How ResolveAI Works

The end-to-end lifecycle of a dispute within ResolveAI:

```mermaid
flowchart TD
    A([1. External Dispute Filed]) -->|PayPal Webhook Event| B[2. Webhook Ingestion & Signature Verification]
    B -->|Check paypalEventId| C{Duplicate Event?}
    C -->|Yes| D[Discard as Idempotent Duplicate]
    C -->|No| E[3. Synchronize Dispute & Order Metadata]
    E --> F[4. Marshal Available Transaction & Shipping Evidence]
    F --> G[5. AI Investigation Pipeline]
    G --> H[6. Gemini 2.5 Structured Output & Zod Validation]
    H --> I[7. Deterministic Evidence Completeness Scoring]
    I --> J[8. Source-Cited Contestation Draft Generation]
    J --> K[9. Present in Merchant Disputes Console]
    K --> L{10. Merchant Review}
    L -->|Needs Edit| M[Merchant Edits Response Draft / Uploads Evidence]
    M --> L
    L -->|Reject| N[Mark Dispute Rejected / Accept Buyer Claim]
    L -->|Explicit Approval| O[11. Human Approval Sign-off Recorded]
    O --> P[12. Submit Evidence via PayPal Disputes API]
    P --> Q[13. Record Immutable Audit Log Entry]
    Q --> R([14. Dispute Status Updated to UNDER_REVIEW])
```

### Stage-by-Stage Breakdown

| Stage | What Happens? | Why Is It Needed? | Responsible System | Input / Output |
|---|---|---|---|---|
| **1. Ingestion** | PayPal sends `CUSTOMER.DISPUTE.CREATED` | Instantly captures dispute before response clock runs down | Express Webhook Controller | Input: Webhook JSON<br>Output: `WebhookEvent` record |
| **2. Verification** | Cryptographic check via PayPal Verification endpoint | Prevents spoofed disputes and man-in-the-middle attacks | `PayPalClient.verifyWebhookSignature` | Input: Headers & Body<br>Output: `boolean` verification |
| **3. Deduplication** | Checks database for existing `paypalEventId` | Prevents race conditions and double-processing of webhook retries | Prisma DB Constraint | Input: `paypalEventId`<br>Output: Unique or Rejected |
| **4. Synchronization** | Fetches dispute details, amount, reason, response deadline | Binds case to internal merchant workspace | `DisputeService.syncFromPayPal` | Input: PayPal Dispute ID<br>Output: `Dispute` model |
| **5. Evidence Marshaling** | Correlates PayPal Order ID with carrier tracking & addresses | Gathers objective fulfillment facts | `tools.ts` & DB Query | Input: Order/Capture ID<br>Output: Fulfillment facts |
| **6. AI Analysis** | Gemini evaluates claim against PayPal Seller Protection | Classifies severity, extracts facts, identifies policy gaps | `DisputeAiPipeline` | Input: Context Prompt<br>Output: `FullAnalysis` object |
| **7. Schema Validation** | Zod validates AI JSON against strict structural schema | Eliminates malformed AI outputs and hallucinations | `schemas.ts` | Input: Raw LLM JSON<br>Output: Validated TypeScript object |
| **8. Completeness Scoring** | Calculates 0–100% score based on verified carrier milestones | Gives merchant instant gauge of evidence viability | Rule Engine / Pipeline | Input: Evidence presence<br>Output: Score + gap breakdown |
| **9. Draft Generation** | Prepares professional rebuttal citing specific tracking numbers | Saves hours of drafting while maintaining strict accuracy | AI Engine + Prompts | Input: Evidence citations<br>Output: Structured Rebuttal Draft |
| **10. Human Review** | Merchant inspects findings in AG Grid / Dossier view | Keeps human in total control of commercial decisions | Web Dashboard UI | Input: Merchant Interaction<br>Output: Edit or Approval choice |
| **11. Approval Gate** | Merchant clicks "Approve Contestation" | Cryptographically and logically unlocks submission ability | `disputeController.approveResponse` | Input: Merchant Auth JWT<br>Output: `approvalStatus = APPROVED` |
| **12. API Submission** | Backend delivers evidence & notes to PayPal Dispute API | Submits response to payment network | `PayPalClient.provideEvidence` | Input: Verified Evidence<br>Output: PayPal 204 Success |
| **13. Audit Logging** | Action, user ID, IP, and timestamp stored in ledger | Provides tamper-resistant compliance trail | `AuditService.log` | Input: Action metadata<br>Output: `AuditLog` row |

---

## 📖 Product Walkthrough: Your First Dispute

*The following scenario illustrates how a merchant resolves a real-world case using ResolveAI.*

### Scenario: The "Item Not Received" Claim
> **Merchant**: Apex Electronics Lab (Online retailer selling audio hardware)  
> **Buyer**: Sarah Jenkins  
> **Order**: Sony WH-1000XM5 Headphones (\$249.99 USD)  
> **Fulfillment**: Shipped via USPS Priority Mail with tracking `9400111899562537829102`  
> **Dispute**: Buyer opens dispute stating *"Package never arrived, requesting full refund."*

```
Step 1: The Alert Arrives
Within seconds of the dispute being opened, PayPal's webhook triggers ResolveAI. The merchant's dashboard updates immediately with a red alert: "Dispute Case PP-D-10291-INR: Action Required within 6 days."

Step 2: Automated Evidence Marshaling
Before the merchant even opens the case, ResolveAI connects the PayPal Dispute ID to the original checkout capture, customer email, shipping address, and carrier tracking record.

Step 3: AI Investigation & Gap Analysis
ResolveAI's pipeline inspects the facts against PayPal's Seller Protection rules:
  ✓ Carrier Name: USPS (Present)
  ✓ Tracking Number: 9400111899562537829102 (Present)
  ✓ Delivery Status: DELIVERED (Confirmed on 2026-11-08 at 14:22:10)
  ✓ Recipient Zip Code: Matches buyer's shipping address (San Jose, CA 95112)
  ✗ Signature Confirmation: Not required (Amount $249.99 is below PayPal's $750 threshold)

Step 4: Objective Completeness Score: 92/100
The dashboard displays a high-confidence green indicator:
  "Evidence Completeness: 92% — Meets core requirements for PayPal Seller Protection for Item Not Received claims."

Step 5: The Source-Backed Rebuttal Draft
ResolveAI compiles a formal response where every factual statement has a direct citation:
  [Citation 1: USPS Tracking #9400111899562537829102]
  "The order was dispatched on 2026-11-05 via USPS Priority Mail. Carrier tracking logs confirm successful delivery to the buyer's specified address on 2026-11-08 at 2:22 PM."
  [Citation 2: PayPal Capture CAP-9901-INR]
  "Payment was authorized and captured under transaction TX-9901-INR with seller protection eligibility confirmed."

Step 6: Human Decision & One-Click Submission
The merchant reviews the draft in the Disputes Console, checks the carrier timestamps, adds a brief note: "Customer support ticket #8912 also confirmed dispatch notification was read." The merchant clicks "Approve & Submit". The backend checks authorization, delivers the evidence directly to PayPal, and records the event in the audit trail.
```

---

## 🛠️ Complete Feature Deep Dive

### 6.1 Dispute Management & Interactive Console
- **Dual View Interface**:
  - **Grid Terminal**: Powered by **AG Grid v33 Community**, providing multi-column sorting, case filtering, status renderers, and responsive pagination.
  - **Case Dossiers**: High-density card view for rapid visual triage of dispute reasons, amounts, and readiness scores.
- **Real-Time Search**: Instant filtering across Dispute IDs (e.g. `PP-D-10291`), PayPal Order IDs, and customer names.
- **Deadline Monitoring**: Automated calculation of remaining response time with visual urgency tags for disputes expiring within 48 hours.

### 6.2 Cryptographic Webhook Ingestion
- **HMAC-SHA256 Signature Validation**: Every payload sent to `/api/paypal/webhooks` is validated against PayPal's public certificates via PayPal's `/v1/notifications/verify-webhook-signature` API.
- **Idempotency & Deduplication**: The `WebhookEvent` table enforces a `@unique` constraint on `paypalEventId`. Duplicate events are flagged with status `DUPLICATE` and safely discarded without double-processing.
- **Supported Event Types**:
  - `CUSTOMER.DISPUTE.CREATED`: Initializes new dispute record and triggers auto-investigation.
  - `CUSTOMER.DISPUTE.RESOLVED`: Updates outcome status (`RESOLVED_BUYER_FAVOUR`, `RESOLVED_SELLER_FAVOUR`).
  - `CUSTOMER.DISPUTE.UPDATED`: Synchronizes newly attached messages or status transitions.
  - `PAYMENT.CAPTURE.COMPLETED`: Stores transaction metadata for future evidence matching.

### 6.3 AI-Powered Investigation & Grounded Extraction
- **Model**: Powered by Google Gemini (`gemini-2.5-flash`) via the modern `@google/genai` SDK.
- **Algorithmic Fallback Engine**: If a Gemini API key is absent (offline mode, local development, or demo testing), ResolveAI automatically falls back to an internal deterministic rule-based analysis engine, guaranteeing the platform remains fully functional without external API dependency.
- **Investigative Function Calling Tools (`tools.ts`)**:
  - `getTransactionDetails`: Fetches buyer details, shipping address, and line items from database.
  - `getShippingInfo`: Retrieves tracking numbers, carrier names, and transit milestones.
  - `getOrderHistory`: Inspects prior order records for the customer to prove ongoing commercial relationship.
- **Strict Boundary Rules**: The AI prompt strictly forbids hallucinating carrier scans, inventing timestamps, or using abusive rhetoric. All statements must bind to structured fields.

### 6.4 Deterministic Evidence Completeness Scoring
The Evidence Completeness Score (0–100) measures how thoroughly the merchant's marshaled records satisfy PayPal's published Seller Protection policies:
- **Item Not Received (INR)**:
  - Valid Tracking Number (+40 pts)
  - Carrier Delivery Scan (+25 pts)
  - Address Match between transaction and shipping label (+20 pts)
  - Timely Dispatch within seller handling time (+15 pts)
  - Signature Confirmation (+10 pts bonus for orders exceeding \$750 USD)
- **Unauthorized Transaction**:
  - Proof of shipment to the address provided on the Transaction Details page
  - Timestamp correlation between PayPal payment confirmation and order fulfillment

### 6.5 Citation-Backed Contestation Drafts
To prevent LLM hallucinations, every draft generated by ResolveAI is broken down into structured sections containing:
- `heading`: Section purpose (e.g., "Fulfillment & Carrier Verification").
- `content`: Factual assertion.
- `citations`: An array of explicit source references containing `source` (e.g., `TrackingRecord`), `reference` (e.g., `USPS-9400111899562537829102`), and `detail` (e.g., `Delivered to front porch`).
- Sections lacking verifiable citations are flagged during Zod schema validation.

### 6.6 Strict Human-in-the-Loop Approval Gate
ResolveAI enforces a non-negotiable software constraint:
- `approvalStatus` starts at `PENDING_REVIEW`.
- Even if an AI analysis produces a 100% completeness score and a flawless draft, the backend `/api/disputes/:id/submit` endpoint **will reject execution with HTTP 400** if `approvalStatus !== 'APPROVED'`.
- Only an authenticated user with role `MERCHANT` or `ADMIN` can transition the status to `APPROVED` via `POST /api/disputes/:id/approve`.
- The merchant can edit the response draft at any time before granting approval.

### 6.7 PayPal Sandbox Integration
- **OAuth 2.0**: Manages client credentials, token caching, and automatic renewal.
- **Orders V2 API**: Creates and captures sandbox test orders.
- **Disputes API (`/v1/customer/disputes`)**:
  - Lists live merchant disputes.
  - Fetches case details, buyer messages, and dispute history.
  - Submits contestation evidence via `/provide-evidence`.
  - Accepts claims when merchant chooses not to contest via `/accept-claim`.

### 6.8 Immutable Compliance Audit Trail
Every significant operational action is recorded in the `AuditLog` database model:
- `action`: Specific enum event (e.g., `DISPUTE_RECEIVED`, `ANALYSIS_STARTED`, `APPROVAL_GRANTED`, `SUBMISSION_COMPLETED`).
- `userId`: Identifier of the operating merchant or system worker.
- `disputeId`: Associated dispute case.
- `ipAddress` & `userAgent`: Network origin of the request.
- `details`: JSON payload snapshot containing before/after states or error diagnostics.

### 6.9 Authentication & Role-Based Access Control (RBAC)
- **Authentication**: Stateless JSON Web Tokens (JWT) signed with HMAC-SHA256, carrying merchant ID and role claims.
- **Password Security**: Salted hashing with `bcryptjs` (cost factor 10).
- **Supported Roles**:
  - `MERCHANT`: Full access to manage disputes, edit drafts, attach evidence, approve, and submit.
  - `REVIEWER`: Read-only access to inspect disputes, view completeness scores, and suggest draft edits.
  - `ADMIN`: Global workspace management, merchant profile administration, and audit inspection.

---

## 🏗️ System Architecture

ResolveAI follows a clean, decoupled monorepo architecture separating the user interface, API gateway, business domain services, database persistence, and external service adapters.

```mermaid
flowchart TD
    subgraph ClientLayer["Frontend Application (Next.js 15 + React 19)"]
        UI["App Router Pages (/dashboard/*)"]
        Components["Glassmorphism UI Components"]
        AGGrid["AG Grid v33 Quartz Table"]
        ThreeCanvas["Three.js Holographic Core"]
        AuthContext["Stateless JWT Auth Provider"]
    end

    subgraph GatewayLayer["Backend API (Express 5 + TypeScript)"]
        CORS["CORS & Helmet Security Headers"]
        RateLimit["Express Rate Limiters"]
        AuthMW["JWT Auth & Role Verification"]
        ZodMW["Zod Request Body & Query Validation"]
        Proxy["Next.js Route Proxy (/api/*)"]
    end

    subgraph ServiceLayer["Business Logic & Service Layer"]
        DisputeSvc["DisputeService"]
        WebhookSvc["WebhookService"]
        AuditSvc["AuditService"]
        PayPalClient["PayPal REST Client"]
        
        subgraph AIEngine["AI Intelligence Pipeline"]
            Pipeline["DisputeAiPipeline"]
            GeminiClient["Google GenAI SDK (Gemini 2.5 Flash)"]
            RuleEngine["Deterministic Rule-Based Fallback"]
            ZodSchemas["Zod Output Schema Validator"]
            Tools["Database Lookup Function Tools"]
        end
    end

    subgraph DataLayer["Persistence Layer"]
        Prisma["Prisma ORM 7.10"]
        Postgres[("PostgreSQL 16 Database")]
    end

    subgraph ExternalServices["External Cloud APIs"]
        PayPalAPI["PayPal Sandbox REST API"]
        GoogleAI["Google Gemini API"]
    end

    UI --> Proxy --> CORS
    CORS --> RateLimit --> AuthMW --> ZodMW
    ZodMW --> DisputeSvc
    ZodMW --> WebhookSvc
    ZodMW --> AuditSvc

    DisputeSvc --> Pipeline
    Pipeline --> GeminiClient --> GoogleAI
    Pipeline --> RuleEngine
    Pipeline --> Tools --> Prisma
    Pipeline --> ZodSchemas

    WebhookSvc --> PayPalClient
    DisputeSvc --> PayPalClient
    PayPalClient --> PayPalAPI

    DisputeSvc --> Prisma
    WebhookSvc --> Prisma
    AuditSvc --> Prisma
    Prisma --> Postgres
```

### Detailed Request & Data Flow

```mermaid
flowchart LR
    Browser["Merchant Browser"] -->|1. HTTP POST /api/disputes/:id/approve| ExpressRouter["Express API Router"]
    ExpressRouter -->|2. Validate Bearer Token| AuthMiddleware["Auth Middleware"]
    AuthMiddleware -->|3. Route to Controller| Controller["Dispute Controller"]
    Controller -->|4. Request Approval| DisputeService["Dispute Service"]
    DisputeService -->|5. Verify Existence & State| Prisma["Prisma Client"]
    Prisma -->|6. Check Status| PostgreSQL[("PostgreSQL")]
    DisputeService -->|7. Update approvalStatus = APPROVED| PostgreSQL
    DisputeService -->|8. Log APPROVAL_GRANTED| AuditService["Audit Service"]
    AuditService -->|9. Write Audit Record| PostgreSQL
    DisputeService -->|10. Return Updated Dispute| Browser
```

---

## 🔁 Data Flow & Core Workflows

### 1. User Authentication Workflow
```mermaid
sequenceDiagram
    autonumber
    actor Merchant as Merchant User
    participant Web as Next.js Web App
    participant API as Express API (/api/auth)
    participant DB as PostgreSQL (Prisma)

    Merchant->>Web: Enter Email & Password
    Web->>API: POST /api/auth/login { email, password }
    API->>DB: Query User by Email
    DB-->>API: Return User + passwordHash
    API->>API: bcrypt.compare(password, passwordHash)
    alt Invalid Password
        API-->>Web: 401 Unauthorized
        Web-->>Merchant: Display error alert
    else Valid Credentials
        API->>API: Generate JWT (expires in 12h)
        API->>DB: Log AuditAction.USER_LOGIN
        API-->>Web: 200 OK { token, user }
        Web->>Web: Store token in localStorage
        Web-->>Merchant: Redirect to /dashboard
    end
```

### 2. PayPal Webhook Ingestion & Signature Verification
```mermaid
sequenceDiagram
    autonumber
    participant PP as PayPal Sandbox
    participant API as Express API (/api/paypal/webhooks)
    participant Client as PayPal REST Client
    participant DB as PostgreSQL (Prisma)

    PP->>API: POST Webhook Event (dispute.created)
    API->>Client: verifyWebhookSignature(headers, body)
    Client->>PP: POST /v1/notifications/verify-webhook-signature
    PP-->>Client: { verification_status: "SUCCESS" }
    alt Verification Failed
        Client-->>API: false
        API-->>PP: 400 Bad Request (Invalid signature)
    else Verification Succeeded
        Client-->>API: true
        API->>DB: Check WebhookEvent where paypalEventId = id
        alt Duplicate Event
            DB-->>API: Existing record found
            API-->>PP: 200 OK (Duplicate ignored)
        else Fresh Event
            API->>DB: Insert WebhookEvent (status: PROCESSING)
            API->>DB: Upsert Dispute & Transaction records
            API->>DB: Update WebhookEvent (status: PROCESSED)
            API-->>PP: 200 OK (Event accepted)
        end
    end
```

### 3. Dispute Synchronization
```mermaid
sequenceDiagram
    autonumber
    actor Merchant as Merchant
    participant Web as Web Dashboard
    participant API as Dispute Controller
    participant Svc as Dispute Service
    participant PP as PayPal Disputes API
    participant DB as PostgreSQL

    Merchant->>Web: Clicks "Sync from PayPal"
    Web->>API: POST /api/disputes/:id/sync
    API->>Svc: syncFromPayPal(disputeId, merchantId)
    Svc->>PP: GET /v1/customer/disputes/:paypalDisputeId
    PP-->>Svc: Return dispute details & history
    Svc->>DB: Update Dispute with fresh status & due date
    Svc->>DB: Log AuditAction.DISPUTE_SYNCED
    Svc-->>API: Return synced dispute
    API-->>Web: 200 OK
    Web-->>Merchant: Updated dispute displayed
```

### 4. AI Investigation & Extraction
```mermaid
sequenceDiagram
    autonumber
    actor Merchant as Merchant
    participant API as Express API
    participant Pipe as DisputeAiPipeline
    participant DB as PostgreSQL
    participant AI as Gemini 2.5 Flash

    Merchant->>API: POST /api/disputes/:id/analyze
    API->>Pipe: runAnalysis(disputeId)
    Pipe->>DB: Fetch Dispute, Transaction, and Evidence
    DB-->>Pipe: Return case context records
    Pipe->>DB: Create AiAnalysis record (status: PROCESSING)
    alt Gemini API Key Available
        Pipe->>AI: generateContent(systemPrompt, caseContextPrompt)
        AI-->>Pipe: Return JSON text
        Pipe->>Pipe: FullAnalysisSchema.parse(JSON)
    else Fallback Engine
        Pipe->>Pipe: generateRuleBasedAnalysis(dispute)
    end
    Pipe->>DB: Update AiAnalysis (status: COMPLETED, scores, draft)
    Pipe->>DB: Auto-create DisputeEvidence items from extractions
    Pipe-->>API: Return FullAnalysis
    API-->>Merchant: 200 OK with Completeness Score & Draft
```

### 5. Evidence Completeness Evaluation
```mermaid
sequenceDiagram
    autonumber
    participant Pipe as AI Pipeline / Rule Engine
    participant Evid as Marshaled Evidence
    participant Rubric as Seller Protection Matrix

    Pipe->>Evid: Inspect carrier tracking, delivery scan, timestamps
    Pipe->>Rubric: Match claim type (e.g. ITEM_NOT_RECEIVED)
    alt Has Valid Tracking Number
        Pipe->>Pipe: Add 40 points
    end
    alt Has Confirmed Carrier Delivery Status
        Pipe->>Pipe: Add 25 points
    end
    alt Shipping Address Matches Transaction
        Pipe->>Pipe: Add 20 points
    end
    alt Order Dispatched within Handling Window
        Pipe->>Pipe: Add 15 points
    end
    Pipe->>Pipe: Calculate Final Score (0–100%)
    Pipe->>Pipe: Compile list of missing documents or gaps
```

### 6. Human Review & Explicit Approval Gate
```mermaid
sequenceDiagram
    autonumber
    actor Merchant as Merchant User
    participant Web as Web Dashboard
    participant API as Dispute Controller
    participant Svc as Dispute Service
    participant DB as PostgreSQL

    Merchant->>Web: Inspects Completeness Score (92%) & Response Draft
    Merchant->>Web: Modifies text in contestation draft editor
    Web->>API: PUT /api/disputes/:id/response { responseDraft }
    API->>DB: Save updated draft to Dispute record
    Merchant->>Web: Clicks "Approve Contestation"
    Web->>API: POST /api/disputes/:id/approve
    API->>Svc: approveResponse(disputeId, merchantId, userId)
    Svc->>DB: Update Dispute: approvalStatus = APPROVED, approvedBy = userId
    Svc->>DB: Log AuditAction.APPROVAL_GRANTED
    Svc-->>API: Success
    API-->>Web: 200 OK (Approval Recorded)
    Web-->>Merchant: Submit button is now active
```

### 7. PayPal Submission & State Transition
```mermaid
sequenceDiagram
    autonumber
    actor Merchant as Merchant User
    participant Web as Web Dashboard
    participant API as Dispute Controller
    participant Svc as Dispute Service
    participant Client as PayPal Client
    participant PP as PayPal Sandbox API
    participant DB as PostgreSQL

    Merchant->>Web: Clicks "Submit to PayPal"
    Web->>API: POST /api/disputes/:id/submit
    API->>Svc: submitToPayPal(disputeId, merchantId, userId)
    Svc->>DB: Query dispute approval status
    alt approvalStatus != APPROVED
        Svc-->>API: Throw AppError: "Submission blocked: Must be approved"
        API-->>Web: 400 Bad Request
        Web-->>Merchant: Error alert displayed
    else approvalStatus == APPROVED
        Svc->>DB: Log AuditAction.SUBMISSION_STARTED
        Svc->>Client: provideEvidence(paypalDisputeId, payload)
        Client->>PP: POST /v1/customer/disputes/:id/provide-evidence
        PP-->>Client: 204 No Content (Evidence Received)
        Svc->>DB: Update Dispute: approvalStatus = SUBMITTED, status = UNDER_REVIEW
        Svc->>DB: Log AuditAction.SUBMISSION_COMPLETED
        Svc-->>API: Return updated dispute
        API-->>Web: 200 OK
        Web-->>Merchant: Status badge transitions to "Submitted"
    end
```

### 8. Compliance Audit Trail Logging
```mermaid
sequenceDiagram
    autonumber
    participant Caller as Any Service / Controller
    participant Audit as AuditService
    participant DB as PostgreSQL (audit_logs table)

    Caller->>Audit: log(action, { userId, disputeId, details, ipAddress, userAgent })
    Audit->>DB: INSERT INTO audit_logs (id, user_id, dispute_id, action, details, ip_address, created_at)
    DB-->>Audit: Row persisted
    Audit-->>Caller: Void (non-blocking)
```

---

## 💻 Technology Stack

| Layer | Technology | Version | Purpose & Architectural Justification |
|---|---|---|---|
| **Frontend Framework** | Next.js | `15.1.7` | React 19 App Router providing server/client component separation, streaming, and API route proxies. |
| **UI Library** | React | `19.0.0` | Declarative component model for high-frequency state updates in dispute dashboards. |
| **Styling** | Tailwind CSS | `3.4.17` | Utility-first CSS engine implementing a 4-level glassmorphism design system with custom font tokens. |
| **Data Grid** | AG Grid React | `33.1.1` | High-performance enterprise table for handling multi-column sorting, filtering, and custom cell rendering. |
| **3D Graphics** | Three.js | `0.187.0` | WebGL 3D rendering for the interactive Holographic Evidence Core visualization. |
| **Animations** | Framer Motion & GSAP | `12.4.7` / `3.15.1` | Micro-interactions, timeline transitions, and glass card elevation effects. |
| **Icons** | Lucide React | `0.475.0` | Consistent, accessible iconography across all workspace interfaces. |
| **Backend Framework** | Express | `5.3.0` | Fast, minimalist HTTP server running modern NodeNext ES module standards. |
| **Runtime** | Node.js | `22.x` | Modern JavaScript runtime supporting top-level await, native fetch, and ES module resolution. |
| **Language** | TypeScript | `5.9.2` | End-to-end static typing across database models, API payloads, and frontend state. |
| **Database** | PostgreSQL | `16` | ACID-compliant relational storage for financial transactions, evidence records, and audit logs. |
| **ORM** | Prisma | `7.10.1` | Type-safe database client using `@prisma/adapter-pg` driver adapters and schema migrations. |
| **AI Intelligence** | Google Gemini | `2.5 Flash` | State-of-the-art multimodal LLM via `@google/genai` executing structured dispute extraction and drafting. |
| **Schema Validation** | Zod | `4.6.7` | Runtime type validation for API request bodies, query params, and AI structured outputs. |
| **Payment API** | PayPal REST APIs | `v1 / v2` | Sandbox integration for OAuth 2.0, Orders V2, Disputes V1, and Webhook verification. |
| **Security** | Helmet & Rate Limit | `8.3.0` / `8.7.3` | HTTP header hardening and brute-force prevention on authentication routes. |
| **Logging** | Pino | `10.3.1` | Ultra-fast JSON structured logger for high-throughput operational monitoring. |
| **Testing** | Vitest & Supertest | `5.1.0` / `7.3.2` | Lightning-fast test runner validating unit schemas, integration gates, and e2e pipelines. |
| **Containers** | Docker & Compose | Multi-stage | Reproducible local and production container environments. |

---

## 📁 Project Directory Structure

```
ResolveAI/
├── apps/
│   ├── api/                          # Express 5 Backend REST Application
│   │   ├── prisma/
│   │   │   ├── schema.prisma         # Prisma ORM schema (8 models, 8 enums)
│   │   │   ├── seed.ts               # Database seeder with realistic test disputes
│   │   │   └── migrations/           # Versioned SQL migration files
│   │   ├── src/
│   │   │   ├── server.ts             # Server entry point, middleware setup, health checks
│   │   │   ├── config/
│   │   │   │   └── env.ts            # Environment variable validation via Zod
│   │   │   ├── controllers/          # HTTP request handlers
│   │   │   │   ├── auth.controller.ts        # Register, login, session handlers
│   │   │   │   ├── dispute.controller.ts     # CRUD, sync, analyze, approve, submit
│   │   │   │   ├── analysis.controller.ts    # AI analysis queries
│   │   │   │   ├── audit.controller.ts       # Audit log query endpoints
│   │   │   │   ├── merchant.controller.ts    # Dashboard KPIs & business profile
│   │   │   │   └── paypal.controller.ts      # Webhook receiver & order management
│   │   │   ├── routes/               # Express route declarations
│   │   │   │   ├── index.ts          # Root API router aggregator
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── dispute.routes.ts
│   │   │   │   ├── analysis.routes.ts
│   │   │   │   ├── audit.routes.ts
│   │   │   │   ├── merchant.routes.ts
│   │   │   │   └── paypal.routes.ts
│   │   │   ├── services/             # Core business logic layer
│   │   │   │   ├── dispute.service.ts        # Dispute lifecycle & state machine
│   │   │   │   ├── webhook.service.ts        # HMAC verification & deduplication
│   │   │   │   └── audit.service.ts          # Immutable audit logging
│   │   │   ├── middleware/           # Interceptors & guards
│   │   │   │   ├── auth.ts           # JWT authentication & RBAC guards
│   │   │   │   ├── rateLimiter.ts    # Express rate limiters for auth & API
│   │   │   │   ├── validate.ts       # Generic Zod request schema validator
│   │   │   │   └── errorHandler.ts   # Centralized error mapping & responses
│   │   │   ├── ai/                   # AI Investigation Engine
│   │   │   │   ├── pipeline.ts       # Gemini pipeline + rule-based fallback
│   │   │   │   ├── prompts.ts        # System prompts & Seller Protection rubrics
│   │   │   │   ├── schemas.ts        # Zod schemas for AI structured outputs
│   │   │   │   └── tools.ts          # Database lookup function tools
│   │   │   ├── paypal/               # Payment provider client
│   │   │   │   └── client.ts         # PayPal OAuth, Orders, Disputes, Webhooks
│   │   │   ├── types/
│   │   │   │   └── index.ts          # TypeScript type declarations
│   │   │   └── utils/
│   │   │       ├── db.ts             # Prisma client singleton
│   │   │       ├── errors.ts         # AppError classes & async handler wrapper
│   │   │       └── logger.ts         # Pino structured logging instance
│   │   └── tsconfig.json             # Backend TypeScript configuration
│   │
│   └── web/                          # Next.js 15 Frontend Web Application
│       ├── src/
│       │   ├── app/                  # App Router hierarchy
│       │   │   ├── (dashboard)/      # Authenticated merchant console layout
│       │   │   │   └── dashboard/
│       │   │   │       ├── page.tsx            # KPI Overview & activity feed
│       │   │   │       ├── disputes/
│       │   │   │       │   ├── page.tsx        # Disputes Console (AG Grid / Cards)
│       │   │   │       │   └── [id]/page.tsx   # Case Investigation Workspace
│       │   │   │       ├── evidence/page.tsx   # Evidence Center & file manager
│       │   │   │       ├── investigations/page.tsx # AI investigation runs
│       │   │   │       ├── transactions/page.tsx   # Transaction & capture history
│       │   │   │       ├── audit/page.tsx      # Immutable audit trail ledger
│       │   │   │       ├── webhooks/page.tsx   # Live webhook stream & events
│       │   │   │       └── settings/page.tsx   # Store profile & PayPal credentials
│       │   │   ├── (marketing)/      # Public landing & informational pages
│       │   │   │   ├── page.tsx                # Hero landing page with 3D Core
│       │   │   │   ├── features/page.tsx
│       │   │   │   ├── how-it-works/page.tsx
│       │   │   │   ├── solutions/page.tsx
│       │   │   │   ├── security/page.tsx
│       │   │   │   └── resources/page.tsx
│       │   │   ├── login/page.tsx        # Merchant login page
│       │   │   ├── register/page.tsx     # Merchant registration page
│       │   │   ├── layout.tsx            # Root HTML layout with Google Fonts
│       │   │   └── globals.css           # Glassmorphism design tokens & styles
│       │   ├── components/           # Reusable component library
│       │   │   ├── ui/                   # Atoms: Button, Card, Badge, Input, Tabs
│       │   │   ├── layout/               # Shell: Navbar, Sidebar, TopBar, Footer
│       │   │   ├── disputes/             # Domain: DisputeGrid, StatusChip, Timeline
│       │   │   ├── backgrounds/          # Canvas: GridBackground, AmbientGlow
│       │   │   └── three/                # 3D: HeroScene (Holographic Evidence Core)
│       │   ├── hooks/
│       │   │   └── useAuth.ts            # Client auth hook (JWT & user state)
│       │   └── lib/
│       │       ├── api.ts                # Typed frontend API client (fetch)
│       │       ├── types.ts              # Frontend domain interfaces
│       │       └── mock-data.ts          # Offline fallback mock data
│       ├── next.config.ts            # Next.js configuration & legacy redirects
│       ├── tailwind.config.ts        # Tailwind theme tokens (Sora, JetBrains Mono)
│       └── tsconfig.json             # Frontend TypeScript configuration
│
├── tests/                            # Automated Testing Suite
│   ├── unit/
│   │   ├── ai-schemas.test.ts        # Zod AI structured output validation tests
│   │   └── webhook-dedup.test.ts     # Webhook payload & deduplication tests
│   ├── integration/
│   │   └── dispute-approval.test.ts  # Human-in-the-Loop backend gate tests
│   └── e2e/
│       └── happy-path.test.ts        # End-to-end investigation pipeline test
│
├── docker-compose.yml                # Multi-container orchestration (db, api, web)
├── Dockerfile                        # Multi-stage Docker build for Backend API
├── .env.example                      # Template for environment configuration
├── package.json                      # Root workspace scripts & dependencies
└── README.MD                         # Project documentation
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- **Node.js**: `v22.x` or later
- **npm**: `v10.x` or later
- **Docker & Docker Compose**: Installed and running (for PostgreSQL)
- *(Optional)* **Google Gemini API Key**: [Get one here](https://aistudio.google.com/) *(platform falls back to deterministic rule engine if omitted)*
- *(Optional)* **PayPal Developer Account**: Sandbox Client ID & Secret from [developer.paypal.com](https://developer.paypal.com)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/ResolveAI.git
cd ResolveAI
```

---

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env` in the project root:
```bash
cp .env.example .env
```

Review and adjust `.env` values as needed:
```env
# Application
NODE_ENV=development
PORT=4000
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000

# PostgreSQL Database (matches docker-compose.yml)
POSTGRES_USER=resolveai
POSTGRES_PASSWORD=local_dev_password_123
POSTGRES_DB=resolveai
DATABASE_URL=postgresql://resolveai:local_dev_password_123@localhost:5432/resolveai?schema=public

# Authentication (32+ characters)
JWT_SECRET=super_secret_jwt_key_at_least_32_characters_long
JWT_EXPIRES_IN=12h

# Google Gemini AI (Optional: falls back to rule engine if default value kept)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

# PayPal Developer Sandbox (Optional: works in demo mode if unset)
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_paypal_sandbox_client_secret
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id

# Storage
UPLOAD_DIR=./uploads
DEMO_MODE=true
```

---

### Step 3: Start with Docker Compose (Recommended)
You can launch the entire stack (PostgreSQL 16, Backend API, Next.js Web) in one command:
```bash
docker compose up --build
```
Once healthy:
- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:4000`
- **API Health**: `http://localhost:4000/health`

---

### Step 4: Or Run Manually (Local Host Development)

#### 1. Start PostgreSQL
```bash
docker compose up db -d
```

#### 2. Install Dependencies
```bash
npm install
cd apps/web && npm install && cd ../..
```

#### 3. Run Database Migrations & Seed Data
```bash
npm run db:deploy
npm run db:seed
```

#### 4. Start the Backend API
```bash
npm run dev
# Backend starts at http://localhost:4000
```

#### 5. Start the Frontend App (in a separate terminal)
```bash
cd apps/web
npm run dev
# Frontend starts at http://localhost:3000
```

---

### 🔑 Pre-Seeded Demo Credentials

ResolveAI comes pre-seeded with realistic dispute cases, transactions, and user accounts:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Merchant** | `merchant@resolveai.test` | `DemoPassword123!` | Full workspace access, case review, approval, submission |
| **Admin** | `admin@resolveai.test` | `AdminPassword123!` | Global administration, audit inspection, profile controls |

---

## 🌐 Production Deployment Guide

ResolveAI is architected for clean cloud deployment:
- **Backend API + Database**: Hosted on [Render](https://render.com)
- **Frontend Application**: Hosted on [Vercel](https://vercel.com)

```mermaid
flowchart LR
    User([Merchant Browser]) -->|HTTPS| Vercel["Frontend on Vercel (Next.js)"]
    Vercel -->|Internal Proxy| RenderAPI["Backend on Render (Node.js/Express)"]
    RenderAPI --> RenderDB[("Render Managed PostgreSQL")]
    RenderAPI --> GeminiAPI["Google Gemini API"]
    RenderAPI --> PayPalAPI["PayPal Sandbox"]
    Cron["Keep-Alive Cron"] -->|Ping /health every 10 min| RenderAPI
```

### Part A: Deploy Database & Backend to Render

1. **Create PostgreSQL Database on Render**:
   - Go to [dashboard.render.com](https://dashboard.render.com) → **New** → **PostgreSQL**.
   - Name: `resolveai-db`.
   - Copy the **Internal Database URL** (for services within Render) or **External Database URL**.

2. **Create Web Service for Backend**:
   - Go to **New** → **Web Service** → Connect your GitHub repository.
   - **Root Directory**: Leave blank (root).
   - **Environment**: `Node`.
   - **Build Command**:
     ```bash
     npm ci && npm run db:generate && npm run build
     ```
   - **Start Command**:
     ```bash
     npm run db:deploy && npm run db:seed && npm start
     ```
   - **Environment Variables**:
     - `NODE_ENV`: `production`
     - `PORT`: `4000`
     - `DATABASE_URL`: *(Your Render PostgreSQL Database URL)*
     - `JWT_SECRET`: *(A random 32+ character secret)*
     - `JWT_EXPIRES_IN`: `12h`
     - `CORS_ORIGIN`: `https://your-frontend.vercel.app`
     - `GEMINI_API_KEY`: *(Your Google AI Studio Key)*
     - `PAYPAL_CLIENT_ID`: *(Your PayPal Sandbox Client ID)*
     - `PAYPAL_CLIENT_SECRET`: *(Your PayPal Sandbox Secret)*
     - `PAYPAL_BASE_URL`: `https://api-m.sandbox.paypal.com`

---

### Part B: Deploy Frontend to Vercel

1. **Import Project into Vercel**:
   - Go to [vercel.com](https://vercel.com) → **Add New** → **Project** → Select repository.
2. **Configure Settings**:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `apps/web` (Click *Edit* and select `apps/web`).
3. **Environment Variables**:
   - `INTERNAL_API_URL`: `https://your-render-service.onrender.com`
   - `NEXT_PUBLIC_API_URL`: `https://your-render-service.onrender.com`
4. **Deploy**: Click **Deploy**. Vercel will build and deploy the frontend.

---

### Part C: Keep-Alive Cron (Prevent Render Free Tier Sleep)
Render free-tier instances sleep after 15 minutes of inactivity. To keep your API warm 24/7:
1. Create a free account at [cron-job.org](https://cron-job.org).
2. Create a new cron job pointing to:
   ```
   https://your-render-api.onrender.com/health
   ```
3. Set execution schedule to **Every 10 minutes**.

---

## 📡 Complete API Specification

All protected routes require an HTTP Authorization header: `Authorization: Bearer <jwt_token>`.

### 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Auth | Purpose | Request Body | Response (200/201) |
|---|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public (Rate Limited) | Register new merchant user | `{ email, password, name, businessName? }` | `{ success: true, user: { id, email, name, role } }` |
| `POST` | `/api/auth/login` | Public (Rate Limited) | Authenticate user & get JWT | `{ email, password }` | `{ success: true, token, user }` |
| `GET` | `/api/auth/me` | Bearer Token | Get current user profile | None | `{ success: true, user }` |
| `POST` | `/api/auth/logout` | Bearer Token | Invalidate session | None | `{ success: true, message: "Logged out" }` |

---

### 2. Dispute Management Endpoints (`/api/disputes`)

| Method | Endpoint | Auth | Purpose | Query / Body Params | Response |
|---|---|---|---|---|---|
| `GET` | `/api/disputes` | Bearer | List disputes with search & filter | Query: `status?`, `search?`, `page?`, `limit?` | `{ success: true, items: Dispute[], pagination }` |
| `GET` | `/api/disputes/:id` | Bearer | Get full dispute details & analysis | Param: `id` | `{ success: true, dispute: Dispute }` |
| `POST` | `/api/disputes/:id/sync` | Bearer | Sync latest status from PayPal API | Param: `id` | `{ success: true, dispute: Dispute }` |
| `POST` | `/api/disputes/:id/analyze` | Bearer | Run AI investigation pipeline | Param: `id` | `{ success: true, analysis: FullAnalysis }` |
| `POST` | `/api/disputes/:id/evidence` | Bearer | Manually attach evidence record | Body: `{ evidenceType, title, description?, sourceReference? }` | `{ success: true, evidence: DisputeEvidence }` |
| `DELETE`| `/api/disputes/:id/evidence/:evidenceId` | Bearer | Remove attached evidence | Params: `id`, `evidenceId` | `{ success: true, message: "Removed" }` |
| `PUT` | `/api/disputes/:id/response` | Bearer | Update merchant contestation draft | Body: `{ responseDraft: object }` | `{ success: true, dispute }` |
| `POST` | `/api/disputes/:id/approve` | Bearer (Merchant/Admin) | Explicitly approve response draft | Param: `id` | `{ success: true, approvalStatus: "APPROVED" }` |
| `POST` | `/api/disputes/:id/reject` | Bearer (Merchant/Admin) | Reject draft / accept claim | Param: `id` | `{ success: true, approvalStatus: "REJECTED" }` |
| `POST` | `/api/disputes/:id/submit` | Bearer (Merchant/Admin) | Submit evidence to PayPal API | Param: `id` | `{ success: true, approvalStatus: "SUBMITTED" }` |

---

### 3. AI Analysis Endpoints (`/api/analyses`)

| Method | Endpoint | Auth | Purpose | Parameters | Response |
|---|---|---|---|---|---|
| `GET` | `/api/analyses/:disputeId` | Bearer | List all historical analysis runs | Param: `disputeId` | `{ success: true, analyses: AiAnalysis[] }` |
| `GET` | `/api/analyses/:disputeId/latest` | Bearer | Retrieve latest analysis & score | Param: `disputeId` | `{ success: true, analysis: AiAnalysis }` |

---

### 4. Merchant & Dashboard Endpoints (`/api/merchants`)

| Method | Endpoint | Auth | Purpose | Request Body | Response |
|---|---|---|---|---|---|
| `GET` | `/api/merchants/me` | Bearer | Fetch merchant business profile | None | `{ success: true, merchant }` |
| `PUT` | `/api/merchants/me` | Bearer | Update store name or email | `{ businessName?, businessEmail? }` | `{ success: true, merchant }` |
| `GET` | `/api/merchants/dashboard` | Bearer | Fetch overview KPIs & recent ledger | None | `{ success: true, kpis, recentActivity }` |

---

### 5. PayPal Integration & Webhooks (`/api/paypal`)

| Method | Endpoint | Auth | Purpose | Request Body | Response |
|---|---|---|---|---|---|
| `POST` | `/api/paypal/webhooks` | None (HMAC Verified) | Ingest PayPal webhook notifications | Raw PayPal Webhook JSON | `{ received: true, eventId, status }` |
| `POST` | `/api/paypal/connect` | Bearer | Link custom sandbox credentials | `{ clientId, clientSecret, paypalMerchantId? }` | `{ success: true, connection }` |
| `GET` | `/api/paypal/status` | Bearer | Check PayPal connection health | None | `{ success: true, isConnected, mode }` |
| `POST` | `/api/paypal/disconnect` | Bearer | Unlink merchant PayPal account | None | `{ success: true }` |
| `POST` | `/api/paypal/orders` | Bearer | Create test order in PayPal sandbox | `{ amount, currency?, description? }` | `{ success: true, order }` |
| `POST` | `/api/paypal/orders/:orderId/capture` | Bearer | Capture test order | Param: `orderId` | `{ success: true, capture }` |

---

### 6. Compliance Audit Endpoints (`/api/audit`)

| Method | Endpoint | Auth | Purpose | Query Params | Response |
|---|---|---|---|---|---|
| `GET` | `/api/audit` | Bearer | Paginated query of all audit events | Query: `page?`, `limit?`, `action?` | `{ success: true, logs: AuditLog[], pagination }` |
| `GET` | `/api/audit/dispute/:disputeId`| Bearer | Filter audit trail for specific dispute | Param: `disputeId` | `{ success: true, logs: AuditLog[] }` |

---

## 🔒 Security, Reliability & Trust

ResolveAI adheres to enterprise security principles designed to safeguard merchant assets, protect customer PII, and maintain data integrity:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           SECURITY DEFENSE ARCHITECTURE                          │
├──────────────────────────┬───────────────────────────┬───────────────────────────┤
│ Cryptographic Validation │ Backend Approval Gate     │ Zero-Hallucination Guard  │
│ Incoming PayPal webhooks │ Hard refusal to submit    │ Response claims must cite │
│ verified via PayPal cert │ unless explicit human     │ verified carrier/order    │
│ signatures.              │ approval is in database.  │ records in database.      │
├──────────────────────────┼───────────────────────────┼───────────────────────────┤
│ Idempotent Ingestion     │ Layered Access Control    │ Defense-in-Depth Headers  │
│ Unique constraints on    │ JWT authentication with   │ Helmet security headers,  │
│ event IDs eliminate      │ strict RBAC (Merchant,    │ rate limiting, and CORS   │
│ double-processing.       │ Reviewer, Admin).         │ origin whitelisting.      │
└──────────────────────────┴───────────────────────────┴───────────────────────────┘
```

- **Data Isolation**: Every database query scopes access strictly by `merchantId` derived from the verified JWT token. Merchants can never access or inspect disputes belonging to another merchant.
- **Fail-Safe Fallback**: If third-party AI services experience outages or rate limits, the internal rule-based engine immediately takes over, preventing business disruption.
- **Graceful Error Handling**: Database connection drops, malformed JSON inputs, and PayPal network errors are normalized via centralized `AppError` handlers without leaking internal stack traces.

---

## 🌍 Why ResolveAI Matters Beyond Technology

### 1. Supporting Small Businesses & Independent Creators
Small business owners often lack dedicated compliance departments, in-house legal counsel, or specialized dispute software. When disputes arise, they are forced to sacrifice product development, customer support, or marketing time to manually hunt for order receipts and carrier records. ResolveAI democratizes enterprise-grade dispute marshaling, giving independent entrepreneurs the same analytical power as multinational retailers.

### 2. Improving Digital-Commerce Trust & Dispute Transparency
Disputes frequently occur not from fraud, but from communication breakdowns—delayed shipping notifications, unshared tracking links, or unclear product descriptions. By surfacing factual delivery timelines, GPS confirmation scans, and communication logs, ResolveAI fosters transparency. When claims are substantiated with verified facts rather than hostile arguments, dispute adjudication becomes fair, objective, and constructive.

### 3. Demonstrating Responsible AI Governance
ResolveAI serves as an industry blueprint for how generative AI should be deployed in high-stakes financial environments:
- **No Autonomous Financial Action**: AI assists in marshaling facts and drafting responses, but is structurally barred from executing financial submissions.
- **Strict Citation Grounding**: Generic chatbots often hallucinate tracking dates or carrier names. ResolveAI forces every generated sentence to bind to an underlying database record.
- **Auditability**: Every AI inference, token count, processing duration, and model version is permanently recorded for compliance review.

### 4. Reducing Operational Drag & Economic Waste
Resolving a single dispute manually takes an average of 45 to 90 minutes of administrative labor across store portals, carrier lookup tools, and email software. ResolveAI reduces this operational cycle to under 3 minutes, freeing human talent to focus on customer satisfaction and product innovation.

---

## ⚠️ Limitations & Future Roadmap

To uphold total transparency, the current operational boundaries and future milestones of ResolveAI are documented below:

### Current Limitations
1. **PayPal Sandbox Focus**: The current integration is built against PayPal's Developer Sandbox environment. Production PayPal credentials require business approval and live webhook registration.
2. **Direct Carrier API Connectors**: Carrier tracking information is currently retrieved from order metadata and simulated carrier scans rather than live webhook sockets with FedEx, UPS, or DHL.
3. **Document OCR**: Attached PDF invoices and shipping label images are verified by filename, metadata, and database references; deep visual OCR for handwritten postal signatures is in development.

### Engineering Roadmap
- [ ] **Multi-Gateway Connectors**: Extend unified dispute ingestion to Stripe, Adyen, and Shopify Payments.
- [ ] **Direct Multi-Carrier Webhooks**: Direct API bindings to FedEx, UPS, USPS, and Royal Mail for real-time delivery GPS coordinates.
- [ ] **Visual Evidence OCR**: Automated parsing of signed postal slips, bill of lading documents, and package delivery photos using multimodal vision models.
- [ ] **Predictive Dispute Prevention**: Real-time order monitoring to flag high-risk transactions before disputes are opened.
- [ ] **Team Collaboration Workspace**: Multi-reviewer annotations, internal commentary, and approval routing for large enterprise teams.

---

## 🧪 Automated Testing Suite

ResolveAI maintains a rigorous automated testing suite using **Vitest** covering unit schemas, integration approval gates, and end-to-end pipeline execution:

```bash
# Run the complete automated test suite
npm test
```

```bash
# Run tests in continuous watch mode
npm run test:watch
```

### Verified Test Suites (4 Test Files, 9 Tests Passing)

```
✓ tests/unit/ai-schemas.test.ts (4 tests)
  ✓ AI Output Schema Runtime Validations
    ✓ validates a correct dispute classification object
    ✓ rejects an invalid severity or out-of-range confidence
    ✓ validates completeness score bounded between 0 and 100
    ✓ enforces citations in response draft sections to prevent hallucination

✓ tests/unit/webhook-dedup.test.ts (2 tests)
  ✓ Webhook Processing and Deduplication
    ✓ rejects webhooks without an event id or event_type
    ✓ correctly maps dispute creation payload structure

✓ tests/integration/dispute-approval.test.ts (2 tests)
  ✓ Dispute Human Approval Gate Enforcement
    ✓ strictly blocks submission if dispute response is not explicitly approved
    ✓ allows submission when status is APPROVED

✓ tests/e2e/happy-path.test.ts (1 test)
  ✓ End-to-End Happy Path Simulation
    ✓ runs rule-based analysis and produces compliant output schema

Test Files  4 passed (4)
Tests       9 passed (9)
```

---

## 🤝 Contributing Guide

We welcome contributions from the open-source community, payment engineers, and AI developers!

### Standard Development Workflow

1. **Fork the Repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ResolveAI.git
   cd ResolveAI
   ```
3. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/carrier-fedex-connector
   ```
4. **Make Your Changes** adhering to our code standards:
   - TypeScript strict mode must pass (`npm run typecheck`).
   - All automated tests must pass (`npm test`).
   - Keep business logic in `services/`, not in controllers.
5. **Commit Your Changes**:
   ```bash
   git commit -m "feat(carrier): add FedEx tracking verification service"
   ```
6. **Push to Your Branch**:
   ```bash
   git push origin feature/carrier-fedex-connector
   ```
7. **Open a Pull Request** against the `main` branch with a clear description of the problem solved.

---

## 📜 Project Governance & License

- **License**: This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for complete details. You are free to use, modify, and distribute this software for personal or commercial projects.
- **Third-Party Trademarks**: *PayPal*, *Google Gemini*, *AG Grid*, *PostgreSQL*, *Next.js*, and related trademarks belong to their respective owners. Mention in this repository does not imply formal endorsement.

---

## ❓ Frequently Asked Questions (FAQ)

#### Q1: What exactly does ResolveAI do?
**A:** ResolveAI is a dispute investigation platform for online merchants. When a customer challenges a charge on PayPal, ResolveAI automatically pulls the relevant order and delivery records, evaluates the evidence against PayPal's Seller Protection rules, calculates a completeness score (0–100%), drafts a formal rebuttal citing verified records, and allows the merchant to review and submit the response in one click.

#### Q2: Is ResolveAI limited strictly to PayPal?
**A:** The current implementation is designed natively around PayPal's Disputes, Orders, and Webhook APIs for the **PayPal AI Hackathon 2026**. However, the domain architecture (Dispute, Evidence, Analysis, Audit) is gateway-agnostic and designed to support Stripe, Adyen, and Shopify in future releases.

#### Q3: Does the AI submit dispute rebuttals automatically?
**A:** **No.** Autonomous submission is explicitly prohibited by software design. ResolveAI investigates, scores evidence, and prepares drafts, but a human merchant must review the case and click "Approve" before the backend will permit submission to PayPal.

#### Q4: What is the Evidence Completeness Score?
**A:** It is an objective 0–100% score that measures whether your gathered documentation meets PayPal's published Seller Protection standards (e.g., matching shipping addresses, valid carrier tracking, confirmed delivery status). It highlights missing items before you submit.

#### Q5: What happens if I don't have a Google Gemini API key?
**A:** ResolveAI includes an automatic rule-based algorithmic fallback engine. If a Gemini key is missing or invalid, the platform continues to run locally, generating accurate completeness scores and structured drafts without breaking.

#### Q6: How does ResolveAI prevent AI hallucinations?
**A:** Unlike generic AI chatbots, ResolveAI uses **Zod-enforced structured schemas** and citation validation. Every argument in a response draft must link to a specific database record (e.g., carrier name, tracking code, delivery timestamp). Sections lacking verifiable citations fail schema validation.

#### Q7: Can I run ResolveAI entirely on my local machine?
**A:** Yes. Running `docker compose up --build` launches PostgreSQL, the Express API, and the Next.js frontend with pre-seeded demo data, ready for immediate testing.

#### Q8: Is this platform production-ready?
**A:** ResolveAI is a fully functional MVP built for the PayPal AI Hackathon. It features real OAuth, live webhook validation, and database persistence, currently configured for PayPal's Developer Sandbox environment.

#### Q9: How are webhooks protected against spoofing?
**A:** Every webhook received from PayPal is cryptographically validated using PayPal's public certificates via the `/v1/notifications/verify-webhook-signature` API endpoint. Spoofed payloads are rejected immediately.

#### Q10: How does ResolveAI handle duplicate webhooks?
**A:** The database enforces a unique constraint on PayPal's event ID (`paypalEventId`). If PayPal retries an already processed webhook, the system detects the duplicate and returns HTTP 200 without reprocessing.

#### Q11: Can my team members have different permission levels?
**A:** Yes. ResolveAI includes Role-Based Access Control (RBAC) with three distinct roles: `MERCHANT` (full operational controls), `REVIEWER` (read-only case inspection and draft editing), and `ADMIN` (global workspace and profile settings).

#### Q12: How can I contribute or report bugs?
**A:** You can open an issue or pull request directly on our GitHub repository. Please review the [Contributing Guide](#-contributing-guide) for coding conventions and branch guidelines.

---

<p align="center">
  <b>ResolveAI — Turning Payment Disputes into Evidence-Driven Decisions.</b><br>
  Built with ❤️ for merchants, operations teams, and the digital commerce ecosystem.
</p>
