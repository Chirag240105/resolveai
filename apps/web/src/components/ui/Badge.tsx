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
      'bg-[#7047EB]/20 text-[#A78BFA] border-[#7047EB]/35',
    purple:
      'bg-[#7047EB]/20 text-white border-[#7047EB]/40',
    blue:
      'bg-[#4338CA]/20 text-[#93C5FD] border-[#4338CA]/35',
    success:
      'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30',
    warning:
      'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30',
    danger:
      'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30',
    gray:
      'bg-white/10 text-white border-white/15',
  };

  const glowStyles = glow ? 'shadow-[0_2px_12px_rgba(112,71,235,0.35)]' : '';

  const sizes = {
    sm: 'text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md',
    md: 'text-xs font-medium px-2.5 py-1 rounded-full',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 border backdrop-blur-md font-sans',
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
