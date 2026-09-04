import React from 'react';
import { Layers } from 'lucide-react';
import Button from './Button';

/**
 * Premium SaaS Empty State Component
 * Clean icon container with soft tints, bold typography, and clear action CTA.
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
      className={`py-16 px-8 flex flex-col items-center justify-center text-center space-y-4 bg-white rounded-3xl shadow-card border border-slate-100 ${className}`}
    >
      {/* Icon Container */}
      <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100 shadow-soft">
        <Icon className="w-7 h-7" />
      </div>

      <div className="max-w-sm space-y-1.5">
        <h4 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
          {title}
        </h4>
        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">{description}</p>
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
