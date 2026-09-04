import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Phone,
  MapPin,
  MessageCircle,
  ChevronRight,
} from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

/**
 * Premium SaaS Customer Directory Card Component (Mercury / Ramp style)
 * Large white card (rounded-3xl / 28px radius), avatar initial container, prominent debt figures, and quick WhatsApp trigger.
 */
export default function CustomerCard({
  customer,
  onOpenCreditModal,
  onOpenPaymentModal,
}) {
  const navigate = useNavigate();

  const isDebtor = customer.currentBalance > 0;
  const isSettled = customer.currentBalance === 0;
  const isAdvance = customer.currentBalance < 0;
  const isArchived = customer.status === 'archived';

  const formattedBalance = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(Math.abs(customer.currentBalance));

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const message = encodeURIComponent(
      `Namaste ${customer.name}, this is a gentle reminder that your pending balance is ${formattedBalance}. Kindly settle via Cash or UPI at your earliest convenience. Thank you!`
    );
    window.open(`https://wa.me/${fullPhone}?text=${message}`, '_blank');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        hoverable
        onClick={() => navigate(`/customers/${customer._id}`)}
        padding="md"
        className="flex flex-col justify-between h-full space-y-6 relative group"
      >
        <div className="space-y-5">
          {/* Top Row: Avatar + Name + Status Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-base flex-shrink-0 shadow-soft ${
                  isArchived
                    ? 'bg-slate-100 text-slate-500'
                    : isDebtor
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-emerald-50 text-emerald-600'
                }`}
              >
                {customer.name.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <h3 className="text-base font-extrabold text-slate-900 truncate group-hover:text-blue-600 transition-colors tracking-tight">
                  {customer.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-0.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{customer.phone}</span>
                </div>
              </div>
            </div>

            {/* Status Pill Badge */}
            {isArchived ? (
              <Badge variant="archived" size="sm">Archived</Badge>
            ) : isDebtor ? (
              <Badge variant="overdue" size="sm">Pending Due</Badge>
            ) : (
              <Badge variant="settled" size="sm">Settled</Badge>
            )}
          </div>

          {/* Address Hint */}
          {customer.address && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100/60 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{customer.address}</span>
            </div>
          )}

          {/* Balance Hero Box */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100/60 space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              {isDebtor ? 'Total Outstanding Debt' : isSettled ? 'Account Cleared' : 'Advance Credit'}
            </span>
            <div
              className={`text-2xl sm:text-[26px] font-extrabold tabular-nums tracking-tight ${
                isArchived
                  ? 'text-slate-500'
                  : isDebtor
                  ? 'text-rose-600'
                  : isAdvance
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }`}
            >
              {customer.currentBalance < 0 ? `- ${formattedBalance}` : formattedBalance}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          {isDebtor && (
            <Button
              variant="whatsapp"
              size="sm"
              onClick={handleWhatsApp}
              icon={MessageCircle}
              className="text-xs"
            >
              WhatsApp
            </Button>
          )}

          <div className="ml-auto flex items-center gap-1 text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
            <span>View Statement</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
