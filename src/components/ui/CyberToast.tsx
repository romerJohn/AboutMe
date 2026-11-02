import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, 'id'>) => string;
  dismissToast: (id: string) => void;
  success: (title: string, message?: string) => string;
  error: (title: string, message?: string) => string;
  warning: (title: string, message?: string) => string;
  info: (title: string, message?: string) => string;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message, duration = 4000 }: Omit<ToastItem, 'id'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }

      return id;
    },
    [dismissToast]
  );

  const success = useCallback(
    (title: string, message?: string) => showToast({ type: 'success', title, message }),
    [showToast]
  );

  const error = useCallback(
    (title: string, message?: string) => showToast({ type: 'error', title, message }),
    [showToast]
  );

  const warning = useCallback(
    (title: string, message?: string) => showToast({ type: 'warning', title, message }),
    [showToast]
  );

  const info = useCallback(
    (title: string, message?: string) => showToast({ type: 'info', title, message }),
    [showToast]
  );

  const typeConfig: Record<
    ToastType,
    { icon: React.ReactNode; borderColor: string; glowColor: string; textColor: string }
  > = {
    success: {
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
      borderColor: 'border-emerald-500/40',
      glowColor: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]',
      textColor: 'text-emerald-300'
    },
    error: {
      icon: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
      borderColor: 'border-rose-500/40',
      glowColor: 'shadow-[0_0_20px_rgba(244,63,94,0.2)]',
      textColor: 'text-rose-300'
    },
    warning: {
      icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
      borderColor: 'border-amber-500/40',
      glowColor: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]',
      textColor: 'text-amber-300'
    },
    info: {
      icon: <Info className="w-4 h-4 text-[#00E5FF] shrink-0" />,
      borderColor: 'border-cyan-500/40',
      glowColor: 'shadow-[0_0_20px_rgba(0,229,255,0.2)]',
      textColor: 'text-[#00E5FF]'
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, dismissToast, success, error, warning, info }}>
      {children}

      {/* Floating Cyber Toast Container (Top-Right on desktop, Top-Center on mobile) */}
      <aside
        className="fixed top-5 right-5 sm:top-6 sm:right-6 z-[70] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
        aria-live="polite"
        aria-label="Notification Center"
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            const cfg = typeConfig[toast.type];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className={cn(
                  'pointer-events-auto rounded-xl p-3.5 bg-[#0D111B]/95 backdrop-blur-md border shadow-2xl flex items-start justify-between gap-3',
                  cfg.borderColor,
                  cfg.glowColor
                )}
                role="status"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="mt-0.5">{cfg.icon}</div>
                  <div className="min-w-0">
                    <div className={cn('text-xs font-mono font-semibold truncate', cfg.textColor)}>
                      {toast.title}
                    </div>
                    {toast.message && (
                      <div className="text-[11px] text-slate-300 mt-0.5 leading-normal font-sans">
                        {toast.message}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => dismissToast(toast.id)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                  aria-label="Dismiss notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </aside>
    </ToastContext.Provider>
  );
};
