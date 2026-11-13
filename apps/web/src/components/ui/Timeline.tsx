import React from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ShieldCheck, CheckCircle2, Send, RefreshCw, LogIn, FileText } from 'lucide-react';
import type { AuditLog } from '@/lib/types';

interface TimelineProps {
  events: AuditLog[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  const getIcon = (action: string) => {
    switch (action) {
      case 'APPROVAL_GRANTED':
        return <ShieldCheck className="w-4 h-4 text-[#10B981]" />;
      case 'ANALYSIS_COMPLETED':
        return <CheckCircle2 className="w-4 h-4 text-[#8B5CF6]" />;
      case 'SUBMISSION_COMPLETED':
        return <Send className="w-4 h-4 text-[#7047EB]" />;
      case 'WEBHOOK_RECEIVED':
      case 'DISPUTE_SYNCED':
        return <RefreshCw className="w-4 h-4 text-[#EAE5F5]" />;
      case 'USER_LOGIN':
        return <LogIn className="w-4 h-4 text-[#F59E0B]" />;
      default:
        return <FileText className="w-4 h-4 text-[#EAE5F5]" />;
    }
  };

  if (!events || events.length === 0) {
    return (
      <div className="p-8 text-center text-[#EAE5F5] text-sm border border-dashed border-[rgba(145,105,255,0.25)] rounded-xl bg-[#141024]">
        No immutable activity events recorded yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-5 max-w-full overflow-hidden before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[rgba(145,105,255,0.2)]">
      {events.map((ev) => {
        let timeAgo = '';
        try {
          timeAgo = formatDistanceToNow(parseISO(ev.createdAt), { addSuffix: true });
        } catch {
          timeAgo = 'Recently';
        }

        return (
          <div key={ev.id} className="relative flex items-start gap-3.5 min-w-0 max-w-full">
            <div className="absolute -left-6 top-1 bg-[#171329] border border-[rgba(145,105,255,0.3)] rounded-full p-1.5 shadow-sm shrink-0">
              {getIcon(ev.action)}
            </div>
            <div className="flex-1 min-w-0 max-w-full overflow-hidden bg-[#171329] border border-[rgba(145,105,255,0.2)] rounded-xl p-3.5 transition-colors hover:border-[#8B5CF6]/50 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono truncate">
                  {ev.action.replace(/_/g, ' ')}
                </span>
                <span className="text-[11px] text-[#EAE5F5] font-mono font-medium shrink-0">{timeAgo}</span>
              </div>
              {ev.user && (
                <p className="text-xs text-[#EAE5F5] mt-1 font-medium truncate">
                  Actor: <span className="font-semibold text-white">{ev.user.name}</span> ({ev.user.role})
                </p>
              )}
              {ev.details && Object.keys(ev.details).length > 0 && (
                <div className="mt-2 text-[11px] text-white bg-[#141024] p-2.5 rounded-lg border border-[rgba(145,105,255,0.2)] font-mono overflow-x-auto break-words whitespace-pre-wrap max-w-full font-medium select-text">
                  {typeof ev.details === 'string'
                    ? ev.details
                    : JSON.stringify(ev.details, null, 2)}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
