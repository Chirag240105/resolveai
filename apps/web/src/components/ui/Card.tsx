import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
  variant?: 'default' | 'glass' | 'subtle';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  glow = false,
  variant = 'default',
  ...props
}) => {
  const variantStyles = {
    default:
      'bg-[#171329] text-white border border-[rgba(145,105,255,0.22)] shadow-[0_4px_20px_rgba(0,0,0,0.35)]',
    glass:
      'bg-[#171329]/95 text-white border border-[rgba(145,105,255,0.25)] backdrop-blur-md shadow-[0_4px_24px_rgba(112,71,235,0.15)]',
    subtle:
      'bg-[#141024] text-white border border-[rgba(145,105,255,0.18)]',
  };

  return (
    <div
      className={clsx(
        'rounded-2xl p-6 transition-all duration-200 relative',
        variantStyles[variant],
        hover &&
          'hover:border-[#8B5CF6] hover:shadow-[0_8px_30px_rgba(112,71,235,0.25)] hover:-translate-y-0.5',
        glow && 'shadow-[0_0_30px_rgba(112,71,235,0.35)] border-[#7047EB]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={clsx('border-b border-[rgba(145,105,255,0.18)] pb-4 mb-4', className)}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h3 className={clsx('font-heading text-base font-bold text-white tracking-tight', className)} {...props}>
    {children}
  </h3>
);
