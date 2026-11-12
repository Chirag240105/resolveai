'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { DisputeGrid } from '@/components/disputes/DisputeGrid';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import type { Dispute } from '@/lib/types';
import {
  RefreshCw,
  Search,
  Scale,
  X,
  Filter,
} from 'lucide-react';

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [, startTransition] = useTransition();

  const fetchDisputes = async (overrideSearch?: string, overrideStatus?: string) => {
    setIsLoading(true);
    try {
      const activeSearch = overrideSearch !== undefined ? overrideSearch : search;
      const activeStatus = overrideStatus !== undefined ? overrideStatus : statusFilter;

      const res = await api.listDisputes({
        search: activeSearch.trim() || undefined,
        status: activeStatus.trim() || undefined,
      });
      setDisputes(res.items || []);
    } catch (e) {
      console.error('Failed to fetch disputes:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, [statusFilter]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    fetchDisputes();
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('');
    fetchDisputes('', '');
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      await fetchDisputes();
    } finally {
      setIsSyncing(false);
    }
  };

  // Quick stats calculation
  const totalAmount = disputes.reduce(
    (sum, d) => sum + (Number(d.disputeAmount) || 0),
    0
  );
  const urgentCount = disputes.filter(
    (d) => d.status === 'WAITING_FOR_SELLER_RESPONSE'
  ).length;

  const quickFilters = [
    { label: 'All Cases', value: '', dot: null },
    {
      label: 'Action Required',
      value: 'WAITING_FOR_SELLER_RESPONSE',
      dot: 'bg-[#EF4444]',
    },
    {
      label: 'Under Review',
      value: 'UNDER_REVIEW',
      dot: 'bg-[#8B5CF6]',
    },
    {
      label: 'Open',
      value: 'OPEN',
      dot: 'bg-[#F59E0B]',
    },
    {
      label: 'Resolved',
      value: 'RESOLVED',
      dot: 'bg-[#10B981]',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 text-white">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-2 rounded-xl bg-[#7047EB]/20 text-[#8B5CF6] border border-[#7047EB]/35">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Disputes Console
            </h1>
            <Badge variant="purple" size="sm">
              {disputes.length} Cases
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-[#EAE5F5] leading-relaxed max-w-2xl font-medium">
            Real-time PayPal dispute ingestion, automated AI evidence classification, and deterministic Seller Protection completeness scoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncAll}
            isLoading={isSyncing}
            leftIcon={<RefreshCw className="w-4 h-4 text-white" />}
          >
            Sync from PayPal
          </Button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        <div className="p-4 rounded-2xl bg-[#171329] border border-[rgba(145,105,255,0.22)] shadow-xs">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#D4CEF5] block font-bold">
            Filtered Cases
          </span>
          <div className="text-xl md:text-2xl font-bold text-white font-mono mt-0.5">
            {disputes.length}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#171329] border border-[rgba(145,105,255,0.22)] shadow-xs">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#D4CEF5] block font-bold">
            At-Risk Volume
          </span>
          <div className="text-xl md:text-2xl font-bold text-[#F59E0B] font-mono mt-0.5">
            ${totalAmount.toFixed(2)} USD
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#171329] border border-[rgba(145,105,255,0.22)] shadow-xs">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#D4CEF5] block font-bold">
            Action Required
          </span>
          <div className="text-xl md:text-2xl font-bold text-[#EF4444] font-mono mt-0.5">
            {urgentCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#171329] border border-[rgba(145,105,255,0.22)] shadow-xs">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#D4CEF5] block font-bold">
            Avg Completeness
          </span>
          <div className="text-xl md:text-2xl font-bold text-[#10B981] font-mono mt-0.5">
            88%
          </div>
        </div>
      </div>

      {/* Modern Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#171329] border border-[rgba(145,105,255,0.25)] shadow-xs space-y-3.5">
        {/* Top Search & Actions Row */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full relative">
            <Input
              placeholder="Search by dispute ID (e.g. PP-D-10291), Order ID, customer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-white" />}
              rightAction={
                search ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      fetchDisputes('', statusFilter);
                    }}
                    className="p-1 text-[#EAE5F5] hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : null
              }
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full sm:w-auto shrink-0"
              leftIcon={<Search className="w-4 h-4" />}
            >
              Search
            </Button>
            {(search || statusFilter) && (
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={handleClearFilters}
                className="shrink-0 text-white hover:text-[#EF4444]"
              >
                Clear
              </Button>
            )}
          </div>
        </form>

        {/* Quick Filter Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 scrollbar-none">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#D4CEF5] mr-1 shrink-0 flex items-center gap-1 font-bold">
            <Filter className="w-3 h-3 text-[#8B5CF6]" /> Status:
          </span>
          {quickFilters.map((qf) => {
            const isSelected = statusFilter === qf.value;
            return (
              <button
                key={qf.label}
                type="button"
                onClick={() => setStatusFilter(qf.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#7047EB] text-white shadow-xs'
                    : 'bg-[#141024] text-[#EAE5F5] hover:text-white border border-[rgba(145,105,255,0.2)] hover:border-[#8B5CF6]/50'
                }`}
              >
                {qf.dot && <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : qf.dot}`} />}
                <span>{qf.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* AG Grid Table Container */}
      <DisputeGrid
        rowData={disputes}
        isLoading={isLoading}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}
