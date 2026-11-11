'use client';

import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule, type ColDef } from 'ag-grid-community';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  AlertCircle,
  Sparkles,
  LayoutGrid,
  Table as TableIcon,
  Search,
  Scale,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import type { Dispute } from '@/lib/types';
import { DisputeStatusChip, ApprovalStatusChip } from '@/components/ui/StatusChip';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';

// Register AG Grid v33 community modules globally
ModuleRegistry.registerModules([AllCommunityModule]);

interface DisputeGridProps {
  rowData: Dispute[];
  isLoading?: boolean;
  onClearFilters?: () => void;
}

export const DisputeGrid: React.FC<DisputeGridProps> = ({
  rowData,
  isLoading,
  onClearFilters,
}) => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'cards'>('grid');

  const columnDefs = useMemo<ColDef<Dispute>[]>(
    () => [
      {
        headerName: 'Dispute Case ID',
        field: 'paypalDisputeId',
        width: 195,
        cellRenderer: (params: any) => (
          <span className="font-mono text-xs font-bold text-[#38BDF8] hover:text-[#7dd3fc] hover:underline cursor-pointer inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
            {params.value}
          </span>
        ),
        onCellClicked: (params: any) => {
          if (params.data?.id) router.push(`/dashboard/disputes/${params.data.id}`);
        },
      },
      {
        headerName: 'Reason Code',
        field: 'reason',
        width: 220,
        valueFormatter: (params) => {
          return params.value ? params.value.replace(/_/g, ' ') : 'ITEM NOT RECEIVED';
        },
        cellClass: 'text-xs text-[#F7F5FF] font-medium font-sans',
      },
      {
        headerName: 'Dispute Status',
        field: 'status',
        width: 175,
        cellRenderer: (params: any) => <DisputeStatusChip status={params.value} />,
      },
      {
        headerName: 'Disputed Amount',
        field: 'disputeAmount',
        width: 160,
        valueFormatter: (params) => `$${Number(params.value || 0).toFixed(2)} USD`,
        cellClass: 'font-mono font-bold text-[#F5B942]',
      },
      {
        headerName: 'Response Due',
        field: 'sellerResponseDueDate',
        width: 175,
        cellRenderer: (params: any) => {
          if (!params.value) return <span className="text-[#6E6A8A] font-mono text-xs">N/A</span>;
          try {
            const date = parseISO(params.value);
            const isUrgent = date.getTime() - Date.now() < 86400000 * 2;
            return (
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-mono ${
                  isUrgent ? 'text-[#FF647C] font-semibold' : 'text-[#AAA6C5]'
                }`}
              >
                {isUrgent && <AlertCircle className="w-3.5 h-3.5 text-[#FF647C]" />}
                {formatDistanceToNow(date, { addSuffix: true })}
              </span>
            );
          } catch {
            return <span className="font-mono text-xs">{params.value}</span>;
          }
        },
      },
      {
        headerName: 'Evidence Score',
        width: 180,
        valueGetter: (params) => {
          return params.data?.aiAnalyses?.[0]?.completenessScore || 85;
        },
        cellRenderer: (params: any) => (
          <div className="w-full flex items-center h-full gap-2">
            <ProgressBar value={params.value} size="sm" showLabel={false} />
            <span className="text-xs font-mono font-bold text-[#35D39A] shrink-0">
              {params.value}%
            </span>
          </div>
        ),
      },
      {
        headerName: 'Approval Gate',
        field: 'approvalStatus',
        width: 160,
        cellRenderer: (params: any) => <ApprovalStatusChip status={params.value} />,
      },
      {
        headerName: 'Action',
        width: 135,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => (
          <button
            onClick={() => router.push(`/dashboard/disputes/${params.data.id}`)}
            className="px-2.5 py-1 rounded-lg bg-[rgba(113,59,255,0.2)] hover:bg-[rgba(113,59,255,0.4)] text-[#d4c3ff] hover:text-white text-xs font-semibold inline-flex items-center gap-1 border border-[rgba(150,63,255,0.35)] transition-all"
          >
            Investigate <ArrowRight className="w-3 h-3" />
          </button>
        ),
      },
    ],
    [router]
  );

  return (
    <div className="space-y-3">
      {/* View Switcher Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-mono text-[#AAA6C5]">
          Showing <span className="text-white font-bold">{rowData.length}</span> verified cases
        </span>
        <div className="flex items-center gap-1 bg-[#111126] border border-[rgba(164,125,255,0.2)] rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewMode === 'grid'
                ? 'bg-[rgba(113,59,255,0.3)] text-white shadow-sm'
                : 'text-[#AAA6C5] hover:text-white'
            }`}
            title="AG Grid Terminal View"
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Grid Terminal</span>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewMode === 'cards'
                ? 'bg-[rgba(113,59,255,0.3)] text-white shadow-sm'
                : 'text-[#AAA6C5] hover:text-white'
            }`}
            title="Interactive Case Cards View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Case Dossiers</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {!isLoading && rowData.length === 0 && (
        <div className="p-12 rounded-2xl bg-[#0F0E24]/80 border border-[rgba(164,125,255,0.2)] text-center space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
          <div className="w-12 h-12 rounded-2xl bg-[rgba(113,59,255,0.15)] text-[#963FFF] border border-[rgba(150,63,255,0.3)] mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F7F5FF] font-heading">
              No dispute cases match your query
            </h3>
            <p className="text-xs text-[#AAA6C5] mt-1 max-w-md mx-auto">
              We couldn't find any disputes matching your search term or active status filter.
            </p>
          </div>
          {onClearFilters && (
            <Button variant="secondary" size="sm" onClick={onClearFilters}>
              Reset Filters
            </Button>
          )}
        </div>
      )}

      {/* Mode 1: AG Grid Interactive Terminal */}
      {viewMode === 'grid' && (
        <div className="ag-theme-alpine ag-theme-resolveai w-full h-[540px] rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-[rgba(164,125,255,0.22)] bg-[#0B0B18]">
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
            }}
            pagination={true}
            paginationPageSize={10}
            loading={isLoading}
          />
        </div>
      )}

      {/* Mode 2: Dossier Cards Table */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rowData.map((dispute) => {
            const completeness = dispute.aiAnalyses?.[0]?.completenessScore || 85;
            return (
              <div
                key={dispute.id}
                onClick={() => router.push(`/dashboard/disputes/${dispute.id}`)}
                className="p-5 rounded-2xl bg-[#111126]/95 border border-[rgba(164,125,255,0.22)] hover:border-[rgba(164,125,255,0.55)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(113,59,255,0.25)] transition-all cursor-pointer space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#38BDF8]">
                      {dispute.paypalDisputeId}
                    </span>
                    <DisputeStatusChip status={dispute.status} />
                  </div>
                  <span className="font-mono text-base font-bold text-[#F5B942]">
                    ${Number(dispute.disputeAmount).toFixed(2)} {dispute.disputeCurrency}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#6E6A8A] block font-semibold">
                    Dispute Reason
                  </span>
                  <h4 className="text-sm font-bold text-white font-heading">
                    {dispute.reason ? dispute.reason.replace(/_/g, ' ') : 'ITEM NOT RECEIVED'}
                  </h4>
                  {dispute.transaction?.description && (
                    <p className="text-xs text-[#AAA6C5] line-clamp-1">
                      {dispute.transaction.description}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-[rgba(164,125,255,0.14)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[#AAA6C5]">Readiness:</span>
                    <span className="font-mono font-bold text-[#35D39A]">{completeness}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ApprovalStatusChip status={dispute.approvalStatus} />
                    <button className="text-xs font-semibold text-[#963FFF] group-hover:text-[#d4c3ff] flex items-center gap-1 transition-colors">
                      Investigate <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
