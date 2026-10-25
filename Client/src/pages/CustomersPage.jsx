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
    <div className="space-y-8 sm:space-y-10 max-w-7xl mx-auto pb-16">
      {/* Top Header & Action Panel */}
      <div className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-900/[0.06] shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Customer Khata Accounts
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Manage your retail store debtors, balances, contact profiles, and payment histories.
          </p>
        </div>

        {/* Action Button: Dark Rounded-Full Primary Button */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setIsFormOpen(true)}
            icon={UserPlus}
            className="rounded-full shadow-button"
          >
            + Add New Customer
          </Button>
        </div>
      </div>

      {/* Directory Quick Metric Cards (Typography-First, Mercury/Linear Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-900/[0.06] shadow-card space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Market Dues
            </span>
            <TrendingUp className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-rose-600 tabular-nums tracking-tight">
            {formatCurrency(stats.totalOutstanding)}
          </div>
          <p className="text-xs text-slate-400 font-medium">Pending collection across active accounts</p>
        </div>

        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-900/[0.06] shadow-card space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Customers
            </span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tabular-nums tracking-tight">
            {stats.totalCustomers}
          </div>
          <p className="text-xs text-slate-400 font-medium">Registered in store directory</p>
        </div>

        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-900/[0.06] shadow-card space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Active Debtors
            </span>
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tabular-nums tracking-tight">
            {stats.activeDebtors}
          </div>
          <p className="text-xs text-slate-400 font-medium">Customers currently with pending credit</p>
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
