'use client';

import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import { ArrowRight, AlertCircle } from 'lucide-react';
import type { Dispute } from '@/lib/types';
import { DisputeStatusChip, ApprovalStatusChip } from '@/components/ui/StatusChip';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface DisputeGridProps {
  rowData: Dispute[];
  isLoading?: boolean;
}

export const DisputeGrid: React.FC<DisputeGridProps> = ({ rowData, isLoading }) => {
  const router = useRouter();

  const columnDefs = useMemo<ColDef<Dispute>[]>(
    () => [
      {
        headerName: 'Dispute ID',
        field: 'paypalDisputeId',
        width: 170,
        cellRenderer: (params: any) => (
          <span className="font-mono text-xs font-semibold text-blue-600 hover:underline cursor-pointer">
            {params.value}
          </span>
        ),
        onCellClicked: (params: any) => {
          if (params.data?.id) router.push(`/disputes/${params.data.id}`);
        },
      },
      {
        headerName: 'Reason',
        field: 'reason',
        width: 220,
        valueFormatter: (params) => {
          return params.value ? params.value.replace(/_/g, ' ') : 'ITEM NOT RECEIVED';
        },
      },
      {
        headerName: 'Dispute Status',
        field: 'status',
        width: 170,
        cellRenderer: (params: any) => <DisputeStatusChip status={params.value} />,
      },
      {
        headerName: 'Amount',
        field: 'disputeAmount',
        width: 130,
        valueFormatter: (params) => `$${Number(params.value || 0).toFixed(2)} USD`,
        cellClass: 'font-semibold text-slate-800',
      },
      {
        headerName: 'Deadline',
        field: 'sellerResponseDueDate',
        width: 160,
        cellRenderer: (params: any) => {
          if (!params.value) return <span className="text-slate-400">N/A</span>;
          try {
            const date = parseISO(params.value);
            const isUrgent = date.getTime() - Date.now() < 86400000 * 2;
            return (
              <span
                className={`inline-flex items-center gap-1 text-xs ${
                  isUrgent ? 'text-rose-600 font-semibold' : 'text-slate-600'
                }`}
              >
                {isUrgent && <AlertCircle className="w-3.5 h-3.5" />}
                {formatDistanceToNow(date, { addSuffix: true })}
              </span>
            );
          } catch {
            return <span>{params.value}</span>;
          }
        },
      },
      {
        headerName: 'Completeness',
        width: 170,
        valueGetter: (params) => {
          return params.data?.aiAnalyses?.[0]?.completenessScore || 85;
        },
        cellRenderer: (params: any) => (
          <div className="w-full flex items-center h-full">
            <ProgressBar value={params.value} size="sm" showLabel={false} />
            <span className="ml-2 text-xs font-semibold text-slate-700">{params.value}%</span>
          </div>
        ),
      },
      {
        headerName: 'Approval',
        field: 'approvalStatus',
        width: 150,
        cellRenderer: (params: any) => <ApprovalStatusChip status={params.value} />,
      },
      {
        headerName: 'Action',
        width: 110,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => (
          <button
            onClick={() => router.push(`/disputes/${params.data.id}`)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
          >
            Investigate <ArrowRight className="w-3 h-3" />
          </button>
        ),
      },
    ],
    [router]
  );

  return (
    <div className="ag-theme-alpine w-full h-[520px] rounded-xl overflow-hidden border border-slate-200 shadow-sm">
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
  );
};

