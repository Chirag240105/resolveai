'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ShieldCheck, Mail, Lock, User, Building } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
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
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/30 mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Register Merchant</h2>
          <p className="text-xs text-slate-400">
            Connect your PayPal merchant account to start automated investigations
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
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Elena Rostova"
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Business / Store Name"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Apex Electronics Lab"
              leftIcon={<Building className="w-4 h-4" />}
              required
            />

            <Input
              label="Work Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="merchant@yourstore.com"
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password (min 8 characters)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Button type="submit" variant="primary" className="w-full py-2.5" isLoading={isLoading}>
              Create Merchant Account
            </Button>

            <div className="pt-2 text-center text-xs text-slate-500">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 font-semibold hover:underline">
                Sign in
              </a>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

