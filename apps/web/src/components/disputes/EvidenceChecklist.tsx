import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, Clock, FileCheck, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import type { DisputeEvidence } from '@/lib/types';

interface EvidenceChecklistProps {
  evidenceList: DisputeEvidence[];
  onAddEvidence?: () => void;
}

export const EvidenceChecklist: React.FC<EvidenceChecklistProps> = ({ evidenceList }) => {
  return (
    <Card className="p-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-violet-primary" />
            <CardTitle>Evidence Registry & Proof Items</CardTitle>
          </div>
          <Badge variant="purple">{evidenceList.length} Items Attached</Badge>
        </div>
      </CardHeader>
      <div className="space-y-3 mt-3">
        {evidenceList.length === 0 ? (
          <div className="p-8 text-center text-text-muted text-sm border border-dashed border-border-subtle rounded-xl">
            No evidence records currently attached.
          </div>
        ) : (
          evidenceList.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-border-subtle bg-bg-secondary/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 hover:border-violet-primary/40 hover:bg-bg-secondary"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-violet-primary/10 border border-violet-primary/20 text-violet-light shrink-0 mt-0.5">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text-primary">{item.title}</h4>
                  {item.description && (
                    <p className="text-xs text-text-muted mt-0.5">{item.description}</p>
                  )}
                  {item.sourceReference && (
                    <p className="text-xs font-mono text-text-secondary mt-1 flex items-center gap-1.5">
                      <span className="text-text-muted">Ref:</span>
                      <span className="font-semibold text-violet-light">{item.sourceReference}</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                {item.isVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Valid
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-text-muted bg-white/5 px-2 py-0.5 rounded border border-border-subtle font-mono">
                    <Clock className="w-3.5 h-3.5" /> Pending Review
                  </span>
                )}
                {item.isAiGenerated && (
                  <Badge variant="purple" size="sm">
                    <Sparkles className="w-3 h-3 mr-1 inline" /> AI Extracted
                  </Badge>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
