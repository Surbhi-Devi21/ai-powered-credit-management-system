import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Trash2,
} from 'lucide-react';
import Card from '../common/Card';

/**
 * Modern 2026 SaaS Mobile-First Transaction Entry Card Component
 * Large white surface (rounded-3xl), tactile touch states, and clear audit running balance.
 */
export default function TransactionCard({
  transaction,
  onDelete,
}) {
  const isCredit = transaction.type === 'CREDIT';

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(transaction.amount);

  const formattedRunningBalance = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(Math.abs(transaction.balanceAfterTransaction));

  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(transaction.transactionDate));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card padding="sm" className="space-y-3.5">
        {/* Top Row: Icon + Type Badge + Date + Amount */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Entry Type Indicator Circle */}
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                isCredit
                  ? 'bg-rose-50 text-rose-600 border border-rose-100'
                  : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              }`}
            >
              {isCredit ? (
                <ArrowUpRight className="w-5 h-5" />
              ) : (
                <ArrowDownLeft className="w-5 h-5" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-extrabold ${
                    isCredit ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  {isCredit ? 'Credit Given (Udhar)' : 'Payment Cleared (Jama)'}
                </span>
                {transaction.paymentMode && (
                  <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-slate-100 border border-slate-200 text-slate-700">
                    {transaction.paymentMode}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-0.5">
                <Calendar className="w-3 h-3" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Transaction Amount */}
          <div className="text-right flex-shrink-0">
            <div
              className={`text-base font-extrabold tabular-nums tracking-tight ${
                isCredit ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {isCredit ? `+ ${formattedAmount}` : `- ${formattedAmount}`}
            </div>
          </div>
        </div>

        {/* Description / Items / Notes */}
        {transaction.description && (
          <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            {transaction.description}
          </div>
        )}

        {/* Footer: Running Balance & Delete Action */}
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
          <div className="text-slate-500 font-medium">
            Balance After:{' '}
            <strong className="font-extrabold text-slate-900 tabular-nums">
              {transaction.balanceAfterTransaction < 0
                ? `- ${formattedRunningBalance}`
                : formattedRunningBalance}
            </strong>
          </div>

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(transaction)}
              title="Delete / Reverse Entry"
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
