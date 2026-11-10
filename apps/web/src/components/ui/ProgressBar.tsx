import React from 'react';
import { clsx } from 'clsx';

interface ProgressBarProps {
  value: number; // 0 to 100
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  showLabel = false,
  className,
  size = 'md',
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const getColor = (v: number) => {
    if (v >= 80) return 'bg-emerald-500';
    if (v >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className={clsx('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
          <span>Completeness</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div
        className={clsx(
          'w-full bg-slate-100 rounded-full overflow-hidden',
          size === 'sm' ? 'h-1.5' : 'h-2.5'
        )}
      >
        <div
          className={clsx('h-full transition-all duration-500 rounded-full', getColor(clamped))}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

