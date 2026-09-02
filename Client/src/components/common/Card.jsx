import React from 'react';
import { motion } from 'framer-motion';

/**
 * Modern 2026 SaaS Large Floating Surface Card Component (Stripe / Mercury / Linear style)
 * Provides 18px-24px rounded corners, hairline micro-borders, ambient multi-layer drop shadows, and spring hover elevation.
 */
export default function Card({
  children,
  className = '',
  hoverable = false,
  padding = 'md',
  onClick,
  ...props
}) {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4 sm:p-5',
    md: 'p-5 sm:p-7',
    lg: 'p-6 sm:p-8 lg:p-9',
  };

  const Component = hoverable ? motion.div : 'div';
  const motionProps = hoverable
    ? {
        whileHover: { y: -3 },
        transition: { type: 'spring', stiffness: 400, damping: 25 },
      }
    : {};

  return (
    <Component
      onClick={onClick}
      className={`bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-card transition-shadow duration-200 ${
        hoverable ? 'hover:shadow-hover cursor-pointer hover:border-slate-300' : ''
      } ${paddingClasses[padding] || paddingClasses.md} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
}
