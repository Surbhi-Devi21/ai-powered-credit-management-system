import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import Button from '../common/Button';

/**
 * Premium SaaS AI Business Assistant Spotlight Component (Linear / Mercury style)
 * Clean white surface with subtle ambient gradient, hairline border, shadow-card, and typography hierarchy.
 */
export default function AiQuickInsightsBanner({
  todayCollection = 0,
  totalOutstandingDues = 0,
  activeDebtors = 0,
}) {
  const navigate = useNavigate();

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="bg-gradient-to-b from-white to-slate-50/50 rounded-3xl border border-slate-900/[0.06] shadow-card p-6 sm:p-8 space-y-5 sm:space-y-6 select-none">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: AI Intro & Live Stats */}
        <div className="space-y-2.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/80 border border-slate-900/[0.06] text-slate-600 text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Business Assistant &bull; Grounded in Live Khata</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            Need actionable intelligence on your store's credit risk?
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
            Your store currently has{' '}
            <strong className="font-semibold text-slate-900 tabular-nums">
              {formatCurrency(totalOutstandingDues)}
            </strong>{' '}
            pending across{' '}
            <strong className="font-semibold text-slate-900 tabular-nums">
              {activeDebtors} {activeDebtors === 1 ? 'debtor' : 'debtors'}
            </strong>.
            Ask natural-language questions to analyze top debtor risks, overdue aging, and cash flow velocity.
          </p>
        </div>

        {/* Right: Refined Action CTA */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/ai-insights')}
            icon={ArrowRight}
            iconPosition="right"
            className="shadow-subtle hover:shadow-card font-semibold text-xs sm:text-sm"
          >
            Launch AI Assistant
          </Button>
        </div>
      </div>

      {/* Feature Trust Badges */}
      <div className="flex flex-wrap items-center gap-6 pt-4.5 border-t border-slate-900/[0.06] text-xs text-slate-500 font-normal">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Strictly Grounded in Live Database</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-blue-600" />
          <span>Instant Real-Time Aggregation</span>
        </div>
      </div>
    </div>
  );
}
