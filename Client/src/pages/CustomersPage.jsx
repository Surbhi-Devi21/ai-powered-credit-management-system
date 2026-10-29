import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, TrendingUp, CheckCircle2, UserPlus } from 'lucide-react';
import { customerService } from '../services/customerService';
import { useAuth } from '../context/AuthContext';

// Components
import CustomerCard from '../components/customers/CustomerCard';
import CustomerSearch from '../components/customers/CustomerSearch';
import CustomerFilters from '../components/customers/CustomerFilters';
import CustomerForm from '../components/customers/CustomerForm';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import Skeleton from '../components/common/Skeleton';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

/**
 * Premium SaaS Customer Directory Page (Stripe / Mercury / Linear style)
 * Large floating metric cards, instant search, status filter pills, and responsive customer cards.
 */
export default function CustomersPage() {
  const { showToast } = useAuth();

  // State Management
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({
    totalOutstanding: 0,
    totalCustomers: 0,
    activeDebtors: 0,
  });
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters State
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('active');
  const [sortBy, setSortBy] = useState('recent');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch Customers Data
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await customerService.getCustomers({
        search,
        status,
        sortBy,
        sortOrder,
        page,
        limit: 12,
      });

      if (response?.success) {
        setCustomers(response.data.customers || []);
        setStats(
          response.stats || {
            totalOutstanding: 0,
            totalCustomers: 0,
            activeDebtors: 0,
          }
        );
        setTotalCount(response.total || 0);
        setTotalPages(response.totalPages || 1);
      }
    } catch (error) {
      showToast(error.message, 'error', 'Failed to load customer records');
    } finally {
      setLoading(false);
    }
  }, [search, status, sortBy, sortOrder, page, showToast]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Handle Add Customer Submission
  const handleCreateCustomer = async (formData) => {
    setSubmitting(true);
    try {
      const response = await customerService.createCustomer(formData);
      if (response?.success) {
        showToast(
          `${formData.name} added to your directory successfully.`,
          'success'
        );
        setIsFormOpen(false);
        fetchCustomers();
      }
    } catch (error) {
      showToast(error.message, 'error', 'Failed to add customer');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(val);

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16 sm:space-y-8">
      <div className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_35%,#eef2ff_100%)] p-6 shadow-[0_30px_80px_-38px_rgba(15,23,42,0.28)] sm:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Customer portfolio
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-[-0.06em] text-slate-900 sm:text-4xl">
                Customer Khata Accounts
              </h2>
              <p className="mt-2 max-w-2xl text-sm font-medium text-slate-600">
                Manage debtors, balances, contact profiles, and payment histories in a cleaner, premium workspace.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => setIsFormOpen(true)}
            icon={UserPlus}
            className="rounded-full shadow-[0_16px_30px_-18px_rgba(15,23,42,0.75)]"
          >
            + Add New Customer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.22)] sm:p-6">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">Total market dues</span>
            <TrendingUp className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-5 tabular-nums text-3xl font-black tracking-[-0.06em] text-rose-600 sm:text-4xl">
            {formatCurrency(stats.totalOutstanding)}
          </div>
          <p className="mt-2 text-xs font-medium text-slate-500">Pending collection across active accounts</p>
        </div>

        <div className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.22)] sm:p-6">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">Total customers</span>
            <Users className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-5 tabular-nums text-3xl font-black tracking-[-0.06em] text-slate-900 sm:text-4xl">
            {stats.totalCustomers}
          </div>
          <p className="mt-2 text-xs font-medium text-slate-500">Registered in store directory</p>
        </div>

        <div className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.22)] sm:p-6">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">Active debtors</span>
            <CheckCircle2 className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-5 tabular-nums text-3xl font-black tracking-[-0.06em] text-slate-900 sm:text-4xl">
            {stats.activeDebtors}
          </div>
          <p className="mt-2 text-xs font-medium text-slate-500">Customers currently with pending credit</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="space-y-5">
        <CustomerSearch
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          onClear={() => {
            setSearch('');
            setPage(1);
          }}
        />

        <CustomerFilters
          activeStatus={status}
          onStatusChange={(val) => {
            setStatus(val);
            setPage(1);
          }}
          sortBy={sortBy}
          onSortByChange={(val) => setSortBy(val)}
          sortOrder={sortOrder}
          onSortOrderChange={(val) => setSortOrder(val)}
          counts={{
            total: stats.totalCustomers,
            hasDues: stats.activeDebtors,
            settled: Math.max(0, stats.totalCustomers - stats.activeDebtors),
          }}
        />
      </div>

      {/* Customer Cards Grid or Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <Skeleton variant="card" height={240} count={6} />
        </div>
      ) : customers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Customers Found"
          description={
            search
              ? `No customer accounts matching "${search}". Try checking the phone number or name.`
              : 'Your customer khata directory is currently empty. Add your first customer.'
          }
          actionLabel="+ Add First Customer"
          onAction={() => setIsFormOpen(true)}
        />
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {customers.map((cust) => (
                <CustomerCard key={cust._id} customer={cust} />
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalCount}
              pageSize={12}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )}
        </div>
      )}

      {/* Add New Customer Modal */}
      <CustomerForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateCustomer}
        isLoading={submitting}
      />
    </div>
  );
}
