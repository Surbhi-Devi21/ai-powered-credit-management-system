import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

/**
 * Premium SaaS Minimalist Pagination Component
 * Displays clean slice range, total records count, and accessible navigation buttons.
 */
export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 15,
  onPageChange,
  className = '',
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 select-none ${className}`}
    >
      {/* Items range counter */}
      <div className="text-xs text-slate-500 font-medium">
        Showing <span className="font-extrabold text-slate-900 tabular-nums">{startItem}</span> to{' '}
        <span className="font-extrabold text-slate-900 tabular-nums">{endItem}</span> of{' '}
        <span className="font-extrabold text-slate-900 tabular-nums">{totalItems}</span> records
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          icon={ChevronLeft}
        >
          Previous
        </Button>

        <div className="hidden sm:flex items-center gap-1 px-3.5 py-1.5 text-xs font-extrabold text-slate-700 bg-white border border-slate-100 rounded-full shadow-soft">
          Page {currentPage} of {totalPages}
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          icon={ChevronRight}
          iconPosition="right"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
