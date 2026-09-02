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
 * Modern 2026 SaaS Customer Directory Page (Stripe / Mercury / Linear style)
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
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Header & Overview Metric Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-card">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
              Directory Ledger
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Customer Khata Accounts
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Manage your retail store debtors, balances, contact profiles, and payment histories.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <Button
            variant="accent"
            size="md"
            onClick={() => setIsFormOpen(true)}
            icon={UserPlus}
          >
            + Add New Customer
          </Button>
        </div>
      </div>

      {/* Directory Quick Metric Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <Card padding="sm" className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Total Market Dues
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-rose-600 tabular-nums">
              {formatCurrency(stats.totalOutstanding)}
            </div>
            <p className="text-xs text-slate-400 font-medium">Pending collection</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-sm">
            <TrendingUp className="w-5 h-5" />
          </div>
        </Card>

        <Card padding="sm" className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Total Customers
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tabular-nums">
              {stats.totalCustomers}
            </div>
            <p className="text-xs text-slate-400 font-medium">Registered in directory</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-brand-accent flex items-center justify-center border border-blue-100 shadow-sm">
            <Users className="w-5 h-5" />
          </div>
        </Card>

        <Card padding="sm" className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Active Debtors
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tabular-nums">
              {stats.activeDebtors} Customers
            </div>
            <p className="text-xs text-slate-400 font-medium">Currently owe money</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="space-y-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Skeleton variant="card" height={220} count={6} />
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
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
