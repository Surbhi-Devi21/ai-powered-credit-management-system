import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Trash2,
} from 'lucide-react';

/**
 * Premium SaaS Mobile-First Transaction Entry Card Component (Linear / Mercury style)
 * One clean white surface (rounded-3xl), hairline border, shadow-card elevation, and tabular-nums.
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
      className="bg-white rounded-3xl border border-slate-900/[0.06] shadow-card hover:shadow-cardHover hover:-translate-y-1 transition-all duration-200 p-5 space-y-3.5 select-none"
    >
      {/* Top Row: Icon + Type Badge + Date + Amount */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Entry Type Indicator Circle */}
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isCredit
                ? 'bg-rose-50 text-rose-600'
                : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            {isCredit ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownLeft className="w-4 h-4" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold ${
                  isCredit ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                {isCredit ? 'Credit (Udhar)' : 'Payment (Jama)'}
              </span>
              {transaction.paymentMode && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {transaction.paymentMode}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-normal mt-0.5">
              <Calendar className="w-3 h-3" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Transaction Amount */}
        <div className="text-right flex-shrink-0">
          <div
            className={`text-base font-bold tabular-nums tracking-tight ${
              isCredit ? 'text-rose-600' : 'text-emerald-600'
            }`}
          >
            {isCredit ? `+ ${formattedAmount}` : `- ${formattedAmount}`}
          </div>
        </div>
      </div>

      {/* Description / Items / Notes - Clean Unboxed Surface */}
      {transaction.description ? (
        <p className="text-xs text-slate-600 font-normal leading-relaxed">
          {transaction.description}
          {transaction.billReference && (
            <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/50">
              #{transaction.billReference}
            </span>
          )}
        </p>
      ) : transaction.billReference ? (
        <div className="text-[10px] font-mono text-slate-500">
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/50">
            #{transaction.billReference}
          </span>
        </div>
      ) : null}

      {/* Footer: Running Balance & Delete Action */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-900/[0.06] text-xs">
        <div className="text-slate-500 font-normal">
          Balance After:{' '}
          <strong className="font-semibold text-slate-900 tabular-nums">
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
            className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
