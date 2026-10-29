import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ProtectedLayout from './components/layout/ProtectedLayout';

// Page Views
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import RemindersPage from './pages/RemindersPage';
import SettingsPage from './pages/SettingsPage';
import AiAssistantPage from './pages/AiAssistantPage';

// Placeholder views for upcoming modules with Linear / Mercury empty state styling
const PlaceholderView = ({ title, subtitle, nextModule }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl border border-slate-900/[0.06] shadow-card text-center p-8 sm:p-12 space-y-4.5 max-w-xl mx-auto my-10 select-none">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-900/[0.06] flex items-center justify-center mx-auto text-slate-400">
        <Sparkles className="w-5 h-5 text-slate-500" />
      </div>

      <div className="space-y-1.5">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto font-normal leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div className="pt-1">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-900/[0.06]">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>Scheduled for {nextModule}</span>
        </span>
      </div>

      <div className="pt-3">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 h-10 px-5 text-xs font-semibold rounded-full bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer shadow-subtle hover:shadow-card"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>
      </div>
    </div>
  );
};

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
        <Route path="/reminders" element={<RemindersPage />} />
        <Route path="/ai-insights" element={<AiAssistantPage />} />
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
