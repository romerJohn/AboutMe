import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { modalBackdropVariants, modalEntranceVariants } from '../../utils/motionVariants';

export interface CyberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  showCloseButton?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const CyberDialog: React.FC<CyberDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = '2xl',
  showCloseButton = true,
  className,
  ariaLabel
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
        >
          <motion.div
            ref={dialogRef}
            variants={modalEntranceVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'relative w-full rounded-2xl bg-[#0D111B] border border-cyan-500/35 p-6 sm:p-8 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto shadow-[0_0_35px_rgba(0,229,255,0.12)]',
              maxWidthStyles[maxWidth],
              className
            )}
          >
            {/* Header Lockup if title provided or close button visible */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="pr-6">
                  {title && (
                    <div className="text-lg font-bold text-white tracking-tight font-sans">
                      {title}
                    </div>
                  )}
                  {description && (
                    <div className="text-xs text-slate-400 mt-1 font-mono">
                      {description}
                    </div>
                  )}
                </div>

                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] cursor-pointer"
                    aria-label="Close dialog"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
