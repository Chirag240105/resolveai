import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'violet' | 'purple' | 'blue' | 'success' | 'warning' | 'danger' | 'gray';
  size?: 'sm' | 'md';
  glow?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'violet',
  size = 'md',
  glow = false,
  ...props
}) => {
  const variants = {
    violet:
      'bg-[rgba(113,59,255,0.15)] text-[#d4c3ff] border-[rgba(145,105,255,0.35)]',
    purple:
      'bg-[rgba(150,63,255,0.18)] text-[#e8d5ff] border-[rgba(150,63,255,0.40)]',
    blue:
      'bg-[rgba(83,108,255,0.15)] text-[#b8c6ff] border-[rgba(83,108,255,0.35)]',
    success:
      'bg-[rgba(53,211,154,0.12)] text-[#35D39A] border-[rgba(53,211,154,0.35)]',
    warning:
      'bg-[rgba(245,185,66,0.12)] text-[#F5B942] border-[rgba(245,185,66,0.35)]',
    danger:
      'bg-[rgba(255,100,124,0.12)] text-[#FF647C] border-[rgba(255,100,124,0.35)]',
    gray:
      'bg-[rgba(255,255,255,0.06)] text-[#AAA6C5] border-[rgba(255,255,255,0.12)]',
  };

  const glowStyles = glow ? 'shadow-[0_0_15px_rgba(113,59,255,0.3)]' : '';

  const sizes = {
    sm: 'text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md',
    md: 'text-xs font-medium px-2.5 py-1 rounded-full',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 border backdrop-blur-md',
        variants[variant],
        sizes[size],
        glowStyles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
