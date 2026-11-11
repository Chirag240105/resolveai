'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GridBackground } from '@/components/backgrounds/GridBackground';
import { AmbientGlow } from '@/components/backgrounds/AmbientGlow';
import { ShieldCheck, Mail, Lock, User, Building, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
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
    <div className="min-h-screen bg-[#070711] text-[#F7F5FF] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <GridBackground variant="hero" />
      <AmbientGlow position="center" color="dual" intensity="strong" />

      <div className="absolute top-8 left-8 z-20">
        <Link
          href="/"
          className="text-xs font-semibold text-[#AAA6C5] hover:text-white transition-colors flex items-center gap-1.5"
        >
          ← Back to ResolveAI
        </Link>
      </div>

      <div className="w-full max-w-md mx-auto z-10 space-y-6">
        <Card glow className="p-8 bg-[#111126]/90 border-[rgba(150,63,255,0.35)] shadow-[0_0_50px_rgba(113,59,255,0.25)] backdrop-blur-xl">
          <div className="mb-6 space-y-1">
            <h2 className="text-xl font-bold text-[#F7F5FF] tracking-tight">Create Merchant Account</h2>
            <p className="text-xs text-[#AAA6C5]">
              Connect your online store to start automated dispute investigations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-[rgba(255,100,124,0.15)] text-[#FF647C] text-xs border border-[rgba(255,100,124,0.35)] font-medium">
                {error}
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Elena Rostova"
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Business / Brand Name"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Apex Electronics & Audio Lab"
              leftIcon={<Building className="w-4 h-4" />}
              required
            />

            <Input
              label="Merchant Work Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="merchant@yourstore.com"
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password (min 8 characters)"
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
              Complete Registration
            </Button>

            <div className="pt-2 text-center text-xs text-[#AAA6C5]">
              Already have an account?{' '}
              <Link href="/login" className="text-[#963FFF] font-semibold hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
