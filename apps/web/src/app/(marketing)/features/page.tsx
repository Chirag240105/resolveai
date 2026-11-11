'use client';

import React from 'react';
import Link from 'next/link';
import { GridBackground } from '@/components/backgrounds/GridBackground';
import { AmbientGlow } from '@/components/backgrounds/AmbientGlow';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Activity,
  Sparkles,
  Scale,
  FileCheck,
  AlertTriangle,
  ShieldCheck,
  Layers,
  Zap,
  ArrowRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function FeaturesPage() {
  const featureSections = [
    {
      id: 'ingestion',
      badge: 'Real-Time Sync',
      title: 'Dispute Ingestion with Cryptographic Verification',
      desc: 'Never miss a dispute countdown. When PayPal generates CUSTOMER.DISPUTE.CREATED, ResolveAI verifies HMAC signatures, checks event-ID idempotency to eliminate duplicates, and synchronizes the dispute record in real time.',
      benefits: ['Zero dropped webhooks', 'Automatic dispute status tracking', 'Instant countdown alerts'],
      mockup: {
        title: 'HMAC Webhook Ingestion Engine',
        items: [
          { label: 'Event ID', val: 'WH-892019-LIVE-PAYPAL' },
          { label: 'Verification', val: 'HMAC-SHA256 SUCCESS' },
          { label: 'Deduplication', val: 'Unique Constraint Validated' },
        ],
      },
    },
    {
      id: 'ai-investigation',
      badge: 'Gemini 2.5 Flash',
      title: 'Autonomous Evidence Investigation',
      desc: 'Our specialized dispute intelligence agent parses buyer claims, identifies core dispute reasons (Item Not Received, Unauthorized, Item Not As Described), and retrieves transaction records, shipping addresses, and carrier tracking data automatically.',
      benefits: ['Instant root-cause classification', 'Database tool calling lookup', 'Calculates win probability'],
      mockup: {
        title: 'AI Diagnostic Engine',
        items: [
          { label: 'Classification', val: 'ITEM_NOT_RECEIVED (Severity 3/5)' },
          { label: 'Urgency Level', val: 'HIGH — Seller Response in 48h' },
          { label: 'Win Probability', val: '91% (Under Seller Protection)' },
        ],
      },
    },
    {
      id: 'completeness',
      badge: 'Seller Protection Scoring',
      title: 'Evidence Completeness Scoring (0–100)',
      desc: 'No more guessing whether your evidence package is sufficient. ResolveAI evaluates carrier stamps, verified address matches, and delivery scans against PayPal Seller Protection rules to output an objective readiness percentage.',
      benefits: ['Clear readiness meter (0-100)', 'Missing proof alert flags', 'Gamified evidence marshaling'],
      mockup: {
        title: 'Evidence Completeness Breakdown',
        items: [
          { label: 'Carrier Shipping Proof', val: '95% (Tracking & Delivered Scan)' },
          { label: 'Address Match', val: '100% (Confirmed Postal Code 98101)' },
          { label: 'Signature Confirmation', val: '60% (Optional for orders <$750)' },
        ],
      },
    },
    {
      id: 'citations',
      badge: 'Anti-Hallucination',
      title: 'Citation-Backed Contestation Drafts',
      desc: 'LLM hallucinations have no place in financial dispute contestations. ResolveAI enforces a strict Citation Schema in Zod: every factual assertion in the response draft must cite a real transaction ID, tracking number, or timestamp on file.',
      benefits: ['Every claim cites a source record', 'Structured section hierarchy', 'Editable tone: Factual Assertive'],
      mockup: {
        title: 'Verified Source Citations',
        items: [
          { label: 'Shipping Citation', val: 'USPS Priority #94001118995625' },
          { label: 'Capture Citation', val: 'PayPal Settle #CAP-9901-INR' },
          { label: 'Address Citation', val: 'Verified Profile: Seattle, WA' },
        ],
      },
    },
    {
      id: 'human-gate',
      badge: 'Strict Governance',
      title: 'Human-in-the-Loop Approval Gate',
      desc: 'Hard Rule: AI NEVER submits evidence on its own. The AI recommends and drafts; the human merchant inspects, modifies, and explicitly approves. Only with verified merchant sign-off does the backend execute submission via PayPal REST APIs.',
      benefits: ['Backend blocks unauthorized submissions', 'Full merchant editing control', 'Eliminates rogue AI submissions'],
      mockup: {
        title: 'Merchant Governance Bar',
        items: [
          { label: 'Current State', val: 'APPROVED by Elena Rostova' },
          { label: 'Backend Guard', val: 'HTTP 400 Enforced If Not Approved' },
          { label: 'Submission API', val: '/v1/customer/disputes/{id}/provide-evidence' },
        ],
      },
    },
    {
      id: 'audit',
      badge: 'Compliance Ledger',
      title: 'Immutable Compliance Audit History',
      desc: 'Every dispute transition, incoming webhook, AI analysis run, merchant draft edit, approval timestamp, and PayPal API outcome is recorded in an immutable PostgreSQL audit ledger for total regulatory compliance.',
      benefits: ['Audit trail per dispute', 'Tracks actor, timestamp & payload', 'Instant compliance export'],
      mockup: {
        title: 'Immutable Audit Stream',
        items: [
          { label: '2026-11-10 09:12', val: 'WEBHOOK_RECEIVED (PP-D-10291)' },
          { label: '2026-11-10 09:14', val: 'ANALYSIS_COMPLETED (Score: 88%)' },
          { label: '2026-11-10 09:18', val: 'APPROVAL_GRANTED (Merchant Sign-Off)' },
        ],
      },
    },
  ];

  return (
    <div className="relative overflow-hidden pt-32 pb-24">
      <GridBackground variant="marketing" />
      <AmbientGlow position="top" color="purple" intensity="medium" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-24">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="purple" glow>Platform Capabilities</Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#F7F5FF] tracking-tight">
            Everything You Need to Investigate with Confidence
          </h1>
          <p className="text-base text-[#AAA6C5] leading-relaxed">
            Engineered specifically for PayPal merchants who need data-backed evidence intelligence, verifiable citations, and strict human governance.
          </p>
        </div>

        {/* Feature Rows */}
        <div className="space-y-20">
          {featureSections.map((sec, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={sec.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${
                  isEven ? '' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Text Col */}
                <div className={`lg:col-span-6 space-y-5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <Badge variant="violet">{sec.badge}</Badge>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5FF] tracking-tight">
                    {sec.title}
                  </h2>
                  <p className="text-sm text-[#AAA6C5] leading-relaxed">{sec.desc}</p>
                  <ul className="space-y-2.5 pt-2">
                    {sec.benefits.map((b) => (
                      <li key={b} className="flex items-center gap-2.5 text-xs text-[#F7F5FF]">
                        <CheckCircle2 className="w-4 h-4 text-[#35D39A] shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual Mockup Col */}
                <div className={`lg:col-span-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <Card glow className="p-6 space-y-4 bg-[#111126]/90 border-[rgba(150,63,255,0.35)]">
                    <div className="flex items-center justify-between pb-3 border-b border-[rgba(145,105,255,0.15)]">
                      <span className="text-xs font-mono font-semibold text-[#d4c3ff] uppercase tracking-wider">
                        {sec.mockup.title}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-[#35D39A] animate-pulse" />
                    </div>
                    <div className="space-y-2.5 font-mono text-xs">
                      {sec.mockup.items.map((it) => (
                        <div
                          key={it.label}
                          className="p-3 rounded-xl bg-[#0B0B18] border border-[rgba(145,105,255,0.15)] flex justify-between items-center"
                        >
                          <span className="text-[#AAA6C5]">{it.label}:</span>
                          <span className="text-[#F7F5FF] font-semibold">{it.val}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-12 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5FF]">
            Ready to test evidence intelligence on your PayPal sandbox?
          </h2>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard">
              <Button variant="glow" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Launch Merchant Console
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

