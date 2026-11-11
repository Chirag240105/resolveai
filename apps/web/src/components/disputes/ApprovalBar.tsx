'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ShieldCheck, Send, AlertTriangle, XCircle, CheckCircle2, Lock } from 'lucide-react';
import type { ApprovalStatus } from '@/lib/types';

interface ApprovalBarProps {
  status: ApprovalStatus;
  isSubmitting?: boolean;
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
  onSubmitToPayPal: () => Promise<void>;
}

export const ApprovalBar: React.FC<ApprovalBarProps> = ({
  status,
  isSubmitting = false,
  onApprove,
  onReject,
  onSubmitToPayPal,
}) => {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const isApproved = status === 'APPROVED';
  const isSubmitted = status === 'SUBMITTED';

  return (
    <>
      <div className="fixed bottom-0 inset-x-0 z-40 bg-bg-card/95 backdrop-blur-xl border-t border-border-subtle shadow-[0_-10px_30px_rgba(0,0,0,0.6)] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-violet-primary/15 text-violet-light border border-violet-primary/30 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase font-mono tracking-wider text-text-muted">
                  Governance Gate:
                </span>
                <span className="text-xs font-semibold text-text-primary">
                  {status === 'APPROVED' && 'Response Approved by Merchant — Ready for Submission'}
                  {status === 'PENDING_REVIEW' && 'Awaiting Human Merchant Review & Signature'}
                  {status === 'SUBMITTED' && 'Submitted to PayPal Disputes API'}
                  {status === 'REJECTED' && 'Response Draft Rejected by Merchant'}
                </span>
              </div>
              <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                <Lock className="w-3 h-3 text-violet-primary inline" />
                Hard Design Rule: AI NEVER submits evidence autonomously. Merchant approval is mandatory.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isApproved && !isSubmitted && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onReject}
                  disabled={isSubmitting}
                  leftIcon={<XCircle className="w-4 h-4 text-text-muted" />}
                >
                  Reject Draft
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onApprove}
                  isLoading={isSubmitting}
                  leftIcon={<ShieldCheck className="w-4 h-4" />}
                >
                  Approve Response
                </Button>
              </>
            )}

            {isApproved && (
              <Button
                variant="primary"
                size="md"
                onClick={() => setShowSubmitModal(true)}
                isLoading={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                leftIcon={<Send className="w-4 h-4" />}
              >
                Submit to PayPal Disputes API
              </Button>
            )}

            {isSubmitted && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 font-mono">
                <CheckCircle2 className="w-4 h-4" /> Evidence Submitted to PayPal
              </span>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Confirm Submission to PayPal Disputes API"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setShowSubmitModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-500"
              onClick={async () => {
                await onSubmitToPayPal();
                setShowSubmitModal(false);
              }}
            >
              Confirm & Execute Live Call
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-3.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-300 text-xs flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              This action will officially dispatch your response letter, carrier tracking records, and delivery proofs to PayPal's live Disputes Resolution Center under Seller Protection guidelines.
            </p>
          </div>
          <p className="text-sm text-text-secondary">
            Once submitted, your response will be locked in the audit ledger and transmitted via authenticated PayPal OAuth tokens.
          </p>
        </div>
      </Modal>
    </>
  );
};
