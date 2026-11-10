'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import type { Dispute, AiAnalysis } from '@/lib/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
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
  AlertTriangle,
  CheckCircle2,
  PackageCheck,
  CreditCard,
  MapPin,
  Calendar,
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
      <div className="flex items-center justify-center p-24 text-slate-500">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Loading dispute dossier...
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
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/disputes')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Disputes Console
          </Button>
          <div className="h-4 w-px bg-slate-300" />
          <span className="font-mono text-base font-bold text-slate-900">
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
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            {latestAnalysis ? 'Re-run AI Analysis' : 'Run AI Investigation'}
          </Button>
        </div>
      </div>

      {/* Hero Summary Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <span className="text-xs uppercase font-semibold text-slate-400 block mb-1">Disputed Amount</span>
          <span className="text-2xl font-bold text-slate-900">
            ${Number(dispute.disputeAmount).toFixed(2)} {dispute.disputeCurrency}
          </span>
          <span className="text-xs text-slate-500 block mt-0.5">Full refund requested</span>
        </div>

        <div>
          <span className="text-xs uppercase font-semibold text-slate-400 block mb-1">Reason Code</span>
          <span className="text-sm font-semibold text-slate-800 block">
            {dispute.reason ? dispute.reason.replace(/_/g, ' ') : 'ITEM NOT RECEIVED'}
          </span>
          <span className="text-xs text-slate-500 block mt-0.5">PayPal Disputes API category</span>
        </div>

        <div>
          <span className="text-xs uppercase font-semibold text-slate-400 block mb-1">Response Due Date</span>
          {dispute.sellerResponseDueDate ? (
            <span className="text-sm font-semibold text-rose-600 block">
              {formatDistanceToNow(parseISO(dispute.sellerResponseDueDate), { addSuffix: true })}
            </span>
          ) : (
            <span className="text-sm text-slate-600 block">None assigned</span>
          )}
          <span className="text-xs text-slate-400 block mt-0.5">Strict contestation deadline</span>
        </div>

        <div>
          <span className="text-xs uppercase font-semibold text-slate-400 block mb-1">Win Probability</span>
          <span className="text-2xl font-bold text-emerald-600">
            {latestAnalysis?.riskAssessment?.winProbability
              ? `${Math.round(latestAnalysis.riskAssessment.winProbability * 100)}%`
              : '88%'}
          </span>
          <span className="text-xs text-slate-500 block mt-0.5">Under Seller Protection</span>
        </div>
      </div>

      {/* Tabs Bar */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-600" />
                <CardTitle>Matched Transaction Record</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Order Reference:</span>
                <span className="font-mono font-medium text-slate-900">{tx?.paypalOrderId || 'ORD-9901-INR'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Capture ID:</span>
                <span className="font-mono font-medium text-slate-900">{tx?.paypalCaptureId || 'CAP-9901-INR'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Payer Name:</span>
                <span className="font-medium text-slate-900">{tx?.payerName || 'Sarah Buyer'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Payer Email:</span>
                <span className="font-mono text-slate-900">{tx?.payerEmail || 'sarah.buyer@example.com'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Item Description:</span>
                <span className="text-slate-800 text-right">{tx?.description || 'Bose QuietComfort 45'}</span>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-emerald-600" />
                <CardTitle>Carrier Fulfillment & Delivery Proof</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Carrier Partner:</span>
                <span className="font-medium text-slate-900">{tx?.trackingInfo?.carrier || 'USPS Priority Mail'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Tracking Number:</span>
                <span className="font-mono text-blue-600 font-medium">
                  {tx?.trackingInfo?.trackingNumber || '9400111899562537829102'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Carrier Status:</span>
                <span className="font-semibold text-emerald-600">
                  {tx?.trackingInfo?.status || 'DELIVERED'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Recipient Confirmed Address:</span>
                <span className="text-right text-slate-700 text-xs">
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
            <Card>
              <CardHeader>
                <CardTitle>AI Diagnostic Summary</CardTitle>
              </CardHeader>
              <div className="space-y-2 text-sm text-slate-700">
                <p className="font-medium text-slate-900">{latestAnalysis.classification.summary}</p>
                <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-900 border border-blue-100">
                  <span className="font-bold">Key Insight: </span>
                  {latestAnalysis.classification.keyIssue}
                </div>
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
        <Card>
          <CardHeader>
            <CardTitle>Immutable Dispute Audit Ledger</CardTitle>
          </CardHeader>
          <Timeline events={dispute.auditLogs || []} />
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

