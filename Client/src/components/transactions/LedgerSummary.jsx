import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Receipt } from 'lucide-react';
import Card from '../common/Card';

/**
 * Modern 2026 SaaS Ledger Financial Summary Cards Component (Mercury / Ramp style)
 * High-level overview of lifetime credit given, cleared payments, and transaction volume.
 */
export default function LedgerSummary({
  customer,
  transactionCount = 0,
}) {
  if (!customer) return null;

  const formattedCreditGiven = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(customer.totalCreditGiven || 0);

  const formattedPaymentReceived = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(customer.totalPaymentReceived || 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
      {/* Total Credit Given */}
      <Card padding="sm" className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
            Total Credit Given
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tabular-nums">
            {formattedCreditGiven}
          </div>
          <div className="text-xs text-slate-400 font-medium">Cumulative Udhar purchases</div>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-sm flex-shrink-0">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </Card>

      {/* Total Payment Received */}
      <Card padding="sm" className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
            Total Payments Cleared
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 tabular-nums">
            {formattedPaymentReceived}
          </div>
          <div className="text-xs text-slate-400 font-medium">Cumulative Jama settlements</div>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm flex-shrink-0">
          <ArrowDownLeft className="w-5 h-5" />
        </div>
      </Card>

      {/* Transaction Records Count */}
      <Card padding="sm" className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
            Ledger Entries
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tabular-nums">
            {transactionCount} Entries
          </div>
          <div className="text-xs text-slate-400 font-medium">Recorded transaction slips</div>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-brand-accent flex items-center justify-center border border-blue-100 shadow-sm flex-shrink-0">
          <Receipt className="w-5 h-5" />
        </div>
      </Card>
    </div>
  );
}
