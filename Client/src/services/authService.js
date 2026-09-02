import API from './api';

/**
 * Authentication & Profile API Service Endpoints
 */
export const authService = {
  /**
   * Register a new shop owner
   */
  register: async (userData) => {
    return await API.post('/auth/register', userData);
  },

  /**
   * Log in an existing shop owner
   */
  login: async (credentials) => {
    return await API.post('/auth/login', credentials);
  },

  /**
   * Fetch currently authenticated shop owner profile
   */
  getProfile: async () => {
    return await API.get('/auth/me');
  },

  /**
   * Update shop owner profile details
   */
  updateProfile: async (profileData) => {
    return await API.put('/auth/profile', profileData);
  },

  /**
   * Change shop owner password
   */
  changePassword: async (passwordData) => {
    return await API.put('/auth/change-password', passwordData);
  },
};
