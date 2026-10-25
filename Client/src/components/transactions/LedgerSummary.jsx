import React from 'react';

/**
 * Premium SaaS Ledger Financial Summary Strip Component (Linear / Mercury Banking style)
 * Slim financial summary strip with hairline dividers and typography-first metrics.
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
    <div className="bg-white rounded-3xl border border-slate-900/[0.06] shadow-subtle p-5 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-900/[0.06]">
        {/* Total Credit Given */}
        <div className="pb-4 sm:pb-0 sm:px-6 first:pl-0 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Credit Given
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums tracking-tight">
            {formattedCreditGiven}
          </div>
          <div className="text-xs text-slate-400 font-normal">Cumulative credit purchases</div>
        </div>

        {/* Total Payment Received */}
        <div className="py-4 sm:py-0 sm:px-6 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Payments Cleared
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-600 tabular-nums tracking-tight">
            {formattedPaymentReceived}
          </div>
          <div className="text-xs text-slate-400 font-normal">Cumulative settlements</div>
        </div>

        {/* Transaction Records Count */}
        <div className="pt-4 sm:pt-0 sm:px-6 last:pr-0 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Ledger Entries
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums tracking-tight">
            {transactionCount} Entries
          </div>
          <div className="text-xs text-slate-400 font-normal">Recorded transaction slips</div>
        </div>
      </div>
    </div>
  );
}
