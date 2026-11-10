'use client';

import React from 'react';
import Link from 'next/navigation';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Scale, Activity, Settings, ShieldCheck, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Disputes Console', href: '/disputes', icon: Scale },
    { label: 'Webhook Feed', href: '/webhooks', icon: Activity },
    { label: 'Settings & PayPal', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white shrink-0 flex flex-col h-screen sticky top-0 border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
        <div className="p-2 bg-blue-600 rounded-lg text-white shadow-md shadow-blue-500/20">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
            ResolveAI
            <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30">
              PayPal
            </span>
          </h1>
          <p className="text-[11px] text-slate-400">Dispute Intelligence</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <a
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* Bottom Status Box */}
      <div className="p-4 m-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span>Sandbox Mode</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <p className="text-slate-300 font-mono text-[11px]">api-m.sandbox.paypal.com</p>
        <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between text-slate-400">
          <span className="text-[10px]">Gemini 2.5 Flash</span>
          <span className="text-[10px] text-emerald-400 font-semibold">Active</span>
        </div>
      </div>
    </aside>
  );
};

