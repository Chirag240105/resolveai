import React from 'react';
import { Badge } from './Badge';
import type { DisputeStatus, ApprovalStatus } from '@/lib/types';
import { CheckCircle2, Clock, AlertTriangle, ShieldCheck, XCircle, Send } from 'lucide-react';

export const DisputeStatusChip: React.FC<{ status: DisputeStatus }> = ({ status }) => {
  switch (status) {
    case 'OPEN':
      return (
        <Badge variant="blue" size="sm">
          <Clock className="w-3 h-3" /> Open
        </Badge>
      );
    case 'WAITING_FOR_SELLER_RESPONSE':
      return (
        <Badge variant="warning" size="sm" glow>
          <AlertTriangle className="w-3 h-3 text-[#F5B942]" /> Action Required
        </Badge>
      );
    case 'WAITING_FOR_BUYER_RESPONSE':
      return (
        <Badge variant="purple" size="sm">
          <Clock className="w-3 h-3" /> Buyer Turn
        </Badge>
      );
    case 'UNDER_REVIEW':
      return (
        <Badge variant="violet" size="sm">
          <Clock className="w-3 h-3" /> PayPal Review
        </Badge>
      );
    case 'RESOLVED':
      return (
        <Badge variant="success" size="sm">
          <CheckCircle2 className="w-3 h-3 text-[#35D39A]" /> Resolved
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
        <Badge variant="danger" size="sm" glow>
          <AlertTriangle className="w-3 h-3 text-[#FF647C]" /> Escalated
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
          <Clock className="w-3 h-3" /> Review Pending
        </Badge>
      );
    case 'APPROVED':
      return (
        <Badge variant="success" size="sm" glow>
          <ShieldCheck className="w-3 h-3 text-[#35D39A]" /> Approved
        </Badge>
      );
    case 'REJECTED':
      return (
        <Badge variant="danger" size="sm">
          <XCircle className="w-3 h-3 text-[#FF647C]" /> Rejected
        </Badge>
      );
    case 'SUBMITTED':
      return (
        <Badge variant="purple" size="sm" glow>
          <Send className="w-3 h-3 text-[#963FFF]" /> Submitted
        </Badge>
      );
    case 'SUBMISSION_FAILED':
      return (
        <Badge variant="danger" size="sm">
          <XCircle className="w-3 h-3" /> Failed
        </Badge>
      );
    default:
      return <Badge variant="gray" size="sm">{status}</Badge>;
  }
};
