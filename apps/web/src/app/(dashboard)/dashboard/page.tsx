'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DisputeStatusChip } from '@/components/ui/StatusChip';
import { Timeline } from '@/components/ui/Timeline';
import { api } from '@/lib/api';
import type { DashboardKpis, Dispute } from '@/lib/types';
import {
  Scale,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
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
          api.listDisputes({ limit: '5' as any }),
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
        api.listDisputes({ limit: '5' as any }),
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
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Merchant Dispute Intelligence</h1>
          <p className="text-sm text-slate-500">
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
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push('/disputes')}
            leftIcon={<Scale className="w-4 h-4" />}
          >
            Open Disputes Console
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Disputes</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{kpis.activeDisputes}</div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Under evaluation</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Scale className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Disputed Revenue</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              ${kpis.totalDisputedAmount.toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">At stake</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Avg Completeness</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">{kpis.averageCompletenessScore}%</div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Seller Protection strength</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Urgent (&lt;24h)</span>
            <div className="text-2xl font-bold text-rose-600 mt-1">{kpis.urgentDisputes}</div>
            <span className="text-[11px] text-rose-500 mt-0.5 block font-medium">Requires immediate response</span>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* Main Content: Urgent Disputes & Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Disputes requiring merchant attention */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Cases Requiring Review</h2>
            <button
              onClick={() => router.push('/disputes')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              View all ({disputes.length}) <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {disputes.map((dispute) => (
              <Card
                key={dispute.id}
                hover
                onClick={() => router.push(`/disputes/${dispute.id}`)}
                className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600">
                      {dispute.paypalDisputeId}
                    </span>
                    <DisputeStatusChip status={dispute.status} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    {dispute.reason ? dispute.reason.replace(/_/g, ' ') : 'ITEM NOT RECEIVED'}
                  </h3>
                  {dispute.transaction?.description && (
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {dispute.transaction.description}
                    </p>
                  )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0">
                  <span className="text-base font-bold text-slate-900">
                    ${Number(dispute.disputeAmount).toFixed(2)} {dispute.disputeCurrency}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs font-semibold text-slate-600">
                      {dispute.aiAnalyses?.[0]?.completenessScore || 85}% readiness
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Live Audit Trail & Webhook feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Compliance Audit Ledger</h2>
            <Badge variant="blue">Live Log</Badge>
          </div>
          <Card className="p-5">
            <Timeline events={data?.recentActivity || []} />
          </Card>
        </div>
      </div>
    </div>
  );
}

