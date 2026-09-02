import React from 'react';
import { motion } from 'framer-motion';

/**
 * Modern 2026 SaaS High-End Button Component (Stripe / Mercury / Linear style)
 * Features subtle inner highlights, diffuse shadows, loading spinners, and spring physics.
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
    'relative inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  // High-End SaaS Semantic Variants
  const variants = {
    primary:
      'bg-brand-dark hover:bg-slate-800 text-white shadow-sm hover:shadow focus:ring-slate-900/40 border border-slate-700/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]',
    accent:
      'bg-brand-accent hover:bg-brand-accentHover text-white shadow-sm hover:shadow-glow focus:ring-brand-accent/40 border border-blue-500/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-sm hover:shadow focus:ring-slate-200',
    success:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md focus:ring-emerald-500/40 border border-emerald-500/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow-md focus:ring-rose-500/40 border border-rose-500/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]',
    warning:
      'bg-amber-600 hover:bg-amber-700 text-white shadow-sm hover:shadow-md focus:ring-amber-500/40 border border-amber-500/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-transparent focus:ring-slate-200',
    outline:
      'bg-transparent hover:bg-blue-50 text-brand-accent border border-brand-accent/40 focus:ring-brand-accent/30',
    whatsapp:
      'bg-[#16A34A] hover:bg-[#15803D] text-white shadow-sm hover:shadow-md focus:ring-green-500/40 border border-green-500/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]',
  };

  // Size scales with modern touch padding
  const sizes = {
    sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
    md: 'h-10 px-4 text-xs sm:text-sm rounded-xl gap-2',
    lg: 'h-12 px-6 text-sm sm:text-base rounded-2xl gap-2.5',
    icon: 'h-10 w-10 p-0 rounded-xl justify-center',
    iconSm: 'h-8 w-8 p-0 rounded-lg justify-center',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
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
    </motion.button>
  );
}
