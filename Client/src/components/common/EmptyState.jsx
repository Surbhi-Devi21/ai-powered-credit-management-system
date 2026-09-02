import React from 'react';
import { Layers } from 'lucide-react';
import Button from './Button';

/**
 * Modern 2026 SaaS Empty State Component (Notion / Stripe style)
 * Clean icon badge with frosted gradient background, bold typography, and clear CTA.
 */
export default function EmptyState({
  icon: Icon = Layers,
  title = 'No records found',
  description = 'There are no entries to display at this moment.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`py-14 px-6 flex flex-col items-center justify-center text-center space-y-4 bg-white rounded-3xl border border-dashed border-slate-200 shadow-card ${className}`}
    >
      {/* Frosted Icon Circle */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 text-slate-500 flex items-center justify-center border border-slate-200/80 shadow-sm">
        <Icon className="w-6 h-6" />
      </div>

      <div className="max-w-sm space-y-1">
        <h4 className="text-base font-bold text-slate-900 tracking-tight">
          {title}
        </h4>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <div className="pt-2">
          <Button variant="primary" size="md" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
