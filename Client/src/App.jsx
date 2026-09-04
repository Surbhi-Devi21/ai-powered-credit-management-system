import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ProtectedLayout from './components/layout/ProtectedLayout';

// Page Views
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import SettingsPage from './pages/SettingsPage';

// Placeholder views for upcoming modules with 2026 SaaS styling
const PlaceholderView = ({ title, subtitle, nextModule }) => (
  <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-100/80 shadow-card text-center space-y-4 max-w-2xl mx-auto my-10">
    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-brand-accent flex items-center justify-center mx-auto border border-blue-100/60 shadow-sm">
      <span className="text-2xl">✨</span>
    </div>
    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
    <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto font-medium leading-relaxed">
      {subtitle}
    </p>
    <div className="pt-2">
      <span className="inline-block px-4 py-1.5 text-xs font-bold rounded-full bg-blue-50 text-brand-accent border border-blue-200/80 shadow-sm">
        ● Scheduled for {nextModule}
      </span>
    </div>
  </div>
);

/**
 * Root Navigation Tree with Auth Provider and Protected Route Guards
 */
function AppContent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Routes>
      {/* ==================================================================== */}
      {/* Public Authentication Routes                                         */}
      {/* ==================================================================== */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ==================================================================== */}
      {/* Protected Shop Owner Application Routes (Wrapped in ProtectedLayout) */}
      {/* ==================================================================== */}
      <Route
        element={
          <ProtectedRoute>
            <ProtectedLayout
              user={user}
              onLogout={() => {
                logout();
                navigate('/login');
              }}
              onOpenCreditModal={() => navigate('/customers')}
              onOpenPaymentModal={() => navigate('/customers')}
              onOpenSearch={() => navigate('/customers')}
              pageTitle="Khata & Credit Hub"
              pageSubtitle="Real-Time Retail Customer Ledger"
            />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        <Route
          path="/reminders"
          element={
            <PlaceholderView
              title="WhatsApp Payment Reminders & Overdue Tracker"
              subtitle="Generate pre-filled, polite WhatsApp reminders for overdue accounts with single-click delivery."
              nextModule="Module 7: Reminders Module"
            />
          }
        />
        <Route
          path="/ai-insights"
          element={
            <PlaceholderView
              title="AI Business Assistant (OpenRouter Grounded)"
              subtitle="Ask natural language questions about your live store collections, top debtor risks, and sales velocity."
              nextModule="Module 8: AI Business Insights"
            />
          }
        />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* ==================================================================== */}
      {/* Fallback & Root Redirects                                            */}
      {/* ==================================================================== */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
