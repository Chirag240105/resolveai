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
  Sparkles,
  AlertCircle,
  X,
  Filter,
  DollarSign,
  Layers,
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
      dot: 'bg-[#FF647C]',
    },
    {
      label: 'Under Review',
      value: 'UNDER_REVIEW',
      dot: 'bg-[#536CFF]',
    },
    {
      label: 'Open',
      value: 'OPEN',
      dot: 'bg-[#F5B942]',
    },
    {
      label: 'Resolved',
      value: 'RESOLVED',
      dot: 'bg-[#35D39A]',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-2 rounded-xl bg-[rgba(113,59,255,0.18)] text-[#963FFF] border border-[rgba(150,63,255,0.35)] shadow-[0_0_16px_rgba(113,59,255,0.3)]">
              <Scale className="w-5 h-5" />
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight text-[#F7F5FF]">
              Disputes Console
            </h1>
            <Badge variant="purple" size="sm" glow>
              {disputes.length} Cases
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-[#AAA6C5] leading-relaxed max-w-2xl">
            Real-time PayPal dispute ingestion, automated AI evidence classification, and deterministic Seller Protection completeness scoring.
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

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        <div className="p-4 rounded-xl bg-[#111126]/90 border border-[rgba(164,125,255,0.16)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#AAA6C5] block font-semibold">
            Filtered Cases
          </span>
          <div className="text-xl md:text-2xl font-bold text-[#F7F5FF] font-mono mt-0.5">
            {disputes.length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111126]/90 border border-[rgba(164,125,255,0.16)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#AAA6C5] block font-semibold">
            At-Risk Volume
          </span>
          <div className="text-xl md:text-2xl font-bold text-[#F5B942] font-mono mt-0.5">
            ${totalAmount.toFixed(2)} USD
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111126]/90 border border-[rgba(164,125,255,0.16)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#AAA6C5] block font-semibold">
            Action Required
          </span>
          <div className="text-xl md:text-2xl font-bold text-[#FF647C] font-mono mt-0.5">
            {urgentCount}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111126]/90 border border-[rgba(164,125,255,0.16)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#AAA6C5] block font-semibold">
            Avg Completeness
          </span>
          <div className="text-xl md:text-2xl font-bold text-[#35D39A] font-mono mt-0.5">
            88%
          </div>
        </div>
      </div>

      {/* Modern Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0F0E24]/95 border border-[rgba(164,125,255,0.24)] shadow-[0_8px_30px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl space-y-3.5">
        {/* Top Search & Actions Row */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full relative">
            <Input
              placeholder="Search by dispute ID (e.g. PP-D-10291), Order ID, customer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-[#AAA6C5]" />}
              rightAction={
                search ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      fetchDisputes('', statusFilter);
                    }}
                    className="p-1 text-[#AAA6C5] hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : null
              }
              className="bg-[#070714] border-[rgba(164,125,255,0.22)] focus:border-[#963FFF] text-white placeholder:text-[#6E6A8A]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="submit"
              variant="glow"
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
                className="shrink-0 text-[#AAA6C5] hover:text-[#FF647C]"
              >
                Clear
              </Button>
            )}
          </div>
        </form>

        {/* Quick Filter Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 scrollbar-none">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#6E6A8A] mr-1 shrink-0 flex items-center gap-1 font-semibold">
            <Filter className="w-3 h-3" /> Status:
          </span>
          {quickFilters.map((qf) => {
            const isSelected = statusFilter === qf.value;
            return (
              <button
                key={qf.label}
                type="button"
                onClick={() => setStatusFilter(qf.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#713BFF]/40 to-[#963FFF]/30 text-white border border-[rgba(164,125,255,0.65)] shadow-[0_0_16px_rgba(113,59,255,0.35)]'
                    : 'bg-[#111126]/80 text-[#AAA6C5] hover:text-white border border-[rgba(164,125,255,0.15)] hover:border-[rgba(164,125,255,0.35)]'
                }`}
              >
                {qf.dot && <span className={`w-1.5 h-1.5 rounded-full ${qf.dot}`} />}
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
