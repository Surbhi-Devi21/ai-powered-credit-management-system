import React from 'react';
import { Search, Calendar, X } from 'lucide-react';
import Card from '../common/Card';

/**
 * Premium SaaS Transaction Ledger Filters & Search Toolbar Component
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
    <Card padding="md" className="space-y-5">
      {/* Type Filter Pills & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none">
        {/* Entry Type Pills */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-slate-100 border border-slate-200/80 overflow-x-auto w-full sm:w-auto scrollbar-none shadow-soft">
          {typePills.map((pill) => {
            const isSelected = activeType === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => onTypeChange(pill.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-soft'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Search Input for Description / Items / Bill Ref */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search items, notes or bill #..."
            className="block w-full bg-slate-50 text-slate-900 text-xs border border-slate-200/80 rounded-full pl-11 pr-4 h-11 shadow-soft placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
          />
        </div>
      </div>

      {/* Date Range Selectors */}
      <div className="flex flex-wrap items-center gap-3.5 pt-4 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2 text-slate-400 font-bold">
          <Calendar className="w-3.5 h-3.5" />
          <span>Date Filter:</span>
        </div>

        <div className="flex items-center gap-2.5">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="bg-white text-slate-800 text-xs font-bold border border-slate-200/80 rounded-full px-3.5 py-2 focus:outline-none focus:border-blue-500 cursor-pointer shadow-soft"
          />
          <span className="text-slate-400 font-medium">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="bg-white text-slate-800 text-xs font-bold border border-slate-200/80 rounded-full px-3.5 py-2 focus:outline-none focus:border-blue-500 cursor-pointer shadow-soft"
          />
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="ml-auto inline-flex items-center gap-1.5 text-xs font-extrabold text-rose-600 hover:text-rose-700 transition-colors p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    </Card>
  );
}
