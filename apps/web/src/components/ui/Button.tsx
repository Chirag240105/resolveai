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
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#070711] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

  const variants = {
    primary:
      'bg-gradient-to-r from-[#713BFF] to-[#963FFF] hover:from-[#7e47ff] hover:to-[#a34eff] text-white shadow-[0_0_25px_rgba(113,59,255,0.35)] border border-[rgba(150,63,255,0.4)] focus:ring-[#963FFF]',
    glow:
      'bg-gradient-to-r from-[#713BFF] via-[#963FFF] to-[#536CFF] text-white shadow-[0_0_35px_rgba(150,63,255,0.5)] border border-[rgba(255,255,255,0.25)] hover:shadow-[0_0_45px_rgba(150,63,255,0.7)] hover:brightness-110 focus:ring-[#536CFF]',
    secondary:
      'bg-[#111126]/90 hover:bg-[#1A1836] text-[#F7F5FF] hover:text-white border border-[rgba(164,125,255,0.30)] hover:border-[rgba(164,125,255,0.60)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_16px_rgba(0,0,0,0.3)] backdrop-blur-xl focus:ring-[#713BFF]',
    outline:
      'bg-[#121128]/80 hover:bg-[#1E1B3E] text-white hover:text-white font-semibold border border-[rgba(164,125,255,0.45)] hover:border-[rgba(175,135,255,0.85)] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-xl hover:shadow-[0_0_25px_rgba(113,59,255,0.35)] focus:ring-[#713BFF]',
    ghost:
      'bg-transparent hover:bg-[rgba(145,105,255,0.10)] text-[#AAA6C5] hover:text-[#F7F5FF] focus:ring-[#713BFF]',
    danger:
      'bg-gradient-to-r from-[#FF4B68] to-[#FF647C] text-white shadow-[0_0_20px_rgba(255,100,124,0.35)] border border-[rgba(255,100,124,0.4)] hover:brightness-105 focus:ring-[#FF647C]',
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
