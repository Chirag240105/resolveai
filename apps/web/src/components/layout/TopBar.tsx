'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ExternalLink } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { user } = useAuth();
  const storeName =
    user?.businessName ||
    (user?.name ? `${user.name}'s Store` : 'My Merchant Store');

  return (
    <header className="h-16 bg-[#141024]/90 backdrop-blur-md border-b border-[rgba(145,105,255,0.18)] px-8 flex items-center justify-between sticky top-0 z-20 select-none shadow-sm">
      <div className="flex items-center gap-3">
        <Badge variant="success" size="sm" glow>
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          PayPal Sandbox Connected
        </Badge>
        <span className="hidden md:inline-block text-xs font-mono text-[#D4CEF5]">
          api-m.sandbox.paypal.com
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/10" rightIcon={<ExternalLink className="w-3.5 h-3.5 text-white" />}>
            Public Site
          </Button>
        </Link>

        <div className="h-4 w-px bg-[rgba(145,105,255,0.2)]" />

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#EAE5F5] hidden sm:inline font-medium">Store:</span>
          <span className="text-xs font-semibold text-white bg-[#171329] px-2.5 py-1 rounded-lg border border-[rgba(145,105,255,0.25)] truncate max-w-[200px]">
            {storeName}
          </span>
        </div>
      </div>
    </header>
  );
};
