'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ShieldCheck, Send, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';
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
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200/90 shadow-lg px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
                  Governance Gate:
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  {status === 'APPROVED' && 'Response Approved by Merchant'}
                  {status === 'PENDING_REVIEW' && 'Awaiting Human Merchant Review'}
                  {status === 'SUBMITTED' && 'Submitted to PayPal Disputes API'}
                  {status === 'REJECTED' && 'Response Draft Rejected'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
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
                  leftIcon={<XCircle className="w-4 h-4 text-slate-400" />}
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
                className="bg-emerald-600 hover:bg-emerald-700"
                leftIcon={<Send className="w-4 h-4" />}
              >
                Submit to PayPal Disputes API
              </Button>
            )}

            {isSubmitted && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" /> Evidence Submitted to PayPal
              </span>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Confirm Submission to PayPal"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setShowSubmitModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={async () => {
                await onSubmitToPayPal();
                setShowSubmitModal(false);
              }}
            >
              Confirm & Execute API Call
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              This will officially transmit your contestation letter, carrier tracking records, and delivery proofs to PayPal's live Disputes Resolution Center.
            </p>
          </div>
          <p className="text-sm text-slate-600">
            Once submitted, your response will be locked and audited under PayPal's Seller Protection guidelines.
          </p>
        </div>
      </Modal>
    </>
  );
};

