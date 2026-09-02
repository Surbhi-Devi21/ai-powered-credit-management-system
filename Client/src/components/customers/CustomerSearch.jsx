import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * Modern 2026 SaaS Customer Search Bar Component
 * Sleek rounded input with icon prefix and quick clear button.
 */
export default function CustomerSearch({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search customer by name or phone number...',
}) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full bg-white text-slate-900 text-xs sm:text-sm border border-slate-200/90 rounded-2xl pl-11 pr-10 h-12 shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 transition-all"
      />

      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Clear search</span>
        </button>
      )}
    </div>
  );
}
