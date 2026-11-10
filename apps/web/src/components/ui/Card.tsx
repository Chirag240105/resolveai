import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = false, ...props }) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl border border-slate-200/80 shadow-sm p-6',
        hover && 'transition-shadow hover:shadow-md hover:border-slate-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={clsx('border-b border-slate-100 pb-4 mb-4', className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className, ...props }) => (
  <h3 className={clsx('text-base font-semibold text-slate-900', className)} {...props}>
    {children}
  </h3>
);

