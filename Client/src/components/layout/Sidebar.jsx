import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BellRing,
  Sparkles,
  Settings,
  LogOut,
  CreditCard,
  ChevronRight,
} from 'lucide-react';

/**
 * Version 3: Premium Floating SaaS Sidebar (Stripe / Mercury / Linear style)
 * Features:
 * - Floating white card with 32px radius
 * - Ultra-soft diffuse shadow
 * - Geometric logo header with live status
 * - Icons inside rounded squares
 * - Pill active navigation items
 * - High-contrast owner profile card
 */
export default function Sidebar({
  shopName = 'My Retail Store',
  businessCategory = 'Kirana',
  ownerName = 'Store Owner',
  onLogout,
}) {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Reminders', path: '/reminders', icon: BellRing },
    { name: 'AI Insights', path: '/ai-insights', icon: Sparkles, badge: 'AI' },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex sticky top-5 h-[calc(100vh-2.5rem)] w-[280px] shrink-0 flex-col overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/90 shadow-[0_30px_80px_-32px_rgba(15,23,42,0.22)] backdrop-blur-xl z-30 select-none transition-all duration-300">
      <div className="relative p-5 pb-4">
        <div className="absolute inset-x-5 top-0 h-16 bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.16),_transparent_70%)]" />
        <div className="relative flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#111827_0%,#1e293b_35%,#2563eb_100%)] text-white shadow-[0_18px_30px_-18px_rgba(37,99,235,0.8)]">
            <CreditCard className="h-5 w-5 text-blue-200" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[13px] font-black tracking-[-0.04em] text-slate-900">{shopName}</h2>
            <div className="mt-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {businessCategory} hub
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-2">
        <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">Workspace</div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group relative flex items-center justify-between rounded-[18px] px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-[0_16px_28px_-18px_rgba(15,23,42,0.85)]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute inset-y-1 left-1 w-1 rounded-full bg-blue-400" />}
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-900'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="tracking-[-0.02em]">{item.name}</span>
                  </div>

                  {item.badge ? (
                    <span
                      className={`rounded-full px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] ${
                        isActive ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight
                      className={`h-3.5 w-3.5 transition-all ${
                        isActive ? 'translate-x-0.5 text-white/70' : 'text-slate-300 group-hover:translate-x-0.5 group-hover:text-slate-500'
                      }`}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-200/80 p-3">
        <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f172a,#1e293b,#2563eb)] text-sm font-black text-white shadow-[0_16px_25px_-18px_rgba(15,23,42,0.9)]">
                {ownerName ? ownerName.charAt(0).toUpperCase() : 'O'}
              </div>
              <div className="min-w-0">
                <div className="truncate text-xs font-bold text-slate-900">{ownerName}</div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Online
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              title="Sign Out"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
