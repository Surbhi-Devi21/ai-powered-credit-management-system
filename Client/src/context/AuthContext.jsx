import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import Toast from '../components/common/Toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Global Toast Notification State
  const [toast, setToast] = useState({
    isOpen: false,
    message: '',
    type: 'success',
    title: '',
  });

  const showToast = (message, type = 'success', title = '') => {
    setToast({
      isOpen: true,
      message,
      type,
      title: title || (type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Notification'),
    });

    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
      setToast((prev) => ({ ...prev, isOpen: false }));
    }, 3500);
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, isOpen: false }));
  };

  // ============================================================================
  // Initial Session Hydration on Application Boot
  // ============================================================================
  useEffect(() => {
    const hydrateSession = async () => {
      const storedToken = localStorage.getItem('khata_token');
      const storedUser = localStorage.getItem('khata_user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Verify with backend in background
          const response = await authService.getProfile();
          if (response?.data?.user) {
            setUser(response.data.user);
            localStorage.setItem('khata_user', JSON.stringify(response.data.user));
          }
        } catch (error) {
          console.warn('[Auth] Session expired or invalid. Clearing credentials.');
          localStorage.removeItem('khata_token');
          localStorage.removeItem('khata_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    hydrateSession();
  }, []);

  // ============================================================================
  // Login Handler
  // ============================================================================
  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      const { user: loggedInUser, token: authToken } = response.data;

      setUser(loggedInUser);
      setToken(authToken);
      localStorage.setItem('khata_token', authToken);
      localStorage.setItem('khata_user', JSON.stringify(loggedInUser));

      showToast(`Welcome back, ${loggedInUser.name}!`, 'success', 'Login Successful');
      return { success: true };
    } catch (error) {
      showToast(error.message, 'error', 'Login Failed');
      return { success: false, error: error.message };
    }
  };

  // ============================================================================
  // Registration Handler
  // ============================================================================
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { user: registeredUser, token: authToken } = response.data;

      setUser(registeredUser);
      setToken(authToken);
      localStorage.setItem('khata_token', authToken);
      localStorage.setItem('khata_user', JSON.stringify(registeredUser));

      showToast(`Welcome to KhataAI, ${registeredUser.businessName}!`, 'success', 'Account Created');
      return { success: true };
    } catch (error) {
      showToast(error.message, 'error', 'Registration Failed');
      return { success: false, error: error.message };
    }
  };

  // ============================================================================
  // Logout Handler
  // ============================================================================
  const logout = () => {
    localStorage.removeItem('khata_token');
    localStorage.removeItem('khata_user');
    setUser(null);
    setToken(null);
    showToast('You have been logged out safely.', 'info', 'Logged Out');
  };

  // ============================================================================
  // Update Profile Handler
  // ============================================================================
  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      const updatedUser = response.data.user;

      setUser(updatedUser);
      localStorage.setItem('khata_user', JSON.stringify(updatedUser));
      showToast('Shop profile updated successfully.', 'success', 'Profile Updated');
      return { success: true };
    } catch (error) {
      showToast(error.message, 'error', 'Update Failed');
      return { success: false, error: error.message };
    }
  };

  // ============================================================================
  // Change Password Handler
  // ============================================================================
  const changePassword = async (passwordData) => {
    try {
      await authService.changePassword(passwordData);
      showToast('Password changed successfully.', 'success', 'Security Updated');
      return { success: true };
    } catch (error) {
      showToast(error.message, 'error', 'Password Change Failed');
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    showToast,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {/* Global Application Toast Portal */}
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        title={toast.title}
        onClose={closeToast}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
