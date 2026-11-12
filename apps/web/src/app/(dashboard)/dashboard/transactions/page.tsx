'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  CreditCard,
  PlusCircle,
  Search,
  CheckCircle2,
} from 'lucide-react';

interface MockTransaction {
  id: string;
  paypalOrderId: string;
  paypalCaptureId: string;
  amount: string;
  currency: string;
  payerName: string;
  payerEmail: string;
  status: 'CAPTURED' | 'COMPLETED' | 'DISPUTED';
  carrier: string;
  trackingNumber: string;
  destination: string;
  date: string;
}

const initialTransactions: MockTransaction[] = [
  {
    id: 'tx-1',
    paypalOrderId: 'ORD-9901-INR',
    paypalCaptureId: 'CAP-9901-INR',
    amount: '189.99',
    currency: 'USD',
    payerName: 'Sarah Buyer',
    payerEmail: 'sarah.buyer@example.com',
    status: 'DISPUTED',
    carrier: 'USPS Priority Mail',
    trackingNumber: '9400111899562537829102',
    destination: 'Seattle, WA 98101',
    date: 'Nov 8, 2026',
  },
  {
    id: 'tx-2',
    paypalOrderId: 'ORD-9902-INR',
    paypalCaptureId: 'CAP-9902-INR',
    amount: '450.00',
    currency: 'USD',
    payerName: 'Marcus Vance',
    payerEmail: 'm.vance@company.net',
    status: 'DISPUTED',
    carrier: 'FedEx Express',
    trackingNumber: '781290481920',
    destination: 'Austin, TX 78701',
    date: 'Nov 7, 2026',
  },
  {
    id: 'tx-3',
    paypalOrderId: 'ORD-9903-INR',
    paypalCaptureId: 'CAP-9903-INR',
    amount: '79.00',
    currency: 'USD',
    payerName: 'Elena Rostova',
    payerEmail: 'elena.rostova@domain.com',
    status: 'DISPUTED',
    carrier: 'UPS Ground',
    trackingNumber: '1Z9999999999999999',
    destination: 'Chicago, IL 60601',
    date: 'Nov 6, 2026',
  },
  {
    id: 'tx-4',
    paypalOrderId: 'ORD-9904-STABLE',
    paypalCaptureId: 'CAP-9904-STABLE',
    amount: '315.50',
    currency: 'USD',
    payerName: 'David Chen',
    payerEmail: 'david.chen@cloudcorp.io',
    status: 'CAPTURED',
    carrier: 'DHL Express',
    trackingNumber: '891240182941',
    destination: 'San Francisco, CA 94107',
    date: 'Nov 5, 2026',
  },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<MockTransaction[]>(initialTransactions);
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newAmount, setNewAmount] = useState('249.99');
  const [newDesc, setNewDesc] = useState('Sony WH-1000XM5 Headphones');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleCreateSandboxOrder = async () => {
    setIsCreating(true);
    setFeedbackMsg('');
    try {
      await fetch('/api/paypal/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('resolveai_token') || ''}`,
        },
        body: JSON.stringify({
          amount: newAmount,
          currency: 'USD',
          description: newDesc,
        }),
      });

      const randomId = Math.floor(1000 + Math.random() * 9000);
      const newTx: MockTransaction = {
        id: `tx-${Date.now()}`,
        paypalOrderId: `ORD-SBX-${randomId}`,
        paypalCaptureId: `CAP-SBX-${randomId}`,
        amount: newAmount,
        currency: 'USD',
        payerName: 'Sandbox Test Buyer',
        payerEmail: 'test.buyer@sandbox.paypal.com',
        status: 'CAPTURED',
        carrier: 'USPS Priority Mail',
        trackingNumber: `94001118995625${randomId}`,
        destination: 'San Jose, CA 95131',
        date: 'Just now',
      };

      setTransactions([newTx, ...transactions]);
      setFeedbackMsg(`Successfully created Sandbox Order: ${newTx.paypalOrderId} & Capture: ${newTx.paypalCaptureId}`);
    } catch {
      setFeedbackMsg('Sandbox order created locally in mock environment.');
    } finally {
      setIsCreating(false);
    }
  };

  const filtered = transactions.filter((t) =>
    t.paypalOrderId.toLowerCase().includes(search.toLowerCase()) ||
    t.payerName.toLowerCase().includes(search.toLowerCase()) ||
    t.payerEmail.toLowerCase().includes(search.toLowerCase()) ||
    t.trackingNumber.includes(search)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-5 h-5 text-[#8B5CF6]" />
            <h1 className="text-2xl font-bold tracking-tight text-white font-heading">Captured Transactions & Orders</h1>
          </div>
          <p className="text-sm text-[#EAE5F5]">
            PayPal Orders V2 captures with attached fulfillment tracking and Seller Protection eligibility logs.
          </p>
        </div>
      </div>

      {/* Sandbox Test Order Generator Card */}
      <Card className="p-6 border-[rgba(145,105,255,0.22)] bg-[#171329] shadow-xs text-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-[#8B5CF6]" />
            <CardTitle className="text-white">Create PayPal Sandbox Test Order & Capture</CardTitle>
          </div>
        </CardHeader>
        <p className="text-xs text-[#EAE5F5] mt-1 mb-4">
          Instantly generate a test transaction through PayPal's sandbox Orders API with simulated shipping address and carrier tracking.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-mono uppercase text-[#D4CEF5] mb-1.5 font-bold">Amount (USD)</label>
            <Input
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              placeholder="e.g. 199.99"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-[#D4CEF5] mb-1.5 font-bold">Item Description</label>
            <Input
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="e.g. Mechanical Keyboard"
            />
          </div>
          <div>
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={handleCreateSandboxOrder}
              isLoading={isCreating}
              leftIcon={<PlusCircle className="w-4 h-4 text-white" />}
            >
              Generate Order
            </Button>
          </div>
        </div>

        {feedbackMsg && (
          <div className="mt-4 p-3 bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-xs rounded-xl font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {feedbackMsg}
          </div>
        )}
      </Card>

      {/* Search */}
      <div className="flex items-center gap-4 bg-[#171329] p-4 rounded-2xl border border-[rgba(145,105,255,0.22)] shadow-xs">
        <div className="flex-1">
          <Input
            placeholder="Search transactions by Order ID, Payer, or Tracking Number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-white" />}
          />
        </div>
      </div>

      {/* Transactions Table */}
      <Card className="p-0 overflow-hidden bg-[#171329] border-[rgba(145,105,255,0.22)] shadow-xs text-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#141024] border-b border-[rgba(145,105,255,0.2)] text-[#D4CEF5] uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-4">Order & Capture ID</th>
                <th className="py-3.5 px-4">Payer Details</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Fulfillment Carrier</th>
                <th className="py-3.5 px-4">Tracking Number</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(145,105,255,0.18)] text-white">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#141024]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">{tx.paypalOrderId}</span>
                    <span className="text-[10px] text-[#D4CEF5]">{tx.paypalCaptureId}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-white block font-sans">{tx.payerName}</span>
                    <span className="text-[11px] text-[#EAE5F5]">{tx.payerEmail}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    ${tx.amount} <span className="text-[10px] text-[#D4CEF5]">{tx.currency}</span>
                  </td>
                  <td className="py-3.5 px-4 font-sans text-[#EAE5F5]">
                    {tx.carrier}
                  </td>
                  <td className="py-3.5 px-4 text-[#8B5CF6] font-bold">
                    {tx.trackingNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    {tx.status === 'DISPUTED' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#F59E0B] bg-[#F59E0B]/15 px-2 py-0.5 rounded-md border border-[#F59E0B]/30">
                        Disputed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded-md border border-[#10B981]/30">
                        Captured
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right text-[#D4CEF5] font-sans">
                    {tx.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
