import React from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ShieldCheck, CheckCircle2, AlertTriangle, Send, RefreshCw, LogIn, FileText } from 'lucide-react';
import type { AuditLog } from '@/lib/types';

interface TimelineProps {
  events: AuditLog[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  const getIcon = (action: string) => {
    switch (action) {
      case 'APPROVAL_GRANTED':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'ANALYSIS_COMPLETED':
        return <CheckCircle2 className="w-4 h-4 text-blue-600" />;
      case 'SUBMISSION_COMPLETED':
        return <Send className="w-4 h-4 text-purple-600" />;
      case 'WEBHOOK_RECEIVED':
      case 'DISPUTE_SYNCED':
        return <RefreshCw className="w-4 h-4 text-slate-500" />;
      case 'USER_LOGIN':
        return <LogIn className="w-4 h-4 text-amber-500" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  if (!events || events.length === 0) {
    return <p className="text-sm text-slate-400 italic">No activity recorded yet.</p>;
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {events.map((ev) => {
        let timeAgo = '';
        try {
          timeAgo = formatDistanceToNow(parseISO(ev.createdAt), { addSuffix: true });
        } catch {
          timeAgo = 'Recently';
        }

        return (
          <div key={ev.id} className="relative flex items-start gap-3">
            <div className="absolute -left-6 top-1 bg-white border border-slate-200 rounded-full p-1 shadow-sm">
              {getIcon(ev.action)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  {ev.action.replace(/_/g, ' ')}
                </span>
                <span className="text-[11px] text-slate-400">{timeAgo}</span>
              </div>
              {ev.user && (
                <p className="text-xs text-slate-500 mt-0.5">
                  Actor: <span className="font-medium text-slate-700">{ev.user.name}</span> ({ev.user.role})
                </p>
              )}
              {ev.details && Object.keys(ev.details).length > 0 && (
                <div className="mt-1 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 font-mono">
                  {JSON.stringify(ev.details)}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

