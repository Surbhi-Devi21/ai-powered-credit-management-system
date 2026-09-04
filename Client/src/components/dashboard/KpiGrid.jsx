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
 * Premium SaaS Dashboard KPI Overview Grid Component (Stripe / Mercury / Ramp style)
 * Large floating white cards (rounded-3xl / 28px radius), bold tabular figures, colorful icon badges, and smooth hover lifts.
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
      bgIcon: 'bg-emerald-50 text-emerald-600',
      valueColor: 'text-emerald-600',
      badgeText: todayCollection > 0 ? 'Cash Inflow' : 'No Jama Today',
      badgeVariant: 'settled',
    },
    {
      title: "Today's Credit Given",
      value: formatCurrency(todayCredit),
      subtitle: `${todayCreditCount} credit slips recorded`,
      icon: ArrowUpRight,
      bgIcon: 'bg-rose-50 text-rose-600',
      valueColor: 'text-rose-600',
      badgeText: todayCredit > 0 ? 'Credit Outflow' : 'No Udhar Today',
      badgeVariant: 'overdue',
    },
    {
      title: 'Total Market Dues',
      value: formatCurrency(totalOutstandingDues),
      subtitle: `Pending across ${activeDebtors} debtors`,
      icon: TrendingUp,
      bgIcon: 'bg-rose-50 text-rose-600',
      valueColor: 'text-slate-900',
      badgeText: `${activeDebtors} Debtors Pending`,
      badgeVariant: 'pending',
    },
    {
      title: 'Customers in Khata',
      value: `${totalCustomers}`,
      subtitle: `${settledCustomers} accounts at ₹0 balance`,
      icon: Users,
      bgIcon: 'bg-blue-50 text-blue-600',
      valueColor: 'text-slate-900',
      badgeText: 'Active Directory',
      badgeVariant: 'info',
    },
    {
      title: 'Avg. Debtor Balance',
      value: formatCurrency(avgDebtorDebt),
      subtitle: 'Mean debt exposure per debtor',
      icon: CreditCard,
      bgIcon: 'bg-slate-100 text-slate-700',
      valueColor: 'text-slate-900',
      badgeText: 'Risk Metric',
      badgeVariant: 'neutral',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8">
      {kpiCards.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card
              hoverable
              padding="md"
              className="flex flex-col justify-between h-full space-y-5"
            >
              {/* Header: Title & Colorful Rounded Icon Container */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest truncate">
                  {kpi.title}
                </span>
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft ${kpi.bgIcon}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {/* Middle: Very Large Hero Metric Value */}
              <div className="space-y-1">
                <div
                  className={`text-2xl sm:text-[28px] font-extrabold tabular-nums tracking-tight ${kpi.valueColor}`}
                >
                  {kpi.value}
                </div>
                <p className="text-xs text-slate-500 font-medium truncate">{kpi.subtitle}</p>
              </div>

              {/* Bottom: Semantic Status Badge */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
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
