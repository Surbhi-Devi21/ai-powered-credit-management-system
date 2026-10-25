import React from 'react';
import { Search, Calendar, X } from 'lucide-react';

/**
 * Premium SaaS Transaction Ledger Filters & Search Toolbar Component (Linear / Mercury style)
 * Floating white surface toolbar with hairline borders, refined search, and date range filters.
 */
export default function TransactionFilters({
  activeType = 'ALL',
  onTypeChange,
  search = '',
  onSearchChange,
  startDate = '',
  onStartDateChange,
  endDate = '',
  onEndDateChange,
  onClearFilters,
}) {
  const typePills = [
    { id: 'ALL', label: 'All Transactions' },
    { id: 'CREDIT', label: 'Credit Only (Udhar)' },
    { id: 'PAYMENT', label: 'Payments Only (Jama)' },
  ];

  const hasActiveFilters = activeType !== 'ALL' || search || startDate || endDate;

  return (
    <div className="bg-white rounded-3xl border border-slate-900/[0.06] shadow-subtle p-4 sm:p-5 space-y-3.5 sm:space-y-4 select-none">
      {/* Type Filter Pills & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        {/* Entry Type Pills */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-slate-100/70 border border-slate-900/[0.06] overflow-x-auto w-full sm:w-auto scrollbar-none">
          {typePills.map((pill) => {
            const isSelected = activeType === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => onTypeChange(pill.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-subtle border border-slate-900/[0.04]'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Search Input for Description / Items / Bill Ref */}
        <div className="relative w-full sm:w-72 lg:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search items, notes or bill #..."
            className="block w-full bg-slate-50/60 text-slate-900 text-xs border border-slate-900/[0.06] rounded-full pl-10 pr-4 h-10 shadow-subtle placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
          />
        </div>
      </div>

      {/* Date Range Selectors */}
      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-900/[0.06] text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 font-medium">
          <Calendar className="w-3.5 h-3.5" />
          <span>Date Filter:</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="bg-white text-slate-800 text-xs font-medium border border-slate-900/[0.08] rounded-full px-3.5 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer shadow-subtle tabular-nums hover:border-slate-300 transition-colors"
          />
          <span className="text-slate-400 font-normal">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="bg-white text-slate-800 text-xs font-medium border border-slate-900/[0.08] rounded-full px-3.5 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer shadow-subtle tabular-nums hover:border-slate-300 transition-colors"
          />
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
