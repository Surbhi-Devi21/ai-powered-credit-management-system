import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Users,
  CreditCard,
} from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * Modern 2026 SaaS Dashboard KPI Overview Grid Component (Stripe / Mercury / Ramp style)
 * Large white floating cards (rounded-3xl), 30px bold tabular figures, frosted glass icon badges, and micro-interactions.
 */
export default function KpiGrid({ kpis }) {
  const {
    todayCollection = 0,
    todayPaymentsCount = 0,
    todayCredit = 0,
    todayCreditCount = 0,
    totalOutstandingDues = 0,
    totalCustomers = 0,
    activeDebtors = 0,
    settledCustomers = 0,
    avgDebtorDebt = 0,
  } = kpis || {};

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);

  const kpiCards = [
    {
      title: "Today's Collection",
      value: formatCurrency(todayCollection),
      subtitle: `${todayPaymentsCount} payments cleared today`,
      icon: ArrowDownLeft,
      bgIcon: 'bg-emerald-50 text-emerald-600 border border-emerald-200/80',
      valueColor: 'text-emerald-600',
      badgeText: todayCollection > 0 ? 'Cash Inflow' : 'No Jama Today',
      badgeVariant: 'settled',
    },
    {
      title: "Today's Credit Given",
      value: formatCurrency(todayCredit),
      subtitle: `${todayCreditCount} credit slips recorded`,
      icon: ArrowUpRight,
      bgIcon: 'bg-rose-50 text-rose-600 border border-rose-200/80',
      valueColor: 'text-rose-600',
      badgeText: todayCredit > 0 ? 'Credit Outflow' : 'No Udhar Today',
      badgeVariant: 'overdue',
    },
    {
      title: 'Total Market Dues',
      value: formatCurrency(totalOutstandingDues),
      subtitle: `Pending across ${activeDebtors} debtors`,
      icon: TrendingUp,
      bgIcon: 'bg-rose-50 text-rose-600 border border-rose-200/80',
      valueColor: 'text-slate-900',
      badgeText: `${activeDebtors} Debtors Pending`,
      badgeVariant: 'pending',
    },
    {
      title: 'Customers in Khata',
      value: `${totalCustomers}`,
      subtitle: `${settledCustomers} accounts at ₹0 balance`,
      icon: Users,
      bgIcon: 'bg-blue-50 text-brand-accent border border-blue-200/80',
      valueColor: 'text-slate-900',
      badgeText: 'Active Directory',
      badgeVariant: 'info',
    },
    {
      title: 'Avg. Debtor Balance',
      value: formatCurrency(avgDebtorDebt),
      subtitle: 'Mean debt exposure per debtor',
      icon: CreditCard,
      bgIcon: 'bg-slate-100 text-slate-700 border border-slate-200',
      valueColor: 'text-slate-900',
      badgeText: 'Risk Metric',
      badgeVariant: 'neutral',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
      {kpiCards.map((kpi, index) => {
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
              padding="sm"
              className="flex flex-col justify-between h-full space-y-4 relative group"
            >
              {/* Header: Title & Circular Icon */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest truncate">
                  {kpi.title}
                </span>
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${kpi.bgIcon}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Middle: Hero Metric Value */}
              <div>
                <div
                  className={`text-2xl sm:text-[26px] font-extrabold tabular-nums tracking-tight ${kpi.valueColor}`}
                >
                  {kpi.value}
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1 truncate">{kpi.subtitle}</p>
              </div>

              {/* Bottom: Semantic Status Badge */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
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
