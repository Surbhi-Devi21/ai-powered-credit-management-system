import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import FloatingActionButton from './FloatingActionButton';

/**
 * Modern 2026 SaaS Protected Application Layout Shell
 * Integrates Desktop Sidebar, Top Navbar, Mobile Bottom Dock, and Mobile Floating Action Button around page views.
 */
export default function ProtectedLayout({
  user = { businessName: 'Gupta Kirana Store', businessCategory: 'kirana', name: 'Rajesh Gupta' },
  onLogout = () => console.log('Logout clicked'),
  onOpenCreditModal,
  onOpenPaymentModal,
  onOpenSearch,
  pageTitle = 'Dashboard',
  pageSubtitle,
}) {
  return (
    <div className="min-h-screen bg-surface-canvas flex">
      {/* Desktop Persistent Sidebar */}
      <Sidebar
        shopName={user?.businessName || 'My Retail Store'}
        businessCategory={user?.businessCategory || 'Retail'}
        ownerName={user?.name || 'Store Owner'}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        {/* Top Navbar */}
        <Navbar
          title={pageTitle}
          subtitle={pageSubtitle}
          onOpenCreditModal={onOpenCreditModal}
          onOpenPaymentModal={onOpenPaymentModal}
          onOpenSearch={onOpenSearch}
        />

        {/* Dynamic Page Router Outlet */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile-Only Navigation & Quick Actions */}
      <FloatingActionButton
        onOpenCreditModal={onOpenCreditModal}
        onOpenPaymentModal={onOpenPaymentModal}
      />
      <BottomNav />
    </div>
  );
}
