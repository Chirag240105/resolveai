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
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#171329] rounded-2xl border border-dashed border-[rgba(145,105,255,0.25)] text-white">
      <div className="p-3.5 bg-[#7047EB]/20 text-[#8B5CF6] rounded-2xl mb-4 border border-[#7047EB]/35 shadow-[0_0_20px_rgba(112,71,235,0.2)]">
        {icon || <Inbox className="w-8 h-8 text-white" />}
      </div>
      <h4 className="text-base font-semibold text-white tracking-tight font-heading">{title}</h4>
      <p className="text-sm text-[#EAE5F5] max-w-sm mt-1.5 mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
