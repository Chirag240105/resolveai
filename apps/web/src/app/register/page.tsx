'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ShieldCheck, Mail, Lock, User, Building, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await register(name, email, password, businessName);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0819] text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#7047EB]/20 to-transparent pointer-events-none rounded-full blur-3xl opacity-70" />

      <div className="absolute top-8 left-8 z-20">
        <Link
          href="/"
          className="text-xs font-semibold text-[#D4CEF5] hover:text-white transition-colors flex items-center gap-1.5"
        >
          ← Back to ResolveAI
        </Link>
      </div>

      <div className="w-full max-w-md mx-auto z-10 space-y-6 py-12">
        <div className="flex justify-center">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-[#7047EB] to-[#5128C7] text-white shadow-[0_10px_25px_rgba(112,71,235,0.4)]">
            <ShieldCheck className="w-7 h-7 fill-current" />
          </div>
        </div>

        <Card className="p-8 bg-[#171329] border-[rgba(145,105,255,0.25)] shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl text-white">
          <div className="mb-6 space-y-1 text-center">
            <h2 className="text-xl font-bold text-white tracking-tight font-heading">Create Merchant Account</h2>
            <p className="text-xs text-[#EAE5F5]">
              Connect your online store to start automated dispute investigations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-[#EF4444]/15 text-[#EF4444] text-xs border border-[#EF4444]/30 font-medium">
                {error}
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Elena Rostova"
              leftIcon={<User className="w-4 h-4 text-white" />}
              required
            />

            <Input
              label="Business / Brand Name"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Apex Electronics & Audio Lab"
              leftIcon={<Building className="w-4 h-4 text-white" />}
              required
            />

            <Input
              label="Merchant Work Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="merchant@yourstore.com"
              leftIcon={<Mail className="w-4 h-4 text-white" />}
              required
            />

            <Input
              label="Password (min 8 characters)"
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
              Complete Registration
            </Button>

            <div className="pt-2 text-center text-xs text-[#EAE5F5]">
              Already have an account?{' '}
              <Link href="/login" className="text-[#8B5CF6] font-semibold hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
