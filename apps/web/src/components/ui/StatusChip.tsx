import React from 'react';
import { Badge } from './Badge';
import type { DisputeStatus, ApprovalStatus } from '@/lib/types';

export const DisputeStatusChip: React.FC<{ status: DisputeStatus }> = ({ status }) => {
  switch (status) {
    case 'OPEN':
      return <Badge variant="blue">Open</Badge>;
    case 'WAITING_FOR_SELLER_RESPONSE':
      return <Badge variant="amber">Action Required</Badge>;
    case 'WAITING_FOR_BUYER_RESPONSE':
      return <Badge variant="purple">Buyer Turn</Badge>;
    case 'UNDER_REVIEW':
      return <Badge variant="purple">PayPal Review</Badge>;
    case 'RESOLVED':
      return <Badge variant="green">Resolved</Badge>;
    case 'CLOSED':
      return <Badge variant="gray">Closed</Badge>;
    case 'ESCALATED':
      return <Badge variant="red">Escalated</Badge>;
    default:
      return <Badge variant="gray">{status}</Badge>;
  }
};

export const ApprovalStatusChip: React.FC<{ status: ApprovalStatus }> = ({ status }) => {
  switch (status) {
    case 'PENDING_REVIEW':
      return <Badge variant="amber">Review Pending</Badge>;
    case 'APPROVED':
      return <Badge variant="green">Approved</Badge>;
    case 'REJECTED':
      return <Badge variant="red">Rejected</Badge>;
    case 'SUBMITTED':
      return <Badge variant="blue">Submitted</Badge>;
    case 'SUBMISSION_FAILED':
      return <Badge variant="red">Failed</Badge>;
    default:
      return <Badge variant="gray">{status}</Badge>;
  }
};

