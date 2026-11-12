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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#070711]/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      {/* Modal Card */}
      <div className="relative bg-[#171329] border border-[rgba(145,105,255,0.3)] shadow-[0_20px_60px_rgba(0,0,0,0.6)] rounded-2xl w-full max-w-lg overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 text-white">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(145,105,255,0.2)] bg-[#141024]">
          <h3 className="font-semibold text-white text-base tracking-tight font-heading">{title}</h3>
          <button
            onClick={onClose}
            className="text-[#A09BB8] hover:text-white rounded-lg p-1.5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto text-[#EAE5F5] text-sm">{children}</div>
        {footer && (
          <div className="bg-[#141024] px-6 py-4 border-t border-[rgba(145,105,255,0.2)] flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
