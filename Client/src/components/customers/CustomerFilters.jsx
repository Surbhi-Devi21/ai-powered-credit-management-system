import React from 'react';
import { ArrowUpDown } from 'lucide-react';

/**
 * Premium SaaS Customer Filter Toolbar Component
 * Clean rounded-full pill tabs with active count badges and sorting selector.
 */
export default function CustomerFilters({
  activeStatus = 'active',
  onStatusChange,
  sortBy = 'recent',
  onSortByChange,
  sortOrder = 'desc',
  onSortOrderChange,
  counts = {},
}) {
  const statusTabs = [
    { id: 'active', label: 'All Active', count: counts.total || 0 },
    { id: 'has_dues', label: 'Has Dues', count: counts.hasDues || 0 },
    { id: 'settled', label: 'Settled (₹0)', count: counts.settled || 0 },
    { id: 'archived', label: 'Archived' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 select-none">
      {/* Status Filter Pills */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white border border-slate-100 shadow-soft overflow-x-auto scrollbar-none">
        {statusTabs.map((tab) => {
          const isSelected = activeStatus === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onStatusChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-button'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sorting Strategy Selector */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-slate-100 text-xs font-bold text-slate-700 shadow-soft">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
          >
            <option value="recent">Recently Active</option>
            <option value="balance">Pending Balance</option>
            <option value="name">Customer Name</option>
          </select>
        </div>
      </div>
    </div>
  );
}
