'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glow' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#070711] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none text-white';

  const variants = {
    primary:
      'bg-gradient-to-r from-[#7047EB] to-[#5128C7] hover:from-[#7D55F2] hover:to-[#5B2FD6] text-white shadow-[0_2px_8px_rgba(112,71,235,0.35)] border border-transparent hover:-translate-y-0.5 focus:ring-[#7047EB]',
    glow:
      'bg-gradient-to-r from-[#7047EB] via-[#8B5CF6] to-[#5128C7] text-white shadow-[0_4px_20px_rgba(112,71,235,0.45)] border border-white/20 hover:shadow-[0_6px_28px_rgba(112,71,235,0.6)] hover:-translate-y-0.5 focus:ring-[#7047EB]',
    secondary:
      'bg-[#171329] hover:bg-[#201A38] text-white border border-[rgba(145,105,255,0.25)] hover:border-[#8B5CF6] shadow-sm hover:-translate-y-0.5 focus:ring-[#7047EB]',
    outline:
      'bg-transparent hover:bg-white/10 text-white font-semibold border border-[rgba(145,105,255,0.35)] hover:border-[#8B5CF6] shadow-sm hover:-translate-y-0.5 focus:ring-[#7047EB]',
    ghost:
      'bg-transparent hover:bg-white/10 text-[#EAE5F5] hover:text-white focus:ring-[#7047EB]',
    danger:
      'bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white shadow-[0_2px_8px_rgba(239,68,68,0.3)] hover:brightness-105 focus:ring-[#EF4444]',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-current" /> : leftIcon}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
