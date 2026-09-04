import React from 'react';

/**
 * Premium SaaS Skeleton Loading Component (Linear / Stripe style)
 * Provides clean shimmering placeholders matching exact 28px rounded card and table dimensions.
 */
export default function Skeleton({
  variant = 'text',
  className = '',
  count = 1,
  width,
  height,
}) {
  const baseClasses = 'animate-pulse bg-slate-100/90 rounded-2xl';

  const renderSingle = (key) => {
    switch (variant) {
      case 'circle':
        return (
          <div
            key={key}
            style={{ width: width || 44, height: height || 44 }}
            className={`${baseClasses} rounded-full ${className}`}
          />
        );

      case 'kpiCard':
        return (
          <div
            key={key}
            className="p-7 rounded-3xl bg-white shadow-card border border-slate-100/60 space-y-4 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 bg-slate-100 rounded-lg" />
              <div className="h-10 w-10 rounded-2xl bg-slate-100" />
            </div>
            <div className="space-y-2">
              <div className="h-9 w-36 bg-slate-200/60 rounded-xl" />
              <div className="h-3 w-28 bg-slate-100 rounded-lg" />
            </div>
            <div className="pt-3 border-t border-slate-100">
              <div className="h-5 w-24 bg-slate-100 rounded-full" />
            </div>
          </div>
        );

      case 'tableRow':
        return (
          <div
            key={key}
            className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-soft border border-slate-100/60 animate-pulse mb-2.5"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-slate-100" />
              <div className="space-y-1.5">
                <div className="h-4 w-36 bg-slate-100 rounded-lg" />
                <div className="h-3 w-24 bg-slate-100 rounded-lg" />
              </div>
            </div>
            <div className="space-y-1.5 flex flex-col items-end">
              <div className="h-4 w-24 bg-slate-100 rounded-lg" />
              <div className="h-3 w-16 bg-slate-100 rounded-lg" />
            </div>
          </div>
        );

      case 'card':
        return (
          <div
            key={key}
            style={{ width, height }}
            className={`p-8 rounded-3xl bg-white shadow-card border border-slate-100/60 space-y-4 animate-pulse ${className}`}
          >
            <div className="h-4 w-1/3 bg-slate-100 rounded-lg" />
            <div className="h-3 w-full bg-slate-100 rounded-lg" />
            <div className="h-3 w-2/3 bg-slate-100 rounded-lg" />
          </div>
        );

      case 'text':
      default:
        return (
          <div
            key={key}
            style={{ width, height }}
            className={`${baseClasses} h-4 w-full ${className}`}
          />
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => renderSingle(index))}
    </>
  );
}
