import React from 'react';
import { Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

/**
 * Modern 2026 SaaS Desktop Financial Ledger Statement Table Component (Stripe / Mercury style)
 * Clean tabular figures, color-coded entry types, 24px rounded container, and running balances.
 */
export default function LedgerTable({
  transactions = [],
  onDelete,
}) {
  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-slate-200/80 bg-white shadow-card select-none">
      <table className="w-full text-left border-collapse">
        {/* Table Header */}
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/75 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
            <th className="py-4 px-5">Date</th>
            <th className="py-4 px-5">Type</th>
            <th className="py-4 px-5">Items / Notes</th>
            <th className="py-4 px-5">Mode</th>
            <th className="py-4 px-5 text-right">Debit (Udhar)</th>
            <th className="py-4 px-5 text-right">Credit (Jama)</th>
            <th className="py-4 px-5 text-right">Running Balance</th>
            <th className="py-4 px-5 text-center">Action</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-slate-100 text-xs">
          {transactions.map((tx) => {
            const isCredit = tx.type === 'CREDIT';

            const formattedDate = new Intl.DateTimeFormat('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }).format(new Date(tx.transactionDate));

            const formattedAmount = new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              minimumFractionDigits: 2,
            }).format(tx.amount);

            const formattedRunningBalance = new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              minimumFractionDigits: 2,
            }).format(Math.abs(tx.balanceAfterTransaction));

            return (
              <tr
                key={tx._id}
                className="hover:bg-slate-50/70 transition-colors group"
              >
                {/* Date */}
                <td className="py-4 px-5 font-bold text-slate-900 whitespace-nowrap">
                  {formattedDate}
                </td>

                {/* Type Badge */}
                <td className="py-4 px-5 whitespace-nowrap">
                  {isCredit ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 border border-rose-100 shadow-sm">
                      <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
                      <span>Credit (Udhar)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
                      <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Payment (Jama)</span>
                    </span>
                  )}
                </td>

                {/* Description / Items */}
                <td className="py-4 px-5 max-w-xs truncate text-slate-500 font-medium">
                  {tx.description || (
                    <span className="text-slate-300 italic">No notes</span>
                  )}
                  {tx.billReference && (
                    <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                      #{tx.billReference}
                    </span>
                  )}
                </td>

                {/* Payment Mode */}
                <td className="py-4 px-5 whitespace-nowrap text-slate-500">
                  {tx.paymentMode ? (
                    <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                      {tx.paymentMode}
                    </span>
                  ) : (
                    <span>—</span>
                  )}
                </td>

                {/* Debit / Udhar Column */}
                <td className="py-4 px-5 text-right font-extrabold text-rose-600 tabular-nums whitespace-nowrap">
                  {isCredit ? formattedAmount : '—'}
                </td>

                {/* Credit / Jama Column */}
                <td className="py-4 px-5 text-right font-extrabold text-emerald-600 tabular-nums whitespace-nowrap">
                  {!isCredit ? formattedAmount : '—'}
                </td>

                {/* Running Balance Column */}
                <td className="py-4 px-5 text-right font-extrabold text-slate-900 tabular-nums whitespace-nowrap">
                  {tx.balanceAfterTransaction < 0
                    ? `- ${formattedRunningBalance}`
                    : formattedRunningBalance}
                </td>

                {/* Delete / Reverse Action */}
                <td className="py-4 px-5 text-center whitespace-nowrap">
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(tx)}
                      title="Delete / Reverse Entry"
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
