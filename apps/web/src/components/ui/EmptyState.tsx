import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#111126]/60 rounded-2xl border border-dashed border-[rgba(145,105,255,0.25)] backdrop-blur-sm">
      <div className="p-3.5 bg-[rgba(113,59,255,0.12)] text-[#963FFF] rounded-2xl mb-4 border border-[rgba(150,63,255,0.25)] shadow-[0_0_20px_rgba(113,59,255,0.2)]">
        {icon || <Inbox className="w-8 h-8" />}
      </div>
      <h4 className="text-base font-semibold text-[#F7F5FF] tracking-tight">{title}</h4>
      <p className="text-sm text-[#AAA6C5] max-w-sm mt-1.5 mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
