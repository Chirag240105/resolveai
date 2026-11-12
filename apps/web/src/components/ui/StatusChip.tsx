import React from 'react';
import { Badge } from './Badge';
import type { DisputeStatus, ApprovalStatus } from '@/lib/types';
import { CheckCircle2, Clock, AlertTriangle, ShieldCheck, XCircle, Send } from 'lucide-react';

export const DisputeStatusChip: React.FC<{ status: DisputeStatus }> = ({ status }) => {
  switch (status) {
    case 'OPEN':
      return (
        <Badge variant="blue" size="sm">
          <Clock className="w-3 h-3 text-[#93C5FD]" /> Open
        </Badge>
      );
    case 'WAITING_FOR_SELLER_RESPONSE':
      return (
        <Badge variant="warning" size="sm">
          <AlertTriangle className="w-3 h-3 text-[#F59E0B]" /> Action Required
        </Badge>
      );
    case 'WAITING_FOR_BUYER_RESPONSE':
      return (
        <Badge variant="purple" size="sm">
          <Clock className="w-3 h-3 text-[#A78BFA]" /> Buyer Turn
        </Badge>
      );
    case 'UNDER_REVIEW':
      return (
        <Badge variant="violet" size="sm">
          <Clock className="w-3 h-3 text-[#A78BFA]" /> PayPal Review
        </Badge>
      );
    case 'RESOLVED':
      return (
        <Badge variant="success" size="sm">
          <CheckCircle2 className="w-3 h-3 text-[#10B981]" /> Resolved
        </Badge>
      );
    case 'CLOSED':
      return (
        <Badge variant="gray" size="sm">
          Closed
        </Badge>
      );
    case 'ESCALATED':
      return (
        <Badge variant="danger" size="sm">
          <AlertTriangle className="w-3 h-3 text-[#EF4444]" /> Escalated
        </Badge>
      );
    default:
      return <Badge variant="gray" size="sm">{status}</Badge>;
  }
};

export const ApprovalStatusChip: React.FC<{ status: ApprovalStatus }> = ({ status }) => {
  switch (status) {
    case 'PENDING_REVIEW':
      return (
        <Badge variant="warning" size="sm">
          <Clock className="w-3 h-3 text-[#F59E0B]" /> Review Pending
        </Badge>
      );
    case 'APPROVED':
      return (
        <Badge variant="success" size="sm">
          <ShieldCheck className="w-3 h-3 text-[#10B981]" /> Approved
        </Badge>
      );
    case 'REJECTED':
      return (
        <Badge variant="danger" size="sm">
          <XCircle className="w-3 h-3 text-[#EF4444]" /> Rejected
        </Badge>
      );
    case 'SUBMITTED':
      return (
        <Badge variant="purple" size="sm">
          <Send className="w-3 h-3 text-[#A78BFA]" /> Submitted
        </Badge>
      );
    case 'SUBMISSION_FAILED':
      return (
        <Badge variant="danger" size="sm">
          <XCircle className="w-3 h-3 text-[#EF4444]" /> Failed
        </Badge>
      );
    default:
      return <Badge variant="gray" size="sm">{status}</Badge>;
  }
};
