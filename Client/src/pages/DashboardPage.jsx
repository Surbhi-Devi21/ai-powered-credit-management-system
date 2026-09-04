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
    <div className="space-y-8 lg:space-y-10 pb-16">
      {/* 12-Column Main Dashboard Grid */}
      <div className="grid grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Row 1: Top Welcome Panel & Quick Actions (12 Columns) */}
        <div className="col-span-12">
          <div className="p-7 sm:p-9 lg:p-10 rounded-[32px] bg-white border border-slate-900/[0.06] shadow-card hover:shadow-cardHover transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Live Financial Intelligence
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                {user?.businessName || 'My Retail Store'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl">
                Daily counter credit exposure, collections summary, and customer risk velocity for{' '}
                <strong className="text-slate-800 font-bold">{user?.name}</strong>.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto flex-shrink-0">
              <Button
                variant="secondary"
                size="md"
                onClick={handleRefresh}
                isLoading={refreshing}
                icon={RefreshCw}
                className="rounded-full shadow-subtle hover:shadow-soft"
              >
                Refresh Data
              </Button>
            </div>
          </div>
        </div>

        {/* Row 2: 5-Metric Financial KPI Overview (12 Columns) */}
        <div className="col-span-12">
          <KpiGrid kpis={kpis} />
        </div>

        {/* Row 3: Cash Flow Trends Graph (12 Columns) */}
        <div className="col-span-12">
          <CashFlowChart
            trends={trendsData}
            days={chartDays}
            onDaysChange={handleChartDaysChange}
          />
        </div>

        {/* Row 4: Dual Exposure Grid - Top Debtors (6 Columns) & Recent Activity Stream (6 Columns) */}
        <div className="col-span-12 lg:col-span-6">
          <TopDebtorsWidget
            debtors={topDebtors || []}
            totalOutstandingDues={kpis?.totalOutstandingDues || 0}
          />
        </div>

        <div className="col-span-12 lg:col-span-6">
          <RecentActivityFeed
            transactions={recentTransactions || []}
          />
        </div>

        {/* Row 5: AI Business Assistant Spotlight Widget (12 Columns) */}
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
