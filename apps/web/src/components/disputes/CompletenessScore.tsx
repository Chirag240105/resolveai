import React from 'react';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CheckCircle2, AlertCircle } from 'lucide-react';
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
    <Card>
      <CardHeader>
        <CardTitle>Evidence Completeness Assessment</CardTitle>
      </CardHeader>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <CircularProgress score={score} size={130} />
        <div className="flex-1 w-full space-y-3">
          {breakdown.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>{item.category}</span>
                <span>{item.score}%</span>
              </div>
              <ProgressBar value={item.score} size="sm" />
              {item.missing.length > 0 && (
                <p className="text-[11px] text-amber-600 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> Missing: {item.missing.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      {analysis?.completeness?.overallAssessment && (
        <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600">
          <span className="font-semibold text-slate-800">Recommendation: </span>
          {analysis.completeness.overallAssessment}
        </div>
      )}
    </Card>
  );
};

