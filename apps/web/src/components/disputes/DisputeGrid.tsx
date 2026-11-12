'use client';

import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule, type ColDef } from 'ag-grid-community';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  AlertCircle,
  LayoutGrid,
  Table as TableIcon,
  Search,
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
          <span className="font-mono text-xs font-bold text-[#8B5CF6] hover:text-[#A78BFA] hover:underline cursor-pointer inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
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
        cellClass: 'text-xs text-white font-medium font-sans',
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
        cellClass: 'font-mono font-bold text-white',
      },
      {
        headerName: 'Response Due',
        field: 'sellerResponseDueDate',
        width: 175,
        cellRenderer: (params: any) => {
          if (!params.value) return <span className="text-[#D4CEF5] font-mono text-xs">N/A</span>;
          try {
            const date = parseISO(params.value);
            const isUrgent = date.getTime() - Date.now() < 86400000 * 2;
            return (
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-mono ${
                  isUrgent ? 'text-[#EF4444] font-semibold' : 'text-[#EAE5F5]'
                }`}
              >
                {isUrgent && <AlertCircle className="w-3.5 h-3.5 text-[#EF4444]" />}
                {formatDistanceToNow(date, { addSuffix: true })}
              </span>
            );
          } catch {
            return <span className="font-mono text-xs text-white">{params.value}</span>;
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
            <span className="text-xs font-mono font-bold text-[#10B981] shrink-0">
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
            className="px-2.5 py-1 rounded-lg bg-[#7047EB]/20 hover:bg-[#7047EB]/40 text-white text-xs font-semibold inline-flex items-center gap-1 border border-[#7047EB]/35 transition-all"
          >
            Investigate <ArrowRight className="w-3 h-3 text-white" />
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
        <span className="text-xs font-mono text-[#D4CEF5] font-medium">
          Showing <span className="text-white font-bold">{rowData.length}</span> verified cases
        </span>
        <div className="flex items-center gap-1 bg-[#171329] border border-[rgba(145,105,255,0.22)] rounded-xl p-1 shadow-xs">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
              viewMode === 'grid'
                ? 'bg-[#7047EB] text-white shadow-xs'
                : 'text-[#D4CEF5] hover:text-white'
            }`}
            title="AG Grid Terminal View"
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Grid Terminal</span>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
              viewMode === 'cards'
                ? 'bg-[#7047EB] text-white shadow-xs'
                : 'text-[#D4CEF5] hover:text-white'
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
        <div className="p-12 rounded-2xl bg-[#171329] border border-[rgba(145,105,255,0.25)] text-center space-y-4 shadow-xs animate-fade-in-up">
          <div className="w-12 h-12 rounded-2xl bg-[#7047EB]/20 text-[#8B5CF6] border border-[#7047EB]/35 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-heading">
              No dispute cases match your query
            </h3>
            <p className="text-xs text-[#EAE5F5] mt-1 max-w-md mx-auto">
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
        <div className="ag-theme-alpine ag-theme-resolveai w-full h-[540px] rounded-2xl overflow-hidden shadow-xs border border-[rgba(145,105,255,0.25)] bg-[#171329] transition-all duration-300">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
          {rowData.map((dispute) => {
            const completeness = dispute.aiAnalyses?.[0]?.completenessScore || 85;
            return (
              <div
                key={dispute.id}
                onClick={() => router.push(`/dashboard/disputes/${dispute.id}`)}
                className="p-5 rounded-2xl bg-[#171329] border border-[rgba(145,105,255,0.22)] hover:border-[#8B5CF6] shadow-xs hover:shadow-[0_10px_30px_rgba(112,71,235,0.25)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer space-y-4 group text-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#8B5CF6]">
                      {dispute.paypalDisputeId}
                    </span>
                    <DisputeStatusChip status={dispute.status} />
                  </div>
                  <span className="font-mono text-base font-bold text-white">
                    ${Number(dispute.disputeAmount).toFixed(2)} {dispute.disputeCurrency}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#D4CEF5] block font-bold">
                    Dispute Reason
                  </span>
                  <h4 className="text-sm font-bold text-white font-heading">
                    {dispute.reason ? dispute.reason.replace(/_/g, ' ') : 'ITEM NOT RECEIVED'}
                  </h4>
                  {dispute.transaction?.description && (
                    <p className="text-xs text-[#EAE5F5] line-clamp-1 font-medium">
                      {dispute.transaction.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-[rgba(145,105,255,0.2)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[#EAE5F5] font-medium">Readiness:</span>
                    <span className="font-mono font-bold text-[#10B981]">{completeness}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ApprovalStatusChip status={dispute.approvalStatus} />
                    <button className="text-xs font-semibold text-[#8B5CF6] group-hover:text-white flex items-center gap-1 transition-colors">
                      Investigate <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-white" />
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
