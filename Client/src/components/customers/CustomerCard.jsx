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
      <div
        onClick={() => navigate(`/customers/${customer._id}`)}
        className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-900/[0.06] shadow-card hover:shadow-cardHover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full space-y-6 relative group cursor-pointer"
      >
        <div className="space-y-4">
          {/* Top Row: Avatar + Name + Status Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-700 font-extrabold text-sm flex items-center justify-center flex-shrink-0 border border-slate-900/[0.04]">
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

          {/* Address Line (Clean, No Box) */}
          {customer.address && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium truncate pt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{customer.address}</span>
            </div>
          )}

          {/* Balance Display (Direct on Surface, No Nested Grey Box) */}
          <div className="space-y-1 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {isDebtor ? 'Outstanding Due' : isSettled ? 'Account Settled' : 'Advance Credit'}
            </span>
            <div
              className={`text-3xl font-extrabold tabular-nums tracking-tight ${
                isArchived
                  ? 'text-slate-400'
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
        <div className="pt-4 border-t border-slate-900/[0.06] flex items-center justify-between gap-3">
          {isDebtor ? (
            <button
              type="button"
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/50 shadow-subtle transition-all cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </button>
          ) : (
            <div />
          )}

          <div className="ml-auto flex items-center gap-1 text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-colors">
            <span>View Statement</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
