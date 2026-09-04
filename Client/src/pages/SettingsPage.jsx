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
    <div className="space-y-8 sm:space-y-10 max-w-4xl mx-auto pb-16">
      {/* Header Banner Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8 sm:p-10 rounded-3xl bg-white border border-slate-100/80 shadow-card hover:shadow-cardHover transition-all duration-300"
      >
        <div className="flex items-center gap-5 sm:gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center font-extrabold text-2xl sm:text-3xl shadow-sm border border-slate-700/50">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'O'}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Owner Account
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {user?.businessName || 'My Retail Store'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">{user?.email}</p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="md"
          onClick={logout}
          icon={LogOut}
          className="self-start sm:self-auto text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200/80 rounded-full"
        >
          Sign Out
        </Button>
      </motion.div>

      {/* Profile & Business Details Card */}
      <Card className="p-8 sm:p-10 space-y-8">
        <div className="space-y-1.5 pb-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-accent flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <span>Store & Profile Settings</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium pl-10">
            Manage your retail store name, business category, and contact details.
          </p>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <Input
              label="Owner Full Name"
              type="text"
              name="name"
              value={profileData.name}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, name: e.target.value }))
              }
              icon={User}
              required
            />

            <Input
              label="Business / Store Name"
              type="text"
              name="businessName"
              value={profileData.businessName}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, businessName: e.target.value }))
              }
              icon={Store}
              required
            />

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Business Category
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Building className="w-4 h-4" />
                </div>
                <select
                  value={profileData.businessCategory}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      businessCategory: e.target.value,
                    }))
                  }
                  className="block w-full bg-white text-slate-900 text-sm border border-slate-200/90 rounded-2xl pl-11 pr-8 h-11 sm:h-12 focus:outline-none focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/10 cursor-pointer shadow-sm font-medium transition-all"
                >
                  <option value="kirana">Kirana / Grocery Store</option>
                  <option value="medical">Medical / Pharmacy</option>
                  <option value="electronics">Electronics / Mobile</option>
                  <option value="clothing">Garments / Clothing</option>
                  <option value="restaurant">Canteen / Restaurant</option>
                  <option value="stationery">Stationery & Books</option>
                  <option value="other">Other Retail Business</option>
                </select>
              </div>
            </div>

            <Input
              label="Mobile Phone Number"
              type="tel"
              name="phone"
              value={profileData.phone}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, phone: e.target.value }))
              }
              prefix="+91"
              required
            />
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={profileLoading}
              icon={Save}
              className="rounded-full shadow-sm hover:shadow-md transition-all"
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Security & Password Card */}
      <Card className="p-8 sm:p-10 space-y-8">
        <div className="space-y-1.5 pb-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <span>Account Security & Password</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium pl-10">
            Update your account login password to keep your store finances safe.
          </p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Input
              label="Current Password"
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              placeholder="••••••••"
              icon={Lock}
              required
            />

            <Input
              label="New Password"
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              placeholder="Min. 6 chars"
              icon={Lock}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              placeholder="Repeat password"
              icon={Lock}
              required
            />
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              isLoading={passwordLoading}
              icon={ShieldCheck}
              className="rounded-full shadow-sm hover:shadow-md transition-all"
            >
              Update Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
