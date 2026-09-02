import React from 'react';

/**
 * Modern 2026 SaaS Status Badge Component
 * Soft pastel tints, hairline borders, and glowing pulse dots for financial statuses.
 */
export default function Badge({
  children,
  variant = 'settled',
  size = 'md',
  showDot = true,
  className = '',
}) {
  const variants = {
    settled: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    pending: 'bg-amber-50 text-amber-700 border-amber-200/80',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/80',
    overdue: 'bg-rose-50 text-rose-700 border-rose-200/80',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/80',
    archived: 'bg-slate-100 text-slate-600 border-slate-200',
    neutral: 'bg-slate-50 text-slate-700 border-slate-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200/80',
    accent: 'bg-blue-50 text-brand-accent border-blue-200/80',
  };

  const dotColors = {
    settled: 'bg-emerald-500',
    success: 'bg-emerald-500',
    pending: 'bg-amber-500',
    warning: 'bg-amber-500',
    overdue: 'bg-rose-500 animate-pulse',
    danger: 'bg-rose-500 animate-pulse',
    archived: 'bg-slate-400',
    neutral: 'bg-slate-400',
    info: 'bg-blue-500',
    accent: 'bg-brand-accent',
  };

  const sizes = {
    sm: 'text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full gap-1.5 font-semibold tracking-tight',
    md: 'text-xs px-3 py-1 rounded-full gap-2 font-semibold tracking-tight',
  };

  return (
    <span
      className={`inline-flex items-center border select-none ${
        variants[variant] || variants.settled
      } ${sizes[size] || sizes.md} ${className}`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
            dotColors[variant] || 'bg-current'
          }`}
        />
      )}
      <span>{children}</span>
    </span>
  );
}
