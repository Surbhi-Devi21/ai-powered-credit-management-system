import React from 'react';
import { Receipt, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import Button from '../common/Button';

/**
 * Modern 2026 SaaS Empty Ledger Statement Placeholder Component
 * Rendered when a customer has no transactions recorded yet.
 */
export default function EmptyLedger({
  onOpenCredit,
  onOpenPayment,
}) {
  return (
    <div className="py-16 px-6 flex flex-col items-center justify-center text-center space-y-5 bg-white rounded-3xl border border-dashed border-slate-200 shadow-card">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-200/80 shadow-sm">
        <Receipt className="w-7 h-7" />
      </div>

      <div className="max-w-sm space-y-1.5">
        <h4 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
          No Ledger Transactions Yet
        </h4>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          This customer's statement is completely clear. Start by recording a credit purchase or a payment.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2 flex-wrap justify-center">
        <Button
          variant="danger"
          size="md"
          onClick={onOpenCredit}
          icon={ArrowUpRight}
        >
          + Give Credit (Udhar)
        </Button>

        <Button
          variant="success"
          size="md"
          onClick={onOpenPayment}
          icon={ArrowDownLeft}
        >
          + Take Payment (Jama)
        </Button>
      </div>
    </div>
  );
}
