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
    if (v >= 80) return 'bg-[#35D39A] shadow-[0_0_10px_rgba(53,211,154,0.5)]';
    if (v >= 50) return 'bg-[#F5B942] shadow-[0_0_10px_rgba(245,185,66,0.5)]';
    return 'bg-[#FF647C] shadow-[0_0_10px_rgba(255,100,124,0.5)]';
  };

  return (
    <div className={clsx('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold text-[#AAA6C5] mb-1.5 font-mono">
          <span>Readiness Score</span>
          <span className="text-[#F7F5FF]">{clamped}%</span>
        </div>
      )}
      <div
        className={clsx(
          'w-full bg-[#111126] border border-[rgba(145,105,255,0.15)] rounded-full overflow-hidden p-0.5',
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
