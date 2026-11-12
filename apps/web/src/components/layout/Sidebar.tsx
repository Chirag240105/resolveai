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
    <aside className="w-64 bg-[#171329] text-white shrink-0 flex flex-col h-screen sticky top-0 border-r border-[#26203D] select-none z-30">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-[#26203D] bg-[#141024]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-[#7047EB] to-[#5128C7] text-white shadow-[0_2px_10px_rgba(112,71,235,0.4)] group-hover:scale-105 transition-transform duration-200">
            <ShieldCheck className="w-4 h-4 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-sm tracking-tight text-white">ResolveAI</span>
            <span className="text-[9px] font-mono text-[#A09BB8]">Console</span>
          </div>
        </Link>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
          Sandbox
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto scrollbar-none">
        <span className="text-[10px] uppercase font-mono tracking-wider text-[#7E779A] px-3 mb-2.5 block font-bold">
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
                  ? 'bg-[#7047EB] text-white shadow-[0_2px_12px_rgba(112,71,235,0.4)]'
                  : 'text-[#A09BB8] hover:text-white hover:bg-[#231E3D]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8D86A8]'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Merchant Profile Strip */}
      <div className="p-3 border-t border-[#26203D] bg-[#141024]">
        <div className="p-2.5 rounded-xl bg-[#201A36] border border-[#2D254C] flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#7047EB] to-[#5128C7] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(112,71,235,0.35)]">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
            </div>
            <div className="truncate">
              <span className="block text-xs font-semibold text-white truncate leading-tight">
                {user?.name || 'Elena Rostova'}
              </span>
              <span className="block text-[10px] text-emerald-400 font-mono leading-tight font-medium">
                MERCHANT
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-[#A09BB8] hover:text-[#EF4444] hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
            title="Log out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
