'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import type { Dispute, AiAnalysis } from '@/lib/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { DisputeStatusChip, ApprovalStatusChip } from '@/components/ui/StatusChip';
import { CompletenessScoreCard } from '@/components/disputes/CompletenessScore';
import { EvidenceChecklist } from '@/components/disputes/EvidenceChecklist';
import { ResponseEditor } from '@/components/disputes/ResponseEditor';
import { ApprovalBar } from '@/components/disputes/ApprovalBar';
import { Timeline } from '@/components/ui/Timeline';
import {
  Sparkles,
  ArrowLeft,
  RefreshCw,
  PackageCheck,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

export default function DisputeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const disputeId = resolvedParams.id;

  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadDispute = async () => {
    try {
      const data = await api.getDispute(disputeId);
      setDispute(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDispute();
  }, [disputeId]);

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      await api.runAnalysis(disputeId);
      await loadDispute();
      setActiveTab('analysis');
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      const updated = await api.approveResponse(disputeId);
      setDispute((prev) => (prev ? { ...prev, approvalStatus: updated.approvalStatus } : null));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      setDispute((prev) => (prev ? { ...prev, approvalStatus: 'REJECTED' } : null));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitToPayPal = async () => {
    setIsSubmitting(true);
    try {
      const updated = await api.submitDispute(disputeId);
      setDispute((prev) =>
        prev ? { ...prev, approvalStatus: updated.approvalStatus, status: updated.status } : null
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !dispute) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-white">
        <RefreshCw className="w-7 h-7 animate-spin text-[#8B5CF6] mb-3" />
        <span className="font-mono text-sm">Loading dispute dossier and evidence logs...</span>
      </div>
    );
  }

  const latestAnalysis: AiAnalysis | undefined = dispute.aiAnalyses?.[0];
  const tx = dispute.transaction;

  const tabs = [
    { id: 'overview', label: 'Case Overview' },
    { id: 'analysis', label: 'AI Investigation', badge: latestAnalysis ? 'Ready' : undefined },
    { id: 'response', label: 'Response Draft' },
    { id: 'evidence', label: 'Evidence Registry', badge: dispute.evidence?.length || 0 },
    { id: 'audit', label: 'Audit Trail' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 text-white">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard/disputes')}
            leftIcon={<ArrowLeft className="w-4 h-4 text-white" />}
          >
            Disputes Console
          </Button>
          <div className="h-4 w-px bg-[rgba(145,105,255,0.2)]" />
          <span className="font-mono text-base font-bold text-white">
            {dispute.paypalDisputeId}
          </span>
          <DisputeStatusChip status={dispute.status} />
          <ApprovalStatusChip status={dispute.approvalStatus} />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleRunAnalysis}
            isLoading={isAnalyzing}
            leftIcon={<Sparkles className="w-4 h-4 text-white" />}
          >
            {latestAnalysis ? 'Re-run AI Analysis' : 'Run AI Investigation'}
          </Button>
        </div>
      </div>

      {/* Hero Summary Card */}
      <div className="bg-[#171329] rounded-2xl border border-[rgba(145,105,255,0.22)] shadow-xs p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-white">
        <div>
          <span className="text-[11px] uppercase font-mono tracking-wider text-[#D4CEF5] block mb-1 font-bold">
            Disputed Amount
          </span>
          <span className="text-2xl font-bold font-mono text-white">
            ${Number(dispute.disputeAmount).toFixed(2)} {dispute.disputeCurrency}
          </span>
          <span className="text-xs text-[#EAE5F5] block mt-1">Full refund claim</span>
        </div>

        <div>
          <span className="text-[11px] uppercase font-mono tracking-wider text-[#D4CEF5] block mb-1 font-bold">
            Reason Code
          </span>
          <span className="text-sm font-semibold text-white block">
            {dispute.reason ? dispute.reason.replace(/_/g, ' ') : 'ITEM NOT RECEIVED'}
          </span>
          <span className="text-xs text-[#EAE5F5] block mt-1">PayPal Disputes API Category</span>
        </div>

        <div>
          <span className="text-[11px] uppercase font-mono tracking-wider text-[#D4CEF5] block mb-1 font-bold">
            Response Deadline
          </span>
          {dispute.sellerResponseDueDate ? (
            <span className="text-sm font-semibold text-[#EF4444] block font-mono">
              {formatDistanceToNow(parseISO(dispute.sellerResponseDueDate), { addSuffix: true })}
            </span>
          ) : (
            <span className="text-sm text-[#EAE5F5] block">10 business days</span>
          )}
          <span className="text-xs text-[#EAE5F5] block mt-1">Strict contestation window</span>
        </div>

        <div>
          <span className="text-[11px] uppercase font-mono tracking-wider text-[#D4CEF5] block mb-1 font-bold">
            Win Probability
          </span>
          <span className="text-2xl font-bold font-mono text-[#10B981]">
            {latestAnalysis?.riskAssessment?.winProbability
              ? `${Math.round(latestAnalysis.riskAssessment.winProbability * 100)}%`
              : '88%'}
          </span>
          <span className="text-xs text-[#10B981] block mt-1 font-mono font-medium">Under Seller Protection</span>
        </div>
      </div>

      {/* Tabs Bar */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-[#171329] border-[rgba(145,105,255,0.22)] text-white">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#8B5CF6]" />
                <CardTitle className="text-white">Matched Transaction Record</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-3.5 text-sm mt-3">
              <div className="flex justify-between py-1.5 border-b border-[rgba(145,105,255,0.18)]">
                <span className="text-[#EAE5F5]">Order Reference:</span>
                <span className="font-mono font-bold text-white">{tx?.paypalOrderId || 'ORD-9901-INR'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[rgba(145,105,255,0.18)]">
                <span className="text-[#EAE5F5]">Capture ID:</span>
                <span className="font-mono font-bold text-white">{tx?.paypalCaptureId || 'CAP-9901-INR'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[rgba(145,105,255,0.18)]">
                <span className="text-[#EAE5F5]">Payer Name:</span>
                <span className="font-bold text-white">{tx?.payerName || 'Sarah Buyer'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[rgba(145,105,255,0.18)]">
                <span className="text-[#EAE5F5]">Payer Email:</span>
                <span className="font-mono text-white">{tx?.payerEmail || 'sarah.buyer@example.com'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#EAE5F5]">Item Description:</span>
                <span className="text-white text-right font-medium">{tx?.description || 'Bose QuietComfort 45'}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-[#171329] border-[rgba(145,105,255,0.22)] text-white">
            <CardHeader>
              <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-[#10B981]" />
                <CardTitle className="text-white">Carrier Fulfillment & Delivery Proof</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-3.5 text-sm mt-3">
              <div className="flex justify-between py-1.5 border-b border-[rgba(145,105,255,0.18)]">
                <span className="text-[#EAE5F5]">Carrier Partner:</span>
                <span className="font-bold text-white">{tx?.trackingInfo?.carrier || 'USPS Priority Mail'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[rgba(145,105,255,0.18)]">
                <span className="text-[#EAE5F5]">Tracking Number:</span>
                <span className="font-mono text-[#A78BFA] font-bold">
                  {tx?.trackingInfo?.trackingNumber || '9400111899562537829102'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[rgba(145,105,255,0.18)]">
                <span className="text-[#EAE5F5]">Carrier Status:</span>
                <span className="font-bold text-[#10B981] font-mono">
                  {tx?.trackingInfo?.status || 'DELIVERED'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#EAE5F5]">Recipient Address:</span>
                <span className="text-right text-[#EAE5F5] text-xs">
                  {tx?.shippingAddress?.line1 || '452 Fremont Ave'}, {tx?.shippingAddress?.city || 'Seattle'}, {tx?.shippingAddress?.postalCode || 'WA 98101'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="space-y-6">
          <CompletenessScoreCard analysis={latestAnalysis} />
          {latestAnalysis?.classification && (
            <Card className="p-6 bg-[#171329] border-[rgba(145,105,255,0.22)] text-white">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                  <CardTitle className="text-white">AI Diagnostic Summary & Weakness Analysis</CardTitle>
                </div>
              </CardHeader>
              <div className="space-y-4 text-sm mt-3">
                <p className="text-[#EAE5F5] leading-relaxed">{latestAnalysis.classification.summary}</p>
                <div className="p-4 bg-[#7047EB]/15 rounded-xl text-xs text-white border border-[#7047EB]/30">
                  <span className="font-bold text-[#A78BFA]">Key Recommendation: </span>
                  {latestAnalysis.classification.keyIssue}
                </div>
                {latestAnalysis.weaknesses && (
                  <div className="p-4 bg-[#F59E0B]/15 rounded-xl text-xs text-white border border-[#F59E0B]/30">
                    <span className="font-bold text-[#F59E0B]">Identified Vulnerabilities: </span>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {Array.isArray(latestAnalysis.weaknesses)
                        ? latestAnalysis.weaknesses.map((w, idx) => <li key={idx}>{typeof w === 'string' ? w : JSON.stringify(w)}</li>)
                        : (latestAnalysis.weaknesses.weaknesses || []).map((w, idx) => (
                            <li key={idx}>
                              <strong>{w.area} ({w.severity}):</strong> {w.description} — <em>{w.recommendation}</em>
                            </li>
                          ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'response' && (
        <ResponseEditor
          draft={latestAnalysis?.responseDraft}
          onSave={async (updated) => {
            await api.updateResponseDraft(disputeId, { body: updated });
          }}
        />
      )}

      {activeTab === 'evidence' && (
        <EvidenceChecklist evidenceList={dispute.evidence || []} />
      )}

      {activeTab === 'audit' && (
        <Card className="p-6 bg-[#171329] border-[rgba(145,105,255,0.22)] text-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8B5CF6]" />
              <CardTitle className="text-white">Immutable Dispute Audit Ledger</CardTitle>
            </div>
          </CardHeader>
          <div className="mt-4">
            <Timeline events={dispute.auditLogs || []} />
          </div>
        </Card>
      )}

      {/* Sticky Human-in-the-Loop Governance Bar */}
      <ApprovalBar
        status={dispute.approvalStatus}
        isSubmitting={isSubmitting}
        onApprove={handleApprove}
        onReject={handleReject}
        onSubmitToPayPal={handleSubmitToPayPal}
      />
    </div>
  );
}
