import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellRing,
  RefreshCw,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { customerService } from '../services/customerService';
import { transactionService } from '../services/transactionService';
import { useAuth } from '../context/AuthContext';
import {
  getDaysOverdue,
  getOverdueBucket,
  calculatePriority,
} from '../utils/reminderUtils';

// Components
import ReminderKpiGrid from '../components/reminders/ReminderKpiGrid';
import ReminderFilters from '../components/reminders/ReminderFilters';
import ReminderTable from '../components/reminders/ReminderTable';
import ReminderCard from '../components/reminders/ReminderCard';
import ReminderModal from '../components/reminders/ReminderModal';
import Pagination from '../components/common/Pagination';
import Skeleton from '../components/common/Skeleton';
import Button from '../components/common/Button';

/**
 * Premium SaaS Payment Reminders & Overdue Tracking Module
 * Route: /reminders
 * Features:
 * - Real-time Overdue Statistics KPIs
 * - Dynamic Priority Matrix (LOW, MEDIUM, HIGH, CRITICAL)
 * - 5-Stage Overdue Aging Buckets (Today, 1–7d, 8–30d, 31–60d, 60+d)
 * - Desktop Statement Table & Tactile Mobile Card List
 * - WhatsApp Reminder Dispatcher using https://wa.me/
 * - Ephemeral / LocalStorage Reminder Status Tracking
 */
export default function RemindersPage() {
  const { user, showToast } = useAuth();

  // Primary State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reminderItems, setReminderItems] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Filter & Search State
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [activeAging, setActiveAging] = useState('ALL');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('highest_risk');

  // WhatsApp Modal State
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // LocalStorage Key for tracking sent reminders per shop owner
  const storageKey = `khata_reminders_${user?._id || 'default'}`;

  // Sent Reminders Memory Map
  const [reminderHistory, setReminderHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save history updates to localStorage
  const recordSentReminder = useCallback(
    (customerId) => {
      const now = new Date();
      const formattedTime = new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(now);

      setReminderHistory((prev) => {
        const updated = {
          ...prev,
          [customerId]: {
            sentAt: now.toISOString(),
            formattedTime,
          },
        };
        try {
          localStorage.setItem(storageKey, JSON.stringify(updated));
        } catch {
          // ignore localStorage quota errors
        }
        return updated;
      });

      showToast('WhatsApp reminder recorded successfully.', 'success');
    },
    [storageKey, showToast]
  );

  // Fetch Customers & Compute Overdue Aging Dynamically
  const fetchReminderData = useCallback(async () => {
    try {
      // Step 1: Fetch all customers for this shop owner
      const response = await customerService.getCustomers({ limit: 100 });

      if (!response?.success) return;

      const customersList = response.data?.customers || [];

      // Step 2: Fetch latest credit transaction for active debtors to get exact due dates
      const activeDebtors = customersList.filter((c) => c.currentBalance > 0);

      const debtorLedgerPromises = activeDebtors.map(async (c) => {
        try {
          const ledgerRes = await transactionService.getCustomerLedger(c._id, {
            type: 'CREDIT',
            limit: 1,
          });
          const latestCredit = ledgerRes?.data?.transactions?.[0];
          return {
            customerId: c._id,
            dueDate: latestCredit?.dueDate || null,
          };
        } catch {
          return { customerId: c._id, dueDate: null };
        }
      });

      const ledgerResults = await Promise.allSettled(debtorLedgerPromises);

      const dueDateMap = new Map();
      ledgerResults.forEach((res) => {
        if (res.status === 'fulfilled' && res.value) {
          dueDateMap.set(res.value.customerId, res.value.dueDate);
        }
      });

      // Step 3: Compute priority, aging, and days overdue dynamically
      const processedItems = customersList.map((customer) => {
        const isDebtor = customer.currentBalance > 0;
        let dueDate = dueDateMap.get(customer._id);

        // Fallback due date if not explicitly set: 15 days after lastTransactionDate or creation
        if (!dueDate && isDebtor) {
          const baseDate = customer.lastTransactionDate
            ? new Date(customer.lastTransactionDate)
            : new Date(customer.createdAt);
          dueDate = new Date(baseDate.getTime() + 15 * 86400000);
        }

        const daysOverdue = isDebtor ? getDaysOverdue(dueDate) : 0;
        const priority = calculatePriority(customer, daysOverdue);
        const agingBucket = getOverdueBucket(daysOverdue, customer.currentBalance);

        return {
          customer,
          dueDate,
          daysOverdue,
          priority,
          agingBucket,
        };
      });

      setReminderItems(processedItems);
    } catch (error) {
      showToast(error.message, 'error', 'Failed to load reminders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchReminderData();
  }, [fetchReminderData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchReminderData();
  };

  // Open WhatsApp Modal
  const handleOpenWhatsApp = (item) => {
    setSelectedReminder(item);
    setIsModalOpen(true);
  };

  // Calculate Overall Statistics & Bucket Counts
  const stats = useMemo(() => {
    let totalPendingAmount = 0;
    let overdueCount = 0;
    let dueTodayCount = 0;
    let highPriorityCount = 0;
    let activeDebtorCount = 0;
    let settledCount = 0;

    let agingToday = 0;
    let aging1to7 = 0;
    let aging8to30 = 0;
    let aging31to60 = 0;
    let aging60Plus = 0;

    reminderItems.forEach(({ customer, priority, daysOverdue, agingBucket }) => {
      const balance = customer.currentBalance || 0;

      if (balance > 0) {
        totalPendingAmount += balance;
        activeDebtorCount++;

        if (daysOverdue > 0) overdueCount++;
        if (daysOverdue === 0) dueTodayCount++;

        if (priority.level === 'HIGH' || priority.level === 'CRITICAL') {
          highPriorityCount++;
        }

        if (agingBucket === 'TODAY') agingToday++;
        else if (agingBucket === '1-7_DAYS') aging1to7++;
        else if (agingBucket === '8-30_DAYS') aging8to30++;
        else if (agingBucket === '31-60_DAYS') aging31to60++;
        else if (agingBucket === '60+_DAYS') aging60Plus++;
      } else {
        settledCount++;
      }
    });

    return {
      totalPendingAmount,
      overdueCount,
      dueTodayCount,
      highPriorityCount,
      activeDebtorCount,
      counts: {
        all: reminderItems.length,
        overdue: overdueCount,
        dueToday: dueTodayCount,
        highPriority: highPriorityCount,
        settled: settledCount,
        agingToday,
        aging1to7,
        aging8to30,
        aging31to60,
        aging60Plus,
      },
    };
  }, [reminderItems]);

  // Filter & Search Pipeline
  const filteredItems = useMemo(() => {
    return reminderItems.filter(({ customer, priority, daysOverdue, agingBucket }) => {
      const balance = customer.currentBalance || 0;

      // Primary Status Filter
      if (activeFilter === 'OVERDUE' && (daysOverdue <= 0 || balance <= 0)) return false;
      if (activeFilter === 'DUE_TODAY' && (daysOverdue !== 0 || balance <= 0)) return false;
      if (
        activeFilter === 'HIGH_PRIORITY' &&
        priority.level !== 'HIGH' &&
        priority.level !== 'CRITICAL'
      )
        return false;
      if (activeFilter === 'SETTLED' && balance > 0) return false;

      // Aging Bucket Filter
      if (activeAging !== 'ALL' && agingBucket !== activeAging) return false;

      // Search Query Filter
      if (search.trim()) {
        const query = search.trim().toLowerCase();
        const matchesName = customer.name.toLowerCase().includes(query);
        const matchesPhone = (customer.phone || '').includes(query);
        const matchesAddress = (customer.address || '').toLowerCase().includes(query);
        if (!matchesName && !matchesPhone && !matchesAddress) return false;
      }

      return true;
    });
  }, [reminderItems, activeFilter, activeAging, search]);

  // Sorting Pipeline
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      if (sortBy === 'highest_amount') {
        return (b.customer.currentBalance || 0) - (a.customer.currentBalance || 0);
      }
      if (sortBy === 'oldest_due') {
        return (b.daysOverdue || 0) - (a.daysOverdue || 0);
      }
      if (sortBy === 'newest_due') {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        return dateB - dateA;
      }
      // Default: highest_risk (CRITICAL -> HIGH -> MEDIUM -> LOW -> SETTLED)
      return b.priority.score - a.priority.score;
    });
  }, [filteredItems, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedItems.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return sortedItems.slice(startIndex, startIndex + pageSize);
  }, [sortedItems, page, pageSize]);

  // Reset Filters Handler
  const handleResetFilters = () => {
    setActiveFilter('ALL');
    setActiveAging('ALL');
    setSearch('');
    setPage(1);
  };

  if (loading && reminderItems.length === 0) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        <Skeleton variant="card" height={150} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton variant="kpiCard" count={4} />
        </div>
        <Skeleton variant="card" height={80} />
        <Skeleton variant="card" height={400} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16 sm:space-y-8">
      <div className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_35%,#fff7ed_100%)] p-6 shadow-[0_30px_80px_-38px_rgba(15,23,42,0.28)] sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-amber-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
              </span>
              Payment follow-up system
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-[-0.06em] text-slate-900 sm:text-4xl">
                {user?.businessName || 'My Retail Store'}
              </h2>
              <p className="mt-2 max-w-2xl text-sm font-medium text-slate-600 sm:text-base">
                Smart repayment tracking for overdue balances, collection follow-ups, and customer priority management.
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={handleRefresh}
            isLoading={refreshing}
            icon={RefreshCw}
            className="rounded-full border border-slate-200 bg-white shadow-[0_12px_25px_-18px_rgba(15,23,42,0.5)]"
          >
            Refresh data
          </Button>
        </div>
      </div>

      <ReminderKpiGrid
        totalPendingAmount={stats.totalPendingAmount}
        overdueCount={stats.overdueCount}
        dueTodayCount={stats.dueTodayCount}
        highPriorityCount={stats.highPriorityCount}
        activeDebtorCount={stats.activeDebtorCount}
      />

      <ReminderFilters
        activeFilter={activeFilter}
        onFilterChange={(f) => {
          setActiveFilter(f);
          setPage(1);
        }}
        activeAging={activeAging}
        onAgingChange={(a) => {
          setActiveAging(a);
          setPage(1);
        }}
        search={search}
        onSearchChange={(s) => {
          setSearch(s);
          setPage(1);
        }}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onResetFilters={handleResetFilters}
        counts={stats.counts}
      />

      {paginatedItems.length === 0 ? (
        <div className="rounded-[30px] border border-slate-200/80 bg-white p-8 text-center shadow-[0_25px_70px_-35px_rgba(15,23,42,0.22)] sm:p-10">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[22px] bg-slate-100 text-slate-600">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          </div>
          <h3 className="text-xl font-black tracking-[-0.05em] text-slate-900">No matching reminders in this queue</h3>
          <p className="mx-auto mt-2 max-w-md text-sm font-medium text-slate-500">
            All accounts in this filter criteria are either up-to-date, settled, or cleared.
          </p>
          <div className="mt-5">
            <Button variant="secondary" size="sm" onClick={handleResetFilters} className="rounded-full">
              Clear all filters
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="hidden gap-5 lg:grid lg:grid-cols-2 xl:grid-cols-3">
            {paginatedItems.map((item) => (
              <ReminderCard
                key={item.customer._id}
                item={item}
                reminderHistory={reminderHistory}
                onSendWhatsApp={handleOpenWhatsApp}
              />
            ))}
          </div>

          <div className="space-y-4 lg:hidden">
            <AnimatePresence mode="popLayout">
              {paginatedItems.map((item) => (
                <ReminderCard
                  key={item.customer._id}
                  item={item}
                  reminderHistory={reminderHistory}
                  onSendWhatsApp={handleOpenWhatsApp}
                />
              ))}
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={sortedItems.length}
              pageSize={pageSize}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )}
        </div>
      )}

      <ReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reminderItem={selectedReminder}
        businessName={user?.businessName || 'My Retail Store'}
        onConfirmSent={recordSentReminder}
      />
    </div>
  );
}
