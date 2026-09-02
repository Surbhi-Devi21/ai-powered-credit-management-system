import API from './api';

/**
 * Dashboard Analytics API Service Endpoints
 */
export const dashboardService = {
  /**
   * Fetch complete dashboard KPIs, summary statistics, top debtors, and recent transactions
   */
  getSummary: async () => {
    return await API.get('/dashboard/summary');
  },

  /**
   * Fetch daily/weekly cash flow trends for Recharts visual graphs
   * @param {number} days - Number of days to look back (e.g. 7 or 30)
   */
  getTrends: async (days = 7) => {
    return await API.get('/dashboard/trends', { params: { days } });
  },
};
