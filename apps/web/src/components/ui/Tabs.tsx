'use client';

import React from 'react';
import { clsx } from 'clsx';

interface Tab {
  id: string;
  label: string;
  badge?: number | string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={clsx('border-b border-slate-200 flex gap-2 overflow-x-auto', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'pb-3 pt-2 px-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2',
              isActive
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            )}
          >
            {tab.label}
            {tab.badge !== undefined && (
              <span
                className={clsx(
                  'px-1.5 py-0.5 text-xs rounded-full',
                  isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

