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
    <div className="min-h-screen bg-[#FAFAFA] px-3 py-3 sm:px-5 sm:py-5 lg:px-6 lg:py-6 selection:bg-blue-500 selection:text-white">
      <div className="mx-auto flex max-w-[1600px] items-start gap-4 sm:gap-6 lg:gap-7">
        <Sidebar
          shopName={user?.businessName || 'My Retail Store'}
          businessCategory={user?.businessCategory || 'Retail'}
          ownerName={user?.name || 'Store Owner'}
          onLogout={onLogout}
        />

        <div className="flex-1 min-w-0 pb-24 lg:pb-8">
          <div className="space-y-5 sm:space-y-6">
            <Navbar
              title={pageTitle}
              subtitle={pageSubtitle}
              onOpenCreditModal={onOpenCreditModal}
              onOpenPaymentModal={onOpenPaymentModal}
              onOpenSearch={onOpenSearch}
              user={user}
            />

            <main className="w-full max-w-[1500px] mx-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </div>

      <FloatingActionButton
        onOpenCreditModal={onOpenCreditModal}
        onOpenPaymentModal={onOpenPaymentModal}
      />
      <BottomNav />
    </div>
  );
}
