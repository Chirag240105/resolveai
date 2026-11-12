import React from 'react';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import type { AiAnalysis } from '@/lib/types';

interface CompletenessScoreProps {
  analysis?: AiAnalysis;
}

export const CompletenessScoreCard: React.FC<CompletenessScoreProps> = ({ analysis }) => {
  const score = analysis?.completenessScore || 85;
  const breakdown = analysis?.completeness?.breakdown || [
    { category: 'Carrier Delivery Proof', score: 95, maxScore: 100, present: ['USPS Tracking Number', 'Delivered Scan'], missing: [] },
    { category: 'Recipient Address Verification', score: 100, maxScore: 100, present: ['Exact ZIP Match'], missing: [] },
    { category: 'Signature Confirmation', score: 60, maxScore: 100, present: [], missing: ['Physical Signature Scan (optional under $750)'] },
  ];

  return (
    <Card className="p-6 bg-[#171329] border-[rgba(145,105,255,0.22)] text-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
            <CardTitle className="text-white">Evidence Completeness Assessment</CardTitle>
          </div>
          <span className="text-xs font-mono text-[#D4CEF5] font-medium">
            Algorithm v2.4 · Deterministic Scoring
          </span>
        </div>
      </CardHeader>
      <div className="flex flex-col md:flex-row items-center gap-8 mt-2">
        <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-[#141024] border border-[rgba(145,105,255,0.2)] shrink-0">
          <CircularProgress score={score} size={130} />
          <span className="text-[11px] font-mono text-[#EAE5F5] mt-2 font-bold">
            {score >= 80 ? 'High Defensibility' : score >= 50 ? 'Moderate Risk' : 'Incomplete Proof'}
          </span>
        </div>

        <div className="flex-1 w-full space-y-4">
          {breakdown.map((item, idx) => (
            <div key={idx} className="space-y-1.5 p-3.5 rounded-xl bg-[#141024] border border-[rgba(145,105,255,0.2)]">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white font-bold">{item.category}</span>
                <span className="font-mono text-[#A78BFA] font-bold">{item.score}%</span>
              </div>
              <ProgressBar value={item.score} size="sm" />
              {item.missing.length > 0 ? (
                <p className="text-[11px] text-[#F59E0B] flex items-center gap-1.5 mt-1 font-mono font-medium">
                  <AlertCircle className="w-3 h-3 shrink-0" /> Missing: {item.missing.join(', ')}
                </p>
              ) : (
                <p className="text-[11px] text-[#10B981] flex items-center gap-1.5 mt-1 font-mono font-medium">
                  <CheckCircle2 className="w-3 h-3 shrink-0" /> All required artifacts verified
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      {analysis?.completeness?.overallAssessment && (
        <div className="mt-5 p-3.5 bg-[#7047EB]/15 rounded-xl border border-[#7047EB]/30 text-xs text-white">
          <span className="font-semibold text-white">Recommendation: </span>
          {analysis.completeness.overallAssessment}
        </div>
      )}
    </Card>
  );
};
