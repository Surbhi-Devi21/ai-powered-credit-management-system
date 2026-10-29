import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  Clock,
  Phone,
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

/**
 * Desktop Reminder Statement & Overdue Tracking Table (Linear / Mercury style)
 * Clean tabular figures, priority risk badges, aging status, and one-click WhatsApp action.
 */
export default function ReminderTable({
  reminders = [],
  reminderHistory = {},
  onSendWhatsApp,
}) {
  const navigate = useNavigate();

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(Math.abs(val || 0));

  const formatDate = (date) => {
    if (!date) return '—';
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="w-full overflow-x-auto rounded-3xl bg-white shadow-card border border-slate-900/[0.06] select-none">
      <table className="w-full text-left border-collapse">
        {/* Table Header */}
        <thead>
          <tr className="border-b border-slate-900/[0.06] bg-slate-50/40 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <th className="py-3.5 px-6">Customer</th>
            <th className="py-3.5 px-6 text-right">Outstanding Amount</th>
            <th className="py-3.5 px-6">Due Date</th>
            <th className="py-3.5 px-6">Overdue Aging</th>
            <th className="py-3.5 px-6">Risk Priority</th>
            <th className="py-3.5 px-6">Reminder Status</th>
            <th className="py-3.5 px-6 text-center">Actions</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-slate-900/[0.06] text-xs">
          {reminders.map((item) => {
            const { customer, priority, daysOverdue, dueDate } = item;
            const history = reminderHistory[customer._id];
            const hasSent = Boolean(history);

            return (
              <tr
                key={customer._id}
                className="hover:bg-slate-50/50 transition-colors duration-150 group"
              >
                {/* Customer Identity */}
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => navigate(`/customers/${customer._id}`)}
                      className="font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer text-left block"
                    >
                      {customer.name}
                    </button>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                      <Phone className="w-3 h-3" />
                      <span>{customer.phone}</span>
                    </div>
                  </div>
                </td>

                {/* Outstanding Amount */}
                <td className="py-4 px-6 text-right whitespace-nowrap">
                  <div
                    className={`font-bold tabular-nums text-sm ${
                      customer.currentBalance > 0
                        ? daysOverdue > 0
                          ? 'text-rose-600'
                          : 'text-slate-900'
                        : 'text-emerald-600'
                    }`}
                  >
                    {formatCurrency(customer.currentBalance)}
                  </div>
                  {customer.creditLimit > 0 && (
                    <div className="text-[10px] text-slate-400 font-normal">
                      Limit: {formatCurrency(customer.creditLimit)}
                    </div>
                  )}
                </td>

                {/* Due Date */}
                <td className="py-4 px-6 whitespace-nowrap text-slate-600 font-medium">
                  {formatDate(dueDate)}
                </td>

                {/* Overdue Aging */}
                <td className="py-4 px-6 whitespace-nowrap">
                  {customer.currentBalance <= 0 ? (
                    <span className="text-emerald-600 font-medium">Account Settled</span>
                  ) : daysOverdue > 0 ? (
                    <span className="inline-flex items-center gap-1 text-rose-700 font-semibold bg-rose-50/80 border border-rose-200/50 px-2.5 py-0.5 rounded-full text-[11px]">
                      <span>{daysOverdue} days overdue</span>
                    </span>
                  ) : daysOverdue === 0 ? (
                    <span className="inline-flex items-center gap-1 text-blue-700 font-semibold bg-blue-50/80 border border-blue-200/50 px-2.5 py-0.5 rounded-full text-[11px]">
                      <span>Due Today</span>
                    </span>
                  ) : (
                    <span className="text-slate-500 font-normal">
                      Due in {Math.abs(daysOverdue)} days
                    </span>
                  )}
                </td>

                {/* Risk Priority */}
                <td className="py-4 px-6 whitespace-nowrap">
                  <Badge variant={priority.badgeVariant} size="sm">
                    {priority.label}
                  </Badge>
                </td>

                {/* Reminder Status */}
                <td className="py-4 px-6 whitespace-nowrap">
                  {hasSent ? (
                    <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Sent ({history.formattedTime})</span>
                    </div>
                  ) : customer.currentBalance > 0 ? (
                    <div className="flex items-center gap-1.5 text-slate-400 font-medium text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Reminder Pending</span>
                    </div>
                  ) : (
                    <span className="text-slate-300 font-normal">—</span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-4 px-6 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    {customer.currentBalance > 0 && (
                      <Button
                        variant="whatsapp"
                        size="sm"
                        onClick={() => onSendWhatsApp(item)}
                        icon={MessageCircle}
                        className="shadow-subtle hover:shadow-card font-semibold text-xs py-1"
                        title="Send WhatsApp Payment Reminder"
                      >
                        WhatsApp
                      </Button>
                    )}

                    <button
                      type="button"
                      onClick={() => navigate(`/customers/${customer._id}`)}
                      title="View Customer Khata Statement"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
