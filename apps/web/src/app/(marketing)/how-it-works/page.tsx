'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GridBackground } from '@/components/backgrounds/GridBackground';
import { AmbientGlow } from '@/components/backgrounds/AmbientGlow';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Scale,
  FileCheck,
  CheckCircle2,
  Lock,
  Layers,
  Activity,
  UserCheck,
  Send,
  Database,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function HowItWorksPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const stages = [
    {
      id: 'webhook',
      category: 'External PayPal Event',
      categoryColor: 'blue',
      title: '1. PayPal Dispute Webhook Arrives',
      icon: Activity,
      summary: 'PayPal notifies ResolveAI via CUSTOMER.DISPUTE.CREATED webhook.',
      technicalDetails:
        'The incoming payload headers (PAYPAL-AUTH-ALGO, PAYPAL-CERT-URL, PAYPAL-TRANSMISSION-ID, PAYPAL-TRANSMISSION-SIG) are verified cryptographically against PayPal’s verification endpoint. The event ID is verified against the webhook_events PostgreSQL table to enforce 100% idempotent deduplication.',
      payloadExample: {
        event_type: 'CUSTOMER.DISPUTE.CREATED',
        resource_type: 'dispute',
        dispute_id: 'PP-D-10291-INR',
        amount: '249.99 USD',
      },
    },
    {
      id: 'sync',
      category: 'Backend Processing',
      categoryColor: 'violet',
      title: '2. Dispute & Transaction Synchronization',
      icon: Database,
      summary: 'Backend fetches dispute details and matches local captured orders.',
      technicalDetails:
        'ResolveAI calls PayPal Disputes REST API (/v1/customer/disputes/{id}) to retrieve full buyer statements and due dates. It joins on PayPal buyer transaction ID or capture ID in PostgreSQL to associate shipping address, line items, and carrier tracking info.',
      payloadExample: {
        matched_order: 'ORD-9901-INR',
        carrier: 'USPS Priority Mail',
        tracking_number: '9400111899562537829102',
        status: 'DELIVERED',
      },
    },
    {
      id: 'ai-investigation',
      category: 'AI Cognitive Processing',
      categoryColor: 'purple',
      title: '3. Autonomous Gemini AI Investigation',
      icon: Sparkles,
      summary: 'Gemini 2.5 Flash agent classifies dispute and extracts verified proof.',
      technicalDetails:
        'The model is initialized with strict system instructions on PayPal Seller Protection. Using function-calling tools (getTransactionDetails, getShippingInfo), it extracts verified entities and outputs strict structured JSON validated at runtime via Zod.',
      payloadExample: {
        classification: 'ITEM_NOT_RECEIVED',
        severity: 3,
        win_probability: 0.91,
        source_records_extracted: 3,
      },
    },
    {
      id: 'completeness',
      category: 'Algorithmic Benchmark',
      categoryColor: 'success',
      title: '4. Evidence Completeness Scoring (0–100)',
      icon: Scale,
      summary: 'Objectively grades evidence package against Seller Protection requirements.',
      technicalDetails:
        'Evaluates carrier tracking status (Delivered scan gives +40 pts), verified address matching (+40 pts), and signature confirmation thresholds (+20 pts). If delivery confirmation is unverified, it explicitly flags missing items instead of guessing.',
      payloadExample: {
        overall_score: 88,
        tracking_score: 95,
        address_score: 100,
        weaknesses: ['Physical signature absent (optional for orders <$750)'],
      },
    },
    {
      id: 'draft',
      category: 'Anti-Hallucination Layer',
      categoryColor: 'blue',
      title: '5. Citation-Backed Contestation Generation',
      icon: FileCheck,
      summary: 'Drafts a professional response letter where every claim cites a real record.',
      technicalDetails:
        'Every response section includes an array of citations binding claims to verifiable database IDs. If an element cannot be cited, it cannot be included in the draft, eliminating LLM hallucinations in legal contestation letters.',
      payloadExample: {
        subject: 'Dispute Contestation: PP-D-10291-INR',
        citations: [
          { source: 'ShippingLabel', reference: 'USPS: 940011189956' },
          { source: 'CaptureRecord', reference: 'CAP-9901-INR' },
        ],
      },
    },
    {
      id: 'approval',
      category: 'Human Governance (Hard Gate)',
      categoryColor: 'warning',
      title: '6. Human Merchant Review & Explicit Sign-Off',
      icon: UserCheck,
      summary: 'AI is strictly blocked from auto-submitting. Merchant reviews and approves.',
      technicalDetails:
        'Dispute remains in PENDING_REVIEW. The merchant reviews the evidence checklist, modifies the draft if desired, and clicks "Approve Response". Backend API rejects any submission attempt unless approvalStatus == APPROVED with HTTP 400.',
      payloadExample: {
        approval_status: 'APPROVED',
        approved_by: 'Elena Rostova (Merchant Owner)',
        approved_at: '2026-11-10T09:18:22Z',
      },
    },
    {
      id: 'submission',
      category: 'PayPal Write Operation',
      categoryColor: 'purple',
      title: '7. PayPal Submission & Immutable Audit Log',
      icon: Send,
      summary: 'Backend executes POST /v1/customer/disputes/{id}/provide-evidence.',
      technicalDetails:
        'Upon human sign-off, backend dispatches the evidence package and notes to PayPal Disputes API. The dispute status transitions to UNDER_REVIEW, and an immutable log is recorded in the PostgreSQL audit trail for full compliance.',
      payloadExample: {
        paypal_api_status: '200 OK',
        audit_action: 'SUBMISSION_COMPLETED',
        dispute_state: 'UNDER_REVIEW',
      },
    },
  ];

  return (
    <div className="relative overflow-hidden pt-32 pb-24">
      <GridBackground variant="marketing" />
      <AmbientGlow position="top" color="dual" intensity="medium" />

      <div className="max-w-6xl mx-auto px-6 md:px-8 space-y-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="blue" glow>End-to-End Architecture</Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#F7F5FF] tracking-tight">
            How ResolveAI Works
          </h1>
          <p className="text-base text-[#AAA6C5] leading-relaxed">
            Trace the complete lifecycle of a PayPal dispute through cryptographic ingestion, Gemini AI investigation, objective evidence scoring, and strict human authorization.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(83,108,255,0.15)] text-[#536CFF] border border-[rgba(83,108,255,0.3)]">
            <span className="w-2 h-2 rounded-full bg-[#536CFF]" /> External PayPal Event
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(113,59,255,0.15)] text-[#d4c3ff] border border-[rgba(145,105,255,0.3)]">
            <span className="w-2 h-2 rounded-full bg-[#713BFF]" /> Backend Processing
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(150,63,255,0.18)] text-[#e8d5ff] border border-[rgba(150,63,255,0.4)]">
            <span className="w-2 h-2 rounded-full bg-[#963FFF]" /> AI Reasoning
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(245,185,66,0.15)] text-[#F5B942] border border-[rgba(245,185,66,0.3)]">
            <span className="w-2 h-2 rounded-full bg-[#F5B942]" /> Human Governance (Hard Gate)
          </span>
        </div>

        {/* Interactive Lifecycle Accordion / Steps */}
        <div className="space-y-4">
          {stages.map((stg, idx) => {
            const Icon = stg.icon;
            const isExpanded = expandedIndex === idx;

            return (
              <Card
                key={stg.id}
                hover
                className={`transition-all duration-300 cursor-pointer overflow-hidden ${
                  isExpanded
                    ? 'border-[rgba(150,63,255,0.6)] shadow-[0_0_35px_rgba(113,59,255,0.25)] bg-[#111126]'
                    : 'bg-[#0B0B18]/70 border-[rgba(145,105,255,0.15)]'
                }`}
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
              >
                <div className="flex items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-[rgba(113,59,255,0.15)] text-[#963FFF] border border-[rgba(150,63,255,0.3)] shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={stg.categoryColor as any} size="sm">
                          {stg.category}
                        </Badge>
                      </div>
                      <h3 className="text-base font-bold text-[#F7F5FF]">{stg.title}</h3>
                      <p className="text-xs text-[#AAA6C5] mt-0.5">{stg.summary}</p>
                    </div>
                  </div>
                  <div className="text-[#AAA6C5] p-2 hover:text-white transition-colors shrink-0">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-6 pt-5 border-t border-[rgba(145,105,255,0.15)] grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
                    <div className="lg:col-span-7 space-y-3">
                      <h4 className="text-xs uppercase font-mono tracking-wider text-[#d4c3ff] font-semibold">
                        System Execution Details
                      </h4>
                      <p className="text-xs text-[#AAA6C5] leading-relaxed">
                        {stg.technicalDetails}
                      </p>
                    </div>

                    <div className="lg:col-span-5">
                      <div className="p-3.5 rounded-xl bg-[#070711] border border-[rgba(145,105,255,0.2)] font-mono text-[11px] text-[#35D39A]">
                        <span className="text-[10px] uppercase text-[#6E6A8A] block mb-1">JSON Record Payload</span>
                        <pre className="overflow-x-auto text-[#e2dff8]">{JSON.stringify(stg.payloadExample, null, 2)}</pre>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-8 space-y-6">
          <h2 className="text-2xl font-bold text-[#F7F5FF]">
            See the workflow live in action
          </h2>
          <Link href="/dashboard">
            <Button variant="glow" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Test in Merchant Console
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

