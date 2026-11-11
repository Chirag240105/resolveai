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
      'bg-[#111126]/90 border border-[rgba(164,125,255,0.20)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-md',
    glass:
      'bg-gradient-to-br from-[#1C173E]/75 via-[#12112A]/85 to-[#0B0A1C]/95 border border-[rgba(164,125,255,0.26)] shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl',
    subtle:
      'bg-[#0B0B18]/85 border border-[rgba(164,125,255,0.14)] backdrop-blur-sm',
  };

  return (
    <div
      className={clsx(
        'rounded-2xl p-6 transition-all duration-300 relative',
        variantStyles[variant],
        hover &&
          'hover:border-[rgba(164,125,255,0.55)] hover:shadow-[0_0_35px_rgba(113,59,255,0.25),inset_0_1px_0_rgba(255,255,255,0.12)] hover:-translate-y-0.5',
        glow && 'shadow-[0_0_40px_rgba(113,59,255,0.30)] border-[rgba(164,125,255,0.50)]',
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
    className={clsx('border-b border-[rgba(145,105,255,0.12)] pb-4 mb-4', className)}
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
  <h3 className={clsx('font-heading text-base font-semibold text-[#F7F5FF] tracking-tight', className)} {...props}>
    {children}
  </h3>
);
