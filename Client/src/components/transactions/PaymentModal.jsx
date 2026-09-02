import React, { useState, useEffect } from 'react';
import { ArrowDownLeft, Calendar, CreditCard, FileText } from 'lucide-react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

/**
 * Modern 2026 SaaS Record Payment (Jama) Modal Component
 * Records cash or digital payments received and reduces customer debt balance.
 */
export default function PaymentModal({
  isOpen,
  onClose,
  onSubmit,
  customerName = 'Customer',
  currentOutstanding = 0,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    amount: '',
    paymentMode: 'CASH',
    description: '',
    transactionDate: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        amount: '',
        paymentMode: 'CASH',
        description: '',
        transactionDate: new Date().toISOString().split('T')[0],
      });
      setErrors({});
    }
  }, [isOpen]);

  const paymentModes = [
    { value: 'CASH', label: 'Cash Payment' },
    { value: 'UPI', label: 'UPI / PhonePe / GPay' },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { value: 'OTHER', label: 'Other Mode' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFullSettle = () => {
    if (currentOutstanding > 0) {
      setFormData((prev) => ({ ...prev, amount: String(currentOutstanding) }));
      if (errors.amount) setErrors((prev) => ({ ...prev, amount: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) < 1) {
      newErrors.amount = 'Please enter a valid payment amount of at least ₹1.00';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      amount: Number(formData.amount),
      paymentMode: formData.paymentMode,
      description: formData.description.trim(),
      transactionDate: formData.transactionDate ? new Date(formData.transactionDate) : new Date(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Take Payment (Jama) from ${customerName}`}
      description="Record cash or UPI payment received. Customer balance will decrease automatically."
      maxWidth="md"
      footer={
        <>
          <Button variant="secondary" size="md" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="success"
            size="md"
            onClick={handleSubmit}
            isLoading={isLoading}
            icon={ArrowDownLeft}
          >
            Confirm & Record Payment
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Quick Settle Full Amount Chip */}
        {currentOutstanding > 0 && (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs">
            <span className="text-emerald-900 font-medium">
              Pending Dues:{' '}
              <strong className="font-extrabold text-emerald-700 tabular-nums">
                ₹{currentOutstanding.toLocaleString('en-IN')}
              </strong>
            </span>
            <button
              type="button"
              onClick={handleFullSettle}
              className="font-extrabold text-emerald-700 hover:text-emerald-800 underline transition-colors cursor-pointer"
            >
              Fill Full Settlement
            </button>
          </div>
        )}

        {/* Payment Amount */}
        <Input
          label="Payment Amount Received (Jama)"
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          prefix="₹"
          error={errors.amount}
          required
          autoFocus
          inputMode="decimal"
        />

        {/* Payment Mode Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 tracking-tight">
            Payment Mode <span className="text-rose-500">*</span>
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <select
              name="paymentMode"
              value={formData.paymentMode}
              onChange={handleChange}
              className="block w-full bg-white text-slate-900 text-sm border border-slate-200/90 rounded-xl pl-10 pr-8 h-10 focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 cursor-pointer shadow-sm"
            >
              {paymentModes.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Transaction Posting Date */}
        <Input
          label="Payment Date"
          type="date"
          name="transactionDate"
          value={formData.transactionDate}
          onChange={handleChange}
          icon={Calendar}
          required
        />

        {/* Notes / Remarks */}
        <Input
          label="Payment Notes (Optional)"
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="e.g. GPay UPI Ref #489201"
          icon={FileText}
        />
      </form>
    </Modal>
  );
}
