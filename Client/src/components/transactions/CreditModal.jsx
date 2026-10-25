import React, { useState } from 'react';
import { ArrowUpRight, Calendar, FileText, Tag } from 'lucide-react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

/**
 * Premium SaaS Give Credit (Udhar) Modal Component
 * Records new goods given on credit and updates customer debt balance.
 */
export default function CreditModal({
  isOpen,
  onClose,
  onSubmit,
  customerName = 'Customer',
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    dueDate: '',
    billReference: '',
    transactionDate: new Date().toISOString().split('T')[0],
  });

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

    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) < 1) {
      newErrors.amount = 'Please enter a valid credit amount of at least ₹1.00';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      amount: Number(formData.amount),
      description: formData.description.trim(),
      dueDate: formData.dueDate ? formData.dueDate : null,
      billReference: formData.billReference.trim(),
      transactionDate: formData.transactionDate ? new Date(formData.transactionDate) : new Date(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Give Credit (Udhar) to ${customerName}`}
      description="Record goods or services given on credit. Customer balance will increase automatically."
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
            variant="creditGradient"
            size="md"
            onClick={handleSubmit}
            isLoading={isLoading}
            icon={ArrowUpRight}
            className="shadow-subtle hover:shadow-card font-semibold text-xs sm:text-sm"
          >
            Confirm & Add Credit
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4.5" noValidate>
        {/* Credit Amount - Dominant Typography */}
        <Input
          label="Credit Amount (Udhar)"
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
          helperText="Enter the total credit sale amount in rupees."
        />

        {/* Items / Description */}
        <Input
          label="Items Purchased / Notes (Optional)"
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="e.g. 5kg Basmati Rice, Mustard Oil 2L"
          icon={Tag}
          helperText="Optional reference details for customer statement."
        />

        {/* Date Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Posting Date"
            type="date"
            name="transactionDate"
            value={formData.transactionDate}
            onChange={handleChange}
            icon={Calendar}
            required
            helperText="Transaction entry date."
          />

          <Input
            label="Due Date (Optional)"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            icon={Calendar}
            helperText="Used for overdue tracking."
          />
        </div>

        {/* Bill / Invoice Reference */}
        <Input
          label="Bill / Invoice Number (Optional)"
          type="text"
          name="billReference"
          value={formData.billReference}
          onChange={handleChange}
          placeholder="e.g. BILL-1082"
          icon={FileText}
          helperText="Optional invoice or slip reference number."
        />
      </form>
    </Modal>
  );
}
