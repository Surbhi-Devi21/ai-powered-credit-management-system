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
    <header className="sticky top-4 z-20 w-full rounded-[28px] border border-slate-200/80 bg-white/80 px-4 py-3 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:px-5 lg:px-6">
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-[0_16px_30px_-18px_rgba(15,23,42,0.9)] lg:hidden">
            <CreditCard className="h-4 w-4 text-blue-300" />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-base font-black tracking-[-0.05em] text-slate-900 sm:text-lg">{title}</h1>
            {subtitle && (
              <p className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 md:block">{subtitle}</p>
            )}
          </div>
        </div>

        {onOpenSearch && (
          <button
            type="button"
            onClick={onOpenSearch}
            className="hidden items-center justify-between rounded-full border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-left text-xs font-medium text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition-all hover:border-slate-300 hover:bg-slate-100 md:flex md:w-[280px] lg:w-[360px]"
          >
            <div className="flex items-center gap-2.5">
              <Search className="h-4 w-4 text-slate-400" />
              <span>Search customer or phone...</span>
            </div>
            <kbd className="rounded-full border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold font-mono text-slate-500">⌘K</kbd>
          </button>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 xl:flex">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            {todayFormatted}
          </div>

          <button
            type="button"
            title="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
          </button>

          {onOpenCreditModal && (
            <Button
              variant="creditGradient"
              size="md"
              onClick={onOpenCreditModal}
              icon={ArrowUpRight}
              className="hidden sm:inline-flex rounded-full"
            >
              + Give Credit
            </Button>
          )}

          {onOpenPaymentModal && (
            <Button
              variant="paymentGradient"
              size="md"
              onClick={onOpenPaymentModal}
              icon={ArrowDownLeft}
              className="rounded-full"
            >
              + Take Payment
            </Button>
          )}

          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f172a,#1e293b,#2563eb)] text-sm font-black text-white shadow-[0_18px_30px_-18px_rgba(15,23,42,0.9)]">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'O'}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
          </div>
        </div>
      </div>
    </header>
  );
}
