import React from 'react';
import { Search, ArrowDownLeft, ArrowUpRight, Calendar, CreditCard, Bell } from 'lucide-react';
import Button from '../common/Button';

/**
 * Version 3: Premium Floating Top Navbar Component (Stripe / Linear style)
 * Features:
 * - Floating white rounded-full header with subtle shadow
 * - Floating rounded-full search bar with ⌘K shortcut
 * - Notification bell button with active dot
 * - Profile avatar container
 * - Live formatted date chip
 * - Two beautiful gradient CTA buttons (+ Give Credit, + Take Payment)
 */
export default function Navbar({
  title = 'Dashboard',
  subtitle,
  onOpenCreditModal,
  onOpenPaymentModal,
  onOpenSearch,
  user = { name: 'Store Owner' },
}) {
  // Format today's date in business format (e.g. Thu, 4 Sep 2026)
  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-6 z-20 w-full bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-full border border-slate-900/[0.06] shadow-card px-5 sm:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-4 sm:gap-6 transition-all select-none">
      {/* Left: Page Title & Subtitle / Mobile Icon */}
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Mobile-only icon */}
        <div className="lg:hidden w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-soft flex-shrink-0">
          <CreditCard className="w-5 h-5 text-blue-400" />
        </div>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="hidden md:block text-[11px] text-slate-500 font-medium truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Center: Large Floating Search Bar */}
      {onOpenSearch && (
        <button
          type="button"
          onClick={onOpenSearch}
          className="hidden md:flex items-center gap-3 px-4 py-2.5 rounded-full bg-slate-50/80 hover:bg-slate-100/90 border border-slate-900/[0.05] text-xs text-slate-400 hover:text-slate-700 transition-all shadow-subtle w-72 lg:w-80 justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            <span className="font-medium">Search customer or phone...</span>
          </div>
          <kbd className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-white border border-slate-200/80 text-slate-500 shadow-subtle">
            ⌘K
          </kbd>
        </button>
      )}

      {/* Right: Date Chip + Notifications + Quick Actions + Profile Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 flex-shrink-0">
        {/* Live Date Chip */}
        <div className="hidden xl:inline-flex items-center gap-2 text-xs font-bold text-slate-600 px-3.5 py-2 rounded-full bg-slate-50 border border-slate-900/[0.04] shadow-subtle">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{todayFormatted}</span>
        </div>

        {/* Notification Bell Button */}
        <button
          type="button"
          title="Notifications"
          className="relative p-2.5 rounded-full text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100/80 border border-slate-900/[0.04] shadow-subtle transition-all cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>

        {/* Quick Udhar (Give Credit) Button */}
        {onOpenCreditModal && (
          <Button
            variant="creditGradient"
            size="md"
            onClick={onOpenCreditModal}
            icon={ArrowUpRight}
            className="hidden sm:inline-flex rounded-full shadow-button"
          >
            + Give Credit
          </Button>
        )}

        {/* Quick Jama (Take Payment) Button */}
        {onOpenPaymentModal && (
          <Button
            variant="paymentGradient"
            size="md"
            onClick={onOpenPaymentModal}
            icon={ArrowDownLeft}
            className="rounded-full shadow-button"
          >
            + Take Payment
          </Button>
        )}

        {/* Profile Avatar */}
        <div className="relative pl-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center font-extrabold text-sm shadow-subtle border border-slate-700/50 cursor-pointer">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'O'}
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>
      </div>
    </header>
  );
}
