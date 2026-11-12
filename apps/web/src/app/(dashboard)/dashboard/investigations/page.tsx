'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Cpu,
  ArrowRight,
  Zap,
} from 'lucide-react';

interface InvestigationDossier {
  id: string;
  disputeId: string;
  orderId: string;
  buyer: string;
  reason: string;
  amount: string;
  winProbability: number;
  completenessScore: number;
  aiSummary: string;
  keyIssue: string;
  weakness: string;
  status: 'READY' | 'SUBMITTED' | 'IN_REVIEW';
  analyzedAt: string;
}

const mockDossiers: InvestigationDossier[] = [
  {
    id: 'INV-001',
    disputeId: 'PP-D-98124',
    orderId: 'ORD-9901-INR',
    buyer: 'Sarah Buyer',
    reason: 'MERCHANDISE_OR_SERVICE_NOT_RECEIVED',
    amount: '$189.99',
    winProbability: 0.94,
    completenessScore: 92,
    aiSummary: 'Dispute claims non-delivery; carrier tracking confirms delivered with postal match Seattle 98101.',
    keyIssue: 'Explicit carrier GPS timestamp and delivery scan match PayPal shipping address record.',
    weakness: 'Lacks signature confirmation, but signature is non-mandatory under $750 threshold.',
    status: 'READY',
    analyzedAt: '12 mins ago',
  },
  {
    id: 'INV-002',
    disputeId: 'PP-D-98125',
    orderId: 'ORD-9902-INR',
    buyer: 'Marcus Vance',
    reason: 'UNAUTHORISED',
    amount: '$450.00',
    winProbability: 0.88,
    completenessScore: 86,
    aiSummary: 'Buyer claims unauthorized account access; transaction used 3DS authenticated PayPal checkout.',
    keyIssue: 'Verified device fingerprint and verified shipping address eligible for Seller Protection.',
    weakness: 'No prior transaction history on this merchant account.',
    status: 'IN_REVIEW',
    analyzedAt: '1 hour ago',
  },
  {
    id: 'INV-003',
    disputeId: 'PP-D-98126',
    orderId: 'ORD-9903-INR',
    buyer: 'Elena Rostova',
    reason: 'MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED',
    amount: '$79.00',
    winProbability: 0.72,
    completenessScore: 78,
    aiSummary: 'Buyer claims item condition varied from listing; customer chat proves buyer retained item.',
    keyIssue: 'Merchant provided clear specification sheet and warranty policy signed before checkout.',
    weakness: 'Photographic evidence from buyer submitted directly to PayPal.',
    status: 'SUBMITTED',
    analyzedAt: '4 hours ago',
  },
];

export default function InvestigationsPage() {
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'ATTENTION'>('ALL');

  const filtered = mockDossiers.filter((d) => {
    if (filter === 'HIGH') return d.winProbability >= 0.85;
    if (filter === 'ATTENTION') return d.winProbability < 0.85;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-5 h-5 text-[#8B5CF6]" />
            <h1 className="text-2xl font-bold tracking-tight text-white font-heading">AI Investigation Intelligence</h1>
          </div>
          <p className="text-sm text-[#EAE5F5]">
            Automated reasoning dossiers powered by Gemini 2.5 Flash with deterministic completeness metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-[#10B981] bg-[#10B981]/15 px-3 py-1.5 rounded-full border border-[#10B981]/30 font-mono">
            <Zap className="w-3.5 h-3.5 text-[#10B981]" /> Model: Gemini 2.5 Flash Active
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-[#171329] border-[rgba(145,105,255,0.22)] text-white shadow-xs">
          <span className="text-[11px] uppercase font-mono tracking-wider text-[#D4CEF5] block mb-1 font-bold">
            Active AI Investigations
          </span>
          <span className="text-2xl font-bold font-mono text-white">24</span>
          <span className="text-xs text-[#10B981] mt-1 block font-mono">100% processed without timeouts</span>
        </Card>
        <Card className="p-5 bg-[#171329] border-[rgba(145,105,255,0.22)] text-white shadow-xs">
          <span className="text-[11px] uppercase font-mono tracking-wider text-[#D4CEF5] block mb-1 font-bold">
            Average Win Probability
          </span>
          <span className="text-2xl font-bold font-mono text-[#10B981]">86.4%</span>
          <span className="text-xs text-[#EAE5F5] mt-1 block">Across all INR & Unauthorized cases</span>
        </Card>
        <Card className="p-5 bg-[#171329] border-[rgba(145,105,255,0.22)] text-white shadow-xs">
          <span className="text-[11px] uppercase font-mono tracking-wider text-[#D4CEF5] block mb-1 font-bold">
            Mean Pipeline Latency
          </span>
          <span className="text-2xl font-bold font-mono text-[#8B5CF6]">1.24s</span>
          <span className="text-xs text-[#EAE5F5] mt-1 block">Parallel evidence extraction</span>
        </Card>
        <Card className="p-5 bg-[#171329] border-[rgba(145,105,255,0.22)] text-white shadow-xs">
          <span className="text-[11px] uppercase font-mono tracking-wider text-[#D4CEF5] block mb-1 font-bold">
            Citation Audit Pass Rate
          </span>
          <span className="text-2xl font-bold font-mono text-white">100%</span>
          <span className="text-xs text-[#10B981] mt-1 block font-mono">Zero hallucinations detected</span>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[rgba(145,105,255,0.2)] pb-3">
        <Button
          variant={filter === 'ALL' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setFilter('ALL')}
        >
          All Dossiers ({mockDossiers.length})
        </Button>
        <Button
          variant={filter === 'HIGH' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setFilter('HIGH')}
        >
          High Defense Prob (&gt;85%)
        </Button>
        <Button
          variant={filter === 'ATTENTION' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setFilter('ATTENTION')}
        >
          Requires Attention
        </Button>
      </div>

      {/* Dossiers List */}
      <div className="space-y-4">
        {filtered.map((dossier) => (
          <Card key={dossier.id} className="p-6 bg-[#171329] border-[rgba(145,105,255,0.22)] text-white shadow-xs hover:border-[#8B5CF6] transition-colors">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-mono font-bold text-[#8B5CF6]">{dossier.disputeId}</span>
                  <span className="text-xs text-[#D4CEF5] font-mono">{dossier.orderId}</span>
                  <Badge variant="purple" size="sm">{dossier.reason.replace(/_/g, ' ')}</Badge>
                  <span className="text-xs font-semibold text-white">{dossier.amount}</span>
                  <span className="text-xs text-[#EAE5F5] ml-auto sm:ml-0 font-mono">{dossier.analyzedAt}</span>
                </div>

                <p className="text-sm text-[#EAE5F5] leading-relaxed">
                  {dossier.aiSummary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-[#141024] rounded-xl border border-[rgba(145,105,255,0.2)] text-xs">
                    <span className="font-semibold text-[#8B5CF6] block mb-1">Defense Strength:</span>
                    <span className="text-white">{dossier.keyIssue}</span>
                  </div>
                  <div className="p-3 bg-[#141024] rounded-xl border border-[rgba(145,105,255,0.2)] text-xs">
                    <span className="font-semibold text-[#F59E0B] block mb-1">Vulnerability / Weakness:</span>
                    <span className="text-white">{dossier.weakness}</span>
                  </div>
                </div>
              </div>

              <div className="flex lg:flex-col items-center lg:items-end justify-between gap-4 lg:w-48 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-[rgba(145,105,255,0.2)]">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-[#D4CEF5] block font-bold">Win Probability</span>
                  <span className="text-2xl font-bold font-mono text-[#10B981]">
                    {Math.round(dossier.winProbability * 100)}%
                  </span>
                  <span className="text-[11px] font-mono text-[#EAE5F5] block mt-0.5">
                    Score: {dossier.completenessScore}/100
                  </span>
                </div>

                <Link href={`/dashboard/disputes/${dossier.disputeId}`}>
                  <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5 text-white" />}>
                    Open Case
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
