import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * Premium SaaS Customer Search Bar Component
 * Large floating search input with rounded-full radius and soft shadow.
 */
export default function CustomerSearch({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search customer by name or phone number...',
}) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full bg-white text-slate-900 text-xs sm:text-sm border border-slate-900/[0.06] rounded-full pl-12 pr-11 h-12 shadow-subtle hover:border-slate-900/[0.12] placeholder:text-slate-400 focus:outline-none focus:border-slate-900/20 focus:ring-4 focus:ring-slate-900/[0.03] transition-all font-medium"
      />

      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Clear search</span>
        </button>
      )}
    </div>
  );
}
