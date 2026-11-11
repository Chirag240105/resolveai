'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark backdrop blur */}
      <div
        className="fixed inset-0 bg-[#070711]/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      {/* Glass card container */}
      <div className="relative bg-[#111126] border border-[rgba(150,63,255,0.35)] shadow-[0_0_50px_rgba(113,59,255,0.25)] rounded-2xl w-full max-w-lg overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(145,105,255,0.15)] bg-[#0B0B18]/60">
          <h3 className="font-semibold text-[#F7F5FF] text-base tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="text-[#AAA6C5] hover:text-[#F7F5FF] rounded-lg p-1.5 hover:bg-[rgba(145,105,255,0.12)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto text-[#AAA6C5] text-sm">{children}</div>
        {footer && (
          <div className="bg-[#0B0B18]/80 px-6 py-4 border-t border-[rgba(145,105,255,0.15)] flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
