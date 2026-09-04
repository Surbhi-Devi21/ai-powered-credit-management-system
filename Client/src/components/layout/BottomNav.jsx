import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BellRing, Sparkles } from 'lucide-react';

/**
 * Premium SaaS Mobile Bottom Navigation Component
 * Features clean white floating dock, rounded active indicators, and soft shadows.
 */
export default function BottomNav() {
  const tabs = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Reminders', path: '/reminders', icon: BellRing },
    { name: 'AI Insights', path: '/ai-insights', icon: Sparkles, badge: 'AI' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-100 shadow-dropdown z-40 px-3 flex items-center justify-around select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  {tab.badge && (
                    <span className="absolute -top-1 -right-2.5 text-[8px] font-extrabold px-1 rounded-full bg-blue-600 text-white shadow-soft">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 tracking-tight font-bold">{tab.name}</span>

                {/* Active indicator pill dot */}
                {isActive && (
                  <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-blue-600" />
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
