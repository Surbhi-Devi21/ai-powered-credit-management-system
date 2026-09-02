import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Store, Phone, ArrowRight, ShieldCheck, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

/**
 * Modern 2026 SaaS Shop Registration Page (Linear / Stripe style)
 * Clean onboarding form for shop owners to register their business and currency.
 */
export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, showToast } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    businessName: '',
    businessCategory: 'kirana',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Please enter your full name';
    if (!formData.businessName.trim()) newErrors.businessName = 'Please enter your store name';

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required';
    } else if (formData.phone.trim().length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Please create a password';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        businessName: formData.businessName.trim(),
        businessCategory: formData.businessCategory,
      });
      if (res?.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      showToast(error.message, 'error', 'Registration Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Mesh Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-blue-100/60 to-transparent rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg relative z-10 space-y-6"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-3xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md border border-slate-700/60">
            <Store className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create Store Khata Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Start managing customer credit, recording payments, and sending reminders.
          </p>
        </div>

        {/* Floating Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-7 sm:p-9 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Owner Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ramesh Kumar"
                icon={User}
                error={errors.name}
                required
                autoFocus
              />

              <Input
                label="Store Name"
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Shree Ganesh Kirana"
                icon={Store}
                error={errors.businessName}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="owner@store.com"
                icon={Mail}
                error={errors.email}
                required
              />

              <Input
                label="Mobile Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                prefix="+91"
                error={errors.phone}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 tracking-tight">
                Business Category
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building className="w-4 h-4" />
                </div>
                <select
                  name="businessCategory"
                  value={formData.businessCategory}
                  onChange={handleChange}
                  className="block w-full bg-white text-slate-900 text-sm border border-slate-200/90 rounded-xl pl-10 pr-8 h-10 focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 cursor-pointer shadow-sm font-medium"
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
              label="Account Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              icon={Lock}
              error={errors.password}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full mt-2"
              icon={ArrowRight}
              iconPosition="right"
            >
              Complete Registration & Start
            </Button>
          </form>

          {/* Security Guarantee */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Multi-Tenant Isolated & Secure Cloud Khata</span>
          </div>
        </div>

        {/* Bottom Signin Link */}
        <p className="text-center text-xs text-slate-500 font-medium">
          Already have a store account?{' '}
          <Link
            to="/login"
            className="font-extrabold text-brand-accent hover:text-brand-accentHover underline transition-colors"
          >
            Sign In Instead
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
