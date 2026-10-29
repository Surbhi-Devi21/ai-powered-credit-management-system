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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {kpiCards.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            whileHover={{ y: -4, scale: 1.01 }}
          >
            <div className="group relative h-full overflow-hidden rounded-[26px] border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.25)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_24px_60px_-28px_rgba(15,23,42,0.28)] sm:p-5">
              <div className="absolute inset-x-6 top-0 h-12 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.10),_transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">{kpi.title}</p>
                </div>
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${kpi.bgIcon}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="relative mt-6">
                <div className={`tabular-nums text-2xl font-black tracking-[-0.06em] sm:text-[2rem] ${kpi.valueColor}`}>
                  {kpi.value}
                </div>
                <p className="mt-2 text-[11px] font-medium text-slate-500">{kpi.subtitle}</p>
              </div>

              <div className="relative mt-5 border-t border-slate-200/80 pt-3">
                <Badge variant={kpi.badgeVariant} size="sm">
                  {kpi.badgeText}
                </Badge>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
