import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Clock,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * Reminder & Overdue Statistics KPI Overview Component
 * 4 Metrics: Total Pending Amount, Total Overdue Customers, Due Today, High Priority Customers.
 * Reuses existing Dashboard Card design language with 28px rounded corners & tabular-nums.
 */
export default function ReminderKpiGrid({
  totalPendingAmount = 0,
  overdueCount = 0,
  dueTodayCount = 0,
  highPriorityCount = 0,
  activeDebtorCount = 0,
}) {
  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(val);

  const kpis = [
    {
      title: 'Total Pending Dues',
      value: formatCurrency(totalPendingAmount),
      subtitle: `Across ${activeDebtorCount} active debtors`,
      icon: TrendingUp,
      bgIcon: 'bg-rose-50 text-rose-600',
      valueColor: 'text-slate-900',
      badgeText: 'Total Market Dues',
      badgeVariant: 'overdue',
    },
    {
      title: 'Overdue Customers',
      value: `${overdueCount}`,
      subtitle: `${overdueCount} accounts past due date`,
      icon: Clock,
      bgIcon: 'bg-amber-50 text-amber-600',
      valueColor: 'text-amber-600',
      badgeText: overdueCount > 0 ? 'Action Required' : 'All On Time',
      badgeVariant: overdueCount > 0 ? 'warning' : 'settled',
    },
    {
      title: 'Due Today',
      value: `${dueTodayCount}`,
      subtitle: 'Expected collection today',
      icon: Calendar,
      bgIcon: 'bg-blue-50 text-blue-600',
      valueColor: 'text-blue-600',
      badgeText: "Today's Pipeline",
      badgeVariant: 'info',
    },
    {
      title: 'High Priority Accounts',
      value: `${highPriorityCount}`,
      subtitle: 'High & Critical risk queue',
      icon: AlertTriangle,
      bgIcon: 'bg-rose-50 text-rose-600',
      valueColor: 'text-rose-600',
      badgeText: 'Priority Reminders',
      badgeVariant: 'danger',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
          >
            <Card
              hoverable
              padding="md"
              className="flex flex-col justify-between h-full space-y-4"
            >
              {/* Header: Title & Colorful Icon */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest truncate">
                  {kpi.title}
                </span>
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft ${kpi.bgIcon}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {/* Metric Hero Number */}
              <div className="space-y-1">
                <div
                  className={`text-2xl sm:text-3xl font-extrabold tabular-nums tracking-tight ${kpi.valueColor}`}
                >
                  {kpi.value}
                </div>
                <p className="text-xs text-slate-500 font-medium truncate">{kpi.subtitle}</p>
              </div>

              {/* Status Badge */}
              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                <Badge variant={kpi.badgeVariant} size="sm">
                  {kpi.badgeText}
                </Badge>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
