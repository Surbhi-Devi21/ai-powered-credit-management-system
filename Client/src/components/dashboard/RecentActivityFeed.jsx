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
 * Premium SaaS Recent Transactions Stream Widget Component
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
    <Card padding="lg" className="space-y-6 flex flex-col justify-between h-full">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 shadow-soft">
              <Receipt className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              Recent Store Activity Stream
            </h3>
          </div>

          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            Live Stream
          </span>
        </div>

        {/* Transaction Stream List */}
        {transactions.length === 0 ? (
          <div className="py-12 text-center space-y-3 text-xs text-slate-400">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto shadow-soft">
              <Receipt className="w-7 h-7" />
            </div>
            <p className="font-extrabold text-slate-900 text-sm">No Recent Transactions</p>
            <p className="text-slate-500 font-medium">New customer credit and payment entries will appear here live.</p>
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
                  className="py-4 flex items-center justify-between gap-4 hover:bg-slate-50 px-3.5 rounded-2xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft ${
                        isCredit
                          ? 'bg-rose-50 text-rose-600'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      {isCredit ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : (
                        <ArrowDownLeft className="w-5 h-5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate group-hover:text-blue-600 transition-colors tracking-tight">
                        {customer.name || 'Unknown Customer'}
                      </h4>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mt-0.5">
                        <span>{formattedDate}</span>
                        {tx.paymentMode && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-extrabold text-slate-700">
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
                    <div className="text-[10px] font-bold text-slate-400 mt-0.5">
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
      <div className="pt-4 border-t border-slate-100">
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
