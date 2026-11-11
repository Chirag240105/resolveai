'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DisputeStatusChip, ApprovalStatusChip } from '@/components/ui/StatusChip';
import { Timeline } from '@/components/ui/Timeline';
import { AmbientGlow } from '@/components/backgrounds/AmbientGlow';
import { api } from '@/lib/api';
import type { DashboardKpis, Dispute } from '@/lib/types';
import {
  Scale,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Sparkles,
  TrendingUp,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardKpis | null>(null);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [dash, dispList] = await Promise.all([
          api.getDashboard(),
          api.listDisputes({ limit: 5 }),
        ]);
        setData(dash);
        setDisputes(dispList.items || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const [dash, dispList] = await Promise.all([
        api.getDashboard(),
        api.listDisputes({ limit: 5 }),
      ]);
      setData(dash);
      setDisputes(dispList.items || []);
    } finally {
      setIsSyncing(false);
    }
  };

  const kpis = data?.kpis || {
    totalDisputes: 4,
    activeDisputes: 3,
    urgentDisputes: 1,
    resolvedDisputes: 1,
    totalDisputedAmount: 1143.49,
    averageCompletenessScore: 86,
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <AmbientGlow position="top" color="violet" intensity="subtle" />

      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F7F5FF]">Merchant Dispute Intelligence</h1>
          <p className="text-xs text-[#AAA6C5] mt-1">
            Real-time PayPal sandbox dispute investigation and Seller Protection evidence scoring.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            isLoading={isSyncing}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Sync from PayPal
          </Button>
          <Link href="/dashboard/disputes">
            <Button variant="glow" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Open Disputes Console
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card hover className="p-5 flex items-center justify-between bg-[#111126]/90 border-[rgba(145,105,255,0.2)]">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#AAA6C5] block font-semibold">
              Active Disputes
            </span>
            <div className="text-2xl font-bold text-[#F7F5FF] mt-1 font-mono">{kpis.activeDisputes}</div>
            <span className="text-[11px] text-[#536CFF] mt-0.5 block font-medium">Under evaluation</span>
          </div>
          <div className="p-3 bg-[rgba(83,108,255,0.15)] text-[#536CFF] rounded-2xl border border-[rgba(83,108,255,0.3)]">
            <Scale className="w-5 h-5" />
          </div>
        </Card>

        <Card hover className="p-5 flex items-center justify-between bg-[#111126]/90 border-[rgba(145,105,255,0.2)]">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#AAA6C5] block font-semibold">
              Disputed Revenue
            </span>
            <div className="text-2xl font-bold text-[#F7F5FF] mt-1 font-mono">
              ${kpis.totalDisputedAmount.toFixed(2)}
            </div>
            <span className="text-[11px] text-[#F5B942] mt-0.5 block font-medium">At financial stake</span>
          </div>
          <div className="p-3 bg-[rgba(245,185,66,0.15)] text-[#F5B942] rounded-2xl border border-[rgba(245,185,66,0.3)]">
            <DollarSign className="w-5 h-5" />
          </div>
        </Card>

        <Card hover className="p-5 flex items-center justify-between bg-[#111126]/90 border-[rgba(145,105,255,0.2)]">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#AAA6C5] block font-semibold">
              Avg Completeness
            </span>
            <div className="text-2xl font-bold text-[#35D39A] mt-1 font-mono">{kpis.averageCompletenessScore}%</div>
            <span className="text-[11px] text-[#35D39A] mt-0.5 block font-medium">Seller Protection strength</span>
          </div>
          <div className="p-3 bg-[rgba(53,211,154,0.15)] text-[#35D39A] rounded-2xl border border-[rgba(53,211,154,0.3)]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Card>

        <Card hover className="p-5 flex items-center justify-between bg-[#111126]/90 border-[rgba(145,105,255,0.2)]">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#AAA6C5] block font-semibold">
              Urgent (&lt;24h)
            </span>
            <div className="text-2xl font-bold text-[#FF647C] mt-1 font-mono">{kpis.urgentDisputes}</div>
            <span className="text-[11px] text-[#FF647C] mt-0.5 block font-medium">Requires immediate response</span>
          </div>
          <div className="p-3 bg-[rgba(255,100,124,0.15)] text-[#FF647C] rounded-2xl border border-[rgba(255,100,124,0.3)]">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Main Content Split: Disputes & Audit Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Priority Cases */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#F7F5FF]">Cases Requiring Review</h2>
              <Badge variant="purple" size="sm">Action Required</Badge>
            </div>
            <Link
              href="/dashboard/disputes"
              className="text-xs font-semibold text-[#963FFF] hover:text-[#d4c3ff] flex items-center gap-1 transition-colors"
            >
              View all ({disputes.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {disputes.map((dispute) => (
              <Card
                key={dispute.id}
                hover
                onClick={() => router.push(`/dashboard/disputes/${dispute.id}`)}
                className="p-5 cursor-pointer bg-[#111126]/90 border-[rgba(145,105,255,0.2)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#536CFF]">
                      {dispute.paypalDisputeId}
                    </span>
                    <DisputeStatusChip status={dispute.status} />
                    <ApprovalStatusChip status={dispute.approvalStatus} />
                  </div>
                  <h3 className="text-sm font-bold text-[#F7F5FF]">
                    {dispute.reason ? dispute.reason.replace(/_/g, ' ') : 'ITEM NOT RECEIVED'}
                  </h3>
                  {dispute.transaction?.description && (
                    <p className="text-xs text-[#AAA6C5] line-clamp-1">
                      {dispute.transaction.description}
                    </p>
                  )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0">
                  <span className="text-base font-bold text-[#F7F5FF] font-mono">
                    ${Number(dispute.disputeAmount).toFixed(2)} {dispute.disputeCurrency}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[#35D39A] font-mono">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {dispute.aiAnalyses?.[0]?.completenessScore || 85}% readiness
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Live Audit Timeline */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#F7F5FF]">Compliance Ledger</h2>
            <Badge variant="blue" size="sm">Immutable</Badge>
          </div>
          <Card className="p-5 bg-[#111126]/90 border-[rgba(145,105,255,0.2)]">
            <Timeline events={data?.recentActivity || []} />
          </Card>
        </div>
      </div>
    </div>
  );
}
