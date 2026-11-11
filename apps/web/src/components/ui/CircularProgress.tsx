'use client';

import React from 'react';

interface CircularProgressProps {
  score: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  score,
  size = 130,
  strokeWidth = 10,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, score));
  const offset = circumference - (clamped / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return '#35D39A'; // emerald
    if (s >= 50) return '#F5B942'; // amber
    return '#FF647C'; // danger
  };

  const getGlow = (s: number) => {
    if (s >= 80) return 'rgba(53, 211, 154, 0.4)';
    if (s >= 50) return 'rgba(245, 185, 66, 0.4)';
    return 'rgba(255, 100, 124, 0.4)';
  };

  return (
    <div
      className="relative inline-flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(145, 105, 255, 0.12)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(clamped)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: `drop-shadow(0 0 8px ${getGlow(clamped)})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tracking-tight text-[#F7F5FF] font-mono">
          {clamped}%
        </span>
        <span className="text-[9px] uppercase tracking-wider font-semibold text-[#AAA6C5]">
          Completeness
        </span>
      </div>
    </div>
  );
};
