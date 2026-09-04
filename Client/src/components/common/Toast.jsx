import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

/**
 * Premium SaaS Toast Notification Component
 * Features rounded-2xl container, pure white background, soft multi-layer shadow, and semantic indicators.
 */
export default function Toast({
  isOpen,
  message,
  type = 'success',
  onClose,
  title,
}) {
  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />,
    error: <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />,
  };

  const borders = {
    success: 'border-l-4 border-l-emerald-500 bg-white',
    error: 'border-l-4 border-l-rose-500 bg-white',
    warning: 'border-l-4 border-l-amber-500 bg-white',
    info: 'border-l-4 border-l-blue-500 bg-white',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed top-6 right-6 sm:right-8 z-50 max-w-sm w-full pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            className={`rounded-2xl border border-slate-100 p-4 shadow-dropdown flex items-start gap-3.5 ${
              borders[type] || borders.success
            }`}
          >
            <div className="mt-0.5">{icons[type] || icons.success}</div>

            <div className="flex-1 min-w-0">
              {title && (
                <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                  {title}
                </h4>
              )}
              <p className="text-xs text-slate-600 font-medium leading-relaxed mt-0.5">{message}</p>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span className="sr-only">Close alert</span>
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
