import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import FloatingActionButton from './FloatingActionButton';

/**
 * Version 3: Premium SaaS Protected Application Layout Shell
 * Integrates floating desktop sidebar, floating top navbar, and spacious 12-column canvas.
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
    <div className="min-h-screen bg-canvas p-4 sm:p-6 lg:p-8 flex items-start gap-6 sm:gap-8 selection:bg-blue-500 selection:text-white">
      {/* Desktop Floating Sidebar */}
      <Sidebar
        shopName={user?.businessName || 'My Retail Store'}
        businessCategory={user?.businessCategory || 'Retail'}
        ownerName={user?.name || 'Store Owner'}
        onLogout={onLogout}
      />

      {/* Main Floating Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 space-y-6 sm:space-y-8 pb-24 lg:pb-10">
        {/* Floating Navbar */}
        <Navbar
          title={pageTitle}
          subtitle={pageSubtitle}
          onOpenCreditModal={onOpenCreditModal}
          onOpenPaymentModal={onOpenPaymentModal}
          onOpenSearch={onOpenSearch}
          user={user}
        />

        {/* Dynamic Page Router Outlet with 12-Column Responsive Flow */}
        <main className="flex-1 w-full max-w-7xl mx-auto">
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
