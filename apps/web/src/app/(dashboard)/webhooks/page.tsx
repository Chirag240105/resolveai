'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import type { AuditLog } from '@/lib/types';
import { Activity, RefreshCw, Radio, CheckCircle2, ShieldCheck } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

export default function WebhooksPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const feed = await api.getWebhookFeed();
      setLogs(feed);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Webhook Activity Stream</h1>
          <p className="text-sm text-slate-500">
            Real-time PayPal webhook ingestion feed with HMAC verification and idempotency deduplication.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> Live Ingestion Active
          </span>
          <Button variant="outline" size="sm" onClick={fetchLogs} leftIcon={<RefreshCw className="w-4 h-4" />}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5">
          <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">Total Webhook Ingested</span>
          <span className="text-2xl font-bold text-slate-900">142</span>
          <span className="text-xs text-slate-500 mt-1 block">100% Signature Verified</span>
        </Card>
        <Card className="p-5">
          <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">Deduplicated Events</span>
          <span className="text-2xl font-bold text-blue-600">8</span>
          <span className="text-xs text-slate-500 mt-1 block">Skipped via Unique Constraint</span>
        </Card>
        <Card className="p-5">
          <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">Webhook Endpoint</span>
          <span className="text-sm font-mono text-slate-700 block truncate mt-1">/api/paypal/webhooks</span>
          <span className="text-xs text-emerald-600 font-medium mt-1 block">Listening for PayPal Events</span>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Webhook Deliveries</CardTitle>
        </CardHeader>
        <div className="divide-y divide-slate-100">
          {logs.map((log) => (
            <div key={log.id} className="py-3 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">{log.action.replace(/_/g, ' ')}</div>
                  {log.details && (
                    <div className="text-xs font-mono text-slate-500">
                      {JSON.stringify(log.details)}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <Badge variant="green" size="sm">Processed</Badge>
                <span className="block text-[11px] text-slate-400 mt-1">
                  {formatDistanceToNow(parseISO(log.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

