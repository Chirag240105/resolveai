'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Bell, LogOut, Shield } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
          Connected to PayPal Sandbox
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        {/* User profile */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-semibold text-slate-900 leading-tight">
              {user?.name || 'Merchant Owner'}
            </span>
            <span className="block text-[11px] text-slate-500 leading-tight font-mono">
              {user?.role || 'MERCHANT'}
            </span>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors ml-2"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

