import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import Card from '../common/Card';

/**
 * Custom 2026 SaaS Chart Tooltip Component (Linear / Stripe style)
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const payment = payload.find((p) => p.dataKey === 'paymentReceived')?.value || 0;
    const credit = payload.find((p) => p.dataKey === 'creditGiven')?.value || 0;

    const formatCurrency = (val) =>
      new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
      }).format(val);

    return (
      <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-dropdown space-y-2 text-xs select-none min-w-[190px]">
        <div className="font-extrabold text-slate-900 border-b border-slate-100 pb-1.5 text-xs">
          {label}
        </div>
        <div className="flex items-center justify-between gap-4 text-emerald-600 font-bold">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm" />
            <span>Payments (Jama):</span>
          </div>
          <span className="tabular-nums font-extrabold">{formatCurrency(payment)}</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-rose-600 font-bold">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-sm" />
            <span>Credit (Udhar):</span>
          </div>
          <span className="tabular-nums font-extrabold">{formatCurrency(credit)}</span>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * Modern 2026 SaaS Cash Flow Trends Area Chart Component
 * Visualizes daily comparison between incoming payments and outgoing credit.
 */
export default function CashFlowChart({
  trends = [],
  days = 7,
  onDaysChange,
}) {
  const formatYAxis = (val) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
    return `₹${val}`;
  };

  return (
    <Card className="p-6 sm:p-8 space-y-6">
      {/* Chart Header & Day Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-0.5">
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            Weekly Cash Flow & Credit Velocity
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Daily comparison of Payments Received (Jama) vs Credit Given (Udhar)
          </p>
        </div>

        {/* 7 Days / 30 Days Toggle */}
        {onDaysChange && (
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/80 text-xs self-start sm:self-auto shadow-inner">
            <button
              type="button"
              onClick={() => onDaysChange(7)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                days === 7
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Last 7 Days
            </button>
            <button
              type="button"
              onClick={() => onDaysChange(30)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                days === 30
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Last 30 Days
            </button>
          </div>
        )}
      </div>

      {/* Recharts Area Chart Container */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={trends}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              {/* Gradient for Payments Received (Emerald) */}
              <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>

              {/* Gradient for Credit Given (Rose) */}
              <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F1F5F9" />

            <XAxis
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }}
              tickFormatter={formatYAxis}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Area 1: Payments In (Emerald) */}
            <Area
              type="monotone"
              dataKey="paymentReceived"
              stroke="#059669"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#emeraldGradient)"
              name="Payments (Jama)"
            />

            {/* Area 2: Credit Out (Rose) */}
            <Area
              type="monotone"
              dataKey="creditGiven"
              stroke="#E11D48"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#roseGradient)"
              name="Credit (Udhar)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-center gap-8 pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
          <span className="font-bold text-slate-800">Payments Received (Jama)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm" />
          <span className="font-bold text-slate-800">Credit Given (Udhar)</span>
        </div>
      </div>
    </Card>
  );
}
