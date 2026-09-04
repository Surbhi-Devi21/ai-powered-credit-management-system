import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

/**
 * Premium SaaS Mobile Floating Action Button (FAB) Component
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
    <div className="lg:hidden fixed bottom-20 right-6 z-40 flex flex-col items-end">
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
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 pl-4 pr-5 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-modal active:scale-95 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowDownLeft className="w-4 h-4" />
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
              transition={{ duration: 0.2, delay: 0.03 }}
              className="flex items-center gap-3 pl-4 pr-5 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-modal active:scale-95 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
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
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-modal focus:outline-none cursor-pointer"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Plus className="w-6 h-6" />
        </motion.div>
        <span className="sr-only">Toggle quick transaction menu</span>
      </motion.button>
    </div>
  );
}
