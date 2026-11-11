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
        'border-b border-[rgba(145,105,255,0.18)] flex gap-2 overflow-x-auto scrollbar-none',
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
                ? 'border-[#963FFF] text-[#F7F5FF] shadow-[0_4px_16px_-4px_rgba(150,63,255,0.5)]'
                : 'border-transparent text-[#AAA6C5] hover:text-[#F7F5FF] hover:border-[rgba(145,105,255,0.3)]'
            )}
          >
            {tab.label}
            {tab.badge !== undefined && (
              <span
                className={clsx(
                  'px-2 py-0.5 text-[10px] rounded-full font-mono',
                  isActive
                    ? 'bg-[#713BFF] text-white shadow-[0_0_10px_rgba(113,59,255,0.5)]'
                    : 'bg-[#181836] text-[#AAA6C5] border border-[rgba(145,105,255,0.2)]'
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
