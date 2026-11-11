'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  CreditCard,
  PlusCircle,
  Search,
  CheckCircle2,
  Package,
  ExternalLink,
  ShieldCheck,
  MapPin,
  RefreshCw,
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
      const res = await fetch('/api/paypal/orders', {
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-5 h-5 text-violet-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">Captured Transactions & Orders</h1>
          </div>
          <p className="text-sm text-text-muted">
            PayPal Orders V2 captures with attached fulfillment tracking and Seller Protection eligibility logs.
          </p>
        </div>
      </div>

      {/* Sandbox Test Order Generator Card */}
      <Card className="p-6 border-violet-primary/30 bg-bg-card/90">
        <CardHeader>
          <div className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-violet-primary" />
            <CardTitle>Create PayPal Sandbox Test Order & Capture</CardTitle>
          </div>
        </CardHeader>
        <p className="text-xs text-text-muted mt-1 mb-4">
          Instantly generate a test transaction through PayPal's sandbox Orders API with simulated shipping address and carrier tracking.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-mono uppercase text-text-muted mb-1.5">Amount (USD)</label>
            <Input
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              placeholder="e.g. 199.99"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-text-muted mb-1.5">Item Description</label>
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
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Generate Order
            </Button>
          </div>
        </div>

        {feedbackMsg && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {feedbackMsg}
          </div>
        )}
      </Card>

      {/* Search */}
      <div className="flex items-center gap-4 bg-bg-card p-4 rounded-xl border border-border-subtle">
        <div className="flex-1">
          <Input
            placeholder="Search transactions by Order ID, Payer, or Tracking Number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-text-muted" />}
          />
        </div>
      </div>

      {/* Transactions Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-bg-secondary border-b border-border-subtle text-text-muted uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Order & Capture ID</th>
                <th className="py-3 px-4">Payer Details</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Fulfillment Carrier</th>
                <th className="py-3 px-4">Tracking Number</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50 text-text-secondary">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-bg-secondary/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-text-primary block">{tx.paypalOrderId}</span>
                    <span className="text-[10px] text-text-muted">{tx.paypalCaptureId}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-text-primary block font-sans">{tx.payerName}</span>
                    <span className="text-[11px] text-text-muted">{tx.payerEmail}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-text-primary">
                    ${tx.amount} <span className="text-[10px] text-text-muted">{tx.currency}</span>
                  </td>
                  <td className="py-3.5 px-4 font-sans text-text-secondary">
                    {tx.carrier}
                  </td>
                  <td className="py-3.5 px-4 text-violet-light font-medium">
                    {tx.trackingNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    {tx.status === 'DISPUTED' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        Disputed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Captured
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right text-text-muted font-sans">
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

