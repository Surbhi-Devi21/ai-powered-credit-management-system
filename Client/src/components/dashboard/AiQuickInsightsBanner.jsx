import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

/**
 * Modern 2026 SaaS AI Business Assistant Spotlight Banner Component (Linear / Vercel AI style)
 * High-end dark gradient surface with glowing badges and direct navigation to AI Insights.
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
    <Card className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-slate-700/60 shadow-modal space-y-5 rounded-3xl relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
        {/* Left: AI Intro & Stats */}
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-400 text-xs font-extrabold border border-white/10 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Business Assistant &bull; Grounded in Live Khata</span>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
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
            className="bg-white text-slate-900 hover:bg-slate-100 font-extrabold border-0 shadow-modal"
          >
            Launch AI Assistant
          </Button>
        </div>
      </div>

      {/* Feature Trust Badges */}
      <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/10 text-xs text-slate-300 font-medium relative z-10">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Zero Hallucination (Strictly Grounded in DB)</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Instant Real-Time Aggregation</span>
        </div>
      </div>
    </Card>
  );
}
