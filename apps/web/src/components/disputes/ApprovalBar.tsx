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
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#171329]/95 backdrop-blur-xl border-t border-[rgba(145,105,255,0.25)] shadow-[0_-10px_30px_rgba(0,0,0,0.6)] px-6 py-4 text-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#7047EB]/20 text-[#8B5CF6] border border-[#7047EB]/35 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase font-mono tracking-wider text-[#D4CEF5] font-bold">
                  Governance Gate:
                </span>
                <span className="text-xs font-bold text-white">
                  {status === 'APPROVED' && 'Response Approved by Merchant — Ready for Submission'}
                  {status === 'PENDING_REVIEW' && 'Awaiting Human Merchant Review & Signature'}
                  {status === 'SUBMITTED' && 'Submitted to PayPal Disputes API'}
                  {status === 'REJECTED' && 'Response Draft Rejected by Merchant'}
                </span>
              </div>
              <p className="text-xs text-[#EAE5F5] flex items-center gap-1 mt-0.5 font-medium">
                <Lock className="w-3 h-3 text-[#8B5CF6] inline" />
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
                  leftIcon={<XCircle className="w-4 h-4 text-white" />}
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
                className="bg-[#10B981] hover:bg-[#059669] shadow-[0_4px_16px_rgba(16,185,129,0.35)]"
                leftIcon={<Send className="w-4 h-4" />}
              >
                Submit to PayPal Disputes API
              </Button>
            )}

            {isSubmitted && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#10B981] bg-[#10B981]/15 px-3 py-1.5 rounded-lg border border-[#10B981]/30 font-mono">
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
              className="bg-[#10B981] hover:bg-[#059669]"
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
        <div className="space-y-4 text-white">
          <div className="p-3.5 bg-[#F59E0B]/15 rounded-xl border border-[#F59E0B]/30 text-white text-xs flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              This action will officially dispatch your response letter, carrier tracking records, and delivery proofs to PayPal's live Disputes Resolution Center under Seller Protection guidelines.
            </p>
          </div>
          <p className="text-sm text-[#EAE5F5]">
            Once submitted, your response will be locked in the audit ledger and transmitted via authenticated PayPal OAuth tokens.
          </p>
        </div>
      </Modal>
    </>
  );
};
