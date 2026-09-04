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
    <aside className="hidden lg:flex flex-col w-72 h-[calc(100vh-3rem)] sticky top-6 my-auto bg-white rounded-[32px] border border-slate-900/[0.06] shadow-card flex-shrink-0 z-30 select-none overflow-hidden transition-all duration-300">
      {/* Top Logo & Shop Branding */}
      <div className="p-6 pb-5 border-b border-slate-100/60">
        <div className="flex items-center gap-3.5">
          {/* Geometric Logo Container */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center text-white shadow-soft flex-shrink-0 border border-slate-700/40">
            <CreditCard className="w-6 h-6 text-blue-400" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="font-extrabold text-sm text-slate-900 truncate tracking-tight">
              {shopName}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
                {businessCategory} Hub
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 py-5 space-y-2 overflow-y-auto">
        <div className="px-3.5 pb-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
          Main Menu
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 group ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-button'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3.5">
                    {/* Icon inside rounded square */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-white/15 text-white'
                          : 'bg-slate-100/80 text-slate-500 group-hover:bg-slate-200/70 group-hover:text-slate-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="tracking-tight text-xs font-bold">{item.name}</span>
                  </div>

                  {item.badge ? (
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-subtle ${
                        isActive
                          ? 'bg-blue-500 text-white'
                          : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        isActive
                          ? 'text-white/60 translate-x-0.5'
                          : 'text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'
                      }`}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Profile Card */}
      <div className="p-4 border-t border-slate-100/80 bg-slate-50/50">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-900/[0.05] shadow-subtle hover:shadow-soft transition-all">
          <div className="flex items-center gap-3 min-w-0">
            {/* Owner Avatar */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center text-sm font-extrabold flex-shrink-0 shadow-subtle border border-slate-700/50">
              {ownerName ? ownerName.charAt(0).toUpperCase() : 'O'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-slate-900 truncate tracking-tight">
                {ownerName}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Shop Owner</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            title="Sign Out"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
