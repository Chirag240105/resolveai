'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ShieldCheck, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('merchant@resolveai.test');
  const [password, setPassword] = useState('DemoPassword123!');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/30 mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">ResolveAI</h2>
          <p className="text-xs text-slate-400">
            Dispute Investigation & Evidence Intelligence for PayPal
          </p>
        </div>

        <Card className="p-8 shadow-2xl border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
                {error}
              </div>
            )}

            <Input
              label="Merchant Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="merchant@yourstore.com"
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Button type="submit" variant="primary" className="w-full py-2.5" isLoading={isLoading}>
              Sign In to Dashboard
            </Button>

            <div className="pt-2 text-center text-xs text-slate-500">
              Don't have an account?{' '}
              <a href="/register" className="text-blue-600 font-semibold hover:underline">
                Create merchant account
              </a>
            </div>
          </form>
        </Card>

        {/* Demo Credentials Box */}
        <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700 text-xs text-slate-400 text-center">
          <span className="font-semibold text-slate-300 block mb-1">Pre-filled Demo Credentials:</span>
          <span className="font-mono text-slate-300">merchant@resolveai.test / DemoPassword123!</span>
        </div>
      </div>
    </div>
  );
}

