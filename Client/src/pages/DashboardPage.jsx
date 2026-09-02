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

/**
 * Modern 2026 SaaS Dashboard Page (Stripe / Mercury / Linear style)
 * Features real-time operational intelligence, large floating cards, Recharts visualizations, and live stream.
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
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Skeleton variant="kpiCard" count={5} />
        </div>
        <Skeleton variant="card" height={320} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton variant="card" height={340} count={2} />
        </div>
      </div>
    );
  }

  const { kpis, topDebtors, recentTransactions } = summaryData || {};

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Welcome Bar & Refresh Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-card">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
              Live Counter Status
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {user?.businessName || 'My Retail Store'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Daily counter financial intelligence and customer dues summary for{' '}
            <strong className="text-slate-800 font-bold">{user?.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button
            variant="secondary"
            size="md"
            onClick={handleRefresh}
            isLoading={refreshing}
            icon={RefreshCw}
          >
            Refresh Live Metrics
          </Button>
        </div>
      </div>

      {/* 5-Column High-Contrast Financial KPI Grid */}
      <KpiGrid kpis={kpis} />

      {/* Cash Flow Trends Graph (Recharts Area Chart) */}
      <CashFlowChart
        trends={trendsData}
        days={chartDays}
        onDaysChange={handleChartDaysChange}
      />

      {/* Dual Exposure Columns: Top Debtors & Recent Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Left: Top 5 Highest Exposure Debtors */}
        <TopDebtorsWidget
          debtors={topDebtors || []}
          totalOutstandingDues={kpis?.totalOutstandingDues || 0}
        />

        {/* Right: Live Recent Transactions Activity Stream */}
        <RecentActivityFeed
          transactions={recentTransactions || []}
        />
      </div>

      {/* AI Business Assistant Spotlight Widget */}
      <AiQuickInsightsBanner
        todayCollection={kpis?.todayCollection || 0}
        totalOutstandingDues={kpis?.totalOutstandingDues || 0}
        activeDebtors={kpis?.activeDebtors || 0}
      />
    </div>
  );
}
