import React from 'react';
import { clsx } from 'clsx';

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div
      className={clsx('animate-pulse bg-slate-200/80 rounded-md', className)}
      {...props}
    />
  );
};

