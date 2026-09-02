import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

/**
 * Modern 2026 SaaS Mobile Floating Action Button (FAB) Component
 * Expands with spring physics to trigger quick "Give Credit" or "Take Payment" actions on mobile screens.
 */
export default function FloatingActionButton({
  onOpenCreditModal,
  onOpenPaymentModal,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);

  const handleCredit = () => {
    setIsOpen(false);
    if (onOpenCreditModal) onOpenCreditModal();
  };

  const handlePayment = () => {
    setIsOpen(false);
    if (onOpenPaymentModal) onOpenPaymentModal();
  };

  return (
    <div className="lg:hidden fixed bottom-20 right-4 z-40 flex flex-col items-end">
      {/* Floating Action Menu Items */}
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col items-end gap-3 mb-3">
            {/* Take Payment (Jama) Action */}
            <motion.button
              type="button"
              onClick={handlePayment}
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              className="flex items-center gap-2.5 pl-3.5 pr-4 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-modal border border-emerald-500/80 active:scale-95"
            >
              <div className="w-6 h-6 rounded-xl bg-white/20 flex items-center justify-center">
                <ArrowDownLeft className="w-3.5 h-3.5" />
              </div>
              <span>Take Payment (Jama)</span>
            </motion.button>

            {/* Give Credit (Udhar) Action */}
            <motion.button
              type="button"
              onClick={handleCredit}
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25, delay: 0.04 }}
              className="flex items-center gap-2.5 pl-3.5 pr-4 py-2.5 rounded-2xl bg-rose-600 text-white text-xs font-bold shadow-modal border border-rose-500/80 active:scale-95"
            >
              <div className="w-6 h-6 rounded-xl bg-white/20 flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
              <span>Give Credit (Udhar)</span>
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Primary Trigger Button */}
      <motion.button
        type="button"
        onClick={toggle}
        whileTap={{ scale: 0.93 }}
        className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-modal border border-slate-700/60 focus:outline-none"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <Plus className="w-6 h-6" />
        </motion.div>
        <span className="sr-only">Toggle quick transaction menu</span>
      </motion.button>
    </div>
  );
}
