import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl'
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-2 sm:p-4 text-center">
        <div
          className={`relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 w-full ${maxWidth} border border-gold/20 animate-in zoom-in-95`}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 bg-royal-black px-4 sm:px-6 py-3.5 sm:py-4 text-white">
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-gold-light tracking-wide">{title}</h3>
              {subtitle && <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};
