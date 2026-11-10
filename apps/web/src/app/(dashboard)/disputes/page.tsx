'use client';

import React, { useEffect, useState } from 'react';
import { DisputeGrid } from '@/components/disputes/DisputeGrid';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import type { Dispute } from '@/lib/types';
import { RefreshCw, Search, Filter } from 'lucide-react';

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchDisputes = async () => {
    setIsLoading(true);
    try {
      const res = await api.listDisputes({
        search: search || undefined,
        status: statusFilter || undefined,
      });
      setDisputes(res.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, [statusFilter]);

  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      await fetchDisputes();
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Disputes Console</h1>
          <p className="text-sm text-slate-500">
            Enterprise multi-column disputes grid powered by AG Grid with real-time Seller Protection metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncAll}
            isLoading={isSyncing}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Sync from PayPal
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search by dispute ID, order ID, or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchDisputes()}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg text-sm px-3 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="WAITING_FOR_SELLER_RESPONSE">Action Required</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="OPEN">Open</option>
            <option value="RESOLVED">Resolved</option>
          </select>
          <Button variant="secondary" size="md" onClick={fetchDisputes}>
            Apply Filter
          </Button>
        </div>
      </div>

      {/* AG Grid Table Container */}
      <DisputeGrid rowData={disputes} isLoading={isLoading} />
    </div>
  );
}

