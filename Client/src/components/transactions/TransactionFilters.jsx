import React from 'react';
import { Search, Calendar, X } from 'lucide-react';
import Card from '../common/Card';

/**
 * Modern 2026 SaaS Transaction Ledger Filters & Search Toolbar Component
 * Supports filtering by entry type (Credit/Payment), date ranges, and item notes.
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
    <Card padding="sm" className="space-y-4">
      {/* Type Filter Pills & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 select-none">
        {/* Entry Type Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/80 overflow-x-auto w-full sm:w-auto scrollbar-none shadow-inner">
          {typePills.map((pill) => {
            const isSelected = activeType === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => onTypeChange(pill.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Search Input for Description / Items / Bill Ref */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search items, notes or bill #..."
            className="block w-full bg-slate-50 text-slate-900 text-xs border border-slate-200/90 rounded-2xl pl-10 pr-3.5 h-10 shadow-sm placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all"
          />
        </div>
      </div>

      {/* Date Range Selectors */}
      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 font-bold">
          <Calendar className="w-3.5 h-3.5" />
          <span>Date Filter:</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="bg-white text-slate-800 text-xs font-semibold border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-brand-accent cursor-pointer shadow-sm"
          />
          <span className="text-slate-400 font-medium">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="bg-white text-slate-800 text-xs font-semibold border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-brand-accent cursor-pointer shadow-sm"
          />
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="ml-auto inline-flex items-center gap-1.5 text-xs font-extrabold text-rose-600 hover:text-rose-700 transition-colors p-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    </Card>
  );
}
