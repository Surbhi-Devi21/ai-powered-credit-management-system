import React, { useState, useEffect } from 'react';
import { ArrowDownLeft, Calendar, CreditCard, FileText } from 'lucide-react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

/**
 * Premium SaaS Record Payment (Jama) Modal Component
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
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isLoading}
            className="border-slate-900/[0.08] shadow-subtle font-medium text-xs sm:text-sm"
          >
            Cancel
          </Button>
          <Button
            variant="paymentGradient"
            size="md"
            onClick={handleSubmit}
            isLoading={isLoading}
            icon={ArrowDownLeft}
            className="shadow-subtle hover:shadow-card font-semibold text-xs sm:text-sm"
          >
            Confirm & Record Payment
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4.5" noValidate>
        {/* Quick Settle Full Amount Chip */}
        {currentOutstanding > 0 && (
          <div className="flex items-center justify-between py-2.5 px-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 text-xs">
            <span className="text-emerald-900 font-normal">
              Pending Dues:{' '}
              <strong className="font-bold text-emerald-700 tabular-nums">
                ₹{currentOutstanding.toLocaleString('en-IN')}
              </strong>
            </span>
            <button
              type="button"
              onClick={handleFullSettle}
              className="font-semibold text-emerald-700 hover:text-emerald-800 underline transition-colors cursor-pointer text-xs"
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
          className="text-base sm:text-lg font-bold tabular-nums"
          helperText="Enter payment amount received in cash or online transfer."
        />

        {/* Payment Mode Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 tracking-tight">
            Payment Mode <span className="text-rose-500">*</span>
          </label>
          <div className="relative rounded-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <select
              name="paymentMode"
              value={formData.paymentMode}
              onChange={handleChange}
              className="block w-full bg-white text-slate-900 text-sm border border-slate-200/80 rounded-2xl pl-11 pr-8 h-11 sm:h-12 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 cursor-pointer hover:border-slate-300 transition-colors font-medium"
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
          helperText="Date of receipt or bank settlement."
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
          helperText="Optional reference or transaction note."
        />
      </form>
    </Modal>
  );
}
