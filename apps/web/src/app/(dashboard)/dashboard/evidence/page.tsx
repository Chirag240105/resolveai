'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  FileCheck,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  UploadCloud,
  FileText,
  PackageCheck,
  MessageSquare,
} from 'lucide-react';

interface EvidenceRecord {
  id: string;
  disputeId: string;
  category: 'CARRIER_TRACKING' | 'PROOF_OF_DELIVERY' | 'INVOICE' | 'CUSTOMER_COMMUNICATION' | 'TERMS_POLICY';
  title: string;
  sourceReference: string;
  carrier?: string;
  trackingNumber?: string;
  status: 'VERIFIED' | 'PENDING' | 'FLAGGED';
  isAiExtracted: boolean;
  uploadedAt: string;
  confidenceScore: number;
}

const mockEvidenceRecords: EvidenceRecord[] = [
  {
    id: 'EVD-101',
    disputeId: 'PP-D-98124',
    category: 'PROOF_OF_DELIVERY',
    title: 'USPS Final Delivery Carrier Scan',
    sourceReference: 'USPS-API-SCAN-94001',
    carrier: 'USPS Priority Mail',
    trackingNumber: '9400111899562537829102',
    status: 'VERIFIED',
    isAiExtracted: true,
    uploadedAt: '2 hours ago',
    confidenceScore: 98,
  },
  {
    id: 'EVD-102',
    disputeId: 'PP-D-98124',
    category: 'CUSTOMER_COMMUNICATION',
    title: 'Customer Zendesk Ticket Transcript #8912',
    sourceReference: 'ZD-TICKET-8912',
    status: 'VERIFIED',
    isAiExtracted: true,
    uploadedAt: '3 hours ago',
    confidenceScore: 92,
  },
  {
    id: 'EVD-103',
    disputeId: 'PP-D-98125',
    category: 'CARRIER_TRACKING',
    title: 'FedEx Signature Confirmation Receipt',
    sourceReference: 'FDX-SIG-449102',
    carrier: 'FedEx Express',
    trackingNumber: '781290481920',
    status: 'VERIFIED',
    isAiExtracted: false,
    uploadedAt: '1 day ago',
    confidenceScore: 100,
  },
  {
    id: 'EVD-104',
    disputeId: 'PP-D-98126',
    category: 'INVOICE',
    title: 'Stripe Billing & Tax Invoice PDF',
    sourceReference: 'INV-2026-00412',
    status: 'VERIFIED',
    isAiExtracted: true,
    uploadedAt: '1 day ago',
    confidenceScore: 95,
  },
  {
    id: 'EVD-105',
    disputeId: 'PP-D-98127',
    category: 'TERMS_POLICY',
    title: 'Signed Return & Warranty Policy Acknowledgement',
    sourceReference: 'DOCUSIGN-ENV-991',
    status: 'PENDING',
    isAiExtracted: false,
    uploadedAt: '2 days ago',
    confidenceScore: 78,
  },
];

export default function EvidencePage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filtered = mockEvidenceRecords.filter((rec) => {
    const matchesSearch =
      rec.title.toLowerCase().includes(search.toLowerCase()) ||
      rec.disputeId.toLowerCase().includes(search.toLowerCase()) ||
      rec.sourceReference.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || rec.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileCheck className="w-5 h-5 text-[#8B5CF6]" />
            <h1 className="text-2xl font-bold tracking-tight text-white font-heading">Evidence Registry & Repository</h1>
          </div>
          <p className="text-sm text-[#EAE5F5]">
            Cryptographically audited evidence records, carrier scans, and merchant documentation for PayPal disputes.
          </p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<UploadCloud className="w-4 h-4 text-white" />}>
          Upload Evidence Artifact
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-[#171329] border-[rgba(145,105,255,0.22)] text-white shadow-xs">
          <span className="text-[11px] uppercase font-mono tracking-wider text-[#D4CEF5] block mb-1 font-bold">
            Total Proof Artifacts
          </span>
          <span className="text-2xl font-bold font-mono text-white">128</span>
          <span className="text-xs text-[#EAE5F5] mt-1 block">Cross-referenced across disputes</span>
        </Card>
        <Card className="p-5 bg-[#171329] border-[rgba(145,105,255,0.22)] text-white shadow-xs">
          <span className="text-[11px] uppercase font-mono tracking-wider text-[#D4CEF5] block mb-1 font-bold">
            Verified Artifacts
          </span>
          <span className="text-2xl font-bold font-mono text-[#10B981]">124</span>
          <span className="text-xs text-[#EAE5F5] mt-1 block">96.8% verification pass rate</span>
        </Card>
        <Card className="p-5 bg-[#171329] border-[rgba(145,105,255,0.22)] text-white shadow-xs">
          <span className="text-[11px] uppercase font-mono tracking-wider text-[#D4CEF5] block mb-1 font-bold">
            AI-Extracted Proofs
          </span>
          <span className="text-2xl font-bold font-mono text-[#8B5CF6]">89</span>
          <span className="text-xs text-[#EAE5F5] mt-1 block">Grounded in carrier API hooks</span>
        </Card>
        <Card className="p-5 bg-[#171329] border-[rgba(145,105,255,0.22)] text-white shadow-xs">
          <span className="text-[11px] uppercase font-mono tracking-wider text-[#D4CEF5] block mb-1 font-bold">
            Seller Protection Score
          </span>
          <span className="text-2xl font-bold font-mono text-white">94.2%</span>
          <span className="text-xs text-[#10B981] mt-1 block font-mono">Compliant with PayPal Policy</span>
        </Card>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#171329] p-4 rounded-2xl border border-[rgba(145,105,255,0.22)] shadow-xs">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search by proof title, dispute ID, or reference tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-white" />}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#141024] border border-[rgba(145,105,255,0.25)] rounded-xl text-sm px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#7047EB]/30 font-medium"
          >
            <option value="ALL">All Categories</option>
            <option value="PROOF_OF_DELIVERY">Proof of Delivery</option>
            <option value="CARRIER_TRACKING">Carrier Tracking</option>
            <option value="INVOICE">Invoices & Receipts</option>
            <option value="CUSTOMER_COMMUNICATION">Customer Chat Logs</option>
            <option value="TERMS_POLICY">Terms & Policies</option>
          </select>
        </div>
      </div>

      {/* Evidence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((ev) => (
          <Card key={ev.id} className="p-5 flex flex-col justify-between bg-[#171329] border-[rgba(145,105,255,0.22)] shadow-xs hover:border-[#8B5CF6] transition-colors text-white">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#7047EB]/20 border border-[#7047EB]/35 text-[#8B5CF6]">
                    {ev.category === 'PROOF_OF_DELIVERY' || ev.category === 'CARRIER_TRACKING' ? (
                      <PackageCheck className="w-4 h-4 text-white" />
                    ) : ev.category === 'CUSTOMER_COMMUNICATION' ? (
                      <MessageSquare className="w-4 h-4 text-white" />
                    ) : (
                      <FileText className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white font-heading">{ev.title}</h3>
                    <span className="text-[11px] font-mono text-[#D4CEF5]">
                      Attached to <span className="text-[#8B5CF6] font-medium">{ev.disputeId}</span>
                    </span>
                  </div>
                </div>
                {ev.status === 'VERIFIED' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#10B981] bg-[#10B981]/15 px-2.5 py-0.5 rounded-md border border-[#10B981]/30">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#F59E0B] bg-[#F59E0B]/15 px-2.5 py-0.5 rounded-md border border-[#F59E0B]/30">
                    <Clock className="w-3.5 h-3.5" /> Pending
                  </span>
                )}
              </div>

              <div className="p-3 bg-[#141024] rounded-xl border border-[rgba(145,105,255,0.2)] space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#EAE5F5] font-mono">Reference:</span>
                  <span className="text-white font-mono font-medium">{ev.sourceReference}</span>
                </div>
                {ev.trackingNumber && (
                  <div className="flex justify-between">
                    <span className="text-[#EAE5F5] font-mono">Tracking:</span>
                    <span className="text-[#A78BFA] font-mono font-bold">{ev.trackingNumber} ({ev.carrier})</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#EAE5F5] font-mono">Confidence:</span>
                  <span className="text-[#10B981] font-mono font-semibold">{ev.confidenceScore}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-[rgba(145,105,255,0.18)] text-xs">
              <span className="text-[#EAE5F5]">{ev.uploadedAt}</span>
              {ev.isAiExtracted && (
                <Badge variant="purple" size="sm">
                  <Sparkles className="w-3 h-3 mr-1 inline" /> AI Extracted
                </Badge>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
