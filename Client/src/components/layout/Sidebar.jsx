import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BellRing,
  Sparkles,
  Settings,
  LogOut,
  Store,
  ChevronRight,
} from 'lucide-react';

/**
 * Modern 2026 SaaS Desktop Sidebar Component (Linear / Notion / Stripe style)
 * Clean hairline border, active tab indicator pills, shop branding, and owner profile card.
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
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-white border-r border-slate-200/80 shadow-sm flex-shrink-0 z-30 select-none">
      {/* Top Shop Branding Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-white shadow-md shadow-slate-900/10 flex-shrink-0 border border-slate-700/40">
            <Store className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-extrabold text-sm text-slate-900 truncate tracking-tight">
              {shopName}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate">
                {businessCategory}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
          Main Ledger
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-blue-500 text-white shadow-sm">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Owner Profile & Logout */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/60">
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-extrabold flex-shrink-0 shadow-sm">
              {ownerName ? ownerName.charAt(0).toUpperCase() : 'O'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-slate-900 truncate tracking-tight">{ownerName}</div>
              <div className="text-[10px] font-semibold text-slate-400">Shop Owner</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
