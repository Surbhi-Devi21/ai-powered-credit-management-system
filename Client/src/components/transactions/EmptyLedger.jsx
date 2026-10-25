import React from 'react';
import { Receipt, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import Button from '../common/Button';

/**
 * Premium SaaS Empty Ledger Statement Placeholder Component (Linear / Mercury style)
 * Minimal empty state with neutral typography and calm CTA buttons.
 */
export default function EmptyLedger({
  onOpenCredit,
  onOpenPayment,
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-900/[0.06] shadow-subtle py-14 px-6 sm:px-10 flex flex-col items-center justify-center text-center space-y-4 select-none">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-900/[0.06] text-slate-400 flex items-center justify-center">
        <Receipt className="w-5 h-5" />
      </div>

      <div className="max-w-sm space-y-1">
        <h4 className="text-base font-semibold text-slate-900 tracking-tight">
          No Ledger Transactions Yet
        </h4>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
          This customer statement is clear with no recorded entries. Begin by recording a credit or payment transaction.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2 flex-wrap justify-center">
        <Button
          variant="primary"
          size="md"
          onClick={onOpenCredit}
          icon={ArrowUpRight}
          className="shadow-subtle hover:shadow-card font-medium text-xs sm:text-sm"
        >
          + Give Credit (Udhar)
        </Button>

        <Button
          variant="secondary"
          size="md"
          onClick={onOpenPayment}
          icon={ArrowDownLeft}
          className="shadow-subtle hover:shadow-card font-medium text-xs sm:text-sm border-slate-900/[0.08]"
        >
          + Take Payment (Jama)
        </Button>
      </div>
    </div>
  );
}
