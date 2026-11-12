'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ShieldCheck, Mail, Lock, User, Building, Eye, EyeOff, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: 'Weak', color: '#EF4444' };
  if (score <= 4) return { score, label: 'Fair', color: '#F59E0B' };
  return { score, label: 'Strong', color: '#10B981' };
}

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  const passwordsMatch = confirmPassword.length === 0 || password === confirmPassword;

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await register(name.trim(), email.trim().toLowerCase(), password, businessName.trim() || undefined);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
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
              <div className="p-3 rounded-xl bg-[#EF4444]/15 text-[#EF4444] text-xs border border-[#EF4444]/30 font-medium flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setFieldErrors(prev => ({ ...prev, name: '' })); }}
              placeholder="Elena Rostova"
              leftIcon={<User className="w-4 h-4 text-white" />}
              error={fieldErrors.name}
              required
            />

            <Input
              label="Business / Brand Name"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Apex Electronics & Audio Lab"
              leftIcon={<Building className="w-4 h-4 text-white" />}
              helperText="Optional — defaults to your name"
            />

            <Input
              label="Merchant Work Email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: '' })); }}
              placeholder="merchant@yourstore.com"
              leftIcon={<Mail className="w-4 h-4 text-white" />}
              error={fieldErrors.email}
              required
            />

            <div>
              <Input
                label="Password (min 8 characters)"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setFieldErrors(prev => ({ ...prev, password: '' })); }}
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
                error={fieldErrors.password}
                required
              />
              {/* Password strength bar */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: i <= passwordStrength.score ? passwordStrength.color : '#2D254C',
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-medium font-mono" style={{ color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            <div>
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors(prev => ({ ...prev, confirmPassword: '' })); }}
                placeholder="••••••••••••"
                leftIcon={<Lock className="w-4 h-4 text-white" />}
                rightAction={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-[#D4CEF5] hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 text-white" /> : <Eye className="w-4 h-4 text-white" />}
                  </button>
                }
                error={fieldErrors.confirmPassword}
                required
              />
              {/* Password match indicator */}
              {confirmPassword.length > 0 && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  {passwordsMatch ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                      <span className="text-[10px] text-[#10B981] font-medium">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-[#EF4444]" />
                      <span className="text-[10px] text-[#EF4444] font-medium">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Complete Registration'}
            </Button>

            <div className="pt-2 text-center text-xs text-[#EAE5F5]">
              Already have an account?{' '}
              <Link href="/login" className="text-[#8B5CF6] font-semibold hover:underline">
                Sign in to console
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
