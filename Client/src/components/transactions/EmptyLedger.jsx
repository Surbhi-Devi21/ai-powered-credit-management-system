import React from 'react';
import { Receipt, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import Button from '../common/Button';

/**
 * Premium SaaS Empty Ledger Statement Placeholder Component
 * Rendered when a customer has no transactions recorded yet.
 */
export default function EmptyLedger({
  onOpenCredit,
  onOpenPayment,
}) {
  return (
    <div className="py-16 px-8 flex flex-col items-center justify-center text-center space-y-5 bg-white rounded-3xl shadow-card border border-slate-100">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center shadow-soft">
        <Receipt className="w-8 h-8" />
      </div>

      <div className="max-w-sm space-y-1.5">
        <h4 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
          No Ledger Transactions Yet
        </h4>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
          This customer's statement is completely clear. Start by recording a credit purchase or a payment.
        </p>
      </div>

      <div className="flex items-center gap-3.5 pt-3 flex-wrap justify-center">
        <Button
          variant="creditGradient"
          size="md"
          onClick={onOpenCredit}
          icon={ArrowUpRight}
          className="shadow-button"
        >
          + Give Credit (Udhar)
        </Button>

        <Button
          variant="paymentGradient"
          size="md"
          onClick={onOpenPayment}
          icon={ArrowDownLeft}
          className="shadow-button"
        >
          + Take Payment (Jama)
        </Button>
      </div>
    </div>
  );
}
