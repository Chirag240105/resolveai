'use client';

import React from 'react';
import Link from 'next/link';
import { GridBackground } from '@/components/backgrounds/GridBackground';
import { AmbientGlow } from '@/components/backgrounds/AmbientGlow';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ShieldCheck,
  Lock,
  Key,
  CheckCircle2,
  FileCheck,
  UserCheck,
  Layers,
  ArrowRight,
  AlertTriangle,
  Server,
  Database,
  Cpu,
} from 'lucide-react';

export default function SecurityPage() {
  const securityPillars = [
    {
      icon: Lock,
      title: 'Cryptographic Webhook Signature Verification',
      badge: 'HMAC-SHA256',
      desc: 'Every incoming PayPal webhook is validated against PayPal’s verification endpoint using transmission ID, transmission signature, cert URL, and auth algorithm headers. Unverified or forged payloads are rejected at the edge before DB write.',
    },
    {
      icon: Database,
      title: 'Idempotency & Event Deduplication',
      badge: 'Database Constraint',
      desc: 'PayPal event IDs are tracked in the webhook_events table with a unique PostgreSQL index. Duplicate webhook deliveries receive an immediate HTTP 200 acknowledgment without re-triggering analysis or state transitions.',
    },
    {
      icon: UserCheck,
      title: 'Backend-Enforced Human Approval Gate',
      badge: 'Hard Design Rule',
      desc: 'AI is architecturally forbidden from submitting evidence autonomously. The backend explicitly verifies dispute.approvalStatus === "APPROVED" in database transactions before calling PayPal APIs. Direct submission calls without approval fail with HTTP 400.',
    },
    {
      icon: FileCheck,
      title: 'Zod Runtime Schema Validation',
      badge: 'Type Safety',
      desc: 'LLMs can generate malformed JSON. Every AI inference response is parsed and validated at runtime using strict Zod schemas (ClassificationSchema, CompletenessScoreSchema, ResponseDraftSchema). Invalid outputs are caught before persisting.',
    },
    {
      icon: Cpu,
      title: 'Anti-Hallucination Citation Grounding',
      badge: 'Zero Fabrication',
      desc: 'Draft contestation sections require an array of explicit source citations binding claims to verified transaction IDs or carrier tracking numbers. If proof is missing, the system flags it as a case weakness rather than inventing records.',
    },
    {
      icon: Key,
      title: 'Merchant-Scoped Authorization & RBAC',
      badge: 'Tenant Isolation',
      desc: 'All dispute, transaction, and evidence queries strictly enforce WHERE merchant_id = :authenticatedMerchantId. RBAC middleware segregates MERCHANT, REVIEWER, and ADMIN permissions, blocking horizontal privilege escalation.',
    },
    {
      icon: Layers,
      title: 'Immutable Compliance Audit Ledger',
      badge: 'Audit Trail',
      desc: 'Every mutation (webhook receipt, AI analysis completion, evidence attachment, merchant approval, and PayPal submission) writes an append-only row into the audit_logs table capturing actor, action, timestamp, and metadata.',
    },
    {
      icon: Server,
      title: 'Zero Secrets in Frontend Bundles',
      badge: 'Secret Isolation',
      desc: 'PayPal client secrets, webhook IDs, and Google Gemini API keys exist strictly on the backend Express environment. Frontend code only communicates with our typed API client, never exposing gateway credentials.',
    },
  ];

  return (
    <div className="relative overflow-hidden pt-32 pb-24">
      <GridBackground variant="marketing" />
      <AmbientGlow position="top" color="dual" intensity="medium" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-24">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="success" glow>
            <ShieldCheck className="w-3.5 h-3.5 text-[#35D39A]" /> Production Security Model
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#F7F5FF] tracking-tight">
            AI Assistance. Human Authority.
          </h1>
          <p className="text-base text-[#AAA6C5] leading-relaxed">
            Financial disputes carry legal and financial obligations. ResolveAI is designed with strict boundaries: AI assists with investigation, but humans hold sole authority to execute.
          </p>
        </div>

        {/* Visual Security Architecture Flow */}
        <Card glow className="p-8 md:p-10 bg-[#0B0B18]/90 border-[rgba(150,63,255,0.35)]">
          <h3 className="text-lg font-bold text-[#F7F5FF] mb-2 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#963FFF]" /> Security Boundary Architecture
          </h3>
          <p className="text-xs text-[#AAA6C5] mb-8">
            How requests and dispute data flow safely across untrusted web, cognitive AI, and verified PayPal APIs:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
            {/* Box 1 */}
            <div className="p-4 rounded-xl bg-[#111126] border border-[rgba(83,108,255,0.3)] space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#536CFF] block">1. Ingress Security</span>
              <div className="font-semibold text-[#F7F5FF]">PayPal Webhooks</div>
              <p className="text-[11px] text-[#AAA6C5] font-sans">HMAC signature verification against PayPal certs + event-ID deduplication.</p>
            </div>

            {/* Box 2 */}
            <div className="p-4 rounded-xl bg-[#111126] border border-[rgba(113,59,255,0.3)] space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#713BFF] block">2. Tenant Isolation</span>
              <div className="font-semibold text-[#F7F5FF]">JWT & RBAC</div>
              <p className="text-[11px] text-[#AAA6C5] font-sans">Strict merchantId scoping on all Prisma queries. Role permissions enforced.</p>
            </div>

            {/* Box 3 */}
            <div className="p-4 rounded-xl bg-[#111126] border border-[rgba(150,63,255,0.4)] space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#963FFF] block">3. Cognitive Guardrail</span>
              <div className="font-semibold text-[#F7F5FF]">Zod & Citations</div>
              <p className="text-[11px] text-[#AAA6C5] font-sans">AI outputs validated via Zod. Every claim requires source record citations.</p>
            </div>

            {/* Box 4 */}
            <div className="p-4 rounded-xl bg-[#111126] border border-[rgba(53,211,154,0.35)] space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#35D39A] block">4. Egress Barrier</span>
              <div className="font-semibold text-[#F7F5FF]">Human Sign-Off</div>
              <p className="text-[11px] text-[#AAA6C5] font-sans">Backend blocks submission unless explicit merchant approval is signed.</p>
            </div>
          </div>
        </Card>

        {/* Security Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {securityPillars.map((pil) => {
            const Icon = pil.icon;
            return (
              <Card key={pil.title} hover className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-[rgba(113,59,255,0.15)] text-[#963FFF] border border-[rgba(150,63,255,0.3)]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant="violet" size="sm">{pil.badge}</Badge>
                </div>
                <h3 className="text-base font-bold text-[#F7F5FF]">{pil.title}</h3>
                <p className="text-xs text-[#AAA6C5] leading-relaxed">{pil.desc}</p>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center pt-8 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5FF]">
            Review our architecture & open source code
          </h2>
          <div className="flex justify-center gap-4">
            <Link href="/resources">
              <Button variant="glow" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explore Technical Resources
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

