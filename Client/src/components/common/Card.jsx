import React from 'react';
import { motion } from 'framer-motion';

/**
 * Premium SaaS White Floating Card Component (Stripe / Linear / Mercury style)
 * Features 28px rounded corners (rounded-3xl / rounded-[28px]), pure white background,
 * very soft shadow, generous padding, and a smooth 300ms translateY hover elevation.
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
    sm: 'p-5 sm:p-6',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-10',
  };

  const Component = hoverable ? motion.div : 'div';
  const motionProps = hoverable
    ? {
        whileHover: { y: -3 },
        transition: { duration: 0.3, ease: 'easeOut' },
      }
    : {};

  return (
    <Component
      onClick={onClick}
      className={`bg-white rounded-3xl shadow-card border border-slate-100/80 transition-all duration-300 ${
        hoverable ? 'hover:shadow-hover cursor-pointer' : ''
      } ${paddingClasses[padding] || paddingClasses.md} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
}
