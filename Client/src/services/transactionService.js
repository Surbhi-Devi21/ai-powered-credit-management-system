import API from './api';

/**
 * Transaction & Ledger API Service Endpoints
 */
export const transactionService = {
  /**
   * Record a new credit entry (Udhar given)
   */
  recordCredit: async (creditData) => {
    return await API.post('/transactions/credit', creditData);
  },

  /**
   * Record a new payment settlement entry (Jama received)
   */
  recordPayment: async (paymentData) => {
    return await API.post('/transactions/payment', paymentData);
  },

  /**
   * Get paginated customer ledger statement with filters
   */
  getCustomerLedger: async (customerId, params = {}) => {
    return await API.get(`/transactions/customer/${customerId}`, { params });
  },

  /**
   * Get store-wide recent transaction stream (for Dashboard)
   */
  getRecentTransactions: async (params = {}) => {
    return await API.get('/transactions/recent', { params });
  },

  /**
   * Delete / Reverse a transaction
   */
  deleteTransaction: async (id) => {
    return await API.delete(`/transactions/${id}`);
  },
};
