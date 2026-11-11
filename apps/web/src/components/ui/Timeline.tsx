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
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'ANALYSIS_COMPLETED':
        return <CheckCircle2 className="w-4 h-4 text-violet-light" />;
      case 'SUBMISSION_COMPLETED':
        return <Send className="w-4 h-4 text-violet-primary" />;
      case 'WEBHOOK_RECEIVED':
      case 'DISPUTE_SYNCED':
        return <RefreshCw className="w-4 h-4 text-text-muted" />;
      case 'USER_LOGIN':
        return <LogIn className="w-4 h-4 text-amber-400" />;
      default:
        return <FileText className="w-4 h-4 text-text-muted" />;
    }
  };

  if (!events || events.length === 0) {
    return (
      <div className="p-8 text-center text-text-muted text-sm border border-dashed border-border-subtle rounded-xl">
        No immutable activity events recorded yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-subtle">
      {events.map((ev) => {
        let timeAgo = '';
        try {
          timeAgo = formatDistanceToNow(parseISO(ev.createdAt), { addSuffix: true });
        } catch {
          timeAgo = 'Recently';
        }

        return (
          <div key={ev.id} className="relative flex items-start gap-3.5">
            <div className="absolute -left-6 top-1 bg-bg-card border border-border-subtle rounded-full p-1.5 shadow-sm">
              {getIcon(ev.action)}
            </div>
            <div className="flex-1 bg-bg-secondary/40 border border-border-subtle/60 rounded-xl p-3.5 transition-colors hover:border-violet-primary/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-primary uppercase tracking-wider font-mono">
                  {ev.action.replace(/_/g, ' ')}
                </span>
                <span className="text-[11px] text-text-muted font-mono">{timeAgo}</span>
              </div>
              {ev.user && (
                <p className="text-xs text-text-muted mt-1">
                  Actor: <span className="font-medium text-text-secondary">{ev.user.name}</span> ({ev.user.role})
                </p>
              )}
              {ev.details && Object.keys(ev.details).length > 0 && (
                <div className="mt-2 text-[11px] text-text-secondary bg-bg-base/80 p-2.5 rounded-lg border border-border-subtle font-mono overflow-x-auto">
                  {JSON.stringify(ev.details, null, 2)}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
