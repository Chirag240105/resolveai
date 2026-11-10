import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, Clock, FileCheck, ShieldCheck } from 'lucide-react';
import type { DisputeEvidence } from '@/lib/types';

interface EvidenceChecklistProps {
  evidenceList: DisputeEvidence[];
  onAddEvidence?: () => void;
}

export const EvidenceChecklist: React.FC<EvidenceChecklistProps> = ({ evidenceList }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Evidence Registry & Proof Items</CardTitle>
          <Badge variant="blue">{evidenceList.length} Items Attached</Badge>
        </div>
      </CardHeader>
      <div className="space-y-3">
        {evidenceList.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-lg border border-slate-200/80 bg-slate-50/50 flex items-start justify-between gap-4 transition-colors hover:bg-slate-50"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-md bg-white border border-slate-200 text-blue-600 shadow-2xs mt-0.5">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800">{item.title}</h4>
                {item.description && <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>}
                {item.sourceReference && (
                  <p className="text-xs font-mono text-slate-600 mt-1">
                    Reference: <span className="font-semibold text-slate-900">{item.sourceReference}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              {item.isVerified ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                  <Clock className="w-3.5 h-3.5" /> Pending
                </span>
              )}
              {item.isAiGenerated && <Badge variant="purple" size="sm">AI Extracted</Badge>}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

