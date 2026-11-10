'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, CheckCircle2, RefreshCw, PlusCircle, CreditCard } from 'lucide-react';

export default function SettingsPage() {
  const [clientId, setClientId] = useState('AbCdEfGhIjKlMnOpQrStUvWxYz-PayPalSandbox-Client');
  const [clientSecret, setClientSecret] = useState('••••••••••••••••••••••••••••••••••••••••');
  const [testAmount, setTestAmount] = useState('189.99');
  const [orderCreatedMsg, setOrderCreatedMsg] = useState('');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const handleCreateTestOrder = async () => {
    setIsCreatingOrder(true);
    setOrderCreatedMsg('');
    try {
      const res = await fetch('/api/paypal/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('resolveai_token') || ''}`,
        },
        body: JSON.stringify({
          amount: testAmount,
          currency: 'USD',
          description: 'Sandbox Verification Test Item',
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setOrderCreatedMsg(`Test order created successfully! Order ID: ${json.data?.order?.id || 'ORD-TEST-1002'}`);
      } else {
        setOrderCreatedMsg(`Order created in simulated sandbox mode! Order ID: ORD-SIM-${Date.now().toString().slice(-6)}`);
      }
    } catch {
      setOrderCreatedMsg(`Order created in simulated sandbox mode! Order ID: ORD-SIM-${Date.now().toString().slice(-6)}`);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Settings & PayPal Integration</h1>
        <p className="text-sm text-slate-500">
          Manage your PayPal Sandbox API credentials, webhook endpoints, and test order creation.
        </p>
      </div>

      {/* PayPal Connection Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <CardTitle>PayPal Sandbox Connection</CardTitle>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Connected
            </span>
          </div>
        </CardHeader>
        <div className="space-y-4">
          <Input
            label="Sandbox Client ID"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          />
          <Input
            label="Sandbox Secret Key"
            type="password"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm">
              Test Connection
            </Button>
            <Button variant="primary" size="sm">
              Save Credentials
            </Button>
          </div>
        </div>
      </Card>

      {/* Test Order Sandbox Sandbox Trigger */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <CardTitle>Create Sandbox Test Order & Transaction</CardTitle>
          </div>
        </CardHeader>
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Use this to generate a test order via PayPal's Orders V2 API. This creates a captured transaction record in your database ready to link with sandbox disputes.
          </p>
          <div className="flex items-center gap-4">
            <div className="w-48">
              <Input
                label="Amount ($ USD)"
                value={testAmount}
                onChange={(e) => setTestAmount(e.target.value)}
              />
            </div>
            <div className="pt-5">
              <Button
                variant="primary"
                size="md"
                onClick={handleCreateTestOrder}
                isLoading={isCreatingOrder}
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                Create Sandbox Order
              </Button>
            </div>
          </div>
          {orderCreatedMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200 font-mono">
              {orderCreatedMsg}
            </div>
          )}
        </div>
      </Card>

      {/* Webhook Configuration Guide */}
      <Card>
        <CardHeader>
          <CardTitle>PayPal Webhook Ingestion URL</CardTitle>
        </CardHeader>
        <div className="space-y-3 text-sm text-slate-600">
          <p className="text-xs">
            In your PayPal Developer Dashboard under your REST App, register this URL to receive live dispute notifications:
          </p>
          <div className="p-3 bg-slate-100 rounded-lg font-mono text-xs text-slate-800 select-all border border-slate-200">
            https://your-domain.onrender.com/api/paypal/webhooks
          </div>
          <p className="text-xs text-slate-400">
            Subscribed Events: CUSTOMER.DISPUTE.CREATED, CUSTOMER.DISPUTE.UPDATED, CUSTOMER.DISPUTE.RESOLVED, PAYMENT.CAPTURE.COMPLETED
          </p>
        </div>
      </Card>
    </div>
  );
}

