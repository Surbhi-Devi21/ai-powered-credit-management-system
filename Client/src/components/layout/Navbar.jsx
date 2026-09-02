import React from 'react';
import { Search, ArrowDownLeft, ArrowUpRight, Store } from 'lucide-react';
import Button from '../common/Button';

/**
 * Modern 2026 SaaS Glassmorphic Top Navbar Component
 * Features sticky backdrop-blur, breadcrumb titles, search trigger with ⌘K, and quick transaction shortcuts.
 */
export default function Navbar({
  title = 'Dashboard',
  subtitle,
  onOpenCreditModal,
  onOpenPaymentModal,
  onOpenSearch,
}) {
  // Format today's date in Indian business format (e.g. 24 Aug, 2026)
  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-all">
      {/* Left: Title & Subtitle / Mobile Branding */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile-only logo */}
        <div className="lg:hidden w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm flex-shrink-0">
          <Store className="w-4 h-4" />
        </div>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="hidden sm:block text-[11px] text-slate-500 font-medium truncate">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Center: Quick Search Trigger Button */}
      {onOpenSearch && (
        <button
          type="button"
          onClick={onOpenSearch}
          className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-400 hover:text-slate-700 transition-colors shadow-sm w-72 justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search customer or phone...</span>
          </div>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500 shadow-sm">
            ⌘K
          </kbd>
        </button>
      )}

      {/* Right: Quick Actions & Live Date */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        {/* Live Date Chip */}
        <span className="hidden xl:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 shadow-sm">
          <span>{todayFormatted}</span>
        </span>

        {/* Quick Udhar (Give Credit) Button */}
        {onOpenCreditModal && (
          <Button
            variant="danger"
            size="sm"
            onClick={onOpenCreditModal}
            icon={ArrowUpRight}
            className="hidden sm:inline-flex"
          >
            + Give Credit
          </Button>
        )}

        {/* Quick Jama (Take Payment) Button */}
        {onOpenPaymentModal && (
          <Button
            variant="success"
            size="sm"
            onClick={onOpenPaymentModal}
            icon={ArrowDownLeft}
          >
            + Take Payment
          </Button>
        )}
      </div>
    </header>
  );
}
