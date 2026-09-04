import React from 'react';
import {
  Phone,
  MapPin,
  MessageCircle,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

/**
 * Premium SaaS Customer Balance & Action Hero Header Component
 * Large white card (rounded-3xl / 28px radius), prominent debt figures, and rounded action buttons.
 */
export default function BalanceHeader({
  customer,
  onOpenCredit,
  onOpenPayment,
}) {
  if (!customer) return null;

  const isDebtor = customer.currentBalance > 0;
  const isSettled = customer.currentBalance === 0;
  const isAdvance = customer.currentBalance < 0;
  const isArchived = customer.status === 'archived';

  const formattedBalance = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(Math.abs(customer.currentBalance));

  const handleWhatsApp = () => {
    const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const message = encodeURIComponent(
      `Namaste ${customer.name}, this is a gentle reminder that your pending balance is ${formattedBalance}. Kindly settle via Cash or UPI at your earliest convenience. Thank you!`
    );
    window.open(`https://wa.me/${fullPhone}?text=${message}`, '_blank');
  };

  return (
    <Card padding="lg" className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Customer Identity */}
        <div className="flex items-start gap-4 sm:gap-5">
          <div
            className={`w-16 h-16 rounded-3xl flex items-center justify-center font-extrabold text-2xl flex-shrink-0 shadow-soft ${
              isArchived
                ? 'bg-slate-100 text-slate-500'
                : isDebtor
                ? 'bg-rose-50 text-rose-600'
                : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            {customer.name.charAt(0).toUpperCase()}
          </div>

          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {customer.name}
              </h2>
              {isArchived ? (
                <Badge variant="archived">Archived Account</Badge>
              ) : isDebtor ? (
                <Badge variant="overdue">Pending Balance</Badge>
              ) : (
                <Badge variant="settled">Settled (₹0)</Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 font-medium flex-wrap">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-slate-800">{customer.phone}</span>
              </div>
              {customer.address && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{customer.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center: Live Running Balance */}
        <div className="flex flex-col items-start lg:items-end p-5 rounded-3xl bg-slate-50 border border-slate-100/60 shadow-soft">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            {isDebtor ? 'Total Outstanding Udhar' : isSettled ? 'Account Settled' : 'Advance Credit'}
          </span>
          <div
            className={`text-2xl sm:text-3xl font-extrabold tabular-nums tracking-tight mt-0.5 ${
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
          <span className="text-xs text-slate-400 font-medium mt-0.5">
            {isDebtor
              ? 'Customer owes this amount'
              : isSettled
              ? 'Zero pending dues'
              : 'Advance credit deposited'}
          </span>
        </div>

        {/* Right: Quick Action Buttons */}
        {!isArchived && (
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="creditGradient"
              size="md"
              onClick={onOpenCredit}
              icon={ArrowUpRight}
              className="shadow-button"
            >
              + Give Credit (Udhar)
            </Button>

            <Button
              variant="paymentGradient"
              size="md"
              onClick={onOpenPayment}
              icon={ArrowDownLeft}
              className="shadow-button"
            >
              + Take Payment (Jama)
            </Button>

            {isDebtor && (
              <Button
                variant="whatsapp"
                size="md"
                onClick={handleWhatsApp}
                icon={MessageCircle}
                className="hidden sm:inline-flex shadow-button"
              >
                WhatsApp
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
