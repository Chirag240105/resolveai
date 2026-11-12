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
    if (v >= 80) return 'bg-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.5)]';
    if (v >= 50) return 'bg-[#F59E0B] shadow-[0_0_10px_rgba(245,158,11,0.5)]';
    return 'bg-[#EF4444] shadow-[0_0_10px_rgba(239,68,68,0.5)]';
  };

  return (
    <div className={clsx('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold text-[#EAE5F5] mb-1.5 font-mono">
          <span>Readiness Score</span>
          <span className="text-white font-bold">{clamped}%</span>
        </div>
      )}
      <div
        className={clsx(
          'w-full bg-[#141024] border border-[rgba(145,105,255,0.2)] rounded-full overflow-hidden p-0.5',
          size === 'sm' ? 'h-2' : 'h-3'
        )}
      >
        <div
          className={clsx('h-full transition-all duration-700 rounded-full', getColor(clamped))}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
