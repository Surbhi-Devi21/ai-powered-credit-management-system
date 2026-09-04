import React from 'react';
import { motion } from 'framer-motion';

/**
 * Premium SaaS Rounded-Full Button Component (Stripe / Linear / Fintech style)
 * Features rounded-full curvature, generous heights, icon+text alignment, soft shadows, and hover lift.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  // Base styling with refined typography and micro-interactions
  const baseStyles =
    'relative inline-flex items-center justify-center font-bold transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-full cursor-pointer tracking-tight';

  // High-End SaaS Semantic Variants
  const variants = {
    primary:
      'bg-slate-900 hover:bg-slate-800 text-white shadow-button hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0',
    accent:
      'bg-blue-600 hover:bg-blue-700 text-white shadow-button hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/80 shadow-button hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0',
    success:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-button hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-button hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0',
    warning:
      'bg-amber-500 hover:bg-amber-600 text-white shadow-button hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-transparent',
    outline:
      'bg-transparent hover:bg-blue-50 text-blue-600 border border-blue-200 hover:border-blue-400',
    whatsapp:
      'bg-[#16A34A] hover:bg-[#15803D] text-white shadow-button hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0',
    creditGradient:
      'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-button hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0',
    paymentGradient:
      'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-button hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0',
  };

  // Size scales with modern touch padding & generous heights
  const sizes = {
    sm: 'h-9 px-4 text-xs gap-1.5',
    md: 'h-11 px-5 text-xs sm:text-sm gap-2',
    lg: 'h-12 sm:h-13 px-7 text-sm sm:text-base gap-2.5',
    icon: 'h-11 w-11 p-0 justify-center',
    iconSm: 'h-9 w-9 p-0 justify-center',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {!isLoading && Icon && iconPosition === 'left' && (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      )}

      <span>{children}</span>

      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      )}
    </button>
  );
}
