import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Store } from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { useAuth } from '../context/AuthContext';

// Dashboard Components
import KpiGrid from '../components/dashboard/KpiGrid';
import CashFlowChart from '../components/dashboard/CashFlowChart';
import TopDebtorsWidget from '../components/dashboard/TopDebtorsWidget';
import RecentActivityFeed from '../components/dashboard/RecentActivityFeed';
import AiQuickInsightsBanner from '../components/dashboard/AiQuickInsightsBanner';
import Skeleton from '../components/common/Skeleton';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

/**
 * Premium SaaS Dashboard Page (Stripe / Linear / Mercury style)
 * Features real-time operational intelligence, large floating white panels (28px radius),
 * spacious padding, Recharts area trends, and live activity stream.
 */
export default function DashboardPage() {
  const { user, showToast } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [trendsData, setTrendsData] = useState([]);
  const [chartDays, setChartDays] = useState(7);

  // Fetch Dashboard Summary & Trends
  const fetchDashboardData = useCallback(async () => {
    try {
      const [summaryRes, trendsRes] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getTrends(chartDays),
      ]);

      if (summaryRes?.success) {
        setSummaryData(summaryRes.data);
      }

      if (trendsRes?.success) {
        setTrendsData(trendsRes.data.trends || []);
      }
    } catch (error) {
      showToast(error.message, 'error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [chartDays, showToast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleChartDaysChange = async (days) => {
    setChartDays(days);
    try {
      const res = await dashboardService.getTrends(days);
      if (res?.success) {
        setTrendsData(res.data.trends || []);
      }
    } catch (error) {
      showToast(error.message, 'error', 'Failed to refresh chart range');
    }
  };

  if (loading && !summaryData) {
    return (
      <div className="grid grid-cols-12 gap-6 sm:gap-8 lg:gap-10 pb-16">
        <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          <Skeleton variant="kpiCard" count={5} />
        </div>
        <div className="col-span-12">
          <Skeleton variant="card" height={360} />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <Skeleton variant="card" height={380} />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <Skeleton variant="card" height={380} />
        </div>
      </div>
    );
  }

  const { kpis, topDebtors, recentTransactions } = summaryData || {};

  return (
    <div className="space-y-6 pb-16 lg:space-y-8">
      <div className="grid grid-cols-12 gap-5 lg:gap-6">
        <div className="col-span-12">
          <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_35%,#eef2ff_100%)] p-6 shadow-[0_30px_80px_-38px_rgba(15,23,42,0.32)] sm:p-8 lg:p-10">
            <div className="absolute -right-10 -top-16 h-52 w-52 rounded-full bg-[radial-gradient(circle,_rgba(37,99,235,0.18),_transparent_65%)] blur-2xl" />
            <div className="absolute -bottom-12 left-1/3 h-48 w-48 rounded-full bg-[radial-gradient(circle,_rgba(168,85,247,0.12),_transparent_65%)] blur-2xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Live financial intelligence
                </div>

                <div className="space-y-3">
                  <h2 className="text-3xl font-black tracking-[-0.06em] text-slate-900 sm:text-4xl lg:text-[3.25rem]">
                    {user?.businessName || 'My Retail Store'}
                  </h2>
                  <p className="max-w-2xl text-sm font-medium text-slate-600 sm:text-base">
                    Daily credit exposure, collectible movement, and customer risk signals for{' '}
                    <span className="font-bold text-slate-900">{user?.name}</span>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start lg:self-auto">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleRefresh}
                  isLoading={refreshing}
                  icon={RefreshCw}
                  className="rounded-full border border-slate-200 bg-white/90 shadow-[0_12px_25px_-18px_rgba(15,23,42,0.5)]"
                >
                  Refresh data
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12">
          <KpiGrid kpis={kpis} />
        </div>

        <div className="col-span-12">
          <CashFlowChart
            trends={trendsData}
            days={chartDays}
            onDaysChange={handleChartDaysChange}
          />
        </div>

        <div className="col-span-12 lg:col-span-6">
          <TopDebtorsWidget
            debtors={topDebtors || []}
            totalOutstandingDues={kpis?.totalOutstandingDues || 0}
          />
        </div>

        <div className="col-span-12 lg:col-span-6">
          <RecentActivityFeed transactions={recentTransactions || []} />
        </div>

        <div className="col-span-12">
          <AiQuickInsightsBanner
            todayCollection={kpis?.todayCollection || 0}
            totalOutstandingDues={kpis?.totalOutstandingDues || 0}
            activeDebtors={kpis?.activeDebtors || 0}
          />
        </div>
      </div>
    </div>
  );
}
