import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Store,
  Mail,
  Phone,
  Lock,
  DollarSign,
  ShieldCheck,
  Save,
  LogOut,
  Building,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

/**
 * Modern 2026 SaaS Settings & Store Profile Page (Stripe / Notion / Mercury style)
 * Large white cards (rounded-3xl), profile avatar container, clean section headers, and security controls.
 */
export default function SettingsPage() {
  const { user, updateProfile, changePassword, logout, showToast } = useAuth();

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    businessName: user?.businessName || '',
    businessCategory: user?.businessCategory || 'kirana',
    email: user?.email || '',
    phone: user?.phone || '',
    currency: user?.currency || 'INR',
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Security Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await updateProfile({
        name: profileData.name.trim(),
        businessName: profileData.businessName.trim(),
        businessCategory: profileData.businessCategory,
        phone: profileData.phone.trim(),
        currency: profileData.currency,
      });
      showToast('Store profile information updated successfully.', 'success');
    } catch (error) {
      showToast(error.message, 'error', 'Profile Update Failed');
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle Password Update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return showToast('New passwords do not match.', 'error');
    }
    if (passwordData.newPassword.length < 6) {
      return showToast('New password must be at least 6 characters.', 'error');
    }

    setPasswordLoading(true);
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      showToast('Account security password changed successfully.', 'success');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      showToast(error.message, 'error', 'Password Change Failed');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-16 sm:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_40%,#eef2ff_100%)] p-6 shadow-[0_30px_80px_-38px_rgba(15,23,42,0.28)] sm:p-8"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,#0f172a,#1e293b,#2563eb)] text-2xl font-black text-white shadow-[0_20px_30px_-20px_rgba(15,23,42,0.9)]">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'O'}
            </div>

            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.18em] text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Owner account
              </div>
              <h2 className="text-2xl font-black tracking-[-0.06em] text-slate-900 sm:text-3xl">
                {user?.businessName || 'My Retail Store'}
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">{user?.email}</p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={logout}
            icon={LogOut}
            className="rounded-full border border-slate-200 bg-white text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          >
            Sign out
          </Button>
        </div>
      </motion.div>

      <Card className="space-y-7 p-6 sm:p-8">
        <div className="flex items-center gap-3 border-b border-slate-200/80 pb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Store className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-[-0.05em] text-slate-900">Store & profile settings</h3>
            <p className="text-xs font-medium text-slate-500">Manage the shop identity and contact details.</p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              label="Owner full name"
              type="text"
              name="name"
              value={profileData.name}
              onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
              icon={User}
              required
            />

            <Input
              label="Business / store name"
              type="text"
              name="businessName"
              value={profileData.businessName}
              onChange={(e) => setProfileData((prev) => ({ ...prev, businessName: e.target.value }))}
              icon={Store}
              required
            />

            <div className="space-y-2">
              <label className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                Business category
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <Building className="h-4 w-4" />
                </div>
                <select
                  value={profileData.businessCategory}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, businessCategory: e.target.value }))}
                  className="block h-12 w-full rounded-[18px] border border-slate-200 bg-slate-50 pl-11 pr-10 text-sm font-medium text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  <option value="kirana">Kirana / grocery store</option>
                  <option value="medical">Medical / pharmacy</option>
                  <option value="electronics">Electronics / mobile</option>
                  <option value="clothing">Garments / clothing</option>
                  <option value="restaurant">Canteen / restaurant</option>
                  <option value="stationery">Stationery & books</option>
                  <option value="other">Other retail business</option>
                </select>
              </div>
            </div>

            <Input
              label="Mobile phone number"
              type="tel"
              name="phone"
              value={profileData.phone}
              onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
              prefix="+91"
              required
            />
          </div>

          <div className="flex justify-end border-t border-slate-200/80 pt-5">
            <Button type="submit" variant="primary" size="lg" isLoading={profileLoading} icon={Save} className="rounded-full">
              Save profile changes
            </Button>
          </div>
        </form>
      </Card>

      <Card className="space-y-7 p-6 sm:p-8">
        <div className="flex items-center gap-3 border-b border-slate-200/80 pb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <Lock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-[-0.05em] text-slate-900">Account security</h3>
            <p className="text-xs font-medium text-slate-500">Keep your store data secure with a stronger password.</p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Input
              label="Current password"
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
              placeholder="••••••••"
              icon={Lock}
              required
            />

            <Input
              label="New password"
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
              placeholder="Min. 6 chars"
              icon={Lock}
              required
            />

            <Input
              label="Confirm password"
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Repeat password"
              icon={Lock}
              required
            />
          </div>

          <div className="flex justify-end border-t border-slate-200/80 pt-5">
            <Button type="submit" variant="secondary" size="lg" isLoading={passwordLoading} icon={ShieldCheck} className="rounded-full">
              Update password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
