import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

/**
 * Premium SaaS AI Business Assistant Spotlight Banner Component
 * Floating card with 28px rounded corners, subtle dark Linear aesthetic, and direct navigation.
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
    <Card
      padding="lg"
      className="bg-slate-900 text-white border-0 shadow-modal space-y-6 relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        {/* Left: AI Intro & Stats */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-amber-400 text-xs font-bold shadow-soft backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Business Assistant &bull; Grounded in Live Khata</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Need actionable intelligence on your store's credit risk?
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Your store currently has{' '}
            <strong className="text-white font-extrabold">{formatCurrency(totalOutstandingDues)}</strong>{' '}
            pending across <strong className="text-white font-extrabold">{activeDebtors} debtors</strong>.
            Ask natural-language questions to analyze top debtor risks, overdue aging, and cash flow velocity.
          </p>
        </div>

        {/* Right: Action Button */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/ai-insights')}
            icon={ArrowRight}
            iconPosition="right"
            className="bg-white text-slate-900 hover:bg-slate-100 font-extrabold border-0 shadow-button"
          >
            Launch AI Assistant
          </Button>
        </div>
      </div>

      {/* Feature Trust Badges */}
      <div className="flex flex-wrap items-center gap-8 pt-5 border-t border-white/10 text-xs text-slate-300 font-medium relative z-10">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Strictly Grounded in Live Database</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Instant Real-Time Aggregation</span>
        </div>
      </div>
    </Card>
  );
}
