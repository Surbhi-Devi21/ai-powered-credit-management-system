import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { customerService } from '../services/customerService';
import { transactionService } from '../services/transactionService';
import { useAuth } from '../context/AuthContext';

// Components
import BalanceHeader from '../components/transactions/BalanceHeader';
import LedgerSummary from '../components/transactions/LedgerSummary';
import TransactionFilters from '../components/transactions/TransactionFilters';
import LedgerTable from '../components/transactions/LedgerTable';
import TransactionCard from '../components/transactions/TransactionCard';
import EmptyLedger from '../components/transactions/EmptyLedger';
import CreditModal from '../components/transactions/CreditModal';
import PaymentModal from '../components/transactions/PaymentModal';
import Pagination from '../components/common/Pagination';
import Skeleton from '../components/common/Skeleton';

/**
 * Premium SaaS Customer Ledger & Statement Detail Page (Stripe / Mercury style)
 * Large floating balance panels (28px radius), interactive financial filters, clean tables, and instant modal forms.
 */
export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAuth();

  // Customer & Transactions State
  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters State
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modals State
  const [isCreditOpen, setIsCreditOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch Customer & Ledger Data
  const fetchLedger = useCallback(async () => {
    setLoading(true);
    try {
      const response = await transactionService.getCustomerLedger(id, {
        type: typeFilter,
        search,
        startDate,
        endDate,
        page,
        limit: 15,
      });

      if (response?.success) {
        setCustomer(response.customer);
        setTransactions(response.data.transactions || []);
        setTotalCount(response.total || 0);
        setTotalPages(response.totalPages || 1);
      }
    } catch (error) {
      showToast(error.message, 'error', 'Failed to load customer ledger');
      navigate('/customers');
    } finally {
      setLoading(false);
    }
  }, [id, typeFilter, search, startDate, endDate, page, showToast, navigate]);

  useEffect(() => {
    fetchLedger();
  }, [fetchLedger]);

  // Handle Credit Submit
  const handleCreditSubmit = async (creditData) => {
    setSubmitting(true);
    try {
      await transactionService.recordCredit({
        customerId: id,
        ...creditData,
      });
      showToast('Credit entry recorded successfully.', 'success');
      setIsCreditOpen(false);
      fetchLedger();
    } catch (error) {
      showToast(error.message, 'error', 'Failed to record credit');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Payment Submit
  const handlePaymentSubmit = async (paymentData) => {
    setSubmitting(true);
    try {
      await transactionService.recordPayment({
        customerId: id,
        ...paymentData,
      });
      showToast('Payment settlement recorded successfully.', 'success');
      setIsPaymentOpen(false);
      fetchLedger();
    } catch (error) {
      showToast(error.message, 'error', 'Failed to record payment');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete / Reverse Transaction
  const handleDeleteTransaction = async (tx) => {
    const isCredit = tx.type === 'CREDIT';
    const amountStr = `₹${tx.amount.toLocaleString('en-IN')}`;

    if (
      window.confirm(
        `Are you sure you want to reverse this ${isCredit ? 'Credit' : 'Payment'} entry of ${amountStr}? The customer balance will be recalibrated.`
      )
    ) {
      try {
        await transactionService.deleteTransaction(tx._id);
        showToast('Transaction reversed and balance recalibrated.', 'info');
        fetchLedger();
      } catch (error) {
        showToast(error.message, 'error', 'Reversal Failed');
      }
    }
  };

  // Clear Filters Handler
  const handleClearFilters = () => {
    setTypeFilter('ALL');
    setSearch('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  if (loading && !customer) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <Skeleton variant="card" height={160} />
        <Skeleton variant="card" height={80} />
        <Skeleton variant="card" height={340} />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-7 max-w-6xl mx-auto pb-16">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/customers')}
          className="group inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors py-1 cursor-pointer select-none"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 group-hover:-translate-x-0.5 transition-all" />
          <span>Back to Customer Directory</span>
        </button>
      </div>

      {/* Customer Hero Balance Header */}
      <BalanceHeader
        customer={customer}
        onOpenCredit={() => setIsCreditOpen(true)}
        onOpenPayment={() => setIsPaymentOpen(true)}
      />

      {/* Financial Summary Metric Cards */}
      <LedgerSummary
        customer={customer}
        transactionCount={totalCount}
      />

      {/* Filters & Search Toolbar */}
      <TransactionFilters
        activeType={typeFilter}
        onTypeChange={(type) => {
          setTypeFilter(type);
          setPage(1);
        }}
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        startDate={startDate}
        onStartDateChange={(val) => {
          setStartDate(val);
          setPage(1);
        }}
        endDate={endDate}
        onEndDateChange={(val) => {
          setEndDate(val);
          setPage(1);
        }}
        onClearFilters={handleClearFilters}
      />

      {/* Transaction Statement View */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton variant="tableRow" count={5} />
        </div>
      ) : transactions.length === 0 ? (
        <EmptyLedger
          onOpenCredit={() => setIsCreditOpen(true)}
          onOpenPayment={() => setIsPaymentOpen(true)}
        />
      ) : (
        <div className="space-y-6">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <LedgerTable
              transactions={transactions}
              onDelete={handleDeleteTransaction}
            />
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-4">
            <AnimatePresence mode="popLayout">
              {transactions.map((tx) => (
                <TransactionCard
                  key={tx._id}
                  transaction={tx}
                  onDelete={handleDeleteTransaction}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Statement Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalCount}
              pageSize={15}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )}
        </div>
      )}

      {/* Give Credit (Udhar) Modal */}
      <CreditModal
        isOpen={isCreditOpen}
        onClose={() => setIsCreditOpen(false)}
        onSubmit={handleCreditSubmit}
        customerName={customer?.name}
        isLoading={submitting}
      />

      {/* Take Payment (Jama) Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSubmit={handlePaymentSubmit}
        customerName={customer?.name}
        currentOutstanding={customer?.currentBalance > 0 ? customer.currentBalance : 0}
        isLoading={submitting}
      />
    </div>
  );
}
