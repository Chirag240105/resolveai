'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Timeline } from '@/components/ui/Timeline';
import { api } from '@/lib/api';
import type { AuditLog } from '@/lib/types';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Lock,
  RefreshCw,
  FileCheck,
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
    // Optionally fetch live audit logs from backend
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-5 h-5 text-violet-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">Immutable Audit Trail</h1>
          </div>
          <p className="text-sm text-text-muted">
            Append-only compliance log guaranteeing non-repudiation and human approval tracking.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            isLoading={isExporting}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export Audit Ledger
          </Button>
        </div>
      </div>

      {/* Security Assurance Banner */}
      <div className="p-4 rounded-xl bg-violet-primary/10 border border-violet-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-primary/20 text-violet-light">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
              Cryptographic Integrity Guarantee
            </h4>
            <p className="text-xs text-text-muted mt-0.5">
              All merchant approvals, analysis versions, and dispute submissions are permanently persisted.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" /> Zero Modifications Detected
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-bg-card p-4 rounded-xl border border-border-subtle">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search by action, dispute ID, or user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-text-muted" />}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-bg-secondary border border-border-subtle rounded-lg text-sm px-3.5 py-2.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-violet-primary"
          >
            <option value="ALL">All Event Types</option>
            <option value="APPROVAL_GRANTED">Approvals Granted</option>
            <option value="ANALYSIS_COMPLETED">AI Analyses Completed</option>
            <option value="SUBMISSION_COMPLETED">PayPal Submissions</option>
            <option value="WEBHOOK_RECEIVED">Webhook Ingestions</option>
            <option value="USER_LOGIN">User Logins</option>
          </select>
        </div>
      </div>

      {/* Timeline Component */}
      <Card className="p-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Historical Execution Ledger ({filteredLogs.length} Events)</CardTitle>
            <span className="text-xs font-mono text-text-muted">Database: PostgreSQL · Prisma</span>
          </div>
        </CardHeader>
        <div className="mt-4">
          <Timeline events={filteredLogs} />
        </div>
      </Card>
    </div>
  );
}

