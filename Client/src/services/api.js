import axios from 'axios';

/**
 * Centralized Axios HTTP Client
 * Automatically attaches JWT Bearer token from localStorage to all outgoing requests.
 * Handles global 401 Unauthorized responses with clean session clearing.
 */
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ============================================================================
// Request Interceptor: Attach JWT Token
// ============================================================================
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('khata_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================================
// Response Interceptor: Handle Global Errors & Token Expiration
// ============================================================================
API.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // If the token is invalid or expired (401), clean local state
    if (error.response && error.response.status === 401) {
      const isAuthRoute =
        error.config.url.includes('/auth/login') ||
        error.config.url.includes('/auth/register');

      if (!isAuthRoute) {
        localStorage.removeItem('khata_token');
        localStorage.removeItem('khata_user');
        // If not already on login page, redirect
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred.';

    return Promise.reject(new Error(message));
  }
);

export default API;
