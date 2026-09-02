import API from './api';

/**
 * Customer Directory API Service Endpoints
 */
export const customerService = {
  /**
   * Fetch paginated list of customers with search, status filters, and sorting
   */
  getCustomers: async (params = {}) => {
    return await API.get('/customers', { params });
  },

  /**
   * Fetch single customer by ID
   */
  getCustomerById: async (id) => {
    return await API.get(`/customers/${id}`);
  },

  /**
   * Add a new customer
   */
  createCustomer: async (customerData) => {
    return await API.post('/customers', customerData);
  },

  /**
   * Update customer information (Name, Phone, Address, Credit Limit)
   */
  updateCustomer: async (id, customerData) => {
    return await API.put(`/customers/${id}`, customerData);
  },

  /**
   * Archive a customer (Soft delete)
   */
  archiveCustomer: async (id) => {
    return await API.patch(`/customers/${id}/archive`);
  },

  /**
   * Restore an archived customer back to active
   */
  restoreCustomer: async (id) => {
    return await API.patch(`/customers/${id}/restore`);
  },
};
