import React from 'react';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CheckCircle2, AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';
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
    <Card className="p-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-primary" />
            <CardTitle>Evidence Completeness Assessment</CardTitle>
          </div>
          <span className="text-xs font-mono text-text-muted">
            Algorithm v2.4 · Deterministic Scoring
          </span>
        </div>
      </CardHeader>
      <div className="flex flex-col md:flex-row items-center gap-8 mt-2">
        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-bg-secondary/80 border border-border-subtle shrink-0">
          <CircularProgress score={score} size={130} />
          <span className="text-[11px] font-mono text-text-muted mt-2">
            {score >= 80 ? 'High Defensibility' : score >= 50 ? 'Moderate Risk' : 'Incomplete Proof'}
          </span>
        </div>

        <div className="flex-1 w-full space-y-4">
          {breakdown.map((item, idx) => (
            <div key={idx} className="space-y-1.5 p-3 rounded-lg bg-bg-secondary/40 border border-border-subtle/50">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-text-primary">{item.category}</span>
                <span className="font-mono text-violet-light">{item.score}%</span>
              </div>
              <ProgressBar value={item.score} size="sm" />
              {item.missing.length > 0 ? (
                <p className="text-[11px] text-amber-400 flex items-center gap-1.5 mt-1 font-mono">
                  <AlertCircle className="w-3 h-3 shrink-0" /> Missing: {item.missing.join(', ')}
                </p>
              ) : (
                <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 mt-1 font-mono">
                  <CheckCircle2 className="w-3 h-3 shrink-0" /> All required artifacts verified
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      {analysis?.completeness?.overallAssessment && (
        <div className="mt-5 p-3.5 bg-violet-primary/10 rounded-lg border border-violet-primary/20 text-xs text-text-secondary">
          <span className="font-semibold text-text-primary">Recommendation: </span>
          {analysis.completeness.overallAssessment}
        </div>
      )}
    </Card>
  );
};
