import React from 'react';
import { clsx } from 'clsx';

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'animate-pulse bg-[#161633] border border-[rgba(145,105,255,0.08)] rounded-xl',
        className
      )}
      {...props}
    />
  );
};
