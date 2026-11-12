'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('merchant@resolveai.test');
  const [password, setPassword] = useState('DemoPassword123!');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-[#0B0819] text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#7047EB]/20 to-transparent pointer-events-none rounded-full blur-3xl opacity-70" />

      {/* Back to Home Link */}
      <div className="absolute top-8 left-8 z-20">
        <Link
          href="/"
          className="text-xs font-semibold text-[#D4CEF5] hover:text-white transition-colors flex items-center gap-1.5"
        >
          ← Back to ResolveAI
        </Link>
      </div>

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 py-12">
        {/* Left Brand Panel */}
        <div className="lg:col-span-6 space-y-6 text-left hidden lg:block">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-[#7047EB] to-[#5128C7] text-white shadow-[0_10px_25px_rgba(112,71,235,0.4)]">
            <ShieldCheck className="w-8 h-8 fill-current" />
          </div>

          <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight font-heading">
            Protect your merchant revenue with intelligence.
          </h1>

          <p className="text-sm text-[#EAE5F5] leading-relaxed max-w-md">
            Connect your PayPal sandbox account to monitor disputes, uncover verified evidence, score completeness, and prepare citation-backed contestations.
          </p>

          <div className="space-y-3 pt-2 text-xs text-[#EAE5F5]">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span className="font-medium text-white">Hard Rule: AI never submits without human approval</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#8B5CF6]" />
              <span className="font-medium text-white">Evidence traceable to carrier tracking & PayPal capture IDs</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" />
              <span className="font-medium text-white">Full compliance audit ledger for every transaction</span>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <Card className="p-8 bg-[#171329] border-[rgba(145,105,255,0.25)] shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl text-white">
            <div className="mb-6 space-y-1">
              <h2 className="text-xl font-bold text-white tracking-tight font-heading">Merchant Sign In</h2>
              <p className="text-xs text-[#EAE5F5]">
                Enter your merchant credentials to access your dispute dossier.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-[#EF4444]/15 text-[#EF4444] text-xs border border-[#EF4444]/30 font-medium">
                  {error}
                </div>
              )}

              <Input
                label="Merchant Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="merchant@resolveai.test"
                leftIcon={<Mail className="w-4 h-4 text-white" />}
                required
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                leftIcon={<Lock className="w-4 h-4 text-white" />}
                rightAction={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#D4CEF5] hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-white" /> : <Eye className="w-4 h-4 text-white" />}
                  </button>
                }
                required
              />

              <Button type="submit" variant="primary" size="lg" className="w-full mt-2" isLoading={isLoading}>
                Sign In to Console
              </Button>

              <div className="pt-2 text-center text-xs text-[#EAE5F5]">
                New merchant?{' '}
                <Link href="/register" className="text-[#8B5CF6] font-semibold hover:underline">
                  Create merchant account
                </Link>
              </div>
            </form>

            {/* Pre-filled Demo Credentials Box */}
            <div className="mt-6 p-3.5 bg-[#141024] rounded-xl border border-[rgba(145,105,255,0.2)] text-xs text-center space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#8B5CF6] font-bold block">
                Pre-filled Sandbox Credentials
              </span>
              <span className="font-mono text-white block text-[11px]">
                merchant@resolveai.test / DemoPassword123!
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
