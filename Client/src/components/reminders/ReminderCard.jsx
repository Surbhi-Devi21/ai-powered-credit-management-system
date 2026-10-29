import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  Clock,
  Phone,
  Calendar,
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

/**
 * Mobile/Tablet Reminder Card Component (Linear / Mercury style)
 * Clean white surface, rounded-3xl, hairline border, shadow-card elevation.
 */
export default function ReminderCard({
  item,
  reminderHistory = {},
  onSendWhatsApp,
}) {
  const navigate = useNavigate();
  const { customer, priority, daysOverdue, dueDate } = item;
  const history = reminderHistory[customer._id];
  const hasSent = Boolean(history);

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(Math.abs(val || 0));

  const formatDate = (date) => {
    if (!date) return 'No due date';
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-3xl border border-slate-900/[0.06] shadow-card hover:shadow-cardHover transition-all duration-200 p-5 space-y-4 select-none"
    >
      {/* Top Row: Customer Info & Outstanding Amount */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <button
            type="button"
            onClick={() => navigate(`/customers/${customer._id}`)}
            className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer text-left truncate block"
          >
            {customer.name}
          </button>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span>{customer.phone}</span>
          </div>
        </div>

        {/* Balance Display */}
        <div className="text-right flex-shrink-0">
          <div
            className={`text-base font-bold tabular-nums tracking-tight ${
              customer.currentBalance > 0
                ? daysOverdue > 0
                  ? 'text-rose-600'
                  : 'text-slate-900'
                : 'text-emerald-600'
            }`}
          >
            {formatCurrency(customer.currentBalance)}
          </div>
          <div className="text-[10px] text-slate-400 font-normal">
            {customer.currentBalance > 0 ? 'Pending Udhar' : 'Settled Balance'}
          </div>
        </div>
      </div>

      {/* Middle Row: Due Date & Aging & Risk Badges */}
      <div className="flex items-center justify-between gap-2 pt-1 flex-wrap text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Due: {formatDate(dueDate)}</span>
        </div>

        <div className="flex items-center gap-2">
          {daysOverdue > 0 ? (
            <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200/50 px-2 py-0.5 rounded-full">
              {daysOverdue}d overdue
            </span>
          ) : daysOverdue === 0 && customer.currentBalance > 0 ? (
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/50 px-2 py-0.5 rounded-full">
              Due Today
            </span>
          ) : null}

          <Badge variant={priority.badgeVariant} size="sm">
            {priority.label}
          </Badge>
        </div>
      </div>

      {/* Status Bar: Last Reminder Info */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-900/[0.06] text-xs">
        <div className="text-slate-500 font-medium">
          {hasSent ? (
            <span className="flex items-center gap-1.5 text-emerald-600 font-semibold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Reminder Sent ({history.formattedTime})</span>
            </span>
          ) : customer.currentBalance > 0 ? (
            <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Clock className="w-3.5 h-3.5" />
              <span>Reminder Pending</span>
            </span>
          ) : (
            <span className="text-emerald-600 font-medium text-[11px]">No dues pending</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {customer.currentBalance > 0 && (
            <Button
              variant="whatsapp"
              size="sm"
              onClick={() => onSendWhatsApp(item)}
              icon={MessageCircle}
              className="shadow-subtle hover:shadow-card font-semibold text-xs py-1"
            >
              WhatsApp
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/customers/${customer._id}`)}
            icon={ExternalLink}
            className="shadow-subtle hover:shadow-card font-medium text-xs py-1 border-slate-900/[0.08]"
          >
            Khata
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
