'use client';

import React from 'react';
import Link from 'next/link';
import { GridBackground } from '@/components/backgrounds/GridBackground';
import { AmbientGlow } from '@/components/backgrounds/AmbientGlow';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Store,
  TrendingUp,
  Boxes,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function SolutionsPage() {
  const solutions = [
    {
      icon: Store,
      title: 'Small Online Merchants & Solo Founders',
      badge: 'Solopreneur / SMB',
      problem: 'You run an online store alone. When a dispute is lodged, digging through carrier websites and PayPal resolution centers costs hours you don’t have.',
      howItHelps: [
        'Instant webhook ingestion eliminates manual inbox watching',
        'Automatic transaction matching links buyer orders to shipping stamps',
        'Completeness score tells you whether your case is strong enough to win',
        'Pre-drafted response with verified citations saves 45 minutes per dispute',
      ],
      impact: 'Reduces dispute response time from 45 minutes to under 2 minutes.',
    },
    {
      icon: TrendingUp,
      title: 'Growing E-Commerce Brands',
      badge: 'Scaling $50K–$250K/mo',
      problem: 'Order volumes increase, and so do friendly-fraud chargebacks (Item Not Received claims despite delivered tracking). Forfeiting valid revenue hurts cash flow.',
      howItHelps: [
        'Automatic USPS, UPS, and FedEx delivery confirmation indexing',
        'Verifies exact recipient ZIP code match against PayPal Seller Protection criteria',
        'Flags missing carrier proof or signature requirements before deadline',
        'Human-in-the-loop ensures brand voice and refund policies remain respected',
      ],
      impact: 'Protects gross margins and preserves PayPal merchant account standing.',
    },
    {
      icon: Boxes,
      title: 'High-Volume Online Retailers',
      badge: 'Enterprise Catalog',
      problem: 'Hundreds of disputes per month across multiple fulfillment warehouses create severe operational bottlenecks and missed response deadlines.',
      howItHelps: [
        'High-density AG Grid table with multi-column sorting, filtering, and pagination',
        'Urgency indicators flag cases due within 24 hours to prevent default forfeiture',
        'Standardized evidentiary dossiers for rapid team review and batch processing',
        'Full REST API integration connecting to warehouse management systems (WMS)',
      ],
      impact: 'Eliminates default dispute losses from missed submission countdowns.',
    },
    {
      icon: Users,
      title: 'Merchant Operations & Compliance Teams',
      badge: 'Finance & Ops Teams',
      problem: 'Finance leads need complete oversight. Customer support reps cannot be allowed to submit unauthorized legal claims or conceded liability to payment networks.',
      howItHelps: [
        'Role-Based Access Control (RBAC) segregating Merchants, Reviewers, and Admins',
        'Hard design rule: AI never submits alone. Mandatory review step enforced in database',
        'Immutable audit ledger recording every webhook, AI inference, and approval event',
        'Exportable compliance audit trail for payment processors and accounting audits',
      ],
      impact: 'Guarantees 100% human accountability with verifiable audit governance.',
    },
  ];

  return (
    <div className="relative overflow-hidden pt-32 pb-24">
      <GridBackground variant="marketing" />
      <AmbientGlow position="top" color="purple" intensity="medium" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-24">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="violet" glow>Tailored Operations</Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#F7F5FF] tracking-tight">
            Built for Real Merchant Workflows
          </h1>
          <p className="text-base text-[#AAA6C5] leading-relaxed">
            Whether you are a solo entrepreneur protecting your first product line or a scaling team managing hundreds of monthly orders, ResolveAI adapts to your operational scale.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((sol) => {
            const Icon = sol.icon;
            return (
              <Card key={sol.title} hover className="p-8 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-[rgba(113,59,255,0.15)] text-[#963FFF] border border-[rgba(150,63,255,0.3)] shadow-[0_0_15px_rgba(113,59,255,0.25)]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="purple" size="sm">{sol.badge}</Badge>
                  </div>

                  <h3 className="text-xl font-bold text-[#F7F5FF]">{sol.title}</h3>
                  <p className="text-xs text-[#AAA6C5] leading-relaxed bg-[#0B0B18] p-3 rounded-xl border border-[rgba(145,105,255,0.15)]">
                    <span className="text-[#FF647C] font-semibold block mb-0.5">The Bottleneck:</span>
                    {sol.problem}
                  </p>

                  <div className="space-y-2 pt-2">
                    <span className="text-xs uppercase font-mono tracking-wider text-[#d4c3ff] font-semibold block">
                      How ResolveAI Resolves It:
                    </span>
                    <ul className="space-y-2">
                      {sol.howItHelps.map((point) => (
                        <li key={point} className="flex items-start gap-2 text-xs text-[#e2dff8]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#35D39A] shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-[rgba(145,105,255,0.15)] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#35D39A] font-mono">
                    Impact: {sol.impact}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center pt-8 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5FF]">
            Protect your PayPal merchant revenue today
          </h2>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard">
              <Button variant="glow" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Launch Console
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

