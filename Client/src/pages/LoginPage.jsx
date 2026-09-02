import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Store, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

/**
 * Modern 2026 SaaS Sign In Page (Linear / Stripe / Clerk style)
 * Centered floating card (rounded-3xl), background mesh glow, and validation.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { login, showToast } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Please enter your password';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await login(formData.email.trim(), formData.password);
      if (res?.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      showToast(error.message, 'error', 'Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Mesh Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-blue-100/60 to-transparent rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md relative z-10 space-y-6"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-3xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md border border-slate-700/60">
            <Store className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign in to Khata
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Enter your credentials to access your store financial ledger.
          </p>
        </div>

        {/* Floating Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-7 sm:p-9 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="owner@myretailstore.com"
              icon={Mail}
              error={errors.email}
              required
              autoFocus
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
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
              Sign In to Store
            </Button>
          </form>

          {/* Security Guarantee */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>256-Bit Encrypted Multi-Tenant Storage</span>
          </div>
        </div>

        {/* Bottom Signup Link */}
        <p className="text-center text-xs text-slate-500 font-medium">
          Don't have a shop account yet?{' '}
          <Link
            to="/register"
            className="font-extrabold text-brand-accent hover:text-brand-accentHover underline transition-colors"
          >
            Create New Store Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
