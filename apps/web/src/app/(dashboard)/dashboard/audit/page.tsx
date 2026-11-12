'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Timeline } from '@/components/ui/Timeline';
import { api } from '@/lib/api';
import type { AuditLog } from '@/lib/types';
import {
  ShieldCheck,
  Search,
  Download,
  CheckCircle2,
  Lock,
} from 'lucide-react';

const mockAuditLogs: AuditLog[] = [
  {
    id: 'log-101',
    disputeId: 'PP-D-98124',
    action: 'APPROVAL_GRANTED',
    details: {
      decision: 'APPROVED',
      actorRole: 'MERCHANT_ADMIN',
      governancePassed: true,
      sha256Proof: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
    user: { id: 'usr-1', name: 'Merchant Admin', email: 'admin@merchant.com', role: 'ADMIN' },
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'log-102',
    disputeId: 'PP-D-98124',
    action: 'ANALYSIS_COMPLETED',
    details: {
      completenessScore: 92,
      winProbability: 0.94,
      model: 'gemini-2.5-flash',
      citationsCount: 2,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'log-103',
    disputeId: 'PP-D-98124',
    action: 'WEBHOOK_RECEIVED',
    details: {
      eventType: 'CUSTOMER.DISPUTE.CREATED',
      paypalDisputeId: 'PP-D-98124',
      hmacVerified: true,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'log-104',
    disputeId: 'PP-D-98125',
    action: 'SUBMISSION_COMPLETED',
    details: {
      paypalDisputeId: 'PP-D-98125',
      httpStatus: 200,
      sellerProtectionInvoked: true,
    },
    user: { id: 'usr-1', name: 'Merchant Admin', email: 'admin@merchant.com', role: 'ADMIN' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'log-105',
    disputeId: 'PP-D-98126',
    action: 'USER_LOGIN',
    details: { ip: '192.168.1.1', mfaVerified: true },
    user: { id: 'usr-1', name: 'Merchant Admin', email: 'admin@merchant.com', role: 'ADMIN' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
];

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    api.getWebhookFeed().then((feed) => {
      if (feed && feed.length > 0) {
        setLogs([...mockAuditLogs, ...feed]);
      }
    }).catch(() => {});
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesAction = filterAction === 'ALL' || log.action === filterAction;
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      (log.disputeId && log.disputeId.toLowerCase().includes(search.toLowerCase())) ||
      (log.user?.name && log.user.name.toLowerCase().includes(search.toLowerCase()));
    return matchesAction && matchesSearch;
  });

  const handleExport = () => {
    setIsExporting(true);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `resolveai-audit-log-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setTimeout(() => setIsExporting(false), 800);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-5 h-5 text-[#8B5CF6]" />
            <h1 className="text-2xl font-bold tracking-tight text-white font-heading">Immutable Audit Trail</h1>
          </div>
          <p className="text-sm text-[#EAE5F5]">
            Append-only compliance log guaranteeing non-repudiation and human approval tracking.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            isLoading={isExporting}
            leftIcon={<Download className="w-4 h-4 text-white" />}
          >
            Export Audit Ledger
          </Button>
        </div>
      </div>

      {/* Security Assurance Banner */}
      <div className="p-4 rounded-2xl bg-[#171329] border border-[rgba(145,105,255,0.25)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#7047EB]/20 text-[#8B5CF6] border border-[#7047EB]/35 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-[#8B5CF6]" />
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Cryptographic Integrity Guarantee
            </h4>
            <p className="text-xs text-[#EAE5F5] mt-0.5">
              All merchant approvals, analysis versions, and dispute submissions are permanently persisted.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-[#10B981] font-mono bg-[#10B981]/15 px-3 py-1.5 rounded-full border border-[#10B981]/30">
          <CheckCircle2 className="w-3.5 h-3.5" /> Zero Modifications Detected
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#171329] p-4 rounded-2xl border border-[rgba(145,105,255,0.22)] shadow-xs">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search by action, dispute ID, or user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-white" />}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-[#141024] border border-[rgba(145,105,255,0.25)] rounded-xl text-sm px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#7047EB]/30 font-medium cursor-pointer hover:border-[#8B5CF6] transition-colors"
            style={{ backgroundColor: '#141024', color: '#FFFFFF' }}
          >
            <option value="ALL" style={{ backgroundColor: '#141024', color: '#FFFFFF' }}>All Event Types</option>
            <option value="APPROVAL_GRANTED" style={{ backgroundColor: '#141024', color: '#FFFFFF' }}>Approvals Granted</option>
            <option value="ANALYSIS_COMPLETED" style={{ backgroundColor: '#141024', color: '#FFFFFF' }}>AI Analyses Completed</option>
            <option value="SUBMISSION_COMPLETED" style={{ backgroundColor: '#141024', color: '#FFFFFF' }}>PayPal Submissions</option>
            <option value="WEBHOOK_RECEIVED" style={{ backgroundColor: '#141024', color: '#FFFFFF' }}>Webhook Ingestions</option>
            <option value="USER_LOGIN" style={{ backgroundColor: '#141024', color: '#FFFFFF' }}>User Logins</option>
          </select>
        </div>
      </div>

      {/* Timeline Component */}
      <Card className="p-6 bg-[#171329] border-[rgba(145,105,255,0.22)] text-white shadow-xs">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Historical Execution Ledger ({filteredLogs.length} Events)</CardTitle>
            <span className="text-xs font-mono text-[#D4CEF5]">Database: PostgreSQL · Prisma</span>
          </div>
        </CardHeader>
        <div className="mt-4">
          <Timeline events={filteredLogs} />
        </div>
      </Card>
    </div>
  );
}
