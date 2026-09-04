import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Phone, Users } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

/**
 * Premium SaaS Top Debtors Exposure Widget Component (Mercury / Ramp style)
 * Large white card (rounded-3xl / 28px radius), customer debt percentage progress bars, and direct ledger links.
 */
export default function TopDebtorsWidget({
  debtors = [],
  totalOutstandingDues = 0,
}) {
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
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              Top Customer Dues (Highest Exposure)
            </h3>
          </div>

          <button
            type="button"
            onClick={() => navigate('/customers?status=has_dues')}
            className="text-xs font-extrabold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
          >
            View All
          </button>
        </div>

        {/* Debtor List */}
        {debtors.length === 0 ? (
          <div className="py-12 text-center space-y-3 text-xs text-slate-400">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-soft">
              <Users className="w-7 h-7" />
            </div>
            <p className="font-extrabold text-slate-900 text-sm">All Accounts Settled!</p>
            <p className="text-slate-500 font-medium">None of your customers currently have pending credit dues.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {debtors.map((customer, index) => {
              const debtPercent =
                totalOutstandingDues > 0
                  ? Math.min(
                      100,
                      Math.round((customer.currentBalance / totalOutstandingDues) * 100)
                    )
                  : 0;

              return (
                <div
                  key={customer._id}
                  onClick={() => navigate(`/customers/${customer._id}`)}
                  className="py-4 flex items-center justify-between gap-4 hover:bg-slate-50 px-3.5 rounded-2xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 font-extrabold text-xs flex items-center justify-center flex-shrink-0 shadow-soft">
                      #{index + 1}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate group-hover:text-blue-600 transition-colors tracking-tight">
                        {customer.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{customer.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 space-y-1">
                    <div className="text-xs sm:text-sm font-extrabold text-rose-600 tabular-nums">
                      {formatCurrency(customer.currentBalance)}
                    </div>
                    <div className="flex items-center justify-end gap-2 text-[10px] font-bold text-slate-400">
                      <span>{debtPercent}% of total</span>
                      <div className="w-14 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-rose-500 rounded-full"
                          style={{ width: `${debtPercent}%` }}
                        />
                      </div>
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
          <span>Open Full Customer Ledger</span>
        </Button>
      </div>
    </Card>
  );
}
