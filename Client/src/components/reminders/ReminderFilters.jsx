import React from 'react';
import { Search, ArrowUpDown, X, Filter } from 'lucide-react';

/**
 * Premium SaaS Reminder & Overdue Filter Toolbar Component (Linear / Mercury style)
 * Features primary status tabs, overdue aging sub-chips, search input, and risk sorting.
 */
export default function ReminderFilters({
  activeFilter = 'ALL',
  onFilterChange,
  activeAging = 'ALL',
  onAgingChange,
  search = '',
  onSearchChange,
  sortBy = 'highest_risk',
  onSortChange,
  onResetFilters,
  counts = {},
}) {
  const primaryTabs = [
    { id: 'ALL', label: 'All Accounts', count: counts.all || 0 },
    { id: 'OVERDUE', label: 'Overdue Dues', count: counts.overdue || 0 },
    { id: 'DUE_TODAY', label: 'Due Today', count: counts.dueToday || 0 },
    { id: 'HIGH_PRIORITY', label: 'High Priority', count: counts.highPriority || 0 },
    { id: 'SETTLED', label: 'Settled (₹0)', count: counts.settled || 0 },
  ];

  const agingBuckets = [
    { id: 'ALL', label: 'All Aging' },
    { id: 'TODAY', label: 'Due Today', count: counts.agingToday || 0 },
    { id: '1-7_DAYS', label: '1–7 Days', count: counts.aging1to7 || 0 },
    { id: '8-30_DAYS', label: '8–30 Days', count: counts.aging8to30 || 0 },
    { id: '31-60_DAYS', label: '31–60 Days', count: counts.aging31to60 || 0 },
    { id: '60+_DAYS', label: '60+ Days', count: counts.aging60Plus || 0 },
  ];

  const sortOptions = [
    { value: 'highest_risk', label: 'Highest Risk (Critical First)' },
    { value: 'highest_amount', label: 'Highest Pending Amount' },
    { value: 'oldest_due', label: 'Oldest Due (Most Overdue)' },
    { value: 'newest_due', label: 'Newest Due Date' },
  ];

  const hasActiveFilters =
    activeFilter !== 'ALL' || activeAging !== 'ALL' || search.trim() !== '';

  return (
    <div className="bg-white rounded-3xl border border-slate-900/[0.06] shadow-subtle p-4 sm:p-5 space-y-4 select-none">
      {/* Top Row: Primary Status Tabs & Search Input */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
        {/* Primary Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-slate-100/70 border border-slate-900/[0.06] overflow-x-auto scrollbar-none w-full lg:w-auto">
          {primaryTabs.map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onFilterChange(tab.id)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-subtle border border-slate-900/[0.04]'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums ${
                    isSelected
                      ? 'bg-slate-100 text-slate-800'
                      : 'bg-slate-200/60 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Search Box & Sort Selector */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64 lg:w-72">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search customer name or phone..."
              className="block w-full bg-slate-50/60 text-slate-900 text-xs border border-slate-900/[0.06] rounded-full pl-10 pr-4 h-10 shadow-subtle placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-white text-slate-800 text-xs font-semibold border border-slate-900/[0.08] rounded-full pl-8 pr-7 h-10 shadow-subtle focus:outline-none focus:border-blue-500 cursor-pointer hover:border-slate-300 transition-colors"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bottom Row: Overdue Aging Grouping Sub-Filter */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-900/[0.06] text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 text-slate-400 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Overdue Aging:</span>
          </div>

          {agingBuckets.map((bucket) => {
            const isSelected = activeAging === bucket.id;
            return (
              <button
                key={bucket.id}
                type="button"
                onClick={() => onAgingChange(bucket.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-subtle font-semibold'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-900/[0.04]'
                }`}
              >
                <span>{bucket.label}</span>
                {bucket.count !== undefined && bucket.id !== 'ALL' && (
                  <span className="ml-1 opacity-70 tabular-nums">({bucket.count})</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
