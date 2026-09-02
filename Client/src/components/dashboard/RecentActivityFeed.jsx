import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  ChevronRight,
} from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

/**
 * Modern 2026 SaaS Recent Transactions Stream Widget Component
 * Displays real-time credit and payment transaction slips with customer navigation.
 */
export default function RecentActivityFeed({ transactions = [] }) {
  const navigate = useNavigate();

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);

  return (
    <Card className="p-6 sm:p-7 space-y-5 flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Receipt className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
              Recent Store Activity Stream
            </h3>
          </div>

          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            Live Stream
          </span>
        </div>

        {/* Transaction Stream List */}
        {transactions.length === 0 ? (
          <div className="py-12 text-center space-y-2 text-xs text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto border border-slate-200/80 shadow-sm">
              <Receipt className="w-6 h-6" />
            </div>
            <p className="font-extrabold text-slate-900 text-sm">No Recent Transactions</p>
            <p className="text-slate-500">New customer credit and payment entries will appear here live.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.map((tx) => {
              const isCredit = tx.type === 'CREDIT';
              const customer = tx.customerId || {};

              const formattedDate = new Intl.DateTimeFormat('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              }).format(new Date(tx.transactionDate || tx.createdAt));

              return (
                <div
                  key={tx._id}
                  onClick={() => customer._id && navigate(`/customers/${customer._id}`)}
                  className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 px-3 rounded-2xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                        isCredit
                          ? 'bg-rose-50 text-rose-600 border border-rose-100'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}
                    >
                      {isCredit ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate group-hover:text-brand-accent transition-colors">
                        {customer.name || 'Unknown Customer'}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 mt-0.5">
                        <span>{formattedDate}</span>
                        {tx.paymentMode && (
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700">
                            {tx.paymentMode}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div
                      className={`text-xs sm:text-sm font-extrabold tabular-nums ${
                        isCredit ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {isCredit
                        ? `+ ${formatCurrency(tx.amount)}`
                        : `- ${formatCurrency(tx.amount)}`}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400">
                      {isCredit ? 'Credit Given' : 'Payment Cleared'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="pt-3 border-t border-slate-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/customers')}
          className="w-full justify-between text-xs font-bold text-slate-700"
          icon={ChevronRight}
          iconPosition="right"
        >
          <span>View All Customer Accounts</span>
        </Button>
      </div>
    </Card>
  );
}
