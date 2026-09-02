import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BellRing, Sparkles } from 'lucide-react';

/**
 * Modern 2026 Revolut-Style Mobile Bottom Dock Navigation Component
 * Glassmorphic floating bottom navigation with tactile touch states and active indicators.
 */
export default function BottomNav() {
  const tabs = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Reminders', path: '/reminders', icon: BellRing },
    { name: 'AI Insights', path: '/ai-insights', icon: Sparkles, badge: 'AI' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-lg z-40 px-3 flex items-center justify-around select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
                isActive ? 'text-brand-accent font-bold' : 'text-slate-400 hover:text-slate-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  {tab.badge && (
                    <span className="absolute -top-1 -right-2.5 text-[8px] font-extrabold px-1 rounded-full bg-blue-600 text-white shadow-sm">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 tracking-tight font-semibold">{tab.name}</span>

                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-brand-accent shadow-glow" />
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
