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
    <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-[linear-gradient(135deg,#ffffff_0%,#eef4ff_30%,#f8fafc_100%)] p-6 shadow-[0_30px_90px_-38px_rgba(37,99,235,0.35)] sm:p-8">
      <div className="absolute -right-12 -top-10 h-44 w-44 rounded-full bg-[radial-gradient(circle,_rgba(37,99,235,0.16),_transparent_70%)] blur-2xl" />
      <div className="absolute bottom-0 left-1/3 h-36 w-36 rounded-full bg-[radial-gradient(circle,_rgba(168,85,247,0.12),_transparent_65%)] blur-2xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            AI business assistant
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-[-0.06em] text-slate-900 sm:text-3xl">
              Need sharper credit intelligence?
            </h3>
            <p className="max-w-2xl text-sm font-medium text-slate-600 sm:text-base">
              Your store currently has{' '}
              <span className="font-black text-slate-900 tabular-nums">
                {formatCurrency(totalOutstandingDues)}
              </span>{' '}
              pending across{' '}
              <span className="font-black text-slate-900 tabular-nums">
                {activeDebtors} {activeDebtors === 1 ? 'debtor' : 'debtors'}
              </span>.
              Ask natural-language questions to analyze risk, overdue aging, and cash flow velocity.
            </p>
          </div>
        </div>

        <div className="flex-shrink-0">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/ai-insights')}
            icon={ArrowRight}
            iconPosition="right"
            className="rounded-full shadow-[0_18px_30px_-18px_rgba(37,99,235,0.8)]"
          >
            Launch AI assistant
          </Button>
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap items-center gap-5 border-t border-slate-200/80 pt-4 text-[11px] font-medium text-slate-500">
        <div className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          Grounded in your live records
        </div>
        <div className="inline-flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-blue-600" />
          Instant real-time analysis
        </div>
      </div>
    </div>
  );
}
