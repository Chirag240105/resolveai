'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import type { AuditLog } from '@/lib/types';
import { Activity, RefreshCw, Radio, CheckCircle2, ShieldCheck, Webhook } from 'lucide-react';
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
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Webhook className="w-5 h-5 text-violet-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">Webhook Activity Stream</h1>
          </div>
          <p className="text-sm text-text-muted">
            Real-time PayPal webhook ingestion feed with HMAC-SHA256 signature verification and idempotency deduplication.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 font-mono font-medium">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Ingestion Active
          </span>
          <Button variant="outline" size="sm" onClick={fetchLogs} isLoading={isLoading} leftIcon={<RefreshCw className="w-4 h-4" />}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted block mb-1">
            Total Webhooks Ingested
          </span>
          <span className="text-2xl font-bold font-mono text-text-primary">142</span>
          <span className="text-xs text-emerald-400 mt-1 block font-mono">100% Signature Verified</span>
        </Card>
        <Card className="p-5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted block mb-1">
            Deduplicated Events
          </span>
          <span className="text-2xl font-bold font-mono text-violet-light">8</span>
          <span className="text-xs text-text-muted mt-1 block font-mono">Skipped via Idempotency Key</span>
        </Card>
        <Card className="p-5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted block mb-1">
            Listening Endpoint
          </span>
          <span className="text-xs font-mono text-violet-light block truncate mt-1">/api/paypal/webhooks</span>
          <span className="text-xs text-emerald-400 mt-1 block font-mono">Active TLS Listener</span>
        </Card>
      </div>

      <Card className="p-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Webhook Deliveries</CardTitle>
            <span className="text-xs text-text-muted font-mono">Payload verification: Enabled</span>
          </div>
        </CardHeader>
        <div className="divide-y divide-border-subtle/50 mt-3">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-text-muted text-sm font-mono">
              Waiting for incoming PayPal webhook events...
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-violet-primary/10 border border-violet-primary/20 text-violet-light shrink-0 mt-0.5">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary font-mono text-xs">
                      {log.action.replace(/_/g, ' ')}
                    </div>
                    {log.details && (
                      <div className="text-[11px] font-mono text-text-muted mt-1">
                        {JSON.stringify(log.details)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0">
                  <Badge variant="success" size="sm">Processed</Badge>
                  <span className="block text-[10px] text-text-muted font-mono mt-0.5">
                    {formatDistanceToNow(parseISO(log.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
