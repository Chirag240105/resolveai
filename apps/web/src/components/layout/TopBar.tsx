'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Bell, ExternalLink, RefreshCw } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-[#070711]/85 backdrop-blur-xl border-b border-[rgba(145,105,255,0.18)] px-8 flex items-center justify-between sticky top-0 z-30 select-none">
      <div className="flex items-center gap-3">
        <Badge variant="success" size="sm" glow>
          <span className="w-1.5 h-1.5 rounded-full bg-[#35D39A] animate-pulse" />
          PayPal Sandbox Connected
        </Badge>
        <span className="hidden md:inline-block text-xs font-mono text-[#6E6A8A]">
          api-m.sandbox.paypal.com
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
            Public Site
          </Button>
        </Link>

        <div className="h-4 w-px bg-[rgba(145,105,255,0.2)]" />

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#AAA6C5] hidden sm:inline">Store:</span>
          <span className="text-xs font-semibold text-[#F7F5FF] bg-[#111126] px-2.5 py-1 rounded-lg border border-[rgba(145,105,255,0.2)]">
            Apex Electronics Lab
          </span>
        </div>
      </div>
    </header>
  );
};
