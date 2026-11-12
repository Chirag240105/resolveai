import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightAction, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#FFFFFF] mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#AAA6C5]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'w-full bg-[#0B0B18] border rounded-xl text-sm text-[#F7F5FF] placeholder:text-[#6E6A8A] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#713BFF]/40 focus:border-[#963FFF] py-3 shadow-inner',
              leftIcon ? 'pl-10 pr-3.5' : rightAction ? 'pl-3.5 pr-10' : 'px-3.5',
              error
                ? 'border-[#FF647C] focus:border-[#FF647C] focus:ring-[#FF647C]/30'
                : 'border-[rgba(145,105,255,0.20)] hover:border-[rgba(145,105,255,0.40)]',
              className
            )}
            {...props}
          />
          {rightAction && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
              {rightAction}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-[#FF647C] font-medium">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-[#AAA6C5]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
