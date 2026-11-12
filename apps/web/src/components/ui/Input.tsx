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
          <label className="block text-xs font-semibold uppercase tracking-wider text-white mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A09BB8]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'w-full bg-[#141024] border rounded-xl text-sm text-white placeholder:text-[#A09BB8] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7047EB]/30 focus:border-[#8B5CF6] py-2.5 shadow-sm',
              leftIcon ? 'pl-10 pr-3.5' : rightAction ? 'pl-3.5 pr-10' : 'px-3.5',
              error
                ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20'
                : 'border-[rgba(145,105,255,0.25)] hover:border-[#8B5CF6]',
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
        {error && <p className="mt-1.5 text-xs text-[#EF4444] font-medium">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-[#D4CEF5]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
