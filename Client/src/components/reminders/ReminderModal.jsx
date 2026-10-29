import React, { useState } from 'react';
import { MessageCircle, ExternalLink, Send, Sparkles } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { generateWhatsAppUrl } from '../../utils/reminderUtils';

/**
 * WhatsApp Payment Reminder Preview & Dispatch Modal
 * Reuses common Modal and Button components without any external API dependency.
 */
export default function ReminderModal({
  isOpen,
  onClose,
  reminderItem,
  businessName = 'My Retail Store',
  onConfirmSent,
}) {
  const [tone, setTone] = useState('polite');

  if (!reminderItem) return null;

  const { customer, priority, daysOverdue, dueDate } = reminderItem;

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(Math.abs(customer.currentBalance || 0));

  const formatDate = (date) => {
    if (!date) return 'Flexible terms';
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  const cleanPhone = (customer.phone || '').replace(/[^0-9]/g, '');
  const fullPhone = cleanPhone.length === 10 ? `+91 ${cleanPhone}` : customer.phone;

  // Generated text preview
  const formattedAmount = formatCurrency(customer.currentBalance);
  const formattedDueDate = formatDate(dueDate);

  const getPreviewText = () => {
    if (tone === 'urgent') {
      return `Namaste ${customer.name},\n\nThis is an urgent payment notice from *${businessName}*.\n\nYour pending balance of *${formattedAmount}* is significantly overdue (Due: ${formattedDueDate}). Kindly clear this amount today via UPI or Cash to continue uninterrupted store credit.\n\nThank you!`;
    }
    if (tone === 'formal') {
      return `Dear ${customer.name},\n\nStatement notice from *${businessName}*:\nYour pending balance is *${formattedAmount}* (Due date: ${formattedDueDate}).\n\nPlease arrange for the settlement at your earliest convenience.\n\nBest regards,\n${businessName}`;
    }
    return `Namaste ${customer.name},\n\nThis is a friendly reminder from *${businessName}* that *${formattedAmount}* is pending in your khata account.\n\nPlease make the payment whenever convenient via Cash or UPI.\n\nThank you!`;
  };

  const handleLaunchWhatsApp = () => {
    const url = generateWhatsAppUrl(customer, businessName, tone, dueDate);
    window.open(url, '_blank');
    onConfirmSent(customer._id);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Send WhatsApp Payment Reminder"
      description={`Dispatch a pre-filled, personalized reminder to ${customer.name} via WhatsApp.`}
      maxWidth="md"
      footer={
        <>
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            className="border-slate-900/[0.08] shadow-subtle font-medium text-xs sm:text-sm"
          >
            Cancel
          </Button>

          <Button
            variant="whatsapp"
            size="md"
            onClick={handleLaunchWhatsApp}
            icon={Send}
            className="shadow-subtle hover:shadow-card font-semibold text-xs sm:text-sm"
          >
            Open in WhatsApp
          </Button>
        </>
      }
    >
      <div className="space-y-4.5 select-none">
        {/* Customer Account Summary Header */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-900/[0.06] flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="text-sm font-bold text-slate-900">{customer.name}</div>
            <div className="text-xs text-slate-500 font-medium">{fullPhone}</div>
          </div>

          <div className="text-right">
            <div className="text-base font-extrabold text-rose-600 tabular-nums">
              {formattedAmount}
            </div>
            <div className="text-[11px] text-slate-400 font-normal">
              Due: {formattedDueDate}
            </div>
          </div>
        </div>

        {/* Tone Selector Tabs */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 tracking-tight">
            Reminder Tone
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'polite', label: 'Polite & Friendly' },
              { id: 'formal', label: 'Formal Statement' },
              { id: 'urgent', label: 'Overdue Notice' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTone(t.id)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  tone === t.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-subtle'
                    : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message Preview Box */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 tracking-tight">
              Pre-filled Message Preview
            </label>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Ready for WhatsApp</span>
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-emerald-200/60 text-slate-800 text-xs font-mono leading-relaxed whitespace-pre-wrap shadow-subtle">
            {getPreviewText()}
          </div>
        </div>

        <p className="text-[11px] text-slate-400 font-normal leading-relaxed">
          Clicking "Open in WhatsApp" will launch WhatsApp with this message ready to send. Your customer's status will automatically be updated to "Reminder Sent".
        </p>
      </div>
    </Modal>
  );
}
