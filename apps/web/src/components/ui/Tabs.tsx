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
    <div
      className={clsx(
        'border-b border-[rgba(145,105,255,0.22)] flex gap-1 overflow-x-auto scrollbar-none',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'pb-3 pt-2.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all duration-200 flex items-center gap-2 select-none relative',
              isActive
                ? 'border-[#8B5CF6] text-white'
                : 'border-transparent text-[#EAE5F5] hover:text-white hover:border-[#8B5CF6]/50'
            )}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={clsx(
                  'px-2 py-0.5 text-[10px] rounded-full font-mono',
                  isActive
                    ? 'bg-[#7047EB] text-white'
                    : 'bg-[#171329] text-[#EAE5F5] border border-[rgba(145,105,255,0.3)]'
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
