import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Clock, FileCheck, ShieldCheck, Sparkles } from 'lucide-react';
import type { DisputeEvidence } from '@/lib/types';

interface EvidenceChecklistProps {
  evidenceList: DisputeEvidence[];
  onAddEvidence?: () => void;
}

export const EvidenceChecklist: React.FC<EvidenceChecklistProps> = ({ evidenceList }) => {
  return (
    <Card className="p-6 bg-[#171329] border-[rgba(145,105,255,0.22)] text-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#8B5CF6]" />
            <CardTitle className="text-white">Evidence Registry & Proof Items</CardTitle>
          </div>
          <Badge variant="purple">{evidenceList.length} Items Attached</Badge>
        </div>
      </CardHeader>
      <div className="space-y-3 mt-3">
        {evidenceList.length === 0 ? (
          <div className="p-8 text-center text-[#EAE5F5] text-sm border border-dashed border-[rgba(145,105,255,0.25)] rounded-xl bg-[#141024]">
            No evidence records currently attached.
          </div>
        ) : (
          evidenceList.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-[rgba(145,105,255,0.2)] bg-[#141024] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 hover:border-[#8B5CF6]/50 hover:bg-[#171329]"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-[#7047EB]/20 border border-[#7047EB]/30 text-[#8B5CF6] shrink-0 mt-0.5">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                  {item.description && (
                    <p className="text-xs text-[#EAE5F5] mt-0.5">{item.description}</p>
                  )}
                  {item.sourceReference && (
                    <p className="text-xs font-mono text-[#EAE5F5] mt-1 flex items-center gap-1.5">
                      <span>Ref:</span>
                      <span className="font-semibold text-white">{item.sourceReference}</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                {item.isVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#10B981] bg-[#10B981]/15 px-2.5 py-0.5 rounded-md border border-[#10B981]/30 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Valid
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-white bg-white/10 px-2.5 py-0.5 rounded-md border border-white/20 font-mono">
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
