'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Scale,
  FileCheck,
  Sparkles,
  Receipt,
  Layers,
  Settings,
  ShieldCheck,
  Activity,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Disputes Console', href: '/dashboard/disputes', icon: Scale },
    { label: 'Evidence Center', href: '/dashboard/evidence', icon: FileCheck },
    { label: 'AI Investigations', href: '/dashboard/investigations', icon: Sparkles },
    { label: 'Transactions', href: '/dashboard/transactions', icon: Receipt },
    { label: 'Audit Trail', href: '/dashboard/audit', icon: Layers },
    { label: 'Webhook Stream', href: '/dashboard/webhooks', icon: Activity },
    { label: 'Settings & PayPal', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0B0B18] text-[#F7F5FF] shrink-0 flex flex-col h-screen sticky top-0 border-r border-[rgba(145,105,255,0.18)] select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-[rgba(145,105,255,0.15)] bg-[#070711]/60">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-[#713BFF] to-[#963FFF] text-white shadow-[0_0_15px_rgba(113,59,255,0.5)] group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-4 h-4 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-sm tracking-tight text-[#F7F5FF]">ResolveAI</span>
            <span className="text-[9px] font-mono text-[#AAA6C5]">Console</span>
          </div>
        </Link>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[rgba(53,211,154,0.15)] text-[#35D39A] border border-[rgba(53,211,154,0.3)]">
          Sandbox
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto scrollbar-none">
        <span className="text-[10px] uppercase font-mono tracking-wider text-[#6E6A8A] px-3 mb-2 block font-semibold">
          Merchant Workspace
        </span>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#713BFF]/25 to-[#963FFF]/15 text-[#F7F5FF] border border-[rgba(150,63,255,0.4)] shadow-[0_0_15px_rgba(113,59,255,0.25)]'
                  : 'text-[#AAA6C5] hover:text-[#F7F5FF] hover:bg-[rgba(145,105,255,0.08)]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#963FFF]' : 'text-[#AAA6C5]'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Merchant Profile Strip */}
      <div className="p-3 border-t border-[rgba(145,105,255,0.15)] bg-[#070711]/70">
        <div className="p-2.5 rounded-xl bg-[#111126] border border-[rgba(145,105,255,0.15)] flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#713BFF] to-[#963FFF] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(113,59,255,0.4)]">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
            </div>
            <div className="truncate">
              <span className="block text-xs font-semibold text-[#F7F5FF] truncate leading-tight">
                {user?.name || 'Elena Rostova'}
              </span>
              <span className="block text-[10px] text-[#35D39A] font-mono leading-tight">
                MERCHANT
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-[#AAA6C5] hover:text-[#FF647C] hover:bg-[rgba(255,100,124,0.15)] rounded-lg transition-colors shrink-0"
            title="Log out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
