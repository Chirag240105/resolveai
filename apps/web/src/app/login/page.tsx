'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { GridBackground } from '@/components/backgrounds/GridBackground';
import { AmbientGlow } from '@/components/backgrounds/AmbientGlow';
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
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
    <div className="min-h-screen bg-[#070711] text-[#F7F5FF] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <GridBackground variant="hero" />
      <AmbientGlow position="center" color="dual" intensity="strong" />

      {/* Back to Home Link */}
      <div className="absolute top-8 left-8 z-20">
        <Link
          href="/"
          className="text-xs font-semibold text-[#AAA6C5] hover:text-white transition-colors flex items-center gap-1.5"
        >
          ← Back to ResolveAI
        </Link>
      </div>

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left Brand Panel */}
        <div className="lg:col-span-6 space-y-6 text-left hidden lg:block">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-[#713BFF] to-[#963FFF] text-white shadow-[0_0_30px_rgba(113,59,255,0.6)]">
            <ShieldCheck className="w-8 h-8 fill-current" />
          </div>

          <h1 className="text-4xl font-extrabold text-[#F7F5FF] tracking-tight leading-tight">
            Protect your merchant revenue with intelligence.
          </h1>

          <p className="text-sm text-[#AAA6C5] leading-relaxed max-w-md">
            Connect your PayPal sandbox account to monitor disputes, uncover verified evidence, score completeness, and prepare citation-backed contestations.
          </p>

          <div className="space-y-3 pt-2 text-xs text-[#AAA6C5]">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#35D39A]" />
              <span>Hard Rule: AI never submits without human approval</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#536CFF]" />
              <span>Evidence traceable to carrier tracking & PayPal capture IDs</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#963FFF]" />
              <span>Full compliance audit ledger for every transaction</span>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <Card glow className="p-8 bg-[#111126]/90 border-[rgba(150,63,255,0.35)] shadow-[0_0_50px_rgba(113,59,255,0.25)] backdrop-blur-xl">
            <div className="mb-6 space-y-1">
              <h2 className="text-xl font-bold text-[#F7F5FF] tracking-tight">Merchant Sign In</h2>
              <p className="text-xs text-[#AAA6C5]">
                Enter your merchant credentials to access your dispute dossier.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-[rgba(255,100,124,0.15)] text-[#FF647C] text-xs border border-[rgba(255,100,124,0.35)] font-medium">
                  {error}
                </div>
              )}

              <Input
                label="Merchant Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="merchant@resolveai.test"
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                rightAction={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#AAA6C5] hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                required
              />

              <Button type="submit" variant="glow" size="lg" className="w-full mt-2" isLoading={isLoading}>
                Sign In to Console
              </Button>

              <div className="pt-2 text-center text-xs text-[#AAA6C5]">
                New merchant?{' '}
                <Link href="/register" className="text-[#963FFF] font-semibold hover:underline">
                  Create merchant account
                </Link>
              </div>
            </form>

            {/* Pre-filled Demo Credentials Box */}
            <div className="mt-6 p-3.5 bg-[#0B0B18] rounded-xl border border-[rgba(145,105,255,0.2)] text-xs text-center space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#d4c3ff] font-semibold block">
                Pre-filled Sandbox Credentials
              </span>
              <span className="font-mono text-[#AAA6C5] block text-[11px]">
                merchant@resolveai.test / DemoPassword123!
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
