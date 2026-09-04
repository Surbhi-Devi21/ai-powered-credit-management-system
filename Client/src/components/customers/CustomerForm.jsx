import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, CreditCard, DollarSign } from 'lucide-react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

/**
 * Premium SaaS Add/Edit Customer Modal Form Component
 * Form validation, auto-focus, Indian phone formatting, and opening balance support.
 */
export default function CustomerForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    creditLimit: '',
    openingBalance: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        creditLimit: initialData.creditLimit ? String(initialData.creditLimit) : '',
        openingBalance: '',
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        address: '',
        creditLimit: '',
        openingBalance: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter customer name';
    }

    const cleanPhone = formData.phone.trim();
    if (!cleanPhone) {
      newErrors.phone = 'Phone number is required';
    } else if (cleanPhone.length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    }

    if (formData.creditLimit && (isNaN(formData.creditLimit) || Number(formData.creditLimit) < 0)) {
      newErrors.creditLimit = 'Please enter a valid credit limit amount';
    }

    if (formData.openingBalance && (isNaN(formData.openingBalance) || Number(formData.openingBalance) < 0)) {
      newErrors.openingBalance = 'Please enter a valid opening balance amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      creditLimit: formData.creditLimit ? Number(formData.creditLimit) : 0,
      openingBalance: formData.openingBalance ? Number(formData.openingBalance) : 0,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Customer Profile' : 'Add New Customer to Khata'}
      description={
        initialData
          ? 'Update contact details or credit limit for this customer.'
          : 'Create a new customer account to start tracking credit and payment entries.'
      }
      maxWidth="md"
      footer={
        <>
          <Button variant="secondary" size="md" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSubmit} isLoading={isLoading}>
            {initialData ? 'Save Changes' : 'Add Customer'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Customer Full Name */}
        <Input
          label="Customer Full Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Ramesh Kumar"
          icon={User}
          error={errors.name}
          required
          autoFocus
        />

        {/* Mobile Number */}
        <Input
          label="Mobile Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="e.g. 9876543210"
          prefix="+91"
          error={errors.phone}
          required
          helperText="Used for automated WhatsApp payment reminders."
        />

        {/* Address / Landmark */}
        <Input
          label="Address / Area Landmark (Optional)"
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="e.g. Near Shiv Mandir, Sector 4"
          icon={MapPin}
        />

        {/* Credit Limit & Opening Balance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Credit Limit (Optional)"
            type="number"
            name="creditLimit"
            value={formData.creditLimit}
            onChange={handleChange}
            placeholder="0.00"
            prefix="₹"
            error={errors.creditLimit}
            helperText="Maximum allowed debt."
          />

          {!initialData && (
            <Input
              label="Opening Debt (Optional)"
              type="number"
              name="openingBalance"
              value={formData.openingBalance}
              onChange={handleChange}
              placeholder="0.00"
              prefix="₹"
              error={errors.openingBalance}
              helperText="Previous paper khata debt."
            />
          )}
        </div>
      </form>
    </Modal>
  );
}
